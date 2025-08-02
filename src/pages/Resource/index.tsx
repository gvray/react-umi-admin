import { PageContainer } from '@/components';
import StatusTag from '@/components/StatusTag';
import AdvancedSearchForm from '@/components/TablePro/components/AdvancedSearchForm';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Flex, Space, Table, Tooltip } from 'antd';
import { useRef, useState } from 'react';
import UpdateForm, { UpdateFormRef } from './UpdateForm';
import { useResourceModel } from './model';

const ResourcePage = () => {
  const updateFormRef = useRef<UpdateFormRef>(null);
  const [showSearch, setShowSearch] = useState(false);
  const { data, loading, reload } = useResourceModel();
  // 高级搜索参数
  const paramsRef = useRef<Record<string, any>>({});
  const handleAdd = async () => {
    updateFormRef.current?.show('添加资源');
  };
  // 高级搜索
  const handleAdvancedQuery = (values: Record<string, any>) => {
    const newParams = { ...paramsRef.current, ...values };
    paramsRef.current = newParams;
  };
  const handleOk = () => {
    reload();
  };
  const columns = [
    {
      title: '资源名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
    },
    {
      title: '资源类型',
      dataIndex: 'type',
      key: 'type',
      render: (resourceType: string) => {
        switch (resourceType) {
          case 'DIRECTORY':
            return '目录';
          case 'MENU':
            return '菜单';
          case 'BUTTON':
            return '按钮';
          case 'API':
            return '接口';
          case 'Data':
            return '数据';
          default:
            return '未知';
        }
      },
    },
    {
      title: '资源路径',
      dataIndex: 'path',
      key: 'path',
    },
    {
      title: '资源权限',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      advancedSearch: {
        type: 'SELECT',
        value: [
          { label: '停用', value: 0 },
          { label: '正常', value: 1 },
        ],
      },
      render: (status: number) => {
        return <StatusTag status={status} />;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
    },
  ];
  return (
    <PageContainer>
      {showSearch && !!columns && (
        <AdvancedSearchForm
          searchFields={columns.filter(
            (item: any) => item.advancedSearch !== undefined,
          )}
          onSearchFinish={handleAdvancedQuery}
          resetSearch={() => {
            // 重制高级搜索参数
            paramsRef.current = {};
            reload();
          }}
        ></AdvancedSearchForm>
      )}
      <Flex justify="space-between" align="center">
        <Space style={{ marginBottom: 16 }}>
          {' '}
          <Button type="primary" onClick={handleAdd}>
            新增资源
          </Button>
        </Space>
        <Space>
          <Tooltip title={showSearch ? '隐藏搜索' : '显示搜索'}>
            <Button
              shape="circle"
              icon={<SearchOutlined />}
              onClick={() => setShowSearch(!showSearch)}
            />
          </Tooltip>
          <Tooltip title="刷新">
            <Button
              shape="circle"
              onClick={() => reload()}
              icon={<ReloadOutlined />}
            />
          </Tooltip>
        </Space>
      </Flex>
      <Table
        rowKey={'resourceId'}
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
      {/* 用户新增修改弹出层 */}
      <UpdateForm ref={updateFormRef} onOk={handleOk} />
    </PageContainer>
  );
};

export default ResourcePage;

import { AntIcon, DateTimeFormat, PageContainer } from '@/components';
import StatusTag from '@/components/StatusTag';
import AdvancedSearchForm from '@/components/TablePro/components/AdvancedSearchForm';
import { deleteResource, getResource } from '@/services/resource';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Flex, Modal, Space, Table, Tag, Tooltip, message } from 'antd';
import { useRef, useState } from 'react';
import UpdateForm, { UpdateFormRef } from './UpdateForm';
import { useResourceModel } from './model';

export interface ResourceMeta {
  resourceId: string;
  name: string;
  type: string;
  parentId: string | null;
  children?: ResourceMeta[]; // 用于前端展示 tree 结构
  // 可选字段
  path?: string; // 菜单路由
  method?: string; // API 方法 (如 GET, POST)
  code?: string; // 权限标识
  sort?: number; // 排序
  icon?: string; // 图标（常用于菜单）
  [key: string]: any; // 允许扩展
}
const ResourcePage = () => {
  const updateFormRef = useRef<UpdateFormRef>(null);
  const [showSearch, setShowSearch] = useState(true);
  const { data, loading, reload } = useResourceModel();
  // 高级搜索参数
  const paramsRef = useRef<Record<string, any>>({});
  const handleAdd = async () => {
    updateFormRef.current?.show('添加资源');
  };

  const handleDelete = async (record: ResourceMeta) => {
    Modal.confirm({
      title: `系统提示`,
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除资源编号为"${record.resourceId}"的数据项？`,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        return deleteResource(record.resourceId)
          .then(() => {
            reload();
            message.success(`删除成功`);
          })
          .catch(() => {});
      },
    });
  };

  const handleUpdate = async (record: ResourceMeta) => {
    const resourceId = record.resourceId;
    try {
      const msg = await getResource(resourceId);
      updateFormRef.current?.show('修改资源', {
        ...msg.data,
      });
    } catch (error) {}
  };
  // 高级搜索
  const handleAdvancedQuery = (values: Record<string, any>) => {
    const newParams = { ...paramsRef.current, ...values };
    paramsRef.current = newParams;
    reload(newParams);
  };
  const handleOk = () => {
    reload();
  };
  const columns = [
    {
      title: '资源名称',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      advancedSearch: {
        type: 'INPUT',
      },
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      render: (icon: string) => {
        return icon ? <AntIcon icon={icon} /> : '-';
      },
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
      render: (code: string) => {
        return <Tag color="blue">{code}</Tag>;
      },
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
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (time: string) => {
        return <DateTimeFormat value={time} />;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (record: ResourceMeta) => {
        return (
          <Space size={0}>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleUpdate(record)}
            >
              修改
            </Button>
            <Button
              danger
              type="link"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            >
              删除
            </Button>
          </Space>
        );
      },
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
        scroll={{ x: 'max-content' }}
        rowKey={'resourceId'}
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
      {/* 资源新增修改弹出层 */}
      <UpdateForm ref={updateFormRef} onOk={handleOk} />
    </PageContainer>
  );
};

export default ResourcePage;

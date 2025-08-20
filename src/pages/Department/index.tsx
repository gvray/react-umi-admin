import { DateTimeFormat, PageContainer } from '@/components';
import StatusTag from '@/components/StatusTag';
import AdvancedSearchForm from '@/components/TablePro/components/AdvancedSearchForm';
import { deleteDepartment, getDepartment } from '@/services/department';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Flex, Modal, Space, Table, Tooltip, message } from 'antd';
import { useRef } from 'react';
import UpdateForm, { UpdateFormRef } from './UpdateForm';
import { useDepartmentModel } from './model';

export interface DepartmentMeta {
  departmentId: string;
  name: string;
  parentId: string | null;
  code: string;
  description: string;
  level: number;
  sort: number;
  managerId: string;
  status: string;
  phone: string;
  children?: DepartmentMeta[]; // 用于前端展示 tree 结构
  // 可选字段
  [key: string]: any; // 允许扩展
}
const DepartmentPage = () => {
  const updateFormRef = useRef<UpdateFormRef>(null);
  const { data, loading, reload, showSearch, setShowSearch, paramsRef } =
    useDepartmentModel();

  const handleAdd = async () => {
    updateFormRef.current?.show('添加部门');
  };

  const handleDelete = async (record: DepartmentMeta) => {
    Modal.confirm({
      title: `系统提示`,
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除部门编号为"${record.departmentId}"的数据项？`,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        return deleteDepartment(record.departmentId)
          .then(() => {
            reload();
            message.success(`删除成功`);
          })
          .catch(() => {});
      },
    });
  };

  const handleUpdate = async (record: DepartmentMeta) => {
    const departmentId = record.departmentId;
    try {
      const msg = await getDepartment(departmentId);
      updateFormRef.current?.show('修改部门', {
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
      title: '部门名称',
      dataIndex: 'name',
      fixed: 'left',
      advancedSearch: {
        type: 'INPUT',
      },
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
    },
    {
      title: '状态',
      dataIndex: 'status',
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
      render: (time: string) => {
        return <DateTimeFormat value={time} />;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (record: DepartmentMeta) => {
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
            新增部门
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
        expandable={{
          defaultExpandAllRows: true,
        }}
        scroll={{ x: 'max-content' }}
        rowKey={'departmentId'}
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
      {/* 部门新增修改弹出层 */}
      <UpdateForm ref={updateFormRef} onOk={handleOk} />
    </PageContainer>
  );
};

export default DepartmentPage;

import { DateTimeFormat, PageContainer, TablePro } from '@/components';
import StatusTag from '@/components/StatusTag';
import { TableProRef } from '@/components/TablePro';

import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Button, Modal, Space, message } from 'antd';
import { useRef } from 'react';
import UpdateForm, { UpdateFormRef } from './UpdateForm';
import { getDepartmentColumns } from './columns';
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
  const { fetchDepartmentDetail, removeDepartment, fetchDepartmentTree } =
    useDepartmentModel();
  const tableProRef = useRef<TableProRef>(null);

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
        return removeDepartment(record.departmentId)
          .then(() => {
            tableProRef.current?.reload();
            message.success(`删除成功`);
          })
          .catch(() => {});
      },
    });
  };

  const handleUpdate = async (record: DepartmentMeta) => {
    const departmentId = record.departmentId;
    try {
      const msg: any = await fetchDepartmentDetail(departmentId);
      updateFormRef.current?.show('修改部门', {
        ...msg,
      });
    } catch (error) {}
  };
  const handleOk = () => {
    tableProRef.current?.reload();
  };
  let columns = getDepartmentColumns().map((column: any) => {
    if (column.dataIndex === 'status') {
      return {
        ...column,
        render: (status: string | number) => (
          <StatusTag
            value={status}
            options={[
              { label: '禁用', value: 0 },
              { label: '启用', value: 1 },
            ]}
          />
        ),
      };
    }
    if (column.dataIndex === 'createdAt') {
      return {
        ...column,
        render: (time: string) => <DateTimeFormat value={time} />,
      };
    }
    return column;
  });
  columns = [
    ...columns,
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
      <TablePro
        tree={true}
        ref={tableProRef}
        rowKey={'departmentId'}
        columns={columns as any}
        request={fetchDepartmentTree}
        expandable={{ defaultExpandAllRows: true }}
        toolbarRender={() => (
          <Button type="primary" onClick={handleAdd}>
            新增部门
          </Button>
        )}
      />
      {/* 部门新增修改弹出层 */}
      <UpdateForm ref={updateFormRef} onOk={handleOk} />
    </PageContainer>
  );
};

export default DepartmentPage;

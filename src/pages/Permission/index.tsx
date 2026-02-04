import { AntIcon, DateTimeFormat, PageContainer, TablePro } from '@/components';
import { TableProRef } from '@/components/TablePro';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Button, Modal, Space, message } from 'antd';
import { useRef } from 'react';
import UpdateForm, { UpdateFormRef } from './UpdateForm';
import { getPermissionColumns } from './columns';
import { useResourceModel } from './model';

export interface PermissionMeta {
  permissionId: string;
  name: string;
  action: string;
  code?: string;
  children?: PermissionMeta[];
  [key: string]: any;
}
const ResourcePage = () => {
  const updateFormRef = useRef<UpdateFormRef>(null);
  const tableProRef = useRef<TableProRef>(null);
  const { getPermissions, getDetail, deleteItem } = useResourceModel();

  const handleAdd = async () => {
    updateFormRef.current?.show('添加权限');
  };

  const handleDelete = async (record: PermissionMeta) => {
    Modal.confirm({
      title: `系统提示`,
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除权限编号为"${record.permissionId}"的数据项？`,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        return deleteItem(record.permissionId)
          .then(() => {
            tableProRef.current?.reload();
            message.success(`删除成功`);
          })
          .catch(() => {});
      },
    });
  };

  const handleUpdate = async (record: PermissionMeta) => {
    const permissionId = record.permissionId;
    try {
      const msg: any = await getDetail(permissionId);
      updateFormRef.current?.show('修改权限', {
        ...msg,
      });
    } catch (error) {}
  };
  const handleOk = () => {
    tableProRef.current?.reload();
  };
  let columns = getPermissionColumns().map((column: any) => {
    if (column.dataIndex === 'icon') {
      return {
        ...column,
        render: (_: any, record: any) => {
          const icon = record?.menuMeta?.icon;
          return icon ? <AntIcon icon={icon} /> : '-';
        },
      };
    }
    if (column.dataIndex === 'action') {
      return {
        ...column,
        render: (action: string) => {
          switch (action) {
            case 'view':
              return '查看';
            case 'create':
              return '新增';
            case 'update':
              return '修改';
            case 'delete':
              return '删除';
            case 'export':
              return '导出';
            case 'import':
              return '导入';
            default:
              return '未知';
          }
        },
      };
    }
    if (column.dataIndex === 'code') {
      return {
        ...column,
        render: (code: string) => code || '-',
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
      render: (record: PermissionMeta) => {
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
        rowKey={'permissionId'}
        columns={columns as any}
        request={getPermissions}
        expandable={{
          rowExpandable: (record) =>
            record.children && record.children.length > 0,
          defaultExpandAllRows: true,
        }}
        toolbarRender={() => (
          <Button type="primary" onClick={handleAdd}>
            新增权限
          </Button>
        )}
      />
      {/* 权限新增修改弹出层 */}
      <UpdateForm ref={updateFormRef} onOk={handleOk} />
    </PageContainer>
  );
};

export default ResourcePage;

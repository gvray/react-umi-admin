import { DateTimeFormat, PageContainer, TablePro } from '@/components';
import StatusTag from '@/components/StatusTag';
import { TableProRef } from '@/components/TablePro';
import {
  DatabaseOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  KeyOutlined,
  MoreOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Modal, Space, Typography, message } from 'antd';
import { useRef, useState } from 'react';
import { useNavigate } from 'umi';
import AuthDataScopeModal from './AuthDataScopeModal';
import UpdateForm, { UpdateFormRef } from './UpdateForm';
import { getRoleColumns } from './columns';
import { useRoleModel } from './model';

const { Paragraph } = Typography;

interface DataType {
  createBy: string;
  createdAt: string;
  updateBy?: string;
  updatedAt?: string;
  remark: string;
  roleId: string;
  name: string;
  code: string;
  description: string;
  status: string;
}

const UserPage = () => {
  const navigate = useNavigate();
  const updateFormRef = useRef<UpdateFormRef>(null);
  const tableProRef = useRef<TableProRef>(null);
  const { getList, getDetail, deleteItem } = useRoleModel();

  // 数据权限弹窗状态
  const [dataPermissionVisible, setDataPermissionVisible] = useState(false);
  const [currentRole, setCurrentRole] = useState<DataType | null>(null);

  const tableReload = () => {
    tableProRef.current?.reload();
  };

  const handleAdd = async () => {
    updateFormRef.current?.show('添加角色');
  };

  const handleDelete = async (record: DataType) => {
    Modal.confirm({
      title: `系统提示`,
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除角色编号为"${record.roleId}"的数据项？`,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        return deleteItem(record.roleId)
          .then(() => {
            tableReload();
            message.success(`删除成功`);
          })
          .catch(() => {});
      },
    });
  };

  const handleUpdate = async (record: DataType) => {
    const roleId = record.roleId;
    try {
      const data = await getDetail(roleId);
      updateFormRef.current?.show('修改角色', {
        ...data,
      });
    } catch (error) {}
  };

  const handleOk = () => {
    tableReload();
  };

  const handleAuthUser = (record: DataType) => {
    navigate(`/system/role-auth/user/${record.roleId}`);
  };

  const handleAuthPermission = (record: DataType) => {
    navigate(`/system/role-auth/permission/${record.roleId}`);
  };

  const handleAuthDataPermission = (record: DataType) => {
    setCurrentRole(record);
    setDataPermissionVisible(true);
  };

  const handleDataPermissionSuccess = () => {
    tableReload();
  };

  const handleDataPermissionCancel = () => {
    setDataPermissionVisible(false);
    setCurrentRole(null);
  };

  // 更多操作菜单
  const getMoreMenu = (record: DataType): MenuProps['items'] => [
    {
      key: 'permission',
      icon: <KeyOutlined />,
      label: '分配权限',
      onClick: () => handleAuthPermission(record),
    },
    {
      key: 'dataPermission',
      icon: <DatabaseOutlined />,
      label: '数据权限',
      onClick: () => handleAuthDataPermission(record),
    },
    {
      key: 'user',
      icon: <UserOutlined />,
      label: '分配用户',
      onClick: () => handleAuthUser(record),
    },
  ];

  let columns = getRoleColumns().map((column: any) => {
    if (column.dataIndex === 'roleId') {
      return {
        ...column,
        render: (roleId: string) => (
          <Paragraph ellipsis copyable style={{ width: '100px' }}>
            {roleId}
          </Paragraph>
        ),
      };
    }
    if (column.dataIndex === 'status') {
      return {
        ...column,
        render: (status: number) => <StatusTag status={status} />,
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
      render: (record: any) => {
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
            <Dropdown
              menu={{ items: getMoreMenu(record) }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Button type="link" icon={<MoreOutlined />}>
                更多
              </Button>
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <TablePro
        rowKey={'roleId'}
        toolbarRender={() => (
          <>
            <Button type="primary" onClick={handleAdd}>
              新增角色
            </Button>
          </>
        )}
        ref={tableProRef}
        columns={columns as any}
        request={getList}
      />
      {/* 角色新增修改弹出层 */}
      <UpdateForm ref={updateFormRef} onOk={handleOk} />

      {/* 数据权限分配弹窗 */}
      {currentRole && (
        <AuthDataScopeModal
          visible={dataPermissionVisible}
          roleId={currentRole.roleId}
          roleName={currentRole.name}
          onCancel={handleDataPermissionCancel}
          onSuccess={handleDataPermissionSuccess}
        />
      )}
    </PageContainer>
  );
};
export default UserPage;

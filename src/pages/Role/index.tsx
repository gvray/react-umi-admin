import { DateTimeFormat, PageContainer, TablePro } from '@/components';
import StatusTag from '@/components/StatusTag';
import { TableProRef } from '@/components/TablePro';
import { AdvancedSearchItem } from '@/components/TablePro/components/AdvancedSearchForm';
import { deleteRole, getRole, listRole } from '@/services/role';
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
import { ColumnProps } from 'antd/es/table';
import { useRef, useState } from 'react';
import { useNavigate } from 'umi';
import AuthDataScopeModal from './AuthDataScopeModal';
import UpdateForm, { UpdateFormRef } from './UpdateForm';

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

interface UserColumnProps<T, U> extends ColumnProps<T> {
  advancedSearch?: AdvancedSearchItem<U>;
}

const UserPage = () => {
  const navigate = useNavigate();
  const updateFormRef = useRef<UpdateFormRef>(null);
  const tableProRef = useRef<TableProRef>(null);

  // 数据权限弹窗状态
  const [dataPermissionVisible, setDataPermissionVisible] = useState(false);
  const [currentRole, setCurrentRole] = useState<DataType | null>(null);

  const handleTableReload = () => {
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
        return deleteRole(record.roleId)
          .then(() => {
            handleTableReload();
            message.success(`删除成功`);
          })
          .catch(() => {});
      },
    });
  };

  const handleUpdate = async (record: DataType) => {
    const roleId = record.roleId;
    try {
      const msg = await getRole(roleId as any);
      updateFormRef.current?.show('修改角色', {
        ...msg.data,
      });
    } catch (error) {}
  };

  const handleOk = () => {
    handleTableReload();
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
    handleTableReload();
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

  const columns: UserColumnProps<DataType, Record<string, string | number>>[] =
    [
      {
        title: '角色编号',
        dataIndex: 'roleId',
        key: 'roleId',
        render: (roleId: string) => {
          return (
            <Paragraph ellipsis copyable style={{ width: '100px' }}>
              {roleId}
            </Paragraph>
          );
        },
      },
      {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name',
        advancedSearch: { type: 'INPUT' },
      },
      {
        title: '角色标识',
        dataIndex: 'roleKey',
        key: 'roleKey',
      },
      {
        title: '显示顺序',
        dataIndex: 'sort',
        key: 'sort',
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
            { label: '审核中', value: 2 },
            { label: '封禁', value: 3 },
          ],
        },
        render: (status: number) => {
          return <StatusTag status={status} />;
        },
      },
      {
        title: '创建时间',
        key: 'createdAt',
        dataIndex: 'createdAt',
        render: (time: string) => {
          return <DateTimeFormat value={time} />;
        },
        advancedSearch: {
          type: 'TIME_RANGE',
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (record) => {
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
        columns={columns}
        request={listRole}
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

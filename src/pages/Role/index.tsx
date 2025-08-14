import { PageContainer, TablePro } from '@/components';
import StatusTag from '@/components/StatusTag';
import { TableProRef } from '@/components/TablePro';
import { AdvancedSearchItem } from '@/components/TablePro/components/AdvancedSearchForm';
import { deleteRole, getRole, listRole } from '@/services/role';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  KeyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Modal, Space, Typography, message } from 'antd';
import { ColumnProps } from 'antd/es/table';
import dayjs from 'dayjs';
import { useRef } from 'react';
import { useNavigate } from 'umi';
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
      const msg = await getRole(roleId);
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
          return dayjs(time).format('YYYY MM-DD');
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
                type="link"
                icon={<KeyOutlined />}
                onClick={() => handleAuthPermission(record)}
              >
                分配权限
              </Button>
              <Button
                type="link"
                icon={<UserOutlined />}
                onClick={() => handleAuthUser(record)}
              >
                分配用户
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
    </PageContainer>
  );
};
export default UserPage;

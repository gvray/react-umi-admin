import {
  AuthButton,
  DateTimeFormat,
  PageContainer,
  TablePro,
} from '@/components';
import StatusTag from '@/components/StatusTag';
import { TableProRef } from '@/components/TablePro';
import { AdvancedSearchItem } from '@/components/TablePro/components/AdvancedSearchForm';
import useDict from '@/hooks/useDict';
import { deleteUser, getUser, listUser } from '@/services/user';
import { logger } from '@/utils';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Modal, Space, Typography, message } from 'antd';
import { ColumnProps } from 'antd/es/table';
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
  userId: string;
  username: string;
  nickname: string;
  email: string;
  phone: string;
  sex: string;
  status: string;
  delFlag: string;
}

interface UserColumnProps<T, U> extends ColumnProps<T> {
  advancedSearch?: AdvancedSearchItem<U>;
}

const UserPage = () => {
  const navigate = useNavigate();
  const updateFormRef = useRef<UpdateFormRef>(null);
  const tableProRef = useRef<TableProRef>(null);
  const dict = useDict<{
    user_status: any[];
    user_gender: any[];
  }>(['user_status', 'user_gender']);

  const handleTableReload = () => {
    tableProRef.current?.reload();
  };

  const handleAdd = async () => {
    updateFormRef.current?.show('添加用户');
  };

  const handleDelete = async (record: DataType) => {
    Modal.confirm({
      title: `系统提示`,
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除用户编号为"${record.userId}"的数据项？`,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        return deleteUser(record.userId)
          .then(() => {
            handleTableReload();
            message.success(`删除成功`);
          })
          .catch(() => {});
      },
    });
  };

  const handleUpdate = async (record: DataType) => {
    const userId = record.userId;
    try {
      const res = await getUser(userId);
      const data = {
        ...res.data,
        positionIds: res.data.positions?.map((item: any) => item.positionId),
        roleIds: res.data.roles?.map((item: any) => item.roleId),
        departmentId: res.data.department?.departmentId,
      };
      updateFormRef.current?.show('修改用户', data);
    } catch (error) {
      logger.error(error as string);
    }
  };

  const handleOk = () => {
    handleTableReload();
  };

  const handleAuthRole = (userId: string) => {
    navigate(`/system/user-auth/role/${userId}`);
  };

  const columns: UserColumnProps<DataType, Record<string, string | number>>[] =
    [
      {
        title: '用户编号',
        dataIndex: 'userId',
        key: 'userId',
        render: (userId: string) => {
          return (
            <Paragraph ellipsis copyable style={{ width: '100px' }}>
              {userId}
            </Paragraph>
          );
        },
      },
      {
        title: '登陆账号',
        dataIndex: 'username',
        key: 'username',
        advancedSearch: { type: 'INPUT' },
      },
      {
        title: '用户名称',
        dataIndex: 'nickname',
        key: 'nickname',
      },
      {
        title: '手机号码',
        key: 'phone',
        dataIndex: 'phone',
        advancedSearch: { type: 'INPUT' },
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        advancedSearch: {
          type: 'SELECT',
          value: dict['user_status'],
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
              <AuthButton
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleUpdate(record)}
                perms={['system:user:update']}
              >
                修改
              </AuthButton>
              <AuthButton
                danger
                type="link"
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record)}
                perms={['system:user:delete']}
              >
                删除
              </AuthButton>
              <AuthButton
                type="link"
                icon={<UserOutlined />}
                onClick={() => handleAuthRole(record.userId)}
                perms={['system:user:update']}
              >
                分配角色
              </AuthButton>
            </Space>
          );
        },
      },
    ];

  return (
    <PageContainer>
      <TablePro
        rowKey={'userId'}
        toolbarRender={() => (
          <>
            <AuthButton
              type="primary"
              onClick={handleAdd}
              perms={['system:user:create']}
            >
              新增用户
            </AuthButton>
          </>
        )}
        ref={tableProRef}
        columns={columns}
        request={listUser}
      />
      {/* 用户新增修改弹出层 */}
      <UpdateForm ref={updateFormRef} dict={dict} onOk={handleOk} />
    </PageContainer>
  );
};
export default UserPage;

import {
  AuthButton,
  DateTimeFormat,
  PageContainer,
  TablePro,
} from '@/components';
import StatusTag from '@/components/StatusTag';
import { TableProRef } from '@/components/TablePro';
import useDict from '@/hooks/useDict';
import { logger } from '@/utils';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Modal, Space, Typography, message } from 'antd';
import { useRef } from 'react';
import { useNavigate } from 'umi';
import UpdateForm, { UpdateFormRef } from './UpdateForm';
import { getUserColumns } from './columns';
import { useUserModel } from './model';

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

const UserPage = () => {
  const navigate = useNavigate();
  const updateFormRef = useRef<UpdateFormRef>(null);
  const tableProRef = useRef<TableProRef>(null);
  const dict = useDict<{
    user_status: { label: string; value: number }[];
    user_gender: { label: string; value: number }[];
  }>(['user_status', 'user_gender']);
  const { fetchUserList, fetchUserDetail, removeUser } = useUserModel();

  const tableReload = () => {
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
        return removeUser(record.userId)
          .then(() => {
            tableReload();
            message.success(`删除成功`);
          })
          .catch(() => {});
      },
    });
  };

  const handleUpdate = async (record: DataType) => {
    const userId = record.userId;
    try {
      const res: any = await fetchUserDetail(userId);
      const data = {
        ...res,
        positionIds: res.positions?.map((item: any) => item.positionId),
        roleIds: res.roles?.map((item: any) => item.roleId),
        departmentId: res.department?.departmentId,
      };
      updateFormRef.current?.show('修改用户', data);
    } catch (error) {
      logger.error(error as string);
    }
  };

  const handleOk = () => {
    tableReload();
  };

  const handleAuthRole = (userId: string) => {
    navigate(`/system/user-auth/role/${userId}`);
  };

  let columns = getUserColumns().map((column: any) => {
    if (column.dataIndex === 'userId') {
      return {
        ...column,
        render: (userId: string) => (
          <Paragraph ellipsis copyable style={{ width: '100px' }}>
            {userId}
          </Paragraph>
        ),
      };
    }
    if (column.dataIndex === 'status') {
      return {
        ...column,
        advancedSearch: {
          type: 'SELECT',
          value: dict['user_status'],
        },
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
        columns={columns as any}
        request={fetchUserList}
      />
      {/* 用户新增修改弹出层 */}
      <UpdateForm ref={updateFormRef} dict={dict} onOk={handleOk} />
    </PageContainer>
  );
};
export default UserPage;

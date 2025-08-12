import { DateTimeFormat, PageContainer, TablePro } from '@/components';
import StatusTag from '@/components/StatusTag';
import { TableProRef } from '@/components/TablePro';
import { AdvancedSearchItem } from '@/components/TablePro/components/AdvancedSearchForm';
import { deleteUser, getUser, listUser } from '@/services/user';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Modal, Space, Typography, message } from 'antd';
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
  userId: number;
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
        positionIds: res.data.positions.map((item: any) => item.positionId),
        roleIds: res.data.roles.map((item: any) => item.roleId),
        departmentId: res.data.department.departmentId,
      };
      updateFormRef.current?.show('修改用户', data);
    } catch (error) {}
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
              <Button
                type="link"
                icon={<UserOutlined />}
                onClick={() => handleAuthRole(record.userId)}
              >
                分配角色
              </Button>
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
            <Button type="primary" onClick={handleAdd}>
              新增用户
            </Button>
          </>
        )}
        ref={tableProRef}
        columns={columns}
        request={listUser}
      />
      {/* 用户新增修改弹出层 */}
      <UpdateForm ref={updateFormRef} onOk={handleOk} />
    </PageContainer>
  );
};
export default UserPage;

import { PageContainer, TablePro } from '@/components';
import { TableProRef } from '@/components/TablePro';
import { AdvancedSearchItem } from '@/components/TablePro/components/AdvancedSearchForm';
import { deleteUser, getUser, listUser } from '@/services/user';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Button, Modal, Space, Tag, message } from 'antd';
import { ColumnProps } from 'antd/es/table';
import dayjs from 'dayjs';
import { useRef } from 'react';
import UpdateForm, { UpdateFormRef } from './UpdateForm';

interface DataType {
  createBy: string;
  createTime: string;
  updateBy?: string;
  updateTime?: string;
  remark: string;
  userId: number;
  userName: string;
  nickName: string;
  email: string;
  phoneNumber: string;
  sex: string;
  status: string;
  delFlag: string;
}

interface UserColumnProps<T, U> extends ColumnProps<T> {
  advancedSearch?: AdvancedSearchItem<U>;
}

const UserPage = () => {
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
      const msg = await getUser(userId);
      updateFormRef.current?.show('修改用户', {
        ...msg.data,
      });
    } catch (error) {}
  };

  const handleOk = () => {
    handleTableReload();
  };

  const columns: UserColumnProps<DataType, Record<string, string>>[] = [
    {
      title: '用户编号',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
      key: 'userName',
      advancedSearch: { type: 'INPUT' },
    },
    {
      title: '用户昵称',
      dataIndex: 'nickName',
      key: 'nickName',
    },
    {
      title: '手机号码',
      key: 'phoneNumber',
      dataIndex: 'phoneNumber',
      advancedSearch: { type: 'INPUT' },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      advancedSearch: {
        type: 'SELECT',
        value: [
          { label: '正常', value: '0' },
          { label: '停用', value: '1' },
        ],
      },
      render: (status: string) => {
        return status === '0' ? (
          <Tag color="success">正常</Tag>
        ) : (
          <Tag color="error">停用</Tag>
        );
      },
    },
    {
      title: '创建时间',
      key: 'createTime',
      dataIndex: 'createTime',
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

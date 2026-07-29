import {
  AuthButton,
  CopyId,
  DateTimeFormat,
  Icon,
  PageContainer,
  TablePro,
} from '@/components';
import { TableProRef } from '@/components/TablePro';
import { PERM } from '@/constants';
import { useFeedback } from '@/hooks';
import { callRef, logger } from '@/utils';
import { Modal, Space, Table, Tag, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';
import { getOnlineUserColumns } from './columns';
import { useOnlineUserModel } from './model';

const OnlineUserPage: React.FC = () => {
  const tableProRef = useRef<TableProRef>(null);
  const {
    fetchOnlineUserList,
    fetchUserSessions,
    forceLogoutUser,
    forceLogoutSession,
    selectedRowKeys,
    setSelectedRowKeys,
  } = useOnlineUserModel();
  const { message } = useFeedback();

  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [sessionModalLoading, setSessionModalLoading] = useState(false);
  const [sessionList, setSessionList] = useState<API.SessionDetailDto[]>([]);
  const [sessionUserId, setSessionUserId] = useState<string>('');
  const [sessionUsername, setSessionUsername] = useState<string>('');

  const tableReload = () => {
    callRef(tableProRef, (t) => t.reload());
  };

  const handleSelectionChange = (keys: React.Key[]) => {
    setSelectedRowKeys(keys);
  };

  const handleKickUser = (record: API.OnlineUserItemDto) => {
    Modal.confirm({
      title: '系统提示',
      icon: <Icon name="ExclamationCircleOutlined" />,
      content: `是否确认强退用户"${
        record.nickname || record.username
      }"？该用户的所有会话将被强制下线。`,
      okText: '确认',
      okButtonProps: { danger: true },
      cancelText: '取消',
      onOk() {
        return forceLogoutUser(record.userId)
          .then(() => {
            message.success('强退成功');
            tableReload();
          })
          .catch((error) => {
            logger.error(error);
          });
      },
    });
  };

  const handleBatchKick = () => {
    if (!selectedRowKeys.length) {
      Modal.warning({
        title: '提示',
        content: '请先选择要强退的用户',
      });
      return;
    }
    Modal.confirm({
      title: '批量强退确认',
      icon: <Icon name="ExclamationCircleOutlined" />,
      content: `是否确认强退选中的 ${selectedRowKeys.length} 位用户？`,
      okText: '确认',
      okButtonProps: { danger: true },
      cancelText: '取消',
      onOk() {
        const promises = selectedRowKeys.map((key) =>
          forceLogoutUser(String(key)),
        );
        return Promise.all(promises)
          .then(() => {
            message.success('批量强退成功');
            setSelectedRowKeys([]);
            tableReload();
          })
          .catch((error) => {
            logger.error(error);
          });
      },
    });
  };

  const handleViewSessions = async (record: API.OnlineUserItemDto) => {
    setSessionUserId(record.userId);
    setSessionUsername(record.nickname || record.username);
    setSessionModalOpen(true);
    setSessionModalLoading(true);
    try {
      const sessions = await fetchUserSessions(record.userId);
      setSessionList(sessions);
    } catch (error) {
      logger.error(error);
      message.error('加载会话列表失败');
    } finally {
      setSessionModalLoading(false);
    }
  };

  const handleKickSession = (session: API.SessionDetailDto) => {
    Modal.confirm({
      title: '系统提示',
      icon: <Icon name="ExclamationCircleOutlined" />,
      content: '是否确认强退该会话？',
      okText: '确认',
      okButtonProps: { danger: true },
      cancelText: '取消',
      onOk() {
        return forceLogoutSession(sessionUserId, session.tokenHash)
          .then(() => {
            message.success('强退会话成功');
            setSessionList((prev) =>
              prev.filter((s) => s.tokenHash !== session.tokenHash),
            );
            tableReload();
          })
          .catch((error) => {
            logger.error(error);
          });
      },
    });
  };

  let columns = getOnlineUserColumns().map((column: any) => {
    if (column.dataIndex === 'userId') {
      return {
        ...column,
        render: (userId: string) => <CopyId id={userId} />,
      };
    }
    if (column.dataIndex === 'lastActiveAt') {
      return {
        ...column,
        render: (time: string) => (
          <DateTimeFormat value={time} format="YYYY-MM-DD HH:mm:ss" />
        ),
      };
    }
    if (column.dataIndex === 'sessionCount') {
      return {
        ...column,
        render: (count: number) => <Tag color="success">{count || 1}</Tag>,
      };
    }
    return column;
  });

  columns = [
    ...columns,
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 180,
      render: (record: API.OnlineUserItemDto) => (
        <Space size={0}>
          <AuthButton
            type="link"
            icon={<Icon name="EyeOutlined" />}
            onClick={() => handleViewSessions(record)}
            perms={[PERM.MONITOR_ONLINE_USER_VIEW]}
          >
            会话
          </AuthButton>
          <AuthButton
            danger
            type="link"
            icon={<Icon name="DeleteOutlined" />}
            onClick={() => handleKickUser(record)}
            perms={[PERM.MONITOR_ONLINE_USER_KICK]}
          >
            强退
          </AuthButton>
        </Space>
      ),
    },
  ];

  const sessionColumns = [
    {
      title: '会话标识',
      dataIndex: 'tokenHash',
      key: 'tokenHash',
      render: (hash: string) => (
        <Tooltip title={hash}>
          <span
            style={{
              display: 'inline-block',
              maxWidth: 200,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {hash}
          </span>
        </Tooltip>
      ),
    },
    { title: 'IP地址', dataIndex: 'ipAddress', key: 'ipAddress' },
    { title: '登录地点', dataIndex: 'location', key: 'location' },
    { title: '浏览器', dataIndex: 'browser', key: 'browser' },
    { title: '操作系统', dataIndex: 'os', key: 'os' },
    {
      title: '设备',
      dataIndex: 'device',
      key: 'device',
    },
    {
      title: '会话创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (time: string) => (
        <DateTimeFormat value={time} format="YYYY-MM-DD HH:mm:ss" />
      ),
    },
    {
      title: '最后活跃',
      dataIndex: 'lastActiveAt',
      key: 'lastActiveAt',
      render: (time: string) => (
        <DateTimeFormat value={time} format="YYYY-MM-DD HH:mm:ss" />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, session: API.SessionDetailDto) => (
        <AuthButton
          danger
          type="link"
          size="small"
          icon={<Icon name="DeleteOutlined" />}
          onClick={() => handleKickSession(session)}
          perms={[PERM.MONITOR_ONLINE_USER_KICK]}
        >
          强退
        </AuthButton>
      ),
    },
  ];

  return (
    <PageContainer>
      <TablePro
        rowKey="userId"
        toolbarRender={() => (
          <AuthButton
            danger
            icon={<Icon name="DeleteOutlined" />}
            onClick={handleBatchKick}
            disabled={selectedRowKeys.length === 0}
            perms={[PERM.MONITOR_ONLINE_USER_KICK]}
          >
            批量强退
          </AuthButton>
        )}
        ref={tableProRef}
        columns={columns}
        request={fetchOnlineUserList}
        onSelectionChange={handleSelectionChange}
      />

      <Modal
        title={`${sessionUsername} 的会话列表`}
        open={sessionModalOpen}
        onCancel={() => {
          setSessionModalOpen(false);
          setSessionList([]);
        }}
        footer={null}
        width={900}
        destroyOnClose
      >
        <Table
          dataSource={sessionList}
          columns={sessionColumns}
          rowKey="tokenHash"
          loading={sessionModalLoading}
          pagination={false}
          size="small"
        />
      </Modal>
    </PageContainer>
  );
};

export default OnlineUserPage;

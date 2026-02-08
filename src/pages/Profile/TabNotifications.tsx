import {
  BellOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Empty,
  List,
  Space,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import { useState } from 'react';
import styles from './index.less';

const { Text } = Typography;

interface NotifItem {
  id: string;
  type: 'system' | 'approval' | 'security';
  title: string;
  content: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: NotifItem[] = [
  {
    id: '1',
    type: 'system',
    title: '系统维护通知',
    content: '系统将于 2025-02-10 02:00-06:00 进行维护升级，届时服务将暂停。',
    time: '2025-02-07 18:00',
    read: false,
  },
  {
    id: '2',
    type: 'security',
    title: '异地登录提醒',
    content:
      '检测到您的账号在北京（IP: 172.16.0.22）登录，如非本人操作请及时修改密码。',
    time: '2025-02-07 09:15',
    read: false,
  },
  {
    id: '3',
    type: 'approval',
    title: '权限申请已通过',
    content: '您申请的「数据导出」权限已由管理员审批通过。',
    time: '2025-02-06 14:30',
    read: false,
  },
  {
    id: '4',
    type: 'system',
    title: '新功能上线',
    content: '个人中心新增「我的权限」模块，可查看角色、菜单和接口权限详情。',
    time: '2025-02-05 10:00',
    read: true,
  },
  {
    id: '5',
    type: 'security',
    title: '密码即将过期',
    content: '您的密码将于 7 天后过期，请及时修改以确保账号安全。',
    time: '2025-02-04 08:00',
    read: true,
  },
  {
    id: '6',
    type: 'approval',
    title: '角色变更通知',
    content: '管理员已将您的角色从「普通用户」变更为「运营管理员」。',
    time: '2025-02-03 16:45',
    read: true,
  },
];

const TYPE_CONFIG = {
  system: { icon: <InfoCircleOutlined />, color: '#1677ff', label: '系统' },
  approval: { icon: <CheckCircleOutlined />, color: '#52c41a', label: '审批' },
  security: {
    icon: <ExclamationCircleOutlined />,
    color: '#faad14',
    label: '安全',
  },
};

const TabNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const renderList = (items: NotifItem[]) => {
    if (items.length === 0) {
      return (
        <Empty description="暂无通知" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      );
    }
    return (
      <List
        dataSource={items}
        renderItem={(item) => {
          const cfg = TYPE_CONFIG[item.type];
          return (
            <List.Item
              className={`${styles.notifItem} ${
                !item.read ? styles.notifUnread : ''
              }`}
              onClick={() => markAsRead(item.id)}
              actions={[
                !item.read && (
                  <Button
                    type="link"
                    key="read"
                    onClick={() => markAsRead(item.id)}
                  >
                    标为已读
                  </Button>
                ),
              ].filter(Boolean)}
            >
              <List.Item.Meta
                avatar={
                  <Badge dot={!item.read}>
                    <span style={{ color: cfg.color, fontSize: 20 }}>
                      {cfg.icon}
                    </span>
                  </Badge>
                }
                title={
                  <Space>
                    <Text strong={!item.read} style={{ fontSize: 13 }}>
                      {item.title}
                    </Text>
                    <Tag color={cfg.color} style={{ fontSize: 11 }}>
                      {cfg.label}
                    </Tag>
                  </Space>
                }
                description={
                  <>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {item.content}
                    </Text>
                    <div className={styles.notifTime}>{item.time}</div>
                  </>
                }
              />
            </List.Item>
          );
        }}
      />
    );
  };

  const systemNotifs = notifications.filter((n) => n.type === 'system');
  const approvalNotifs = notifications.filter((n) => n.type === 'approval');
  const securityNotifs = notifications.filter((n) => n.type === 'security');

  return (
    <Card
      className={styles.moduleCard}
      size="small"
      title={
        <Space>
          <BellOutlined /> 消息通知
          {unreadCount > 0 && <Badge count={unreadCount} />}
        </Space>
      }
      extra={
        unreadCount > 0 && (
          <Button type="link" onClick={markAllRead}>
            全部标为已读
          </Button>
        )
      }
    >
      <Tabs
        items={[
          {
            key: 'all',
            label: `全部 (${notifications.length})`,
            children: renderList(notifications),
          },
          {
            key: 'system',
            label: (
              <span>
                <InfoCircleOutlined /> 系统 ({systemNotifs.length})
              </span>
            ),
            children: renderList(systemNotifs),
          },
          {
            key: 'approval',
            label: (
              <span>
                <CheckCircleOutlined /> 审批 ({approvalNotifs.length})
              </span>
            ),
            children: renderList(approvalNotifs),
          },
          {
            key: 'security',
            label: (
              <span>
                <SafetyCertificateOutlined /> 安全 ({securityNotifs.length})
              </span>
            ),
            children: renderList(securityNotifs),
          },
        ]}
      />
    </Card>
  );
};

export default TabNotifications;

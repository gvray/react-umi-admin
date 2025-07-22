import { PageContainer } from '@/components';
import { logger } from '@/utils';
import {
  BellOutlined,
  CalendarOutlined,
  CameraOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  GiftOutlined,
  HeartOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  StarOutlined,
  TeamOutlined,
  TrophyOutlined,
  UserOutlined,
  WifiOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  List,
  Menu,
  Progress,
  Row,
  Space,
  Statistic,
  Switch,
  Tag,
  Timeline,
  Typography,
  Upload,
  message,
} from 'antd';
import { useState } from 'react';
import { styled, useModel } from 'umi';
import styles from './index.less';

const { Title, Text, Paragraph } = Typography;

const PageWrapper = styled(PageContainer)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  min-height: 100vh;
`;

export default function ProfilePage() {
  const { initialState } = useModel('@@initialState');
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [activeKey, setActiveKey] = useState('overview');
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });

  const userInfo = initialState?.currentUser.user;

  const handleSave = async (values: any) => {
    try {
      message.success('保存成功！');
      logger.info('保存的信息:' + values);
      setEditing(false);
    } catch (error) {
      message.error('保存失败，请重试');
    }
  };

  const handleAvatarChange = (info: any) => {
    if (info.file.status === 'done') {
      message.success('头像上传成功！');
    }
  };

  // 个人信息概览组件
  const ProfileOverview = () => (
    <>
      {/* 个人信息头部卡片 */}
      <Card className={styles.profileHeader}>
        <Row gutter={24} align="middle">
          <Col>
            <div className={styles.avatarContainer}>
              <Badge
                count={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                offset={[-10, 10]}
              >
                <Avatar
                  size={120}
                  src={userInfo?.avatar}
                  icon={<UserOutlined />}
                  className={styles.userAvatar}
                />
              </Badge>
              <Upload
                showUploadList={false}
                onChange={handleAvatarChange}
                className={styles.avatarUpload}
              >
                <Button
                  type="primary"
                  shape="circle"
                  icon={<CameraOutlined />}
                  className={styles.avatarButton}
                />
              </Upload>
            </div>
          </Col>
          <Col flex={1}>
            <Space direction="vertical" size={12}>
              <div>
                <Title level={2} className={styles.userName}>
                  {userInfo?.name || '用户名'}
                  <Tag color="blue" className={styles.userTag}>
                    {userInfo?.role === 'admin' ? '系统管理员' : '普通用户'}
                  </Tag>
                  <Tag color="gold" className={styles.levelTag}>
                    <StarOutlined /> VIP会员
                  </Tag>
                </Title>
                <Paragraph type="secondary" className={styles.userBio}>
                  专注于系统管理和用户体验优化，致力于打造高效的管理平台。
                </Paragraph>
              </div>
              <Row gutter={24}>
                <Col>
                  <Text type="secondary" className={styles.userDesc}>
                    <MailOutlined /> {userInfo?.email || 'user@example.com'}
                  </Text>
                </Col>
                <Col>
                  <Text type="secondary" className={styles.userDesc}>
                    <PhoneOutlined /> {userInfo?.phone || '未设置'}
                  </Text>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col>
                  <Text type="secondary" className={styles.userDesc}>
                    <CalendarOutlined /> 最后登录：
                    {userInfo?.lastLoginTime
                      ? new Date(userInfo.lastLoginTime).toLocaleDateString()
                      : '未知'}
                  </Text>
                </Col>
                <Col>
                  <Text type="secondary" className={styles.userDesc}>
                    <WifiOutlined /> 在线状态：
                    <Tag color="green">在线</Tag>
                  </Text>
                </Col>
              </Row>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 统计数据卡片 */}
      <Row gutter={16} className={styles.statsRow}>
        <Col span={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="登录次数"
              value={userInfo?.loginCount || 0}
              prefix={<UserOutlined className={styles.statIcon} />}
              valueStyle={{ color: '#1677ff' }}
              suffix="次"
            />
            <Progress percent={85} size="small" showInfo={false} />
          </Card>
        </Col>
        {userInfo?.role === 'admin' ? (
          <>
            <Col span={6}>
              <Card className={styles.statCard}>
                <Statistic
                  title="管理用户"
                  value={userInfo?.statistics?.managedUsers || 0}
                  prefix={<TeamOutlined className={styles.statIcon} />}
                  valueStyle={{ color: '#52c41a' }}
                  suffix="人"
                />
                <Progress
                  percent={75}
                  size="small"
                  showInfo={false}
                  strokeColor="#52c41a"
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card className={styles.statCard}>
                <Statistic
                  title="系统运行时间"
                  value={userInfo?.statistics?.systemUptime || '0%'}
                  prefix={<TrophyOutlined className={styles.statIcon} />}
                  valueStyle={{ color: '#faad14' }}
                />
                <Progress
                  percent={99.9}
                  size="small"
                  showInfo={false}
                  strokeColor="#faad14"
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card className={styles.statCard}>
                <Statistic
                  title="今日登录"
                  value={userInfo?.statistics?.todayLogins || 0}
                  prefix={<HeartOutlined className={styles.statIcon} />}
                  valueStyle={{ color: '#f5222d' }}
                  suffix="人"
                />
                <Progress
                  percent={60}
                  size="small"
                  showInfo={false}
                  strokeColor="#f5222d"
                />
              </Card>
            </Col>
          </>
        ) : (
          <>
            <Col span={6}>
              <Card className={styles.statCard}>
                <Statistic
                  title="团队规模"
                  value={userInfo?.statistics?.teamSize || 0}
                  prefix={<TeamOutlined className={styles.statIcon} />}
                  valueStyle={{ color: '#52c41a' }}
                  suffix="人"
                />
                <Progress
                  percent={80}
                  size="small"
                  showInfo={false}
                  strokeColor="#52c41a"
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card className={styles.statCard}>
                <Statistic
                  title="参与项目"
                  value={userInfo?.statistics?.projectsInvolved || 0}
                  prefix={<TrophyOutlined className={styles.statIcon} />}
                  valueStyle={{ color: '#faad14' }}
                  suffix="个"
                />
                <Progress
                  percent={65}
                  size="small"
                  showInfo={false}
                  strokeColor="#faad14"
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card className={styles.statCard}>
                <Statistic
                  title="完成任务"
                  value={userInfo?.statistics?.completedTasks || 0}
                  prefix={<HeartOutlined className={styles.statIcon} />}
                  valueStyle={{ color: '#f5222d' }}
                  suffix="个"
                />
                <Progress
                  percent={90}
                  size="small"
                  showInfo={false}
                  strokeColor="#f5222d"
                />
              </Card>
            </Col>
          </>
        )}
      </Row>

      {/* 最近活动和成就 */}
      <Row gutter={16}>
        <Col span={12}>
          <Card
            title={
              <>
                <ClockCircleOutlined /> 最近活动
              </>
            }
            className={styles.activityCard}
          >
            <Timeline
              items={[
                {
                  color: 'green',
                  children: (
                    <>
                      <p>成功登录系统</p>
                      <p className={styles.timeText}>2小时前</p>
                    </>
                  ),
                },
                {
                  color: 'blue',
                  children: (
                    <>
                      <p>更新了个人信息</p>
                      <p className={styles.timeText}>1天前</p>
                    </>
                  ),
                },
                {
                  color: 'red',
                  children: (
                    <>
                      <p>修改了密码</p>
                      <p className={styles.timeText}>3天前</p>
                    </>
                  ),
                },
                {
                  children: (
                    <>
                      <p>完成了系统培训</p>
                      <p className={styles.timeText}>1周前</p>
                    </>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={
              <>
                <GiftOutlined /> 成就徽章
              </>
            }
            className={styles.achievementCard}
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <div className={styles.badge}>
                  <TrophyOutlined
                    className={styles.badgeIcon}
                    style={{ color: '#faad14' }}
                  />
                  <Text>登录达人</Text>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.badge}>
                  <StarOutlined
                    className={styles.badgeIcon}
                    style={{ color: '#1890ff' }}
                  />
                  <Text>活跃用户</Text>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.badge}>
                  <SafetyCertificateOutlined
                    className={styles.badgeIcon}
                    style={{ color: '#52c41a' }}
                  />
                  <Text>安全专家</Text>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.badge}>
                  <TeamOutlined
                    className={styles.badgeIcon}
                    style={{ color: '#722ed1' }}
                  />
                  <Text>团队协作</Text>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.badge}>
                  <HeartOutlined
                    className={styles.badgeIcon}
                    style={{ color: '#f5222d' }}
                  />
                  <Text>贡献者</Text>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.badge}>
                  <CheckCircleOutlined
                    className={styles.badgeIcon}
                    style={{ color: '#13c2c2' }}
                  />
                  <Text>完美主义</Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );

  // 个人信息编辑组件
  const PersonalInfo = () => (
    <Row gutter={16}>
      <Col span={16}>
        <Card
          title="个人信息"
          extra={
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => setEditing(!editing)}
            >
              {editing ? '取消编辑' : '编辑信息'}
            </Button>
          }
          className={styles.infoCard}
        >
          {editing ? (
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
              initialValues={{
                nickName: userInfo?.name || '-',
                email: userInfo?.email || '-',
                phone: userInfo?.phone || '-',
                department: userInfo?.department || '-',
                position: userInfo?.position || '-',
                bio: '专注于系统管理和用户体验优化',
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="nickName" label="昵称">
                    <Input placeholder="请输入昵称" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="email" label="邮箱">
                    <Input placeholder="请输入邮箱" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="phone" label="手机号">
                    <Input placeholder="请输入手机号" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="department" label="部门">
                    <Input placeholder="请输入部门" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="position" label="职位">
                <Input placeholder="请输入职位" />
              </Form.Item>
              <Form.Item name="bio" label="个人简介">
                <Input.TextArea rows={3} placeholder="请输入个人简介" />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    保存修改
                  </Button>
                  <Button onClick={() => setEditing(false)}>取消</Button>
                </Space>
              </Form.Item>
            </Form>
          ) : (
            <Descriptions column={2} size="middle">
              <Descriptions.Item label="昵称" span={1}>
                {userInfo?.name || '未设置'}
              </Descriptions.Item>
              <Descriptions.Item label="邮箱" span={1}>
                {userInfo?.email || '未设置'}
              </Descriptions.Item>
              <Descriptions.Item label="手机号" span={1}>
                {userInfo?.phone || '未设置'}
              </Descriptions.Item>
              <Descriptions.Item label="部门" span={1}>
                {userInfo?.department || '未设置'}
              </Descriptions.Item>
              <Descriptions.Item label="职位" span={2}>
                {userInfo?.position || '未设置'}
              </Descriptions.Item>
              <Descriptions.Item label="用户状态" span={1}>
                <Tag color={userInfo?.status === 'active' ? 'green' : 'red'}>
                  {userInfo?.status === 'active' ? '活跃' : '非活跃'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="创建时间" span={1}>
                {userInfo?.createdAt
                  ? new Date(userInfo.createdAt).toLocaleDateString()
                  : '未知'}
              </Descriptions.Item>
              <Descriptions.Item label="个人简介" span={2}>
                专注于系统管理和用户体验优化，致力于打造高效的管理平台。
              </Descriptions.Item>
            </Descriptions>
          )}
        </Card>
      </Col>
      <Col span={8}>
        <Card title="快速操作" className={styles.quickActions}>
          <List
            dataSource={[
              {
                icon: <EditOutlined />,
                title: '编辑资料',
                desc: '更新个人信息',
              },
              {
                icon: <CameraOutlined />,
                title: '更换头像',
                desc: '上传新头像',
              },
              {
                icon: <LockOutlined />,
                title: '修改密码',
                desc: '更新登录密码',
              },
              {
                icon: <BellOutlined />,
                title: '通知设置',
                desc: '管理消息通知',
              },
            ]}
            renderItem={(item) => (
              <List.Item className={styles.quickActionItem}>
                <List.Item.Meta
                  avatar={<div className={styles.actionIcon}>{item.icon}</div>}
                  title={item.title}
                  description={item.desc}
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>
    </Row>
  );

  // 安全设置组件
  const SecuritySettings = () => (
    <Row gutter={16}>
      <Col span={12}>
        <Card title="密码设置" className={styles.securityCard}>
          <Form
            layout="vertical"
            onFinish={(values) => {
              message.success('密码修改成功！');
              logger.info('修改的密码:' + values);
            }}
          >
            <Form.Item
              name="oldPassword"
              label="原密码"
              rules={[{ required: true, message: '请输入原密码' }]}
            >
              <Input.Password
                placeholder="请输入原密码"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label="新密码"
              rules={[
                { required: true, message: '请输入新密码' },
                { min: 6, message: '密码长度至少6位' },
              ]}
            >
              <Input.Password
                placeholder="请输入新密码"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="确认密码"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: '请确认新密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="请确认新密码"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                修改密码
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
      <Col span={12}>
        <Card title="安全状态" className={styles.securityStatus}>
          <List
            dataSource={[
              {
                title: '密码强度',
                status: 'success',
                desc: '强',
                extra: <Progress percent={85} size="small" />,
              },
              {
                title: '两步验证',
                status: 'warning',
                desc: '未开启',
                extra: <Switch />,
              },
              {
                title: '登录保护',
                status: 'success',
                desc: '已开启',
                extra: <Switch defaultChecked />,
              },
              {
                title: '异地登录提醒',
                status: 'success',
                desc: '已开启',
                extra: <Switch defaultChecked />,
              },
            ]}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <SafetyCertificateOutlined
                      style={{
                        color:
                          item.status === 'success' ? '#52c41a' : '#faad14',
                      }}
                    />
                  }
                  title={item.title}
                  description={item.desc}
                />
                {item.extra}
              </List.Item>
            )}
          />
        </Card>
      </Col>
    </Row>
  );

  // 系统设置组件
  const SystemSettings = () => (
    <Row gutter={16}>
      <Col span={12}>
        <Card title="通知设置" className={styles.notificationCard}>
          <List
            dataSource={[
              {
                title: '邮件通知',
                desc: '接收系统邮件通知',
                key: 'email',
              },
              {
                title: '短信通知',
                desc: '接收重要短信提醒',
                key: 'sms',
              },
              {
                title: '推送通知',
                desc: '接收浏览器推送',
                key: 'push',
              },
            ]}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<BellOutlined />}
                  title={item.title}
                  description={item.desc}
                />
                <Switch
                  checked={notifications[item.key]}
                  onChange={(checked) =>
                    setNotifications({ ...notifications, [item.key]: checked })
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card title="偏好设置" className={styles.preferenceCard}>
          <List
            dataSource={[
              {
                title: '深色模式',
                desc: '使用深色主题',
                extra: <Switch />,
              },
              {
                title: '自动保存',
                desc: '自动保存表单数据',
                extra: <Switch defaultChecked />,
              },
              {
                title: '数据统计',
                desc: '允许收集使用数据',
                extra: <Switch defaultChecked />,
              },
              {
                title: '快捷键',
                desc: '启用键盘快捷键',
                extra: <Switch defaultChecked />,
              },
            ]}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<SettingOutlined />}
                  title={item.title}
                  description={item.desc}
                />
                {item.extra}
              </List.Item>
            )}
          />
        </Card>
      </Col>
    </Row>
  );

  // Menu配置
  const menuItems = [
    {
      key: 'overview',
      icon: <UserOutlined />,
      label: '个人概览',
    },
    {
      key: 'info',
      icon: <EditOutlined />,
      label: '个人信息',
    },
    {
      key: 'security',
      icon: <LockOutlined />,
      label: '安全设置',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
  ];

  // 渲染内容的函数
  const renderContent = () => {
    switch (activeKey) {
      case 'overview':
        return <ProfileOverview />;
      case 'info':
        return <PersonalInfo />;
      case 'security':
        return <SecuritySettings />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <ProfileOverview />;
    }
  };

  return (
    <PageWrapper className={styles.profileContainer}>
      <Row gutter={24}>
        <Col span={6}>
          <Card className={styles.menuCard}>
            <Menu
              mode="vertical"
              selectedKeys={[activeKey]}
              items={menuItems}
              onClick={({ key }) => setActiveKey(key)}
              className={styles.profileMenu}
            />
          </Card>
        </Col>
        <Col span={18}>
          <div className={styles.contentArea}>{renderContent()}</div>
        </Col>
      </Row>
    </PageWrapper>
  );
}

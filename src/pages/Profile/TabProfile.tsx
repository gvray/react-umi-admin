import {
  CheckCircleFilled,
  EditOutlined,
  ExclamationCircleFilled,
  LockOutlined,
  MailOutlined,
  MobileOutlined,
  SafetyOutlined,
  SendOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Steps,
  Tag,
  Typography,
  message,
} from 'antd';
import { useState } from 'react';
import styles from './index.less';

const { Text } = Typography;

interface TabProfileProps {
  profile?: API.CurrentUserResponseDto;
}

const TabProfile: React.FC<TabProfileProps> = ({ profile }) => {
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [verifyStep, setVerifyStep] = useState(0);
  const [countdown, setCountdown] = useState(0);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      message.success('个人信息保存成功');
      setEditing(false);
      console.log('saved:', values);
    } catch {
      // validation failed
    }
  };

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendCode = () => {
    message.success('验证码已发送');
    startCountdown();
    setVerifyStep(1);
  };

  const handleVerifyCode = () => {
    message.success('验证成功');
    setVerifyStep(2);
  };

  const handleBindConfirm = (type: 'phone' | 'email') => {
    message.success(`${type === 'phone' ? '手机号' : '邮箱'}绑定成功`);
    setPhoneModalOpen(false);
    setEmailModalOpen(false);
    setVerifyStep(0);
    setCountdown(0);
  };

  const emailVerified = !!profile?.email;
  const phoneVerified = !!profile?.phone;

  // ─── Verification Modal ───────────────────────────────
  const renderVerifyModal = (
    type: 'phone' | 'email',
    open: boolean,
    onClose: () => void,
  ) => (
    <Modal
      title={`${type === 'phone' ? '更换手机号' : '更换邮箱'}`}
      open={open}
      onCancel={() => {
        onClose();
        setVerifyStep(0);
        setCountdown(0);
      }}
      footer={null}
      width={480}
    >
      <Steps
        current={verifyStep}
        style={{ marginBottom: 24 }}
        items={[
          { title: '身份验证' },
          { title: '输入验证码' },
          { title: `绑定新${type === 'phone' ? '手机' : '邮箱'}` },
        ]}
      />

      {verifyStep === 0 && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <SafetyOutlined
            style={{ fontSize: 48, color: '#667eea', marginBottom: 16 }}
          />
          <div style={{ marginBottom: 16 }}>
            <Text>
              为了保护账号安全，需要验证当前
              {type === 'phone' ? '手机号' : '邮箱'}
            </Text>
          </div>
          <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
            验证码将发送至：
            {type === 'phone'
              ? (profile?.phone || '').replace(
                  /(\d{3})\d{4}(\d{4})/,
                  '$1****$2',
                )
              : (profile?.email || '').replace(/(.{2}).*(@.*)/, '$1***$2')}
          </Text>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendCode}
          >
            发送验证码
          </Button>
        </div>
      )}

      {verifyStep === 1 && (
        <div style={{ maxWidth: 320, margin: '0 auto', padding: '20px 0' }}>
          <Form layout="vertical" onFinish={handleVerifyCode}>
            <Form.Item
              name="code"
              label="验证码"
              rules={[{ required: true, message: '请输入验证码' }]}
            >
              <Input
                placeholder="请输入6位验证码"
                maxLength={6}
                suffix={
                  <Button
                    type="link"
                    disabled={countdown > 0}
                    onClick={handleSendCode}
                    style={{ padding: 0 }}
                  >
                    {countdown > 0 ? `${countdown}s` : '重新发送'}
                  </Button>
                }
              />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              验证
            </Button>
          </Form>
        </div>
      )}

      {verifyStep === 2 && (
        <div style={{ maxWidth: 320, margin: '0 auto', padding: '20px 0' }}>
          <Form layout="vertical" onFinish={() => handleBindConfirm(type)}>
            <Form.Item
              name="newValue"
              label={`新${type === 'phone' ? '手机号' : '邮箱'}`}
              rules={[
                {
                  required: true,
                  message: `请输入新${type === 'phone' ? '手机号' : '邮箱'}`,
                },
                ...(type === 'email'
                  ? [{ type: 'email' as const, message: '请输入有效邮箱' }]
                  : []),
              ]}
            >
              <Input
                prefix={
                  type === 'phone' ? <MobileOutlined /> : <MailOutlined />
                }
                placeholder={`请输入新${type === 'phone' ? '手机号' : '邮箱'}`}
              />
            </Form.Item>
            <Form.Item
              name="newCode"
              label="验证码"
              rules={[{ required: true, message: '请输入验证码' }]}
            >
              <Input
                placeholder="请输入验证码"
                maxLength={6}
                suffix={
                  <Button
                    type="link"
                    onClick={handleSendCode}
                    disabled={countdown > 0}
                    style={{ padding: 0 }}
                  >
                    {countdown > 0 ? `${countdown}s` : '发送验证码'}
                  </Button>
                }
              />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              确认绑定
            </Button>
          </Form>
        </div>
      )}
    </Modal>
  );

  return (
    <>
      {/* ── Basic Info Card ── */}
      <Card
        className={styles.moduleCard}
        title="基本信息"
        extra={
          !editing ? (
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => setEditing(true)}
            >
              编辑
            </Button>
          ) : (
            <Space>
              <Button type="primary" onClick={handleSave}>
                保存
              </Button>
              <Button onClick={() => setEditing(false)}>取消</Button>
            </Space>
          )
        }
      >
        {editing ? (
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              nickname: profile?.nickname || '',
              bio: '专注于系统管理和用户体验优化',
            }}
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="用户名">
                  <Input
                    value={profile?.username || ''}
                    disabled
                    suffix={
                      <LockOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="nickname"
                  label="昵称"
                  rules={[{ required: true, message: '请输入昵称' }]}
                >
                  <Input placeholder="请输入昵称" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="部门">
                  <Input
                    value={profile?.department?.name || '未设置'}
                    disabled
                    suffix={
                      <LockOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="岗位">
                  <Input
                    value={profile?.positions?.[0]?.name || '未设置'}
                    disabled
                    suffix={
                      <LockOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="bio" label="个人简介">
              <Input.TextArea rows={3} placeholder="请输入个人简介" />
            </Form.Item>
          </Form>
        ) : (
          <Descriptions
            column={2}
            colon={false}
            labelStyle={{ color: 'rgba(0,0,0,0.45)', width: 100 }}
          >
            <Descriptions.Item label="用户名">
              <span className={styles.readonlyField}>
                {profile?.username || '-'} <LockOutlined />
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="昵称">
              {profile?.nickname || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="部门">
              <span className={styles.readonlyField}>
                {profile?.department?.name || '未设置'} <LockOutlined />
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="岗位">
              <span className={styles.readonlyField}>
                {profile?.positions?.[0]?.name || '未设置'} <LockOutlined />
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="角色" span={2}>
              <Space size={4}>
                {profile?.roles?.map((r) => (
                  <Tag key={r.roleId} color="blue">
                    {r.description || r.name}
                  </Tag>
                ))}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="账号状态">
              <Tag color={profile?.status === 1 ? 'green' : 'red'}>
                {profile?.status === 1 ? '正常' : '停用'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="注册时间">
              <span className={styles.readonlyField}>
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleString()
                  : '-'}{' '}
                <LockOutlined />
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="个人简介" span={2}>
              专注于系统管理和用户体验优化，致力于打造高效的管理平台。
            </Descriptions.Item>
          </Descriptions>
        )}
      </Card>

      {/* ── Contact Binding Card ── */}
      <Card
        className={styles.moduleCard}
        title="联系方式"
        style={{ marginTop: 16 }}
      >
        <div className={styles.contactRow}>
          <MailOutlined style={{ fontSize: 18, color: '#667eea' }} />
          <div style={{ flex: 1, marginLeft: 4 }}>
            <div style={{ fontWeight: 500, fontSize: 14 }}>邮箱</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {profile?.email || '未绑定'}
              {emailVerified && (
                <CheckCircleFilled className={styles.verifiedIcon} />
              )}
              {!emailVerified && (
                <ExclamationCircleFilled className={styles.unverifiedIcon} />
              )}
            </Text>
          </div>
          <Button
            className={styles.contactAction}
            type={emailVerified ? 'default' : 'primary'}
            onClick={() => setEmailModalOpen(true)}
          >
            {emailVerified ? '更换邮箱' : '立即绑定'}
          </Button>
        </div>

        <Divider style={{ margin: '16px 0' }} />

        <div className={styles.contactRow}>
          <MobileOutlined style={{ fontSize: 18, color: '#667eea' }} />
          <div style={{ flex: 1, marginLeft: 4 }}>
            <div style={{ fontWeight: 500, fontSize: 14 }}>手机号</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {profile?.phone
                ? profile.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
                : '未绑定'}
              {phoneVerified && (
                <CheckCircleFilled className={styles.verifiedIcon} />
              )}
              {!phoneVerified && (
                <ExclamationCircleFilled className={styles.unverifiedIcon} />
              )}
            </Text>
          </div>
          <Button
            className={styles.contactAction}
            type={phoneVerified ? 'default' : 'primary'}
            onClick={() => setPhoneModalOpen(true)}
          >
            {phoneVerified ? '更换手机' : '立即绑定'}
          </Button>
        </div>
      </Card>

      {/* ── Modals ── */}
      {renderVerifyModal('phone', phoneModalOpen, () =>
        setPhoneModalOpen(false),
      )}
      {renderVerifyModal('email', emailModalOpen, () =>
        setEmailModalOpen(false),
      )}
    </>
  );
};

export default TabProfile;

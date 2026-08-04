import { Icon } from '@/components';
import PhoneInput from '@/pages/Login/components/PhoneInput';
import { Button, Form, Input, Space, theme } from 'antd';
import React from 'react';
import { styled } from 'umi';

export type RegisterTab = 'account' | 'phone';

export interface RegisterCardProps {
  siteName: string;
  activeTab: RegisterTab;
  countdown: number;
  isRegistering: boolean;
  onTabChange: (tab: RegisterTab) => void;
  onAccountSubmit: (values: unknown) => void;
  onPhoneSubmit: (values: unknown) => void;
  onSendCode: () => void;
  onNavigateLogin?: () => void;
}

/* ===================== styled components ===================== */

const Panel = styled.div`
  width: 100%;
  height: 660px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: 48px 40px 32px 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.35);
  display: flex;
  flex-direction: column;
`;

const PanelTitle = styled.div`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.colorTextHeading};
  margin-bottom: 32px;
`;

const TabBar = styled.div`
  display: flex;
  gap: 32px;
  margin-bottom: 28px;
`;

const TabItem = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.colorTextSecondary};
  cursor: pointer;
  padding-bottom: 8px;
  position: relative;
  transition: color 0.3s;

  &:hover {
    color: ${({ theme }) => theme.colorPrimary};
  }

  &.active {
    color: ${({ theme }) => theme.colorPrimary};
    font-weight: 500;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: ${({ theme }) => theme.colorPrimary};
      border-radius: 2px;
    }
  }
`;

const AgreementText = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colorTextSecondary};
  margin-bottom: 20px;

  a {
    color: ${({ theme }) => theme.colorPrimary};
    cursor: pointer;
    margin: 0 4px;

    &:hover {
      opacity: 0.8;
    }
  }
`;

const LoginLink = styled.div`
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.colorTextSecondary};
  margin-top: 16px;

  a {
    color: ${({ theme }) => theme.colorPrimary};
    cursor: pointer;
    margin-left: 4px;

    &:hover {
      opacity: 0.8;
    }
  }
`;

const FormBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

/* ===================== main ===================== */

const RegisterCard: React.FC<RegisterCardProps> = ({
  siteName,
  activeTab,
  countdown,
  isRegistering,
  onTabChange,
  onAccountSubmit,
  onPhoneSubmit,
  onSendCode,
  onNavigateLogin,
}) => {
  const { token } = theme.useToken();

  return (
    <Panel>
      <PanelTitle>创建新账号</PanelTitle>

      <TabBar>
        <TabItem
          className={activeTab === 'account' ? 'active' : ''}
          onClick={() => onTabChange('account')}
        >
          账号注册
        </TabItem>
        <TabItem
          className={activeTab === 'phone' ? 'active' : ''}
          onClick={() => onTabChange('phone')}
        >
          手机号注册
        </TabItem>
      </TabBar>

      <ContentArea>
        {activeTab === 'account' ? (
          <>
            <Form
              name="registerAccount"
              size="large"
              onFinish={onAccountSubmit}
              style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            >
              <FormBody>
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: '请输入用户名' },
                    { min: 3, message: '用户名至少 3 位' },
                    { max: 32, message: '用户名最多 32 位' },
                  ]}
                >
                  <Input
                    prefix={
                      <Icon
                        name="UserOutlined"
                        className="site-form-item-icon"
                      />
                    }
                    placeholder="用户名"
                  />
                </Form.Item>

                <Form.Item
                  name="nickname"
                  rules={[
                    { required: true, message: '请输入昵称' },
                    { max: 32, message: '昵称最多 32 位' },
                  ]}
                >
                  <Input
                    prefix={
                      <Icon
                        name="SmileOutlined"
                        className="site-form-item-icon"
                      />
                    }
                    placeholder="昵称"
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  rules={[{ type: 'email', message: '请输入有效的邮箱地址' }]}
                >
                  <Input
                    prefix={
                      <Icon
                        name="MailOutlined"
                        className="site-form-item-icon"
                      />
                    }
                    placeholder="邮箱（可选）"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: '请输入密码' },
                    { min: 6, message: '密码至少 6 位' },
                    { max: 32, message: '密码最多 32 位' },
                  ]}
                >
                  <Input.Password
                    prefix={
                      <Icon
                        name="LockOutlined"
                        className="site-form-item-icon"
                      />
                    }
                    placeholder="密码"
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: '请确认密码' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error('两次输入的密码不一致'),
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={
                      <Icon
                        name="LockOutlined"
                        className="site-form-item-icon"
                      />
                    }
                    placeholder="确认密码"
                  />
                </Form.Item>

                <AgreementText>
                  注册视为您已阅读并同意{siteName}
                  <a>服务条款</a>和<a>隐私政策</a>
                </AgreementText>

                <Form.Item style={{ marginBottom: 16 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={isRegistering}
                  >
                    {isRegistering ? '注册中...' : '注册'}
                  </Button>
                </Form.Item>
              </FormBody>
            </Form>

            <LoginLink>
              已有账号？
              <a onClick={onNavigateLogin}>去登录</a>
            </LoginLink>
          </>
        ) : (
          <>
            <Form
              name="registerPhone"
              size="large"
              onFinish={onPhoneSubmit}
              style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            >
              <FormBody>
                <Form.Item
                  name="phone"
                  rules={[{ required: true, message: '请输入手机号' }]}
                >
                  <PhoneInput />
                </Form.Item>

                <Form.Item
                  name="verifyCode"
                  rules={[{ required: true, message: '请输入验证码' }]}
                >
                  <Space.Compact block style={{ width: '100%' }}>
                    <Input
                      size="large"
                      placeholder="请输入验证码"
                      style={{ width: '100%' }}
                    />
                    <Button
                      size="large"
                      disabled={countdown > 0}
                      onClick={onSendCode}
                      style={{
                        color:
                          countdown > 0
                            ? token.colorTextDisabled
                            : token.colorPrimary,
                        fontSize: 14,
                      }}
                    >
                      {countdown > 0 ? `${countdown}s后重发` : '获取验证码'}
                    </Button>
                  </Space.Compact>
                </Form.Item>

                <AgreementText>
                  注册视为您已阅读并同意{siteName}
                  <a>服务条款</a>和<a>隐私政策</a>
                </AgreementText>

                <Form.Item style={{ marginBottom: 16 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={isRegistering}
                  >
                    {isRegistering ? '注册中...' : '注册'}
                  </Button>
                </Form.Item>
              </FormBody>
            </Form>

            <LoginLink>
              已有账号？
              <a onClick={onNavigateLogin}>去登录</a>
            </LoginLink>
          </>
        )}
      </ContentArea>
    </Panel>
  );
};

export default RegisterCard;

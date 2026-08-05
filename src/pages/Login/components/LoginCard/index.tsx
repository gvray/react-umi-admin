import { Icon } from '@/components';
import PhoneInput from '@/pages/Login/components/PhoneInput';
import { Button, Checkbox, Form, Input, Space, theme } from 'antd';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { styled } from 'umi';

export type LoginTab = 'account' | 'phone';

export interface GuestAccount {
  username: string;
  password: string;
}

export interface LoginCardProps {
  siteName: string;
  registerEnabled?: boolean;
  guestAccount?: GuestAccount;
  activeTab: LoginTab;
  countdown: number;
  initialAccountValues?: {
    account?: string;
    password?: string;
    rememberMe?: boolean;
  };
  onTabChange: (tab: LoginTab) => void;
  onAccountSubmit: (values: unknown) => void;
  onPhoneSubmit: (values: unknown) => void;
  onSendCode: () => void;
  onNavigateRegister?: () => void;
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
  color: #1f1f1f;
  margin-bottom: 32px;
`;

const TabBar = styled.div`
  display: flex;
  gap: 32px;
  margin-bottom: 28px;
`;

const TabItem = styled.div`
  font-size: 16px;
  color: #595959;
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

const GuestAccountTip = styled.div`
  margin-bottom: 0;
  font-size: 13px;
  color: #8c8c8c;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const AgreementText = styled.div`
  font-size: 13px;
  color: #595959;
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

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  font-size: 13px;
  color: #595959;
`;

const ActionLinks = styled.div`
  display: flex;
  gap: 16px;

  a {
    color: #595959;
    cursor: pointer;

    &:hover {
      color: ${({ theme }) => theme.colorPrimary};
    }
  }
`;

const ActionExtra = styled.div`
  .ant-checkbox-wrapper {
    color: #595959;
    font-size: 13px;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 24px 0 20px;
  color: #8c8c8c;
  font-size: 13px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #f0f0f0;
  }

  &::before {
    margin-right: 16px;
  }

  &::after {
    margin-left: 16px;
  }
`;

const SocialRow = styled.div`
  display: flex;
  gap: 12px;
`;

const SocialButton = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  color: #1f1f1f;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

  &:hover {
    border-color: ${({ theme }) => theme.colorPrimary};
  }
`;

const SocialIcon = styled.div`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 20px;
  color: #595959;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  position: relative;

  &:hover {
    border-color: ${({ theme }) => theme.colorPrimary};
  }

  &[data-tooltip]::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) scale(0.9);
    background: #1f1f1f;
    color: #ffffff;
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 4px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: all 0.2s;
  }

  &[data-tooltip]::before {
    content: '';
    position: absolute;
    bottom: calc(100% + 4px);
    left: 50%;
    transform: translateX(-50%) scale(0.9);
    border: 4px solid transparent;
    border-top-color: #1f1f1f;
    opacity: 0;
    transition: all 0.2s;
  }

  &[data-tooltip]:hover::after,
  &[data-tooltip]:hover::before {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
`;

const RegisterLink = styled.div`
  text-align: center;
  font-size: 14px;
  color: #595959;
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

const LoginCard: React.FC<LoginCardProps> = ({
  siteName,
  registerEnabled,
  guestAccount,
  activeTab,
  countdown,
  initialAccountValues,
  onTabChange,
  onAccountSubmit,
  onPhoneSubmit,
  onSendCode,
  onNavigateRegister,
}) => {
  const { token } = theme.useToken();
  const [accountForm] = Form.useForm();

  useEffect(() => {
    if (initialAccountValues) {
      accountForm.setFieldsValue(initialAccountValues);
    }
  }, [accountForm, initialAccountValues]);

  return (
    <Panel>
      <PanelTitle>欢迎开启新世界</PanelTitle>

      <TabBar>
        <TabItem
          className={activeTab === 'account' ? 'active' : ''}
          onClick={() => onTabChange('account')}
        >
          账号登录
        </TabItem>
        <TabItem
          className={activeTab === 'phone' ? 'active' : ''}
          onClick={() => onTabChange('phone')}
        >
          手机号登录
        </TabItem>
      </TabBar>

      <ContentArea>
        {activeTab === 'account' ? (
          <>
            <Form
              form={accountForm}
              name="login"
              size="large"
              initialValues={{ rememberMe: true }}
              onFinish={onAccountSubmit}
              style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            >
              <FormBody>
                <Form.Item
                  name="account"
                  rules={[
                    { required: true, message: '请您输入手机号/用户名/邮箱' },
                  ]}
                >
                  <Input placeholder="请输入账号名/账号ID" />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: '请您输入密码' }]}
                >
                  <Input.Password placeholder="请输入登录密码" />
                </Form.Item>

                <AgreementText>
                  登录视为您已阅读并同意{siteName}
                  <a>服务条款</a>和<a>隐私政策</a>
                </AgreementText>

                <Form.Item style={{ marginBottom: 16 }}>
                  <Button type="primary" htmlType="submit" block>
                    <FormattedMessage id={'pages.login.login'} />
                  </Button>
                </Form.Item>

                <ActionBar>
                  <ActionLinks>
                    <a>忘记账号</a>
                    <a>忘记密码</a>
                  </ActionLinks>
                  <ActionExtra>
                    <Form.Item
                      name="rememberMe"
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>
                        <FormattedMessage id={'pages.login.rememberMe'} />
                      </Checkbox>
                    </Form.Item>
                  </ActionExtra>
                </ActionBar>
              </FormBody>
            </Form>

            {guestAccount && (
              <GuestAccountTip>
                <span>
                  访客账号：
                  <span style={{ fontWeight: 500, color: '#1f1f1f' }}>
                    {guestAccount.username}
                  </span>
                  <span style={{ marginLeft: 16 }}>
                    密码：
                    <span style={{ fontWeight: 500, color: '#1f1f1f' }}>
                      {guestAccount.password}
                    </span>
                  </span>
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: '#8c8c8c',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.color = '#1677ff')
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color = '#8c8c8c')
                  }
                  onClick={() =>
                    accountForm.setFieldsValue({
                      account: guestAccount.username,
                      password: guestAccount.password,
                    })
                  }
                >
                  一键填入
                </span>
              </GuestAccountTip>
            )}

            <Divider>其他登录方式</Divider>
            <SocialRow>
              <SocialButton>
                <Icon name="GithubFilled" style={{ fontSize: 22 }} />
                <span>GitHub 登录</span>
              </SocialButton>
              <SocialIcon data-tooltip="微信登录">
                <Icon
                  name="WechatFilled"
                  style={{ fontSize: 22, color: '#07c160' }}
                />
              </SocialIcon>
              <SocialIcon data-tooltip="支付宝登录">
                <Icon
                  name="AlipayCircleFilled"
                  style={{ fontSize: 22, color: '#1677ff' }}
                />
              </SocialIcon>
              <SocialIcon data-tooltip="更多">
                <Icon name="MoreOutlined" style={{ fontSize: 22 }} />
              </SocialIcon>
            </SocialRow>

            {registerEnabled && (
              <RegisterLink>
                没有账号？
                <a onClick={onNavigateRegister}>去注册</a>
              </RegisterLink>
            )}
          </>
        ) : (
          <>
            <Form
              name="phoneLogin"
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
                        color: countdown > 0 ? '#bfbfbf' : token.colorPrimary,
                        fontSize: 14,
                      }}
                    >
                      {countdown > 0 ? `${countdown}s后重发` : '获取验证码'}
                    </Button>
                  </Space.Compact>
                </Form.Item>

                <AgreementText>
                  登录视为您已阅读并同意{siteName}
                  <a>服务条款</a>和<a>隐私政策</a>
                </AgreementText>

                <Form.Item style={{ marginBottom: 16 }}>
                  <Button type="primary" htmlType="submit" block>
                    登录 / 注册
                  </Button>
                </Form.Item>
              </FormBody>
            </Form>

            <Divider>其他登录方式</Divider>
            <SocialRow>
              <SocialButton>
                <Icon name="GithubFilled" style={{ fontSize: 22 }} />
                <span>GitHub 登录</span>
              </SocialButton>
              <SocialIcon data-tooltip="微信登录">
                <Icon
                  name="WechatFilled"
                  style={{ fontSize: 22, color: '#07c160' }}
                />
              </SocialIcon>
              <SocialIcon data-tooltip="支付宝登录">
                <Icon
                  name="AlipayCircleFilled"
                  style={{ fontSize: 22, color: '#1677ff' }}
                />
              </SocialIcon>
              <SocialIcon data-tooltip="更多">
                <Icon name="MoreOutlined" style={{ fontSize: 22 }} />
              </SocialIcon>
            </SocialRow>
          </>
        )}
      </ContentArea>
    </Panel>
  );
};

export default LoginCard;

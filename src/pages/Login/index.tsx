import { resolveServerConfig } from '@/constants/settings';
import { login, queryMenus } from '@/services/auth';
import { getRuntimeConfig } from '@/services/config';
import { queryProfile } from '@/services/profile';
import { useAppStore, useAuthStore } from '@/stores';
import { decrypt, encrypt, logger } from '@/utils';
import {
  AlipayCircleFilled,
  GithubFilled,
  LockOutlined,
  UserOutlined,
  WechatFilled,
} from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Space, message } from 'antd';
import { useEffect, useState } from 'react';
import storetify from 'storetify';
import { FormattedMessage, useNavigate } from 'umi';
import LoginBg from './components/LoginBg';
import styles from './index.less';

const formItemLayout = {
  labelCol: {
    sm: { span: 4 },
  },
  wrapperCol: {
    sm: { span: 20 },
  },
};

const LoginPage: React.FC = () => {
  const siteName = useAppStore((s) => s.serverConfig.siteName);
  const [isLogging, setLogging] = useState(false);

  const [form] = Form.useForm();

  const navigate = useNavigate();

  const loadInitData = async () => {
    let runtimeConfig: Record<string, unknown> | undefined;
    try {
      const res = await getRuntimeConfig();
      runtimeConfig = res.data;
    } catch (error) {
      logger.error(error);
    }
    const [profileRes, menusRes] = await Promise.all([
      queryProfile({ skipErrorHandler: true }).catch(() => undefined),
      queryMenus().catch(() => undefined),
    ]);
    const profile = profileRes?.data;
    const menus = menusRes?.data;
    if (profile) {
      useAuthStore.getState().setAuth(profile, menus);
    }
    useAppStore.getState().setServerConfig(resolveServerConfig(runtimeConfig));
  };

  const handleSubmit = async (values: any) => {
    setLogging(true);
    if (values.rememberMe) {
      const { account, password, rememberMe } = values;
      storetify(
        'rememberMe',
        {
          account,
          password: encrypt(password),
          rememberMe,
        },
        60 * 60 * 24 * 30,
      );
    } else {
      storetify('rememberMe', undefined);
    }
    try {
      const res = await login({ ...values, rememberMe: undefined });
      storetify(__APP_API_TOKEN_KEY__, res.data.access_token);
      await loadInitData();
      message.success(res.message);
      navigate('/');
    } catch (error) {
      storetify(__APP_API_TOKEN_KEY__, undefined);
    } finally {
      setLogging(false);
    }
  };
  const loadRemember = () => {
    const { account, password, rememberMe } =
      (storetify('rememberMe') as any) || {};
    const values = form.getFieldsValue(['account', 'password', 'rememberMe']);
    const loginForm = {
      account: account === undefined ? values.account : account,
      password: password === undefined ? values.password : decrypt(password),
      rememberMe:
        rememberMe === undefined ? values.rememberMe : Boolean(rememberMe),
    };
    form.setFieldsValue(loginForm);
  };
  useEffect(() => {
    loadRemember();
  }, []);

  return (
    <div className={styles.page}>
      <LoginBg title={siteName}>
        <div className={styles.content}>
          <div className={styles.title}>欢迎开启新世界</div>
          <Form
            {...formItemLayout}
            form={form}
            name="login"
            size="large"
            initialValues={{ rememberMe: true }}
            onFinish={async (values) => {
              await handleSubmit(values);
            }}
          >
            <Form.Item
              name="account"
              label={<span>用户名</span>}
              colon={false}
              rules={[
                { required: true, message: '请您输入手机号/用户名/邮箱' },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="手机号/用户名/邮箱"
              />
            </Form.Item>
            <Form.Item
              name="password"
              label="密　码"
              colon={false}
              rules={[{ required: true, message: '请您输入密码' }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="密码"
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: '5px' }}>
              <Form.Item name="rememberMe" valuePropName="checked" noStyle>
                <Checkbox>
                  <FormattedMessage id={'pages.login.rememberMe'} />
                </Checkbox>
              </Form.Item>
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24 }}>
              <Button type="primary" htmlType="submit" block>
                {isLogging ? (
                  <FormattedMessage id={'pages.login.logging'} />
                ) : (
                  <FormattedMessage id={'pages.login.login'} />
                )}
              </Button>
            </Form.Item>
          </Form>
          <Space size={20} style={{ fontSize: '28px', color: '#888' }}>
            <span style={{ fontSize: '14px' }}>第三方账号登录</span>
            <GithubFilled />
            <AlipayCircleFilled />
            <WechatFilled />
          </Space>
        </div>
      </LoginBg>
    </div>
  );
};

export default LoginPage;

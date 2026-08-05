import { LOGIN_PATH } from '@/constants';
import LoginBg from '@/pages/Login/components/LoginBg';
import { runtimeConfig } from '@/utils/runtime-config';
import { ConfigProvider, message, Spin, theme } from 'antd';
import { useEffect } from 'react';
import { styled, useNavigate } from 'umi';
import RegisterCard from './components/RegisterCard';
import type { RegisterTab } from './model';
import { useRegisterModel } from './model';

const CardContainer = styled.div`
  position: relative;
  width: 100%;
`;

const LoadingMask = styled.div<{ visible?: boolean }>`
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.55);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  pointer-events: ${({ visible }) => (visible ? 'auto' : 'none')};
  transition: opacity 0.3s;
`;

/**
 * 注册页
 *
 * 全局 Provider（ConfigProvider、ThemeProvider、Intl 等）已由 rootContainer 统一注入，
 * 此处不再需要自行包裹。
 */
const RegisterPage: React.FC = () => {
  const { system, feature } = runtimeConfig.get();
  const siteName = system.name;
  const registerEnabled = feature.register;

  const navigate = useNavigate();

  useEffect(() => {
    if (!registerEnabled) {
      navigate(LOGIN_PATH, { replace: true });
    }
  }, [registerEnabled, navigate]);

  const {
    activeTab,
    setActiveTab,
    isRegistering,
    countdown,
    startCountdown,
    registerByAccount,
    registerByPhone,
  } = useRegisterModel();

  const handleAccountSubmit = async (values: any) => {
    const result = await registerByAccount(values);
    if (!result.success) {
      if (result.message) message.error(result.message);
      return;
    }

    message.success(result.message || '注册成功，请登录');
    navigate(LOGIN_PATH);
  };

  const handlePhoneSubmit = async (values: any) => {
    const result = await registerByPhone(values);
    if (!result.success) {
      if (result.message) message.error(result.message);
      return;
    }

    message.success(result.message || '注册成功，请登录');
    navigate(LOGIN_PATH);
  };

  const handleSendCode = () => {
    if (countdown > 0) return;
    startCountdown(60);
  };

  const handleTabChange = (tab: RegisterTab) => {
    setActiveTab(tab);
  };

  const handleNavigateLogin = () => {
    navigate(LOGIN_PATH);
  };

  return (
    <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
      <LoginBg title={siteName}>
        <CardContainer>
          <RegisterCard
            siteName={siteName}
            activeTab={activeTab}
            countdown={countdown}
            isRegistering={isRegistering}
            onTabChange={handleTabChange}
            onAccountSubmit={handleAccountSubmit}
            onPhoneSubmit={handlePhoneSubmit}
            onSendCode={handleSendCode}
            onNavigateLogin={handleNavigateLogin}
          />
          <LoadingMask visible={isRegistering}>
            <Spin />
          </LoadingMask>
        </CardContainer>
      </LoginBg>
    </ConfigProvider>
  );
};

export default RegisterPage;

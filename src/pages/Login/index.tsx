import { runtimeConfig } from '@/utils/runtime-config';
import { ConfigProvider, message, Spin, theme } from 'antd';
import { styled, useNavigate, useSearchParams } from 'umi';
import LoginBg from './components/LoginBg';
import LoginCard from './components/LoginCard';
import type { LoginTab } from './model';
import { useLoginModel } from './model';

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
 * 登录页
 *
 * 全局 Provider（ConfigProvider、ThemeProvider、Intl 等）已由 rootContainer 统一注入，
 * 此处不再需要自行包裹。
 */
const LoginPage: React.FC = () => {
  const { system, feature } = runtimeConfig.get();
  const siteName = system.name;
  const registerEnabled = feature.register;
  const guestAccount = feature.guestAccount;

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    activeTab,
    setActiveTab,
    isLogging,
    countdown,
    startCountdown,
    loadRemember,
    loginByAccount,
    loginByPhone,
  } = useLoginModel();

  const handleAccountSubmit = async (values: any) => {
    const result = await loginByAccount(values);
    if (!result.success) {
      if (result.message) message.error(result.message);
      return;
    }

    message.success(result.message || '登录成功');

    const redirect = searchParams.get('redirect');
    const safeRedirect =
      redirect && redirect.startsWith('/') && !redirect.startsWith('//')
        ? redirect
        : '/';
    navigate(safeRedirect);
  };

  const handlePhoneSubmit = async (values: any) => {
    await loginByPhone(values);
  };

  const handleSendCode = () => {
    if (countdown > 0) return;
    startCountdown(60);
  };

  const handleTabChange = (tab: LoginTab) => {
    setActiveTab(tab);
  };

  const handleNavigateRegister = () => {
    navigate('/register');
  };

  const rememberData = loadRemember();

  return (
    <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
      <LoginBg title={siteName}>
        <CardContainer>
          <LoginCard
            siteName={siteName}
            registerEnabled={registerEnabled}
            guestAccount={guestAccount}
            activeTab={activeTab}
            countdown={countdown}
            onTabChange={handleTabChange}
            onAccountSubmit={handleAccountSubmit}
            onPhoneSubmit={handlePhoneSubmit}
            onSendCode={handleSendCode}
            onNavigateRegister={handleNavigateRegister}
            initialAccountValues={rememberData}
          />
          <LoadingMask visible={isLogging}>
            <Spin />
          </LoadingMask>
        </CardContainer>
      </LoginBg>
    </ConfigProvider>
  );
};

export default LoginPage;

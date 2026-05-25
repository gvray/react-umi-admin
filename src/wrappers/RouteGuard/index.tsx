import { NavigationProgress } from '@/components';
import { useAuth, useRouteMeta } from '@/hooks';
import { Button, Result } from 'antd';
import { Outlet, styled } from 'umi';

// 403错误容器
const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px 20px;
`;

interface RouteGuardProps {
  children?: React.ReactNode;
  fallback?: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children, fallback }) => {
  const { isLogin, permissions: userPermissions } = useAuth();
  const { permissions: routePermissions } = useRouteMeta();

  // 权限检查
  if (isLogin && routePermissions && routePermissions.length > 0) {
    const hasPermission =
      userPermissions?.includes('*:*:*') ||
      routePermissions.every((permission) =>
        userPermissions?.includes(permission),
      );

    if (!hasPermission) {
      return (
        <ErrorContainer>
          <Result
            status="403"
            title="403"
            subTitle="抱歉，您没有权限访问此页面。"
            extra={
              <Button type="primary" onClick={() => window.history.back()}>
                返回上页
              </Button>
            }
          />
        </ErrorContainer>
      );
    }
  }

  // 自定义fallback
  if (fallback) {
    return (
      <>
        <NavigationProgress />
        {fallback}
      </>
    );
  }

  // 正常渲染
  return (
    <>
      <NavigationProgress />
      {children || <Outlet />}
    </>
  );
};

export default RouteGuard;

import { NavigationProgress } from '@/components';
import { useAuth } from '@/hooks';
import { Navigate, Outlet, useLocation } from 'umi';

interface RouteGuardProps {
  children?: React.ReactNode;
  requireAuth?: boolean;
  fallback?: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  requireAuth = true,
  fallback,
}) => {
  const { isLogin } = useAuth();
  const location = useLocation();

  // 需要登录但未登录，保存当前路径到 redirect 参数
  if (requireAuth && !isLogin) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
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

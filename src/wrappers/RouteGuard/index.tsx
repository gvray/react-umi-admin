import { NavigationProgress } from '@/components';
import { useAuth } from '@/hooks';
import { Navigate, Outlet } from 'umi';

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

  // 需要登录但未登录
  if (requireAuth && !isLogin) {
    return <Navigate to="/login" replace />;
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

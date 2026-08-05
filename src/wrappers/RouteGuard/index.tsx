import { useAuth } from '@/hooks';
import { useRouteMetaContext } from '@/providers';
import React from 'react';
import { Navigate, Outlet } from 'umi';

/**
 * 路由守卫：权限校验。
 *
 * 使用 useRouteMetaContext() 读取当前路由 meta，避免与 Layout 重复调用 useRouteMeta()。
 */
const RouteGuard: React.FC = () => {
  const { isLogin, permissions: userPermissions } = useAuth();
  const { permissions: routePermissions } = useRouteMetaContext();

  // 权限检查
  if (isLogin && routePermissions && routePermissions.length > 0) {
    const hasPermission =
      userPermissions?.includes('*:*:*') ||
      routePermissions.every((permission) =>
        userPermissions?.includes(permission),
      );

    if (!hasPermission) {
      return <Navigate to="/403" replace />;
    }
  }

  return <Outlet />;
};

export default RouteGuard;

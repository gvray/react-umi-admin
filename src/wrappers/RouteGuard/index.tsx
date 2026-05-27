import { useAuth, useRouteMeta } from '@/hooks';
import React from 'react';
import { Navigate, Outlet } from 'umi';

const RouteGuard: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
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
      return <Navigate to="/403" replace />;
    }
  }

  return <>{children || <Outlet />}</>;
};

export default RouteGuard;

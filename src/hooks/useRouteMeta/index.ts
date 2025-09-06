import routes from '@/../config/routes';
import { useLocation } from 'umi';

export interface RouteMeta {
  title?: string;
  permissions?: string[];
  icon?: string;
  hidden?: boolean;
  keepAlive?: boolean;
}

// 扩展路由类型定义
interface RouteWithMeta {
  path: string;
  component?: string;
  routes?: RouteWithMeta[];
  meta?: RouteMeta;
  [key: string]: any;
}

/**
 * 获取当前路由的meta信息
 */
export const useRouteMeta = (): RouteMeta => {
  const location = useLocation();

  // 递归查找匹配的路由
  const findRouteByPath = (
    routeList: RouteWithMeta[],
    pathname: string,
  ): RouteWithMeta | null => {
    for (const route of routeList) {
      // 精确匹配
      if (route.path === pathname) {
        return route;
      }

      // 动态路由匹配（如 /system/user-auth/role/:userId）
      if (route.path.includes(':')) {
        const routePattern = route.path.replace(/:[^/]+/g, '[^/]+');
        const regex = new RegExp(`^${routePattern}$`);
        if (regex.test(pathname)) {
          return route;
        }
      }

      // 递归查找子路由
      if (route.routes) {
        const found = findRouteByPath(route.routes, pathname);
        if (found) return found;
      }
    }
    return null;
  };

  const matchedRoute = findRouteByPath(
    routes as RouteWithMeta[],
    location.pathname,
  );
  console.log('当前路径:', location.pathname);
  console.log('匹配到的路由:', matchedRoute);
  console.log('路由meta:', matchedRoute?.meta);

  return matchedRoute?.meta || {};
};

/**
 * 获取当前路由的权限要求
 */
export const useRoutePermissions = (): string[] => {
  const meta = useRouteMeta();
  return meta.permissions || [];
};

/**
 * 获取当前路由的标题
 */
export const useRouteTitle = (): string => {
  const meta = useRouteMeta();
  return meta.title || '';
};

export default useRouteMeta;

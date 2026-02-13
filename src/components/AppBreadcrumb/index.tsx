import routes from '@/../config/routes';
import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import React, { useMemo } from 'react';
import { Link, useLocation } from 'umi';

interface RouteItem {
  path: string;
  meta?: { title?: string };
  routes?: RouteItem[];
  [key: string]: any;
}

interface BreadcrumbItem {
  title: React.ReactNode;
  path?: string;
}

/**
 * 根据当前 pathname 从路由配置中构建面包屑链。
 * 支持嵌套路由和动态路由参数（如 :userId）。
 */
function buildBreadcrumbs(
  pathname: string,
  routeList: RouteItem[],
): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [];

  const walk = (list: RouteItem[], segments: BreadcrumbItem[]): boolean => {
    for (const route of list) {
      if (!route.path) continue;

      // 动态路由匹配
      const pattern = route.path.replace(/:[^/]+/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      const isExact = regex.test(pathname);
      const isPrefix = pathname.startsWith(route.path.replace(/:[^/]+/g, ''));

      if (isExact || isPrefix) {
        if (route.meta?.title) {
          segments.push({
            title: route.meta.title,
            path: isExact ? undefined : route.path,
          });
        }

        if (isExact) {
          crumbs.push(...segments);
          return true;
        }

        if (route.routes && walk(route.routes, segments)) {
          return true;
        }

        // 回溯
        if (route.meta?.title) {
          segments.pop();
        }
      }
    }
    return false;
  };

  walk(routeList as RouteItem[], []);
  return crumbs;
}

const AppBreadcrumb: React.FC = () => {
  const location = useLocation();

  const breadcrumbs = useMemo(
    () => buildBreadcrumbs(location.pathname, routes as RouteItem[]),
    [location.pathname],
  );

  if (breadcrumbs.length === 0) return null;

  const items = [
    {
      title: (
        <Link to="/">
          <HomeOutlined />
        </Link>
      ),
    },
    ...breadcrumbs.map((crumb, index) => {
      const isLast = index === breadcrumbs.length - 1;
      return {
        title:
          !isLast && crumb.path ? (
            <Link to={crumb.path}>{crumb.title}</Link>
          ) : (
            crumb.title
          ),
      };
    }),
  ];

  return <Breadcrumb items={items} style={{ margin: '12px 16px' }} />;
};

export default AppBreadcrumb;

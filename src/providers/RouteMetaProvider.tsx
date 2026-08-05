import type { RouteMeta } from '@/hooks/useRouteMeta';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useContext } from 'react';

const RouteMetaContext = createContext<RouteMeta>({});

/**
 * 路由 Meta 上下文 Provider。
 *
 * 设计原则：
 * 1. 仅在 Layout 中调用一次 useRouteMeta() 计算当前路由 meta，作为数据源。
 * 2. 通过 context 分发给 Layout 内的所有子组件，避免多处重复遍历路由配置。
 * 3. layout: false 的页面（如登录页）不在 Provider 内部，需自行用 useRouteMeta() 兜底。
 */
export const RouteMetaProvider: FC<PropsWithChildren<{ meta: RouteMeta }>> = ({
  meta,
  children,
}) => {
  return (
    <RouteMetaContext.Provider value={meta}>
      {children}
    </RouteMetaContext.Provider>
  );
};

/**
 * 消费路由 Meta 上下文。
 *
 * ⚠️ 必须在 RouteMetaProvider 内部使用，否则返回 {}。
 */
export const useRouteMetaContext = (): RouteMeta =>
  useContext(RouteMetaContext);

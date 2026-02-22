import type { RouteMeta } from '@/hooks/useRouteMeta';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useContext } from 'react';

const RouteMetaContext = createContext<RouteMeta>({});

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

export const useRouteMetaContext = (): RouteMeta => {
  return useContext(RouteMetaContext);
};

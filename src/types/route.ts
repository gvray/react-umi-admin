// 路由meta信息类型定义
export interface RouteMeta {
  title?: string;
  permissions?: string[];
  icon?: string;
  hidden?: boolean;
  keepAlive?: boolean;
}

// 扩展路由对象类型
export interface RouteObject {
  path: string;
  component?: string;
  routes?: RouteObject[];
  meta?: RouteMeta;
  [key: string]: any;
}

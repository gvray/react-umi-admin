/**
 * 认证相关常量
 */

/**
 * 登录页面路径
 */
export const LOGIN_PATH = '/login';

/**
 * 免登录白名单页面
 * 即使未登录也可以直接访问的路径
 */
export const WHITE_LIST = [LOGIN_PATH, '/register', '/forget-password', '/404'];

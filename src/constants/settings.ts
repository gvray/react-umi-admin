/**
 * 服务端应用配置
 *
 * 数据来源：/system/runtime-config（无需登录即可获取）
 * 这些是运营 / 管理员在后台配置的全局参数，前端只读。
 * 与客户端 UI 偏好（主题、折叠等）无关，后者由 useAppStore 管理。
 */

export interface ServerConfig {
  /** 站点名称 */
  siteName: string;
  /** 站点 Logo URL */
  siteLogo: string;
}

/** 前端硬编码的兜底默认值 */
export const DEFAULT_SERVER_CONFIG: ServerConfig = {
  siteName: 'React Umi Admin',
  siteLogo: '',
};

/**
 * 从 runtimeConfig 中提取 ServerConfig，缺失字段用默认值兜底。
 */
export function resolveServerConfig(
  raw?: Record<string, unknown>,
): ServerConfig {
  if (!raw) return { ...DEFAULT_SERVER_CONFIG };

  return {
    siteName:
      typeof raw.siteName === 'string' && raw.siteName
        ? raw.siteName
        : DEFAULT_SERVER_CONFIG.siteName,
    siteLogo:
      typeof raw.siteLogo === 'string'
        ? raw.siteLogo
        : DEFAULT_SERVER_CONFIG.siteLogo,
  };
}

/**
 * 服务端运行时配置
 *
 * 数据来源：GET /system/runtime-config（无需登录即可获取）
 * 运营 / 管理员在后台配置的全局参数，前端只读、不持久化。
 */

// ─── 子类型 ─────────────────────────────────────────────

export interface SystemInfo {
  name: string;
  description: string;
  logo: string;
  favicon: string;
  defaultAvatar: string;
}

export interface EnvInfo {
  mode: string;
  apiPrefix: string;
}

export interface UiDefaults {
  theme: string;
  language: string;
  timezone: string;
  sidebarCollapsed: boolean;
  pageSize: number;
  welcomeMessage: string;
  showBreadcrumb: boolean;
}

export interface SecurityPolicy {
  watermarkEnabled: boolean;
  passwordMinLength: number;
  passwordRequireComplexity: boolean;
  loginFailureLockCount: number;
}

export interface Features {
  fileUploadMaxSize: number;
  fileUploadAllowedTypes: string;
  ossEnabled: boolean;
  emailEnabled: boolean;
  oauthGithubEnabled: boolean;
}

export interface Capabilities {
  totalUsers: number;
  totalRoles: number;
  totalPermissions: number;
}

// ─── 聚合类型 ───────────────────────────────────────────

export interface ServerConfig {
  system: SystemInfo;
  env: EnvInfo;
  uiDefaults: UiDefaults;
  securityPolicy: SecurityPolicy;
  features: Features;
  capabilities: Capabilities;
}

// ─── 默认值 ─────────────────────────────────────────────

export const DEFAULT_SERVER_CONFIG: ServerConfig = {
  system: {
    name: 'React Umi Admin',
    description: '',
    logo: '/logo.svg',
    favicon: '/favicon.ico',
    defaultAvatar: 'https://api.dicebear.com/9.x/bottts/svg?seed=GavinRay',
  },
  env: {
    mode: 'development',
    apiPrefix: '/api/v1',
  },
  uiDefaults: {
    theme: 'light',
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    sidebarCollapsed: false,
    pageSize: 10,
    welcomeMessage: '',
    showBreadcrumb: true,
  },
  securityPolicy: {
    watermarkEnabled: true,
    passwordMinLength: 6,
    passwordRequireComplexity: true,
    loginFailureLockCount: 5,
  },
  features: {
    fileUploadMaxSize: 10485760,
    fileUploadAllowedTypes: 'jpg,jpeg,png,gif,pdf,doc,docx,xls,xlsx',
    ossEnabled: false,
    emailEnabled: false,
    oauthGithubEnabled: false,
  },
  capabilities: {
    totalUsers: 0,
    totalRoles: 0,
    totalPermissions: 0,
  },
};

// ─── 解析函数 ───────────────────────────────────────────

const str = (v: unknown, fallback: string): string =>
  typeof v === 'string' && v ? v : fallback;
const bool = (v: unknown, fallback: boolean): boolean =>
  typeof v === 'boolean' ? v : fallback;
const num = (v: unknown, fallback: number): number =>
  typeof v === 'number' ? v : fallback;

/**
 * 从 runtime-config 的 data 中安全提取 ServerConfig，缺失字段用默认值兜底。
 */
export function resolveServerConfig(raw?: Record<string, any>): ServerConfig {
  if (!raw) return { ...DEFAULT_SERVER_CONFIG };

  const d = DEFAULT_SERVER_CONFIG;
  const s = raw.system ?? {};
  const e = raw.env ?? {};
  const u = raw.uiDefaults ?? {};
  const sp = raw.securityPolicy ?? {};
  const f = raw.features ?? {};
  const c = raw.capabilities ?? {};

  return {
    system: {
      name: str(s.name, d.system.name),
      description: str(s.description, d.system.description),
      logo: str(s.logo, d.system.logo),
      favicon: str(s.favicon, d.system.favicon),
      defaultAvatar: str(s.defaultAvatar, d.system.defaultAvatar),
    },
    env: {
      mode: str(e.mode, d.env.mode),
      apiPrefix: str(e.apiPrefix, d.env.apiPrefix),
    },
    uiDefaults: {
      theme: str(u.theme, d.uiDefaults.theme),
      language: str(u.language, d.uiDefaults.language),
      timezone: str(u.timezone, d.uiDefaults.timezone),
      sidebarCollapsed: bool(u.sidebarCollapsed, d.uiDefaults.sidebarCollapsed),
      pageSize: num(u.pageSize, d.uiDefaults.pageSize),
      welcomeMessage: str(u.welcomeMessage, d.uiDefaults.welcomeMessage),
      showBreadcrumb: bool(u.showBreadcrumb, d.uiDefaults.showBreadcrumb),
    },
    securityPolicy: {
      watermarkEnabled: bool(
        sp.watermarkEnabled,
        d.securityPolicy.watermarkEnabled,
      ),
      passwordMinLength: num(
        sp.passwordMinLength,
        d.securityPolicy.passwordMinLength,
      ),
      passwordRequireComplexity: bool(
        sp.passwordRequireComplexity,
        d.securityPolicy.passwordRequireComplexity,
      ),
      loginFailureLockCount: num(
        sp.loginFailureLockCount,
        d.securityPolicy.loginFailureLockCount,
      ),
    },
    features: {
      fileUploadMaxSize: num(f.fileUploadMaxSize, d.features.fileUploadMaxSize),
      fileUploadAllowedTypes: str(
        f.fileUploadAllowedTypes,
        d.features.fileUploadAllowedTypes,
      ),
      ossEnabled: bool(f.ossEnabled, d.features.ossEnabled),
      emailEnabled: bool(f.emailEnabled, d.features.emailEnabled),
      oauthGithubEnabled: bool(
        f.oauthGithubEnabled,
        d.features.oauthGithubEnabled,
      ),
    },
    capabilities: {
      totalUsers: num(c.totalUsers, d.capabilities.totalUsers),
      totalRoles: num(c.totalRoles, d.capabilities.totalRoles),
      totalPermissions: num(
        c.totalPermissions,
        d.capabilities.totalPermissions,
      ),
    },
  };
}

import storetify from 'storetify';

// 从环境变量获取 token key
const ACCESS_TOKEN_KEY = `${__APP_API_TOKEN_KEY__}_access`;
const REFRESH_TOKEN_KEY = `${__APP_API_TOKEN_KEY__}_refresh`;

/**
 * Token 管理工具
 */
export const tokenManager = {
  /**
   * 设置 access token 和过期时间
   */
  setAccessToken(token: string, expiresIn?: number) {
    storetify.set(ACCESS_TOKEN_KEY, token, expiresIn);
  },

  /**
   * 获取 access token
   */
  getAccessToken(): string | null {
    const token = storetify.get(ACCESS_TOKEN_KEY);
    return typeof token === 'string' ? token : null;
  },

  /**
   * 检查 access token 是否过期
   */
  isAccessTokenExpired(): boolean {
    return !storetify.has(ACCESS_TOKEN_KEY);
  },

  /**
   * 设置 refresh token 和过期时间
   */
  setRefreshToken(token: string, expiresIn?: number) {
    storetify.set(REFRESH_TOKEN_KEY, token, expiresIn);
  },

  /**
   * 获取 refresh token
   */
  getRefreshToken(): string | null {
    const token = storetify.get(REFRESH_TOKEN_KEY);
    return typeof token === 'string' ? token : null;
  },

  /**
   * 检查 refresh token 是否过期
   */
  isRefreshTokenExpired(): boolean {
    return !storetify.has(REFRESH_TOKEN_KEY);
  },

  /**
   * 同时设置 access token 和 refresh token（后端登录返回）
   */
  setTokens(
    accessToken: string,
    refreshToken: string,
    accessTokenExpiresIn?: number,
    refreshTokenExpiresIn?: number,
  ) {
    this.setAccessToken(accessToken, accessTokenExpiresIn);
    this.setRefreshToken(refreshToken, refreshTokenExpiresIn);
  },

  /**
   * 检查是否已登录（有 access token 且未过期）
   */
  isAuthenticated(): boolean {
    return storetify.has(ACCESS_TOKEN_KEY);
  },

  /**
   * 清除所有 token
   */
  clearTokens() {
    storetify.remove(ACCESS_TOKEN_KEY);
    storetify.remove(REFRESH_TOKEN_KEY);
  },
};

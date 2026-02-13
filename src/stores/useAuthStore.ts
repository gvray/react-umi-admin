import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface AuthStore {
  profile: API.CurrentUserResponseDto | undefined;
  menus: API.MenuResponseDto[] | undefined;

  /** 是否已登录 */
  isLogin: boolean;
  /** 权限代码列表 */
  permissions: string[];

  setProfile: (profile: API.CurrentUserResponseDto | undefined) => void;
  setMenus: (menus: API.MenuResponseDto[] | undefined) => void;
  /** 登录后一次性设置 profile + menus */
  setAuth: (
    profile: API.CurrentUserResponseDto,
    menus: API.MenuResponseDto[] | undefined,
  ) => void;
  /** 退出登录，清空所有认证状态 */
  clearAuth: () => void;
}

export const useAuthStore = create(
  immer<AuthStore>((set) => ({
    profile: undefined,
    menus: undefined,
    isLogin: false,
    permissions: [],

    setProfile: (profile) =>
      set((state) => {
        state.profile = profile as any;
        state.isLogin = !!profile;
        state.permissions = profile?.permissionCodes || [];
      }),
    setMenus: (menus) =>
      set((state) => {
        state.menus = menus as any;
      }),
    setAuth: (profile, menus) =>
      set((state) => {
        state.profile = profile as any;
        state.menus = menus as any;
        state.isLogin = true;
        state.permissions = profile?.permissionCodes || [];
      }),
    clearAuth: () =>
      set((state) => {
        state.profile = undefined;
        state.menus = undefined;
        state.isLogin = false;
        state.permissions = [];
      }),
  })),
);

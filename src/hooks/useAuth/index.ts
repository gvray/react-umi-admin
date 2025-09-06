import { each } from '@gvray/eskit';
import storetify from 'storetify';
import { useModel } from 'umi';
import { useDeepCompareMemo } from 'use-compare';

const useAuth = () => {
  const { initialState } = useModel('@@initialState');

  // 判断是否是登陆状态
  const isLogin = !!storetify(__APP_API_TOKEN_KEY__) && !!initialState?.profile;
  const profile = initialState?.profile;
  // 获取用户权限（从profile中提取）
  const roles = profile?.roles;

  const permissions = useDeepCompareMemo(() => {
    if (isLogin && profile) {
      const perSet = new Set<string>();
      each(roles, (role: any) => {
        each(role.permissions, (permission: any) => {
          perSet.add(permission.code);
        });
      });
      return Array.from(perSet);
    }
    return [];
  }, [roles]);

  return {
    isLogin,
    profile,
    permissions,
  };
};

export default useAuth;

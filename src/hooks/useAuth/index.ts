import { useAuthStore } from '@/stores';

const useAuth = () => {
  const { isLogin, profile, permissions } = useAuthStore();

  return {
    isLogin,
    profile,
    permissions,
  };
};

export default useAuth;

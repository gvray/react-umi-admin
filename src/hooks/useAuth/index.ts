import storetify from 'storetify';
import { useModel } from 'umi';

const useAuth = () => {
  const { initialState } = useModel('@@initialState');
  // 判断是否是登陆状态
  const isLogin = !!storetify(__APP_API_TOKEN_KEY__) && !!initialState?.profile;

  return { isLogin };
};

export default useAuth;

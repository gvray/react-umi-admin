import { useAuth } from '@/hooks';
import { Navigate, Outlet } from 'umi';
// TODO: 路由守卫
const RouteGuard: React.FC = (props) => {
  console.log('路由守卫', props);
  const { isLogin } = useAuth();
  if (isLogin) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default RouteGuard;

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useEffect, useRef } from 'react';
import { history, useLocation } from 'umi';
import './nprogress-override.less';

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  speed: 300,
  minimum: 0.08,
  trickleSpeed: 200,
});

const NavigationProgress: React.FC = () => {
  const location = useLocation();
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    // Listen for route change start
    const unlisten = history.listen(({ location: nextLocation }) => {
      if (nextLocation.pathname !== prevPath.current) {
        NProgress.start();
      }
    });
    return unlisten;
  }, []);

  useEffect(() => {
    // Route rendered — finish the bar
    NProgress.done();
    prevPath.current = location.pathname;
  }, [location.pathname]);

  return null;
};

export default NavigationProgress;

import { useEffect } from 'react';
import { history } from 'umi';
import { progress } from './progress';

export const NProgress = progress;

const NavigationProgress = () => {
  useEffect(() => {
    let timer: any = null;

    const unlisten = history.listen(() => {
      if (timer) clearTimeout(timer);

      NProgress.start();

      timer = setTimeout(() => {
        NProgress.finish();
      }, 80);
    });

    return () => {
      if (timer) clearTimeout(timer);
      NProgress.finish();
      unlisten();
    };
  }, []);

  return null;
};

export default NavigationProgress;

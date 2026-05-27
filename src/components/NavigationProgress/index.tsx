import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import React, { useEffect } from 'react';
import { history } from 'umi';

const NavigationProgress: React.FC = () => {
  useEffect(() => {
    NProgress.configure({
      showSpinner: false,
      trickleSpeed: 200,
      minimum: 0.08,
    });

    let timer: NodeJS.Timeout | null = null;
    let minDisplayTimer: NodeJS.Timeout | null = null;

    const startProgress = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        NProgress.start();
        minDisplayTimer = setTimeout(() => {
          NProgress.done();
        }, 300);
      }, 200);
    };

    const stopProgress = () => {
      if (timer) clearTimeout(timer);
      if (minDisplayTimer) clearTimeout(minDisplayTimer);
      NProgress.done();
    };

    // Start NProgress on route change start
    const unlisten = history.listen(() => {
      startProgress();
    });

    // Stop NProgress on initial load or when component unmounts
    stopProgress();

    return () => {
      unlisten();
      stopProgress();
    };
  }, []);

  return null;
};

export default NavigationProgress;

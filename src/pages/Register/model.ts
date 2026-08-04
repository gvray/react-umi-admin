import { register } from '@/services/auth';
import { useCallback, useEffect, useState } from 'react';

export type RegisterTab = 'account' | 'phone';

export interface RegisterResult {
  success: boolean;
  message?: string;
}

export function useRegisterModel() {
  const [activeTab, setActiveTab] = useState<RegisterTab>('account');
  const [isRegistering, setIsRegistering] = useState(false);
  const [countdown, setCountdown] = useState(0);

  /* ---------- 倒计时 ---------- */
  const startCountdown = useCallback((seconds = 60) => {
    setCountdown(seconds);
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  /* ---------- 账号注册 ---------- */
  const registerByAccount = useCallback(
    async (values: any): Promise<RegisterResult> => {
      setIsRegistering(true);
      try {
        const res = await register({
          username: values.username,
          nickname: values.nickname,
          email: values.email,
          password: values.password,
        });

        return { success: true, message: res.message };
      } catch (error: any) {
        return {
          success: false,
          message: error?.message || '注册失败',
        };
      } finally {
        setIsRegistering(false);
      }
    },
    [],
  );

  /* ---------- 手机号注册 ---------- */
  const registerByPhone = useCallback(
    async (values: any): Promise<RegisterResult> => {
      // TODO: 手机号注册功能开发中
      console.log('手机号注册:', values);
      return { success: false, message: '手机号注册功能开发中' };
    },
    [],
  );

  return {
    activeTab,
    setActiveTab,
    isRegistering,
    countdown,
    startCountdown,
    registerByAccount,
    registerByPhone,
  };
}

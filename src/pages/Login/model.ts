import { buildPreferences } from '@/constants/runtime-settings';
import { login, queryMe, queryMenus } from '@/services/auth';
import { getDictionaryItemsByTypeCodes } from '@/services/dictionary';
import { getRuntimeConfig } from '@/services/system';
import { useAuthStore, useDictStore, useSettingStore } from '@/stores';
import { decrypt, encrypt, logger, tokenManager } from '@/utils';
import { runtimeConfig } from '@/utils/runtime-config';
import { useCallback, useEffect, useState } from 'react';
import storetify from 'storetify';

export type LoginTab = 'account' | 'phone';

export interface RememberData {
  account?: string;
  password?: string;
  rememberMe?: boolean;
}

export interface LoginResult {
  success: boolean;
  message?: string;
}

export function useLoginModel() {
  const [activeTab, setActiveTab] = useState<LoginTab>('account');
  const [isLogging, setIsLogging] = useState(false);
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

  /* ---------- 记住密码 ---------- */
  const loadRemember = useCallback((): RememberData | undefined => {
    const { account, password, rememberMe } =
      (storetify('rememberMe') as any) || {};
    if (!account) return undefined;
    return {
      account,
      password: password ? decrypt(password) : undefined,
      rememberMe: Boolean(rememberMe),
    };
  }, []);

  const saveRemember = useCallback(
    (values: { account: string; password: string; rememberMe: boolean }) => {
      storetify(
        'rememberMe',
        {
          account: values.account,
          password: encrypt(values.password),
          rememberMe: values.rememberMe,
        },
        60 * 60 * 24 * 30,
      );
    },
    [],
  );

  const clearRemember = useCallback(() => {
    storetify('rememberMe', undefined);
  }, []);

  /* ---------- 登录后初始化 ---------- */
  const loadInitData = useCallback(async () => {
    let runtimeConfigData: Record<string, unknown> | undefined;
    try {
      const res = await getRuntimeConfig();
      runtimeConfigData = res.data;
    } catch (error) {
      logger.error(error);
    }

    const [meRes, menusRes] = await Promise.all([
      queryMe({ skipErrorHandler: true }).catch(() => undefined),
      queryMenus().catch(() => undefined),
    ]);
    const me = meRes?.data;
    const menus = menusRes?.data;

    runtimeConfig.set(runtimeConfigData);

    useSettingStore.setState({
      ...buildPreferences(runtimeConfig.get().ui),
      ...(me?.preferences || {}),
    });

    if (me) {
      useAuthStore.getState().setAuth(me, menus);
    }
  }, []);

  /* ---------- 预加载字典 ---------- */
  const preloadDict = useCallback(async () => {
    try {
      if (!useDictStore.getState().getDict('common_status')) {
        const dictRes = await getDictionaryItemsByTypeCodes({
          typeCodes: 'common_status',
        });
        if (dictRes.data?.common_status) {
          useDictStore
            .getState()
            .setDict('common_status', dictRes.data.common_status);
        }
      }
    } catch (error) {
      logger.error('预加载 common_status 字典失败', error);
    }
  }, []);

  /* ---------- 账号登录 ---------- */
  const loginByAccount = useCallback(
    async (values: any): Promise<LoginResult> => {
      setIsLogging(true);

      if (values.rememberMe) {
        saveRemember({
          account: values.account,
          password: values.password,
          rememberMe: values.rememberMe,
        });
      } else {
        clearRemember();
      }

      try {
        const res = await login({ ...values, rememberMe: undefined });
        tokenManager.setTokens(
          res.data.access_token,
          res.data.refresh_token,
          res.data.access_token_expires_in,
          res.data.refresh_token_expires_in,
        );

        await loadInitData();
        await preloadDict();

        return { success: true, message: res.message };
      } catch (error: any) {
        tokenManager.clearTokens();
        return {
          success: false,
          message: error?.details?.status === 401 ? error.message : undefined,
        };
      } finally {
        setIsLogging(false);
      }
    },
    [saveRemember, clearRemember, loadInitData, preloadDict],
  );

  /* ---------- 手机号登录 ---------- */
  const loginByPhone = useCallback(
    async (values: any): Promise<LoginResult> => {
      // TODO: 手机号登录功能开发中
      console.log('手机号登录:', values);
      return { success: false };
    },
    [],
  );

  return {
    activeTab,
    setActiveTab,
    isLogging,
    countdown,
    startCountdown,
    loadRemember,
    loginByAccount,
    loginByPhone,
  };
}

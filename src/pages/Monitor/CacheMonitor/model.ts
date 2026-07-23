import {
  clearCache,
  queryCacheHealth,
  queryCacheKeys,
  queryCacheStats,
} from '@/services/cacheMonitor';
import { logger } from '@/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useCacheMonitorModel = () => {
  const [health, setHealth] = useState<boolean | null>(null);
  const [stats, setStats] = useState<API.CacheStatsDto | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchHealth = useCallback(async () => {
    try {
      const res = await queryCacheHealth();
      setHealth(res.data ?? false);
    } catch (err) {
      logger.error(err);
      setHealth(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await queryCacheStats();
      if (res.data) {
        setStats(res.data);
      }
    } catch (err) {
      logger.error(err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchCacheKeys = useCallback(
    (params?: API.MonitorGetCacheKeysParams) => {
      return queryCacheKeys(params);
    },
    [],
  );

  const handleClearCache = useCallback(async (pattern?: string) => {
    const res = await clearCache({ pattern });
    return res.data ?? null;
  }, []);

  const refresh = useCallback(() => {
    fetchHealth();
    fetchStats();
  }, [fetchHealth, fetchStats]);

  // 自动刷新
  useEffect(() => {
    if (autoRefresh) {
      timerRef.current = setInterval(() => {
        refresh();
      }, 5000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [autoRefresh, refresh]);

  // 初始加载
  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    health,
    stats,
    statsLoading,
    error,
    autoRefresh,
    setAutoRefresh,
    refresh,
    fetchCacheKeys,
    handleClearCache,
  };
};

import {
  OperationLogListResponse,
  OperationLogQueryParams,
  getOperationLogs,
} from '@/services/operationLog';
import { useEffect, useState } from 'react';

export const useOperationLogs = (params?: OperationLogQueryParams) => {
  const [data, setData] = useState<OperationLogListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getOperationLogs(params);
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(params)]);

  return {
    data,
    loading,
    error,
    refresh: fetchData,
  };
};

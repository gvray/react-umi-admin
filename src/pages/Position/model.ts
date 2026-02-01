import { deletePosition, getPosition, listPosition } from '@/services/position';
import { useCallback, useState } from 'react';

export const usePosition = () => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const getList = useCallback(async (params?: any) => {
    return listPosition(params);
  }, []);

  const getDetail = useCallback(async (positionId: number) => {
    setLoading(true);
    try {
      const res: any = await getPosition(positionId);
      return res.data ?? res;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteItem = useCallback(async (positionId: number) => {
    setSubmitting(true);
    try {
      await deletePosition(positionId);
    } finally {
      setSubmitting(false);
    }
  }, []);

  return {
    loading,
    submitting,
    getList,
    getDetail,
    deleteItem,
  };
};

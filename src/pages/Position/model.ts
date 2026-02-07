import { deletePosition, getPosition, listPosition } from '@/services/position';
import { useCallback, useState } from 'react';

export const usePosition = () => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const getList = useCallback(async (params?: API.PositionsFindAllParams) => {
    return listPosition(params);
  }, []);

  const getDetail = useCallback(async (positionId: string) => {
    setLoading(true);
    try {
      const { data } = await getPosition(positionId);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteItem = useCallback(async (positionId: string) => {
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

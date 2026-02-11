import {
  deletePosition,
  getPositionById,
  queryPositionList,
} from '@/services/position';
import { useCallback, useState } from 'react';

export const usePosition = () => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const getList = useCallback(async (params?: API.PositionsFindAllParams) => {
    return queryPositionList(params);
  }, []);

  const getDetail = useCallback(async (positionId: string) => {
    setLoading(true);
    try {
      const { data } = await getPositionById(positionId);
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

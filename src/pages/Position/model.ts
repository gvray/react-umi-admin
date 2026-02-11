import {
  deletePosition,
  getPositionById,
  queryPositionList,
} from '@/services/position';
import { useCallback } from 'react';

export const usePosition = () => {
  const fetchPositionList = useCallback(
    async (params?: API.PositionsFindAllParams) => {
      return queryPositionList(params);
    },
    [],
  );

  const fetchPositionDetail = useCallback(async (positionId: string) => {
    const { data } = await getPositionById(positionId);
    return data;
  }, []);

  const removePosition = useCallback(async (positionId: string) => {
    await deletePosition(positionId);
  }, []);

  return {
    fetchPositionList,
    fetchPositionDetail,
    removePosition,
  };
};

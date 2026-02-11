import {
  deleteDictionaryItem,
  getDictionaryItemById,
  getDictionaryTypeById,
  queryDictionaryItemList,
} from '@/services/dictionary';
import { useCallback, useState } from 'react';

export const useDictionaryItems = () => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [typeDetail, setTypeDetail] =
    useState<API.DictionaryTypeResponseDto | null>(null);

  const getTypeDetail = useCallback(async (typeId: string) => {
    setLoading(true);
    try {
      const { data } = await getDictionaryTypeById(typeId);
      setTypeDetail(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const getList = useCallback(
    async (
      typeCode: string,
      params?: API.DictionariesFindAllDictionaryItemsParams,
    ) => {
      return queryDictionaryItemList({ ...params, typeCode });
    },
    [],
  );

  const getItemDetail = useCallback(async (itemId: string) => {
    setLoading(true);
    try {
      const { data } = await getDictionaryItemById(itemId);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteItem = useCallback(async (itemId: string) => {
    setSubmitting(true);
    try {
      await deleteDictionaryItem(itemId);
    } finally {
      setSubmitting(false);
    }
  }, []);

  return {
    loading,
    submitting,
    typeDetail,
    getTypeDetail,
    getList,
    getItemDetail,
    deleteItem,
  };
};

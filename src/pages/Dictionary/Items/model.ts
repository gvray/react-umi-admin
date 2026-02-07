import {
  deleteDictionaryItem,
  getDictionaryItem,
  getDictionaryType,
  listDictionaryItem,
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
      const { data } = await getDictionaryType(typeId);
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
      return listDictionaryItem({ ...params, typeCode });
    },
    [],
  );

  const getItemDetail = useCallback(async (itemId: string) => {
    setLoading(true);
    try {
      const { data } = await getDictionaryItem(itemId);
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

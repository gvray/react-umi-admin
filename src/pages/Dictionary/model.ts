import {
  deleteDictionaryType,
  getDictionaryType,
  listDictionaryType,
} from '@/services/dictionary';
import { useCallback, useState } from 'react';

export const useDictionary = () => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const getList = useCallback(
    async (params?: API.DictionariesFindAllDictionaryTypesParams) => {
      return listDictionaryType(params);
    },
    [],
  );

  const getDetail = useCallback(async (typeId: string) => {
    setLoading(true);
    try {
      const { data } = await getDictionaryType(typeId);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteType = useCallback(async (typeId: string) => {
    setSubmitting(true);
    try {
      await deleteDictionaryType(typeId);
    } finally {
      setSubmitting(false);
    }
  }, []);

  return {
    loading,
    submitting,
    getList,
    getDetail,
    deleteType,
  };
};

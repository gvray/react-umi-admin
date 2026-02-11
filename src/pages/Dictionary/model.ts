import {
  deleteDictionaryType,
  getDictionaryTypeById,
  queryDictionaryTypeList,
} from '@/services/dictionary';
import { useCallback } from 'react';

export const useDictionary = () => {
  const fetchDictionaryTypeList = useCallback(
    async (params?: API.DictionariesFindAllDictionaryTypesParams) => {
      return queryDictionaryTypeList(params);
    },
    [],
  );

  const fetchDictionaryTypeDetail = useCallback(async (typeId: string) => {
    const { data } = await getDictionaryTypeById(typeId);
    return data;
  }, []);

  const removeDictionaryType = useCallback(async (typeId: string) => {
    await deleteDictionaryType(typeId);
  }, []);

  return {
    fetchDictionaryTypeList,
    fetchDictionaryTypeDetail,
    removeDictionaryType,
  };
};

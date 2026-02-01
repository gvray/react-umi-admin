import {
  deleteDictionaryType,
  getDictionaryType,
  listDictionaryType,
} from '@/services/dictionary';
import { useCallback, useState } from 'react';

export interface DictionaryTypeData {
  typeId: string;
  code: string;
  name: string;
  description?: string;
  status: number;
  sort: number;
  remark?: string;
  items?: any[];
  createdAt: string;
  updatedAt: string;
}

export const useDictionary = () => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const getList = useCallback(async (params?: any) => {
    return listDictionaryType(params);
  }, []);

  const getDetail = useCallback(async (typeId: string) => {
    setLoading(true);
    try {
      const res: any = await getDictionaryType(typeId);
      return res.data;
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

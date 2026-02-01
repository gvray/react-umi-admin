import {
  deleteDictionaryItem,
  getDictionaryItem,
  getDictionaryType,
  listDictionaryItem,
} from '@/services/dictionary';
import { useCallback, useState } from 'react';

export interface DictionaryItemData {
  itemId: string;
  typeCode: string;
  value: string;
  label: string;
  description?: string;
  status: number;
  sort: number;
  remark?: string;
  createdAt: string;
  updatedAt: string;
}

export const useDictionaryItems = () => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [typeDetail, setTypeDetail] = useState<any>(null);

  const getTypeDetail = useCallback(async (typeId: string) => {
    setLoading(true);
    try {
      const res: any = await getDictionaryType(typeId);
      setTypeDetail(res.data);
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const getList = useCallback(async (typeCode: string, params?: any) => {
    return listDictionaryItem(typeCode, params);
  }, []);

  const getItemDetail = useCallback(async (itemId: string) => {
    setLoading(true);
    try {
      const res: any = await getDictionaryItem(itemId);
      return res.data;
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

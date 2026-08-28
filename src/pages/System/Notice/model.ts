import {
  batchDeleteNotices,
  deleteNotice,
  getNoticeById,
  queryNoticeList,
} from '@/services/notice';
import { useCallback, useState } from 'react';

export const useNoticeModel = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const fetchNoticeList = useCallback(
    (params?: API.NoticesFindAllParams) => queryNoticeList(params),
    [],
  );

  const fetchNoticeDetail = useCallback(async (noticeId: string) => {
    const { data } = await getNoticeById(noticeId);
    return data;
  }, []);

  const removeNotice = useCallback(async (noticeId: string) => {
    await deleteNotice(noticeId);
  }, []);

  const batchRemoveNotices = useCallback(async (ids: string[]) => {
    await batchDeleteNotices({ ids });
  }, []);

  return {
    fetchNoticeList,
    fetchNoticeDetail,
    removeNotice,
    batchRemoveNotices,
    selectedRowKeys,
    setSelectedRowKeys,
  };
};

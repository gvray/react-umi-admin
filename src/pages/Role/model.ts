import { getPermissionTree } from '@/services/permission';
import { useEffect, useState } from 'react';

const useUpdataFormModel = (open: boolean) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const getPermissions = async () => {
    try {
      setLoading(true);
      const res = await getPermissionTree();
      if (res.data) {
        setData(res.data.tree);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (open) {
      getPermissions();
    }
  }, [open]);
  return {
    data,
    loading,
    reload: getPermissions,
  };
};

export default useUpdataFormModel;

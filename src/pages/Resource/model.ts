import { listResources } from '@/services/resource';
import { useEffect } from 'react';

export const useResourceModel = () => {
  const getResourceList = async () => {
    const res = await listResources();
    console.log(res);
  };
  useEffect(() => {
    getResourceList();
  }, []);
  return {
    reload: getResourceList,
  };
};

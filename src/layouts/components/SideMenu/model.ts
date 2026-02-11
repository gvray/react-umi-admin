import { queryMenus } from '@/services/auth';
import { MenuProps } from 'antd';
import { useEffect, useState } from 'react';

export const useMenuModel = () => {
  const [menus, setMenus] = useState<MenuProps['items']>([]);
  const [loading, setLoading] = useState(true);
  const getMenuList = async () => {
    try {
      setLoading(true);
      const res = await queryMenus();
      if (res.data) {
        setMenus(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getMenuList();
  }, []);
  return {
    loading,
    menus,
    reload: getMenuList,
  };
};

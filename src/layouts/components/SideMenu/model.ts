import { getMenus } from '@/services/resource';
import { MenuProps } from 'antd';
import { useEffect, useState } from 'react';

export const useMenuModel = () => {
  const [menus, setMenus] = useState<MenuProps['items']>([]);
  const [loading, setLoading] = useState(true);
  const getMenuList = async () => {
    try {
      setLoading(true);
      const res = await getMenus();
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

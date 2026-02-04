import AntIcon from '@/components/AntIcon';
import { Layout, Menu, MenuProps, Skeleton } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { history, useLocation } from 'umi';
import Logo from '../Logo';
import { useMenuModel } from './model';

const { Sider } = Layout;

interface SideMenuProps {
  collapsed: boolean;
}

const SideMenu: React.FC<SideMenuProps> = ({ collapsed }) => {
  const [current, setCurrent] = useState('');

  const { loading, menus } = useMenuModel();

  const location = useLocation();

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    history.push(e.key);
  };

  const transformMenuItems = (menuData: any[]): MenuProps['items'] => {
    return menuData?.map((item: any) => {
      const menuItem: any = {
        key: item.meta?.path || item.key,
        icon: item.meta?.icon ? <AntIcon icon={item.meta.icon} /> : null,
        label: item.name || item.label,
      };

      // 递归处理子菜单
      if (item.children && item.children.length > 0) {
        menuItem.children = transformMenuItems(item.children);
      }

      return menuItem;
    });
  };

  const items = useMemo(() => {
    return transformMenuItems(menus || []);
  }, [menus]);

  useEffect(() => {
    setCurrent(location.pathname.split('/')[1]);
  }, [location.pathname]);

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      theme={loading ? 'light' : 'dark'}
    >
      <Logo theme={loading ? 'light' : 'dark'} collapsed={collapsed} />
      <Skeleton loading={loading} active round style={{ padding: '15px' }}>
        <Menu
          inlineIndent={10}
          defaultOpenKeys={['/system']}
          theme={loading ? 'light' : 'dark'}
          mode="inline"
          onClick={handleMenuClick}
          selectedKeys={[current]}
          items={items}
        />
      </Skeleton>
    </Sider>
  );
};

export default SideMenu;

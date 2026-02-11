import AntIcon from '@/components/AntIcon';
import type { SiderTheme } from '@/stores/useSettingsStore';
import { Layout, Menu, MenuProps, Skeleton } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { history, useLocation } from 'umi';
import Logo from '../Logo';
import { useMenuModel } from './model';

const { Sider } = Layout;

interface SideMenuProps {
  collapsed: boolean;
  theme?: SiderTheme;
  width?: number;
  collapsedWidth?: number;
  showLogo?: boolean;
}

const SideMenu: React.FC<SideMenuProps> = ({
  collapsed,
  theme = 'dark',
  width = 220,
  collapsedWidth = 64,
  showLogo = true,
}) => {
  const { loading, menus } = useMenuModel();

  const location = useLocation();
  const [openKeys, setOpenKeys] = useState<string[]>([]);

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

  // Compute openKeys from current pathname, e.g. /system/user -> ['/system']
  useEffect(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    const keys: string[] = [];
    let path = '';
    // Build all ancestor paths except the leaf
    for (let i = 0; i < segments.length - 1; i++) {
      path += '/' + segments[i];
      keys.push(path);
    }
    setOpenKeys((prev) => {
      const merged = new Set([...prev, ...keys]);
      return Array.from(merged);
    });
  }, [location.pathname]);

  const siderTheme = loading ? 'light' : theme;

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={width}
      collapsedWidth={collapsedWidth}
      theme={siderTheme}
    >
      {showLogo && <Logo theme={siderTheme} collapsed={collapsed} />}
      <Skeleton loading={loading} active round style={{ padding: '15px' }}>
        <Menu
          inlineIndent={10}
          openKeys={openKeys}
          onOpenChange={(keys) => setOpenKeys(keys as string[])}
          theme={siderTheme}
          mode="inline"
          onClick={handleMenuClick}
          selectedKeys={[location.pathname]}
          items={items}
        />
      </Skeleton>
    </Sider>
  );
};

export default SideMenu;

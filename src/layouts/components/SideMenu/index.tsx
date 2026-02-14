import AntIcon from '@/components/AntIcon';
import { useAppStore, useAuthStore } from '@/stores';
import type { SiderTheme } from '@/stores/useAppStore';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Layout, Menu, MenuProps, Skeleton } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { history, styled, useLocation } from 'umi';
import Logo from '../Logo';

const { Sider } = Layout;

const SiderWrapper = styled.div`
  position: relative;
  height: 100vh;

  .collapse-trigger-wrap {
    position: absolute;
    top: 108px;
    right: 0;
    z-index: 101;
    transform: translateX(50%);
  }

  .collapse-trigger {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    font-size: 11px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    overflow: visible;

    &:hover {
      transform: scale(1.15);
    }
  }
`;

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
  const menus = useAuthStore((s) => s.menus);
  const siteName = useAppStore((s) => s.serverConfig.system.name);
  const toggleCollapsed = useAppStore((s) => s.toggleCollapsed);
  const loading = !menus;

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
    <SiderWrapper>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={width}
        collapsedWidth={collapsedWidth}
        theme={siderTheme}
        style={{ height: '100%' }}
      >
        {showLogo && (
          <Logo theme={siderTheme} title={siteName} collapsed={collapsed} />
        )}
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
      <div className="collapse-trigger-wrap">
        <div
          className="collapse-trigger"
          onClick={toggleCollapsed}
          style={
            siderTheme === 'dark'
              ? {
                  color: 'rgba(255,255,255,0.45)',
                  background: '#002140',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                }
              : {
                  color: 'rgba(0,0,0,0.2)',
                  background: '#f0f0f0',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                }
          }
        >
          {collapsed ? <RightOutlined /> : <LeftOutlined />}
        </div>
      </div>
    </SiderWrapper>
  );
};

export default SideMenu;

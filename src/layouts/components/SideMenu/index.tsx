import AntIcon from '@/components/AntIcon';
import { getMenus } from '@/services/menu';
import { Layout, Menu, MenuProps, Skeleton } from 'antd';
import { SiderTheme } from 'antd/es/layout/Sider';
import React, { useEffect, useState } from 'react';
import { history, useIntl, useLocation } from 'umi';
import Logo from '../Logo';

const { Sider } = Layout;

interface SideMenuProps {
  collapsed: boolean;
}

const SideMenu: React.FC<SideMenuProps> = ({ collapsed }) => {
  const [current, setCurrent] = useState('');
  const [theme, setTheme] = useState<SiderTheme>('light');
  const [items, setItems] = useState<MenuProps['items']>([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const intl = useIntl();

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    history.push('/' + e.key);
  };

  const getMenuItems = async () => {
    try {
      const { data } = await getMenus();
      const items = data.map((item: any) => {
        return {
          key: item.key,
          icon: <AntIcon icon={item.icon} />,
          label: intl.formatMessage({ id: item.label }),
        };
      });
      setTheme('dark');
      setItems(items);
      setLoading(false);
    } catch (error) {}
  };

  useEffect(() => {
    setCurrent(location.pathname.split('/')[1]);
  }, [location.pathname]);

  useEffect(() => {
    getMenuItems();
  }, []);

  return (
    <Sider trigger={null} collapsible collapsed={collapsed} theme={theme}>
      <Logo theme={theme} collapsed={collapsed} />
      <Skeleton loading={loading} active round style={{ padding: '15px' }}>
        <Menu
          theme="dark"
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

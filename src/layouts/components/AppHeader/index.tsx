import UserMenu from '@/components/UserMenu';
import { Space } from 'antd';

import NoticeBell from '../NoticeBell';
import SelectLang from '../SelectLang';
import ThemeModeSwitch from '../ThemeModeSwitch';
import ThemeSetting from '../ThemeSetting';
import { HeaderActions, HeaderWrapper } from './styles';

interface AppHeaderProps {
  headerFixed: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ headerFixed }) => {
  return (
    <HeaderWrapper $fixed={headerFixed}>
      <HeaderActions>
        <Space size={4}>
          <ThemeModeSwitch />
          <ThemeSetting />
          <SelectLang />
          <NoticeBell />
          <UserMenu />
        </Space>
      </HeaderActions>
    </HeaderWrapper>
  );
};

export default AppHeader;

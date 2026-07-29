import { Space } from 'antd';

import NoticeBell from '../NoticeBell';
import SelectLang from '../SelectLang';
import ThemeModeSwitch from '../ThemeModeSwitch';
import ThemeSetting from '../ThemeSetting';
import UserDropdown from './UserDropdown';
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
          <UserDropdown />
        </Space>
      </HeaderActions>
    </HeaderWrapper>
  );
};

export default AppHeader;

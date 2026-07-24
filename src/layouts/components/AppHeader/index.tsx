import { Space } from 'antd';
import { SelectLang } from 'umi';

import NoticeBell from '../NoticeBell';
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
        <Space size={6}>
          <ThemeModeSwitch />
          <ThemeSetting />
          <SelectLang {...({ trigger: ['click'] } as any)} />
          <NoticeBell />
          <UserDropdown />
        </Space>
      </HeaderActions>
    </HeaderWrapper>
  );
};

export default AppHeader;

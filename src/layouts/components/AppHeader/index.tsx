import { Space } from 'antd';
import { SelectLang } from 'umi';

import ThemeSetting from '../ThemeSetting';
import UserDropdown from './UserDropdown';
import { HeaderActions, HeaderWrapper } from './styles';

interface AppHeaderProps {
  themeColor: {
    bgColor: string;
  };
  headerFixed: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ themeColor, headerFixed }) => {
  return (
    <HeaderWrapper $bgColor={themeColor.bgColor} $fixed={headerFixed}>
      <HeaderActions>
        <Space size={2}>
          <ThemeSetting />
          <SelectLang />
          <UserDropdown />
        </Space>
      </HeaderActions>
    </HeaderWrapper>
  );
};

export default AppHeader;

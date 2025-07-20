import React from 'react';
import { styled, useNavigate } from 'umi';

interface LogoProps {
  theme?: 'light' | 'dark'; // 定义主题属性
  collapsed?: boolean;
}

const LogoWrapper = styled.div<LogoProps>`
  margin: 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: ${(props) => (props.collapsed ? '24px' : '8px')};
  color: ${(props) => (props.theme === 'light' ? '#000' : '#fff')};
  line-height: 32px;
  text-align: center;
  overflow: hidden;
  cursor: pointer;
  font-size: ${(props) => (props.collapsed ? '16px' : '20px')};
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.collapsed ? 'center' : 'flex-start')};
  gap: 8px;
  height: 48px;
  padding-left: ${(props) => (props.collapsed ? '0' : '8px')};
`;

const LogoImg = styled.img`
  width: 1.8em;
  height: 1.8em;
`;

const Logo: React.FC<LogoProps> = ({ theme = 'light', collapsed }) => {
  const navigate = useNavigate();
  return (
    <LogoWrapper
      theme={theme}
      collapsed={collapsed}
      onClick={() => {
        navigate('/');
      }}
    >
      <LogoImg src="/logo.svg" alt="Logo" />
      {!collapsed && <strong>G-ADMIN</strong>}
    </LogoWrapper>
  );
};

export default Logo;

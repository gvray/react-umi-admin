import { Layout } from 'antd';
import React from 'react';
import { styled } from 'umi';

const { Footer } = Layout;

interface AppFooterProps {
  visible?: boolean;
  text?: string;
}

const AppFooterRoot = styled(Footer)`
  margin-bottom: 20px;
  padding: 0;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  display: flex;
  justify-content: center;
  gap: 12px;
`;

const AppFooter: React.FC<AppFooterProps> = ({ visible = false, text }) => {
  if (!visible || !text) return null;

  return <AppFooterRoot>{text}</AppFooterRoot>;
};

export default AppFooter;

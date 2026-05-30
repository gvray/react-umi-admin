import React from 'react';
import { styled } from 'umi';

interface AppFooterProps {
  visible?: boolean;
  text?: string;
}

const FooterWrapper = styled.div`
  padding: 16px 0;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  display: flex;
  justify-content: center;
  gap: 12px;
`;

const AppFooter: React.FC<AppFooterProps> = ({ visible = false, text }) => {
  if (!visible || !text) return null;

  return <FooterWrapper>{text}</FooterWrapper>;
};

export default AppFooter;

import { theme } from 'antd';
import React from 'react';
import { ThemeProvider } from 'umi';

/**
 * 桥接层：将 antd Design Token 注入到 styled-components ThemeProvider，
 * 让所有 styled 组件都能通过 ${({ theme }) => theme.xxx} 消费主题色。
 *
 * 必须在 ConfigProvider 内部使用（依赖 theme.useToken()）。
 */
const StyledThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token } = theme.useToken();
  return <ThemeProvider theme={token}>{children}</ThemeProvider>;
};

export default StyledThemeProvider;

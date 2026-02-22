import { theme } from 'antd';
import React, { useMemo } from 'react';

/**
 * 将 antd Design Token 注入到 CSS 变量
 * 使得 LESS 文件可以通过 var(--ant-xxx) 访问主题色
 * 支持主题切换和昼夜模式
 */
const ThemeTokenInjector: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token } = theme.useToken();

  const cssVars = useMemo(
    () => ({
      // 主色系
      '--ant-primary-color': token.colorPrimary,
      '--ant-primary-color-hover': token.colorPrimaryHover,
      '--ant-primary-color-active': token.colorPrimaryActive,
      '--ant-primary-color-outline': token.colorPrimaryBg,

      // 功能色
      '--ant-success-color': token.colorSuccess,
      '--ant-warning-color': token.colorWarning,
      '--ant-error-color': token.colorError,
      '--ant-info-color': token.colorInfo,

      // 文本色
      '--ant-text-color': token.colorText,
      '--ant-text-color-secondary': token.colorTextSecondary,
      '--ant-text-color-disabled': token.colorTextDisabled,
      '--ant-heading-color': token.colorTextHeading,

      // 背景色
      '--ant-bg-color': token.colorBgBase,
      '--ant-bg-container': token.colorBgContainer,
      '--ant-bg-elevated': token.colorBgElevated,
      '--ant-bg-layout': token.colorBgLayout,
      '--ant-bg-spotlight': token.colorBgSpotlight,

      // 边框色
      '--ant-border-color': token.colorBorder,
      '--ant-border-color-split': token.colorSplit,

      // 填充色
      '--ant-fill-color': token.colorFill,
      '--ant-fill-color-secondary': token.colorFillSecondary,
      '--ant-fill-color-tertiary': token.colorFillTertiary,
      '--ant-fill-color-quaternary': token.colorFillQuaternary,

      // 尺寸
      '--ant-border-radius': `${token.borderRadius}px`,
      '--ant-border-radius-lg': `${token.borderRadiusLG}px`,
      '--ant-border-radius-sm': `${token.borderRadiusSM}px`,

      // 阴影
      '--ant-box-shadow': token.boxShadow,
      '--ant-box-shadow-secondary': token.boxShadowSecondary,

      // 主色衍生（用于背景/边框）
      '--ant-primary-1': token.colorPrimaryBg,
      '--ant-primary-2': token.colorPrimaryBgHover,
      '--ant-primary-3': token.colorPrimaryBorder,
      '--ant-primary-4': token.colorPrimaryBorderHover,

      // 紫色（用于渐变）
      '--ant-purple-6': '#722ed1',
    }),
    [token],
  );

  return (
    <div style={cssVars as React.CSSProperties} className="theme-token-root">
      {children}
    </div>
  );
};

export default ThemeTokenInjector;

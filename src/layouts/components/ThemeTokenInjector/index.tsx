import { theme } from 'antd';
import React, { useLayoutEffect } from 'react';

interface ThemeTokenInjectorProps {
  children: React.ReactNode;
  siderTheme?: 'light' | 'dark';
}

/**
 * 将 antd Design Token 注入到 :root CSS 变量
 * 供 Less / styled-components 通过 var(--gvray-xxx) 消费主题色
 * 支持主题切换和昼夜模式，以及 Sider 独立主题
 *
 * ⚠️ 设计原则：
 * 1. Less 文件 → 用 var(--gvray-xxx)
 * 2. styled-components → 用 var(--gvray-xxx)（静态样式，性能好）
 * 3. ECharts / Canvas / Watermark → 用 theme.useToken()（canvas 无法解析 CSS 变量）
 *
 * 💡 包裹位置：必须在 ConfigProvider 内部（需要 useToken），在 AppLayout 外部（越早注入越好）。
 *    使用 useLayoutEffect 确保在浏览器 paint 前注入，避免首次渲染闪烁。
 */
const ThemeTokenInjector: React.FC<ThemeTokenInjectorProps> = ({
  children,
  siderTheme = 'light',
}) => {
  const { token } = theme.useToken();

  useLayoutEffect(() => {
    const lines: string[] = [];
    const add = (name: string, value: string | number) =>
      lines.push(`  --gvray-${name}: ${value};`);

    // 主色系
    add('primary-color', token.colorPrimary);
    add('primary-color-hover', token.colorPrimaryHover);
    add('primary-color-active', token.colorPrimaryActive);
    add('primary-color-outline', token.colorPrimaryBg);

    // 功能色
    add('success-color', token.colorSuccess);
    add('success-color-bg', token.colorSuccessBg);
    add('success-color-border', token.colorSuccessBorder);
    add('warning-color', token.colorWarning);
    add('warning-color-bg', token.colorWarningBg);
    add('warning-color-border', token.colorWarningBorder);
    add('error-color', token.colorError);
    add('error-color-bg', token.colorErrorBg);
    add('error-color-border', token.colorErrorBorder);
    add('info-color', token.colorInfo);
    add('info-color-bg', token.colorInfoBg);
    add('info-color-border', token.colorInfoBorder);

    // 文本色
    add('text-color', token.colorText);
    add('text-color-secondary', token.colorTextSecondary);
    add('text-color-disabled', token.colorTextDisabled);
    add('text-color-placeholder', token.colorTextPlaceholder);
    add('heading-color', token.colorTextHeading);
    add('text-label', token.colorTextLabel);
    add('text-description', token.colorTextDescription);

    // 背景色
    add('bg-color', token.colorBgBase);
    add('bg-container', token.colorBgContainer);
    add('bg-elevated', token.colorBgElevated);
    add('bg-layout', token.colorBgLayout);
    add('bg-spotlight', token.colorBgSpotlight);
    add('bg-mask', token.colorBgMask);

    // 边框 / 分割线
    add('border-color', token.colorBorder);
    add('border-color-secondary', token.colorBorderSecondary);
    add('border-color-split', token.colorSplit);

    // 填充色
    add('fill-color', token.colorFill);
    add('fill-color-secondary', token.colorFillSecondary);
    add('fill-color-tertiary', token.colorFillTertiary);
    add('fill-color-quaternary', token.colorFillQuaternary);

    // 尺寸
    add('border-radius', `${token.borderRadius}px`);
    add('border-radius-lg', `${token.borderRadiusLG}px`);
    add('border-radius-sm', `${token.borderRadiusSM}px`);
    add('border-radius-xs', `${token.borderRadiusXS}px`);

    // 阴影
    add('box-shadow', token.boxShadow);
    add('box-shadow-secondary', token.boxShadowSecondary);
    add('box-shadow-tertiary', token.boxShadowTertiary);

    // 主色衍生（背景/边框/悬浮）
    add('primary-1', token.colorPrimaryBg);
    add('primary-2', token.colorPrimaryBgHover);
    add('primary-3', token.colorPrimaryBorder);
    add('primary-4', token.colorPrimaryBorderHover);
    add('primary-5', token.colorPrimaryHover);
    add('primary-6', token.colorPrimary);
    add('primary-7', token.colorPrimaryActive);

    // 链接色
    add('link-color', token.colorLink);
    add('link-hover-color', token.colorLinkHover);
    add('link-active-color', token.colorLinkActive);

    // 图标色
    add('icon-color', token.colorIcon);
    add('icon-color-hover', token.colorIconHover);

    // ── Sider 独立主题变量 ──
    // light: 跟随全局 token；dark: antd Sider 内部硬编码色
    const isSiderDark = siderTheme === 'dark';
    add(
      'sider-text',
      isSiderDark ? 'rgba(255, 255, 255, 0.95)' : token.colorText,
    );
    add(
      'sider-text-secondary',
      isSiderDark ? 'rgba(255, 255, 255, 0.65)' : token.colorTextPlaceholder,
    );
    add('sider-bg', isSiderDark ? '#001529' : token.colorBgElevated);
    add('sider-bg-hover', isSiderDark ? '#002140' : token.colorBgContainer);
    add(
      'sider-border',
      isSiderDark ? 'rgba(255, 255, 255, 0.15)' : token.colorBorder,
    );
    add('sider-shadow', isSiderDark ? 'rgba(0, 0, 0, 0.45)' : token.boxShadow);

    const STYLE_ID = 'gvray-theme-tokens';
    let styleEl = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = STYLE_ID;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `:root {\n${lines.join('\n')}\n}`;

    return () => {
      document.getElementById(STYLE_ID)?.remove();
    };
  }, [token, siderTheme]);

  return <>{children}</>;
};

export default ThemeTokenInjector;

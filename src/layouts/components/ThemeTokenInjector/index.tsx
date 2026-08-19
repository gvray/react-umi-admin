import { theme } from 'antd';
import React, { useLayoutEffect } from 'react';

interface ThemeTokenInjectorProps {
  children: React.ReactNode;
  siderTheme?: 'light' | 'dark';
}

/**
 * 将 antd Design Token 注入到 :root CSS 变量
 * 变量命名遵循 antd v5 token 命名规范，前缀替换为 --gvray-
 * 例：colorPrimary → --gvray-color-primary
 *
 * ⚠️ 设计原则：
 * 1. Less 文件 → 用 var(--gvray-color-xxx)
 * 2. styled-components → 用 var(--gvray-color-xxx)（静态样式，性能好）
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

    // 主色系（colorPrimary → --gvray-color-primary）
    add('color-primary', token.colorPrimary);
    add('color-primary-hover', token.colorPrimaryHover);
    add('color-primary-active', token.colorPrimaryActive);
    add('color-primary-bg', token.colorPrimaryBg);
    add('color-primary-bg-hover', token.colorPrimaryBgHover);
    add('color-primary-border', token.colorPrimaryBorder);
    add('color-primary-border-hover', token.colorPrimaryBorderHover);

    // 功能色
    add('color-success', token.colorSuccess);
    add('color-success-bg', token.colorSuccessBg);
    add('color-success-border', token.colorSuccessBorder);
    add('color-warning', token.colorWarning);
    add('color-warning-bg', token.colorWarningBg);
    add('color-warning-border', token.colorWarningBorder);
    add('color-error', token.colorError);
    add('color-error-bg', token.colorErrorBg);
    add('color-error-border', token.colorErrorBorder);
    add('color-info', token.colorInfo);
    add('color-info-bg', token.colorInfoBg);
    add('color-info-border', token.colorInfoBorder);

    // 文本色
    add('color-text', token.colorText);
    add('color-text-secondary', token.colorTextSecondary);
    add('color-text-tertiary', token.colorTextTertiary);
    add('color-text-quaternary', token.colorTextQuaternary);
    add('color-text-disabled', token.colorTextDisabled);
    add('color-text-placeholder', token.colorTextPlaceholder);
    add('color-text-heading', token.colorTextHeading);
    add('color-text-label', token.colorTextLabel);
    add('color-text-description', token.colorTextDescription);

    // 背景色
    add('color-bg-base', token.colorBgBase);
    add('color-bg-container', token.colorBgContainer);
    add('color-bg-elevated', token.colorBgElevated);
    add('color-bg-layout', token.colorBgLayout);
    add('color-bg-spotlight', token.colorBgSpotlight);
    add('color-bg-mask', token.colorBgMask);

    // 边框 / 分割线
    add('color-border', token.colorBorder);
    add('color-border-secondary', token.colorBorderSecondary);
    add('color-split', token.colorSplit);

    // 填充色
    add('color-fill', token.colorFill);
    add('color-fill-secondary', token.colorFillSecondary);
    add('color-fill-tertiary', token.colorFillTertiary);
    add('color-fill-quaternary', token.colorFillQuaternary);

    // 尺寸
    add('border-radius', `${token.borderRadius}px`);
    add('border-radius-lg', `${token.borderRadiusLG}px`);
    add('border-radius-sm', `${token.borderRadiusSM}px`);
    add('border-radius-xs', `${token.borderRadiusXS}px`);

    // 阴影
    add('box-shadow', token.boxShadow);
    add('box-shadow-secondary', token.boxShadowSecondary);
    add('box-shadow-tertiary', token.boxShadowTertiary);

    // 链接色
    add('color-link', token.colorLink);
    add('color-link-hover', token.colorLinkHover);
    add('color-link-active', token.colorLinkActive);

    // 图标色
    add('color-icon', token.colorIcon);
    add('color-icon-hover', token.colorIconHover);

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

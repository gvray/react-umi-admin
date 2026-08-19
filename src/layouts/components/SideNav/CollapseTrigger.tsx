import { Icon } from '@/components';
import React, { memo } from 'react';
import { styled } from 'umi';

const TriggerWrapper = styled.div`
  position: absolute;
  top: 108px;
  right: 0;
  z-index: 101;
  transform: translateX(50%);
`;

const TriggerButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border-radius: 50%;
  cursor: pointer;
  outline: none;
  font-size: 11px;
  transition: color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;

  /* 颜色由 ThemeTokenInjector 注入的 --gvray-sider-xxx 变量控制 */
  color: var(--gvray-sider-text-secondary);
  background: var(--gvray-sider-bg);
  border: 1px solid var(--gvray-sider-border);
  box-shadow: 0 1px 4px var(--gvray-sider-shadow);

  &:hover {
    color: var(--gvray-sider-text);
    background: var(--gvray-sider-bg-hover);
    box-shadow: 0 2px 8px var(--gvray-sider-shadow);
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px var(--gvray-color-primary-bg),
      0 2px 8px var(--gvray-sider-shadow);
  }
`;

export interface CollapseTriggerProps {
  collapsed: boolean;
  onToggle: () => void;
}

const CollapseTrigger: React.FC<CollapseTriggerProps> = ({
  collapsed,
  onToggle,
}) => {
  const icon = collapsed ? (
    <Icon name="RightOutlined" />
  ) : (
    <Icon name="LeftOutlined" />
  );

  return (
    <TriggerWrapper>
      <TriggerButton
        type="button"
        onClick={onToggle}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {icon}
      </TriggerButton>
    </TriggerWrapper>
  );
};

export default memo(CollapseTrigger);

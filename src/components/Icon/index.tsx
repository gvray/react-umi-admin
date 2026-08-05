import React from 'react';
import { iconMap } from './map';
import type { IconProps } from './types';

const Icon: React.FC<IconProps> = ({ name, size = 16, className, style }) => {
  const config = iconMap[name];

  if (!config) {
    return null;
  }

  if (config.type === 'antd') {
    const Component = config.component;
    return (
      <Component className={className} style={{ fontSize: size, ...style }} />
    );
  }

  if (config.type === 'lucide' || config.type === 'svg') {
    const Component = config.component;
    return <Component size={size} className={className} style={style} />;
  }

  if (config.type === 'sprite') {
    return (
      <svg
        width={size}
        height={size}
        className={className}
        style={{ fill: 'currentColor', ...style }}
        aria-hidden="true"
      >
        <use xlinkHref={`#${config.symbol}`} />
      </svg>
    );
  }

  return null;
};

export default Icon;

import { logger } from '@/utils';
import * as icons from '@ant-design/icons';
import React, { useMemo } from 'react';

interface AntIconProps {
  icon: string;
  style?: React.CSSProperties;
  className?: string;
}
export const antdIcons = Object.keys(icons);
const AntIcon: React.FC<AntIconProps> = ({ icon, style, className }) => {
  const AntIconComponent = useMemo(() => {
    const IconComponent = (icons as any)[icon];
    if (IconComponent) {
      return <IconComponent />;
    } else {
      logger.error(`AntIcon: Icon "${icon}" not found.`);
      return null;
    }
  }, [icon]);

  return (
    <span style={style} className={className}>
      {AntIconComponent}
    </span>
  );
};

export default AntIcon;

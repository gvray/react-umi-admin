import type { IconKey } from './map';

export type { IconKey };

export interface IconProps {
  /** 图标名称，必须是 iconMap 中注册的 key */
  name: IconKey;
  /** 尺寸，默认 16 */
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

import type { DictOption } from '@/types/dict';
import { Tag } from 'antd';
import React from 'react';

type StatusTagProps = {
  value?: string | number;
  options?: DictOption[];
};

const DEFAULT_COLORS = [
  'success',
  'error',
  'warning',
  'processing',
  'default',
] as const;

const normalizeValueKey = (v: string | number) => String(v);

const getOptionColor = (options: DictOption[], value: string | number) => {
  const key = normalizeValueKey(value);
  const index = options.findIndex(
    (opt) => normalizeValueKey(opt.value) === key,
  );
  if (index < 0) return 'default' as const;
  return DEFAULT_COLORS[index % DEFAULT_COLORS.length];
};

const StatusTag: React.FC<StatusTagProps> = ({ value, options }) => {
  if (value === undefined) return null;

  const key = normalizeValueKey(value);
  const hit = options?.find((opt) => normalizeValueKey(opt.value) === key);

  if (!options || options.length === 0) {
    return key;
  }

  const color = getOptionColor(options, value);
  return <Tag color={color}>{hit?.label ?? key}</Tag>;
};

export default StatusTag;

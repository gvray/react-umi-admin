/** 配置值类型选项 */
export const CONFIG_TYPE_OPTIONS = [
  { label: '字符串', value: 'string' },
  { label: '数字', value: 'number' },
  { label: '布尔值', value: 'boolean' },
  { label: 'JSON', value: 'json' },
];

/** 配置值类型 → 中文映射 */
export const CONFIG_TYPE_LABELS: Record<string, string> = {
  string: '字符串',
  number: '数字',
  boolean: '布尔值',
  json: 'JSON',
};

/** 配置值类型 → Tag 颜色 */
export const CONFIG_TYPE_COLORS: Record<string, string> = {
  string: 'blue',
  number: 'green',
  boolean: 'orange',
  json: 'purple',
};

/** 配置状态选项 */
export const CONFIG_STATUS_OPTIONS = [
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 },
];

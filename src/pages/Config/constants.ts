export const CONFIG_GROUP_OPTIONS = [
  { label: '系统配置', value: 'system' },
  { label: '用户配置', value: 'user' },
  { label: '通知配置', value: 'notify' },
  { label: '存储配置', value: 'storage' },
  { label: '扩展配置', value: 'extension' },
];

export const CONFIG_GROUP_LABELS: Record<string, string> = {
  system: '系统配置',
  user: '用户配置',
  notify: '通知配置',
  storage: '存储配置',
  extension: '扩展配置',
};

export const CONFIG_GROUP_COLORS: Record<string, string> = {
  system: 'red',
  user: 'blue',
  notify: 'orange',
  storage: 'purple',
  extension: 'green',
};

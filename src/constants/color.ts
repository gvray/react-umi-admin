export type PrimaryColor =
  | '#1677ff'
  | '#1890ff'
  | '#f5222d'
  | '#fa541c'
  | '#faad14'
  | '#a0d911'
  | '#52c41a'
  | '#13c2c2'
  | '#2f54eb'
  | '#722ed1'
  | '#eb2f96';

export const PRIMARY_COLOR_LABELS: Record<PrimaryColor, string> = {
  '#1677ff': '拂晓蓝',
  '#1890ff': '极客蓝',
  '#f5222d': '薄暮',
  '#fa541c': '火山',
  '#faad14': '日暮',
  '#a0d911': '明青',
  '#52c41a': '极光绿',
  '#13c2c2': '海蓝',
  '#2f54eb': '极客蓝',
  '#722ed1': '酱紫',
  '#eb2f96': '酱紫',
};

export const PRIMARY_COLOR_GRADIENTS: Record<PrimaryColor, [string, string]> = {
  '#1677ff': ['#1677ff', '#6f00ff'], // 拂晓蓝 + 紫电
  '#1890ff': ['#1890ff', '#722ed1'], // 极客蓝 + 酱紫
  '#f5222d': ['#f5222d', '#faad14'], // 薄暮 + 日暮
  '#fa541c': ['#fa541c', '#13c2c2'], // 火山 + 海蓝
  '#faad14': ['#faad14', '#722ed1'], // 日暮 + 酱紫
  '#a0d911': ['#a0d911', '#13c2c2'], // 明青 + 海蓝
  '#52c41a': ['#52c41a', '#2f54eb'], // 极光绿 + 极客蓝
  '#13c2c2': ['#13c2c2', '#fa541c'], // 海蓝 + 火山
  '#2f54eb': ['#2f54eb', '#f5222d'], // 极客蓝 + 薄暮
  '#722ed1': ['#722ed1', '#eb2f96'], // 酱紫 + 樱桃粉
  '#eb2f96': ['#eb2f96', '#1890ff'], // 樱桃粉 + 极客蓝
};

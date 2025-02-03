// src/themeConfig.ts
import { ThemeConfig } from 'antd';

export const themes: Record<string, ThemeConfig> = {
  techBlue: {
    token: {
      colorPrimary: '#1677ff',
    },
  },
  daybreak: {
    token: {
      colorPrimary: '#1890ff',
    },
  },
  dust: {
    token: {
      colorPrimary: '#f5222d',
    },
  },
  volcano: {
    token: {
      colorPrimary: '#fa541c',
    },
  },
  sunset: {
    token: {
      colorPrimary: '#faad14',
    },
  },
  cyan: {
    token: {
      colorPrimary: '#13c2c2',
    },
  },
  green: {
    token: {
      colorPrimary: '#52c41a',
    },
  },
  geekblue: {
    token: {
      colorPrimary: '#2f54eb',
    },
  },
  purple: {
    token: {
      colorPrimary: '#722ed1',
    },
  },
};

// 主题的中文映射
// TODO 待完善 换成国际化
export const themeLabels: Record<string, string> = {
  techBlue: '天空蓝',
  daybreak: '拂晓蓝',
  dust: '薄暮',
  volcano: '火山',
  sunset: '日暮',
  cyan: '明青',
  green: '极光绿',
  geekblue: '极客蓝',
  purple: '酱紫',
  default: '默认',
};

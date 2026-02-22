import { App } from 'antd';

export const useFeedback = () => {
  const { message, modal, notification } = App.useApp();
  return { message, modal, notification };
};

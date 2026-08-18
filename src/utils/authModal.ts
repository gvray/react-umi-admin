import { Modal } from 'antd';

/**
 * 401 授权过期弹窗实例
 * 用于防止并发 401 请求重复弹窗，并支持在跳转登录页时主动销毁
 */
let authModalInstance: ReturnType<typeof Modal.confirm> | null = null;

/**
 * 销毁当前 401 弹窗并重置状态
 */
export const destroyAuthModal = () => {
  authModalInstance?.destroy();
  authModalInstance = null;
};

/**
 * 显示 401 授权过期弹窗
 * 同一时刻最多只展示一个
 */
export const showAuthModal = (options: {
  onOk: () => void;
  onCancel: () => void;
}) => {
  if (authModalInstance) return;

  authModalInstance = Modal.confirm({
    title: '系统提示',
    content: '登录状态已过期，您可以继续留在该页面，或者重新登录',
    okText: '重新登录',
    cancelText: '取消',
    onOk: () => {
      options.onOk();
    },
    onCancel: () => {
      options.onCancel();
    },
    afterClose: () => {
      // 无论通过何种方式关闭，都重置实例引用
      authModalInstance = null;
    },
  });
};

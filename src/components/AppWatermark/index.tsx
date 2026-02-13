import { useAppStore, useAuthStore } from '@/stores';
import { Watermark } from 'antd';
import React from 'react';

interface AppWatermarkProps {
  children: React.ReactNode;
}

/**
 * 全局水印组件。
 * 受 serverConfig.securityPolicy.watermarkEnabled 控制。
 * 水印文字取当前登录用户的昵称或用户名，未登录时不显示水印。
 */
const AppWatermark: React.FC<AppWatermarkProps> = ({ children }) => {
  const watermarkEnabled = useAppStore(
    (s) => s.serverConfig.securityPolicy.watermarkEnabled,
  );
  const profile = useAuthStore((s) => s.profile);

  const text = profile?.nickname || profile?.username;

  if (!watermarkEnabled || !text) return <>{children}</>;

  return (
    <Watermark
      content={text}
      font={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.06)' }}
      gap={[120, 120]}
      rotate={-22}
      zIndex={9}
    >
      {children}
    </Watermark>
  );
};

export default AppWatermark;

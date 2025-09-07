import { useAuth } from '@/hooks';
import { Button, ButtonProps, Tooltip } from 'antd';
import React from 'react';

export interface AuthButtonProps extends ButtonProps {
  /** 兼容长写：建议使用更简短的 perms */
  requirePermissions?: string[];
  /** 简写：推荐使用 */
  perms?: string[];
  anyOf?: boolean; // 任一权限即可
  mode?: 'hidden' | 'disabled'; // 无权限时处理方式
  denyMessage?: React.ReactNode; // 无权限提示
}

const AuthButton: React.FC<AuthButtonProps> = ({
  children,
  requirePermissions = [],
  perms,
  anyOf = false,
  mode = 'hidden',
  denyMessage = '无操作权限',
  ...buttonProps
}) => {
  const { permissions } = useAuth();

  const hasPermission = React.useMemo(() => {
    const required = perms ?? requirePermissions ?? [];
    if (!required || required.length === 0) return true;
    if (!permissions || permissions.length === 0) return false;
    return anyOf
      ? required.some((p) => permissions.includes(p))
      : required.every((p) => permissions.includes(p));
  }, [permissions, requirePermissions, perms, anyOf]);

  if (hasPermission) {
    return <Button {...buttonProps}>{children}</Button>;
  }

  if (mode === 'disabled') {
    const disabledProps: ButtonProps = { ...buttonProps, disabled: true };
    return (
      <Tooltip title={denyMessage}>
        <Button {...disabledProps}>{children}</Button>
      </Tooltip>
    );
  }

  return null;
};

export default AuthButton;

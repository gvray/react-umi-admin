import { useAuth } from '@/hooks';
import { Button, Result } from 'antd';
import React from 'react';
import { styled } from 'umi';

// 403错误容器
const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px 20px;
`;

interface WithAuthOptions {
  requirePermissions?: string[];
  fallback?: React.ReactNode;
}

const withAuth = (
  Component: React.ComponentType<any>,
  options: WithAuthOptions = {},
) => {
  return (props: React.ComponentProps<any>) => {
    const { permissions } = useAuth();
    const { requirePermissions = [], fallback } = options;
    // 检查权限
    const hasPermission =
      // 超级管理员
      permissions?.includes('*:*:*') ||
      requirePermissions.length === 0 ||
      requirePermissions.every((permission) =>
        permissions?.includes(permission),
      );

    if (hasPermission) {
      return <Component {...props} />;
    }

    // 自定义fallback
    if (fallback) {
      return <>{fallback}</>;
    }

    // 默认403页面
    return (
      <ErrorContainer>
        <Result
          status="403"
          title="403"
          subTitle="抱歉，您没有权限访问此页面。"
          extra={
            <Button type="primary" onClick={() => window.history.back()}>
              返回上页
            </Button>
          }
        />
      </ErrorContainer>
    );
  };
};

export default withAuth;

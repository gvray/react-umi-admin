import { withAuth } from '@/hocs';
import { useRoutePermissions } from '@/hooks';
import { usePreferences } from '@/stores';
import { theme } from 'antd';
import { PropsWithChildren, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { styled } from 'umi';

type PageContainerWrapperProps = {
  $isVisible?: boolean;
  $colorBgContainer?: string;
  $borderRadiusLG?: number;
  $hasBreadcrumb?: boolean;
};

const PageContainerWrapper = styled.div<PageContainerWrapperProps>`
  margin: ${({ $hasBreadcrumb }) =>
    $hasBreadcrumb ? '0 16px 24px' : '24px 16px'};
  padding: 24px;
  min-height: 280px;
  transition: transform 0.1s ease-in-out, opacity 0.3s ease-in-out; /* 添加过渡效果 */
  background: ${({ $colorBgContainer }) => $colorBgContainer};
  border-radius: ${({ $borderRadiusLG }) => $borderRadiusLG}px;
  transform: ${({ $isVisible }) =>
    $isVisible ? 'translateX(0)' : 'translateX(5%)'}; // 控制从右侧入场
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)}; // 控制透明度
`;
interface PageContainerProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  /** 覆盖 Layout 默认的 document title */
  title?: string;
}

const PageContainer: React.FC<PropsWithChildren<PageContainerProps>> = ({
  children,
  title,
  ...rest
}) => {
  // 使用状态来控制进场和出场动画
  const [isVisible, setIsVisible] = useState(false);
  const { showBreadcrumb } = usePreferences();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    setIsVisible(true); // 组件挂载时设置为可见，触发进场动画
  }, []);

  return (
    <PageContainerWrapper
      $isVisible={isVisible}
      $colorBgContainer={colorBgContainer}
      $borderRadiusLG={borderRadiusLG}
      $hasBreadcrumb={showBreadcrumb}
      {...rest}
    >
      {title && (
        <Helmet>
          <title>{title}</title>
        </Helmet>
      )}
      {children}
    </PageContainerWrapper>
  );
};

// 动态权限检查的PageContainer
const PageContainerWithAuth: React.FC<PropsWithChildren<PageContainerProps>> = (
  props,
) => {
  const routePermissions = useRoutePermissions();
  return withAuth(PageContainer, {
    requirePermissions: routePermissions,
  })(props);
};

export default PageContainerWithAuth;

import { useSettingStore } from '@/stores';
import { PropsWithChildren, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { styled } from 'umi';
import AppBreadcrumb from '../AppBreadcrumb';

type PageContainerWrapperProps = {
  $isVisible?: boolean;
  $hasBreadcrumb?: boolean;
};

const PageContainerWrapper = styled.div`
  flex: 1;
  background: transparent;
  margin: 0;
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

const PageHeader = styled.div`
  margin-bottom: 12px;
`;

const PageTitle = styled.div<PageContainerWrapperProps>`
  font-size: 20px;
  font-weight: 500;
  margin-top: ${({ $hasBreadcrumb }) => ($hasBreadcrumb ? '8px' : '0')};
`;

const PageContent = styled.div<{ $isVisible?: boolean }>`
  flex: 1;
  padding: 24px;
  background: var(--gvray-color-bg-container);
  border-radius: var(--gvray-border-radius-lg);

  transition: transform 0.15s ease, opacity 0.2s ease;

  transform: ${({ $isVisible }) =>
    $isVisible ? 'translateX(0)' : 'translateX(20px)'};

  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
`;

interface PageContainerProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  title?: string;
}

const PageContainer: React.FC<PropsWithChildren<PageContainerProps>> = ({
  children,
  title,
  ...rest
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const { showBreadcrumb } = useSettingStore();

  const hasHeader = Boolean(title || showBreadcrumb);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <PageContainerWrapper {...rest}>
      {title && (
        <Helmet>
          <title>{title}</title>
        </Helmet>
      )}

      {hasHeader && (
        <PageHeader>
          {showBreadcrumb && <AppBreadcrumb />}

          {title && (
            <PageTitle $hasBreadcrumb={showBreadcrumb}>{title}</PageTitle>
          )}
        </PageHeader>
      )}

      <PageContent $isVisible={isVisible}>{children}</PageContent>
    </PageContainerWrapper>
  );
};

export default PageContainer;

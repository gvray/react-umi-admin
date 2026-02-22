import { Spin } from 'antd';
import React from 'react';

export type PageLoadingProps = {
  minHeight?: number;
  tip?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

const PageLoading: React.FC<PageLoadingProps> = ({
  minHeight = 200,
  tip,
  className,
  style,
}) => {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight,
        ...style,
      }}
    >
      <Spin tip={tip} />
    </div>
  );
};

export default PageLoading;

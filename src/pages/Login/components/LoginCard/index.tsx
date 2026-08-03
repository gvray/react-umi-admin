import { Spin } from 'antd';
import React from 'react';
import styles from './index.less';

interface LoginCardProps {
  children: React.ReactNode;
  spinning?: boolean;
}

const LoginCard: React.FC<LoginCardProps> = ({
  children,
  spinning = false,
}) => {
  return (
    <Spin spinning={spinning} wrapperClassName={styles.spinWrapper}>
      <div className={styles.card}>{children}</div>
    </Spin>
  );
};

export default LoginCard;

import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';

const NoAuthPage: React.FC = () => (
  <Result
    status="403"
    title="403"
    subTitle="抱歉，您没有权限访问此页面。"
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        返回首页
      </Button>
    }
  />
);

export default NoAuthPage;

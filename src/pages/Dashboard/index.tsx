import { Card, Col, Row, Space, Statistic } from 'antd';
import React from 'react';
import { styled } from 'umi';
import LoginTrend from './components/LoginTrend';
import OperationLogTable from './components/OperationLogTable';
import RoleDistribution from './components/RoleDistribution';
import {
  OnlineIcon,
  PermissionIcon,
  RoleIcon,
  UserIcon,
} from './components/icons';
import { useDashboard } from './model';

const DashboardWrapper = styled.div`
  padding: 24px 16px;
`;

const Dashboard: React.FC = () => {
  const { overview, roleDistribution, loginData, logs } = useDashboard();

  console.log(overview, roleDistribution, loginData, logs);

  return (
    <DashboardWrapper>
      <Space direction="vertical" size={24} style={{ width: '100%' }}>
        {/* 顶部统计 */}
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic
                title="用户总数"
                value={overview?.users}
                prefix={<UserIcon />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="角色数量"
                value={overview?.roles}
                prefix={<RoleIcon />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="权限点数量"
                value={overview?.permissions}
                prefix={<PermissionIcon />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="当前在线用户"
                value={7}
                prefix={<OnlineIcon />}
              />
            </Card>
          </Col>
        </Row>

        {/* 图表区域 */}
        <Row gutter={16}>
          <Col span={12}>
            <Card
              title="角色分布"
              styles={{
                body: { padding: '16px 12px' },
                header: {
                  padding: '12px 16px',
                  borderBottom: '1px solid #f0f0f0',
                },
              }}
            >
              <RoleDistribution data={roleDistribution} height={320} />
            </Card>
          </Col>
          <Col span={12}>
            <Card
              title="登录趋势"
              styles={{
                body: { padding: '16px 12px' },
                header: {
                  padding: '12px 16px',
                  borderBottom: '1px solid #f0f0f0',
                },
              }}
            >
              <LoginTrend data={loginData} height={320} />
            </Card>
          </Col>
        </Row>

        {/* 操作日志 */}
        <Card title="最近操作日志">
          <OperationLogTable logs={logs} />
        </Card>
      </Space>
    </DashboardWrapper>
  );
};

export default Dashboard;

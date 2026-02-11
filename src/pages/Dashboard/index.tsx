import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  UserOutlined,
  WifiOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import React, { useEffect, useState } from 'react';
import { styled } from 'umi';
import ActivityTimeline from './components/ActivityTimeline';
import LoginTrend from './components/LoginTrend';
import RoleDistribution from './components/RoleDistribution';
import { useDashboard } from './model';

dayjs.locale('zh-cn');

const { Title, Text } = Typography;

// ─── Styled Components ──────────────────────────────────

const PageWrapper = styled.div`
  padding: 0 24px 24px;
  min-height: 100%;
`;

const WelcomeSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 0 20px;
`;

const WelcomeLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TimeDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 13px;
`;

const StatCard = styled.div<{ $gradient: string }>`
  position: relative;
  border-radius: 12px;
  padding: 20px 24px;
  background: ${(p) => p.$gradient};
  color: #fff;
  overflow: hidden;
  cursor: default;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`;

const StatIconWrap = styled.div`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 48px;
  opacity: 0.18;
  line-height: 1;
`;

const StatLabel = styled.div`
  font-size: 13px;
  opacity: 0.85;
  margin-bottom: 8px;
  font-weight: 500;
  letter-spacing: 0.5px;
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.5px;
`;

const StatTrend = styled.div<{ $up?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 10px;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
`;

const ChartCard = styled(Card)`
  border-radius: 12px;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  .ant-card-head {
    border-bottom: 1px solid #f5f5f5;
    padding: 0 20px;
    min-height: 48px;
  }
  .ant-card-head-title {
    font-size: 15px;
    font-weight: 600;
  }
  .ant-card-body {
    padding: 16px 20px;
  }
`;

// ─── Stat Card Config ───────────────────────────────────

interface StatItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  gradient: string;
  trendUp: boolean;
  trendValue: string;
  trendLabel: string;
}

const STAT_CONFIG: StatItem[] = [
  {
    key: 'users',
    label: '用户总数',
    icon: <UserOutlined />,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    trendUp: true,
    trendValue: '+12%',
    trendLabel: '较上月',
  },
  {
    key: 'roles',
    label: '角色数量',
    icon: <TeamOutlined />,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    trendUp: true,
    trendValue: '+2',
    trendLabel: '本月新增',
  },
  {
    key: 'permissions',
    label: '权限点数',
    icon: <SafetyCertificateOutlined />,
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    trendUp: true,
    trendValue: '+5',
    trendLabel: '本月新增',
  },
  {
    key: 'onlineUsers',
    label: '在线用户',
    icon: <WifiOutlined />,
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    trendUp: false,
    trendValue: '-3',
    trendLabel: '较昨日',
  },
];

// ─── Component ──────────────────────────────────────────

const Dashboard: React.FC = () => {
  const { overview, roleDistribution, loginData, logs, fetchDashboardData } =
    useDashboard();
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    setLoading(true);
    fetchDashboardData().finally(() => setLoading(false));
  }, [fetchDashboardData]);

  useEffect(() => {
    const timer = setInterval(() => setNow(dayjs()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const getStatValue = (key: string): number => {
    if (!overview) return 0;
    return (overview[key] as number) ?? 0;
  };

  return (
    <PageWrapper>
      {/* ── Welcome Header ── */}
      <WelcomeSection>
        <WelcomeLeft>
          <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
            欢迎回来 👋
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            这是你的系统运行概览，祝你工作愉快
          </Text>
        </WelcomeLeft>
        <TimeDisplay>
          <ClockCircleOutlined />
          {now.format('YYYY年MM月DD日 dddd HH:mm')}
        </TimeDisplay>
      </WelcomeSection>

      {/* ── Stat Cards ── */}
      <Row gutter={[16, 16]}>
        {STAT_CONFIG.map((stat) => (
          <Col xs={24} sm={12} lg={6} key={stat.key}>
            <StatCard $gradient={stat.gradient}>
              <StatIconWrap>{stat.icon}</StatIconWrap>
              <StatLabel>{stat.label}</StatLabel>
              <StatValue>{getStatValue(stat.key)}</StatValue>
              <StatTrend $up={stat.trendUp}>
                {stat.trendUp ? (
                  <ArrowUpOutlined style={{ fontSize: 10 }} />
                ) : (
                  <ArrowDownOutlined style={{ fontSize: 10 }} />
                )}
                {stat.trendValue} {stat.trendLabel}
              </StatTrend>
            </StatCard>
          </Col>
        ))}
      </Row>

      {/* ── Charts ── */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={14}>
          <ChartCard title="登录趋势">
            <LoginTrend data={loginData} height={340} />
          </ChartCard>
        </Col>
        <Col xs={24} lg={10}>
          <ChartCard title="角色分布">
            <RoleDistribution data={roleDistribution} height={340} />
          </ChartCard>
        </Col>
      </Row>

      {/* ── Activity ── */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <ChartCard title="最近动态">
            <ActivityTimeline logs={logs} loading={loading} />
          </ChartCard>
        </Col>
      </Row>
    </PageWrapper>
  );
};

export default Dashboard;

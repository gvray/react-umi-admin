import { Icon } from '@/components';
import { format } from '@gvray/datekit';
import { Card, Col, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import ActivityTimeline from './components/ActivityTimeline';
import LoginTrend from './components/LoginTrend';
import RoleDistribution from './components/RoleDistribution';
import styles from './index.less';
import { useDashboard } from './model';

const { Title, Text } = Typography;

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
    icon: <Icon name="UserOutlined" />,
    gradient:
      'linear-gradient(135deg, var(--gvray-color-primary) 0%, var(--gvray-color-info) 100%)',
    trendUp: true,
    trendValue: '+12%',
    trendLabel: '较上月',
  },
  {
    key: 'roles',
    label: '角色数量',
    icon: <Icon name="TeamOutlined" />,
    gradient:
      'linear-gradient(135deg, var(--gvray-color-error) 0%, var(--gvray-color-warning) 100%)',
    trendUp: true,
    trendValue: '+2',
    trendLabel: '本月新增',
  },
  {
    key: 'permissions',
    label: '权限点数',
    icon: <Icon name="SafetyCertificateOutlined" />,
    gradient:
      'linear-gradient(135deg, var(--gvray-color-info) 0%, var(--gvray-color-primary-hover) 100%)',
    trendUp: true,
    trendValue: '+5',
    trendLabel: '本月新增',
  },
  {
    key: 'onlineUsers',
    label: '在线用户',
    icon: <Icon name="WifiOutlined" />,
    gradient:
      'linear-gradient(135deg, var(--gvray-color-success) 0%, var(--gvray-color-primary) 100%)',
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

  useEffect(() => {
    setLoading(true);
    fetchDashboardData()
      .catch(() => {
        // 全局 errorHandler 已提示
      })
      .finally(() => setLoading(false));
  }, [fetchDashboardData]);

  const getStatValue = (key: string): number => {
    if (!overview) return 0;
    return (overview[key] as number) ?? 0;
  };

  return (
    <div className={styles.pageWrapper}>
      {/* ── Welcome Header ── */}
      <div className={styles.welcomeSection}>
        <div className={styles.welcomeLeft}>
          <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
            欢迎回来 👋
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            这是你的系统运行概览，祝你工作愉快
          </Text>
        </div>
        <div className={styles.timeDisplay}>
          <Icon name="ClockCircleOutlined" />
          {format(new Date(), 'YYYY年MM月DD日 dddd HH:mm')}
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <Row gutter={[16, 16]}>
        {STAT_CONFIG.map((stat) => (
          <Col xs={24} sm={12} lg={6} key={stat.key}>
            <div
              className={styles.statCard}
              style={{ background: stat.gradient }}
            >
              <div className={styles.statIconWrap}>{stat.icon}</div>
              <div className={styles.statLabel}>{stat.label}</div>
              <div className={styles.statValue}>{getStatValue(stat.key)}</div>
              <div className={styles.statTrend}>
                {stat.trendUp ? (
                  <Icon name="ArrowUpOutlined" style={{ fontSize: 10 }} />
                ) : (
                  <Icon name="ArrowDownOutlined" style={{ fontSize: 10 }} />
                )}
                {stat.trendValue} {stat.trendLabel}
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* ── Charts ── */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={14}>
          <Card className={styles.chartCard} title="登录趋势">
            <LoginTrend data={loginData} height={340} />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card className={styles.chartCard} title="角色分布">
            <RoleDistribution data={roleDistribution} height={340} />
          </Card>
        </Col>
      </Row>

      {/* ── Activity ── */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card className={styles.chartCard} title="最近动态">
            <ActivityTimeline logs={logs} loading={loading} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;

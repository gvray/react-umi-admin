import { PageContainer } from '@/components';
import {
  ApiOutlined,
  BugOutlined,
  CloudServerOutlined,
  DollarOutlined,
  EyeOutlined,
  GlobalOutlined,
  ReloadOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Col,
  Progress,
  Row,
  Space,
  Spin,
  Statistic,
  Typography,
} from 'antd';
import { styled } from 'umi';
import Card from './components/Card';
import { DemoBar, DemoBarSale, DemoLine, DemoPie } from './components/Charts';
import Rank from './components/Rank';
import Trend from './components/Trend';
import Yoy from './components/Yoy';
import {
  formatCurrency,
  formatNumber,
  getStatusColor,
  useDashboardModel,
} from './model';

const { Title, Text } = Typography;

const PageWrapper = styled(PageContainer)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  min-height: 100vh;
`;

const StatsCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  height: 160px;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }

  .stats-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .chart-container {
    height: 40px;
    margin-top: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const TechCard = styled.div`
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  height: 160px;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  }

  .ant-statistic-title {
    color: rgba(255, 255, 255, 0.8);
  }

  .ant-statistic-content {
    color: white;
  }

  .stats-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .chart-container {
    height: 40px;
    margin-top: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  .title {
    color: white;
    margin: 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
`;

const RealtimeIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;

  .pulse {
    width: 8px;
    height: 8px;
    background: #52c41a;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(82, 196, 26, 0.7);
    }
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 10px rgba(82, 196, 26, 0);
    }
    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(82, 196, 26, 0);
    }
  }
`;

export default function DashboardPage() {
  const { stats, systemMetrics, loading, refreshData } = useDashboardModel();

  if (!stats || !systemMetrics) {
    return (
      <PageWrapper>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh',
          }}
        >
          <Spin size="large" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <HeaderSection>
        <Title level={2} className="title">
          🚀 智能数据中心
        </Title>
        <Space>
          <RealtimeIndicator>
            <div className="pulse" />
            <Text style={{ color: 'white' }}>实时监控</Text>
          </RealtimeIndicator>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            loading={loading}
            onClick={refreshData}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(10px)',
            }}
          >
            刷新数据
          </Button>
        </Space>
      </HeaderSection>

      <Row gutter={[16, 16]}>
        {/* 核心业务指标 */}
        <Col span={6}>
          <StatsCard>
            <div className="stats-content">
              <Statistic
                title="用户总数"
                value={stats.totalUsers}
                formatter={(value) => formatNumber(Number(value))}
                prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                suffix={
                  <Badge
                    count={`+${stats.dailyUsers}`}
                    style={{ backgroundColor: '#52c41a' }}
                  />
                }
              />
            </div>
            <div className="chart-container">
              <Yoy yod={18} yow={-7} />
            </div>
          </StatsCard>
        </Col>

        <Col span={6}>
          <StatsCard>
            <div className="stats-content">
              <Statistic
                title="总访问量"
                value={stats.totalViews}
                formatter={(value) => formatNumber(Number(value))}
                prefix={<EyeOutlined style={{ color: '#722ed1' }} />}
                suffix={
                  <Badge
                    count={`+${formatNumber(stats.dailyViews)}`}
                    style={{ backgroundColor: '#722ed1' }}
                  />
                }
              />
            </div>
            <div className="chart-container">
              <DemoLine />
            </div>
          </StatsCard>
        </Col>

        <Col span={6}>
          <StatsCard>
            <div className="stats-content">
              <Statistic
                title="订单总数"
                value={stats.totalOrders}
                formatter={(value) => formatNumber(Number(value))}
                prefix={<ShoppingCartOutlined style={{ color: '#fa8c16' }} />}
                suffix={<Text type="success">{stats.conversionRate}</Text>}
              />
            </div>
            <div className="chart-container">
              <DemoBar />
            </div>
          </StatsCard>
        </Col>

        <Col span={6}>
          <StatsCard>
            <div className="stats-content">
              <Statistic
                title="总销售额"
                value={stats.totalRevenue}
                formatter={(value) => formatCurrency(Number(value))}
                prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
              />
            </div>
            <div className="chart-container">
              <Progress
                percent={stats.revenueGrowth}
                status="active"
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                style={{ width: '100%' }}
              />
            </div>
          </StatsCard>
        </Col>

        {/* 系统监控指标 */}
        <Col span={6}>
          <TechCard>
            <div className="stats-content">
              <Statistic
                title="系统负载"
                value={stats.systemLoad}
                suffix="%"
                prefix={<CloudServerOutlined />}
                valueStyle={{
                  color: getStatusColor(stats.systemLoad, {
                    warning: 70,
                    danger: 85,
                  }),
                }}
              />
            </div>
            <div className="chart-container">
              <Progress
                percent={stats.systemLoad}
                showInfo={false}
                strokeColor={getStatusColor(stats.systemLoad, {
                  warning: 70,
                  danger: 85,
                })}
                style={{ width: '100%' }}
              />
            </div>
          </TechCard>
        </Col>

        <Col span={6}>
          <TechCard>
            <div className="stats-content">
              <Statistic
                title="API响应时间"
                value={stats.apiResponseTime}
                suffix="ms"
                prefix={<ApiOutlined />}
                valueStyle={{
                  color: getStatusColor(stats.apiResponseTime, {
                    warning: 150,
                    danger: 200,
                  }),
                }}
              />
              <Text
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '12px',
                  marginTop: '8px',
                }}
              >
                平均响应时间
              </Text>
            </div>
          </TechCard>
        </Col>

        <Col span={6}>
          <TechCard>
            <div className="stats-content">
              <Statistic
                title="活跃连接数"
                value={stats.activeConnections}
                prefix={<GlobalOutlined />}
              />
              <Text
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '12px',
                  marginTop: '8px',
                }}
              >
                当前在线用户
              </Text>
            </div>
          </TechCard>
        </Col>

        <Col span={6}>
          <TechCard>
            <div className="stats-content">
              <Statistic
                title="错误率"
                value={stats.errorRate}
                prefix={<BugOutlined />}
                valueStyle={{
                  color:
                    parseFloat(stats.errorRate) > 1 ? '#ff4d4f' : '#52c41a',
                }}
              />
              <Text
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '12px',
                  marginTop: '8px',
                }}
              >
                系统稳定性良好
              </Text>
            </div>
          </TechCard>
        </Col>

        {/* 图表区域 */}
        <Col span={14}>
          <Card title={'📈 销售趋势分析'}>
            <DemoBarSale />
          </Card>
        </Col>

        <Col span={10}>
          <Card title={'🏆 门店销售排行'}>
            <Rank />
          </Card>
        </Col>

        <Col span={14}>
          <Card title={'🔥 实时热门搜索'}>
            <Trend />
          </Card>
        </Col>

        <Col span={10}>
          <Card title={'📊 销售类别分布'}>
            <DemoPie />
          </Card>
        </Col>
      </Row>
    </PageWrapper>
  );
}

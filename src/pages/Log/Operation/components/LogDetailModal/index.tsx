import { DateTimeFormat, Icon } from '@/components';
import {
  Alert,
  Button,
  Card,
  Collapse,
  Descriptions,
  Empty,
  Modal,
  Spin,
  Tag,
  Tooltip,
} from 'antd';
import React from 'react';
import { styled } from 'umi';

/* ── styled ── */

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px 0;
`;

const ErrorWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 48px 0;
`;

const SummaryBar = styled.div<{ $success: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  background: ${({ $success }) =>
    $success
      ? 'linear-gradient(135deg, #f6ffed 0%, #e6f7e6 100%)'
      : 'linear-gradient(135deg, #fff2f0 0%, #ffe6e6 100%)'};
  border: 1px solid ${({ $success }) => ($success ? '#b7eb8f' : '#ffccc7')};

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const SummaryLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SummaryIcon = styled.span<{ $success: boolean }>`
  font-size: 22px;
  color: ${({ $success }) => ($success ? '#52c41a' : '#ff4d4f')};
`;

const SummaryText = styled.span<{ $success: boolean }>`
  font-size: 16px;
  font-weight: 600;
  color: ${({ $success }) => ($success ? '#389e0d' : '#cf1322')};
`;

const SummaryRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--gvray-text-color-secondary);
`;

const LatencyBadge = styled.span`
  background: var(--gvray-bg-elevated);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-family: monospace;
  color: var(--gvray-text-color);
`;

const SectionTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: var(--gvray-text-color);
  margin-bottom: 10px;
  padding-left: 10px;
  border-left: 3px solid var(--gvray-color-primary);
`;

const Section = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const JsonCode = styled.pre`
  margin: 0;
  padding: 12px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--gvray-text-color);
  max-height: 240px;
  overflow: auto;
`;

const Ellipsis = styled.span`
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
`;

const BreakWord = styled.span`
  display: inline-block;
  max-width: 100%;
  word-break: break-all;
  line-height: 1.6;
`;

/* ── interface ── */

interface LogDetailModalProps {
  open: boolean;
  onClose: () => void;
  loading: boolean;
  error: string | null;
  data: Record<string, unknown> | null;
  onRetry: () => void;
}

const METHOD_COLOR: Record<string, string> = {
  GET: 'success',
  POST: 'processing',
  PUT: 'warning',
  DELETE: 'error',
};

/* ── component ── */

const LogDetailModal: React.FC<LogDetailModalProps> = ({
  open,
  onClose,
  loading,
  error,
  data,
  onRetry,
}) => {
  const renderSummary = () => {
    if (!data) return null;
    const isSuccess = data.result === 'success';
    return (
      <SummaryBar $success={isSuccess}>
        <SummaryLeft>
          <SummaryIcon $success={isSuccess}>
            {isSuccess ? (
              <Icon name="CheckCircleFilled" />
            ) : (
              <Icon name="CloseCircleFilled" />
            )}
          </SummaryIcon>
          <SummaryText $success={isSuccess}>
            {isSuccess ? '请求成功' : '请求失败'}
          </SummaryText>
        </SummaryLeft>
        <SummaryRight>
          <DateTimeFormat value={data.createdAt as string} />
          {data.latencyMs ? (
            <LatencyBadge>{String(data.latencyMs)} ms</LatencyBadge>
          ) : null}
        </SummaryRight>
      </SummaryBar>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <LoadingWrapper>
          <Spin />
        </LoadingWrapper>
      );
    }
    if (error) {
      return (
        <ErrorWrapper>
          <Empty description={error}>
            <Button type="primary" onClick={onRetry}>
              重新加载
            </Button>
          </Empty>
        </ErrorWrapper>
      );
    }
    if (!data) return null;

    const query = data.query as Record<string, unknown>;
    const body = data.body as Record<string, unknown>;

    const collapseItems = [
      {
        key: 'params',
        label: '请求参数',
        children: (
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
          >
            <Card size="small" title="Query">
              <JsonCode>
                {query && Object.keys(query).length > 0
                  ? JSON.stringify(query, null, 2)
                  : '{}'}
              </JsonCode>
            </Card>
            <Card size="small" title="Body">
              <JsonCode>
                {body && Object.keys(body).length > 0
                  ? JSON.stringify(body, null, 2)
                  : '{}'}
              </JsonCode>
            </Card>
          </div>
        ),
      },
      {
        key: 'raw',
        label: '原始数据',
        children: <JsonCode>{JSON.stringify(data, null, 2)}</JsonCode>,
      },
    ];

    return (
      <div style={{ padding: '8px 0' }}>
        {renderSummary()}

        <Section>
          <SectionTitle>基础信息</SectionTitle>
          <Descriptions
            column={2}
            bordered
            size="small"
            labelStyle={{ width: 56, minWidth: 56, paddingRight: 8 }}
            contentStyle={{ overflow: 'hidden' }}
          >
            <Descriptions.Item label="方法">
              <Tag color={METHOD_COLOR[String(data.method)] || 'default'}>
                {String(data.method ?? '-')}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="模块">
              {String(data.module ?? '-')}
            </Descriptions.Item>
            <Descriptions.Item label="操作">
              {String(data.action ?? '-')}
            </Descriptions.Item>
            <Descriptions.Item label="日志ID">
              {String(data.id ?? '-')}
            </Descriptions.Item>
            <Descriptions.Item label="资源" span={2}>
              <Tooltip title={String(data.resource ?? '')}>
                <Ellipsis>{String(data.resource ?? '-')}</Ellipsis>
              </Tooltip>
            </Descriptions.Item>
            <Descriptions.Item label="路径" span={2}>
              <Tooltip title={String(data.path ?? '')}>
                <Ellipsis>{String(data.path ?? '')}</Ellipsis>
              </Tooltip>
            </Descriptions.Item>
          </Descriptions>
        </Section>

        <Section>
          <SectionTitle>客户端信息</SectionTitle>
          <Descriptions
            column={2}
            bordered
            size="small"
            labelStyle={{ width: 56, minWidth: 56, paddingRight: 8 }}
            contentStyle={{ overflow: 'hidden' }}
          >
            <Descriptions.Item label="用户">
              {String(data.username ?? data.nickname ?? '-')}
            </Descriptions.Item>
            <Descriptions.Item label="IP">
              {String(data.ipAddress ?? '-')}
            </Descriptions.Item>
            <Descriptions.Item label="地点">
              {String(data.location ?? '-')}
            </Descriptions.Item>
            <Descriptions.Item label="耗时">
              {data.latencyMs ? `${data.latencyMs} ms` : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="UA" span={2}>
              <Tooltip title={String(data.userAgent ?? '')}>
                <BreakWord>{String(data.userAgent ?? '')}</BreakWord>
              </Tooltip>
            </Descriptions.Item>
          </Descriptions>
        </Section>

        <Section>
          <Collapse items={collapseItems} ghost />
        </Section>

        {data.message ? (
          <Section>
            <Alert
              message={String(data.message)}
              type={data.result === 'success' ? 'success' : 'error'}
              showIcon
            />
          </Section>
        ) : null}
      </div>
    );
  };

  return (
    <Modal
      open={open}
      title="日志详情"
      onCancel={onClose}
      footer={null}
      width={680}
    >
      {renderContent()}
    </Modal>
  );
};

export default LogDetailModal;

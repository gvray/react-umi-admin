import { DateTimeFormat } from '@/components';
import { CopyOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Descriptions, Modal, Tag, Typography, message } from 'antd';
import React from 'react';
import { CONFIG_TYPE_COLORS, CONFIG_TYPE_LABELS } from '../../constants';

const { Text } = Typography;

interface ConfigValueViewerProps {
  config: API.ConfigResponseDto;
  visible: boolean;
  onClose: () => void;
  dict: Record<string, { label: string; value: string | number }[]>;
}

const ConfigValueViewer: React.FC<ConfigValueViewerProps> = ({
  config,
  visible,
  onClose,
  dict,
}) => {
  const handleCopy = () => {
    navigator.clipboard
      .writeText(config.value)
      .then(() => message.success('已复制'))
      .catch(() => message.error('复制失败'));
  };

  const groupLabel =
    dict['config_group']?.find((d) => String(d.value) === config.group)
      ?.label || config.group;

  return (
    <Modal
      title={
        <>
          <EyeOutlined style={{ marginRight: 8 }} />
          查看配置详情
        </>
      }
      open={visible}
      onCancel={onClose}
      footer={<Button onClick={onClose}>关闭</Button>}
      width={680}
      destroyOnHidden
    >
      <Descriptions column={2} bordered size="small" style={{ marginTop: 16 }}>
        <Descriptions.Item label="配置名称" span={2}>
          <Text strong>{config.name}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="配置键">
          <Tag color="blue" style={{ fontFamily: 'monospace' }}>
            {config.key}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="配置类型">
          <Tag color={CONFIG_TYPE_COLORS[config.type] || 'default'}>
            {CONFIG_TYPE_LABELS[config.type] || config.type}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="配置分组">
          <Tag>{groupLabel}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="排序权重">{config.sort}</Descriptions.Item>
        <Descriptions.Item label="状态">
          <Tag color={config.status === 1 ? 'success' : 'default'}>
            {config.status === 1 ? '启用' : '禁用'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">
          <DateTimeFormat value={config.createdAt} />
        </Descriptions.Item>
        {config.description && (
          <Descriptions.Item label="描述" span={2}>
            {config.description}
          </Descriptions.Item>
        )}
        {config.remark && (
          <Descriptions.Item label="备注" span={2}>
            {config.remark}
          </Descriptions.Item>
        )}
      </Descriptions>

      <div style={{ marginTop: 16 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <Text strong>配置值</Text>
          <Button size="small" icon={<CopyOutlined />} onClick={handleCopy}>
            复制
          </Button>
        </div>
        <div
          style={{
            padding: 12,
            backgroundColor: '#f6f8fa',
            borderRadius: 6,
            border: '1px solid #e1e4e8',
            fontFamily: 'monospace',
            fontSize: 13,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            maxHeight: 260,
            overflow: 'auto',
            lineHeight: 1.6,
          }}
        >
          {config.type === 'json'
            ? (() => {
                try {
                  return JSON.stringify(JSON.parse(config.value), null, 2);
                } catch {
                  return config.value;
                }
              })()
            : config.value}
        </div>
      </div>
    </Modal>
  );
};

export default ConfigValueViewer;

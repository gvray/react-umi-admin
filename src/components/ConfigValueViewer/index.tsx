import { EyeOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Modal, Tag, Typography } from 'antd';

const { Text } = Typography;

export interface ConfigData {
  configId: string;
  key: string;
  value: string;
  name: string;
  description?: string;
  type: string;
  group: string;
  status: number;
  sort: number;
  remark?: string;
  createdAt: string;
  updatedAt: string;
}

interface ConfigValueViewerProps {
  config: ConfigData;
  visible: boolean;
  onClose: () => void;
}

// 配置类型标签颜色映射
const getTypeColor = (type: string) => {
  const colorMap: { [key: string]: string } = {
    string: 'blue',
    number: 'green',
    boolean: 'orange',
    json: 'purple',
  };
  return colorMap[type] || 'default';
};

// 配置分组标签颜色映射
const getGroupColor = (group: string) => {
  const colorMap: { [key: string]: string } = {
    system: 'red',
    business: 'blue',
    security: 'orange',
    ui: 'green',
    api: 'purple',
  };
  return colorMap[group] || 'default';
};

// 格式化配置值显示
const formatConfigValue = (value: string, type: string) => {
  switch (type) {
    case 'boolean':
      return value === 'true' ? '是' : '否';
    case 'json':
      try {
        return JSON.stringify(JSON.parse(value), null, 2);
      } catch {
        return value;
      }
    default:
      return value;
  }
};

const ConfigValueViewer: React.FC<ConfigValueViewerProps> = ({
  config,
  visible,
  onClose,
}) => {
  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <EyeOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          查看配置值
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          关闭
        </Button>,
      ]}
      width={700}
      destroyOnClose
    >
      <div style={{ padding: '16px 0' }}>
        {/* 配置基本信息 */}
        <div style={{ marginBottom: '24px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px',
            }}
          >
            <SettingOutlined
              style={{ color: '#1890ff', marginRight: '8px', fontSize: '18px' }}
            />
            <Text strong style={{ fontSize: '18px' }}>
              {config.name}
            </Text>
          </div>
          {config.description && (
            <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
              {config.description}
            </div>
          )}
        </div>

        {/* 配置属性信息 */}
        <div
          style={{
            marginBottom: '24px',
            padding: '16px',
            backgroundColor: '#fafafa',
            borderRadius: '8px',
            border: '1px solid #f0f0f0',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
            }}
          >
            <div>
              <Text strong style={{ color: '#666' }}>
                配置键：
              </Text>
              <div style={{ marginTop: '4px' }}>
                <Tag
                  color="blue"
                  style={{ fontFamily: 'monospace', fontSize: '12px' }}
                >
                  {config.key}
                </Tag>
              </div>
            </div>
            <div>
              <Text strong style={{ color: '#666' }}>
                配置类型：
              </Text>
              <div style={{ marginTop: '4px' }}>
                <Tag color={getTypeColor(config.type)}>
                  {config.type === 'string' && '字符串'}
                  {config.type === 'number' && '数字'}
                  {config.type === 'boolean' && '布尔值'}
                  {config.type === 'json' && 'JSON'}
                </Tag>
              </div>
            </div>
            <div>
              <Text strong style={{ color: '#666' }}>
                配置分组：
              </Text>
              <div style={{ marginTop: '4px' }}>
                <Tag color={getGroupColor(config.group)}>
                  {config.group === 'system' && '系统'}
                  {config.group === 'business' && '业务'}
                  {config.group === 'security' && '安全'}
                  {config.group === 'ui' && '界面'}
                  {config.group === 'api' && '接口'}
                </Tag>
              </div>
            </div>
            <div>
              <Text strong style={{ color: '#666' }}>
                排序权重：
              </Text>
              <div style={{ marginTop: '4px' }}>
                <Tag color={config.sort === 0 ? 'default' : 'green'}>
                  {config.sort}
                </Tag>
              </div>
            </div>
          </div>
        </div>

        {/* 配置值展示 */}
        <div>
          <div style={{ marginBottom: '12px' }}>
            <Text strong style={{ fontSize: '16px' }}>
              配置值：
            </Text>
          </div>
          <div
            style={{
              padding: '16px',
              backgroundColor: '#f6f8fa',
              borderRadius: '8px',
              border: '1px solid #e1e4e8',
              fontFamily: config.type === 'json' ? 'monospace' : 'inherit',
              fontSize: config.type === 'json' ? '13px' : '14px',
              whiteSpace: config.type === 'json' ? 'pre-wrap' : 'normal',
              wordBreak: 'break-all',
              maxHeight: '300px',
              overflow: 'auto',
              lineHeight: '1.6',
              color: '#24292e',
            }}
          >
            {formatConfigValue(config.value, config.type)}
          </div>
        </div>

        {/* 备注信息 */}
        {config.remark && (
          <div style={{ marginTop: '24px' }}>
            <div style={{ marginBottom: '8px' }}>
              <Text strong style={{ color: '#666' }}>
                备注：
              </Text>
            </div>
            <div
              style={{
                padding: '12px',
                backgroundColor: '#fff7e6',
                borderRadius: '6px',
                border: '1px solid #ffd591',
                color: '#8c8c8c',
                fontSize: '13px',
                lineHeight: '1.5',
              }}
            >
              {config.remark}
            </div>
          </div>
        )}

        {/* 时间信息 */}
        <div
          style={{
            marginTop: '24px',
            padding: '12px',
            backgroundColor: '#f9f9f9',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#999',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>创建时间：{new Date(config.createdAt).toLocaleString()}</span>
            <span>更新时间：{new Date(config.updatedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfigValueViewer;

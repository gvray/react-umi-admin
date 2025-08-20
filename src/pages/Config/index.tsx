import {
  DateTimeFormat,
  PageContainer,
  StatusTag,
  TablePro,
} from '@/components';
import { AdvancedSearchItem } from '@/components/TablePro/components/AdvancedSearchForm';
import { deleteConfig, getConfig, listConfig } from '@/services/config';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  PlusOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Button, Modal, Space, Tag, Typography, message } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { useRef, useState } from 'react';
import UpdateForm, { UpdateFormRef } from './UpdateForm';
import ConfigValueViewer, { ConfigData } from './components/ConfigValueViewer';

const { Text } = Typography;

type DataType = ConfigData;

interface ConfigColumnProps<T, U> extends ColumnProps<T> {
  advancedSearch?: AdvancedSearchItem<U>;
}

const ConfigPage = () => {
  const updateFormRef = useRef<UpdateFormRef>(null);
  const tableProRef = useRef<any>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<DataType | null>(null);

  const handleTableReload = () => {
    tableProRef.current?.reload();
  };

  const handleAdd = async () => {
    updateFormRef.current?.show('添加配置');
  };

  const handleDelete = async (record: DataType) => {
    Modal.confirm({
      title: `删除确认`,
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>
            确定要删除配置 <strong>&quot;{record.name}&quot;</strong> 吗？
          </p>
          <p style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '8px' }}>
            删除后将无法恢复！
          </p>
        </div>
      ),
      okText: '确认删除',
      cancelText: '取消',
      okType: 'danger',
      onOk() {
        return deleteConfig(record.configId)
          .then(() => {
            handleTableReload();
            message.success(`配置"${record.name}"删除成功`);
          })
          .catch(() => {});
      },
    });
  };

  const handleUpdate = async (record: DataType) => {
    const configId = record.configId;
    try {
      const msg: any = await getConfig(configId);
      updateFormRef.current?.show('修改配置', {
        ...msg.data,
      });
    } catch (error) {}
  };

  // 查看配置值
  const handleViewValue = async (record: DataType) => {
    try {
      const msg: any = await getConfig(record.configId);
      setCurrentConfig(msg.data);
      setViewModalVisible(true);
    } catch (error) {
      message.error('获取配置详情失败');
    }
  };

  const handleOk = () => {
    handleTableReload();
  };

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

  const columns: ConfigColumnProps<
    DataType,
    Record<string, string | number>
  >[] = [
    {
      title: '配置名称',
      dataIndex: 'name',
      key: 'name',
      width: 220,
      advancedSearch: { type: 'INPUT' },
      render: (name: string, record: DataType) => (
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '6px',
            }}
          >
            <SettingOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
            <Text strong style={{ fontSize: '14px' }}>
              {name}
            </Text>
          </div>
          {record.description && (
            <div
              style={{
                fontSize: '12px',
                color: '#666',
                lineHeight: '1.4',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {record.description}
            </div>
          )}
        </div>
      ),
    },
    {
      title: '配置键',
      dataIndex: 'key',
      key: 'key',
      width: 160,
      advancedSearch: { type: 'INPUT' },
      render: (key: string) => (
        <Tag color="blue" style={{ fontFamily: 'monospace', fontSize: '12px' }}>
          {key}
        </Tag>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      advancedSearch: {
        type: 'SELECT',
        value: [
          { label: '字符串', value: 'string' },
          { label: '数字', value: 'number' },
          { label: '布尔值', value: 'boolean' },
          { label: 'JSON', value: 'json' },
        ],
      },
      render: (type: string) => (
        <Tag color={getTypeColor(type)} style={{ fontSize: '12px' }}>
          {type === 'string' && '字符串'}
          {type === 'number' && '数字'}
          {type === 'boolean' && '布尔值'}
          {type === 'json' && 'JSON'}
        </Tag>
      ),
    },
    {
      title: '分组',
      dataIndex: 'group',
      key: 'group',
      width: 100,
      advancedSearch: {
        type: 'SELECT',
        value: [
          { label: '系统', value: 'system' },
          { label: '业务', value: 'business' },
          { label: '安全', value: 'security' },
          { label: '界面', value: 'ui' },
          { label: '接口', value: 'api' },
        ],
      },
      render: (group: string) => (
        <Tag color={getGroupColor(group)} style={{ fontSize: '12px' }}>
          {group === 'system' && '系统'}
          {group === 'business' && '业务'}
          {group === 'security' && '安全'}
          {group === 'ui' && '界面'}
          {group === 'api' && '接口'}
        </Tag>
      ),
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
      render: (sort: number) => (
        <Tag
          color={sort === 0 ? 'default' : 'green'}
          style={{ fontSize: '12px' }}
        >
          {sort}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      advancedSearch: {
        type: 'SELECT',
        value: [
          { label: '禁用', value: 0 },
          { label: '启用', value: 1 },
        ],
      },
      render: (status: number) => <StatusTag status={status} />,
    },
    {
      title: '创建时间',
      key: 'createdAt',
      dataIndex: 'createdAt',
      width: 140,
      render: (time: string) => <DateTimeFormat value={time} />,
      advancedSearch: {
        type: 'TIME_RANGE',
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (record) => {
        return (
          <Space size="small">
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewValue(record)}
              style={{ padding: '4px 8px' }}
            >
              查看值
            </Button>
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleUpdate(record)}
              style={{ padding: '4px 8px' }}
            >
              编辑
            </Button>
            <Button
              danger
              type="link"
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
              style={{ padding: '4px 8px' }}
            >
              删除
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <PageContainer>
      {/* 配置表格 */}
      <TablePro
        toolbarRender={() => {
          return (
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增配置
            </Button>
          );
        }}
        rowKey={'configId'}
        ref={tableProRef}
        columns={columns}
        request={listConfig}
        pagination={false}
      />
      {/* 配置新增修改弹出层 */}
      <UpdateForm ref={updateFormRef} onOk={handleOk} />

      {/* 查看配置值弹出层 */}
      {currentConfig && (
        <ConfigValueViewer
          config={currentConfig}
          visible={viewModalVisible}
          onClose={() => setViewModalVisible(false)}
        />
      )}
    </PageContainer>
  );
};

export default ConfigPage;

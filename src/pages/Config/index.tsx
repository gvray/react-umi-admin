import {
  DateTimeFormat,
  PageContainer,
  StatusTag,
  TablePro,
} from '@/components';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  PlusOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Button, Modal, Space, Tag, Typography, message } from 'antd';
import { useRef, useState } from 'react';
import UpdateForm, { UpdateFormRef } from './UpdateForm';
import { getConfigColumns } from './columns';
import ConfigValueViewer from './components/ConfigValueViewer';
import {
  CONFIG_GROUP_COLORS,
  CONFIG_GROUP_LABELS,
  CONFIG_GROUP_OPTIONS,
} from './constants';
import { useConfig, type ConfigData } from './model';

const { Text } = Typography;

type DataType = ConfigData;

const ConfigPage = () => {
  const updateFormRef = useRef<UpdateFormRef>(null);
  const tableProRef = useRef<any>(null);
  const { fetchConfigList, fetchConfigDetail, removeConfig } = useConfig();
  const [viewVisible, setViewVisible] = useState(false);
  const [currentConfig, setCurrentConfig] =
    useState<API.ConfigResponseDto | null>(null);

  const tableReload = () => {
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
        return removeConfig(record.configId)
          .then(() => {
            tableReload();
            message.success(`配置"${record.name}"删除成功`);
          })
          .catch(() => {});
      },
    });
  };

  const handleUpdate = async (record: DataType) => {
    const configId = record.configId;
    try {
      const data: any = await fetchConfigDetail(configId);
      updateFormRef.current?.show('修改配置', {
        ...data,
      });
    } catch (error) {}
  };

  // 查看配置值
  const handleViewValue = async (record: DataType) => {
    setViewVisible(true);
    try {
      const data = await fetchConfigDetail(record.configId);
      setCurrentConfig(data);
    } catch (error) {
      setViewVisible(false);
    }
  };

  const handleCloseDetail = () => {
    setViewVisible(false);
    setCurrentConfig(null);
  };

  const handleOk = () => {
    tableReload();
  };

  const baseColumns = getConfigColumns();
  let columns = baseColumns.map((column) => {
    if (column.dataIndex === 'name') {
      return {
        ...column,
        render: (name: string, record: DataType) => (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '6px',
              }}
            >
              <SettingOutlined
                style={{ color: '#1890ff', marginRight: '8px' }}
              />
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
      };
    }
    if (column.dataIndex === 'key') {
      return {
        ...column,
        render: (key: string) => (
          <Tag
            color="blue"
            style={{ fontFamily: 'monospace', fontSize: '12px' }}
          >
            {key}
          </Tag>
        ),
      };
    }
    if (column.dataIndex === 'type') {
      const getTypeColor = (type: string) => {
        const colorMap: { [key: string]: string } = {
          string: 'blue',
          number: 'green',
          boolean: 'orange',
          json: 'purple',
        };
        return colorMap[type] || 'default';
      };
      return {
        ...column,
        render: (type: string) => (
          <Tag color={getTypeColor(type)} style={{ fontSize: '12px' }}>
            {type === 'string' && '字符串'}
            {type === 'number' && '数字'}
            {type === 'boolean' && '布尔值'}
            {type === 'json' && 'JSON'}
          </Tag>
        ),
      };
    }
    if (column.dataIndex === 'group') {
      return {
        ...column,
        advancedSearch: {
          type: 'SELECT',
          value: CONFIG_GROUP_OPTIONS,
        },
        render: (group: string) => {
          const label = CONFIG_GROUP_LABELS[group] || group;
          const color = CONFIG_GROUP_COLORS[group] || 'default';
          return <Tag color={color}>{label}</Tag>;
        },
      };
    }
    if (column.dataIndex === 'sort') {
      return {
        ...column,
        render: (sort: number) => (
          <Tag
            color={sort === 0 ? 'default' : 'green'}
            style={{ fontSize: '12px' }}
          >
            {sort}
          </Tag>
        ),
      };
    }
    if (column.dataIndex === 'status') {
      return {
        ...column,
        render: (status: number) => <StatusTag status={status} />,
      };
    }
    if (column.dataIndex === 'createdAt') {
      return {
        ...column,
        render: (time: string) => <DateTimeFormat value={time} />,
      };
    }
    return column;
  });
  columns = [
    ...columns,
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (record: any) => {
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
        columns={columns as any}
        request={fetchConfigList}
      />
      {/* 配置新增修改弹出层 */}
      <UpdateForm ref={updateFormRef} onOk={handleOk} />

      {/* 查看配置值弹出层 */}
      {currentConfig && (
        <ConfigValueViewer
          config={currentConfig}
          visible={viewVisible}
          onClose={() => handleCloseDetail()}
        />
      )}
    </PageContainer>
  );
};

export default ConfigPage;

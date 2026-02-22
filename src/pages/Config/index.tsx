import {
  AuthButton,
  DateTimeFormat,
  PageContainer,
  StatusTag,
  TablePro,
} from '@/components';
import { TableProRef } from '@/components/TablePro';
import useDict from '@/hooks/useDict';
import { logger } from '@/utils';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { Modal, Space, Tag, Typography, message } from 'antd';
import { useRef, useState } from 'react';
import UpdateForm, { UpdateFormRef } from './UpdateForm';
import { getConfigColumns } from './columns';
import ConfigValueViewer from './components/ConfigValueViewer';
import { CONFIG_TYPE_COLORS, CONFIG_TYPE_LABELS } from './constants';
import { useConfigModel } from './model';

const { Text } = Typography;

const ConfigPage = () => {
  const updateFormRef = useRef<UpdateFormRef>(null);
  const tableProRef = useRef<TableProRef>(null);
  const dict = useDict<{
    config_group: { label: string; value: string | number }[];
  }>(['config_group']);
  const { fetchConfigList, fetchConfigDetail, removeConfig } = useConfigModel();
  const [viewVisible, setViewVisible] = useState(false);
  const [currentConfig, setCurrentConfig] =
    useState<API.ConfigResponseDto | null>(null);

  const tableReload = () => {
    tableProRef.current?.reload();
  };

  const handleAdd = () => {
    updateFormRef.current?.show('添加配置');
  };

  const handleDelete = (record: API.ConfigResponseDto) => {
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除配置"${record.name}"的数据项？`,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        return removeConfig(record.configId)
          .then(() => {
            tableReload();
            message.success('删除成功');
          })
          .catch(() => {});
      },
    });
  };

  const handleUpdate = async (record: API.ConfigResponseDto) => {
    try {
      const data: any = await fetchConfigDetail(record.configId);
      updateFormRef.current?.show('修改配置', data);
    } catch (error) {
      logger.error(error as string);
    }
  };

  const handleView = async (record: API.ConfigResponseDto) => {
    setViewVisible(true);
    try {
      const data = await fetchConfigDetail(record.configId);
      setCurrentConfig(data);
    } catch {
      setViewVisible(false);
    }
  };

  const handleOk = () => {
    tableReload();
  };

  // 构建列定义
  let columns = getConfigColumns().map((column: any) => {
    if (column.dataIndex === 'name') {
      return {
        ...column,
        render: (name: string, record: API.ConfigResponseDto) => (
          <div>
            <Text strong>{name}</Text>
            {record.description && (
              <div
                style={{
                  fontSize: 12,
                  color: '#999',
                  marginTop: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical' as const,
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
          <Tag color="blue" style={{ fontFamily: 'monospace', fontSize: 12 }}>
            {key}
          </Tag>
        ),
      };
    }
    if (column.dataIndex === 'type') {
      return {
        ...column,
        render: (type: string) => (
          <Tag color={CONFIG_TYPE_COLORS[type] || 'default'}>
            {CONFIG_TYPE_LABELS[type] || type}
          </Tag>
        ),
      };
    }
    if (column.dataIndex === 'group') {
      return {
        ...column,
        advancedSearch: {
          type: 'SELECT',
          value: dict['config_group'],
        },
        render: (group: string) => {
          const label =
            dict['config_group']?.find((d) => String(d.value) === group)
              ?.label || group;
          return <Tag>{label}</Tag>;
        },
      };
    }
    if (column.dataIndex === 'status') {
      return {
        ...column,
        render: (status: string | number) => (
          <StatusTag
            value={status}
            options={[
              { label: '禁用', value: 0 },
              { label: '启用', value: 1 },
            ]}
          />
        ),
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
      render: (record: any) => (
        <Space size={0}>
          <AuthButton
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            perms={['system:config:view']}
          >
            查看
          </AuthButton>
          <AuthButton
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleUpdate(record)}
            perms={['system:config:update']}
          >
            修改
          </AuthButton>
          <AuthButton
            danger
            type="link"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            perms={['system:config:delete']}
          >
            删除
          </AuthButton>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <TablePro
        rowKey="configId"
        toolbarRender={() => (
          <AuthButton
            type="primary"
            onClick={handleAdd}
            perms={['system:config:create']}
          >
            新增配置
          </AuthButton>
        )}
        ref={tableProRef}
        columns={columns}
        request={fetchConfigList}
      />
      <UpdateForm ref={updateFormRef} dict={dict} onOk={handleOk} />
      {currentConfig && (
        <ConfigValueViewer
          config={currentConfig}
          visible={viewVisible}
          dict={dict}
          onClose={() => {
            setViewVisible(false);
            setCurrentConfig(null);
          }}
        />
      )}
    </PageContainer>
  );
};

export default ConfigPage;

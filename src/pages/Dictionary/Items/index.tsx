import { PageContainer, TablePro } from '@/components';
import StatusTag from '@/components/StatusTag';
import { TableProRef } from '@/components/TablePro';
import { AdvancedSearchItem } from '@/components/TablePro/components/AdvancedSearchForm';
import {
  deleteDictionaryItem,
  getDictionaryItem,
  getDictionaryType,
  listDictionaryItem,
} from '@/services/dictionary';
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Card, Modal, Space, Typography, message } from 'antd';
import { ColumnProps } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'umi';
import UpdateForm, { UpdateFormRef } from './UpdateForm';

const { Title, Text } = Typography;

interface DataType {
  itemId: string;
  typeId: string;
  code: string;
  name: string;
  value: string;
  label: string;
  description?: string;
  status: number;
  sort: number;
  remark?: string;
  createdAt: string;
  updatedAt: string;
}

interface DictionaryItemColumnProps<T, U> extends ColumnProps<T> {
  advancedSearch?: AdvancedSearchItem<U>;
}

const DictionaryItemsPage = () => {
  const { typeId } = useParams();
  const [dictionaryType, setDictionaryType] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const updateFormRef = useRef<UpdateFormRef>(null);
  const tableProRef = useRef<TableProRef>(null);

  const fetchDictionaryType = async () => {
    if (!typeId) return;
    try {
      setLoading(true);
      const res = await getDictionaryType(typeId);
      setDictionaryType(res.data);
    } catch (error) {
      message.error('获取字典类型信息失败');
    } finally {
      setLoading(false);
    }
  };

  const handleTableReload = () => {
    tableProRef.current?.reload();
  };

  const handleAdd = async () => {
    updateFormRef.current?.show('添加字典项', { typeId });
  };

  const handleDelete = async (record: DataType) => {
    Modal.confirm({
      title: `系统提示`,
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除字典项"${record.name}"？`,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        return deleteDictionaryItem(record.itemId)
          .then(() => {
            handleTableReload();
            message.success(`删除成功`);
          })
          .catch(() => {});
      },
    });
  };

  const handleUpdate = async (record: DataType) => {
    const itemId = record.itemId;
    try {
      const msg = await getDictionaryItem(itemId);
      updateFormRef.current?.show('修改字典项', {
        ...msg.data,
        typeId,
      });
    } catch (error) {}
  };

  const handleOk = () => {
    handleTableReload();
  };

  useEffect(() => {
    if (typeId) {
      fetchDictionaryType();
    }
  }, [typeId]);

  const columns: DictionaryItemColumnProps<
    DataType,
    Record<string, string | number>
  >[] = [
    {
      title: '字典项ID',
      dataIndex: 'itemId',
      key: 'itemId',
      width: 120,
      render: (itemId: string) => {
        return (
          <Text copyable style={{ fontSize: '12px' }}>
            {itemId}
          </Text>
        );
      },
    },
    {
      title: '字典项编码',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      advancedSearch: { type: 'INPUT' },
      render: (code: string) => {
        return (
          <Text copyable style={{ fontSize: '12px' }}>
            {code}
          </Text>
        );
      },
    },
    {
      title: '字典项名称',
      dataIndex: 'name',
      key: 'name',
      advancedSearch: { type: 'INPUT' },
    },
    {
      title: '字典项值',
      dataIndex: 'value',
      key: 'value',
      width: 120,
      advancedSearch: { type: 'INPUT' },
    },
    {
      title: '显示标签',
      dataIndex: 'label',
      key: 'label',
      width: 120,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: 200,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      advancedSearch: {
        type: 'SELECT',
        value: [
          { label: '禁用', value: 0 },
          { label: '启用', value: 1 },
        ],
      },
      render: (status: number) => {
        return <StatusTag status={status} />;
      },
    },
    {
      title: '创建时间',
      key: 'createdAt',
      dataIndex: 'createdAt',
      width: 120,
      render: (time: string) => {
        return dayjs(time).format('YYYY-MM-DD HH:mm');
      },
      advancedSearch: {
        type: 'TIME_RANGE',
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (record) => {
        return (
          <Space size={0}>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleUpdate(record)}
            >
              修改
            </Button>
            <Button
              danger
              type="link"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            >
              删除
            </Button>
          </Space>
        );
      },
    },
  ];

  if (!typeId) {
    return (
      <PageContainer>
        <Card>
          <div
            style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}
          >
            请提供字典类型ID
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Card style={{ marginBottom: 16 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={() => window.history.back()}
              style={{ padding: 0, marginBottom: 8 }}
            >
              返回字典类型列表
            </Button>
            <div>
              <Title level={4} style={{ margin: 0 }}>
                {dictionaryType?.name || '字典项管理'}
              </Title>
              <Text type="secondary">
                {dictionaryType?.code} -{' '}
                {dictionaryType?.description || '暂无描述'}
              </Text>
            </div>
          </div>
          <div>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增字典项
            </Button>
          </div>
        </div>
      </Card>

      <TablePro
        rowKey={'itemId'}
        ref={tableProRef}
        columns={columns}
        request={(params) => listDictionaryItem(typeId, params)}
        loading={loading}
      />

      {/* 字典项新增修改弹出层 */}
      <UpdateForm ref={updateFormRef} onOk={handleOk} />
    </PageContainer>
  );
};

export default DictionaryItemsPage;

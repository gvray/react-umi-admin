import { DateTimeFormat, PageContainer, TablePro } from '@/components';
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
  BookOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Modal,
  Row,
  Space,
  Tag,
  Typography,
  message,
} from 'antd';
import { ColumnProps } from 'antd/es/table';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'umi';
import UpdateForm, { UpdateFormRef } from './UpdateForm';

const { Title, Text, Paragraph } = Typography;
interface DataType {
  itemId: string;
  typeCode: string;
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
      const res: any = await getDictionaryType(typeId);
      setDictionaryType(res.data);
    } catch (error) {
      message.error('获取字典类型信息失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeId) {
      fetchDictionaryType();
    }
  }, [typeId]);

  const handleTableReload = () => {
    tableProRef.current?.reload();
  };

  const handleAdd = async () => {
    updateFormRef.current?.show('添加字典项', {
      typeCode: dictionaryType.code,
    });
  };

  const handleDelete = async (record: DataType) => {
    Modal.confirm({
      title: `删除确认`,
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>
            确定要删除字典项 <strong>&quot;{record.label}&quot;</strong> 吗？
          </p>
        </div>
      ),
      okText: '确认删除',
      cancelText: '取消',
      okType: 'danger',
      onOk() {
        return deleteDictionaryItem(record.itemId)
          .then(() => {
            handleTableReload();
            message.success(`字典项"${record.label}"删除成功`);
          })
          .catch(() => {});
      },
    });
  };

  const handleUpdate = async (record: DataType) => {
    const itemId = record.itemId;
    try {
      const msg: any = await getDictionaryItem(itemId);
      updateFormRef.current?.show('修改字典项', {
        ...msg.data,
        typeId,
      });
    } catch (error) {}
  };

  const handleOk = () => {
    handleTableReload();
  };

  const columns: DictionaryItemColumnProps<
    DataType,
    Record<string, string | number>
  >[] = [
    {
      title: '字典项ID',
      dataIndex: 'itemId',
      key: 'itemId',
      width: 120,
      render: (itemId: string) => (
        <Paragraph ellipsis copyable style={{ width: '100px' }}>
          {itemId}
        </Paragraph>
      ),
    },
    {
      title: '字典标签',
      dataIndex: 'label',
      key: 'label',
      width: 120,
      render: (label: string) => (
        <Text style={{ fontSize: '13px' }}>{label}</Text>
      ),
    },
    {
      title: '字典值',
      dataIndex: 'value',
      key: 'value',
      width: 100,
      advancedSearch: { type: 'INPUT' },
      render: (value: string) => (
        <Tag color="purple" style={{ fontFamily: 'monospace' }}>
          {value}
        </Tag>
      ),
    },

    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
      render: (sort: number) => (
        <Tag color={sort === 0 ? 'default' : 'green'}>{sort}</Tag>
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
      width: 150,
      fixed: 'right',
      render: (record) => {
        return (
          <Space size="small">
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleUpdate(record)}
            >
              编辑
            </Button>
            <Button
              danger
              type="link"
              size="small"
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
        <Row align="middle" justify="space-between">
          <Col>
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={() => window.history.back()}
              style={{ padding: 0, marginBottom: 8 }}
            >
              返回字典类型列表
            </Button>
            <div>
              <Title level={4} style={{ margin: 0, marginBottom: 4 }}>
                <BookOutlined
                  style={{ marginRight: '8px', color: '#1890ff' }}
                />
                {dictionaryType?.name || '字典项管理'}
              </Title>
              <Text type="secondary">
                编码：{dictionaryType?.code} | 描述：
                {dictionaryType?.description || '暂无描述'}
              </Text>
            </div>
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增字典项
            </Button>
          </Col>
        </Row>
      </Card>

      <Card>
        {dictionaryType?.code && (
          <TablePro
            rowKey={'itemId'}
            ref={tableProRef}
            columns={columns}
            request={(params) =>
              listDictionaryItem(dictionaryType?.code, params)
            }
            loading={loading}
          />
        )}
      </Card>

      {/* 字典项新增修改弹出层 */}
      <UpdateForm
        ref={updateFormRef}
        onOk={handleOk}
        typeCode={dictionaryType?.code}
      />
    </PageContainer>
  );
};

export default DictionaryItemsPage;

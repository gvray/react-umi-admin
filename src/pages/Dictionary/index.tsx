import { DateTimeFormat, PageContainer, TablePro } from '@/components';
import StatusTag from '@/components/StatusTag';
import { TableProRef } from '@/components/TablePro';

import {
  BookOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Button, Modal, Space, Tag, Typography, message } from 'antd';
import { useRef } from 'react';
import { useNavigate } from 'umi';
import UpdateForm, { UpdateFormRef } from './UpdateForm';
import { getDictionaryColumns } from './columns';
import { useDictionary } from './model';

const { Text, Paragraph } = Typography;

interface DataType {
  typeId: string;
  code: string;
  name: string;
  description?: string;
  status: number;
  sort: number;
  remark?: string;
  items?: any[];
  createdAt: string;
  updatedAt: string;
}

const DictionaryPage = () => {
  const navigate = useNavigate();
  const updateFormRef = useRef<UpdateFormRef>(null);
  const tableProRef = useRef<TableProRef>(null);
  const {
    fetchDictionaryTypeList,
    fetchDictionaryTypeDetail,
    removeDictionaryType,
  } = useDictionary();

  const tableReload = () => {
    tableProRef.current?.reload();
  };

  const handleAdd = async () => {
    updateFormRef.current?.show('添加字典类型');
  };

  const handleDelete = async (record: DataType) => {
    Modal.confirm({
      title: `删除确认`,
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>
            确定要删除字典类型 <strong>&quot;{record.name}&quot;</strong> 吗？
          </p>
          <p style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '8px' }}>
            删除后将无法恢复，且会同时删除该类型下的所有字典项！
          </p>
        </div>
      ),
      okText: '确认删除',
      cancelText: '取消',
      okType: 'danger',
      onOk() {
        return removeDictionaryType(record.typeId)
          .then(() => {
            tableReload();
            message.success(`字典类型"${record.name}"删除成功`);
          })
          .catch(() => {});
      },
    });
  };

  const handleUpdate = async (record: DataType) => {
    const typeId = record.typeId;
    try {
      const msg: any = await fetchDictionaryTypeDetail(typeId);
      updateFormRef.current?.show('修改字典类型', {
        ...msg,
      });
    } catch (error) {}
  };

  const handleManageItems = (record: DataType) => {
    navigate(`/system/dictionary/items/${record.typeId}`);
  };

  const handleOk = () => {
    tableReload();
  };

  let columns = [
    {
      title: '字典编号',
      dataIndex: 'typeId',
      key: 'typeId',
      width: 100,
      render: (typeId: string) => (
        <Paragraph ellipsis copyable style={{ width: '80px' }}>
          {typeId}
        </Paragraph>
      ),
    },
    {
      title: '字典名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      advancedSearch: { type: 'INPUT' },
      render: (name: string, record: DataType) => (
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '4px',
            }}
          >
            <BookOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
            <Text strong>{name}</Text>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.description || '暂无描述'}
          </div>
        </div>
      ),
    },
    {
      title: '字典类型',
      dataIndex: 'code',
      key: 'code',
      width: 150,
      advancedSearch: { type: 'INPUT' },
      render: (code: string) => (
        <Tag color="blue" style={{ fontFamily: 'monospace' }}>
          {code}
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
      render: (status: string | number) => (
        <StatusTag
          value={status}
          options={[
            { label: '禁用', value: 0 },
            { label: '启用', value: 1 },
          ]}
        />
      ),
    },
    {
      title: '创建时间',
      key: 'createdAt',
      dataIndex: 'createdAt',
      width: 140,
      render: (time: string) => <DateTimeFormat value={time} />,
      advancedSearch: {
        type: 'DATE_RANGE',
      },
    },
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
              icon={<EditOutlined />}
              onClick={() => handleUpdate(record)}
            >
              编辑
            </Button>
            <Button
              type="link"
              size="small"
              icon={<SettingOutlined />}
              onClick={() => handleManageItems(record)}
            >
              管理字典项
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
  columns = getDictionaryColumns().map((column) => {
    if (column.dataIndex === 'typeId') {
      return {
        ...column,
        render: (typeId: string) => (
          <Paragraph ellipsis copyable style={{ width: '80px' }}>
            {typeId}
          </Paragraph>
        ),
      };
    }
    if (column.dataIndex === 'name') {
      return {
        ...column,
        render: (name: string, record: DataType) => (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '4px',
              }}
            >
              <BookOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
              <Text strong>{name}</Text>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.description || '暂无描述'}
            </div>
          </div>
        ),
      };
    }
    if (column.dataIndex === 'code') {
      return {
        ...column,
        render: (code: string) => (
          <Tag color="blue" style={{ fontFamily: 'monospace' }}>
            {code}
          </Tag>
        ),
      };
    }
    if (column.dataIndex === 'sort') {
      return {
        ...column,
        render: (sort: number) => (
          <Tag color={sort === 0 ? 'default' : 'green'}>{sort}</Tag>
        ),
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
  }) as any;
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
              icon={<EditOutlined />}
              onClick={() => handleUpdate(record)}
            >
              编辑
            </Button>
            <Button
              type="link"
              size="small"
              icon={<SettingOutlined />}
              onClick={() => handleManageItems(record)}
            >
              管理字典项
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

  return (
    <PageContainer>
      <TablePro
        rowKey={'typeId'}
        ref={tableProRef}
        columns={columns as any}
        request={fetchDictionaryTypeList}
        scroll={{ x: 1200 }}
        toolbarRender={() => {
          return (
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增字典类型
            </Button>
          );
        }}
      />
      {/* 字典类型新增修改弹出层 */}
      <UpdateForm ref={updateFormRef} onOk={handleOk} />
    </PageContainer>
  );
};

export default DictionaryPage;

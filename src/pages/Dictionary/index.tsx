import { PageContainer, TablePro } from '@/components';
import StatusTag from '@/components/StatusTag';
import { TableProRef } from '@/components/TablePro';
import { AdvancedSearchItem } from '@/components/TablePro/components/AdvancedSearchForm';
import {
  deleteDictionaryType,
  getDictionaryType,
  listDictionaryType,
} from '@/services/dictionary';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Modal, Space, Typography, message } from 'antd';
import { ColumnProps } from 'antd/es/table';
import dayjs from 'dayjs';
import { useRef } from 'react';
import { useNavigate } from 'umi';
import UpdateForm, { UpdateFormRef } from './UpdateForm';

const { Paragraph } = Typography;

interface DataType {
  typeId: string;
  code: string;
  name: string;
  description?: string;
  status: number;
  sort: number;
  remark?: string;
  createdAt: string;
  updatedAt: string;
}

interface DictionaryColumnProps<T, U> extends ColumnProps<T> {
  advancedSearch?: AdvancedSearchItem<U>;
}

const DictionaryPage = () => {
  const navigate = useNavigate();
  const updateFormRef = useRef<UpdateFormRef>(null);
  const tableProRef = useRef<TableProRef>(null);

  const handleTableReload = () => {
    tableProRef.current?.reload();
  };

  const handleAdd = async () => {
    updateFormRef.current?.show('添加字典类型');
  };

  const handleDelete = async (record: DataType) => {
    Modal.confirm({
      title: `系统提示`,
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除字典类型"${record.name}"？`,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        return deleteDictionaryType(record.typeId)
          .then(() => {
            handleTableReload();
            message.success(`删除成功`);
          })
          .catch(() => {});
      },
    });
  };

  const handleUpdate = async (record: DataType) => {
    const typeId = record.typeId;
    try {
      const msg = await getDictionaryType(typeId);
      updateFormRef.current?.show('修改字典类型', {
        ...msg.data,
      });
    } catch (error) {}
  };

  const handleManageItems = (record: DataType) => {
    navigate(`/system/dictionary/items/${record.typeId}`);
  };

  const handleOk = () => {
    handleTableReload();
  };

  const columns: DictionaryColumnProps<
    DataType,
    Record<string, string | number>
  >[] = [
    {
      title: '字典类型ID',
      dataIndex: 'typeId',
      key: 'typeId',
      render: (typeId: string) => {
        return (
          <Paragraph ellipsis copyable style={{ width: '100px' }}>
            {typeId}
          </Paragraph>
        );
      },
    },
    {
      title: '字典类型编码',
      dataIndex: 'code',
      key: 'code',
      advancedSearch: { type: 'INPUT' },
      render: (code: string) => {
        return (
          <Paragraph ellipsis copyable style={{ width: '120px' }}>
            {code}
          </Paragraph>
        );
      },
    },
    {
      title: '字典类型名称',
      dataIndex: 'name',
      key: 'name',
      advancedSearch: { type: 'INPUT' },
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
      width: 200,
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
              type="link"
              icon={<PlusOutlined />}
              onClick={() => handleManageItems(record)}
            >
              管理字典项
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

  return (
    <PageContainer>
      <TablePro
        rowKey={'typeId'}
        toolbarRender={() => (
          <>
            <Button type="primary" onClick={handleAdd}>
              新增字典类型
            </Button>
          </>
        )}
        ref={tableProRef}
        columns={columns}
        request={listDictionaryType}
      />
      {/* 字典类型新增修改弹出层 */}
      <UpdateForm ref={updateFormRef} onOk={handleOk} />
    </PageContainer>
  );
};

export default DictionaryPage;

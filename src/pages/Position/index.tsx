import { DateTimeFormat, PageContainer, TablePro } from '@/components';
import StatusTag from '@/components/StatusTag';
import { TableProRef } from '@/components/TablePro';
import { AdvancedSearchItem } from '@/components/TablePro/components/AdvancedSearchForm';
import { deletePosition, getPosition, listPosition } from '@/services/position';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Button, Modal, Space, Typography, message } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { useRef } from 'react';
import UpdateForm, { UpdateFormRef } from './UpdateForm';

const { Paragraph } = Typography;
interface DataType {
  createBy: string;
  createdAt: string;
  updateBy?: string;
  updatedAt?: string;
  remark: string;
  positionId: number;
  name: string;
  code: string;
  description: string;
  status: string;
}

interface UserColumnProps<T, U> extends ColumnProps<T> {
  advancedSearch?: AdvancedSearchItem<U>;
}

const UserPage = () => {
  const updateFormRef = useRef<UpdateFormRef>(null);

  const tableProRef = useRef<TableProRef>(null);

  const handleTableReload = () => {
    tableProRef.current?.reload();
  };

  const handleAdd = async () => {
    updateFormRef.current?.show('添加岗位');
  };

  const handleDelete = async (record: DataType) => {
    Modal.confirm({
      title: `系统提示`,
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除岗位编号为"${record.positionId}"的数据项？`,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        return deletePosition(record.positionId)
          .then(() => {
            handleTableReload();
            message.success(`删除成功`);
          })
          .catch(() => {});
      },
    });
  };

  const handleUpdate = async (record: DataType) => {
    const positionId = record.positionId;
    try {
      const msg = await getPosition(positionId);
      updateFormRef.current?.show('修改岗位', {
        ...msg.data,
      });
    } catch (error) {}
  };

  const handleOk = () => {
    handleTableReload();
  };

  const columns: UserColumnProps<DataType, Record<string, string | number>>[] =
    [
      {
        title: '岗位编号',
        dataIndex: 'positionId',
        key: 'positionId',
        render: (positionId: string) => {
          return (
            <Paragraph ellipsis copyable style={{ width: '100px' }}>
              {positionId}
            </Paragraph>
          );
        },
      },
      {
        title: '岗位编码',
        dataIndex: 'code',
        key: 'code',
        advancedSearch: { type: 'INPUT' },
      },
      {
        title: '岗位名称',
        dataIndex: 'name',
        key: 'name',
        advancedSearch: { type: 'INPUT' },
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        advancedSearch: {
          type: 'SELECT',
          value: [
            { label: '停用', value: 0 },
            { label: '正常', value: 1 },
            { label: '审核中', value: 2 },
            { label: '封禁', value: 3 },
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
        render: (time: string) => {
          return <DateTimeFormat value={time} />;
        },
        // advancedSearch: {
        //   type: 'DATE_RANGE',
        // },
      },
      {
        title: '操作',
        key: 'action',
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

  return (
    <PageContainer>
      <TablePro
        rowKey={'positionId'}
        toolbarRender={() => (
          <>
            <Button type="primary" onClick={handleAdd}>
              新增岗位
            </Button>
          </>
        )}
        ref={tableProRef}
        columns={columns}
        request={listPosition}
      />
      {/* 岗位新增修改弹出层 */}
      <UpdateForm ref={updateFormRef} onOk={handleOk} />
    </PageContainer>
  );
};
export default UserPage;

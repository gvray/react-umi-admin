import { DateTimeFormat, PageContainer, TablePro } from '@/components';
import StatusTag from '@/components/StatusTag';
import { TableProRef } from '@/components/TablePro';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Button, Modal, Space, Typography, message } from 'antd';
import { useRef } from 'react';
import UpdateForm, { UpdateFormRef } from './UpdateForm';
import { getPositionColumns } from './columns';
import { usePosition } from './model';

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

const PositionPage = () => {
  const updateFormRef = useRef<UpdateFormRef>(null);

  const tableProRef = useRef<TableProRef>(null);
  const { fetchPositionList, fetchPositionDetail, removePosition } =
    usePosition();

  const tableReload = () => {
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
        return removePosition(record.positionId)
          .then(() => {
            tableReload();
            message.success(`删除成功`);
          })
          .catch(() => {});
      },
    });
  };

  const handleUpdate = async (record: DataType) => {
    const positionId = record.positionId;
    try {
      const msg = await fetchPositionDetail(positionId);
      updateFormRef.current?.show('修改岗位', {
        ...msg,
      });
    } catch (error) {}
  };

  const handleOk = () => {
    tableReload();
  };

  let columns = getPositionColumns().map((column: any) => {
    if (column.dataIndex === 'positionId') {
      return {
        ...column,
        render: (positionId: string) => (
          <Paragraph ellipsis copyable style={{ width: '100px' }}>
            {positionId}
          </Paragraph>
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
      render: (record: any) => {
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
        request={fetchPositionList}
      />
      {/* 岗位新增修改弹出层 */}
      <UpdateForm ref={updateFormRef} onOk={handleOk} />
    </PageContainer>
  );
};
export default PositionPage;

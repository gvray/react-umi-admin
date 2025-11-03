import { DateTimeFormat, PageContainer, TablePro } from '@/components';
import { TableProRef } from '@/components/TablePro';
import {
  cleanOperationLogs,
  deleteOperationLog,
  deleteOperationLogs,
  getOperationLogs,
} from '@/services/operationLog';
import { Button, Modal, Tag, Tooltip, message } from 'antd';
import React from 'react';

const OperationLogPage: React.FC = () => {
  const tableProRef = React.useRef<TableProRef>(null);
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = React.useState<any[]>([]);

  const handleTableReload = () => {
    tableProRef.current?.reload();
  };
  const handleDelete = async (record: any) => {
    Modal.confirm({
      title: '删除确认',
      content: `确认删除该日志记录（ID: ${record.id}）吗？`,
      okText: '删除',
      okButtonProps: { danger: true },
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteOperationLog(record.id);
          message.success('删除成功');
          handleTableReload();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };
  const handleBatchDelete = () => {
    if (!selectedRows.length) {
      message.warning('请先选择要删除的记录');
      return;
    }
    Modal.confirm({
      title: '批量删除确认',
      width: 520,
      content: (
        <div>
          确认删除以下 {selectedRows.length} 条记录？
          <div style={{ maxHeight: 200, overflow: 'auto', marginTop: 8 }}>
            {selectedRows.map((r) => (
              <div key={r.id}>
                ID: {r.id}，用户：{r.username}，操作：{r.action}
              </div>
            ))}
          </div>
        </div>
      ),
      okText: '删除',
      okButtonProps: { danger: true },
      cancelText: '取消',
      onOk: async () => {
        try {
          const ids = selectedRows.map((r) => r.id);
          await deleteOperationLogs(ids);
          message.success('已删除');
          setSelectedRowKeys([]);
          setSelectedRows([]);
          handleTableReload();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleCleanAll = () => {
    Modal.confirm({
      title: '清空日志确认',
      content: '确认清空所有操作日志吗？该操作不可恢复。',
      okText: '清空',
      okButtonProps: { danger: true },
      cancelText: '取消',
      onOk: async () => {
        try {
          await cleanOperationLogs();
          message.success('已清空');
          handleTableReload();
        } catch (error) {
          message.error('清空失败');
        }
      },
    });
  };
  const handleView = (record: any) => {
    console.log('查看', record);
  };
  const columns = [
    {
      title: '用户',
      dataIndex: 'username',
      key: 'username',
      advancedSearch: { type: 'INPUT' },
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      advancedSearch: { type: 'INPUT' },
    },
    {
      title: '模块',
      dataIndex: 'module',
      key: 'module',
      advancedSearch: { type: 'INPUT' },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) =>
        status === 1 ? (
          <Tag color="green">成功</Tag>
        ) : (
          <Tag color="red">失败</Tag>
        ),
      advancedSearch: {
        type: 'SELECT',
        value: [
          { label: '成功', value: 1 },
          { label: '失败', value: 0 },
        ],
      },
    },
    {
      title: 'IP地址',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
      width: 100,
      ellipsis: true, // 表格单元格超出宽度自动省略
      render: (text: string) => (
        <Tooltip placement="topLeft" title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => {
        return <DateTimeFormat value={createdAt} />;
      },
      advancedSearch: {
        type: 'TIME_RANGE',
      },
    },
    {
      title: '操作',
      render: (text: string, record: any) => (
        <>
          <Button type="link" onClick={() => handleView(record)}>
            详情
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            删除
          </Button>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <TablePro
        toolbarRender={() => (
          <>
            <Button
              danger
              disabled={!selectedRows.length}
              onClick={handleBatchDelete}
            >
              删除
            </Button>
            <Button danger onClick={handleCleanAll}>
              清空
            </Button>
          </>
        )}
        ref={tableProRef}
        columns={columns}
        request={getOperationLogs}
        rowKey="id"
        rowSelection={{
          selectedRowKeys,
          onChange: (keys: React.Key[], rows: any[]) => {
            setSelectedRowKeys(keys);
            setSelectedRows(rows);
          },
        }}
      />
    </PageContainer>
  );
};

export default OperationLogPage;

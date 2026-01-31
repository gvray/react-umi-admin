import {
  AuthButton,
  DateTimeFormat,
  PageContainer,
  TablePro,
} from '@/components';
import { TableProRef } from '@/components/TablePro';
import { Button, Descriptions, Modal, Spin, Tag, Tooltip } from 'antd';
import React from 'react';
import { getOperationLogColumns } from './columns';
import { useOperationLog } from './model';

const OperationLogPage: React.FC = () => {
  const tableProRef = React.useRef<TableProRef>(null);
  const {
    getOperationLogData,
    deleteLog,
    batchDeleteLogs,
    cleanLogs,
    selectedRowKeys,
    onSelectionChange,
    detailOpen,
    detailLoading,
    detail,
    viewDetail,
    closeDetail,
  } = useOperationLog();

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
        return deleteLog(record.id).then(() => {
          handleTableReload();
        });
      },
    });
  };
  const handleBatchDelete = () => {
    if (!selectedRowKeys.length) {
      Modal.warning({
        title: '提示',
        content: '请先选择要删除的记录',
      });
      return;
    }
    const rows = tableProRef.current?.getSelectedRows() || [];
    Modal.confirm({
      title: '批量删除确认',
      width: 520,
      content: (
        <div>
          确认删除以下 {selectedRowKeys.length} 条记录？
          <div style={{ maxHeight: 200, overflow: 'auto', marginTop: 8 }}>
            {rows.map((r) => (
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
        const ids = selectedRowKeys.map((k) => Number(k));
        return batchDeleteLogs(ids).then(() => {
          handleTableReload();
        });
      },
    });
  };

  const handleClean = () => {
    Modal.confirm({
      title: '清空日志确认',
      content: '确认清空所有操作日志吗？该操作不可恢复。',
      okText: '清空',
      okButtonProps: { danger: true },
      cancelText: '取消',
      onOk: async () => {
        return cleanLogs().then(() => {
          handleTableReload();
        });
      },
    });
  };
  const handleView = async (record: any) => {
    await viewDetail(record.id);
  };
  let columns = getOperationLogColumns().map((column) => {
    if (column.dataIndex === 'status') {
      return {
        ...column,
        render: (status: number) =>
          status === 1 ? (
            <Tag color="green">成功</Tag>
          ) : (
            <Tag color="red">失败</Tag>
          ),
      };
    }
    if (column.dataIndex === 'path') {
      return {
        ...column,
        ellipsis: true,
        render: (text: string) => (
          <Tooltip placement="topLeft" title={text}>
            <span>{text}</span>
          </Tooltip>
        ),
      };
    }
    if (column.dataIndex === 'createdAt') {
      return {
        ...column,
        render: (createdAt: string) => {
          return <DateTimeFormat value={createdAt} />;
        },
      };
    }
    return column;
  });
  columns = [
    ...columns,
    {
      title: '操作',
      render: (_: string, record: any) => (
        <>
          <AuthButton
            type="link"
            onClick={() => handleView(record)}
            perms={['system:log:view']}
          >
            详情
          </AuthButton>
          <AuthButton
            type="link"
            danger
            onClick={() => handleDelete(record)}
            perms={['system:log:delete']}
          >
            删除
          </AuthButton>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <Modal
        open={detailOpen}
        title="日志详情"
        onCancel={() => {
          closeDetail();
        }}
        footer={null}
        width={640}
      >
        {detailLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Spin />
          </div>
        ) : detail ? (
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label="ID">{detail.id}</Descriptions.Item>
            <Descriptions.Item label="用户">
              {detail.username}
            </Descriptions.Item>
            <Descriptions.Item label="模块">{detail.module}</Descriptions.Item>
            <Descriptions.Item label="操作">{detail.action}</Descriptions.Item>
            <Descriptions.Item label="状态">
              {detail.status === 1 ? '成功' : '失败'}
            </Descriptions.Item>
            <Descriptions.Item label="路径">{detail.path}</Descriptions.Item>
            <Descriptions.Item label="方法">{detail.method}</Descriptions.Item>
            <Descriptions.Item label="IP地址">
              {detail.ipAddress}
            </Descriptions.Item>
            <Descriptions.Item label="地点">
              {detail.location}
            </Descriptions.Item>
            <Descriptions.Item label="UA">{detail.userAgent}</Descriptions.Item>
            <Descriptions.Item label="信息">{detail.message}</Descriptions.Item>
            <Descriptions.Item label="时间">
              <DateTimeFormat value={detail.createdAt} />
            </Descriptions.Item>
          </Descriptions>
        ) : null}
      </Modal>
      <TablePro
        toolbarRender={() => (
          <>
            <Button
              danger
              disabled={!selectedRowKeys.length}
              onClick={handleBatchDelete}
            >
              删除
            </Button>
            <Button danger onClick={handleClean}>
              清空
            </Button>
          </>
        )}
        ref={tableProRef}
        columns={columns}
        request={getOperationLogData}
        rowKey="id"
        onSelectionChange={onSelectionChange}
      />
    </PageContainer>
  );
};

export default OperationLogPage;

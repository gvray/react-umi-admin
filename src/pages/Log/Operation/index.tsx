import {
  AuthButton,
  DateTimeFormat,
  PageContainer,
  TablePro,
} from '@/components';
import { TableProRef } from '@/components/TablePro';
import { PERM } from '@/constants';
import { useFeedback } from '@/hooks';
import { callRef, logger } from '@/utils';
import { Modal, Tag, Tooltip } from 'antd';
import React from 'react';
import { getOperationLogColumns } from './columns';
import LogDetailModal from './components/LogDetailModal';
import styles from './index.less';
import { useOperationLog } from './model';

const OperationLogPage: React.FC = () => {
  const tableProRef = React.useRef<TableProRef>(null);
  const {
    fetchOperationLogList,
    fetchOperationLogDetail,
    batchRemoveOperationLogs,
    clearOperationLogs,
    selectedRowKeys,
    setSelectedRowKeys,
  } = useOperationLog();
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [detailLoading, setDetailLoading] = React.useState(false);
  const [detailError, setDetailError] = React.useState<string | null>(null);
  const [detail, setDetail] = React.useState<Record<string, unknown> | null>(
    null,
  );
  const viewingLogIdRef = React.useRef<number | string>('');
  const { message } = useFeedback();

  const tableReload = () => {
    callRef(tableProRef, (t) => t.reload());
  };

  const handleSelectionChange = (keys: React.Key[]) => {
    setSelectedRowKeys(keys);
  };

  const loadDetail = async (logId: number | string) => {
    setDetailLoading(true);
    setDetailError(null);
    try {
      const data = await fetchOperationLogDetail(Number(logId));
      setDetail(data);
    } catch (error) {
      logger.error(error);
      setDetailError(
        error instanceof Error ? error.message : '加载详情失败，请稍后重试',
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const handleViewDetail = (record: any) => {
    viewingLogIdRef.current = record.id;
    setDetailOpen(true);
    setDetail(null);
    loadDetail(record.id);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setDetail(null);
    setDetailError(null);
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
          <div className={styles.styledDiv}>
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
        try {
          const ids = selectedRowKeys.map((k) => String(k));
          await batchRemoveOperationLogs(ids);
          setSelectedRowKeys([]);
          message.success('选中的操作日志已删除');
          tableReload();
        } catch (error) {
          logger.error(error);
        }
      },
    });
  };

  const handleClear = () => {
    Modal.confirm({
      title: '清空日志确认',
      content: '确认清空所有操作日志吗？该操作不可恢复。',
      okText: '清空',
      okButtonProps: { danger: true },
      cancelText: '取消',
      onOk: async () => {
        try {
          await clearOperationLogs();
          message.success('操作日志已清空');
          tableReload();
        } catch (error) {
          logger.error(error);
        }
      },
    });
  };
  let columns = getOperationLogColumns().map((column) => {
    if ('dataIndex' in column && column.dataIndex === 'result') {
      return {
        ...column,
        render: (result: string) => (
          <Tag color={result === 'success' ? 'success' : 'error'}>
            {result === 'success' ? '成功' : '失败'}
          </Tag>
        ),
      };
    }
    if (
      'dataIndex' in column &&
      (column.dataIndex === 'resource' || column.dataIndex === 'path')
    ) {
      return {
        ...column,
        render: (text: string) => (
          <Tooltip placement="topLeft" title={text}>
            <span
              style={{
                display: 'inline-block',
                maxWidth: 180,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                verticalAlign: 'bottom',
              }}
            >
              {text}
            </span>
          </Tooltip>
        ),
      };
    }
    if ('dataIndex' in column && column.dataIndex === 'createdAt') {
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
            onClick={() => handleViewDetail(record)}
            perms={[PERM.LOG_OPERATION_VIEW]}
          >
            详情
          </AuthButton>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <LogDetailModal
        open={detailOpen}
        onClose={handleCloseDetail}
        loading={detailLoading}
        error={detailError}
        data={detail}
        onRetry={() => loadDetail(viewingLogIdRef.current)}
      />
      <TablePro
        toolbarRender={() => (
          <>
            <AuthButton
              danger
              disabled={!selectedRowKeys.length}
              onClick={handleBatchDelete}
              perms={[PERM.LOG_OPERATION_DELETE]}
            >
              删除
            </AuthButton>
            <AuthButton
              danger
              onClick={handleClear}
              perms={[PERM.LOG_OPERATION_CLEAR]}
            >
              清空
            </AuthButton>
          </>
        )}
        ref={tableProRef}
        columns={columns}
        request={fetchOperationLogList}
        rowKey="id"
        onSelectionChange={handleSelectionChange}
      />
    </PageContainer>
  );
};

export default OperationLogPage;

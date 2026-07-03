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
import {
  CheckCircleFilled,
  CloseCircleFilled,
  CopyOutlined,
} from '@ant-design/icons';
import { copyText } from '@gvray/domkit';
import { Button, Modal, Spin, Tag, Tooltip } from 'antd';
import React from 'react';
import { getOperationLogColumns } from './columns';
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
  const [detail, setDetail] = React.useState<Record<string, unknown> | null>(
    null,
  );
  const { message } = useFeedback();

  const tableReload = () => {
    callRef(tableProRef, (t) => t.reload());
  };

  const handleSelectionChange = (keys: React.Key[]) => {
    setSelectedRowKeys(keys);
  };

  const handleViewDetail = async (record: any) => {
    setDetailLoading(true);
    try {
      const data = await fetchOperationLogDetail(record.logId);
      setDetail(data);
      setDetailOpen(true);
    } catch (error) {
      logger.error(error);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setDetail(null);
  };

  const handleCopyLogId = (logId: string) => {
    copyText(logId).then(() => message.success('日志ID已复制'));
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
    if ('dataIndex' in column && column.dataIndex === 'path') {
      return {
        ...column,
        render: (text: string) => (
          <Tooltip placement="topLeft" title={text}>
            <span>{text}</span>
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
      <Modal
        open={detailOpen}
        title="日志详情"
        onCancel={handleCloseDetail}
        footer={null}
        width={680}
        className={styles.detailModal}
      >
        {detailLoading ? (
          <div className={styles.loadingWrapper}>
            <Spin />
          </div>
        ) : detail ? (
          <div className={styles.detailBody}>
            {/* ── 顶部状态栏 ── */}
            <div
              className={`${styles.statusBar} ${
                detail.result === 'success'
                  ? styles.statusSuccess
                  : styles.statusError
              }`}
            >
              <div className={styles.statusLeft}>
                {detail.result === 'success' ? (
                  <CheckCircleFilled className={styles.statusIcon} />
                ) : (
                  <CloseCircleFilled className={styles.statusIcon} />
                )}
                <span className={styles.statusText}>
                  {detail.result === 'success' ? '请求成功' : '请求失败'}
                </span>
              </div>
              <div className={styles.statusRight}>
                <DateTimeFormat value={detail.createdAt as string} />
                {detail.latencyMs ? (
                  <span className={styles.latencyBadge}>
                    {String(detail.latencyMs)} ms
                  </span>
                ) : null}
              </div>
            </div>

            {/* ── 日志ID ── */}
            <div className={styles.detailSection}>
              <div className={styles.sectionTitle}>日志ID</div>
              <div className={styles.logIdRow}>
                <code className={styles.logIdCode}>
                  {String(detail.logId ?? '')}
                </code>
                <Button
                  type="text"
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={() => handleCopyLogId(String(detail.logId ?? ''))}
                />
              </div>
            </div>

            {/* ── 请求信息 ── */}
            <div className={styles.detailSection}>
              <div className={styles.sectionTitle}>请求信息</div>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>方法</span>
                  <Tag
                    color={
                      {
                        GET: 'success',
                        POST: 'processing',
                        PUT: 'warning',
                        DELETE: 'error',
                      }[String(detail.method)] || 'default'
                    }
                  >
                    {String(detail.method ?? '-')}
                  </Tag>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>模块</span>
                  <span>{String(detail.module ?? '-')}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>操作</span>
                  <span>{String(detail.action ?? '-')}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>资源</span>
                  <Tooltip title={String(detail.resource ?? '')}>
                    <span className={styles.pathValue}>
                      {String(detail.resource ?? '-')}
                    </span>
                  </Tooltip>
                </div>
              </div>
              <div className={styles.infoItem} style={{ marginTop: 12 }}>
                <span className={styles.infoLabel}>路径</span>
                <Tooltip title={String(detail.path ?? '')}>
                  <span className={styles.pathValue}>
                    {String(detail.path ?? '')}
                  </span>
                </Tooltip>
              </div>
            </div>

            {/* ── 请求参数 ── */}
            <div className={styles.detailSection}>
              <div className={styles.sectionTitle}>请求参数</div>
              <div className={styles.paramRow}>
                <div className={styles.paramBlock}>
                  <div className={styles.paramLabel}>Query</div>
                  <pre className={styles.paramCode}>
                    {(() => {
                      const q = detail.query as Record<string, unknown>;
                      return q && Object.keys(q).length > 0
                        ? JSON.stringify(q, null, 2)
                        : '{}';
                    })()}
                  </pre>
                </div>
                <div className={styles.paramBlock}>
                  <div className={styles.paramLabel}>Body</div>
                  <pre className={styles.paramCode}>
                    {(() => {
                      const b = detail.body as Record<string, unknown>;
                      return b && Object.keys(b).length > 0
                        ? JSON.stringify(b, null, 2)
                        : '{}';
                    })()}
                  </pre>
                </div>
              </div>
            </div>

            {/* ── 客户端信息 ── */}
            <div className={styles.detailSection}>
              <div className={styles.sectionTitle}>客户端信息</div>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>用户</span>
                  <span>
                    {String(detail.username ?? detail.nickname ?? '-')}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>IP地址</span>
                  <span>{String(detail.ipAddress ?? '-')}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>地点</span>
                  <span>{String(detail.location ?? '-')}</span>
                </div>
              </div>
              <div className={styles.infoItem} style={{ marginTop: 12 }}>
                <span className={styles.infoLabel}>User-Agent</span>
                <Tooltip title={String(detail.userAgent ?? '')}>
                  <span className={styles.uaValue}>
                    {String(detail.userAgent ?? '')}
                  </span>
                </Tooltip>
              </div>
            </div>

            {/* ── 消息 ── */}
            {detail.message && (
              <div className={styles.detailSection}>
                <div className={styles.sectionTitle}>消息</div>
                <div className={styles.messageBox}>
                  {String(detail.message)}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </Modal>
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

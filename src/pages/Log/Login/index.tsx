import {
  AuthButton,
  DateTimeFormat,
  PageContainer,
  TablePro,
} from '@/components';
import { TableProRef } from '@/components/TablePro';
import { type LoginLogRecord } from '@/services/loginLog';
import {
  DeleteOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { message, Modal, Space, Tag, Typography } from 'antd';
import React, { useRef } from 'react';
import { getLoginLogColumns } from './columns';
import { useLoginLog } from './model';

const { Paragraph } = Typography;

const LoginLog: React.FC = () => {
  const tableProRef = useRef<TableProRef>(null);
  const {
    exportLog,
    deleteLogs,
    clearLogs,
    getLoginLogData,
    selectionChange,
    deleting,
    exporting,
    clearing,
    selectedRows,
  } = useLoginLog();

  const tableReload = () => {
    tableProRef.current?.reload();
  };

  // 获取表格列配置并添加渲染函数
  const columns = getLoginLogColumns().map((column) => {
    if (column.dataIndex === 'userId') {
      return {
        ...column,
        render: (userId: string) => {
          return (
            <Paragraph ellipsis copyable style={{ width: '100px' }}>
              {userId}
            </Paragraph>
          );
        },
      };
    }
    if (column.dataIndex === 'status') {
      return {
        ...column,
        render: (value: any, record: LoginLogRecord) => (
          <Tag color={record.status === 1 ? 'success' : 'error'}>
            {record.status === 1 ? '成功' : '失败'}
          </Tag>
        ),
      };
    }
    if (column.dataIndex === 'createdAt') {
      return {
        ...column,
        render: (time: string) => {
          return <DateTimeFormat value={time} />;
        },
      };
    }
    return column;
  });

  const handleExport = async () => {
    try {
      await exportLog();
      message.success('导出成功');
    } catch (error) {
      message.error('导出失败');
    }
  };

  const handleDelete = async () => {
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined />,
      content: '是否确认删除选中的登录日志？此操作不可恢复！',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        return deleteLogs()
          .then(() => {
            message.success('删除成功');
            tableReload();
          })
          .catch(() => {
            message.error('删除失败');
          });
      },
    });
  };

  const handleClear = async () => {
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined />,
      content: '是否确认清理所有登录日志？此操作不可恢复！',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        return clearLogs()
          .then(() => {
            message.success('清理成功');
            tableReload();
          })
          .catch(() => {
            message.error('清理失败');
          });
      },
    });
  };

  return (
    <PageContainer>
      <TablePro
        rowKey="id"
        toolbarRender={() => (
          <Space>
            <AuthButton
              danger
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              loading={deleting}
              disabled={selectedRows.length === 0}
              perms={['system:log:delete']}
            >
              删除
            </AuthButton>
            <AuthButton
              danger
              icon={<DeleteOutlined />}
              onClick={handleClear}
              loading={clearing}
              perms={['system:log:delete']}
            >
              清空
            </AuthButton>
            <AuthButton
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleExport}
              loading={exporting}
              perms={['system:log:export']}
            >
              导出日志
            </AuthButton>
          </Space>
        )}
        ref={tableProRef}
        columns={columns}
        request={getLoginLogData}
        onSelectionChange={
          selectionChange as (
            keys: React.Key[],
            rows?: LoginLogRecord[],
          ) => void
        }
      />
    </PageContainer>
  );
};

export default LoginLog;

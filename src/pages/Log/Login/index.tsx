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
import { Modal, Space, Tag, Typography } from 'antd';
import React, { useRef } from 'react';
import { getLoginLogColumns, useLoginLog } from './model';

const { Paragraph } = Typography;

const LoginLog: React.FC = () => {
  const tableProRef = useRef<TableProRef>(null);
  const { handleExport, handleClear, getLoginLogData, exporting, clearing } =
    useLoginLog();

  const handleTableReload = () => {
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

  const handleExportClick = async () => {
    try {
      await handleExport();
    } catch (error) {
      // 错误已在hook中处理
    }
  };

  const handleClearClick = async () => {
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined />,
      content: '是否确认清理所有登录日志？此操作不可恢复！',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        return handleClear()
          .then(() => {
            handleTableReload();
          })
          .catch(() => {
            // 错误已在hook中处理
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
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleExportClick}
              loading={exporting}
              perms={['system:log:export']}
            >
              导出日志
            </AuthButton>
            <AuthButton
              danger
              icon={<DeleteOutlined />}
              onClick={handleClearClick}
              loading={clearing}
              perms={['system:log:delete']}
            >
              清理日志
            </AuthButton>
          </Space>
        )}
        ref={tableProRef}
        columns={columns}
        request={getLoginLogData}
      />
    </PageContainer>
  );
};

export default LoginLog;

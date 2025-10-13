import { Table, Tag } from 'antd';
import React from 'react';

export interface OperationLogItem {
  time: string;
  user: string;
  action: string;
  status: string;
  ip: string;
}

interface OperationLogTableProps {
  logs: OperationLogItem[];
}

const OperationLogTable: React.FC<OperationLogTableProps> = ({ logs }) => {
  const columns = [
    { title: '时间', dataIndex: 'time' },
    { title: '用户', dataIndex: 'user' },
    { title: '操作', dataIndex: 'action' },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text: string) =>
        text === '成功' ? (
          <Tag color="green">成功</Tag>
        ) : (
          <Tag color="red">失败</Tag>
        ),
    },
    { title: 'IP地址', dataIndex: 'ip' },
  ];

  return (
    <Table
      size="small"
      columns={columns}
      dataSource={logs}
      rowKey={(r) => r.time + r.user}
      pagination={false}
    />
  );
};

export default OperationLogTable;

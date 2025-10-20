import { PageContainer, TablePro } from '@/components';
import { getOperationLogs } from '@/services/operationLog';
import { Tag } from 'antd';
import React from 'react';

const OperationLogPage: React.FC = () => {
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
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      advancedSearch: {
        type: 'TIME_RANGE',
      },
    },
  ];

  return (
    <PageContainer>
      <TablePro
        columns={columns}
        request={getOperationLogs}
        rowKey="id"
        scroll={{ x: 'max-content' }}
      />
    </PageContainer>
  );
};

export default OperationLogPage;

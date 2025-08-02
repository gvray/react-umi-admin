import { Tag } from 'antd';
import React from 'react';

const statusTag = {
  0: { color: 'error', text: '停用' },
  1: { color: 'success', text: '正常' },
  2: { color: 'warning', text: '审核中' },
  3: { color: 'error', text: '封禁' },
};

type StatusTagProps = {
  status: number;
};

const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
  const tag = statusTag[status as keyof typeof statusTag];
  return <Tag color={tag.color}>{tag.text}</Tag>;
};

export default StatusTag;

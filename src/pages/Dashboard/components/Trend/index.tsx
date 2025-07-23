import type { TableColumnsType, TableProps } from 'antd';
import { Table } from 'antd';
import React from 'react';
import { styled } from 'umi';

interface DataType {
  key: React.Key;
  rank: number;
  keyword: string;
  users: number;
  monthGrowth: number;
}

interface HotSearchItem {
  keyword: string;
  count: number;
  trend: 'up' | 'down';
  change: number;
}

interface TrendProps {
  data?: HotSearchItem[];
}

const columns: TableColumnsType<DataType> = [
  {
    title: '排名',
    dataIndex: 'rank',
  },
  {
    title: '搜索关键词',
    dataIndex: 'keyword',
    filters: [
      {
        text: '手机',
        value: '手机',
      },
      {
        text: '笔记本电脑',
        value: '笔记本电脑',
      },
      {
        text: '平板电脑',
        value: '平板电脑',
      },
      {
        text: '智能手表',
        value: '智能手表',
      },
      {
        text: '智能家居设备',
        value: '智能家居设备',
      },
    ],
    filterMode: 'tree',
    filterSearch: true,
    onFilter: (value, record) => record.keyword.includes(value as string),
    width: '30%',
  },
  {
    title: '用户数',
    dataIndex: 'users',
  },
  {
    title: '月涨幅',
    dataIndex: 'monthGrowth',
    sorter: (a, b) => a.monthGrowth - b.monthGrowth,
  },
];

const onChange: TableProps<DataType>['onChange'] = (
  pagination,
  filters,
  sorter,
  extra,
) => {
  console.log('params', pagination, filters, sorter, extra);
};

const TrendWrapper = styled.div`
  height: 300px;
`;

const Trend: React.FC<TrendProps> = ({ data = [] }) => {
  // 将传入的数据转换为表格需要的格式
  const tableData: DataType[] = data.map((item, index) => ({
    key: String(index + 1),
    rank: index + 1,
    keyword: item.keyword,
    users: item.count,
    monthGrowth: item.trend === 'up' ? item.change : -item.change,
  }));

  return (
    <TrendWrapper>
      <Table
        columns={columns}
        dataSource={tableData}
        onChange={onChange}
        pagination={false}
        scroll={{ y: 248 }}
      />
    </TrendWrapper>
  );
};

export default Trend;

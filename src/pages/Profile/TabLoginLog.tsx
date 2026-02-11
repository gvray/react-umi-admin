import { queryLoginLogList } from '@/services/loginLog';
import { SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  DatePicker,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useEffect, useState } from 'react';
import styles from './index.less';

const { Text } = Typography;
const { RangePicker } = DatePicker;

const TabLoginLog: React.FC = () => {
  const [data, setData] = useState<API.LoginLogResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<number | undefined>();
  const [keyword, setKeyword] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = {
        page,
        pageSize: 10,
      };
      if (statusFilter !== undefined) params.status = statusFilter;
      if (keyword) params.account = keyword;
      const res = await queryLoginLogList(params as API.LoginLogsFindAllParams);
      if (res?.data) {
        setData(res.data.items || []);
        setTotal(res.data.total || 0);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, keyword]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns: ColumnsType<API.LoginLogResponseDto> = [
    {
      title: '登录时间',
      dataIndex: 'createdAt',
      width: 180,
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: 'IP 地址',
      dataIndex: 'ipAddress',
      width: 140,
    },
    {
      title: '登录地点',
      dataIndex: 'location',
      width: 100,
      render: (text: string) => text || '-',
    },
    {
      title: '设备',
      dataIndex: 'device',
      width: 120,
      render: (text: string) => text || '-',
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
      width: 120,
      render: (text: string) => text || '-',
    },
    {
      title: '操作系统',
      dataIndex: 'os',
      width: 100,
      render: (text: string) => text || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (status: number) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '成功' : '失败'}
        </Tag>
      ),
    },
    {
      title: '失败原因',
      dataIndex: 'failReason',
      ellipsis: true,
      render: (text: string) =>
        text ? (
          <Text type="danger" style={{ fontSize: 12 }}>
            {text}
          </Text>
        ) : (
          '-'
        ),
    },
  ];

  return (
    <Card className={styles.moduleCard} size="small" title="登录记录">
      <div className={styles.logFilters}>
        <Input
          placeholder="搜索账号"
          prefix={<SearchOutlined />}
          style={{ width: 200 }}
          allowClear
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onPressEnter={() => {
            setPage(1);
            fetchData();
          }}
        />
        <Select
          placeholder="登录状态"
          style={{ width: 120 }}
          allowClear
          value={statusFilter}
          onChange={(v) => {
            setStatusFilter(v);
            setPage(1);
          }}
          options={[
            { value: 1, label: '成功' },
            { value: 0, label: '失败' },
          ]}
        />
        <RangePicker />
        <Space>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={() => {
              setPage(1);
              fetchData();
            }}
          >
            查询
          </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1000 }}
        pagination={{
          current: page,
          total,
          pageSize: 10,
          showTotal: (t) => `共 ${t} 条`,
          onChange: (p) => setPage(p),
        }}
      />
    </Card>
  );
};

export default TabLoginLog;

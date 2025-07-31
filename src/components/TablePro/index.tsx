import { logger } from '@/utils';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Flex,
  Pagination,
  Space,
  Table,
  TableProps,
  Tooltip,
} from 'antd';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import AdvancedSearchForm from './components/AdvancedSearchForm';

interface TableProProps<T> extends TableProps<T> {
  request: (params: any, options?: { [key: string]: any }) => Promise<any>;
  toolbarRender?: () => React.ReactNode;
}

export interface TableProRef {
  reload: () => void;
}

const TableProFunction: React.ForwardRefRenderFunction<
  TableProRef,
  TableProProps<any>
> = (props, ref) => {
  const { columns, request, toolbarRender = () => null, ...rest } = props;
  const [loading, setLogging] = useState(false);
  const [listData, setListData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const [etag, setEtag] = useState(Date.now());

  // 高级搜索
  const [showSearch, setShowSearch] = useState(true);
  // 高级搜索参数
  const paramsRef = useRef<Record<string, any>>({});

  const handleList = async (paginationParams?: Record<string, any>) => {
    try {
      setLogging(true);
      const { data } = await request({
        ...paramsRef.current,
        ...(paginationParams ?? pagination),
      });

      setListData([...data.items]);
      setTotal(data.total);
    } catch (error: any) {
      logger.error(error.info);
      setListData([]);
    } finally {
      setLogging(false);
    }
  };

  const handleReload = () => {
    setEtag(Date.now());
  };

  const handleResetPage = () => {
    setPagination((pre) => ({ ...pre, page: 1 }));
    setEtag(Date.now());
  };

  const reload = () => {
    handleReload();
  };

  // 高级搜索
  const handleAdvancedQuery = (values: Record<string, any>) => {
    const newParams = { ...paramsRef.current, ...values };
    paramsRef.current = newParams;
    handleResetPage();
  };

  useImperativeHandle(
    ref,
    () => ({
      reload,
    }),
    [],
  );

  useEffect(() => {
    handleList();
  }, [pagination.page, pagination.pageSize, etag]);

  const toolbar = toolbarRender();
  return (
    <div>
      {showSearch && !!columns && (
        <AdvancedSearchForm
          searchFields={columns.filter(
            (item: any) => item.advancedSearch !== undefined,
          )}
          onSearchFinish={handleAdvancedQuery}
          resetSearch={() => {
            // 重制高级搜索参数
            paramsRef.current = {};
            handleResetPage();
          }}
        ></AdvancedSearchForm>
      )}
      <Flex justify="space-between" align="center">
        <Space style={{ marginBottom: 16 }}>{toolbar}</Space>
        <Space>
          <Tooltip title={showSearch ? '隐藏搜索' : '显示搜索'}>
            <Button
              shape="circle"
              icon={<SearchOutlined />}
              onClick={() => setShowSearch(!showSearch)}
            />
          </Tooltip>
          <Tooltip title="刷新">
            <Button
              shape="circle"
              onClick={() => reload()}
              icon={<ReloadOutlined />}
            />
          </Tooltip>
        </Space>
      </Flex>
      <Table
        columns={columns}
        dataSource={listData}
        loading={loading}
        pagination={false}
        {...rest}
      />
      {total > 0 && total > pagination.pageSize && (
        <Pagination
          total={total}
          showSizeChanger
          showQuickJumper
          current={pagination.page}
          pageSize={pagination.pageSize}
          showTotal={(total) => `共 ${total} 条`}
          onChange={(page, pageSize) => {
            setPagination({ page, pageSize });
          }}
          style={{ textAlign: 'right', marginTop: '10px' }}
        />
      )}
    </div>
  );
};

const TablePro = forwardRef(TableProFunction);
TablePro.displayName = 'TablePro';
export default TablePro;

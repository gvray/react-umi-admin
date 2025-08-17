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
import { forwardRef, useCallback, useImperativeHandle } from 'react';
import AdvancedSearchForm from './components/AdvancedSearchForm';
import { useTablePro } from './useTablePro';

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

  const {
    loading,
    listData,
    total,
    pagination,
    handleReload,
    handleResetPage,
    handleAdvancedQuery,
    showSearch,
    paramsRef,
    setPagination,
    setShowSearch,
  } = useTablePro(request);

  const reload = useCallback(() => {
    handleReload();
  }, [handleReload]);

  useImperativeHandle(
    ref,
    () => ({
      reload,
    }),
    [],
  );

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
        scroll={{ x: 'max-content' }}
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

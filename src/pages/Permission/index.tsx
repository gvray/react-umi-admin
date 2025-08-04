import { PageContainer } from '@/components';
import AdvancedSearchForm from '@/components/TablePro/components/AdvancedSearchForm';
import { deletePermission, getPermission } from '@/services/permission';
import { ResourceMeta } from '@/services/resource';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Flex, Modal, Space, Table, Tooltip, message } from 'antd';
import { useRef, useState } from 'react';
import UpdateForm, { UpdateFormRef } from './UpdateForm';
import { useResourceModel } from './model';

export interface PermissionMeta {
  permissionId: string;
  name: string;
  action: string;
  resourceId: string;
  children?: PermissionMeta[]; // 用于前端展示 tree 结构
  // 可选字段
  code?: string; // 权限标识
  [key: string]: any; // 允许扩展
}
const ResourcePage = () => {
  const updateFormRef = useRef<UpdateFormRef>(null);
  const [showSearch, setShowSearch] = useState(true);
  const { data, loading, reload } = useResourceModel();
  // 高级搜索参数
  const paramsRef = useRef<Record<string, any>>({});
  const handleAdd = async () => {
    updateFormRef.current?.show('添加权限');
  };

  const handleDelete = async (record: ResourceMeta | PermissionMeta) => {
    Modal.confirm({
      title: `系统提示`,
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除权限编号为"${record.permissionId}"的数据项？`,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        return deletePermission(record.permissionId)
          .then(() => {
            reload();
            message.success(`删除成功`);
          })
          .catch(() => {});
      },
    });
  };

  const handleUpdate = async (record: PermissionMeta) => {
    const permissionId = record.permissionId;
    try {
      const msg = await getPermission(permissionId);
      updateFormRef.current?.show('修改权限', {
        ...msg.data,
      });
    } catch (error) {}
  };
  // 高级搜索
  const handleAdvancedQuery = (values: Record<string, any>) => {
    const newParams = { ...paramsRef.current, ...values };
    paramsRef.current = newParams;
    reload(newParams);
  };
  const handleOk = () => {
    reload();
  };
  const columns = [
    {
      title: '权限名称',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      advancedSearch: {
        type: 'INPUT',
      },
    },
    {
      title: '权限类型',
      dataIndex: 'action',
      key: 'action',
      render: (action: string, record: ResourceMeta) => {
        if (record.permissionId === undefined) {
          return '-';
        }
        switch (action) {
          case 'view':
            return '查看';
          case 'create':
            return '新增';
          case 'update':
            return '修改';
          case 'delete':
            return '删除';
          case 'export':
            return '导出';
          case 'import':
            return '导入';
          case 'approve':
            return '审批';
          case 'reject':
            return '驳回';
          default:
            return '未知';
        }
      },
    },
    {
      title: '权限点',
      dataIndex: 'code',
      key: 'code',
      render: (code: string, record: ResourceMeta) => {
        if (record.permissionId === undefined) {
          return '-';
        }
        return code;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (record: ResourceMeta) => {
        if (record.permissionId === undefined) {
          return '-';
        }
        return (
          <Space size={0}>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleUpdate(record)}
            >
              修改
            </Button>
            <Button
              danger
              type="link"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            >
              删除
            </Button>
          </Space>
        );
      },
    },
  ];
  return (
    <PageContainer>
      {showSearch && !!columns && (
        <AdvancedSearchForm
          searchFields={columns.filter(
            (item: any) => item.advancedSearch !== undefined,
          )}
          onSearchFinish={handleAdvancedQuery}
          resetSearch={() => {
            // 重制高级搜索参数
            paramsRef.current = {};
            reload();
          }}
        ></AdvancedSearchForm>
      )}
      <Flex justify="space-between" align="center">
        <Space style={{ marginBottom: 16 }}>
          {' '}
          <Button type="primary" onClick={handleAdd}>
            新增权限
          </Button>
        </Space>
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
        scroll={{ x: 'max-content' }}
        rowKey={(record) => record.permissionId || record.resourceId}
        loading={loading}
        columns={columns}
        expandable={{
          rowExpandable: (record) =>
            record.children && record.children.length > 0,
        }}
        dataSource={data}
        pagination={false}
      />
      {/* 权限新增修改弹出层 */}
      <UpdateForm ref={updateFormRef} onOk={handleOk} />
    </PageContainer>
  );
};

export default ResourcePage;

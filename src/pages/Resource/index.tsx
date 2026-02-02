import { AntIcon, DateTimeFormat, PageContainer, TablePro } from '@/components';
import StatusTag from '@/components/StatusTag';
import { TableProRef } from '@/components/TablePro';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Button, Modal, Space, Tag, message } from 'antd';
import { useRef } from 'react';
import UpdateForm, { UpdateFormRef } from './UpdateForm';
import { getResourceColumns } from './columns';
import { useResourceModel } from './model';

export interface ResourceMeta {
  resourceId: string;
  name: string;
  type: string;
  parentId: string | null;
  children?: ResourceMeta[]; // 用于前端展示 tree 结构
  // 可选字段
  path?: string; // 菜单路由
  method?: string; // API 方法 (如 GET, POST)
  code?: string; // 权限标识
  sort?: number; // 排序
  icon?: string; // 图标（常用于菜单）
  [key: string]: any; // 允许扩展
}
const ResourcePage = () => {
  const updateFormRef = useRef<UpdateFormRef>(null);
  const tableProRef = useRef<TableProRef>(null);
  const { getTreeList, getDetail, deleteItem } = useResourceModel();
  // 高级搜索参数
  const handleAdd = async () => {
    updateFormRef.current?.show('添加资源');
  };

  const handleDelete = async (record: ResourceMeta) => {
    Modal.confirm({
      title: `系统提示`,
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除资源编号为"${record.resourceId}"的数据项？`,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        return deleteItem(record.resourceId)
          .then(() => {
            tableProRef.current?.reload();
            message.success(`删除成功`);
          })
          .catch(() => {});
      },
    });
  };

  const handleUpdate = async (record: ResourceMeta) => {
    const resourceId = record.resourceId;
    try {
      const msg: any = await getDetail(resourceId);
      updateFormRef.current?.show('修改资源', {
        ...msg,
      });
    } catch (error) {}
  };
  // 高级搜索
  const handleOk = () => {
    tableProRef.current?.reload();
  };
  let columns = getResourceColumns().map((column: any) => {
    if (column.dataIndex === 'icon') {
      return {
        ...column,
        render: (icon: string) => (icon ? <AntIcon icon={icon} /> : '-'),
      };
    }
    if (column.dataIndex === 'type') {
      return {
        ...column,
        render: (resourceType: string) => {
          switch (resourceType) {
            case 'DIRECTORY':
              return '目录';
            case 'MENU':
              return '菜单';
            default:
              return '未知';
          }
        },
      };
    }
    if (column.dataIndex === 'code') {
      return {
        ...column,
        render: (code: string) => <Tag color="blue">{code}</Tag>,
      };
    }
    if (column.dataIndex === 'status') {
      return {
        ...column,
        render: (status: number) => <StatusTag status={status} />,
      };
    }
    if (column.dataIndex === 'createdAt') {
      return {
        ...column,
        render: (time: string) => <DateTimeFormat value={time} />,
      };
    }
    return column;
  });
  columns = [
    ...columns,
    {
      title: '操作',
      key: 'action',
      render: (record: ResourceMeta) => {
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
      <TablePro
        ref={tableProRef}
        rowKey={'resourceId'}
        columns={columns as any}
        request={getTreeList}
        expandable={{ defaultExpandAllRows: true }}
        toolbarRender={() => (
          <Button type="primary" onClick={handleAdd}>
            新增资源
          </Button>
        )}
      />
      {/* 资源新增修改弹出层 */}
      <UpdateForm ref={updateFormRef} onOk={handleOk} />
    </PageContainer>
  );
};

export default ResourcePage;

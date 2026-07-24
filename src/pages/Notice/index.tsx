import {
  AuthButton,
  DateTimeFormat,
  PageContainer,
  StatusTag,
  TablePro,
} from '@/components';
import { TableProRef } from '@/components/TablePro';
import { PERM } from '@/constants';
import { useFeedback } from '@/hooks';
import { callRef, logger } from '@/utils';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { Modal, Space, Tag } from 'antd';
import { useRef, useState } from 'react';
import { getNoticeColumns } from './columns';
import NoticeDetailModal from './components/NoticeDetailModal';
import { useNoticeModel } from './model';
import UpdateForm, { UpdateFormRef } from './UpdateForm';

const noticeTypeMap: Record<string, string> = {
  notice: '通知',
  announcement: '通告',
};

const NoticePage = () => {
  const updateFormRef = useRef<UpdateFormRef>(null);
  const tableProRef = useRef<TableProRef>(null);
  const {
    fetchNoticeList,
    fetchNoticeDetail,
    removeNotice,
    batchRemoveNotices,
    selectedRowKeys,
    setSelectedRowKeys,
  } = useNoticeModel();
  const { message } = useFeedback();

  const [detailVisible, setDetailVisible] = useState(false);
  const [currentNotice, setCurrentNotice] =
    useState<API.NoticeResponseDto | null>(null);

  const tableReload = () => {
    callRef(tableProRef, (t) => t.reload());
  };

  const handleAdd = () => {
    callRef(updateFormRef, (f) => f.show('添加通知公告'));
  };

  const handleDelete = (record: API.NoticeResponseDto) => {
    Modal.confirm({
      title: `系统提示`,
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除通知公告"${record.title}"？`,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        return removeNotice(record.noticeId)
          .then(() => {
            tableReload();
            message.success(`删除成功`);
          })
          .catch((error) => {
            logger.error(error);
          });
      },
    });
  };

  const handleUpdate = (record: API.NoticeResponseDto) => {
    callRef(updateFormRef, (f) => f.show('修改通知公告', record.noticeId));
  };

  const handleView = async (record: API.NoticeResponseDto) => {
    setDetailVisible(true);
    try {
      const data = await fetchNoticeDetail(record.noticeId);
      setCurrentNotice(data);
    } catch (error) {
      logger.error(error);
    }
  };

  const handleOk = () => {
    tableReload();
  };

  const handleSelectionChange = (keys: React.Key[]) => {
    setSelectedRowKeys(keys);
  };

  const handleBatchDelete = () => {
    if (!selectedRowKeys.length) {
      Modal.warning({
        title: '提示',
        content: '请先选择要删除的记录',
      });
      return;
    }
    Modal.confirm({
      title: '批量删除确认',
      content: `确认删除选中的 ${selectedRowKeys.length} 条记录？`,
      okText: '删除',
      okButtonProps: { danger: true },
      cancelText: '取消',
      onOk: async () => {
        try {
          const ids = selectedRowKeys.map((k) => String(k));
          await batchRemoveNotices(ids);
          setSelectedRowKeys([]);
          message.success('选中的通知公告已删除');
          tableReload();
        } catch (error) {
          logger.error(error);
        }
      },
    });
  };

  // 构建列定义
  let columns = getNoticeColumns().map((column: any) => {
    if (column.dataIndex === 'type') {
      return {
        ...column,
        advancedSearch: {
          type: 'SELECT',
          value: [
            { label: '通知', value: 'notice' },
            { label: '通告', value: 'announcement' },
          ],
        },
        render: (type: string) => <Tag>{noticeTypeMap[type] || type}</Tag>,
      };
    }
    if (column.dataIndex === 'status') {
      return {
        ...column,
        advancedSearch: {
          type: 'SELECT',
          value: [
            { label: '启用', value: 'enabled' },
            { label: '禁用', value: 'disabled' },
          ],
        },
        render: (status: string) => (
          <StatusTag
            value={status}
            options={[
              { label: '启用', value: 'enabled' },
              { label: '禁用', value: 'disabled' },
            ]}
          />
        ),
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

  const actionColumn: any = {
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right',
    render: (record: API.NoticeResponseDto) => (
      <Space size={0}>
        <AuthButton
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleView(record)}
          perms={[PERM.NOTICE_VIEW]}
        >
          查看
        </AuthButton>
        <AuthButton
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleUpdate(record)}
          perms={[PERM.NOTICE_UPDATE]}
        >
          修改
        </AuthButton>
        <AuthButton
          danger
          type="link"
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record)}
          perms={[PERM.NOTICE_DELETE]}
        >
          删除
        </AuthButton>
      </Space>
    ),
  };

  columns.push(actionColumn);

  return (
    <PageContainer>
      <TablePro
        rowKey="noticeId"
        ref={tableProRef}
        columns={columns}
        request={fetchNoticeList}
        onSelectionChange={handleSelectionChange}
        toolbarRender={() => (
          <>
            <AuthButton
              type="primary"
              onClick={handleAdd}
              perms={[PERM.NOTICE_CREATE]}
            >
              新增通知公告
            </AuthButton>
            <AuthButton
              danger
              disabled={!selectedRowKeys.length}
              onClick={handleBatchDelete}
              perms={[PERM.NOTICE_DELETE]}
            >
              批量删除
            </AuthButton>
          </>
        )}
      />
      <UpdateForm ref={updateFormRef} onOk={handleOk} />
      <NoticeDetailModal
        notice={currentNotice}
        visible={detailVisible}
        onClose={() => {
          setDetailVisible(false);
          setCurrentNotice(null);
        }}
      />
    </PageContainer>
  );
};

export default NoticePage;

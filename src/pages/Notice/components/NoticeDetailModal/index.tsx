import { DateTimeFormat, Icon, StatusTag } from '@/components';
import { Button, Descriptions, Modal, Tag, Typography } from 'antd';
import React from 'react';
import { styled } from 'umi';

const { Text } = Typography;

const ContentBox = styled.div`
  padding: 12px;
  background-color: var(--gvray-bg-elevated);
  border-radius: 6px;
  border: 1px solid var(--gvray-border-color);
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 320px;
  overflow: auto;
  line-height: 1.6;
`;

const noticeTypeMap: Record<string, string> = {
  notice: '通知',
  announcement: '通告',
};

const statusOptions = [
  { label: '启用', value: 'enabled' },
  { label: '禁用', value: 'disabled' },
];

interface NoticeDetailModalProps {
  notice: API.NoticeResponseDto | null;
  visible: boolean;
  onClose: () => void;
}

const NoticeDetailModal: React.FC<NoticeDetailModalProps> = ({
  notice,
  visible,
  onClose,
}) => {
  return (
    <Modal
      title={
        <>
          <Icon name="EyeOutlined" style={{ marginRight: 8 }} />
          通知公告详情
        </>
      }
      open={visible}
      onCancel={onClose}
      footer={<Button onClick={onClose}>关闭</Button>}
      width={640}
      destroyOnHidden
    >
      {notice && (
        <>
          <Descriptions
            column={2}
            bordered
            size="small"
            style={{ marginTop: 16 }}
          >
            <Descriptions.Item label="标题" span={2}>
              <Text strong>{notice.title}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="类型">
              <Tag>{noticeTypeMap[notice.type] || notice.type}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <StatusTag value={notice.status} options={statusOptions} />
            </Descriptions.Item>
            <Descriptions.Item label="排序权重">
              {notice.sort}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              <DateTimeFormat value={notice.createdAt} />
            </Descriptions.Item>
            <Descriptions.Item label="更新时间">
              <DateTimeFormat value={notice.updatedAt} />
            </Descriptions.Item>
          </Descriptions>

          <div style={{ marginTop: 16 }}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>
              内容
            </Text>
            <ContentBox>{notice.content}</ContentBox>
          </div>
        </>
      )}
    </Modal>
  );
};

export default NoticeDetailModal;

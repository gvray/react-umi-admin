import { Icon } from '@/components';
import { queryProfile } from '@/services/profile';
import { useAuthStore } from '@/stores';
import {
  Alert,
  Card,
  Descriptions,
  Grid,
  Space,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.less';
import { getAccountStatusMeta } from './model';

const { Text } = Typography;

interface TabProfileProps {
  profile?: API.CurrentUserResponseDto;
}

const { useBreakpoint } = Grid;

const TabProfile: React.FC<TabProfileProps> = ({ profile }) => {
  const me = useAuthStore((s) => s.profile);
  const currentMe = profile ?? me;
  const [userProfile, setUserProfile] = useState<API.ProfileResponseDto>();
  const screens = useBreakpoint();
  const descColumn = screens.md ? 2 : 1;

  useEffect(() => {
    queryProfile()
      .then((res) => {
        if (res.data) setUserProfile(res.data);
      })
      .catch(() => {
        // silent
      });
  }, []);

  const statusMeta = getAccountStatusMeta(currentMe?.profile?.status);
  const email = (userProfile?.email as unknown as string) || '';
  const phone = (userProfile?.phone as unknown as string) || '';
  const emailBound = !!email;
  const phoneBound = !!phone;
  const maskedPhone = phone
    ? phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    : '';

  return (
    <>
      <Alert
        type="info"
        showIcon
        className={styles.profileNotice}
        message="账号基础资料由系统维护，若需变更请联系管理员。"
      />

      <Card
        className={styles.moduleCard}
        title={
          <>
            <Icon name="IdcardOutlined" /> 基本信息
          </>
        }
      >
        <Descriptions
          column={descColumn}
          colon={false}
          styles={{
            label: {
              color: 'var(--gvray-color-text-secondary)',
              width: 100,
            },
          }}
        >
          <Descriptions.Item label="用户名">
            <span className={styles.readonlyField}>
              {currentMe?.username || '-'} <Icon name="LockOutlined" />
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="昵称">
            {userProfile?.nickname || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="用户 ID" span={descColumn}>
            <Text copyable type="secondary">
              {currentMe?.userId || '-'}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="邮箱">
            <Space size={6}>
              <span>{email || '未绑定'}</span>
              <Tooltip title={emailBound ? '已绑定' : '未绑定'}>
                {emailBound ? (
                  <Icon
                    name="CheckCircleFilled"
                    className={styles.verifiedIcon}
                  />
                ) : (
                  <Icon
                    name="ExclamationCircleFilled"
                    className={styles.unverifiedIcon}
                  />
                )}
              </Tooltip>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="手机号">
            <Space size={6}>
              <span>{maskedPhone || '未绑定'}</span>
              <Tooltip title={phoneBound ? '已绑定' : '未绑定'}>
                {phoneBound ? (
                  <Icon
                    name="CheckCircleFilled"
                    className={styles.verifiedIcon}
                  />
                ) : (
                  <Icon
                    name="ExclamationCircleFilled"
                    className={styles.unverifiedIcon}
                  />
                )}
              </Tooltip>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="部门">
            <span className={styles.readonlyField}>
              {currentMe?.department?.name || '未设置'}{' '}
              <Icon name="LockOutlined" />
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="岗位">
            <span className={styles.readonlyField}>
              {currentMe?.positions?.[0]?.name || '未设置'}{' '}
              <Icon name="LockOutlined" />
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="角色" span={descColumn}>
            <Space size={4} wrap>
              {currentMe?.roles?.map((role: any) => (
                <Tooltip
                  key={role.roleId}
                  title={String(role.description || role.name)}
                  styles={{ body: { maxWidth: 280 } }}
                >
                  <Tag color="processing">{role.name}</Tag>
                </Tooltip>
              ))}
              {!currentMe?.roles?.length && (
                <Text type="secondary">暂无角色</Text>
              )}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="账号状态" span={descColumn}>
            <Tag color={statusMeta.color}>{statusMeta.label}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="注册时间">
            <span className={styles.readonlyField}>
              - <Icon name="LockOutlined" />
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            <span className={styles.readonlyField}>
              {userProfile?.updatedAt
                ? new Date(userProfile.updatedAt).toLocaleString()
                : '-'}{' '}
              <Icon name="LockOutlined" />
            </span>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </>
  );
};

export default TabProfile;

import { PageContainer, StatusTag } from '@/components';
import {
  ArrowLeftOutlined,
  CheckOutlined,
  SaveOutlined,
  TeamOutlined,
  UndoOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Card, Space, Spin, Tag, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { styled, useNavigate, useParams } from 'umi';
import { useAuthRole } from './model';

const { Text } = Typography;

// 页面容器 - 左右分栏布局
const PageWrapper = styled.div`
  display: flex;
  gap: 16px;
  height: calc(100vh - 120px);
  min-height: 500px;
`;

// 返回按钮栏
const BackBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #1890ff;
    color: #1890ff;
  }

  .back-icon {
    font-size: 14px;
  }

  .back-text {
    font-size: 14px;
    font-weight: 500;
  }
`;

// 左侧用户信息栏
const Sidebar = styled.div`
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

// 用户卡片
const UserCard = styled(Card)`
  .ant-card-body {
    padding: 20px;
  }
`;

const UserHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: linear-gradient(135deg, #1890ff 0%, #722ed1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  font-weight: 600;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    object-fit: cover;
  }
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;

  .name {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .username {
    font-size: 13px;
    color: #666;
  }
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: 13px;

  .label {
    color: #666;
  }

  .value {
    color: #1a1a1a;
    font-weight: 500;
  }
`;

// 统计卡片
const StatsBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const StatItem = styled.div<{ $highlight?: boolean }>`
  background: ${(props) => (props.$highlight ? '#e6f7ff' : '#fafafa')};
  border: 1px solid ${(props) => (props.$highlight ? '#91d5ff' : '#f0f0f0')};
  border-radius: 8px;
  padding: 12px;
  text-align: center;

  .number {
    font-size: 24px;
    font-weight: 600;
    color: ${(props) => (props.$highlight ? '#1890ff' : '#1a1a1a')};
    line-height: 1;
    margin-bottom: 4px;
  }

  .label {
    font-size: 12px;
    color: #666;
  }
`;

// 右侧主内容区
const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

// 顶部操作栏
const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
`;

const ActionLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .title-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: linear-gradient(135deg, #1890ff 0%, #722ed1 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 16px;
  }

  .title-content {
    .title {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1a;
      line-height: 1.2;
    }

    .subtitle {
      font-size: 12px;
      color: #999;
      margin-top: 2px;
    }
  }
`;

// 角色网格
const RoleGrid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  overflow-y: auto;
  align-content: start;
`;

// 角色卡片
const RoleItem = styled.div<{ $selected: boolean }>`
  position: relative;
  padding: 16px;
  border-radius: 8px;
  border: 2px solid ${(props) => (props.$selected ? '#1890ff' : '#e8e8e8')};
  background: ${(props) => (props.$selected ? '#e6f7ff' : '#fff')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => (props.$selected ? '#1890ff' : '#bae7ff')};
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
  }

  .check-icon {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${(props) => (props.$selected ? '#1890ff' : '#e8e8e8')};
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
  }

  .role-name {
    font-size: 15px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 6px;
    padding-right: 24px;
  }

  .role-key {
    font-size: 12px;
    color: #1890ff;
    background: #f0f5ff;
    padding: 2px 8px;
    border-radius: 4px;
    display: inline-block;
    margin-bottom: 8px;
    font-family: 'SF Mono', Monaco, monospace;
  }

  .role-desc {
    font-size: 12px;
    color: #666;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #999;
  padding: 60px 20px;
  grid-column: 1 / -1;

  .icon {
    font-size: 48px;
    color: #d9d9d9;
    margin-bottom: 16px;
  }
`;

export default function AuthRolePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const { roles, selectedUser, initializeData, submitUserRoles } =
    useAuthRole(userId);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      initializeData(userId).finally(() => setLoading(false));
    }
  }, [initializeData, userId]);

  // 当用户数据加载完成后，设置初始选中的角色
  useEffect(() => {
    if (selectedUser?.roles) {
      setSelectedRoleIds(selectedUser.roles.map((role: any) => role.roleId));
    }
  }, [selectedUser]);

  // 返回用户列表页面
  const handleBackToUsers = () => {
    navigate('/system/user');
  };

  // 提交角色分配
  const handleSubmit = async () => {
    if (!selectedUser) return;

    setSubmitting(true);
    try {
      const success = await submitUserRoles({
        roleIds: selectedRoleIds,
      });
      if (success) {
        message.success('角色分配成功');
        await initializeData(userId);
      }
    } catch (error) {
      // error handled by request interceptor
    } finally {
      setSubmitting(false);
    }
  };

  // 重置选择
  const handleReset = () => {
    if (selectedUser?.roles) {
      setSelectedRoleIds(selectedUser.roles.map((role: any) => role.roleId));
    }
  };

  // 全选
  const handleSelectAll = () => {
    const allRoleIds = roles.map((role: any) => role.roleId);
    setSelectedRoleIds(allRoleIds);
  };

  // 清空选择
  const handleClearAll = () => {
    setSelectedRoleIds([]);
  };

  // 切换角色选中状态
  const toggleRole = (roleId: string) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId],
    );
  };

  // 判断是否有变更
  const hasChanges = () => {
    const originalIds = selectedUser?.roles?.map((r: any) => r.roleId) || [];
    if (originalIds.length !== selectedRoleIds.length) return true;
    return !originalIds.every((id: string) => selectedRoleIds.includes(id));
  };

  if (!userId) {
    return (
      <PageContainer>
        <EmptyState>
          <UserOutlined className="icon" />
          <div>请提供用户ID来分配角色</div>
        </EmptyState>
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 'calc(100vh - 120px)',
          }}
        >
          <Spin size="large" />
        </div>
      </PageContainer>
    );
  }

  if (!selectedUser) {
    return (
      <PageContainer>
        <EmptyState>
          <UserOutlined className="icon" />
          <div>未找到用户信息</div>
        </EmptyState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageWrapper>
        {/* 左侧边栏 - 用户信息 */}
        <Sidebar>
          {/* 返回按钮 */}
          <BackBar onClick={handleBackToUsers}>
            <ArrowLeftOutlined className="back-icon" />
            <span className="back-text">返回用户列表</span>
          </BackBar>

          <UserCard>
            <UserHeader>
              <Avatar>
                {selectedUser.avatar ? (
                  <img src={selectedUser.avatar} alt="avatar" />
                ) : (
                  selectedUser.nickname?.charAt(0).toUpperCase() ||
                  selectedUser.username?.charAt(0).toUpperCase()
                )}
              </Avatar>
              <UserInfo>
                <div className="name">
                  {selectedUser.nickname || selectedUser.username}
                </div>
                <div className="username">@{selectedUser.username}</div>
              </UserInfo>
            </UserHeader>

            <div style={{ borderTop: '1px solid #f0f0f0', margin: '16px 0' }} />

            <InfoItem>
              <span className="label">邮箱</span>
              <span className="value">{selectedUser.email || '-'}</span>
            </InfoItem>
            <InfoItem>
              <span className="label">状态</span>
              <StatusTag
                value={selectedUser.status}
                options={[
                  { label: '禁用', value: 0 },
                  { label: '启用', value: 1 },
                ]}
              />
            </InfoItem>
          </UserCard>

          <Card size="small" title="分配统计">
            <StatsBox>
              <StatItem $highlight>
                <div className="number">{selectedRoleIds.length}</div>
                <div className="label">已选择</div>
              </StatItem>
              <StatItem>
                <div className="number">{roles.length}</div>
                <div className="label">总角色</div>
              </StatItem>
            </StatsBox>
          </Card>

          <Card size="small" title="当前已分配">
            {selectedUser.roles && selectedUser.roles.length > 0 ? (
              <Space wrap size={[4, 8]}>
                {selectedUser.roles.map((role: any) => (
                  <Tag key={role.roleId} color="blue">
                    {role.name}
                  </Tag>
                ))}
              </Space>
            ) : (
              <Text type="secondary">暂无角色</Text>
            )}
          </Card>
        </Sidebar>

        {/* 右侧主内容区 */}
        <MainContent>
          {/* 顶部操作栏 */}
          <ActionBar>
            <ActionLeft>
              <div className="title-icon">
                <TeamOutlined />
              </div>
              <div className="title-content">
                <div className="title">选择角色</div>
                <div className="subtitle">
                  已选 {selectedRoleIds.length} / {roles.length} 个
                </div>
              </div>
            </ActionLeft>
            <Space>
              <Button onClick={handleSelectAll}>全选</Button>
              <Button onClick={handleClearAll}>清空</Button>
              <Button icon={<UndoOutlined />} onClick={handleReset}>
                重置
              </Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSubmit}
                loading={submitting}
                disabled={!hasChanges()}
              >
                保存分配
              </Button>
            </Space>
          </ActionBar>

          {/* 角色卡片网格 */}
          <RoleGrid>
            {roles.length > 0 ? (
              roles.map((role: any) => {
                const isSelected = selectedRoleIds.includes(role.roleId);
                return (
                  <RoleItem
                    key={role.roleId}
                    $selected={isSelected}
                    onClick={() => toggleRole(role.roleId)}
                  >
                    <div className="check-icon">
                      {isSelected && <CheckOutlined />}
                    </div>
                    <div className="role-name">{role.name}</div>
                    <div className="role-key">{role.roleKey}</div>
                    {role.remark && (
                      <div className="role-desc">{role.remark}</div>
                    )}
                  </RoleItem>
                );
              })
            ) : (
              <EmptyState>
                <TeamOutlined className="icon" />
                <div>暂无可分配的角色</div>
              </EmptyState>
            )}
          </RoleGrid>
        </MainContent>
      </PageWrapper>
    </PageContainer>
  );
}

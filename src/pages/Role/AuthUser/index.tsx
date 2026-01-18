import { PageContainer, StatusTag } from '@/components';
import {
  ArrowLeftOutlined,
  CheckOutlined,
  SaveOutlined,
  SearchOutlined,
  TeamOutlined,
  UndoOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Card, Input, Space, Spin, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { styled, useNavigate, useParams } from 'umi';
import { useAuthUser } from './model';

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

// 左侧角色信息栏
const Sidebar = styled.div`
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

// 角色卡片
const RoleCard = styled(Card)`
  .ant-card-body {
    padding: 20px;
  }
`;

const RoleHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const RoleAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: linear-gradient(135deg, #52c41a 0%, #1890ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  font-weight: 600;
  flex-shrink: 0;
`;

const RoleInfo = styled.div`
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

  .role-key {
    font-size: 12px;
    color: #1890ff;
    background: #f0f5ff;
    padding: 2px 8px;
    border-radius: 4px;
    display: inline-block;
    font-family: 'SF Mono', Monaco, monospace;
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
  background: ${(props) => (props.$highlight ? '#f6ffed' : '#fafafa')};
  border: 1px solid ${(props) => (props.$highlight ? '#b7eb8f' : '#f0f0f0')};
  border-radius: 8px;
  padding: 12px;
  text-align: center;

  .number {
    font-size: 24px;
    font-weight: 600;
    color: ${(props) => (props.$highlight ? '#52c41a' : '#1a1a1a')};
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
    background: linear-gradient(135deg, #52c41a 0%, #1890ff 100%);
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

// 用户网格
const UserGrid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  overflow-y: auto;
  align-content: start;
`;

// 用户卡片
const UserItem = styled.div<{ $selected: boolean }>`
  position: relative;
  padding: 16px;
  border-radius: 8px;
  border: 2px solid ${(props) => (props.$selected ? '#52c41a' : '#e8e8e8')};
  background: ${(props) => (props.$selected ? '#f6ffed' : '#fff')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => (props.$selected ? '#52c41a' : '#b7eb8f')};
    box-shadow: 0 2px 8px rgba(82, 196, 26, 0.15);
  }

  .check-icon {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${(props) => (props.$selected ? '#52c41a' : '#e8e8e8')};
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
  }

  .user-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1890ff 0%, #722ed1 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 16px;
    font-weight: 600;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
  }

  .user-info {
    flex: 1;
    min-width: 0;
    padding-right: 20px;

    .username {
      font-size: 14px;
      font-weight: 600;
      color: #1a1a1a;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .nickname {
      font-size: 12px;
      color: #666;
    }
  }

  .user-email {
    font-size: 12px;
    color: #999;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const SearchBox = styled.div`
  margin-bottom: 12px;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 12px;

  .search-result {
    font-size: 12px;
    color: #999;
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

export default function AuthUserPage() {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const {
    users,
    selectedRole,
    loading,
    submitting,
    initializeData,
    submitUserAssignment,
  } = useAuthUser(roleId);

  useEffect(() => {
    if (roleId) {
      initializeData(roleId);
    }
  }, [initializeData, roleId]);

  // 当角色数据加载完成后，设置初始选中的用户
  useEffect(() => {
    if (selectedRole?.users) {
      setSelectedUserIds(selectedRole.users.map((user: any) => user.userId));
    }
  }, [selectedRole]);

  // 过滤用户数据
  const filteredUsers = users.filter((user: any) => {
    if (!searchText) return true;
    return (
      user.nickname?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  // 返回角色列表页面
  const handleBackToRoles = () => {
    navigate('/system/role');
  };

  // 提交用户分配
  const handleSubmit = async () => {
    if (!selectedRole) return;

    const success = await submitUserAssignment({
      roleId: selectedRole.roleId,
      userIds: selectedUserIds,
    });

    if (success) {
      await initializeData(roleId);
    }
  };

  // 重置选择
  const handleReset = () => {
    if (selectedRole?.users) {
      setSelectedUserIds(selectedRole.users.map((user: any) => user.userId));
    }
  };

  // 全选
  const handleSelectAll = () => {
    const filteredIds = filteredUsers.map((user: any) => user.userId);
    setSelectedUserIds(filteredIds);
  };

  // 清空选择
  const handleClearAll = () => {
    setSelectedUserIds([]);
  };

  // 切换用户选中状态
  const toggleUser = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  // 判断是否有变更
  const hasChanges = () => {
    const originalIds = selectedRole?.users?.map((u: any) => u.userId) || [];
    if (originalIds.length !== selectedUserIds.length) return true;
    return !originalIds.every((id: string) => selectedUserIds.includes(id));
  };

  if (!roleId) {
    return (
      <PageContainer>
        <EmptyState>
          <TeamOutlined className="icon" />
          <div>请提供角色ID来分配用户</div>
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

  if (!selectedRole) {
    return (
      <PageContainer>
        <EmptyState>
          <TeamOutlined className="icon" />
          <div>未找到角色信息</div>
        </EmptyState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageWrapper>
        {/* 左侧边栏 - 角色信息 */}
        <Sidebar>
          {/* 返回按钮 */}
          <BackBar onClick={handleBackToRoles}>
            <ArrowLeftOutlined className="back-icon" />
            <span className="back-text">返回角色列表</span>
          </BackBar>

          <RoleCard>
            <RoleHeader>
              <RoleAvatar>
                {selectedRole.roleName?.charAt(0)?.toUpperCase() || 'R'}
              </RoleAvatar>
              <RoleInfo>
                <div className="name">{selectedRole.roleName}</div>
                <span className="role-key">{selectedRole.roleKey}</span>
              </RoleInfo>
            </RoleHeader>

            <div style={{ borderTop: '1px solid #f0f0f0', margin: '16px 0' }} />

            <InfoItem>
              <span className="label">状态</span>
              <StatusTag status={selectedRole.status} />
            </InfoItem>
            {selectedRole.remark && (
              <InfoItem>
                <span className="label">描述</span>
                <span
                  className="value"
                  style={{
                    maxWidth: 150,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {selectedRole.remark}
                </span>
              </InfoItem>
            )}
          </RoleCard>

          <Card size="small" title="分配统计">
            <StatsBox>
              <StatItem $highlight>
                <div className="number">{selectedUserIds.length}</div>
                <div className="label">已选择</div>
              </StatItem>
              <StatItem>
                <div className="number">{users.length}</div>
                <div className="label">总用户</div>
              </StatItem>
            </StatsBox>
          </Card>

          <Card size="small" title="当前已分配">
            {selectedRole.users && selectedRole.users.length > 0 ? (
              <Space wrap size={[4, 8]}>
                {selectedRole.users.map((user: any) => (
                  <Tag key={user.userId} color="green">
                    {user.username}
                  </Tag>
                ))}
              </Space>
            ) : (
              <Text type="secondary">暂无用户</Text>
            )}
          </Card>
        </Sidebar>

        {/* 右侧主内容区 */}
        <MainContent>
          {/* 顶部操作栏 */}
          <ActionBar>
            <ActionLeft>
              <div className="title-icon">
                <UserOutlined />
              </div>
              <div className="title-content">
                <div className="title">选择用户</div>
                <div className="subtitle">
                  已选 {selectedUserIds.length} / {users.length} 个
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

          {/* 搜索框 */}
          <SearchBox>
            <Input
              placeholder="搜索用户名、昵称或邮箱"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              style={{ width: 280 }}
            />
            {searchText && (
              <span className="search-result">
                找到 {filteredUsers.length} 个用户
              </span>
            )}
          </SearchBox>

          {/* 用户卡片网格 */}
          <UserGrid>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user: any) => {
                const isSelected = selectedUserIds.includes(user.userId);
                return (
                  <UserItem
                    key={user.userId}
                    $selected={isSelected}
                    onClick={() => toggleUser(user.userId)}
                  >
                    <div className="check-icon">
                      {isSelected && <CheckOutlined />}
                    </div>
                    <div className="user-header">
                      <div className="user-avatar">
                        {user.avatar ? (
                          <img src={user.avatar} alt="avatar" />
                        ) : (
                          user.username?.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="user-info">
                        <div className="username">{user.username}</div>
                        <div className="nickname">{user.nickname || '-'}</div>
                      </div>
                    </div>
                    <div className="user-email">{user.email || '-'}</div>
                  </UserItem>
                );
              })
            ) : (
              <EmptyState>
                <UserOutlined className="icon" />
                <div>
                  {searchText ? '未找到匹配的用户' : '暂无可分配的用户'}
                </div>
              </EmptyState>
            )}
          </UserGrid>
        </MainContent>
      </PageWrapper>
    </PageContainer>
  );
}

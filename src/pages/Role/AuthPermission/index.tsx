import { PageContainer, StatusTag } from '@/components';
import {
  ArrowLeftOutlined,
  FileOutlined,
  FolderOutlined,
  KeyOutlined,
  SaveOutlined,
  SearchOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import { Button, Card, Input, Space, Spin, Tag, Tree, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { styled, useNavigate, useParams } from 'umi';
import { useAuthPermission } from './model';

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
    border-color: #722ed1;
    color: #722ed1;
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
  background: linear-gradient(135deg, #722ed1 0%, #1890ff 100%);
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
    color: #722ed1;
    background: #f9f0ff;
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
  background: ${(props) => (props.$highlight ? '#f9f0ff' : '#fafafa')};
  border: 1px solid ${(props) => (props.$highlight ? '#d3adf7' : '#f0f0f0')};
  border-radius: 8px;
  padding: 12px;
  text-align: center;

  .number {
    font-size: 24px;
    font-weight: 600;
    color: ${(props) => (props.$highlight ? '#722ed1' : '#1a1a1a')};
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
    background: linear-gradient(135deg, #722ed1 0%, #1890ff 100%);
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

// 权限树容器
const TreeWrapper = styled.div`
  flex: 1;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  overflow-y: auto;

  // 修复 showLine 模式下 checkbox 与连接线对齐问题
  .ant-tree-show-line .ant-tree-switcher {
    background: white;
  }

  .ant-tree .ant-tree-treenode {
    align-items: center;
  }

  .ant-tree .ant-tree-node-content-wrapper {
    display: flex;
    align-items: center;
  }
`;

const ResourceNode = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PermissionNode = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 10px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9f0ff;
  }
`;

const PermissionInfo = styled.div`
  flex: 1;

  .permission-name {
    font-weight: 500;
    font-size: 14px;
    line-height: 1.4;
    min-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .permission-description {
    font-size: 12px;
    color: #666;
    margin-top: 2px;
    line-height: 1.4;
  }
`;

const PermissionTags = styled(Space)`
  flex-shrink: 0;
  align-items: flex-start;

  .ant-space-item {
    margin-right: 0;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #999;
  padding: 60px 20px;

  .icon {
    font-size: 48px;
    color: #d9d9d9;
    margin-bottom: 16px;
  }
`;

interface TreeNode {
  key: string;
  title: React.ReactNode;
  children?: TreeNode[];
  isLeaf?: boolean;
  permission?: any;
  resourceType?: string;
}

export default function AuthPermissionPage() {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>(
    [],
  );
  const [searchText, setSearchText] = useState<string>('');
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const {
    permissions,
    selectedRole,
    loading,
    submitting,
    initializeData,
    submitPermissionAssignment,
  } = useAuthPermission();

  useEffect(() => {
    if (roleId) {
      initializeData(roleId);
    }
  }, [initializeData, roleId]);

  // 当角色数据加载完成后，设置初始选中的权限
  useEffect(() => {
    if (selectedRole?.permissions) {
      const permissionIds = selectedRole.permissions.map(
        (permission: any) => permission.permissionId,
      );
      setSelectedPermissionIds(permissionIds);
      setCheckedKeys(permissionIds);
    }
  }, [selectedRole]);

  // 返回角色列表页面
  const handleBackToRoles = () => {
    navigate('/system/role');
  };

  // 处理权限选择
  const handleCheck = (checkedKeys: any) => {
    const permissionIds = checkedKeys.filter(
      (key: string) => !key.startsWith('resource-'),
    );
    setCheckedKeys(checkedKeys);
    setSelectedPermissionIds(permissionIds);
  };

  // 构建权限树结构
  const buildPermissionTree = (permissions: any[]): TreeNode[] => {
    const resourceMap = new Map<string, any[]>();

    // 按资源分组
    permissions.forEach((permission) => {
      const resourceName = permission.resource?.name || '其他';
      if (!resourceMap.has(resourceName)) {
        resourceMap.set(resourceName, []);
      }
      resourceMap.get(resourceName)!.push(permission);
    });

    const treeData: TreeNode[] = [];

    resourceMap.forEach((permissionList, resourceName) => {
      // 计算当前资源下已选择的权限数量
      const selectedCount = permissionList.filter((permission) =>
        selectedPermissionIds.includes(permission.permissionId),
      ).length;

      const resourceNode: TreeNode = {
        key: `resource-${resourceName}`,
        title: (
          <ResourceNode>
            <Space>
              <FolderOutlined style={{ color: '#1890ff' }} />
              <Text strong>{resourceName}</Text>
              <Tag color={selectedCount > 0 ? 'green' : 'blue'}>
                {selectedCount}/{permissionList.length}
              </Tag>
            </Space>
          </ResourceNode>
        ),
        children: permissionList.map((permission) => ({
          key: permission.permissionId,
          title: (
            <PermissionNode
              onClick={(e) => {
                e.stopPropagation();
                const newCheckedKeys = checkedKeys.includes(
                  permission.permissionId,
                )
                  ? checkedKeys.filter((key) => key !== permission.permissionId)
                  : [...checkedKeys, permission.permissionId];
                handleCheck(newCheckedKeys);
              }}
            >
              <PermissionInfo>
                <div className="permission-name">
                  <FileOutlined
                    style={{ marginRight: '8px', color: '#52c41a' }}
                  />
                  {permission.name}
                </div>
                {permission.description && (
                  <div className="permission-description">
                    {permission.description}
                  </div>
                )}
              </PermissionInfo>
              <PermissionTags size="small">
                <Tag color="purple">{permission.code}</Tag>
                <Tag color={permission.action === 'view' ? 'green' : 'orange'}>
                  {permission.action === 'view' ? '查看' : permission.action}
                </Tag>
                <Tag color="cyan">{permission.resource?.type || 'MENU'}</Tag>
              </PermissionTags>
            </PermissionNode>
          ),
          isLeaf: true,
          permission,
          resourceType: resourceName,
        })),
      };

      treeData.push(resourceNode);
    });

    return treeData;
  };

  // 过滤权限数据
  const filterPermissions = (permissions: any[]) => {
    if (!searchText) return permissions;

    return permissions.filter(
      (permission) =>
        permission.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        permission.code?.toLowerCase().includes(searchText.toLowerCase()) ||
        permission.description
          ?.toLowerCase()
          .includes(searchText.toLowerCase()) ||
        permission.resource?.name
          ?.toLowerCase()
          .includes(searchText.toLowerCase()) ||
        permission.action?.toLowerCase().includes(searchText.toLowerCase()),
    );
  };

  const filteredPermissions = filterPermissions(permissions);
  const treeData = buildPermissionTree(filteredPermissions);

  // 当搜索文本变化时，自动展开所有匹配的节点
  useEffect(() => {
    if (searchText) {
      // 获取所有资源节点的key
      const allResourceKeys = Array.from(
        new Set(filteredPermissions.map((p) => p.resource?.name || '其他')),
      ).map((name) => `resource-${name}`);
      setExpandedKeys(allResourceKeys);
    } else {
      // 默认展开所有资源节点（第一层）
      const allResourceKeys = Array.from(
        new Set(permissions.map((p) => p.resource?.name || '其他')),
      ).map((name) => `resource-${name}`);
      setExpandedKeys(allResourceKeys);
    }
  }, [searchText, filteredPermissions, permissions]);

  // 处理树节点展开
  const handleExpand = (expandedKeys: any) => {
    setExpandedKeys(expandedKeys as string[]);
  };

  // 提交权限分配
  const handleSubmit = async () => {
    if (!selectedRole) return;

    const success = await submitPermissionAssignment({
      roleId: selectedRole.roleId,
      permissionIds: selectedPermissionIds,
    });

    if (success) {
      await initializeData(roleId);
    }
  };

  // 重置选择
  const handleReset = () => {
    if (selectedRole?.permissions) {
      const permissionIds = selectedRole.permissions.map(
        (permission: any) => permission.permissionId,
      );
      setSelectedPermissionIds(permissionIds);
      setCheckedKeys(permissionIds);
    }
  };

  // 全选
  const handleSelectAll = () => {
    const allPermissionIds = permissions.map(
      (permission: any) => permission.permissionId,
    );
    setSelectedPermissionIds(allPermissionIds);
    setCheckedKeys(allPermissionIds);
  };

  // 清空选择
  const handleClearAll = () => {
    setSelectedPermissionIds([]);
    setCheckedKeys([]);
  };

  // 判断是否有变更
  const hasChanges = () => {
    const originalIds =
      selectedRole?.permissions?.map((p: any) => p.permissionId) || [];
    if (originalIds.length !== selectedPermissionIds.length) return true;
    return !originalIds.every((id: string) =>
      selectedPermissionIds.includes(id),
    );
  };

  if (!roleId) {
    return (
      <PageContainer>
        <EmptyState>
          <KeyOutlined className="icon" />
          <div>请提供角色ID来分配权限</div>
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
          <KeyOutlined className="icon" />
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
                <KeyOutlined />
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
                <div className="number">{selectedPermissionIds.length}</div>
                <div className="label">已选择</div>
              </StatItem>
              <StatItem>
                <div className="number">{permissions.length}</div>
                <div className="label">总权限</div>
              </StatItem>
            </StatsBox>
          </Card>

          <Card size="small" title="当前已分配">
            {selectedRole.permissions && selectedRole.permissions.length > 0 ? (
              <Space wrap size={[4, 8]}>
                {selectedRole.permissions.slice(0, 10).map((p: any) => (
                  <Tag key={p.permissionId} color="purple">
                    {p.name}
                  </Tag>
                ))}
                {selectedRole.permissions.length > 10 && (
                  <Tag>+{selectedRole.permissions.length - 10}</Tag>
                )}
              </Space>
            ) : (
              <Text type="secondary">暂无权限</Text>
            )}
          </Card>
        </Sidebar>

        {/* 右侧主内容区 */}
        <MainContent>
          {/* 顶部操作栏 */}
          <ActionBar>
            <ActionLeft>
              <div className="title-icon">
                <KeyOutlined />
              </div>
              <div className="title-content">
                <div className="title">选择权限</div>
                <div className="subtitle">
                  已选 {selectedPermissionIds.length} / {permissions.length} 个
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
              placeholder="搜索权限名称、标识、描述或资源名称"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              style={{ width: 320 }}
            />
            {searchText && (
              <span className="search-result">
                找到 {filteredPermissions.length} 个权限
              </span>
            )}
          </SearchBox>

          {/* 权限树 */}
          <TreeWrapper>
            <Tree
              checkable
              expandedKeys={expandedKeys}
              checkedKeys={checkedKeys}
              onExpand={handleExpand}
              onCheck={handleCheck}
              treeData={treeData}
              showLine
              showIcon={false}
            />
          </TreeWrapper>
        </MainContent>
      </PageWrapper>
    </PageContainer>
  );
}

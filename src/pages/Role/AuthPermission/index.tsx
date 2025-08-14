import { PageContainer } from '@/components';
import {
  EyeOutlined,
  FileOutlined,
  FolderOutlined,
  KeyOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Space,
  Tag,
  Tree,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { styled, useParams } from 'umi';
import { useAuthPermission } from './model';

const { Title, Text } = Typography;

// Styled Components
const RoleInfoCard = styled(Card)`
  margin-bottom: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  .ant-card-body {
    padding: 24px;
  }
`;

const RoleAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
  font-weight: bold;
  border: 3px solid rgba(255, 255, 255, 0.3);
`;

const RoleTitle = styled(Title)`
  color: white !important;
  margin: 0 !important;
  margin-bottom: 8px !important;
`;

const RoleSubtitle = styled(Text)`
  color: rgba(255, 255, 255, 0.8) !important;
  font-size: 16px;
`;

const RoleDescription = styled.div`
  color: rgba(255, 255, 255, 0.7);
  margin-top: 8px;
`;

const PermissionCount = styled.div`
  text-align: right;

  .count-label {
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
  }

  .count-number {
    color: white;
    font-size: 24px;
    font-weight: bold;
  }
`;

const PermissionCard = styled(Card)`
  .ant-card-head-title {
    display: flex;
    align-items: center;
  }
`;

const SearchContainer = styled.div`
  margin-bottom: 16px;

  .search-result {
    margin-top: 8px;
    font-size: 12px;
    color: #666;
  }
`;

const TreeContainer = styled.div`
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  max-height: 600px;
  overflow: auto;
`;

const ResourceNode = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PermissionNode = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  gap: 10px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const PermissionInfo = styled.div`
  flex: 1;

  .permission-name {
    font-weight: 500;
    font-size: 14px;
    line-height: 1.4;
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

const StatsCard = styled(Card)`
  margin-bottom: 16px;

  .stats-main {
    text-align: center;
    padding: 24px 0;
    margin: 16px 0;
  }

  .stats-number {
    font-size: 42px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 8px;
    line-height: 1;
  }

  .stats-label {
    font-size: 14px;
    color: #7f8c8d;
    font-weight: 500;
  }

  .stats-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 20px;
  }

  .stats-item {
    text-align: center;
    padding: 16px 12px;
    background: #ffffff;
    border: 1px solid #ecf0f1;
    border-radius: 8px;

    .item-number {
      font-size: 20px;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 6px;
    }

    .item-label {
      font-size: 12px;
      color: #7f8c8d;
      font-weight: 500;
    }
  }
`;

const PreviewCard = styled(Card)`
  .preview-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    padding: 16px;
    background: #ffffff;
    border: 1px solid #ecf0f1;
    border-radius: 8px;

    .header-info {
      .header-title {
        font-size: 15px;
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 4px;
      }

      .header-subtitle {
        font-size: 13px;
        color: #7f8c8d;
      }
    }

    .header-icon {
      color: #3498db;
      font-size: 18px;
    }
  }

  .preview-content {
    max-height: 300px;
    overflow: auto;

    .preview-item {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      background: #ffffff;
      border: 1px solid #ecf0f1;
      border-radius: 6px;
      margin-bottom: 8px;

      .item-icon {
        width: 28px;
        height: 28px;
        border-radius: 6px;
        background: #3498db;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        font-weight: 600;
        margin-right: 12px;
        flex-shrink: 0;
      }

      .item-content {
        flex: 1;

        .item-name {
          font-weight: 500;
          font-size: 14px;
          color: #2c3e50;
          margin-bottom: 3px;
        }

        .item-code {
          font-size: 12px;
          color: #7f8c8d;
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono',
            monospace;
        }
      }
    }

    .preview-empty {
      text-align: center;
      padding: 40px 20px;
      color: #bdc3c7;

      .empty-icon {
        font-size: 36px;
        margin-bottom: 12px;
        opacity: 0.6;
      }

      .empty-text {
        font-size: 14px;
        font-weight: 500;
      }
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #999;
  padding: 40px 0;
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
  } = useAuthPermission(roleId);

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
      // 清空搜索时，展开所有节点
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

  if (!roleId) {
    return (
      <PageContainer>
        <Card>
          <EmptyState>请提供角色ID来分配权限</EmptyState>
        </Card>
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer>
        <Card loading={true} />
      </PageContainer>
    );
  }

  if (!selectedRole) {
    return (
      <PageContainer>
        <Card>
          <EmptyState>未找到角色信息</EmptyState>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* 角色信息卡片 */}
        <RoleInfoCard>
          <Row align="middle" gutter={24}>
            <Col>
              <RoleAvatar>
                <KeyOutlined />
              </RoleAvatar>
            </Col>
            <Col flex={1}>
              <RoleTitle level={3}>{selectedRole.roleName}</RoleTitle>
              <RoleSubtitle>{selectedRole.roleKey}</RoleSubtitle>
              {selectedRole.remark && (
                <RoleDescription>{selectedRole.remark}</RoleDescription>
              )}
            </Col>
            <Col>
              <PermissionCount>
                <div className="count-label">当前权限数量</div>
                <div className="count-number">
                  {selectedRole.permissions?.length || 0}
                </div>
              </PermissionCount>
            </Col>
          </Row>
        </RoleInfoCard>

        {/* 权限分配区域 */}
        <PermissionCard
          title={
            <div>
              <KeyOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
              权限分配
            </div>
          }
          extra={
            <Space>
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={submitting}
                icon={<KeyOutlined />}
              >
                保存分配
              </Button>
              <Button onClick={handleReset}>重置</Button>
              <Button onClick={handleSelectAll}>全选</Button>
              <Button onClick={handleClearAll}>清空</Button>
            </Space>
          }
        >
          <Row gutter={16}>
            <Col span={16}>
              <SearchContainer>
                <Input
                  placeholder="搜索权限名称、权限标识、描述、资源名称或操作类型"
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                  size="large"
                />
                {searchText && (
                  <div className="search-result">
                    找到 {filteredPermissions.length} 个权限
                  </div>
                )}
              </SearchContainer>

              <TreeContainer>
                <Tree
                  checkable
                  expandedKeys={expandedKeys}
                  checkedKeys={checkedKeys}
                  onExpand={handleExpand}
                  onCheck={handleCheck}
                  treeData={treeData}
                  showLine
                  showIcon={false}
                  defaultExpandAll
                />
              </TreeContainer>
            </Col>

            <Col span={8}>
              <StatsCard title="分配统计" size="small">
                <div className="stats-main">
                  <div className="stats-number">
                    {selectedPermissionIds.length}
                  </div>
                  <div className="stats-label">已选择权限</div>
                </div>

                <div className="stats-details">
                  <div className="stats-item">
                    <div className="item-number">{permissions.length}</div>
                    <div className="item-label">总权限数</div>
                  </div>
                  <div className="stats-item">
                    <div className="item-number">
                      {selectedRole.permissions?.length || 0}
                    </div>
                    <div className="item-label">已分配</div>
                  </div>
                  <div className="stats-item">
                    <div className="item-number">
                      {selectedPermissionIds.length -
                        (selectedRole.permissions?.length || 0)}
                    </div>
                    <div className="item-label">待分配</div>
                  </div>
                  <div className="stats-item">
                    <div className="item-number">
                      {selectedRole.permissions?.length > 0
                        ? Math.round(
                            (selectedRole.permissions.length /
                              permissions.length) *
                              100,
                          )
                        : 0}
                      %
                    </div>
                    <div className="item-label">分配率</div>
                  </div>
                </div>
              </StatsCard>

              <PreviewCard title="当前权限预览" size="small">
                <div className="preview-header">
                  <div className="header-info">
                    <div className="header-title">已分配权限</div>
                    <div className="header-subtitle">
                      {selectedRole.permissions?.length || 0} 个权限已分配
                    </div>
                  </div>
                  <div className="header-icon">
                    <EyeOutlined />
                  </div>
                </div>

                <div className="preview-content">
                  {selectedRole.permissions &&
                  selectedRole.permissions.length > 0 ? (
                    selectedRole.permissions.map((permission: any) => (
                      <div
                        key={permission.permissionId}
                        className="preview-item"
                      >
                        {/* <div className="item-icon">
                          {index + 1}
                        </div> */}
                        <div className="item-content">
                          <div className="item-name">{permission.name}</div>
                          <div className="item-code">{permission.code}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="preview-empty">
                      <div className="empty-icon">
                        <KeyOutlined />
                      </div>
                      <div className="empty-text">暂无权限</div>
                    </div>
                  )}
                </div>
              </PreviewCard>
            </Col>
          </Row>
        </PermissionCard>
      </div>
    </PageContainer>
  );
}

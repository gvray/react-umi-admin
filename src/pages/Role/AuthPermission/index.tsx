import { PageContainer, StatusTag } from '@/components';
import {
  ApiOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ControlOutlined,
  FolderOutlined,
  InfoCircleOutlined,
  KeyOutlined,
  MenuOutlined,
  SaveOutlined,
  SearchOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Input,
  Space,
  Spin,
  Tabs,
  Tag,
  Tooltip,
  Tree,
  Typography,
  message,
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { styled, useNavigate, useParams } from 'umi';
import { useAuthPermission } from './model';

const { Text } = Typography;

// ==================== Styled Components ====================

const PageWrapper = styled.div`
  display: flex;
  gap: 16px;
  height: calc(100vh - 120px);
  min-height: 500px;
`;

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

const Sidebar = styled.div`
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
`;

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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const StatItem = styled.div<{ $color?: string }>`
  background: ${(props) => {
    switch (props.$color) {
      case 'purple':
        return '#f9f0ff';
      case 'blue':
        return '#e6f7ff';
      case 'green':
        return '#f6ffed';
      case 'orange':
        return '#fff7e6';
      default:
        return '#fafafa';
    }
  }};
  border: 1px solid
    ${(props) => {
      switch (props.$color) {
        case 'purple':
          return '#d3adf7';
        case 'blue':
          return '#91d5ff';
        case 'green':
          return '#b7eb8f';
        case 'orange':
          return '#ffd591';
        default:
          return '#f0f0f0';
      }
    }};
  border-radius: 8px;
  padding: 10px 8px;
  text-align: center;

  .number {
    font-size: 20px;
    font-weight: 600;
    color: ${(props) => {
      switch (props.$color) {
        case 'purple':
          return '#722ed1';
        case 'blue':
          return '#1890ff';
        case 'green':
          return '#52c41a';
        case 'orange':
          return '#fa8c16';
        default:
          return '#1a1a1a';
      }
    }};
    line-height: 1;
    margin-bottom: 4px;
  }

  .label {
    font-size: 11px;
    color: #666;
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

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

const ContentBody = styled.div`
  flex: 1;
  background: white;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;

  .ant-tabs {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .ant-tabs-content-holder {
    flex: 1;
    overflow: hidden;
    min-height: 0;
  }

  .ant-tabs-content {
    height: 100%;
  }

  .ant-tabs-tabpane {
    height: 100%;
  }

  .ant-tabs-tabpane-active {
    display: flex !important;
    flex-direction: column;
    overflow: hidden;
  }

  .ant-tabs-nav {
    margin: 0;
    padding: 0 16px;
    flex-shrink: 0;
  }
`;

const TabToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid #f5f5f5;
  background: #fafafa;
  flex-shrink: 0;
`;

const TreeWrapper = styled.div`
  flex: 1;
  min-height: 0;
  padding: 8px 16px;
  overflow-y: auto;

  .ant-tree-show-line .ant-tree-switcher {
    background: transparent;
  }

  .ant-tree .ant-tree-treenode {
    align-items: center;
    padding: 2px 0;
  }

  .ant-tree .ant-tree-node-content-wrapper {
    display: flex;
    align-items: center;
  }
`;

// API 权限列表容器
const ApiListWrapper = styled.div`
  flex: 1;
  min-height: 0;
  padding: 8px 16px;
  overflow-y: auto;
`;

const ApiGroup = styled.div`
  margin-bottom: 16px;

  .group-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: #fafafa;
    border-radius: 6px;
    margin-bottom: 6px;
    cursor: pointer;
    user-select: none;

    &:hover {
      background: #f0f0f0;
    }

    .group-name {
      font-weight: 600;
      font-size: 13px;
      color: #1a1a1a;
    }

    .group-count {
      font-size: 12px;
      color: #999;
    }
  }
`;

const ApiItem = styled.div<{ $checked?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px 6px 28px;
  border-radius: 4px;
  transition: all 0.15s;
  cursor: pointer;

  &:hover {
    background: #f9f0ff;
  }

  .api-main {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;

    .api-name {
      font-size: 13px;
      font-weight: 500;
      color: #1a1a1a;
      white-space: nowrap;
    }

    .api-code {
      font-size: 11px;
      color: #999;
      font-family: 'SF Mono', Monaco, monospace;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .api-action {
    flex-shrink: 0;
  }
`;

const TreeNodeLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  padding: 2px 0;

  .node-name {
    font-weight: 500;
    color: #1a1a1a;
  }

  .node-code {
    font-size: 11px;
    color: #999;
    font-family: 'SF Mono', Monaco, monospace;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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

// ==================== Helpers ====================

const ACTION_MAP: Record<string, { label: string; color: string }> = {
  view: { label: '查看', color: 'green' },
  create: { label: '新增', color: 'blue' },
  update: { label: '修改', color: 'orange' },
  delete: { label: '删除', color: 'red' },
  export: { label: '导出', color: 'cyan' },
  import: { label: '导入', color: 'purple' },
};

const TYPE_ICON: Record<string, React.ReactNode> = {
  DIRECTORY: <FolderOutlined style={{ color: '#faad14' }} />,
  MENU: <MenuOutlined style={{ color: '#1890ff' }} />,
  BUTTON: <ControlOutlined style={{ color: '#52c41a' }} />,
  API: <ApiOutlined style={{ color: '#722ed1' }} />,
};

const getActionTag = (action: string) => {
  const info = ACTION_MAP[action] || { label: action, color: 'default' };
  return (
    <Tag
      color={info.color}
      style={{ margin: 0, fontSize: 11, lineHeight: '18px', padding: '0 4px' }}
    >
      {info.label}
    </Tag>
  );
};

// ==================== Types ====================

interface TreeNode {
  key: string;
  title: React.ReactNode;
  children?: TreeNode[];
  isLeaf?: boolean;
}

// ==================== Component ====================

export default function AuthPermissionPage() {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>(
    [],
  );
  const [searchText, setSearchText] = useState<string>('');
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>('func');
  const { permissions, selectedRole, initializeData, submitRolePermissions } =
    useAuthPermission();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (roleId) {
      setLoading(true);
      initializeData(roleId).finally(() => setLoading(false));
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

  // ---- 数据分类 ----
  const { funcPermissions, apiPermissions, typeCounts } = useMemo(() => {
    const func: any[] = [];
    const api: any[] = [];
    const counts = { DIRECTORY: 0, MENU: 0, BUTTON: 0, API: 0 };

    permissions.forEach((p: any) => {
      const t = p.type || 'BUTTON';
      if (counts[t as keyof typeof counts] !== undefined) {
        counts[t as keyof typeof counts]++;
      }
      if (t === 'API') {
        api.push(p);
      } else {
        func.push(p);
      }
    });

    return { funcPermissions: func, apiPermissions: api, typeCounts: counts };
  }, [permissions]);

  // ---- 搜索过滤 ----
  const filterList = (list: any[]) => {
    if (!searchText) return list;
    const kw = searchText.toLowerCase();
    return list.filter(
      (p) =>
        p.name?.toLowerCase().includes(kw) ||
        p.code?.toLowerCase().includes(kw) ||
        p.description?.toLowerCase().includes(kw) ||
        p.action?.toLowerCase().includes(kw),
    );
  };

  const filteredFunc = filterList(funcPermissions);
  const filteredApi = filterList(apiPermissions);

  // ---- 构建功能权限树 (DIRECTORY > MENU > BUTTON) ----
  const funcTreeData = useMemo(() => {
    // 建立 parentPermissionId -> children 映射
    const idMap = new Map<string, any>();
    const roots: any[] = [];

    filteredFunc.forEach((p) =>
      idMap.set(p.permissionId, { ...p, _children: [] }),
    );

    filteredFunc.forEach((p) => {
      const node = idMap.get(p.permissionId)!;
      const parentId = p.parentPermissionId;
      if (parentId && idMap.has(parentId)) {
        idMap.get(parentId)!._children.push(node);
      } else {
        roots.push(node);
      }
    });

    const buildNode = (item: any): TreeNode => {
      const hasDesc = !!item.description;

      return {
        key: item.permissionId,
        title: (
          <TreeNodeLabel>
            {TYPE_ICON[item.type] || TYPE_ICON.BUTTON}
            <span className="node-name">{item.name}</span>
            {getActionTag(item.action)}
            <Tooltip title={item.code} placement="top">
              <span className="node-code">{item.code}</span>
            </Tooltip>
            {hasDesc && (
              <Tooltip title={item.description} placement="topLeft">
                <InfoCircleOutlined
                  style={{ color: '#bbb', fontSize: 12, cursor: 'help' }}
                />
              </Tooltip>
            )}
          </TreeNodeLabel>
        ),
        children:
          item._children && item._children.length > 0
            ? item._children.map(buildNode)
            : undefined,
        isLeaf: !item._children || item._children.length === 0,
      };
    };

    return roots.map(buildNode);
  }, [filteredFunc, selectedPermissionIds]);

  // ---- API 权限按父级菜单分组 ----
  const apiGroups = useMemo(() => {
    const groupMap = new Map<string, { name: string; items: any[] }>();

    filteredApi.forEach((p) => {
      const parentId = p.parentPermissionId || '__ungrouped__';
      // 尝试找到父级名称
      const parent = permissions.find(
        (pp: any) => pp.permissionId === parentId,
      );
      const groupName = parent?.name || '其他接口';

      if (!groupMap.has(parentId)) {
        groupMap.set(parentId, { name: groupName, items: [] });
      }
      groupMap.get(parentId)!.items.push(p);
    });

    return Array.from(groupMap.entries()).map(([key, val]) => ({
      key,
      ...val,
    }));
  }, [filteredApi, permissions]);

  // ---- 展开控制 ----
  useEffect(() => {
    if (activeTab === 'func') {
      // 收集所有非叶子节点 key
      const collectParentKeys = (list: any[]): string[] => {
        const keys: string[] = [];
        const idMap = new Map<string, any>();
        list.forEach((p) => idMap.set(p.permissionId, p));
        list.forEach((p) => {
          if (list.some((c) => c.parentPermissionId === p.permissionId)) {
            keys.push(p.permissionId);
          }
        });
        return keys;
      };
      setExpandedKeys(collectParentKeys(filteredFunc));
    }
  }, [searchText, filteredFunc, activeTab]);

  const handleExpand = (keys: any) => {
    setExpandedKeys(keys as string[]);
  };

  // ---- 选中处理 ----
  const handleTreeCheck = (keys: any) => {
    // keys 可能是 { checked, halfChecked } 或 string[]
    const checked = Array.isArray(keys) ? keys : keys.checked || [];
    const newIds = new Set(selectedPermissionIds);

    // 先移除当前 tab 的所有 id，再加入新选中的
    funcPermissions.forEach((p: any) => newIds.delete(p.permissionId));
    checked.forEach((k: string) => newIds.add(k));

    const result = Array.from(newIds);
    setSelectedPermissionIds(result);
    setCheckedKeys(result);
  };

  const toggleApiPermission = (permissionId: string) => {
    const newIds = selectedPermissionIds.includes(permissionId)
      ? selectedPermissionIds.filter((id) => id !== permissionId)
      : [...selectedPermissionIds, permissionId];
    setSelectedPermissionIds(newIds);
    setCheckedKeys(newIds);
  };

  const toggleApiGroup = (groupItems: any[], checked: boolean) => {
    const groupIds = groupItems.map((p) => p.permissionId);
    let newIds: string[];
    if (checked) {
      newIds = [...new Set([...selectedPermissionIds, ...groupIds])];
    } else {
      const removeSet = new Set(groupIds);
      newIds = selectedPermissionIds.filter((id) => !removeSet.has(id));
    }
    setSelectedPermissionIds(newIds);
    setCheckedKeys(newIds);
  };

  // 返回角色列表页面
  const handleBackToRoles = () => {
    navigate('/system/role');
  };

  // 提交权限分配
  const handleSubmit = async () => {
    if (!selectedRole) return;
    setSubmitting(true);
    try {
      const success = await submitRolePermissions({
        roleId: selectedRole.roleId,
        permissionIds: selectedPermissionIds,
      });
      if (success) {
        message.success('权限分配成功');
        await initializeData(roleId);
      }
    } catch (error) {
      // error handled by request interceptor
    } finally {
      setSubmitting(false);
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
    const allIds = permissions.map((p: any) => p.permissionId);
    setSelectedPermissionIds(allIds);
    setCheckedKeys(allIds);
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

  // ---- 统计 ----
  const selectedFuncCount = funcPermissions.filter((p: any) =>
    selectedPermissionIds.includes(p.permissionId),
  ).length;
  const selectedApiCount = apiPermissions.filter((p: any) =>
    selectedPermissionIds.includes(p.permissionId),
  ).length;

  // ---- 渲染 ----
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

  // 功能权限 tree 的 checkedKeys 只取功能类
  const funcCheckedKeys = checkedKeys.filter((k) =>
    funcPermissions.some((p: any) => p.permissionId === k),
  );

  return (
    <PageContainer>
      <PageWrapper>
        {/* 左侧边栏 */}
        <Sidebar>
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
                <Tooltip title={selectedRole.remark}>
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
                </Tooltip>
              </InfoItem>
            )}
          </RoleCard>

          <Card size="small" title="权限概览">
            <StatsGrid>
              <StatItem $color="purple">
                <div className="number">{selectedPermissionIds.length}</div>
                <div className="label">已选择</div>
              </StatItem>
              <StatItem>
                <div className="number">{permissions.length}</div>
                <div className="label">总权限</div>
              </StatItem>
            </StatsGrid>
            <div style={{ borderTop: '1px solid #f0f0f0', margin: '10px 0' }} />
            <StatsGrid>
              <StatItem $color="orange">
                <div className="number">{typeCounts.DIRECTORY}</div>
                <div className="label">目录</div>
              </StatItem>
              <StatItem $color="blue">
                <div className="number">{typeCounts.MENU}</div>
                <div className="label">菜单</div>
              </StatItem>
              <StatItem $color="green">
                <div className="number">{typeCounts.BUTTON}</div>
                <div className="label">按钮</div>
              </StatItem>
              <StatItem $color="purple">
                <div className="number">{typeCounts.API}</div>
                <div className="label">接口</div>
              </StatItem>
            </StatsGrid>
          </Card>

          <Card size="small" title="当前已分配">
            {selectedRole.permissions && selectedRole.permissions.length > 0 ? (
              <Space wrap size={[4, 6]}>
                {selectedRole.permissions.slice(0, 12).map((p: any) => (
                  <Tag
                    key={p.permissionId}
                    color={p.type === 'API' ? 'purple' : 'blue'}
                    style={{ margin: 0, fontSize: 11 }}
                  >
                    {p.name}
                  </Tag>
                ))}
                {selectedRole.permissions.length > 12 && (
                  <Tag style={{ margin: 0, fontSize: 11 }}>
                    +{selectedRole.permissions.length - 12}
                  </Tag>
                )}
              </Space>
            ) : (
              <Text type="secondary" style={{ fontSize: 13 }}>
                暂无权限
              </Text>
            )}
          </Card>
        </Sidebar>

        {/* 右侧主内容区 */}
        <MainContent>
          <ActionBar>
            <ActionLeft>
              <div className="title-icon">
                <KeyOutlined />
              </div>
              <div className="title-content">
                <div className="title">权限配置</div>
                <div className="subtitle">
                  已选 {selectedPermissionIds.length} / {permissions.length}
                  {hasChanges() && (
                    <span style={{ color: '#ff4d4f', marginLeft: 8 }}>
                      (有未保存变更)
                    </span>
                  )}
                </div>
              </div>
            </ActionLeft>
            <Space>
              <Input
                placeholder="搜索权限"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                style={{ width: 200 }}
              />
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
                保存
              </Button>
            </Space>
          </ActionBar>

          <ContentBody>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                {
                  key: 'func',
                  label: (
                    <span>
                      <MenuOutlined style={{ marginRight: 6 }} />
                      功能权限
                      <Badge
                        count={selectedFuncCount}
                        style={{ marginLeft: 6, backgroundColor: '#722ed1' }}
                        overflowCount={999}
                      />
                    </span>
                  ),
                  children: (
                    <>
                      <TabToolbar>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          <CheckCircleOutlined style={{ marginRight: 4 }} />
                          {selectedFuncCount} / {funcPermissions.length} 项已选
                        </Text>
                        {searchText && (
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            匹配 {filteredFunc.length} 项
                          </Text>
                        )}
                      </TabToolbar>
                      <TreeWrapper>
                        {funcTreeData.length > 0 ? (
                          <Tree
                            checkable
                            expandedKeys={expandedKeys}
                            checkedKeys={funcCheckedKeys}
                            onExpand={handleExpand}
                            onCheck={handleTreeCheck}
                            treeData={funcTreeData}
                            showLine={{ showLeafIcon: false }}
                            showIcon={false}
                            blockNode
                          />
                        ) : (
                          <EmptyState>
                            <FolderOutlined className="icon" />
                            <div>暂无功能权限数据</div>
                          </EmptyState>
                        )}
                      </TreeWrapper>
                    </>
                  ),
                },
                {
                  key: 'api',
                  label: (
                    <span>
                      <ApiOutlined style={{ marginRight: 6 }} />
                      接口权限
                      <Badge
                        count={selectedApiCount}
                        style={{ marginLeft: 6, backgroundColor: '#722ed1' }}
                        overflowCount={999}
                      />
                    </span>
                  ),
                  children: (
                    <>
                      <TabToolbar>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          <CheckCircleOutlined style={{ marginRight: 4 }} />
                          {selectedApiCount} / {apiPermissions.length} 项已选
                        </Text>
                        {searchText && (
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            匹配 {filteredApi.length} 项
                          </Text>
                        )}
                      </TabToolbar>
                      <ApiListWrapper>
                        {apiGroups.length > 0 ? (
                          apiGroups.map((group) => {
                            const groupCheckedCount = group.items.filter(
                              (p: any) =>
                                selectedPermissionIds.includes(p.permissionId),
                            ).length;
                            const allChecked =
                              groupCheckedCount === group.items.length;
                            const indeterminate =
                              groupCheckedCount > 0 && !allChecked;

                            return (
                              <ApiGroup key={group.key}>
                                <div
                                  className="group-header"
                                  onClick={() =>
                                    toggleApiGroup(group.items, !allChecked)
                                  }
                                >
                                  <Checkbox
                                    checked={allChecked}
                                    indeterminate={indeterminate}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) =>
                                      toggleApiGroup(
                                        group.items,
                                        e.target.checked,
                                      )
                                    }
                                  />
                                  <ApiOutlined style={{ color: '#722ed1' }} />
                                  <span className="group-name">
                                    {group.name}
                                  </span>
                                  <span className="group-count">
                                    {groupCheckedCount}/{group.items.length}
                                  </span>
                                </div>
                                {group.items.map((p: any) => {
                                  const isChecked =
                                    selectedPermissionIds.includes(
                                      p.permissionId,
                                    );
                                  return (
                                    <ApiItem
                                      key={p.permissionId}
                                      $checked={isChecked}
                                      onClick={() =>
                                        toggleApiPermission(p.permissionId)
                                      }
                                    >
                                      <Checkbox checked={isChecked} />
                                      <div className="api-main">
                                        <span className="api-name">
                                          {p.name}
                                        </span>
                                        {getActionTag(p.action)}
                                        <Tooltip title={p.code}>
                                          <span className="api-code">
                                            {p.code}
                                          </span>
                                        </Tooltip>
                                        {p.description && (
                                          <Tooltip title={p.description}>
                                            <InfoCircleOutlined
                                              style={{
                                                color: '#bbb',
                                                fontSize: 12,
                                                cursor: 'help',
                                              }}
                                            />
                                          </Tooltip>
                                        )}
                                      </div>
                                    </ApiItem>
                                  );
                                })}
                              </ApiGroup>
                            );
                          })
                        ) : (
                          <EmptyState>
                            <ApiOutlined className="icon" />
                            <div>暂无接口权限数据</div>
                          </EmptyState>
                        )}
                      </ApiListWrapper>
                    </>
                  ),
                },
              ]}
            />
          </ContentBody>
        </MainContent>
      </PageWrapper>
    </PageContainer>
  );
}

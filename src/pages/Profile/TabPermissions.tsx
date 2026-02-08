import { getMenus } from '@/services/auth';
import {
  ApartmentOutlined,
  ApiOutlined,
  MenuOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { Card, Table, Tabs, Tag, Tooltip, Tree, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';
import { useCallback, useEffect, useState } from 'react';
import styles from './index.less';

const { Text } = Typography;

interface TabPermissionsProps {
  profile?: API.CurrentUserResponseDto;
}

// ─── Helper: menu tree → antd Tree data ─────────────────

function menuToTreeData(menus: API.MenuResponseDto[]): DataNode[] {
  return menus.map((m) => ({
    key: m.permissionId,
    title: (
      <span>
        {m.name}
        {m.meta?.path && (
          <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
            {String(m.meta.path)}
          </Text>
        )}
      </span>
    ),
    children: m.children ? menuToTreeData(m.children) : undefined,
  }));
}

function collectTreeKeys(menus: API.MenuResponseDto[]): string[] {
  const keys: string[] = [];
  for (const m of menus) {
    keys.push(m.permissionId);
    if (m.children) keys.push(...collectTreeKeys(m.children));
  }
  return keys;
}

// ─── Helper: flatten permissions from roles ─────────────

interface FlatPermission {
  key: string;
  name: string;
  code: string;
  roleName: string;
}

function flattenPermissions(
  roles?: API.CurrentUserRoleResponseDto[],
): FlatPermission[] {
  if (!roles) return [];
  const result: FlatPermission[] = [];
  for (const role of roles) {
    if (!role.permissions) continue;
    for (const perm of role.permissions) {
      result.push({
        key: `${role.roleId}-${perm.permissionId}`,
        name: perm.name,
        code: perm.code,
        roleName: role.description || role.name,
      });
    }
  }
  return result;
}

// ─── Component ──────────────────────────────────────────

const TabPermissions: React.FC<TabPermissionsProps> = ({ profile }) => {
  const [menuTree, setMenuTree] = useState<API.MenuResponseDto[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const fetchMenus = useCallback(async () => {
    try {
      const res = await getMenus();
      if (res?.data) {
        setMenuTree(res.data);
        setExpandedKeys(collectTreeKeys(res.data));
      }
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  // ─── Tab 1: My Roles ──────────────────────────────────
  const roleColumns: ColumnsType<API.CurrentUserRoleResponseDto> = [
    {
      title: '角色名称',
      dataIndex: 'name',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: '角色描述',
      dataIndex: 'description',
      render: (text: string) => text || '-',
    },
    {
      title: '角色标识',
      dataIndex: 'roleKey',
      render: (text: string) => (text ? <Tag>{text}</Tag> : '-'),
    },
    {
      title: '来源',
      render: (_: unknown, record) => (
        <Tooltip title={`角色ID: ${record.roleId}`}>
          <Tag color="blue">系统分配</Tag>
        </Tooltip>
      ),
    },
    {
      title: '权限数',
      render: (_: unknown, record) => (
        <Tag color="purple">{record.permissions?.length || 0} 个权限</Tag>
      ),
    },
  ];

  const RolesTab = () => (
    <Card
      className={styles.moduleCard}
      size="small"
      title={
        <>
          <TagOutlined /> 我的角色
        </>
      }
    >
      <Table
        columns={roleColumns}
        dataSource={profile?.roles || []}
        rowKey="roleId"
        pagination={false}
      />
    </Card>
  );

  // ─── Tab 2: Menu Permissions ──────────────────────────
  const MenuTab = () => (
    <Card
      className={styles.moduleCard}
      size="small"
      title={
        <>
          <MenuOutlined /> 菜单权限
        </>
      }
    >
      <div className={styles.menuTreeWrap}>
        {menuTree.length > 0 ? (
          <Tree
            treeData={menuToTreeData(menuTree)}
            expandedKeys={expandedKeys}
            onExpand={(keys) => setExpandedKeys(keys as string[])}
            selectable={false}
            showLine={{ showLeafIcon: false }}
            showIcon
          />
        ) : (
          <Text type="secondary">暂无菜单权限数据</Text>
        )}
      </div>
    </Card>
  );

  // ─── Tab 3: API Permissions ───────────────────────────
  const flatPerms = flattenPermissions(profile?.roles);

  const apiColumns: ColumnsType<FlatPermission> = [
    {
      title: '权限名称',
      dataIndex: 'name',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: '权限代码',
      dataIndex: 'code',
      render: (text: string) => <Tag color="geekblue">{text}</Tag>,
    },
    {
      title: '来源角色',
      dataIndex: 'roleName',
      render: (text: string) => (
        <Tooltip title={`来自角色：${text}`}>
          <Tag color="blue">{text}</Tag>
        </Tooltip>
      ),
    },
  ];

  const ApiTab = () => (
    <Card
      className={styles.moduleCard}
      size="small"
      title={
        <>
          <ApiOutlined /> 接口权限
        </>
      }
    >
      {profile?.isSuperAdmin && (
        <div style={{ marginBottom: 12 }}>
          <Tag color="red">超级管理员</Tag>
          <Text type="secondary" style={{ fontSize: 12 }}>
            拥有全部权限 (*:*:*)
          </Text>
        </div>
      )}
      <Table
        columns={apiColumns}
        dataSource={flatPerms}
        rowKey="key"
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );

  // ─── Inner Tabs ───────────────────────────────────────
  const innerTabs = [
    {
      key: 'roles',
      label: (
        <span>
          <ApartmentOutlined /> 我的角色
        </span>
      ),
      children: <RolesTab />,
    },
    {
      key: 'menus',
      label: (
        <span>
          <MenuOutlined /> 菜单权限
        </span>
      ),
      children: <MenuTab />,
    },
    {
      key: 'apis',
      label: (
        <span>
          <ApiOutlined /> 接口权限
        </span>
      ),
      children: <ApiTab />,
    },
  ];

  return <Tabs items={innerTabs} />;
};

export default TabPermissions;

import {
  getPermissionById,
  queryPermissionFlat,
  scanPermissions,
  updatePermission,
} from '@/services/permission';
import { logger } from '@/utils';
import { useCallback, useState } from 'react';

/** 虚拟节点类型标记 */
type VirtualNodeType = 'DOMAIN' | 'RESOURCE' | 'ACTION';

/** 权限树节点（包含虚拟分组节点） */
export interface PermissionTreeNode extends API.PermissionResponseDto {
  nodeType: VirtualNodeType;
  isVirtual: boolean;
  children?: PermissionTreeNode[];
  /** 国际化 key，渲染时按需翻译 */
  intlId?: string;
}

/**
 * 将扁平权限列表按 code（domain:resource:action）转换为树形结构
 *
 * 层级：
 * - 第一层：domain（虚拟节点）
 * - 第二层：domain:resource（虚拟节点，默认展开）
 * - 第三层：action（真实权限数据）
 */
export function buildPermissionTree(
  list: API.PermissionResponseDto[],
): PermissionTreeNode[] {
  const domainMap = new Map<string, PermissionTreeNode>();

  for (const item of list) {
    const parts = item.code?.split(':') || [];
    if (parts.length < 2) continue;

    const [domain, resource] = parts;
    const resourceKey = `${domain}:${resource}`;

    // 创建或获取 domain 节点
    if (!domainMap.has(domain)) {
      domainMap.set(domain, {
        permissionId: `_domain_${domain}`,
        name: domain,
        intlId: `permission.domain.${domain}`,
        code: domain,
        httpMethod: '',
        origin: 'SYSTEM',
        createdAt: '',
        updatedAt: '',
        nodeType: 'DOMAIN',
        isVirtual: true,
        children: [],
      } as PermissionTreeNode);
    }
    const domainNode = domainMap.get(domain)!;

    // 创建或获取 resource 节点
    let resourceNode = domainNode.children!.find(
      (c) => c.permissionId === `_resource_${resourceKey}`,
    );
    if (!resourceNode) {
      resourceNode = {
        permissionId: `_resource_${resourceKey}`,
        name: resourceKey,
        intlId: `permission.resource.${resourceKey}`,
        code: resourceKey,
        httpMethod: '',
        origin: 'SYSTEM',
        createdAt: '',
        updatedAt: '',
        nodeType: 'RESOURCE',
        isVirtual: true,
        children: [],
      } as PermissionTreeNode;
      domainNode.children!.push(resourceNode);
    }

    // 添加 action 叶子节点
    const action = parts.slice(2).join(':');
    resourceNode.children!.push({
      ...item,
      intlId: `permission.action.${action}`,
      nodeType: 'ACTION',
      isVirtual: false,
    });
  }

  return Array.from(domainMap.values());
}

/**
 * 提取默认展开的节点 key（仅 domain 层级）
 */
export function getDefaultExpandedKeys(tree: PermissionTreeNode[]): string[] {
  return tree.map((domain) => domain.permissionId);
}

export function usePermissionModel() {
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);

  const fetchPermissionList = useCallback(async () => {
    const res = await queryPermissionFlat();
    if (res?.data) {
      const tree = buildPermissionTree(res.data);
      return { data: tree, total: res.data.length };
    }
    return { data: [] as PermissionTreeNode[], total: 0 };
  }, []);

  const fetchPermissionDetail = useCallback(async (permissionId: string) => {
    const { data } = await getPermissionById(permissionId);
    return data;
  }, []);

  const modifyPermission = useCallback(
    async (permissionId: string, data: API.UpdatePermissionDto) => {
      await updatePermission(permissionId, data);
    },
    [],
  );

  const syncPermissions = useCallback(async () => {
    setScanning(true);
    try {
      const res = await scanPermissions();
      return res;
    } catch (error) {
      logger.error(error);
      throw error;
    } finally {
      setScanning(false);
    }
  }, []);

  return {
    loading,
    setLoading,
    scanning,
    fetchPermissionList,
    fetchPermissionDetail,
    modifyPermission,
    syncPermissions,
  };
}

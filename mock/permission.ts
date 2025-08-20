import { sleep } from '@gvray/eskit';
import dayjs from 'dayjs';
import { Request, Response } from 'express';

// const uuid = () =>
//   'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
//     const r = (Math.random() * 16) | 0;
//     const v = c === 'x' ? r : (r & 0x3) | 0x8;
//     return v.toString(16);
//   });

// 模拟权限数据
const permissionData = new Map();
let index = 50;

// 预设的权限数据（操作权限点）
const permissionHierarchy = [
  // 仪表盘权限 (resourceId: 10)
  {
    permissionId: 1,
    name: '仪表盘查看',
    code: 'dashboard:view',
    type: 'view',
    description: '查看仪表盘权限',
    resourceId: 10,
    sort: 1,
    status: 'active',
  },
  // 用户管理权限 (resourceId: 4)
  {
    permissionId: 2,
    name: '用户查看',
    code: 'user:view',
    type: 'view',
    description: '查看用户列表权限',
    resourceId: 4,
    sort: 1,
    status: 'active',
  },
  {
    permissionId: 3,
    name: '用户创建',
    code: 'user:create',
    type: 'create',
    description: '创建用户权限',
    resourceId: 4,
    sort: 2,
    status: 'active',
  },
  {
    permissionId: 4,
    name: '用户编辑',
    code: 'user:update',
    type: 'update',
    description: '编辑用户权限',
    resourceId: 4,
    sort: 3,
    status: 'active',
  },
  {
    permissionId: 5,
    name: '用户删除',
    code: 'user:delete',
    type: 'delete',
    description: '删除用户权限',
    resourceId: 4,
    sort: 4,
    status: 'active',
  },
  {
    permissionId: 6,
    name: '用户导出',
    code: 'user:export',
    type: 'export',
    description: '导出用户数据权限',
    resourceId: 4,
    sort: 5,
    status: 'active',
  },
  // 角色管理权限 (resourceId: 5)
  {
    permissionId: 7,
    name: '角色查看',
    code: 'role:view',
    type: 'view',
    description: '查看角色列表权限',
    resourceId: 5,
    sort: 1,
    status: 'active',
  },
  {
    permissionId: 8,
    name: '角色创建',
    code: 'role:create',
    type: 'create',
    description: '创建角色权限',
    resourceId: 5,
    sort: 2,
    status: 'active',
  },
  {
    permissionId: 9,
    name: '角色编辑',
    code: 'role:update',
    type: 'update',
    description: '编辑角色权限',
    resourceId: 5,
    sort: 3,
    status: 'active',
  },
  {
    permissionId: 10,
    name: '角色删除',
    code: 'role:delete',
    type: 'delete',
    description: '删除角色权限',
    resourceId: 5,
    sort: 4,
    status: 'active',
  },
  {
    permissionId: 11,
    name: '角色授权',
    code: 'role:approve',
    type: 'approve',
    description: '角色授权权限',
    resourceId: 5,
    sort: 5,
    status: 'active',
  },
  // 权限管理权限 (resourceId: 6)
  {
    permissionId: 12,
    name: '权限查看',
    code: 'permission:view',
    type: 'view',
    description: '查看权限列表权限',
    resourceId: 6,
    sort: 1,
    status: 'active',
  },
  {
    permissionId: 13,
    name: '权限创建',
    code: 'permission:create',
    type: 'create',
    description: '创建权限权限',
    resourceId: 6,
    sort: 2,
    status: 'active',
  },
  {
    permissionId: 14,
    name: '权限编辑',
    code: 'permission:update',
    type: 'update',
    description: '编辑权限权限',
    resourceId: 6,
    sort: 3,
    status: 'active',
  },
  {
    permissionId: 15,
    name: '权限删除',
    code: 'permission:delete',
    type: 'delete',
    description: '删除权限权限',
    resourceId: 6,
    sort: 4,
    status: 'active',
  },

  // 部门管理权限 (resourceId: 7)
  {
    permissionId: 16,
    name: '部门查看',
    code: 'department:view',
    type: 'view',
    description: '查看部门列表权限',
    resourceId: 7,
    sort: 1,
    status: 'active',
  },
  {
    permissionId: 17,
    name: '部门创建',
    code: 'department:create',
    type: 'create',
    description: '创建部门权限',
    resourceId: 7,
    sort: 2,
    status: 'active',
  },
  {
    permissionId: 18,
    name: '部门编辑',
    code: 'department:update',
    type: 'update',
    description: '编辑部门权限',
    resourceId: 7,
    sort: 3,
    status: 'active',
  },
  {
    permissionId: 19,
    name: '部门删除',
    code: 'department:delete',
    type: 'delete',
    description: '删除部门权限',
    resourceId: 7,
    sort: 4,
    status: 'active',
  },

  // 职位管理权限 (resourceId: 8)
  {
    permissionId: 20,
    name: '职位查看',
    code: 'position:view',
    type: 'view',
    description: '查看职位列表权限',
    resourceId: 8,
    sort: 1,
    status: 'active',
  },
  {
    permissionId: 21,
    name: '职位创建',
    code: 'position:create',
    type: 'create',
    description: '创建职位权限',
    resourceId: 8,
    sort: 2,
    status: 'active',
  },
  {
    permissionId: 22,
    name: '职位编辑',
    code: 'position:update',
    type: 'update',
    description: '编辑职位权限',
    resourceId: 8,
    sort: 3,
    status: 'active',
  },
  {
    permissionId: 23,
    name: '职位删除',
    code: 'position:delete',
    type: 'delete',
    description: '删除职位权限',
    resourceId: 8,
    sort: 4,
    status: 'active',
  },

  // 资源管理权限 (resourceId: 9)
  {
    permissionId: 24,
    name: '资源查看',
    code: 'resource:view',
    type: 'view',
    description: '查看资源列表权限',
    resourceId: 9,
    sort: 1,
    status: 'active',
  },
  {
    permissionId: 25,
    name: '资源上传',
    code: 'resource:import',
    type: 'import',
    description: '上传资源权限',
    resourceId: 9,
    sort: 2,
    status: 'active',
  },
  {
    permissionId: 26,
    name: '资源下载',
    code: 'resource:export',
    type: 'export',
    description: '下载资源权限',
    resourceId: 9,
    sort: 3,
    status: 'active',
  },
  {
    permissionId: 27,
    name: '资源删除',
    code: 'resource:delete',
    type: 'delete',
    description: '删除资源权限',
    resourceId: 9,
    sort: 4,
    status: 'active',
  },

  // 个人中心权限 (resourceId: 11)
  {
    permissionId: 28,
    name: '个人资料查看',
    code: 'profile:view',
    type: 'view',
    description: '查看个人资料权限',
    resourceId: 11,
    sort: 1,
    status: 'active',
  },
  {
    permissionId: 29,
    name: '个人资料编辑',
    code: 'profile:update',
    type: 'update',
    description: '编辑个人资料权限',
    resourceId: 11,
    sort: 2,
    status: 'active',
  },

  // 基础设置权限 (resourceId: 13)
  {
    permissionId: 30,
    name: '基础设置查看',
    code: 'config:view',
    type: 'view',
    description: '查看基础设置权限',
    resourceId: 13,
    sort: 1,
    status: 'active',
  },
  {
    permissionId: 31,
    name: '基础设置编辑',
    code: 'config:update',
    type: 'update',
    description: '编辑基础设置权限',
    resourceId: 13,
    sort: 2,
    status: 'active',
  },

  // 参数配置权限 (resourceId: 14)
  {
    permissionId: 32,
    name: '参数配置查看',
    code: 'params:view',
    type: 'view',
    description: '查看参数配置权限',
    resourceId: 14,
    sort: 1,
    status: 'active',
  },
  {
    permissionId: 33,
    name: '参数配置编辑',
    code: 'params:update',
    type: 'update',
    description: '编辑参数配置权限',
    resourceId: 14,
    sort: 2,
    status: 'active',
  },
];

// 资源名称映射
const resourceNames = {
  4: '用户管理',
  5: '角色管理',
  6: '权限管理',
  7: '部门管理',
  8: '职位管理',
  9: '资源管理',
  10: '仪表盘',
  11: '个人中心',
  13: '基础设置',
  14: '参数配置',
};

// 初始化权限数据
permissionHierarchy.forEach((perm) => {
  const permission = {
    ...perm,
    resourceName: resourceNames[perm.resourceId] || '',
    createdAt: dayjs()
      .subtract(Math.floor(Math.random() * 60), 'day')
      .format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: dayjs()
      .subtract(Math.floor(Math.random() * 15), 'day')
      .format('YYYY-MM-DD HH:mm:ss'),
    createdBy: 'admin',
  };
  permissionData.set(perm.permissionId, permission);
});

// 按资源分组权限的辅助函数
function groupPermissionsByResource(permissions: any[]): any[] {
  const resourceGroups = new Map();

  permissions.forEach((perm) => {
    if (!resourceGroups.has(perm.resourceId)) {
      resourceGroups.set(perm.resourceId, {
        resourceId: perm.resourceId,
        resourceName: perm.resourceName,
        permissions: [],
      });
    }
    resourceGroups.get(perm.resourceId).permissions.push(perm);
  });

  return Array.from(resourceGroups.values()).map((group) => ({
    ...group,
    permissions: group.permissions.sort((a, b) => a.sort - b.sort),
  }));
}

// 权限检查的用户权限映射（模拟）
const userPermissions = new Map();
userPermissions.set(1, [
  'dashboard:view',
  'user:view',
  'user:create',
  'user:update',
  'user:export',
  'role:view',
  'role:create',
  'profile:view',
  'profile:update',
]);
userPermissions.set(2, ['dashboard:view', 'profile:view', 'profile:update']);

export default {
  // 获取权限分组（按资源分组）- 必须在参数路由之前
  'GET /api/system/permissions/groups': async (req: Request, res: Response) => {
    const { type } = req.query;
    await sleep(300);

    let permissions = [...permissionData.values()];

    // 按类型过滤
    if (type) {
      permissions = permissions.filter((perm) => perm.type === type);
    }

    const groups = groupPermissionsByResource(permissions);

    res.json({
      success: true,
      data: groups,
    });
  },

  // 按资源获取权限列表 - 必须在参数路由之前
  'GET /api/system/resources/:resourceId/permissions': async (
    req: Request,
    res: Response,
  ) => {
    const { resourceId } = req.params;
    await sleep(300);

    const permissions = [...permissionData.values()]
      .filter((perm) => perm.resourceId === Number(resourceId))
      .sort((a, b) => a.sort - b.sort);

    res.json({
      success: true,
      data: permissions,
    });
  },

  // 获取权限统计信息 - 必须在参数路由之前
  'GET /api/system/permissions/stats': async (req: Request, res: Response) => {
    await sleep(200);

    const permissions = [...permissionData.values()];
    const stats = {
      total: permissions.length,
      active: permissions.filter((p) => p.status === 'active').length,
      inactive: permissions.filter((p) => p.status === 'inactive').length,
      byType: [
        {
          type: 'view',
          name: '查看权限',
          count: permissions.filter((p) => p.type === 'view').length,
        },
        {
          type: 'create',
          name: '创建权限',
          count: permissions.filter((p) => p.type === 'create').length,
        },
        {
          type: 'update',
          name: '编辑权限',
          count: permissions.filter((p) => p.type === 'update').length,
        },
        {
          type: 'delete',
          name: '删除权限',
          count: permissions.filter((p) => p.type === 'delete').length,
        },
        {
          type: 'export',
          name: '导出权限',
          count: permissions.filter((p) => p.type === 'export').length,
        },
        {
          type: 'import',
          name: '导入权限',
          count: permissions.filter((p) => p.type === 'import').length,
        },
        {
          type: 'approve',
          name: '审批权限',
          count: permissions.filter((p) => p.type === 'approve').length,
        },
      ],
      byResource: Object.entries(resourceNames).map(
        ([resourceId, resourceName]) => ({
          resourceId: Number(resourceId),
          resourceName,
          count: permissions.filter((p) => p.resourceId === Number(resourceId))
            .length,
        }),
      ),
    };

    res.json({
      success: true,
      data: stats,
    });
  },

  // 搜索权限 - 必须在参数路由之前
  'GET /api/system/permissions/search': async (req: Request, res: Response) => {
    const { keyword } = req.query;
    await sleep(300);

    if (!keyword) {
      res.json({
        success: true,
        data: [],
      });
      return;
    }

    const permissions = [...permissionData.values()].filter(
      (item) =>
        item.name.includes(keyword as string) ||
        item.code.includes(keyword as string) ||
        item.description?.includes(keyword as string),
    );

    res.json({
      success: true,
      data: permissions,
    });
  },

  // 批量删除权限 - 必须在参数路由之前
  'POST /api/system/permissions/batch-delete': async (
    req: Request,
    res: Response,
  ) => {
    const { ids } = req.body;
    await sleep(400);

    if (!Array.isArray(ids) || ids.length === 0) {
      res.json({
        success: false,
        code: 400,
        message: '请选择要删除的权限',
        data: null,
        showType: 2,
      });
      return;
    }

    // 检查是否有子权限
    for (const id of ids) {
      const hasChildren = [...permissionData.values()].some(
        (perm) => perm.parentId === Number(id),
      );
      if (hasChildren) {
        const perm = permissionData.get(Number(id));
        res.json({
          success: false,
          code: 400,
          message: `权限"${perm?.name}"下存在子权限，无法删除`,
          data: null,
          showType: 2,
        });
        return;
      }
    }

    let deletedCount = 0;
    ids.forEach((id) => {
      if (permissionData.has(Number(id))) {
        permissionData.delete(Number(id));
        deletedCount++;
      }
    });

    res.json({
      success: true,
      data: { deletedCount },
      message: `成功删除 ${deletedCount} 个权限`,
    });
  },

  // 检查权限 - 必须在参数路由之前
  'POST /api/system/permissions/check': async (req: Request, res: Response) => {
    const { permissionCode } = req.body;
    await sleep(200);

    // 模拟当前用户ID为1
    const currentUserId = 1;
    const userPerms = userPermissions.get(currentUserId) || [];
    const hasPermission = userPerms.includes(permissionCode);

    res.json({
      success: true,
      data: {
        permissionCode,
        hasPermission,
        userId: currentUserId,
      },
    });
  },

  // 批量检查权限 - 必须在参数路由之前
  'POST /api/system/permissions/batch-check': async (
    req: Request,
    res: Response,
  ) => {
    const { permissionCodes } = req.body;
    await sleep(300);

    if (!Array.isArray(permissionCodes)) {
      res.json({
        success: false,
        code: 400,
        message: '权限码必须是数组',
        data: null,
        showType: 2,
      });
      return;
    }

    // 模拟当前用户ID为1
    const currentUserId = 1;
    const userPerms = userPermissions.get(currentUserId) || [];

    const result = permissionCodes.map((code) => ({
      permissionCode: code,
      hasPermission: userPerms.includes(code),
    }));

    res.json({
      success: true,
      data: {
        userId: currentUserId,
        permissions: result,
      },
    });
  },

  // 获取权限列表
  'GET /api/system/permissions': async (req: Request, res: Response) => {
    const {
      current = 1,
      pageSize = 10,
      name,
      code,
      type,
      parentId,
      level,
      status,
      sortField,
      sortOrder,
    } = req.query;
    await sleep(300);

    let permissions = [...permissionData.values()];

    // 筛选
    if (name) {
      permissions = permissions.filter((item) =>
        item.name.includes(name as string),
      );
    }
    if (code) {
      permissions = permissions.filter((item) =>
        item.code.includes(code as string),
      );
    }
    if (type) {
      permissions = permissions.filter((item) => item.type === type);
    }
    if (parentId !== undefined) {
      permissions = permissions.filter(
        (item) => item.parentId === Number(parentId),
      );
    }
    if (level) {
      permissions = permissions.filter((item) => item.level === Number(level));
    }
    if (status) {
      permissions = permissions.filter((item) => item.status === status);
    }

    // 排序
    if (sortField && sortOrder) {
      permissions.sort((a, b) => {
        const valueA = a[sortField as keyof typeof a];
        const valueB = b[sortField as keyof typeof b];
        if (sortOrder === 'ascend') {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });
    } else {
      // 默认按sort字段排序
      permissions.sort((a, b) => a.sort - b.sort);
    }

    // 分页
    const total = permissions.length;
    const start = (Number(current) - 1) * Number(pageSize);
    const end = start + Number(pageSize);
    const data = permissions.slice(start, end);

    res.json({
      success: true,
      data: {
        records: data,
        total,
        current: Number(current),
        pageSize: Number(pageSize),
      },
    });
  },

  // 获取单个权限详情
  'GET /api/system/permissions/:id': async (req: Request, res: Response) => {
    const { id } = req.params;
    await sleep(200);

    const permission = permissionData.get(Number(id));
    if (!permission) {
      res.status(404).json({
        success: false,
        code: 404,
        message: '权限不存在',
        data: null,
      });
      return;
    }

    res.json({
      success: true,
      data: permission,
    });
  },

  // 创建权限
  'POST /api/system/permissions': async (req: Request, res: Response) => {
    const {
      name,
      code,
      type,
      description,
      parentId,
      sort,
      path,
      method,
      icon,
      component,
      redirect,
      hidden,
      status,
      resourceIds,
    } = req.body;
    await sleep(500);

    // 检查编码是否重复
    const existingPermission = [...permissionData.values()].find(
      (item) => item.code === code,
    );
    if (existingPermission) {
      res.json({
        success: false,
        code: 400,
        message: '权限编码已存在',
        data: null,
        showType: 2,
      });
      return;
    }

    const newPermissionId = index + 1;
    index += 1;

    // 计算权限级别
    let level = 1;
    if (parentId) {
      const parentPerm = permissionData.get(Number(parentId));
      if (parentPerm) {
        level = parentPerm.level + 1;
      }
    }

    // 获取父权限名称
    let parentName = '';
    if (parentId) {
      const parentPerm = permissionData.get(Number(parentId));
      if (parentPerm) {
        parentName = parentPerm.name;
      }
    }

    const newPermission = {
      permissionId: newPermissionId,
      name,
      code,
      type,
      description,
      parentId: parentId || null,
      parentName,
      level,
      sort: sort || 1,
      path,
      method,
      icon,
      component,
      redirect,
      hidden: hidden || false,
      status: status || 'active',
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      createdBy: 'admin',
      resourceIds: resourceIds || [],
    };

    permissionData.set(newPermissionId, newPermission);

    res.json({
      success: true,
      data: newPermission,
      message: '权限创建成功',
    });
  },

  // 更新权限
  'PATCH /api/system/permissions/:id': async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    await sleep(400);

    const permission = permissionData.get(Number(id));
    if (!permission) {
      res.status(404).json({
        success: false,
        code: 404,
        message: '权限不存在',
        data: null,
      });
      return;
    }

    // 如果更新编码，检查是否重复
    if (updateData.code && updateData.code !== permission.code) {
      const existingPermission = [...permissionData.values()].find(
        (item) => item.code === updateData.code,
      );
      if (existingPermission) {
        res.json({
          success: false,
          code: 400,
          message: '权限编码已存在',
          data: null,
          showType: 2,
        });
        return;
      }
    }

    // 更新父权限信息
    if (updateData.parentId !== undefined) {
      if (updateData.parentId) {
        const parentPerm = permissionData.get(Number(updateData.parentId));
        if (parentPerm) {
          updateData.parentName = parentPerm.name;
          updateData.level = parentPerm.level + 1;
        }
      } else {
        updateData.parentName = '';
        updateData.level = 1;
      }
    }

    const updatedPermission = {
      ...permission,
      ...updateData,
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };

    permissionData.set(Number(id), updatedPermission);

    res.json({
      success: true,
      data: updatedPermission,
      message: '权限更新成功',
    });
  },

  // 删除权限
  'DELETE /api/system/permissions/:id': async (req: Request, res: Response) => {
    const { id } = req.params;
    await sleep(300);

    const permission = permissionData.get(Number(id));
    if (!permission) {
      res.status(404).json({
        success: false,
        code: 404,
        message: '权限不存在',
        data: null,
      });
      return;
    }

    // 检查是否有子权限
    const hasChildren = [...permissionData.values()].some(
      (perm) => perm.parentId === Number(id),
    );
    if (hasChildren) {
      res.json({
        success: false,
        code: 400,
        message: '该权限下存在子权限，无法删除',
        data: null,
        showType: 2,
      });
      return;
    }

    permissionData.delete(Number(id));

    res.json({
      success: true,
      data: null,
      message: '权限删除成功',
    });
  },

  // 更新权限状态
  'PATCH /api/system/permissions/:id/status': async (
    req: Request,
    res: Response,
  ) => {
    const { id } = req.params;
    const { status } = req.body;
    await sleep(300);

    const permission = permissionData.get(Number(id));
    if (!permission) {
      res.status(404).json({
        success: false,
        code: 404,
        message: '权限不存在',
        data: null,
      });
      return;
    }

    const updatedPermission = {
      ...permission,
      status,
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };

    permissionData.set(Number(id), updatedPermission);

    res.json({
      success: true,
      data: updatedPermission,
      message: `权限状态${status === 'active' ? '启用' : '禁用'}成功`,
    });
  },

  // 移动权限到新的父权限
  'PATCH /api/system/permissions/:id/move': async (
    req: Request,
    res: Response,
  ) => {
    const { id } = req.params;
    const { parentId } = req.body;
    await sleep(400);

    const permission = permissionData.get(Number(id));
    if (!permission) {
      res.status(404).json({
        success: false,
        code: 404,
        message: '权限不存在',
        data: null,
      });
      return;
    }

    // 检查是否移动到自己的子权限
    if (parentId) {
      const targetParent = permissionData.get(Number(parentId));
      if (!targetParent) {
        res.json({
          success: false,
          code: 400,
          message: '目标父权限不存在',
          data: null,
          showType: 2,
        });
        return;
      }

      if (Number(parentId) === Number(id)) {
        res.json({
          success: false,
          code: 400,
          message: '不能将权限移动到自己',
          data: null,
          showType: 2,
        });
        return;
      }
    }

    // 更新权限信息
    let parentName = '';
    let level = 1;
    if (parentId) {
      const parentPerm = permissionData.get(Number(parentId));
      if (parentPerm) {
        parentName = parentPerm.name;
        level = parentPerm.level + 1;
      }
    }

    const updatedPermission = {
      ...permission,
      parentId: parentId || null,
      parentName,
      level,
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };

    permissionData.set(Number(id), updatedPermission);

    res.json({
      success: true,
      data: updatedPermission,
      message: '权限移动成功',
    });
  },

  // 更新权限排序
  'PATCH /api/system/permissions/:id/sort': async (
    req: Request,
    res: Response,
  ) => {
    const { id } = req.params;
    const { sort } = req.body;
    await sleep(300);

    const permission = permissionData.get(Number(id));
    if (!permission) {
      res.status(404).json({
        success: false,
        code: 404,
        message: '权限不存在',
        data: null,
      });
      return;
    }

    const updatedPermission = {
      ...permission,
      sort,
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };

    permissionData.set(Number(id), updatedPermission);

    res.json({
      success: true,
      data: updatedPermission,
      message: '权限排序更新成功',
    });
  },

  // 获取子权限列表
  'GET /api/system/permissions/:id/children': async (
    req: Request,
    res: Response,
  ) => {
    const { id } = req.params;
    await sleep(300);

    const permission = permissionData.get(Number(id));
    if (!permission) {
      res.status(404).json({
        success: false,
        code: 404,
        message: '权限不存在',
        data: null,
      });
      return;
    }

    const children = [...permissionData.values()]
      .filter((perm) => perm.parentId === Number(id))
      .sort((a, b) => a.sort - b.sort);

    res.json({
      success: true,
      data: children,
    });
  },

  // 获取用户权限
  'GET /api/system/users/:userId/permissions': async (
    req: Request,
    res: Response,
  ) => {
    const { userId } = req.params;
    await sleep(300);

    const userPerms = userPermissions.get(Number(userId)) || [];
    const permissions = [...permissionData.values()].filter((perm) =>
      userPerms.includes(perm.code),
    );

    res.json({
      success: true,
      data: permissions,
    });
  },

  // 获取角色权限
  'GET /api/system/roles/:roleId/permissions': async (
    req: Request,
    res: Response,
  ) => {
    const { roleId } = req.params;
    await sleep(300);

    // 模拟角色权限映射
    const rolePermissions = new Map();
    rolePermissions.set(1, [
      'system',
      'system:user',
      'system:user:list',
      'system:user:add',
      'system:role',
      'system:role:list',
      'dashboard',
    ]);
    rolePermissions.set(2, ['dashboard', 'profile']);

    const rolePerms = rolePermissions.get(Number(roleId)) || [];
    const permissions = [...permissionData.values()].filter((perm) =>
      rolePerms.includes(perm.code),
    );

    res.json({
      success: true,
      data: permissions,
    });
  },

  // 分配角色权限
  'PUT /api/system/roles/:roleId/permissions': async (
    req: Request,
    res: Response,
  ) => {
    const { roleId } = req.params;
    const { permissionIds } = req.body;
    await sleep(400);

    if (!Array.isArray(permissionIds)) {
      res.json({
        success: false,
        code: 400,
        message: '权限ID列表必须是数组',
        data: null,
        showType: 2,
      });
      return;
    }

    // 模拟保存角色权限
    res.json({
      success: true,
      data: {
        roleId: Number(roleId),
        permissionIds,
        assignedCount: permissionIds.length,
      },
      message: `成功为角色分配 ${permissionIds.length} 个权限`,
    });
  },

  // 批量创建资源的标准权限
  'POST /api/system/permissions/batch-create': async (
    req: Request,
    res: Response,
  ) => {
    const { resourceId, permissionTypes } = req.body;
    await sleep(500);

    if (!resourceId || !Array.isArray(permissionTypes)) {
      res.json({
        success: false,
        code: 400,
        message: '参数错误',
        data: null,
        showType: 2,
      });
      return;
    }

    const resourceName = resourceNames[resourceId] || '';
    if (!resourceName) {
      res.json({
        success: false,
        code: 400,
        message: '资源不存在',
        data: null,
        showType: 2,
      });
      return;
    }

    const typeNames = {
      view: '查看',
      create: '创建',
      update: '编辑',
      delete: '删除',
    };

    const createdPermissions = [];
    permissionTypes.forEach((type, index) => {
      const newPermissionId = index + 100; // 避免ID冲突
      // eslint-disable-next-line no-param-reassign
      index += 1;

      const newPermission = {
        permissionId: newPermissionId,
        name: `${resourceName}${typeNames[type] || type}`,
        code: `${resourceName.toLowerCase()}:${type}`,
        type,
        description: `${typeNames[type] || type}${resourceName}权限`,
        resourceId: Number(resourceId),
        resourceName,
        sort: index + 1,
        status: 'active',
        createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        createdBy: 'admin',
      };

      permissionData.set(newPermissionId, newPermission);
      createdPermissions.push(newPermission);
    });

    res.json({
      success: true,
      data: createdPermissions,
      message: `成功为${resourceName}创建 ${permissionTypes.length} 个权限`,
    });
  },
};

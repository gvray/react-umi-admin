import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { sleep } from 'ts-copilot';

// 模拟资源数据（目录和菜单）
const resourceData = new Map();
let index = 20;

// 预设的资源层级结构（目录和菜单）
const resourceHierarchy = [
  // 一级目录
  {
    resourceId: 1,
    name: '系统管理',
    type: 'directory',
    path: '/system',
    icon: 'SettingOutlined',
    parentId: null,
    level: 1,
    sort: 1,
    status: 'active',
    hidden: false,
    description: '系统管理模块目录',
  },
  {
    resourceId: 2,
    name: '组织管理',
    type: 'directory',
    path: '/organization',
    icon: 'ApartmentOutlined',
    parentId: null,
    level: 1,
    sort: 2,
    status: 'active',
    hidden: false,
    description: '组织管理模块目录',
  },
  {
    resourceId: 3,
    name: '资源管理',
    type: 'directory',
    path: '/resource',
    icon: 'FolderOutlined',
    parentId: null,
    level: 1,
    sort: 3,
    status: 'active',
    hidden: false,
    description: '资源管理模块目录',
  },

  // 系统管理下的菜单
  {
    resourceId: 4,
    name: '用户管理',
    type: 'menu',
    path: '/system/user',
    icon: 'UserOutlined',
    component: 'system/user/index',
    parentId: 1,
    level: 2,
    sort: 1,
    status: 'active',
    hidden: false,
    description: '用户管理页面',
  },
  {
    resourceId: 5,
    name: '角色管理',
    type: 'menu',
    path: '/system/role',
    icon: 'TeamOutlined',
    component: 'system/role/index',
    parentId: 1,
    level: 2,
    sort: 2,
    status: 'active',
    hidden: false,
    description: '角色管理页面',
  },
  {
    resourceId: 6,
    name: '权限管理',
    type: 'menu',
    path: '/system/permission',
    icon: 'SafetyOutlined',
    component: 'system/permission/index',
    parentId: 1,
    level: 2,
    sort: 3,
    status: 'active',
    hidden: false,
    description: '权限管理页面',
  },

  // 组织管理下的菜单
  {
    resourceId: 7,
    name: '部门管理',
    type: 'menu',
    path: '/organization/department',
    icon: 'BankOutlined',
    component: 'organization/department/index',
    parentId: 2,
    level: 2,
    sort: 1,
    status: 'active',
    hidden: false,
    description: '部门管理页面',
  },
  {
    resourceId: 8,
    name: '职位管理',
    type: 'menu',
    path: '/organization/position',
    icon: 'IdcardOutlined',
    component: 'organization/position/index',
    parentId: 2,
    level: 2,
    sort: 2,
    status: 'active',
    hidden: false,
    description: '职位管理页面',
  },

  // 资源管理下的菜单
  {
    resourceId: 9,
    name: '资源列表',
    type: 'menu',
    path: '/resource/list',
    icon: 'FileOutlined',
    component: 'resource/list/index',
    parentId: 3,
    level: 2,
    sort: 1,
    status: 'active',
    hidden: false,
    description: '资源列表页面',
  },

  // 顶级菜单
  {
    resourceId: 10,
    name: '仪表盘',
    type: 'menu',
    path: '/dashboard',
    icon: 'DashboardOutlined',
    component: 'dashboard/index',
    parentId: null,
    level: 1,
    sort: 0,
    status: 'active',
    hidden: false,
    description: '仪表盘页面',
  },
  {
    resourceId: 11,
    name: '个人中心',
    type: 'menu',
    path: '/profile',
    icon: 'UserOutlined',
    component: 'profile/index',
    parentId: null,
    level: 1,
    sort: 99,
    status: 'active',
    hidden: false,
    description: '个人中心页面',
  },

  // 二级目录示例
  {
    resourceId: 12,
    name: '系统配置',
    type: 'directory',
    path: '/system/config',
    icon: 'SettingOutlined',
    parentId: 1,
    level: 2,
    sort: 99,
    status: 'active',
    hidden: false,
    description: '系统配置目录',
  },
  {
    resourceId: 13,
    name: '基础设置',
    type: 'menu',
    path: '/system/config/basic',
    icon: 'SettingOutlined',
    component: 'system/config/basic',
    parentId: 12,
    level: 3,
    sort: 1,
    status: 'active',
    hidden: false,
    description: '基础设置页面',
  },
  {
    resourceId: 14,
    name: '参数配置',
    type: 'menu',
    path: '/system/config/params',
    icon: 'ControlOutlined',
    component: 'system/config/params',
    parentId: 12,
    level: 3,
    sort: 2,
    status: 'active',
    hidden: false,
    description: '参数配置页面',
  },
];

// 初始化资源数据
resourceHierarchy.forEach((resource) => {
  const resourceWithMeta = {
    ...resource,
    parentName: resource.parentId
      ? resourceHierarchy.find((r) => r.resourceId === resource.parentId)
          ?.name || ''
      : '',
    createdAt: dayjs()
      .subtract(Math.floor(Math.random() * 60), 'day')
      .format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: dayjs()
      .subtract(Math.floor(Math.random() * 15), 'day')
      .format('YYYY-MM-DD HH:mm:ss'),
    createdBy: 'admin',
  };
  resourceData.set(resource.resourceId, resourceWithMeta);
});

// 构建树形结构的辅助函数
function buildResourceTree(
  resources: any[],
  parentId: number | null = null,
): any[] {
  return resources
    .filter((resource) => resource.parentId === parentId)
    .map((resource) => ({
      ...resource,
      children: buildResourceTree(resources, resource.resourceId),
    }));
}

export default {
  // 获取资源树结构 - 必须在参数路由之前
  'GET /api/resources/tree': async (req: Request, res: Response) => {
    await sleep(300);

    const resources = [...resourceData.values()];
    const tree = buildResourceTree(resources);

    res.json({
      success: true,
      data: tree,
    });
  },

  // 获取菜单资源树 - 必须在参数路由之前
  'GET /api/resources/menus': async (req: Request, res: Response) => {
    await sleep(300);

    const resources = [...resourceData.values()];
    const tree = buildResourceTree(resources);

    res.json({
      success: true,
      data: tree,
    });
  },

  // 搜索资源 - 必须在参数路由之前
  'GET /api/resources/search': async (req: Request, res: Response) => {
    const { keyword } = req.query;
    await sleep(300);

    if (!keyword) {
      res.json({
        success: true,
        data: [],
      });
      return;
    }

    const resources = [...resourceData.values()].filter(
      (item) =>
        item.name.includes(keyword as string) ||
        item.path?.includes(keyword as string) ||
        item.description?.includes(keyword as string),
    );

    res.json({
      success: true,
      data: resources,
    });
  },

  // 批量删除资源 - 必须在参数路由之前
  'POST /api/resources/batch-delete': async (req: Request, res: Response) => {
    const { ids } = req.body;
    await sleep(400);

    if (!Array.isArray(ids) || ids.length === 0) {
      res.json({
        success: false,
        code: 400,
        message: '请选择要删除的资源',
        data: null,
        showType: 2,
      });
      return;
    }

    // 检查是否有子资源
    for (const id of ids) {
      const hasChildren = [...resourceData.values()].some(
        (resource) => resource.parentId === Number(id),
      );
      if (hasChildren) {
        const resource = resourceData.get(Number(id));
        res.json({
          success: false,
          code: 400,
          message: `资源"${resource?.name}"下存在子资源，无法删除`,
          data: null,
          showType: 2,
        });
        return;
      }
    }

    let deletedCount = 0;
    ids.forEach((id) => {
      if (resourceData.has(Number(id))) {
        resourceData.delete(Number(id));
        deletedCount++;
      }
    });

    res.json({
      success: true,
      data: { deletedCount },
      message: `成功删除 ${deletedCount} 个资源`,
    });
  },

  // 获取资源列表
  'GET /api/resources': async (req: Request, res: Response) => {
    const {
      current = 1,
      pageSize = 10,
      name,
      type,
      parentId,
      level,
      status,
      sortField,
      sortOrder,
    } = req.query;
    await sleep(300);

    let resources = [...resourceData.values()];

    // 筛选
    if (name) {
      resources = resources.filter((item) =>
        item.name.includes(name as string),
      );
    }
    if (type) {
      resources = resources.filter((item) => item.type === type);
    }
    if (parentId !== undefined) {
      resources = resources.filter(
        (item) => item.parentId === Number(parentId),
      );
    }
    if (level) {
      resources = resources.filter((item) => item.level === Number(level));
    }
    if (status) {
      resources = resources.filter((item) => item.status === status);
    }

    // 排序
    if (sortField && sortOrder) {
      resources.sort((a, b) => {
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
      resources.sort((a, b) => a.sort - b.sort);
    }

    // 分页
    const total = resources.length;
    const start = (Number(current) - 1) * Number(pageSize);
    const end = start + Number(pageSize);
    const data = resources.slice(start, end);

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

  // 获取单个资源详情
  'GET /api/resources/:id': async (req: Request, res: Response) => {
    const { id } = req.params;
    await sleep(200);

    const resource = resourceData.get(Number(id));
    if (!resource) {
      res.status(404).json({
        success: false,
        code: 404,
        message: '资源不存在',
        data: null,
      });
      return;
    }

    res.json({
      success: true,
      data: resource,
    });
  },

  // 创建资源
  'POST /api/resources': async (req: Request, res: Response) => {
    const {
      name,
      type,
      path,
      icon,
      component,
      parentId,
      sort,
      description,
      status,
      hidden,
    } = req.body;
    await sleep(500);

    // 检查路径是否重复
    if (path) {
      const existingResource = [...resourceData.values()].find(
        (item) => item.path === path,
      );
      if (existingResource) {
        res.json({
          success: false,
          code: 400,
          message: '资源路径已存在',
          data: null,
          showType: 2,
        });
        return;
      }
    }

    const newResourceId = index + 1;
    index += 1;

    // 计算资源级别
    let level = 1;
    if (parentId) {
      const parentResource = resourceData.get(Number(parentId));
      if (parentResource) {
        level = parentResource.level + 1;
      }
    }

    // 获取父资源名称
    let parentName = '';
    if (parentId) {
      const parentResource = resourceData.get(Number(parentId));
      if (parentResource) {
        parentName = parentResource.name;
      }
    }

    const newResource = {
      resourceId: newResourceId,
      name,
      type,
      path,
      icon,
      component,
      parentId: parentId || null,
      parentName,
      level,
      sort: sort || 1,
      description,
      status: status || 'active',
      hidden: hidden || false,
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      createdBy: 'admin',
    };

    resourceData.set(newResourceId, newResource);

    res.json({
      success: true,
      data: newResource,
      message: '资源创建成功',
    });
  },

  // 更新资源
  'PATCH /api/resources/:id': async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    await sleep(400);

    const resource = resourceData.get(Number(id));
    if (!resource) {
      res.status(404).json({
        success: false,
        code: 404,
        message: '资源不存在',
        data: null,
      });
      return;
    }

    // 如果更新路径，检查是否重复
    if (updateData.path && updateData.path !== resource.path) {
      const existingResource = [...resourceData.values()].find(
        (item) => item.path === updateData.path,
      );
      if (existingResource) {
        res.json({
          success: false,
          code: 400,
          message: '资源路径已存在',
          data: null,
          showType: 2,
        });
        return;
      }
    }

    // 更新父资源信息
    if (updateData.parentId !== undefined) {
      if (updateData.parentId) {
        const parentResource = resourceData.get(Number(updateData.parentId));
        if (parentResource) {
          updateData.parentName = parentResource.name;
          updateData.level = parentResource.level + 1;
        }
      } else {
        updateData.parentName = '';
        updateData.level = 1;
      }
    }

    const updatedResource = {
      ...resource,
      ...updateData,
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };

    resourceData.set(Number(id), updatedResource);

    res.json({
      success: true,
      data: updatedResource,
      message: '资源更新成功',
    });
  },

  // 删除资源
  'DELETE /api/resources/:id': async (req: Request, res: Response) => {
    const { id } = req.params;
    await sleep(300);

    const resource = resourceData.get(Number(id));
    if (!resource) {
      res.status(404).json({
        success: false,
        code: 404,
        message: '资源不存在',
        data: null,
      });
      return;
    }

    // 检查是否有子资源
    const hasChildren = [...resourceData.values()].some(
      (res) => res.parentId === Number(id),
    );
    if (hasChildren) {
      res.json({
        success: false,
        code: 400,
        message: '该资源下存在子资源，无法删除',
        data: null,
        showType: 2,
      });
      return;
    }

    resourceData.delete(Number(id));

    res.json({
      success: true,
      data: null,
      message: '资源删除成功',
    });
  },

  // 获取资源下的权限列表
  'GET /api/resources/:id/permissions': async (req: Request, res: Response) => {
    const { id } = req.params;
    await sleep(300);

    const resource = resourceData.get(Number(id));
    if (!resource) {
      res.status(404).json({
        success: false,
        code: 404,
        message: '资源不存在',
        data: null,
      });
      return;
    }

    // 模拟该资源下的权限
    const permissions = [
      {
        permissionId: 1,
        name: `${resource.name}查看`,
        code: `${resource.name.toLowerCase()}:view`,
        type: 'view',
        resourceId: Number(id),
        resourceName: resource.name,
        sort: 1,
        status: 'active',
      },
      {
        permissionId: 2,
        name: `${resource.name}创建`,
        code: `${resource.name.toLowerCase()}:create`,
        type: 'create',
        resourceId: Number(id),
        resourceName: resource.name,
        sort: 2,
        status: 'active',
      },
      {
        permissionId: 3,
        name: `${resource.name}编辑`,
        code: `${resource.name.toLowerCase()}:update`,
        type: 'update',
        resourceId: Number(id),
        resourceName: resource.name,
        sort: 3,
        status: 'active',
      },
      {
        permissionId: 4,
        name: `${resource.name}删除`,
        code: `${resource.name.toLowerCase()}:delete`,
        type: 'delete',
        resourceId: Number(id),
        resourceName: resource.name,
        sort: 4,
        status: 'active',
      },
    ];

    res.json({
      success: true,
      data: permissions,
    });
  },
};

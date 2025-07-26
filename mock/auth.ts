import { Request, Response } from 'express';
import { sleep } from 'ts-copilot';

export default {
  'POST /api/auth/login': async (req: Request, res: Response) => {
    const { password, account } = req.body;
    await sleep(2000);
    if (
      password === 'admin123' &&
      (account === 'admin@example.com' ||
        account === 'admin' ||
        account === '13800138000')
    ) {
      res.send({
        success: true,
        code: 200,
        message: '登陆成功',
        data: {
          access_token: 'admin',
          refresh_token: 'admin',
        },
      });
      return;
    }
    if (
      password === 'admin123' &&
      (account === 'user@example.com' ||
        account === 'user' ||
        account === '13800013800')
    ) {
      res.send({
        success: true,
        code: 200,
        message: '登陆成功',
        data: {
          access_token: 'user',
          refresh_token: 'user',
        },
      });
      return;
    }

    res.send({
      success: false,
      code: 500,
      message: '用户不存在/密码错误',
    });
  },
  'POST /api/auth/logout': async (req: Request, res: Response) => {
    res.send({
      success: true,
      code: 200,
      message: '退出成功',
    });
  },
  'GET /api/auth/profile': async (req: Request, res: Response) => {
    const authorizationHeader = req.headers['authorization'];
    // avatar: 'https://api.dicebear.com/9.x/bottts/svg?seed=GavinRay'
    if (authorizationHeader) {
      const token = authorizationHeader.split(' ')[1];
      if (token === 'admin') {
        res.send({
          success: true,
          code: 200,
          message: '操作成功',
          data: {
            id: 1,
            email: 'admin@example.com',
            username: 'admin',
            phone: '13800138000',
            avatar: 'https://api.dicebear.com/9.x/bottts/svg?seed=GavinRay',
            isActive: true,
            departmentId: 1,
            positionId: 2,
            createdAt: '2025-07-26T14:17:12.818Z',
            updatedAt: '2025-07-26T14:31:16.119Z',
            roles: [
              {
                id: 1,
                name: 'admin',
                description: '系统管理员',
                createdAt: '2025-07-26T14:17:12.755Z',
                updatedAt: '2025-07-26T14:31:16.054Z',
                permissions: [
                  {
                    id: 1,
                    name: '用户管理',
                    code: 'user:manage',
                    description: '用户的增删改查权限',
                    createdAt: '2025-07-26T14:09:42.321Z',
                    updatedAt: '2025-07-26T14:31:15.999Z',
                  },
                  {
                    id: 2,
                    name: '查看用户',
                    code: 'user:read',
                    description: '查看用户信息的权限',
                    createdAt: '2025-07-26T14:09:42.325Z',
                    updatedAt: '2025-07-26T14:31:16.003Z',
                  },
                  {
                    id: 3,
                    name: '创建用户',
                    code: 'user:create',
                    description: '创建用户的权限',
                    createdAt: '2025-07-26T14:09:42.326Z',
                    updatedAt: '2025-07-26T14:31:16.005Z',
                  },
                  {
                    id: 4,
                    name: '更新用户',
                    code: 'user:update',
                    description: '更新用户信息的权限',
                    createdAt: '2025-07-26T14:09:42.348Z',
                    updatedAt: '2025-07-26T14:31:16.007Z',
                  },
                  {
                    id: 5,
                    name: '删除用户',
                    code: 'user:delete',
                    description: '删除用户的权限',
                    createdAt: '2025-07-26T14:09:42.349Z',
                    updatedAt: '2025-07-26T14:31:16.009Z',
                  },
                  {
                    id: 6,
                    name: '角色管理',
                    code: 'role:manage',
                    description: '角色的增删改查权限',
                    createdAt: '2025-07-26T14:09:42.351Z',
                    updatedAt: '2025-07-26T14:31:16.012Z',
                  },
                  {
                    id: 7,
                    name: '查看角色',
                    code: 'role:read',
                    description: '查看角色信息的权限',
                    createdAt: '2025-07-26T14:09:42.352Z',
                    updatedAt: '2025-07-26T14:31:16.014Z',
                  },
                  {
                    id: 8,
                    name: '创建角色',
                    code: 'role:create',
                    description: '创建角色的权限',
                    createdAt: '2025-07-26T14:09:42.353Z',
                    updatedAt: '2025-07-26T14:31:16.016Z',
                  },
                  {
                    id: 9,
                    name: '更新角色',
                    code: 'role:update',
                    description: '更新角色信息的权限',
                    createdAt: '2025-07-26T14:09:42.355Z',
                    updatedAt: '2025-07-26T14:31:16.019Z',
                  },
                  {
                    id: 10,
                    name: '删除角色',
                    code: 'role:delete',
                    description: '删除角色的权限',
                    createdAt: '2025-07-26T14:09:42.356Z',
                    updatedAt: '2025-07-26T14:31:16.021Z',
                  },
                  {
                    id: 11,
                    name: '权限管理',
                    code: 'permission:manage',
                    description: '权限的增删改查权限',
                    createdAt: '2025-07-26T14:09:42.357Z',
                    updatedAt: '2025-07-26T14:31:16.023Z',
                  },
                  {
                    id: 12,
                    name: '查看权限',
                    code: 'permission:read',
                    description: '查看权限信息的权限',
                    createdAt: '2025-07-26T14:09:42.358Z',
                    updatedAt: '2025-07-26T14:31:16.025Z',
                  },
                  {
                    id: 13,
                    name: '创建权限',
                    code: 'permission:create',
                    description: '创建权限的权限',
                    createdAt: '2025-07-26T14:09:42.359Z',
                    updatedAt: '2025-07-26T14:31:16.026Z',
                  },
                  {
                    id: 14,
                    name: '更新权限',
                    code: 'permission:update',
                    description: '更新权限信息的权限',
                    createdAt: '2025-07-26T14:09:42.360Z',
                    updatedAt: '2025-07-26T14:31:16.028Z',
                  },
                  {
                    id: 15,
                    name: '删除权限',
                    code: 'permission:delete',
                    description: '删除权限的权限',
                    createdAt: '2025-07-26T14:09:42.361Z',
                    updatedAt: '2025-07-26T14:31:16.030Z',
                  },
                  {
                    id: 16,
                    name: '部门管理',
                    code: 'department:manage',
                    description: '部门的增删改查权限',
                    createdAt: '2025-07-26T14:09:42.362Z',
                    updatedAt: '2025-07-26T14:31:16.031Z',
                  },
                  {
                    id: 17,
                    name: '查看部门',
                    code: 'department:read',
                    description: '查看部门信息的权限',
                    createdAt: '2025-07-26T14:09:42.363Z',
                    updatedAt: '2025-07-26T14:31:16.033Z',
                  },
                  {
                    id: 18,
                    name: '创建部门',
                    code: 'department:create',
                    description: '创建部门的权限',
                    createdAt: '2025-07-26T14:09:42.364Z',
                    updatedAt: '2025-07-26T14:31:16.034Z',
                  },
                  {
                    id: 19,
                    name: '更新部门',
                    code: 'department:update',
                    description: '更新部门信息的权限',
                    createdAt: '2025-07-26T14:09:42.365Z',
                    updatedAt: '2025-07-26T14:31:16.035Z',
                  },
                  {
                    id: 20,
                    name: '删除部门',
                    code: 'department:delete',
                    description: '删除部门的权限',
                    createdAt: '2025-07-26T14:09:42.366Z',
                    updatedAt: '2025-07-26T14:31:16.037Z',
                  },
                  {
                    id: 21,
                    name: '岗位管理',
                    code: 'position:manage',
                    description: '岗位的增删改查权限',
                    createdAt: '2025-07-26T14:09:42.367Z',
                    updatedAt: '2025-07-26T14:31:16.038Z',
                  },
                  {
                    id: 22,
                    name: '查看岗位',
                    code: 'position:read',
                    description: '查看岗位信息的权限',
                    createdAt: '2025-07-26T14:09:42.368Z',
                    updatedAt: '2025-07-26T14:31:16.040Z',
                  },
                  {
                    id: 23,
                    name: '创建岗位',
                    code: 'position:create',
                    description: '创建岗位的权限',
                    createdAt: '2025-07-26T14:09:42.368Z',
                    updatedAt: '2025-07-26T14:31:16.041Z',
                  },
                  {
                    id: 24,
                    name: '更新岗位',
                    code: 'position:update',
                    description: '更新岗位信息的权限',
                    createdAt: '2025-07-26T14:09:42.369Z',
                    updatedAt: '2025-07-26T14:31:16.042Z',
                  },
                  {
                    id: 25,
                    name: '删除岗位',
                    code: 'position:delete',
                    description: '删除岗位的权限',
                    createdAt: '2025-07-26T14:09:42.370Z',
                    updatedAt: '2025-07-26T14:31:16.043Z',
                  },
                ],
              },
            ],
            department: {
              id: 1,
              name: '技术部',
              code: 'IT',
              description: '负责技术开发和维护',
              parentId: null,
              isActive: true,
              sort: 1,
              createdAt: '2025-07-26T14:17:12.746Z',
              updatedAt: '2025-07-26T14:17:12.746Z',
            },
            position: {
              id: 2,
              name: '部门经理',
              code: 'MANAGER',
              description: '负责部门管理',
              departmentId: 1,
              isActive: true,
              sort: 2,
              createdAt: '2025-07-26T14:17:12.752Z',
              updatedAt: '2025-07-26T14:17:12.752Z',
            },
            // 服务端没有的数据 以下
            lastLoginTime: '2024-01-15T10:30:00Z',
            statistics: {
              managedUsers: 156,
              systemUptime: '99.9%',
              todayLogins: 89,
              pendingTasks: 12,
            },
            nickName: 'Gavin',
          },
        });
        return;
      }

      if (token === 'user') {
        res.send({
          success: true,
          code: 200,
          message: '操作成功',
          data: {
            id: 2,
            email: 'alice@example.com',
            username: 'user',
            phone: '139-0013-9000',
            avatar: 'https://api.dicebear.com/9.x/bottts/svg?seed=Alice',
            isActive: true,
            departmentId: 2,
            positionId: 3,
            createdAt: '2022-06-01T09:00:00Z',
            updatedAt: '2024-01-15T08:15:00Z',
            roles: [
              {
                id: 2,
                name: 'user',
                description: '普通用户',
                createdAt: '2025-07-26T14:17:12.756Z',
                updatedAt: '2025-07-26T14:31:16.055Z',
                permissions: [
                  {
                    id: 2,
                    name: '查看用户',
                    code: 'user:read',
                    description: '查看用户信息的权限',
                    createdAt: '2025-07-26T14:09:42.325Z',
                    updatedAt: '2025-07-26T14:31:16.003Z',
                  },
                  {
                    id: 26,
                    name: '编辑个人资料',
                    code: 'profile:edit',
                    description: '编辑个人资料的权限',
                    createdAt: '2025-07-26T14:09:42.371Z',
                    updatedAt: '2025-07-26T14:31:16.044Z',
                  },
                ],
              },
            ],
            department: {
              id: 2,
              name: '产品部',
              code: 'PRODUCT',
              description: '负责产品设计和规划',
              parentId: null,
              isActive: true,
              sort: 2,
              createdAt: '2025-07-26T14:17:12.747Z',
              updatedAt: '2025-07-26T14:17:12.747Z',
            },
            position: {
              id: 3,
              name: '产品经理',
              code: 'PRODUCT_MANAGER',
              description: '负责产品规划和管理',
              departmentId: 2,
              isActive: true,
              sort: 3,
              createdAt: '2025-07-26T14:17:12.753Z',
              updatedAt: '2025-07-26T14:17:12.753Z',
            },
            // 服务端没有的数据
            lastLoginTime: '2024-01-15T10:30:00Z',
          },
        });
        return;
      }
    }
    // 如果 Authorization 头部不存在，可能需要返回 401 Unauthorized 错误
    // res.status(401).send('Unauthorized');
    res.status(401).send({
      success: false,
      code: 401,
      message: '认证失败，无法访问系统资源',
    });
  },
};

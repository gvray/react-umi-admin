import { Request, Response } from 'express';
import { sleep } from 'ts-copilot';

export default {
  'POST /api/login': async (req: Request, res: Response) => {
    const { password, username } = req.body;
    await sleep(2000);
    if (password === '123456' && username === 'admin') {
      res.send({
        success: true,
        code: 200,
        message: '登陆成功',
        data: {
          accessToken: 'admin',
          refreshToken: 'admin',
        },
      });
      return;
    }
    if (password === '123456' && username === 'user') {
      res.send({
        success: true,
        code: 200,
        message: '登陆成功',
        data: {
          accessToken: 'user',
          refreshToken: 'user',
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
  'POST /api/logout': async (req: Request, res: Response) => {
    res.send({
      success: true,
      code: 200,
      message: '退出成功',
    });
  },
  'GET /api/currentUser': async (req: Request, res: Response) => {
    const authorizationHeader = req.headers['authorization'];
    if (authorizationHeader) {
      const token = authorizationHeader.split(' ')[1];
      if (token === 'admin') {
        res.send({
          success: true,
          code: 200,
          message: '操作成功',
          data: {
            user: {
              // 基本信息
              userid: '00000001',
              username: 'admin',
              name: 'Gavin',
              avatar: 'https://api.dicebear.com/9.x/bottts/svg?seed=GavinRay',
              email: 'gavinbirkhoff@gmail.com',
              phone: '138-0013-8000',

              // 角色权限
              role: 'admin',
              permissions: ['*'], // 管理员拥有所有权限

              // 工作信息
              department: '技术部',
              position: '系统管理员',

              // 账户状态
              status: 'active',
              lastLoginTime: '2024-01-15T10:30:00Z',
              loginCount: 1247,

              // 统计数据（管理员关心的数据）
              statistics: {
                managedUsers: 156,
                systemUptime: '99.9%',
                todayLogins: 89,
                pendingTasks: 12,
              },

              // 创建时间
              createdAt: '2020-03-15T08:00:00Z',
              updatedAt: '2024-01-15T10:30:00Z',
            },
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
            user: {
              // 基本信息
              userid: '00000002',
              username: 'user',
              name: 'Alice',
              avatar: 'https://api.dicebear.com/9.x/bottts/svg?seed=Alice',
              email: 'alice@example.com',
              phone: '139-0013-9000',

              // 角色权限
              role: 'user',
              permissions: ['read', 'profile:edit'],

              // 工作信息
              department: '产品部',
              position: '产品经理',

              // 账户状态
              status: 'active',
              lastLoginTime: '2024-01-15T08:15:00Z',
              loginCount: 342,

              // 统计数据
              statistics: {
                completedTasks: 89,
                projectsInvolved: 5,
                teamSize: 8,
                thisMonthTasks: 23,
              },

              // 创建时间
              createdAt: '2022-06-01T09:00:00Z',
              updatedAt: '2024-01-15T08:15:00Z',
            },
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

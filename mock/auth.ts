import { sleep } from '@gvray/eskit';
import { Request, Response } from 'express';

export default {
  'POST /api/auth/login': async (req: Request, res: Response) => {
    const { password, account } = req.body;
    await sleep(1000);

    // Dev 环境支持 admin / super_admin 登录
    if (
      password === '123456' &&
      ['admin', 'admin@example.com', 'super_admin'].includes(account)
    ) {
      res.send({
        success: true,
        code: 200,
        message: '登录成功',
        data: {
          access_token: 'mock_access_token_admin',
          refresh_token: 'mock_refresh_token_admin',
          access_token_expires_in: 7200,
          refresh_token_expires_in: 604800,
        },
      });
      return;
    }

    res.send({
      success: false,
      code: 401,
      message: '用户名或密码错误',
    });
  },

  'POST /api/auth/logout': async (_req: Request, res: Response) => {
    res.send({
      success: true,
      code: 200,
      message: '退出成功',
    });
  },

  'GET /api/auth/me': async (_req: Request, res: Response) => {
    res.send({
      success: true,
      code: 200,
      message: '获取当前用户成功',
      data: {
        userId: '65719c5d-d030-4ba0-9b0d-4c8c38599a62',
        username: 'super_admin',
        isSuperAdmin: true,
        permissionCodes: ['*:*:*'],
        roles: [
          {
            roleId: 'fe420c4f-cd6f-436e-9817-dd05b3c93242',
            name: '超级管理员',
            roleKey: 'super_admin',
            description: '超级管理员角色，拥有所有权限，不允许删除、创建和修改',
            rolePermissions: [],
          },
        ],
        department: null,
        positions: [],
        preferences: {},
        profile: {
          nickname: '超级管理员',
          avatar: null,
          email: 'super@example.com',
          phone: '13900139000',
          gender: null,
          status: 'enabled',
        },
      },
    });
  },

  'GET /api/auth/menus': async (_req: Request, res: Response) => {
    await sleep(500);
    res.json({
      success: true,
      code: 200,
      message: '获取菜单成功',
      data: [
        {
          menuId: 'a3335fb2-c745-4c8d-924b-c38c8c376101',
          parentMenuId: '00000000-0000-0000-0000-000000000000',
          name: '系统管理',
          code: 'menu.system',
          type: 'CATALOG',
          path: '/system',
          icon: 'SettingOutlined',
          hidden: false,
          sort: 0,
          children: [
            {
              menuId: '618cf983-c05a-4419-9267-46bcb5395c3e',
              parentMenuId: 'a3335fb2-c745-4c8d-924b-c38c8c376101',
              name: '用户管理',
              code: 'menu.system.user',
              type: 'MENU',
              path: '/system/user',
              icon: 'UserOutlined',
              hidden: false,
              sort: 1,
              children: [],
            },
            {
              menuId: 'menu-role-001',
              parentMenuId: 'a3335fb2-c745-4c8d-924b-c38c8c376101',
              name: '角色管理',
              code: 'menu.system.role',
              type: 'MENU',
              path: '/system/role',
              icon: 'TeamOutlined',
              hidden: false,
              sort: 2,
              children: [],
            },
          ],
        },
        {
          menuId: 'menu-docs-001',
          parentMenuId: '00000000-0000-0000-0000-000000000000',
          name: '开发文档',
          code: 'menu.docs',
          type: 'MENU',
          path: '/docs',
          icon: 'FileTextOutlined',
          hidden: false,
          sort: 99,
          children: [],
        },
      ],
    });
  },

  'GET /api/public/runtime-config': async (_req: Request, res: Response) => {
    res.send({
      success: true,
      code: 200,
      message: '获取运行时配置成功',
      data: {
        feature: {
          register: false,
          mfa: false,
        },
        oauth: {
          githubEnabled: false,
          googleEnabled: false,
          wechatEnabled: false,
        },
        security: {
          watermarkEnabled: true,
        },
        storage: {
          maxFileSize: 10485760,
          allowedTypes: 'jpg,jpeg,png,gif,pdf,doc,docx,xls,xlsx',
        },
        system: {
          name: 'GVRAY Admin',
          logo: '/logo.svg',
          favicon: '/favicon.ico',
          copyright: '© 2025 GVRAY Admin. All rights reserved.',
          icp: '',
          timezone: 'Asia/Shanghai',
        },
        ui: {
          defaultTheme: 'light',
          defaultLanguage: 'zh-CN',
          defaultPageSize: 10,
          defaultSidebarCollapsed: false,
          defaultColorPrimary: '#1890ff',
          defaultEnableNotification: true,
          grayMode: false,
        },
        user: {
          defaultAvatar:
            'https://api.dicebear.com/9.x/bottts/svg?seed=GavinRay',
        },
      },
    });
  },
};

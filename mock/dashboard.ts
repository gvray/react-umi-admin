import { Request, Response } from 'express';

export default {
  'GET /api/dashboard/overview': async (req: Request, res: Response) => {
    res.send({
      success: true,
      code: 200,
      message: '操作成功',
      data: {
        users: 22,
        roles: 4,
        permissions: 49,
      },
      timestamp: '2025-10-13T14:39:51.510Z',
      path: '/dashboard/overview',
    });
  },
  'GET /api/dashboard/role-distribution': async (
    req: Request,
    res: Response,
  ) => {
    res.send({
      success: true,
      code: 200,
      message: '操作成功',
      data: [
        {
          name: '超级管理员',
          value: 1,
        },
        {
          name: '管理员',
          value: 10,
        },
        {
          name: '普通用户',
          value: 10,
        },
        {
          name: '部门经理',
          value: 5,
        },
      ],
      timestamp: '2025-10-13T14:39:51.510Z',
      path: '/dashboard/role-distribution',
    });
  },
  'GET /api/dashboard/login-trend': async (req: Request, res: Response) => {
    res.send({
      success: true,
      code: 200,
      message: '操作成功',
      data: [
        {
          date: '2025-10-08',
          value: 3,
        },
        {
          date: '2025-10-09',
          value: 0,
        },
        {
          date: '2025-10-10',
          value: 10,
        },
        {
          date: '2025-10-11',
          value: 1,
        },
        {
          date: '2025-10-12',
          value: 7,
        },
        {
          date: '2025-10-13',
          value: 3,
        },
        {
          date: '2025-10-14',
          value: 18,
        },
      ],
      timestamp: '2025-10-14T14:51:21.288Z',
      path: '/dashboard/login-trend',
    });
  },
};

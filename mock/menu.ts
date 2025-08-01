import { Request, Response } from 'express';
import { sleep } from 'ts-copilot';
export default {
  'GET /api/resources/menus': async (_req: Request, res: Response) => {
    await sleep(800);
    res.json({
      success: true,
      code: 200,
      message: '菜单获取成功',
      data: [
        { key: '/system/user', icon: 'UserOutlined', label: '用户管理' },
        { key: '/docs', icon: 'VideoCameraOutlined', label: '架构设计' },
      ],
    });
  },
};

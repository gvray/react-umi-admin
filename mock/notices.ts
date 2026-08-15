import type { Request, Response } from 'express';

const notices = [
  {
    noticeId: 'notice-0005',
    title: '欢迎使用 GVRAY Admin',
    content:
      'GVRAY Admin 是一个基于 NestJS + Prisma + TypeScript 构建的后台管理系统，集成了 RBAC 权限管理、JWT 认证、操作审计、在线用户监控等功能。如有任何问题或建议，欢迎随时反馈。',
    type: 'notice',
    status: 'enabled',
    sort: 0,
    isRead: false,
    createdAt: '2026-08-05T14:20:37.615Z',
    updatedAt: '2026-08-05T14:20:37.615Z',
  },
  {
    noticeId: 'notice-0001',
    title: '系统维护公告',
    content:
      '尊敬的用户，系统将于本周六凌晨 02:00 - 06:00 进行例行维护升级。维护期间部分服务可能暂时不可用，请提前安排好您的工作。如有疑问请联系技术支持。',
    type: 'announcement',
    status: 'enabled',
    sort: 1,
    isRead: false,
    createdAt: '2026-08-05T14:20:37.609Z',
    updatedAt: '2026-08-05T14:20:37.609Z',
  },
  {
    noticeId: 'notice-0002',
    title: '新功能上线：通知通告模块',
    content:
      '通知通告模块已正式上线！管理员可在系统管理 → 通知通告中发布公告和通知，用户可通过顶部铃铛图标实时查看最新动态。快去体验吧！',
    type: 'notice',
    status: 'enabled',
    sort: 2,
    isRead: false,
    createdAt: '2026-08-05T14:20:37.611Z',
    updatedAt: '2026-08-05T14:20:37.611Z',
  },
  {
    noticeId: 'notice-0003',
    title: '安全提醒：请定期修改密码',
    content:
      '为了保障您的账户安全，建议您定期修改登录密码，并使用复杂度较高的密码组合。切勿将密码告知他人，发现异常登录请立即联系管理员。',
    type: 'notice',
    status: 'enabled',
    sort: 3,
    isRead: false,
    createdAt: '2026-08-05T14:20:37.613Z',
    updatedAt: '2026-08-05T14:20:37.613Z',
  },
  {
    noticeId: 'notice-0004',
    title: '2026 年春节放假通知',
    content:
      '根据国家法定节假日安排，2026 年春节放假时间为 2 月 16 日（除夕）至 2 月 22 日（初六），共 7 天。2 月 14 日（周六）、2 月 15 日（周日）正常上班。祝大家新春快乐！',
    type: 'announcement',
    status: 'disabled',
    sort: 4,
    isRead: false,
    createdAt: '2026-08-05T14:20:37.614Z',
    updatedAt: '2026-08-05T14:20:37.614Z',
  },
];

export default {
  'GET /api/system/notices/unread/count': async (
    _req: Request,
    res: Response,
  ) => {
    res.json({
      success: true,
      code: 200,
      message: '获取成功',
      data: {
        count: 4,
      },
      timestamp: new Date().toISOString(),
    });
  },
  'GET /api/system/notices': async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    const sortBy = String(req.query.sortBy || 'createdAt');
    const sortOrder = String(req.query.sortOrder || 'desc');

    const sortedNotices = [...notices].sort((a, b) => {
      const aValue = a[sortBy as keyof typeof a];
      const bValue = b[sortBy as keyof typeof b];

      if (aValue === bValue) {
        return 0;
      }

      const result = aValue > bValue ? 1 : -1;

      return sortOrder === 'desc' ? -result : result;
    });

    const total = sortedNotices.length;

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    res.json({
      success: true,
      code: 200,
      message: '通知列表获取成功',
      data: {
        items: sortedNotices.slice(start, end),
        total,
        page,
        pageSize,
      },
      timestamp: new Date().toISOString(),
    });
  },
};

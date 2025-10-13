import { Request, Response } from 'express';

export default {
  'GET /api/system/dictionaries/types/batch': async (
    req: Request,
    res: Response,
  ) => {
    res.send({
      success: true,
      code: 200,
      message: '操作成功',
      data: {
        user_status: [
          {
            value: '1',
            label: '启用',
          },
          {
            value: '0',
            label: '禁用',
          },
          {
            value: '2',
            label: '审核中',
          },
          {
            value: '3',
            label: '封禁',
          },
        ],
        user_sex: [],
      },
      timestamp: '2025-10-13T14:47:36.653Z',
      path: '/system/dictionaries/types/batch?typeCodes=user_status,user_sex',
    });
  },
};

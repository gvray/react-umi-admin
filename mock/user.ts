import { sleep } from '@gvray/eskit';
import dayjs from 'dayjs';
import { Request, Response } from 'express';
const uuid = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
const resultData = new Map();
let index = 39;
for (let i = 1; i <= index; i++) {
  const userId = uuid();
  resultData.set(userId, {
    id: i,
    createBy: 'admin',
    createdAt: new Date().getTime(),
    updateBy: null,
    updatedAt: null,
    remark: '管理员',
    userId,
    username: 'admin' + i,
    nickname: 'Gavin' + i,
    email: 'admin@gmail.com',
    phone: '1588888888' + (i % 10),
    sex: '1',
    status: i % 4,
    delFlag: '0',
  });
}
export default {
  'GET /api/users': async (req: Request, res: Response) => {
    const { page, pageSize, username, phone, dateRange, status } = req.query;
    await sleep(500);
    if (false) {
      res.json({
        success: false,
        code: 500,
        message: '用户列表操作失败',
        data: null,
        showType: 1,
      });
      return;
    }
    const rows = [...resultData.values()].filter((item) => {
      let flag = true;
      if (username) {
        flag = item.username?.includes(username);
      }
      if (phone) {
        flag = item.phone?.includes(phone);
      }
      if (status !== undefined) {
        flag = item.status === Number(status);
      }
      if (dateRange) {
        const [start, end] = (dateRange as string).split('_to_');
        // 将字符串形式的日期转换为 Day.js 对象
        const startDate = dayjs(start);
        const endDate = dayjs(end);

        // 判断 item.createdAt 是否在范围内
        flag =
          dayjs(dayjs(item.createdAt).format('YYYY MM-DD')).isSame(startDate) ||
          dayjs(dayjs(item.createdAt).format('YYYY MM-DD')).isSame(endDate) ||
          (dayjs(dayjs(item.createdAt).format('YYYY MM-DD')).isAfter(
            startDate,
          ) &&
            dayjs(dayjs(item.createdAt).format('YYYY MM-DD')).isBefore(
              endDate,
            ));
      }
      return flag;
    });

    res.json({
      success: true,
      code: 200,
      message: '操作成功',
      data: {
        items: rows.slice(
          (parseInt(page as string) - 1) * parseInt(pageSize as string),
          (parseInt(page as string) - 1) * parseInt(pageSize as string) +
            parseInt(pageSize as string),
        ),
        total: rows.length,
      },
    });
  },
  'DELETE /api/users/:userId': async (req: Request, res: Response) => {
    const { userId } = req.params;
    resultData.delete(userId);
    res.json({
      success: true,
      code: 200,
      message: '操作成功',
    });
  },
  'POST /api/users': async (req: Request, res: Response) => {
    const userId = uuid();
    resultData.set(userId, {
      createdAt: new Date(),
      userId,
      ...req.body,
    });
    res.json({
      success: true,
      code: 200,
      message: '操作成功',
    });
  },
  'PATCH /api/users/:userId': async (req: Request, res: Response) => {
    const { userId } = req.params;
    const oldUser = resultData.get(userId);
    resultData.set(userId, {
      ...oldUser,
      ...req.body,
      updatedAt: new Date(),
    });
    await sleep(200);
    res.json({
      success: true,
      code: 200,
      message: '操作成功',
    });
  },
  'GET /api/users/:userId': async (req: Request, res: Response) => {
    const { userId } = req.params;
    const user = resultData.get(userId);
    if (!user) {
      res.json({
        success: false,
        code: 500,
        message: '用户不存在',
        data: null,
        showType: 1,
      });
      return;
    }
    res.json({
      success: true,
      code: 200,
      message: '操作成功',
      data: user,
    });
  },
};

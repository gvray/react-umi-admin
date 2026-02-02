import { sleep } from '@gvray/eskit';
import dayjs from 'dayjs';
import { Request, Response } from 'express';

const uuid = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

// 模拟职位数据
const positionData = new Map();
let index = 25;

// 职位级别数据
const levels = [1, 2, 3, 4, 5];
const levelNames = ['初级', '中级', '高级', '专家', '资深专家'];

// 部门数据
const departments = [
  { id: 1, name: '技术部' },
  { id: 2, name: '产品部' },
  { id: 3, name: '设计部' },
  { id: 4, name: '运营部' },
  { id: 5, name: '市场部' },
  { id: 6, name: '人事部' },
];

// 职位名称
const positionNames = [
  '前端工程师',
  '后端工程师',
  '全栈工程师',
  '产品经理',
  'UI设计师',
  '运营专员',
  '市场经理',
  'HR专员',
  '数据分析师',
  '测试工程师',
  '架构师',
  '技术经理',
  '项目经理',
  '视觉设计师',
  '用户体验设计师',
];

// 技能要求
const requirements = [
  ['React', 'TypeScript', 'JavaScript'],
  ['Node.js', 'Python', 'Java'],
  ['Figma', 'Sketch', 'Photoshop'],
  ['数据分析', 'SQL', 'Excel'],
  ['项目管理', '团队协作', '沟通能力'],
];

// 工作职责
const responsibilities = [
  ['负责前端页面开发', '优化用户体验', '维护代码质量'],
  ['设计系统架构', '编写API接口', '数据库设计'],
  ['产品需求分析', '用户调研', '竞品分析'],
  ['UI设计', '交互设计', '视觉规范制定'],
  ['制定运营策略', '数据分析', '用户增长'],
];

for (let i = 1; i <= index; i++) {
  const positionId = i;
  const level = levels[Math.floor(Math.random() * levels.length)];
  const department =
    departments[Math.floor(Math.random() * departments.length)];
  const positionName =
    positionNames[Math.floor(Math.random() * positionNames.length)];
  const requirement =
    requirements[Math.floor(Math.random() * requirements.length)];
  const responsibility =
    responsibilities[Math.floor(Math.random() * responsibilities.length)];

  positionData.set(positionId, {
    positionId,
    name: positionName + (i > 15 ? ` ${i - 15}` : ''),
    code: `POS${String(i).padStart(3, '0')}`,
    description: `${levelNames[level - 1]}${positionName}，负责${
      department.name
    }相关工作`,
    level,
    departmentId: department.id,
    departmentName: department.name,
    status: Math.random() > 0.2 ? 'active' : 'inactive',
    salary: {
      min: 8000 + level * 3000 + Math.floor(Math.random() * 5000),
      max: 15000 + level * 5000 + Math.floor(Math.random() * 10000),
      currency: 'CNY',
    },
    requirements: requirement,
    responsibilities: responsibility,
    createdAt: dayjs()
      .subtract(Math.floor(Math.random() * 30), 'day')
      .format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: dayjs()
      .subtract(Math.floor(Math.random() * 7), 'day')
      .format('YYYY-MM-DD HH:mm:ss'),
    createdBy: 'admin',
    employeeCount: Math.floor(Math.random() * 20) + 1,
  });
}

export default {
  // 获取职位列表
  'GET /api/system/positions': async (req: Request, res: Response) => {
    const {
      current = 1,
      pageSize = 10,
      name,
      code,
      departmentId,
      level,
      status,
      sortField,
      sortOrder,
    } = req.query;
    await sleep(300);

    let positions = [...positionData.values()];

    // 筛选
    if (name) {
      positions = positions.filter((item) =>
        item.name.includes(name as string),
      );
    }
    if (code) {
      positions = positions.filter((item) =>
        item.code.includes(code as string),
      );
    }
    if (departmentId) {
      positions = positions.filter(
        (item) => item.departmentId === Number(departmentId),
      );
    }
    if (level) {
      positions = positions.filter((item) => item.level === Number(level));
    }
    if (status) {
      positions = positions.filter((item) => item.status === status);
    }

    // 排序
    if (sortField && sortOrder) {
      positions.sort((a, b) => {
        const valueA = a[sortField as keyof typeof a];
        const valueB = b[sortField as keyof typeof b];
        if (sortOrder === 'ascend') {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });
    }

    // 分页
    const total = positions.length;
    const start = (Number(current) - 1) * Number(pageSize);
    const end = start + Number(pageSize);
    const data = positions.slice(start, end);

    res.json({
      success: true,
      data: {
        records: data,
        total,
        page: Number(current),
        pageSize: Number(pageSize),
      },
    });
  },

  // 获取单个职位详情
  'GET /api/system/positions/:id': async (req: Request, res: Response) => {
    const { id } = req.params;
    await sleep(200);

    const position = positionData.get(Number(id));
    if (!position) {
      res.status(404).json({
        success: false,
        code: 404,
        message: '职位不存在',
        data: null,
      });
      return;
    }

    res.json({
      success: true,
      data: position,
    });
  },

  // 创建职位
  'POST /api/system/positions': async (req: Request, res: Response) => {
    const {
      name,
      code,
      description,
      level,
      departmentId,
      status,
      salary,
      requirements,
      responsibilities,
    } = req.body;
    await sleep(500);

    // 检查编码是否重复
    const existingPosition = [...positionData.values()].find(
      (item) => item.code === code,
    );
    if (existingPosition) {
      res.json({
        success: false,
        code: 400,
        message: '职位编码已存在',
        data: null,
        showType: 2,
      });
      return;
    }

    const newPositionId = index + 1;
    index += 1;

    const department = departments.find((d) => d.id === departmentId);
    const newPosition = {
      positionId: newPositionId,
      name,
      code,
      description,
      level: level || 1,
      departmentId,
      departmentName: department?.name || '',
      status: status || 'active',
      salary: salary || { min: 8000, max: 15000, currency: 'CNY' },
      requirements: requirements || [],
      responsibilities: responsibilities || [],
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      createdBy: 'admin',
      employeeCount: 0,
    };

    positionData.set(newPositionId, newPosition);

    res.json({
      success: true,
      data: newPosition,
      message: '职位创建成功',
    });
  },

  // 更新职位
  'PATCH /api/system/positions/:id': async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    await sleep(400);

    const position = positionData.get(Number(id));
    if (!position) {
      res.status(404).json({
        success: false,
        code: 404,
        message: '职位不存在',
        data: null,
      });
      return;
    }

    // 如果更新编码，检查是否重复
    if (updateData.code && updateData.code !== position.code) {
      const existingPosition = [...positionData.values()].find(
        (item) => item.code === updateData.code,
      );
      if (existingPosition) {
        res.json({
          success: false,
          code: 400,
          message: '职位编码已存在',
          data: null,
          showType: 2,
        });
        return;
      }
    }

    // 更新部门名称
    if (updateData.departmentId) {
      const department = departments.find(
        (d) => d.id === updateData.departmentId,
      );
      updateData.departmentName = department?.name || '';
    }

    const updatedPosition = {
      ...position,
      ...updateData,
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };

    positionData.set(Number(id), updatedPosition);

    res.json({
      success: true,
      data: updatedPosition,
      message: '职位更新成功',
    });
  },

  // 删除职位
  'DELETE /api/system/positions/:id': async (req: Request, res: Response) => {
    const { id } = req.params;
    await sleep(300);

    const position = positionData.get(Number(id));
    if (!position) {
      res.status(404).json({
        success: false,
        code: 404,
        message: '职位不存在',
        data: null,
      });
      return;
    }

    positionData.delete(Number(id));

    res.json({
      success: true,
      data: null,
      message: '职位删除成功',
    });
  },

  // 批量删除职位
  'POST /api/system/positions/batch-delete': async (
    req: Request,
    res: Response,
  ) => {
    const { ids } = req.body;
    await sleep(400);

    if (!Array.isArray(ids) || ids.length === 0) {
      res.json({
        success: false,
        code: 400,
        message: '请选择要删除的职位',
        data: null,
        showType: 2,
      });
      return;
    }

    let deletedCount = 0;
    ids.forEach((id) => {
      if (positionData.has(Number(id))) {
        positionData.delete(Number(id));
        deletedCount++;
      }
    });

    res.json({
      success: true,
      data: { deletedCount },
      message: `成功删除 ${deletedCount} 个职位`,
    });
  },

  // 更新职位状态
  'PATCH /api/system/positions/:id/status': async (
    req: Request,
    res: Response,
  ) => {
    const { id } = req.params;
    const { status } = req.body;
    await sleep(300);

    const position = positionData.get(Number(id));
    if (!position) {
      res.status(404).json({
        success: false,
        code: 404,
        message: '职位不存在',
        data: null,
      });
      return;
    }

    const updatedPosition = {
      ...position,
      status,
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };

    positionData.set(Number(id), updatedPosition);

    res.json({
      success: true,
      data: updatedPosition,
      message: `职位状态${status === 'active' ? '启用' : '禁用'}成功`,
    });
  },

  // 获取职位下的员工列表
  'GET /api/system/positions/:id/employees': async (
    req: Request,
    res: Response,
  ) => {
    const { id } = req.params;
    await sleep(300);

    const position = positionData.get(Number(id));
    if (!position) {
      res.status(404).json({
        success: false,
        code: 404,
        message: '职位不存在',
        data: null,
      });
      return;
    }

    // 模拟员工数据
    const employees = [];
    for (let i = 1; i <= position.employeeCount; i++) {
      employees.push({
        userId: uuid(),
        username: `user${i}`,
        nickname: `员工${i}`,
        email: `user${i}@example.com`,
        joinDate: dayjs()
          .subtract(Math.floor(Math.random() * 365), 'day')
          .format('YYYY-MM-DD'),
      });
    }

    res.json({
      success: true,
      data: employees,
    });
  },

  // 按部门获取职位列表
  'GET /api/system/departments/:id/positions': async (
    req: Request,
    res: Response,
  ) => {
    const { id } = req.params;
    await sleep(300);

    const positions = [...positionData.values()].filter(
      (item) => item.departmentId === Number(id),
    );

    res.json({
      success: true,
      data: positions,
    });
  },

  // 获取职位统计信息
  'GET /api/system/positions/stats': async (req: Request, res: Response) => {
    await sleep(200);

    const positions = [...positionData.values()];
    const stats = {
      total: positions.length,
      active: positions.filter((p) => p.status === 'active').length,
      inactive: positions.filter((p) => p.status === 'inactive').length,
      byDepartment: departments.map((dept) => ({
        departmentId: dept.id,
        departmentName: dept.name,
        count: positions.filter((p) => p.departmentId === dept.id).length,
      })),
      byLevel: levels.map((level) => ({
        level,
        levelName: levelNames[level - 1],
        count: positions.filter((p) => p.level === level).length,
      })),
    };

    res.json({
      success: true,
      data: stats,
    });
  },

  // 搜索职位
  'GET /api/system/positions/search': async (req: Request, res: Response) => {
    const { keyword } = req.query;
    await sleep(300);

    if (!keyword) {
      res.json({
        success: true,
        data: [],
      });
      return;
    }

    const positions = [...positionData.values()].filter(
      (item) =>
        item.name.includes(keyword as string) ||
        item.code.includes(keyword as string) ||
        item.description?.includes(keyword as string),
    );

    res.json({
      success: true,
      data: positions,
    });
  },

  // 获取职位层级树
  'GET /api/system/positions/tree': async (req: Request, res: Response) => {
    await sleep(300);

    const tree = departments.map((dept) => {
      const deptPositions = [...positionData.values()]
        .filter((p) => p.departmentId === dept.id)
        .map((p) => ({
          key: `position-${p.positionId}`,
          title: `${p.name} (${p.code})`,
          value: p.positionId,
          isLeaf: true,
          data: p,
        }));

      return {
        key: `dept-${dept.id}`,
        title: dept.name,
        value: dept.id,
        children: deptPositions,
        data: dept,
      };
    });

    res.json({
      success: true,
      data: tree,
    });
  },
};

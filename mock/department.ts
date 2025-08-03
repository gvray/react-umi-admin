import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { sleep } from 'ts-copilot';

const uuid = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

// 模拟部门数据
const departmentData = new Map();
let index = 15;

// 预设的部门层级结构
const departmentHierarchy = [
  {
    departmentId: 1,
    name: '总裁办',
    code: 'CEO',
    description: '公司最高管理机构',
    parentId: null,
    level: 1,
    sort: 1,
    managerId: 1,
    managerName: '张总',
    status: 'active',
    phone: '010-12345678',
    email: 'ceo@company.com',
    address: '北京市朝阳区总部大厦A座',
  },
  {
    departmentId: 2,
    name: '技术部',
    code: 'TECH',
    description: '负责公司技术研发',
    parentId: 1,
    level: 2,
    sort: 1,
    managerId: 2,
    managerName: '李技术',
    status: 'active',
    phone: '010-12345679',
    email: 'tech@company.com',
    address: '北京市朝阳区总部大厦B座',
  },
  {
    departmentId: 3,
    name: '产品部',
    code: 'PRODUCT',
    description: '负责产品规划与设计',
    parentId: 1,
    level: 2,
    sort: 2,
    managerId: 3,
    managerName: '王产品',
    status: 'active',
    phone: '010-12345680',
    email: 'product@company.com',
    address: '北京市朝阳区总部大厦C座',
  },
  {
    departmentId: 4,
    name: '市场部',
    code: 'MARKET',
    description: '负责市场推广与营销',
    parentId: 1,
    level: 2,
    sort: 3,
    managerId: 4,
    managerName: '赵市场',
    status: 'active',
    phone: '010-12345681',
    email: 'market@company.com',
    address: '北京市朝阳区总部大厦D座',
  },
  {
    departmentId: 5,
    name: '人事部',
    code: 'HR',
    description: '负责人力资源管理',
    parentId: 1,
    level: 2,
    sort: 4,
    managerId: 5,
    managerName: '刘人事',
    status: 'active',
    phone: '010-12345682',
    email: 'hr@company.com',
    address: '北京市朝阳区总部大厦E座',
  },
  {
    departmentId: 6,
    name: '财务部',
    code: 'FINANCE',
    description: '负责财务管理',
    parentId: 1,
    level: 2,
    sort: 5,
    managerId: 6,
    managerName: '陈财务',
    status: 'active',
    phone: '010-12345683',
    email: 'finance@company.com',
    address: '北京市朝阳区总部大厦F座',
  },
  // 技术部下的子部门
  {
    departmentId: 7,
    name: '前端开发组',
    code: 'FRONTEND',
    description: '负责前端开发',
    parentId: 2,
    level: 3,
    sort: 1,
    managerId: 7,
    managerName: '前端组长',
    status: 'active',
    phone: '010-12345684',
    email: 'frontend@company.com',
    address: '北京市朝阳区总部大厦B座301',
  },
  {
    departmentId: 8,
    name: '后端开发组',
    code: 'BACKEND',
    description: '负责后端开发',
    parentId: 2,
    level: 3,
    sort: 2,
    managerId: 8,
    managerName: '后端组长',
    status: 'active',
    phone: '010-12345685',
    email: 'backend@company.com',
    address: '北京市朝阳区总部大厦B座302',
  },
  {
    departmentId: 9,
    name: '测试组',
    code: 'QA',
    description: '负责软件测试',
    parentId: 2,
    level: 3,
    sort: 3,
    managerId: 9,
    managerName: '测试组长',
    status: 'active',
    phone: '010-12345686',
    email: 'qa@company.com',
    address: '北京市朝阳区总部大厦B座303',
  },
  // 产品部下的子部门
  {
    departmentId: 10,
    name: '产品策划组',
    code: 'PLANNING',
    description: '负责产品策划',
    parentId: 3,
    level: 3,
    sort: 1,
    managerId: 10,
    managerName: '策划组长',
    status: 'active',
    phone: '010-12345687',
    email: 'planning@company.com',
    address: '北京市朝阳区总部大厦C座301',
  },
  {
    departmentId: 11,
    name: '设计组',
    code: 'DESIGN',
    description: '负责UI/UX设计',
    parentId: 3,
    level: 3,
    sort: 2,
    managerId: 11,
    managerName: '设计组长',
    status: 'active',
    phone: '010-12345688',
    email: 'design@company.com',
    address: '北京市朝阳区总部大厦C座302',
  },
  // 市场部下的子部门
  {
    departmentId: 12,
    name: '市场推广组',
    code: 'PROMOTION',
    description: '负责市场推广',
    parentId: 4,
    level: 3,
    sort: 1,
    managerId: 12,
    managerName: '推广组长',
    status: 'active',
    phone: '010-12345689',
    email: 'promotion@company.com',
    address: '北京市朝阳区总部大厦D座301',
  },
  {
    departmentId: 13,
    name: '商务拓展组',
    code: 'BD',
    description: '负责商务拓展',
    parentId: 4,
    level: 3,
    sort: 2,
    managerId: 13,
    managerName: '商务组长',
    status: 'active',
    phone: '010-12345690',
    email: 'bd@company.com',
    address: '北京市朝阳区总部大厦D座302',
  },
  // 人事部下的子部门
  {
    departmentId: 14,
    name: '招聘组',
    code: 'RECRUIT',
    description: '负责人才招聘',
    parentId: 5,
    level: 3,
    sort: 1,
    managerId: 14,
    managerName: '招聘组长',
    status: 'active',
    phone: '010-12345691',
    email: 'recruit@company.com',
    address: '北京市朝阳区总部大厦E座301',
  },
  {
    departmentId: 15,
    name: '培训组',
    code: 'TRAINING',
    description: '负责员工培训',
    parentId: 5,
    level: 3,
    sort: 2,
    managerId: 15,
    managerName: '培训组长',
    status: 'active',
    phone: '010-12345692',
    email: 'training@company.com',
    address: '北京市朝阳区总部大厦E座302',
  },
];

// 初始化部门数据
departmentHierarchy.forEach((dept) => {
  const department = {
    ...dept,
    createdAt: dayjs()
      .subtract(Math.floor(Math.random() * 100), 'day')
      .format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: dayjs()
      .subtract(Math.floor(Math.random() * 30), 'day')
      .format('YYYY-MM-DD HH:mm:ss'),
    createdBy: 'admin',
    employeeCount: Math.floor(Math.random() * 50) + 5,
    positionCount: Math.floor(Math.random() * 10) + 2,
  };
  departmentData.set(dept.departmentId, department);
});

// 构建树形结构的辅助函数
function buildDepartmentTree(
  departments: any[],
  parentId: number | null = null,
): any[] {
  return departments
    .filter((dept) => dept.parentId === parentId)
    .map((dept) => ({
      ...dept,
      children: buildDepartmentTree(departments, dept.departmentId),
    }));
}

export default {
  // 获取部门树结构 - 必须在参数路由之前
  'GET /api/departments/tree': async (req: Request, res: Response) => {
    await sleep(300);

    const departments = [...departmentData.values()];
    const tree = buildDepartmentTree(departments);

    res.json({
      success: true,
      data: tree,
    });
  },

  // 获取部门统计信息 - 必须在参数路由之前
  'GET /api/departments/stats': async (req: Request, res: Response) => {
    await sleep(200);

    const departments = [...departmentData.values()];
    const stats = {
      total: departments.length,
      active: departments.filter((d) => d.status === 'active').length,
      inactive: departments.filter((d) => d.status === 'inactive').length,
      byLevel: [1, 2, 3, 4, 5].map((level) => ({
        level,
        count: departments.filter((d) => d.level === level).length,
      })),
      totalEmployees: departments.reduce(
        (sum, dept) => sum + (dept.employeeCount || 0),
        0,
      ),
      totalPositions: departments.reduce(
        (sum, dept) => sum + (dept.positionCount || 0),
        0,
      ),
    };

    res.json({
      success: true,
      data: stats,
    });
  },

  // 搜索部门 - 必须在参数路由之前
  'GET /api/departments/search': async (req: Request, res: Response) => {
    const { keyword } = req.query;
    await sleep(300);

    if (!keyword) {
      res.json({
        success: true,
        data: [],
      });
      return;
    }

    const departments = [...departmentData.values()].filter(
      (item) =>
        item.name.includes(keyword as string) ||
        item.code.includes(keyword as string) ||
        item.description?.includes(keyword as string),
    );

    res.json({
      success: true,
      data: departments,
    });
  },

  // 批量删除部门 - 必须在参数路由之前
  'POST /api/departments/batch-delete': async (req: Request, res: Response) => {
    const { ids } = req.body;
    await sleep(400);

    if (!Array.isArray(ids) || ids.length === 0) {
      res.json({
        success: false,
        code: 400,
        message: '请选择要删除的部门',
        data: null,
        showType: 2,
      });
      return;
    }

    // 检查是否有子部门
    for (const id of ids) {
      const hasChildren = [...departmentData.values()].some(
        (dept) => dept.parentId === Number(id),
      );
      if (hasChildren) {
        const dept = departmentData.get(Number(id));
        res.json({
          success: false,
          code: 400,
          message: `部门"${dept?.name}"下存在子部门，无法删除`,
          data: null,
          showType: 2,
        });
        return;
      }
    }

    let deletedCount = 0;
    ids.forEach((id) => {
      if (departmentData.has(Number(id))) {
        departmentData.delete(Number(id));
        deletedCount++;
      }
    });

    res.json({
      success: true,
      data: { deletedCount },
      message: `成功删除 ${deletedCount} 个部门`,
    });
  },

  // 获取部门列表
  'GET /api/departments': async (req: Request, res: Response) => {
    const {
      current = 1,
      pageSize = 10,
      name,
      code,
      parentId,
      level,
      managerId,
      status,
      sortField,
      sortOrder,
    } = req.query;
    await sleep(300);

    let departments = [...departmentData.values()];

    // 筛选
    if (name) {
      departments = departments.filter((item) =>
        item.name.includes(name as string),
      );
    }
    if (code) {
      departments = departments.filter((item) =>
        item.code.includes(code as string),
      );
    }
    if (parentId !== undefined) {
      departments = departments.filter(
        (item) => item.parentId === Number(parentId),
      );
    }
    if (level) {
      departments = departments.filter((item) => item.level === Number(level));
    }
    if (managerId) {
      departments = departments.filter(
        (item) => item.managerId === Number(managerId),
      );
    }
    if (status) {
      departments = departments.filter((item) => item.status === status);
    }

    // 排序
    if (sortField && sortOrder) {
      departments.sort((a, b) => {
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
      departments.sort((a, b) => a.sort - b.sort);
    }

    // 分页
    const total = departments.length;
    const start = (Number(current) - 1) * Number(pageSize);
    const end = start + Number(pageSize);
    const data = departments.slice(start, end);

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

  // 获取单个部门详情
  'GET /api/departments/:id': async (req: Request, res: Response) => {
    const { id } = req.params;
    await sleep(200);

    const department = departmentData.get(Number(id));
    if (!department) {
      res.status(404).json({
        success: false,
        code: 404,
        message: '部门不存在',
        data: null,
      });
      return;
    }

    res.json({
      success: true,
      data: department,
    });
  },

  // 创建部门
  'POST /api/departments': async (req: Request, res: Response) => {
    const {
      name,
      code,
      description,
      parentId,
      sort,
      managerId,
      status,
      phone,
      email,
      address,
    } = req.body;
    await sleep(500);

    // 检查编码是否重复
    const existingDepartment = [...departmentData.values()].find(
      (item) => item.code === code,
    );
    if (existingDepartment) {
      res.json({
        success: false,
        code: 400,
        message: '部门编码已存在',
        data: null,
        showType: 2,
      });
      return;
    }

    const newDepartmentId = index + 1;
    index += 1;

    // 计算部门级别
    let level = 1;
    if (parentId) {
      const parentDept = departmentData.get(Number(parentId));
      if (parentDept) {
        level = parentDept.level + 1;
      }
    }

    // 获取父部门名称
    let parentName = '';
    if (parentId) {
      const parentDept = departmentData.get(Number(parentId));
      if (parentDept) {
        parentName = parentDept.name;
      }
    }

    const newDepartment = {
      departmentId: newDepartmentId,
      name,
      code,
      description,
      parentId: parentId || null,
      parentName,
      level,
      sort: sort || 1,
      managerId,
      managerName: managerId ? `管理员${managerId}` : '',
      status: status || 'active',
      phone,
      email,
      address,
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      createdBy: 'admin',
      employeeCount: 0,
      positionCount: 0,
    };

    departmentData.set(newDepartmentId, newDepartment);

    res.json({
      success: true,
      data: newDepartment,
      message: '部门创建成功',
    });
  },

  // 更新部门
  'PATCH /api/departments/:id': async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    await sleep(400);

    const department = departmentData.get(Number(id));
    if (!department) {
      res.status(404).json({
        success: false,
        code: 404,
        message: '部门不存在',
        data: null,
      });
      return;
    }

    // 如果更新编码，检查是否重复
    if (updateData.code && updateData.code !== department.code) {
      const existingDepartment = [...departmentData.values()].find(
        (item) => item.code === updateData.code,
      );
      if (existingDepartment) {
        res.json({
          success: false,
          code: 400,
          message: '部门编码已存在',
          data: null,
          showType: 2,
        });
        return;
      }
    }

    // 更新父部门信息
    if (updateData.parentId !== undefined) {
      if (updateData.parentId) {
        const parentDept = departmentData.get(Number(updateData.parentId));
        if (parentDept) {
          updateData.parentName = parentDept.name;
          updateData.level = parentDept.level + 1;
        }
      } else {
        updateData.parentName = '';
        updateData.level = 1;
      }
    }

    // 更新管理员信息
    if (updateData.managerId) {
      updateData.managerName = `管理员${updateData.managerId}`;
    }

    const updatedDepartment = {
      ...department,
      ...updateData,
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };

    departmentData.set(Number(id), updatedDepartment);

    res.json({
      success: true,
      data: updatedDepartment,
      message: '部门更新成功',
    });
  },

  // 删除部门
  'DELETE /api/departments/:id': async (req: Request, res: Response) => {
    const { id } = req.params;
    await sleep(300);

    const department = departmentData.get(Number(id));
    if (!department) {
      res.status(404).json({
        success: false,
        code: 404,
        message: '部门不存在',
        data: null,
      });
      return;
    }

    // 检查是否有子部门
    const hasChildren = [...departmentData.values()].some(
      (dept) => dept.parentId === Number(id),
    );
    if (hasChildren) {
      res.json({
        success: false,
        code: 400,
        message: '该部门下存在子部门，无法删除',
        data: null,
        showType: 2,
      });
      return;
    }

    departmentData.delete(Number(id));

    res.json({
      success: true,
      data: null,
      message: '部门删除成功',
    });
  },

  // 更新部门状态
  'PATCH /api/departments/:id/status': async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    await sleep(300);

    const department = departmentData.get(Number(id));
    if (!department) {
      res.status(404).json({
        success: false,
        code: 404,
        message: '部门不存在',
        data: null,
      });
      return;
    }

    const updatedDepartment = {
      ...department,
      status,
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };

    departmentData.set(Number(id), updatedDepartment);

    res.json({
      success: true,
      data: updatedDepartment,
      message: `部门状态${status === 'active' ? '启用' : '禁用'}成功`,
    });
  },

  // 获取部门下的员工列表
  'GET /api/departments/:id/employees': async (req: Request, res: Response) => {
    const { id } = req.params;
    await sleep(300);

    const department = departmentData.get(Number(id));
    if (!department) {
      res.status(404).json({
        success: false,
        code: 404,
        message: '部门不存在',
        data: null,
      });
      return;
    }

    // 模拟员工数据
    const employees = [];
    for (let i = 1; i <= department.employeeCount; i++) {
      employees.push({
        userId: uuid(),
        username: `user${i}`,
        nickname: `员工${i}`,
        email: `user${i}@company.com`,
        departmentId: department.departmentId,
        departmentName: department.name,
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

  // 获取部门下的职位列表
  'GET /api/departments/:id/positions': async (req: Request, res: Response) => {
    const { id } = req.params;
    await sleep(300);

    const department = departmentData.get(Number(id));
    if (!department) {
      res.status(404).json({
        success: false,
        code: 404,
        message: '部门不存在',
        data: null,
      });
      return;
    }

    // 模拟职位数据
    const positions = [];
    const positionNames = ['经理', '主管', '专员', '助理', '实习生'];
    for (let i = 1; i <= department.positionCount; i++) {
      positions.push({
        positionId: i,
        name: `${department.name}${positionNames[i % positionNames.length]}`,
        code: `${department.code}_POS${i}`,
        departmentId: department.departmentId,
        departmentName: department.name,
        level: Math.floor(Math.random() * 5) + 1,
        status: Math.random() > 0.2 ? 'active' : 'inactive',
      });
    }

    res.json({
      success: true,
      data: positions,
    });
  },

  // 移动部门到新的父部门
  'PATCH /api/departments/:id/move': async (req: Request, res: Response) => {
    const { id } = req.params;
    const { parentId } = req.body;
    await sleep(400);

    const department = departmentData.get(Number(id));
    if (!department) {
      res.status(404).json({
        success: false,
        code: 404,
        message: '部门不存在',
        data: null,
      });
      return;
    }

    // 检查是否移动到自己的子部门
    if (parentId) {
      const targetParent = departmentData.get(Number(parentId));
      if (!targetParent) {
        res.json({
          success: false,
          code: 400,
          message: '目标父部门不存在',
          data: null,
          showType: 2,
        });
        return;
      }

      // 简单检查：不能移动到自己的子部门
      if (Number(parentId) === Number(id)) {
        res.json({
          success: false,
          code: 400,
          message: '不能将部门移动到自己',
          data: null,
          showType: 2,
        });
        return;
      }
    }

    // 更新部门信息
    let parentName = '';
    let level = 1;
    if (parentId) {
      const parentDept = departmentData.get(Number(parentId));
      if (parentDept) {
        parentName = parentDept.name;
        level = parentDept.level + 1;
      }
    }

    const updatedDepartment = {
      ...department,
      parentId: parentId || null,
      parentName,
      level,
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };

    departmentData.set(Number(id), updatedDepartment);

    res.json({
      success: true,
      data: updatedDepartment,
      message: '部门移动成功',
    });
  },

  // 更新部门排序
  'PATCH /api/departments/:id/sort': async (req: Request, res: Response) => {
    const { id } = req.params;
    const { sort } = req.body;
    await sleep(300);

    const department = departmentData.get(Number(id));
    if (!department) {
      res.status(404).json({
        success: false,
        code: 404,
        message: '部门不存在',
        data: null,
      });
      return;
    }

    const updatedDepartment = {
      ...department,
      sort,
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };

    departmentData.set(Number(id), updatedDepartment);

    res.json({
      success: true,
      data: updatedDepartment,
      message: '部门排序更新成功',
    });
  },

  // 设置部门主管
  'PATCH /api/departments/:id/manager': async (req: Request, res: Response) => {
    const { id } = req.params;
    const { managerId } = req.body;
    await sleep(300);

    const department = departmentData.get(Number(id));
    if (!department) {
      res.status(404).json({
        success: false,
        code: 404,
        message: '部门不存在',
        data: null,
      });
      return;
    }

    const updatedDepartment = {
      ...department,
      managerId,
      managerName: managerId ? `管理员${managerId}` : '',
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };

    departmentData.set(Number(id), updatedDepartment);

    res.json({
      success: true,
      data: updatedDepartment,
      message: '部门主管设置成功',
    });
  },

  // 获取子部门列表
  'GET /api/departments/:id/children': async (req: Request, res: Response) => {
    const { id } = req.params;
    await sleep(300);

    const department = departmentData.get(Number(id));
    if (!department) {
      res.status(404).json({
        success: false,
        code: 404,
        message: '部门不存在',
        data: null,
      });
      return;
    }

    const children = [...departmentData.values()]
      .filter((dept) => dept.parentId === Number(id))
      .sort((a, b) => a.sort - b.sort);

    res.json({
      success: true,
      data: children,
    });
  },
};

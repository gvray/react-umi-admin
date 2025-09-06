const routes = [
  { path: '/login', component: 'Login', layout: false },
  {
    path: '/',
    component: '@/wrappers/RouteGuard',
    routes: [
      {
        path: '/',
        component: 'Dashboard',
        meta: {
          title: '仪表板',
          permissions: [],
        },
      },
      {
        path: '/profile',
        component: 'Profile',
        meta: {
          title: '个人资料',
          permissions: [],
        },
      },
      {
        path: '/docs',
        component: 'Docs',
        meta: {
          title: '文档',
          permissions: [],
        },
      },
    ],
  },
  {
    path: '/system',
    component: '@/wrappers/RouteGuard',
    routes: [
      {
        path: '/system/user',
        component: 'User',
        meta: {
          title: '用户管理',
          permissions: ['user:view'],
        },
      },
      {
        path: '/system/resource',
        component: 'Resource',
        meta: {
          title: '资源管理',
          permissions: ['resource:view'],
        },
      },
      {
        path: '/system/role',
        component: 'Role',
        meta: {
          title: '角色管理',
          permissions: ['role:view'],
        },
      },
      {
        path: '/system/permission',
        component: 'Permission',
        meta: {
          title: '权限管理',
          permissions: ['permission:view'],
        },
      },
      {
        path: '/system/department',
        component: 'Department',
        meta: {
          title: '部门管理',
          permissions: ['department:view'],
        },
      },
      {
        path: '/system/position',
        component: 'Position',
        meta: {
          title: '职位管理',
          permissions: ['position:view'],
        },
      },
      {
        path: '/system/dictionary',
        component: 'Dictionary',
        meta: {
          title: '字典管理',
          permissions: ['dictionary:view'],
        },
      },
      {
        path: '/system/dictionary/items/:typeId',
        component: 'Dictionary/Items',
        meta: {
          title: '字典项管理',
          permissions: ['dictionary:view'],
        },
      },
      {
        path: '/system/config',
        component: 'Config',
        meta: {
          title: '系统配置',
          permissions: ['config:view'],
        },
      },
      // 用户分配角色
      {
        path: '/system/user-auth/role/:userId',
        component: 'User/AuthRole',
        meta: {
          title: '用户分配角色',
          permissions: ['user:update'],
        },
      },
      // 角色分配权限
      {
        path: '/system/role-auth/permission/:roleId',
        component: 'Role/AuthPermission',
        meta: {
          title: '角色分配权限',
          permissions: ['role:update'],
        },
      },
      // 角色分配用户
      {
        path: '/system/role-auth/user/:roleId',
        component: 'Role/AuthUser',
        meta: {
          title: '角色分配用户',
          permissions: ['role:update'],
        },
      },
    ],
  },
  { path: '*', component: '404' },
];

export default routes;

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
          permissions: ['system:user:view'],
        },
      },
      {
        path: '/system/role',
        component: 'Role',
        meta: {
          title: '角色管理',
          permissions: ['system:role:view'],
        },
      },
      {
        path: '/system/permission',
        component: 'Permission',
        meta: {
          title: '权限管理',
          permissions: ['system:permission:view'],
        },
      },
      {
        path: '/system/department',
        component: 'Department',
        meta: {
          title: '部门管理',
          permissions: ['system:department:view'],
        },
      },
      {
        path: '/system/position',
        component: 'Position',
        meta: {
          title: '职位管理',
          permissions: ['system:position:view'],
        },
      },
      {
        path: '/system/dictionary',
        component: 'Dictionary',
        meta: {
          title: '字典管理',
          permissions: ['system:dictionary:view'],
        },
      },
      {
        path: '/system/dictionary/items/:typeId',
        component: 'Dictionary/Items',
        meta: {
          title: '字典项管理',
          permissions: ['system:dictionary:view'],
        },
      },
      {
        path: '/system/config',
        component: 'Config',
        meta: {
          title: '系统配置',
          permissions: ['system:config:view'],
        },
      },
      {
        path: '/system/log',
        meta: {
          title: '日志管理',
          permissions: ['system:log:view'],
        },
        routes: [
          {
            path: '/system/log/login',
            component: 'Log/Login',
            meta: {
              title: '登录日志',
              permissions: ['system:log:view'],
            },
          },
          {
            path: '/system/log/operation',
            component: 'Log/Operation',
            meta: {
              title: '操作日志',
              permissions: ['system:log:view'],
            },
          },
        ],
      },
      // 用户分配角色
      {
        path: '/system/user-auth/role/:userId',
        component: 'User/AuthRole',
        meta: {
          title: '用户分配角色',
          permissions: ['system:user:update'],
        },
      },
      // 角色分配权限
      {
        path: '/system/role-auth/permission/:roleId',
        component: 'Role/AuthPermission',
        meta: {
          title: '角色分配权限',
          permissions: ['system:role:update'],
        },
      },
      // 角色分配用户
      {
        path: '/system/role-auth/user/:roleId',
        component: 'Role/AuthUser',
        meta: {
          title: '角色分配用户',
          permissions: ['system:role:update'],
        },
      },
    ],
  },
  { path: '*', component: '404' },
];

export default routes;

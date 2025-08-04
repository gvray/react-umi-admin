const routes = [
  { path: '/login', component: 'Login', layout: false },
  {
    path: '/',
    routes: [
      {
        path: '/',
        component: 'Dashboard',
      },

      {
        path: '/profile',
        component: 'Profile',
      },

      {
        path: '/docs',
        component: 'Docs',
      },
    ],
  },
  {
    path: '/system',
    routes: [
      {
        path: '/system/user',
        component: 'User',
      },
      {
        path: '/system/resource',
        component: 'Resource',
      },
      {
        path: '/system/role',
        component: 'Role',
      },
      {
        path: '/system/permission',
        component: 'Permission',
      },
      {
        path: '/system/department',
        component: 'Department',
      },
      {
        path: '/system/position',
        component: 'Position',
      },
    ],
  },
  { path: '*', component: '404' },
];

export default routes;

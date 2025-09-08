import { defineConfig } from 'umi';
// 用于本地开发环境, 用于本地高效开发
export default defineConfig({
  mock: process.env.APP_MOCK_ENABLED === 'true' ? {} : false,
  // 使用cheap-module-source-map提高开发效率，在速度和调试体验间取得平衡
  devtool: 'cheap-module-source-map',
  // 启用快速刷新以提高开发体验
  fastRefresh: true,
  // 禁用MFSU以避免构建问题
  mfsu: false,
  proxy: {
    '/dev-api': {
      target: 'http://jsonplaceholder.typicode.com/',
      changeOrigin: true,
      pathRewrite: { '^/dev-api': '' },
    },
  },
});

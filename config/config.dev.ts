import { defineConfig } from 'umi';
console.log('process.env.APP_MOCK_ENABLED', process.env.APP_MOCK_ENABLED);
// 用于本地开发环境, 用于本地高校开发
export default defineConfig({
  mock: process.env.APP_MOCK_ENABLED === 'true' ? {} : false,
  proxy: {
    '/dev-api': {
      target: 'http://jsonplaceholder.typicode.com/',
      changeOrigin: true,
      pathRewrite: { '^/dev-api': '' },
    },
  },
});

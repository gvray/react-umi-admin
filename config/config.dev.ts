import { defineConfig } from 'umi';
console.log('process.env.APP_MOCK_ENABLED', process.env.APP_MOCK_ENABLED);
// 用于本地开发环境, 用于本地高校开发
export default defineConfig({
  mock: process.env.APP_MOCK_ENABLED === 'true' ? {} : false,
  devtool: 'source-map', // 或 inline-source-map, cheap-module-source-map 等
  proxy: {
    '/dev-api': {
      target: 'http://jsonplaceholder.typicode.com/',
      changeOrigin: true,
      pathRewrite: { '^/dev-api': '' },
    },
  },
});

import { defineConfig } from 'umi';

// 用于生产环境, 针对项目体积和加载性能进行优化配置
export default defineConfig({
  // 启用文件名hash
  hash: true,
  // 代码分割策略优化
  codeSplitting: {
    jsStrategy: 'granularChunks',
  },
  // 禁用MFSU以避免构建问题
  mfsu: false,
  // CSS压缩由默认配置处理
  // 配置webpack优化
  chainWebpack: function (config) {
    // 设置chunk大小警告阈值
    config.performance
      .hints('warning')
      .maxEntrypointSize(1000000)
      .maxAssetSize(1000000);
    // 优化模块ID命名方式，使其更稳定
    config.optimization.moduleIds('deterministic');
    // 配置代码压缩和移除console
    config.optimization.minimize(true);
    if (config.plugins.has('terser')) {
      config.plugin('terser').tap((args) => {
        args[0].terserOptions = {
          ...args[0].terserOptions,
          compress: {
            ...args[0].terserOptions?.compress,
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info'],
          },
        };
        return args;
      });
    }

    // 添加gzip压缩插件
    const CompressionPlugin = require('compression-webpack-plugin');
    config.plugin('compression-webpack-plugin').use(CompressionPlugin, [
      {
        test: /\.(js|css|html|svg)$/,
        threshold: 10240, // 只有大小大于10kb的资源会被处理
        deleteOriginalAssets: false, // 保留原始文件
      },
    ]);

    return config;
  },
});

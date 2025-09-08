import { defineConfig } from 'umi';

// 用于测试环境，平衡开发便利性和生产环境性能
export default defineConfig({
  // 代码分割策略优化
  codeSplitting: {
    jsStrategy: 'granularChunks',
  },
  // 保留source map以便于测试环境调试
  devtool: 'source-map',
  // CSS压缩由默认配置处理
  // 禁用MFSU以避免构建问题
  mfsu: false,
  chainWebpack: function (config) {
    // 设置chunk大小警告阈值
    config.performance
      .hints('warning')
      .maxEntrypointSize(1000000)
      .maxAssetSize(1000000);

    // 配置代码压缩但保留console以便于测试环境调试
    if (config.plugins.has('terser')) {
      config.plugin('terser').tap((args) => {
        args[0].terserOptions = {
          ...args[0].terserOptions,
          compress: {
            ...args[0].terserOptions?.compress,
            drop_console: false, // 保留console
            drop_debugger: true, // 移除debugger
          },
        };
        return args;
      });
    }
    return config;
  },
});

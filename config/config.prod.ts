import { defineConfig } from 'umi';

// 用于生产环境, 针对项目体积和加载性能进行优化配置
export default defineConfig({
  // 代码分割策略优化
  codeSplitting: {
    jsStrategy: 'granularChunks',
  },
  jsMinifierOptions: {
    // terser配置，各环境可以在各自配置文件中覆盖
    compress: {
      drop_console: true,
      drop_debugger: true,
    },
  },
  // CSS压缩由默认配置处理
  // 配置webpack优化
  chainWebpack: function (config) {
    // 设置chunk大小警告阈值
    config.performance
      .hints('warning')
      .maxEntrypointSize(1000000)
      .maxAssetSize(1000000);

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

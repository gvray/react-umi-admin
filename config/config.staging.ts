import { defineConfig } from 'umi';

export default defineConfig({
  // https://umijs.org/docs/api/config#codesplitting
  codeSplitting: {
    jsStrategy: 'granularChunks',
  },
});

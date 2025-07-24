// 配置多环境下的环境变量
// 可以根据环境变量来配置不同的环境变量
const getEnv = () => {
  switch (process.env.APP_ENV) {
    case 'staging':
      return {
        __APP_OTHER__: 'URL_ADDRESS.xxx.com',
      };
    case 'prod':
      return {
        __APP_OTHER__: 'URL_ADDRESS.xxx.com',
      };
  }
};

const env = getEnv();

export default env;

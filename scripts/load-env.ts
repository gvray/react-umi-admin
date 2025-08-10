import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

export const loadEnvFromEnv = (env: string) => {
  const envPath = path.resolve(process.cwd(), `.env.${env}`);
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });

    console.log('⚙️ 环境变量检查:');
    console.table({
      __APP_ENV__: process.env.APP_ENV,
      __APP_API_URL__: process.env.APP_API_URL,
      __APP_API_TOKEN_KEY__: process.env.APP_API_TOKEN_KEY,
      __APP_API_TIMEOUT__: process.env.APP_API_TIMEOUT,
      __APP_VERSION__: process.env.APP_VERSION,
      __APP_BUILD_TIME__: process.env.APP_BUILD_TIME,
      __APP_CDN_URL__: process.env.APP_CDN_URL,
      __APP_SENTRY_DSN__: process.env.APP_SENTRY_DSN,
      __APP_TRACKING_ID__: process.env.APP_TRACKING_ID,
      __APP_MOCK_ENABLED__: process.env.APP_MOCK_ENABLED,
    });

    const example = dotenv.parse(fs.readFileSync('.env.example'));
    const missing = Object.keys(example).filter((key) => !process.env[key]);
    if (missing.length) {
      console.warn(`⚠️ Missing required env vars: ${missing.join(', ')}`);
    }
  } else {
    console.warn(`⚠️ .env.${env} file not found`);
  }
};

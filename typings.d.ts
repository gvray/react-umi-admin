import 'umi/typings';

declare global {
  const __APP_ENV__: 'dev' | 'staging' | 'prod';
  const __APP_API_URL__: string;
  const __APP_API_TOKEN_KEY__: string;
  const __APP_API_TIMEOUT__: number;
  const __APP_VERSION__: string;
  const __APP_BUILD_TIME__: string;
  const __APP_CDN_URL__: string;
  const __APP_SENTRY_DSN__: string;
  const __APP_TRACKING_ID__: string;
  const __APP_MOCK_ENABLED__: boolean;
}

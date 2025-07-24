import { execSync } from 'child_process';
import minimist from 'minimist';
import path from 'path';
import { rimraf } from 'rimraf';
import { loadEnvFromEnv } from './load-env';

const args = minimist(process.argv.slice(2));

const mode = args.mode || 'dev';

loadEnvFromEnv(mode);

process.env.UMI_ENV = mode;
process.env.APP_MOCK_ENABLED = 'false';
// 清理dist rimraf
rimraf.sync(path.resolve(__dirname, '../dist', mode));
// 执行 lint
// execSync(`npx eslint --ext .ts,.tsx src`, { stdio: 'inherit' });
// 执行 prettier
// execSync(`npx prettier --write src`, { stdio: 'inherit' });
// 执行 type-check
// execSync(`npx tsc --noEmit`, { stdio: 'inherit' });

// 执行 umi 构建
execSync(`npx umi build`, { stdio: 'inherit' });

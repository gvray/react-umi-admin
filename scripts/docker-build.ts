#!/usr/bin/env node

/**
 * Docker 镜像构建脚本（跨平台）
 * 包装 docker/scripts/build.sh，提供跨平台支持
 */

import { spawn } from 'child_process';
import { platform } from 'os';
import path from 'path';

const currentPlatform = platform();
const scriptPath = path.join(__dirname, '../docker/scripts/build.sh');

// 获取命令行参数（跳过 node 和脚本路径）
const args = process.argv.slice(2);

// 根据平台选择执行方式
// - macOS (darwin) / Linux: 使用 sh
// - Windows (win32): 使用 bash (需要 Git Bash 或 WSL)
const command = currentPlatform === 'win32' ? 'bash' : 'sh';
const shellArgs = [scriptPath, ...args];

console.log(`🚀 执行 Docker 构建脚本...`);
console.log(`平台: ${currentPlatform}`);
console.log(`命令: ${command} ${shellArgs.join(' ')}\n`);

// 执行脚本，传递所有输出和退出码
spawn(command, shellArgs, {
  stdio: 'inherit',
  shell: true,
}).on('exit', (code) => {
  process.exit(code || 0);
});

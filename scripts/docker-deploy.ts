/**
 * Docker 容器部署脚本（跨平台）
 * 包装 docker/scripts/deploy.sh，提供跨平台支持
 */

import { spawn } from 'child_process';
import { platform } from 'os';
import path from 'path';

const currentPlatform = platform();
const scriptPath = path.join(__dirname, '../docker/scripts/deploy.sh');

// 获取命令行参数（跳过 node 和脚本路径）
// 过滤掉 pnpm 传递的 -- 分隔符
const args = process.argv.slice(2).filter((arg) => arg !== '--');

// 统一使用 bash（与脚本 shebang #!/bin/bash 保持一致）
// - macOS (darwin) / Linux: bash
// - Windows (win32): bash (需要 WSL 或 Git Bash)
const command = 'bash';
const shellArgs = [scriptPath, ...args];

console.log(`🚀 执行 Docker 部署脚本...`);
console.log(`平台: ${currentPlatform}`);
console.log(`命令: ${command} ${shellArgs.join(' ')}\n`);

// 执行脚本，传递所有输出和退出码
// 不使用 shell: true 以提高安全性，直接执行 bash
spawn(command, shellArgs, {
  stdio: 'inherit',
}).on('exit', (code) => {
  process.exit(code || 0);
});

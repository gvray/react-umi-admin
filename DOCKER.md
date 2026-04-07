# Docker 部署文档

## 📦 概述

本项目提供了完整的 Docker 化解决方案，支持：

- ✅ 多阶段构建，优化镜像大小
- ✅ 多架构支持（amd64 + arm64）
- ✅ 生产级 Nginx 配置
- ✅ 健康检查和自动重启
- ✅ 一键构建和部署脚本
- ✅ Docker Compose 编排
- ✅ 安全扫描和优化

## 🚀 快速开始

### 方式一：使用 Makefile（推荐）

```bash
# 查看所有可用命令
make help

# 构建镜像
make build

# 部署应用
make deploy

# 查看状态
make status

# 查看日志
make logs
```

### 方式二：使用脚本

```bash
# 构建镜像
./scripts/build.sh

# 部署应用
./scripts/deploy.sh

# 查看帮助
./scripts/build.sh --help
./scripts/deploy.sh --help
```

### 方式三：使用 Docker Compose

```bash
# 启动所有服务
docker-compose up -d

# 查看状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 🏗️ 构建镜像

### 基础构建

```bash
# 构建本地镜像
make build

# 或使用脚本
./scripts/build.sh
```

### 指定版本构建

```bash
# 构建指定版本
./scripts/build.sh -v 1.0.0

# 构建并推送到仓库
./scripts/build.sh -v 1.0.0 -p
```

### 多架构构建

```bash
# 构建 amd64 + arm64 架构
make build-multiarch

# 或使用脚本
./scripts/build.sh -m
```

### 安全扫描

```bash
# 构建并扫描安全漏洞
make build-scan

# 或使用脚本
./scripts/build.sh -s
```

## 📦 部署应用

### 单容器部署

```bash
# 部署最新版本
make deploy

# 部署指定版本
VERSION=1.0.0 make deploy

# 或使用脚本
./scripts/deploy.sh -v 1.0.0
```

### Docker Compose 部署

```bash
# 启动所有服务
make deploy-compose

# 或直接使用 docker-compose
docker-compose up -d
```

### 回滚操作

```bash
# 回滚到上一个版本
make rollback

# 或使用脚本
./scripts/deploy.sh rollback
```

## 🔧 配置说明

### 环境变量

在部署时可以通过环境变量进行配置：

```bash
# Docker 仓库配置
export DOCKER_REGISTRY=docker.io
export DOCKER_NAMESPACE=your-namespace

# 版本配置
export VERSION=1.0.0

# 容器配置
export CONTAINER_NAME=react-umi-admin-web
export ENVIRONMENT=production
```

### Nginx 配置

Nginx 配置文件位于 `docker/` 目录：

- `nginx.conf` - 主配置文件
- `default.conf` - 站点配置文件

主要特性：

- ✅ Gzip 压缩
- ✅ 静态资源缓存
- ✅ API 代理配置
- ✅ 安全头设置
- ✅ SPA 路由支持

### 端口映射

默认端口映射：

- 前端应用：`8080:80`
- 后端 API（如需要）：`3000:3000`

修改端口：

```bash
# 修改 docker-compose.yml
ports:
  - "8888:80"  # 改为 8888 端口
```

## 📊 监控和日志

### 查看容器状态

```bash
# 查看状态
make status

# 查看资源使用
make stats

# 健康检查
make health
```

### 查看日志

```bash
# 实时查看日志
make logs

# 查看最近 100 行日志
docker-compose logs --tail=100

# 查看 Nginx 访问日志
tail -f logs/nginx/access.log

# 查看 Nginx 错误日志
tail -f logs/nginx/error.log
```

### 进入容器

```bash
# 进入容器 shell
make shell

# 或直接使用 docker
docker exec -it react-umi-admin-web sh
```

## 🔒 安全最佳实践

### 1. 使用非 root 用户

Dockerfile 已配置使用非 root 用户运行：

```dockerfile
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001
USER nextjs
```

### 2. 安全扫描

定期扫描镜像安全漏洞：

```bash
# 使用 Trivy 扫描
make build-scan

# 或手动扫描
trivy image react-umi-admin:latest
```

### 3. 最小化镜像

使用多阶段构建，最终镜像基于 `nginx:alpine`：

- 基础镜像：~50MB
- 应用代码：~10-20MB
- 总大小：~60-70MB

### 4. 安全头配置

Nginx 已配置安全响应头：

- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

## 🚀 CI/CD 集成

### GitHub Actions 示例

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker Image
        run: |
          ./scripts/build.sh -v ${{ github.ref_name }} -p

      - name: Deploy
        run: |
          ./scripts/deploy.sh -v ${{ github.ref_name }}
```

### GitLab CI 示例

```yaml
stages:
  - build
  - deploy

build:
  stage: build
  script:
    - ./scripts/build.sh -v $CI_COMMIT_TAG -p

deploy:
  stage: deploy
  script:
    - ./scripts/deploy.sh -v $CI_COMMIT_TAG
  only:
    - tags
```

## 🛠️ 故障排查

### 容器无法启动

```bash
# 查看容器日志
docker logs react-umi-admin-web

# 检查容器状态
docker inspect react-umi-admin-web

# 查看健康检查状态
docker inspect --format='{{.State.Health.Status}}' react-umi-admin-web
```

### 健康检查失败

```bash
# 手动测试健康检查
curl http://localhost:8080/health

# 进入容器检查
docker exec -it react-umi-admin-web sh
curl http://localhost/health
```

### 镜像构建失败

```bash
# 清理构建缓存
make clean

# 重新构建
make build

# 查看详细日志
docker build --no-cache --progress=plain .
```

### 端口冲突

```bash
# 查看端口占用
lsof -i :8080

# 修改端口映射
docker run -p 8888:80 react-umi-admin:latest
```

## 📚 常用命令速查

| 命令            | 说明         |
| --------------- | ------------ |
| `make build`    | 构建镜像     |
| `make deploy`   | 部署应用     |
| `make status`   | 查看状态     |
| `make logs`     | 查看日志     |
| `make rollback` | 回滚版本     |
| `make clean`    | 清理构建产物 |
| `make health`   | 健康检查     |
| `make shell`    | 进入容器     |
| `make stats`    | 资源使用     |

## 🔗 相关资源

- [Docker 官方文档](https://docs.docker.com/)
- [Nginx 官方文档](https://nginx.org/en/docs/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [多阶段构建最佳实践](https://docs.docker.com/build/building/multi-stage/)

## 📝 注意事项

1. **生产环境部署前**，请修改以下配置：

   - Docker 仓库地址和命名空间
   - 容器名称和端口映射
   - 环境变量配置
   - Nginx 配置（根据实际需求）

2. **API 代理配置**：

   - 如需代理后端 API，修改 `docker/default.conf` 中的 `upstream` 配置
   - 取消注释 `location /api/` 部分

3. **数据持久化**：

   - 日志文件已挂载到 `./logs/nginx`
   - 如需持久化其他数据，添加相应的 volume 配置

4. **资源限制**：
   - 生产环境建议添加资源限制（CPU、内存）
   - 在 `docker-compose.yml` 中添加 `deploy.resources` 配置

## 🎉 总结

通过以上配置，你已经拥有了一套完整的 Docker 化解决方案，包括：

- ✅ 优化的多阶段构建
- ✅ 生产级 Nginx 配置
- ✅ 完善的健康检查
- ✅ 便捷的构建和部署脚本
- ✅ 灵活的 Docker Compose 编排
- ✅ 安全扫描和最佳实践

现在可以开始使用 `make build` 和 `make deploy` 来构建和部署你的应用了！

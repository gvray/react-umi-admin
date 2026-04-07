# ==========================================
# Makefile for React UMI Admin
# 简化 Docker 操作命令
# ==========================================

.PHONY: help build push deploy rollback status logs clean test

# 默认目标
.DEFAULT_GOAL := help

# 变量定义
IMAGE_NAME := react-umi-admin
VERSION := latest
REGISTRY := docker.io
NAMESPACE := your-namespace
CONTAINER_NAME := react-umi-admin-web

# 帮助信息
help: ## 显示帮助信息
	@echo "React UMI Admin - Docker 命令"
	@echo ""
	@echo "使用方法: make [目标]"
	@echo ""
	@echo "可用目标:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

# 构建镜像
build: ## 构建 Docker 镜像
	@echo "构建镜像..."
	@./scripts/build.sh

build-push: ## 构建并推送镜像
	@echo "构建并推送镜像..."
	@./scripts/build.sh -p

build-multiarch: ## 多架构构建并推送
	@echo "多架构构建..."
	@./scripts/build.sh -m

build-scan: ## 构建并扫描安全漏洞
	@echo "构建并扫描..."
	@./scripts/build.sh -s

# 部署相关
deploy: ## 部署应用
	@echo "部署应用..."
	@./scripts/deploy.sh deploy

deploy-compose: ## 使用 docker-compose 部署
	@echo "使用 docker-compose 部署..."
	@docker-compose up -d

rollback: ## 回滚到上一个版本
	@echo "回滚应用..."
	@./scripts/deploy.sh rollback

# 容器管理
start: ## 启动容器
	@docker-compose start

stop: ## 停止容器
	@docker-compose stop

restart: ## 重启容器
	@docker-compose restart

status: ## 查看容器状态
	@./scripts/deploy.sh status

logs: ## 查看容器日志
	@docker-compose logs -f --tail=100

# 开发相关
dev: ## 启动开发环境
	@pnpm run dev

install: ## 安装依赖
	@pnpm install

lint: ## 代码检查
	@pnpm run lint

format: ## 代码格式化
	@pnpm run format

test: ## 运行测试
	@pnpm run test

# 清理相关
clean: ## 清理构建产物
	@echo "清理构建产物..."
	@rm -rf dist .umi .umi-production
	@docker builder prune -f

clean-all: ## 清理所有（包括 node_modules）
	@echo "清理所有..."
	@rm -rf dist .umi .umi-production node_modules
	@docker builder prune -af

# Docker 相关
docker-ps: ## 查看运行中的容器
	@docker ps

docker-images: ## 查看镜像列表
	@docker images $(IMAGE_NAME)

docker-clean: ## 清理未使用的 Docker 资源
	@docker system prune -f

# 生产构建
prod-build: ## 生产环境构建
	@pnpm run build

# 版本发布
release: ## 发布新版本（需要指定 VERSION）
	@echo "发布版本: $(VERSION)"
	@./scripts/build.sh -v $(VERSION) -p
	@./scripts/deploy.sh -v $(VERSION)

# 健康检查
health: ## 检查应用健康状态
	@curl -f http://localhost:8080/health || echo "应用未运行或不健康"

# 进入容器
shell: ## 进入容器 shell
	@docker exec -it $(CONTAINER_NAME) sh

# 查看容器资源使用
stats: ## 查看容器资源使用
	@docker stats $(CONTAINER_NAME)

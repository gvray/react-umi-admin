# ==========================================
# 多阶段构建 Dockerfile
# Stage 1: 依赖安装
# Stage 2: 构建应用
# Stage 3: 生产环境运行
# ==========================================

# ==========================================
# Stage 1: 依赖安装
# ==========================================
FROM node:18-alpine AS deps

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制依赖文件
COPY package.json pnpm-lock.yaml* ./

# 安装依赖（仅生产依赖）
RUN pnpm install --frozen-lockfile --prod=false

# ==========================================
# Stage 2: 构建应用
# ==========================================
FROM node:18-alpine AS builder

WORKDIR /app

# 从 deps 阶段复制 node_modules
COPY --from=deps /app/node_modules ./node_modules

# 复制源代码
COPY . .

# 设置构建环境变量
ENV NODE_ENV=production

# 安装 pnpm
RUN npm install -g pnpm

# 执行生产环境构建
RUN pnpm run build:prod

# 清理开发依赖，只保留生产依赖
RUN pnpm install --frozen-lockfile --prod

# ==========================================
# Stage 3: 生产环境运行
# ==========================================
FROM nginx:1.25-alpine AS runner

# 安装必要的工具
RUN apk add --no-cache curl tzdata

# 设置时区为上海
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# 复制 nginx 配置
COPY --chown=nextjs:nodejs docker/nginx.conf /etc/nginx/nginx.conf
COPY --chown=nextjs:nodejs docker/default.conf /etc/nginx/conf.d/default.conf

# 从 builder 阶段复制构建产物（生产环境构建输出在 dist/prod）
COPY --from=builder --chown=nextjs:nodejs /app/dist/prod /usr/share/nginx/html

# 创建日志目录
RUN mkdir -p /var/log/nginx && \
    chown -R nextjs:nodejs /var/log/nginx && \
    chown -R nextjs:nodejs /var/cache/nginx && \
    chown -R nextjs:nodejs /etc/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nextjs:nodejs /var/run/nginx.pid

# 切换到非 root 用户
USER nextjs

# 暴露端口
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]

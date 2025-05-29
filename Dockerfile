# 多阶段构建，优化镜像大小和安全性
FROM node:18-alpine AS base

# 设置工作目录
WORKDIR /app

# 安装必要的系统依赖
RUN apk add --no-cache libc6-compat dumb-init

# 复制 package 文件
COPY package*.json ./

# ===== 依赖安装阶段 =====
FROM base AS deps
# 安装生产依赖
RUN npm ci --only=production --legacy-peer-deps && npm cache clean --force

# ===== 构建阶段 =====
FROM base AS build
# 安装所有依赖（包括开发依赖）
RUN npm ci --legacy-peer-deps

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# ===== 生产运行阶段 =====
FROM node:18-alpine AS runtime

# 安装 dumb-init 用于正确的信号处理
RUN apk add --no-cache dumb-init

# 创建非 root 用户提高安全性
RUN addgroup -g 1001 -S nodejs && \
    adduser -S astro -u 1001 -G nodejs

# 设置工作目录
WORKDIR /app

# 复制生产依赖
COPY --from=deps --chown=astro:nodejs /app/node_modules ./node_modules

# 复制构建产物和必要文件
COPY --from=build --chown=astro:nodejs /app/dist ./dist
COPY --from=build --chown=astro:nodejs /app/package.json ./package.json

# 创建数据目录（用于存储用户数据文件）
RUN mkdir -p /app/data && chown -R astro:nodejs /app/data

# 切换到非 root 用户
USER astro

# 暴露端口
EXPOSE 4321

# 设置环境变量
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4321', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# 启动应用，使用 dumb-init 正确处理信号
CMD ["dumb-init", "node", "./dist/server/entry.mjs"] 
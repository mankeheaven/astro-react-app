FROM node:18-alpine AS base
WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm ci --only=production

# 构建应用
COPY . .
RUN npm run build

# 运行时
EXPOSE 4321
CMD node ./dist/server/entry.mjs
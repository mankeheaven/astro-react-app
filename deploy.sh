#!/bin/bash

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 开始部署 Astro React 应用...${NC}"

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker 未运行，请先启动 Docker${NC}"
    exit 1
fi

# 检查 docker-compose 是否安装
if ! command -v docker-compose &> /dev/null && ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ docker-compose 未安装${NC}"
    exit 1
fi

# 确保必要的目录存在
echo -e "${BLUE}📁 创建必要的目录...${NC}"
mkdir -p data logs ssl

# 设置目录权限
chmod 755 data logs

# 停止现有容器
echo -e "${YELLOW}📦 停止现有容器...${NC}"
docker-compose down

# 清理未使用的镜像（可选）
read -p "是否清理未使用的 Docker 镜像? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🧹 清理 Docker 镜像...${NC}"
    docker system prune -f
fi

# 拉取最新代码（如果使用 Git）
if [ -d ".git" ]; then
    echo -e "${BLUE}📥 更新代码...${NC}"
    git pull origin main || echo -e "${YELLOW}⚠️ Git pull 失败，继续使用本地代码${NC}"
fi

# 重新构建并启动
echo -e "${BLUE}🔨 构建并启动应用...${NC}"
docker-compose up -d --build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 应用启动失败${NC}"
    echo -e "${YELLOW}查看错误日志:${NC}"
    docker-compose logs astro-app
    exit 1
fi

# 等待服务启动
echo -e "${YELLOW}⏳ 等待服务启动...${NC}"
sleep 15

# 健康检查
echo -e "${BLUE}🔍 检查服务状态...${NC}"

# 检查容器是否运行
if docker-compose ps | grep -q "astro-react-app.*Up"; then
    echo -e "${GREEN}✅ 容器运行正常${NC}"
else
    echo -e "${RED}❌ 容器启动失败${NC}"
    docker-compose logs astro-app
    exit 1
fi

# 检查应用是否响应
if curl -f http://localhost:4321 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 应用部署成功！${NC}"
    echo -e "${GREEN}🌐 访问地址: http://localhost:4321${NC}"
    
    # 如果启用了 Nginx
    if docker-compose ps | grep -q "astro-nginx.*Up"; then
        echo -e "${GREEN}🌐 Nginx 代理: http://localhost${NC}"
    fi
else
    echo -e "${RED}❌ 应用启动失败，请检查日志:${NC}"
    docker-compose logs astro-app
    exit 1
fi

# 显示运行状态
echo -e "\n${BLUE}📊 服务状态:${NC}"
docker-compose ps

echo -e "\n${BLUE}💾 数据卷:${NC}"
docker volume ls | grep astro

echo -e "\n${YELLOW}常用命令:${NC}"
echo "  查看日志: docker-compose logs -f"
echo "  重启服务: docker-compose restart"
echo "  停止服务: docker-compose down"
echo "  进入容器: docker-compose exec astro-app sh"
echo "  查看状态: docker-compose ps"

echo -e "\n${GREEN}🎉 部署完成！${NC}" 
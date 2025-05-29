# Astro + React + TailwindCSS 全栈应用

这是一个使用 Astro、React、TailwindCSS 和 TypeScript 构建的现代全栈 Web 应用演示项目。

## 🚀 技术栈

- **Astro 5.8.0** - 现代静态站点生成器，支持服务端渲染
- **React 19** - 用于构建交互式用户界面
- **TailwindCSS 4** - 实用优先的 CSS 框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **Zod** - TypeScript 优先的数据验证库

## ✨ 功能特性

- ✅ **服务端渲染 (SSR)** - 支持动态内容和 API 路由
- ✅ **React 集成** - 使用 TSX 组件构建交互式界面
- ✅ **TailwindCSS 样式** - 现代响应式设计
- ✅ **TypeScript 支持** - 完整的类型安全
- ✅ **API 路由** - RESTful API 端点
- ✅ **数据验证** - 使用 Zod 进行输入验证
- ✅ **表单处理** - 完整的表单提交和验证流程
- ✅ **响应式设计** - 适配各种设备屏幕

## 📁 项目结构

```
astro-react-app/
├── src/
│   ├── components/          # React 组件
│   │   └── UserForm.tsx     # 用户表单组件
│   ├── layouts/             # 布局组件
│   │   └── Layout.astro     # 主布局
│   ├── pages/               # 页面和 API 路由
│   │   ├── api/             # API 端点
│   │   │   └── users.ts     # 用户 API 路由
│   │   └── index.astro      # 首页
│   └── assets/              # 静态资源
├── public/                  # 公共文件
├── astro.config.ts          # Astro 配置
├── tailwind.config.ts       # TailwindCSS 配置
├── tsconfig.json            # TypeScript 配置
└── package.json             # 项目依赖
```

## 🛠️ 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:4321` 启动。

### 3. 构建生产版本

```bash
npm run build
```

### 4. 预览生产版本

```bash
npm run preview
```

## 📋 API 端点

### GET /api/users
获取所有用户列表

**响应示例：**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "张三",
      "email": "zhang@example.com",
      "createdAt": "2024-01-01"
    }
  ]
}
```

### POST /api/users
创建新用户

**请求体：**
```json
{
  "name": "用户姓名",
  "email": "user@example.com",
  "message": "用户消息（至少10个字符）"
}
```

**响应示例：**
```json
{
  "success": true,
  "message": "感谢您的注册，张三！我们已收到您的信息。",
  "data": {
    "id": "abc123",
    "name": "张三",
    "email": "zhang@example.com",
    "message": "这是一条测试消息",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

## 🎯 主要组件

### UserForm.tsx
- 用户注册表单
- 实时表单验证
- 用户列表展示
- 响应式设计
- 错误处理和加载状态

### API 路由 (users.ts)
- RESTful API 设计
- Zod 数据验证
- TypeScript 类型安全
- 错误处理和状态码

## 🔧 配置说明

### Astro 配置 (astro.config.ts)
```typescript
export default defineConfig({
  integrations: [
    react(),      // React 集成
    tailwind()    // TailwindCSS 集成
  ],
  output: 'server', // 启用服务端渲染
});
```

### TailwindCSS 配置 (tailwind.config.ts)
- 配置内容扫描路径
- 支持所有 Astro 和 React 文件类型
- TypeScript 类型安全配置

## 🌟 开发特性

- **热重载** - 开发时自动刷新
- **类型检查** - 实时 TypeScript 错误检测
- **代码分割** - 自动优化打包
- **SEO 友好** - 服务端渲染支持
- **性能优化** - Astro 的岛屿架构

## 📝 使用说明

1. 打开应用首页
2. 填写用户注册表单（姓名、邮箱、消息）
3. 点击"注册"按钮提交表单
4. 查看提交结果和更新的用户列表
5. 所有数据都会实时验证和处理

## docker部署

```
docker build -t astro-app .
docker run -p 4321:4321 astro-app

```

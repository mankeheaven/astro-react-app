# Toast 提示系统使用指南

## 🎯 概述

本项目提供了完整的 Toast 提示解决方案，支持在 Astro 项目中使用。

## 🚀 快速开始

### 1. 原生 JavaScript Toast（推荐）

最简单且兼容性最好的方式：

```typescript
import toast from './src/utils/toast';

// 基本使用
toast.success('操作成功！');
toast.error('操作失败！');
toast.warning('警告信息');
toast.info('提示信息');

// 高级配置
toast.error('错误信息', {
  duration: 5000,
  position: 'top-center'
});
```

### 2. 在 API 请求中自动使用

Toast 已经集成到 `request.ts` 中：

```typescript
import { post } from './src/utils/request';

// 自动显示错误提示
const result = await post('/api/users', userData);

// 显示成功提示
const result = await post('/api/users', userData, {
  showSuccessToast: true,
  successMessage: '用户创建成功！'
});
```

## 📁 文件结构

```
src/
├── utils/
│   ├── toast.ts              # 原生 JavaScript Toast 管理器
│   └── request.ts            # 集成了 Toast 的 HTTP 请求封装
├── components/
│   ├── Toast.tsx             # React Toast 组件
│   ├── ToastContainer.tsx    # React Toast 容器
│   └── SimpleToastDemo.tsx   # 简化的演示组件
├── hooks/
│   └── useToast.ts           # React Toast Hook
└── pages/
    ├── toast-test.astro      # 纯 Astro 测试页面
    └── toast-demo.astro      # React 组件演示页面
```

## 🔧 测试页面

1. **纯 Astro 测试**: 访问 `/toast-test` - 使用原生 JavaScript
2. **React 组件测试**: 访问 `/toast-demo` - 使用 React 组件

## ⚠️ 重要说明

### Astro 中使用 React 组件的注意事项

如果遇到 `@vitejs/plugin-react can't detect preamble` 错误：

1. **推荐方案**: 使用原生 JavaScript Toast (`/toast-test`)
2. **React 组件**: 确保使用 `client:load` 指令

```astro
---
import SimpleToastDemo from '../components/SimpleToastDemo.tsx';
---

<SimpleToastDemo client:load />
```

### 最佳实践

1. **API 错误处理**: 使用自动集成的 request.ts
2. **手动提示**: 使用原生 JavaScript toast
3. **React 项目**: 使用 React Hook 和组件
4. **简单场景**: 直接使用 toast.success() 等方法

## 🎨 自定义样式

Toast 使用 TailwindCSS，可以通过修改 `src/utils/toast.ts` 自定义：

```typescript
const styles = {
  success: {
    bg: 'bg-emerald-500',  // 自定义颜色
    text: 'text-white',
    icon: '✅'             // 自定义图标
  }
};
```

## 🔍 故障排除

1. **React 组件错误**: 使用原生 JavaScript 版本
2. **样式问题**: 确保 TailwindCSS 正确配置
3. **导入错误**: 检查文件路径是否正确

## 📝 API 参考

### Toast 选项

```typescript
interface ToastOptions {
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;  // 毫秒，0 表示不自动关闭
  position?: 'top-right' | 'top-left' | 'bottom-right' | 
             'bottom-left' | 'top-center' | 'bottom-center';
}
```

### Request 配置

```typescript
interface RequestConfig {
  showSuccessToast?: boolean;    // 显示成功提示
  showErrorToast?: boolean;      // 显示错误提示（默认 true）
  successMessage?: string;       // 自定义成功消息
}
```

## ✅ 推荐使用方式

1. **日常开发**: 使用原生 JavaScript Toast
2. **API 集成**: 使用 request.ts 的自动提示
3. **测试功能**: 访问 `/toast-test` 页面 
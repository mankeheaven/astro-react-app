import React from 'react';
import { useToast } from '../hooks/useToast';
import ToastContainer from './ToastContainer';
import toast from '../utils/toast';

const ToastDemo: React.FC = () => {
  const { toasts, success, error, warning, info, removeToast, clearAllToasts } = useToast();

  const handleVanillaToast = (type: 'success' | 'error' | 'warning' | 'info') => {
    const messages = {
      success: '操作成功！',
      error: '操作失败，请重试',
      warning: '请注意检查输入内容',
      info: '这是一条信息提示'
    };

    toast[type](messages[type]);
  };

  const handleReactToast = (type: 'success' | 'error' | 'warning' | 'info') => {
    const messages = {
      success: 'React Toast: 操作成功！',
      error: 'React Toast: 操作失败，请重试',
      warning: 'React Toast: 请注意检查输入内容',
      info: 'React Toast: 这是一条信息提示'
    };

    switch (type) {
      case 'success':
        success(messages[type]);
        break;
      case 'error':
        error(messages[type]);
        break;
      case 'warning':
        warning(messages[type]);
        break;
      case 'info':
        info(messages[type]);
        break;
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Toast 提示组件演示</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Vanilla JS Toast */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">原生 JavaScript Toast</h2>
          <p className="text-gray-600 mb-4">适用于任何地方，包括 Axios 请求错误处理</p>
          <div className="space-y-3">
            <button
              onClick={() => handleVanillaToast('success')}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              成功提示
            </button>
            <button
              onClick={() => handleVanillaToast('error')}
              className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              错误提示
            </button>
            <button
              onClick={() => handleVanillaToast('warning')}
              className="w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
            >
              警告提示
            </button>
            <button
              onClick={() => handleVanillaToast('info')}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              信息提示
            </button>
          </div>
        </div>

        {/* React Toast */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">React Toast</h2>
          <p className="text-gray-600 mb-4">适用于 React 组件内部使用</p>
          <div className="space-y-3">
            <button
              onClick={() => handleReactToast('success')}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              成功提示
            </button>
            <button
              onClick={() => handleReactToast('error')}
              className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              错误提示
            </button>
            <button
              onClick={() => handleReactToast('warning')}
              className="w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
            >
              警告提示
            </button>
            <button
              onClick={() => handleReactToast('info')}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              信息提示
            </button>
          </div>
          
          {toasts.length > 0 && (
            <button
              onClick={clearAllToasts}
              className="w-full mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              清除所有提示 ({toasts.length})
            </button>
          )}
        </div>
      </div>

      {/* 使用说明 */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">使用说明</h3>
        <div className="space-y-2 text-gray-600">
          <p><strong>原生 JavaScript Toast:</strong> 在 request.ts 中已集成，会自动显示 API 错误提示</p>
          <p><strong>React Toast:</strong> 在 React 组件中使用 useToast Hook 来管理提示</p>
          <p><strong>特性:</strong> 支持多种类型、自定义位置、自动关闭、点击关闭等</p>
        </div>
      </div>

      {/* React Toast Container */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
};

export default ToastDemo; 
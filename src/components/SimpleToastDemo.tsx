import React from 'react';
import toast from '../utils/toast';

const SimpleToastDemo: React.FC = () => {
  const handleToast = (type: 'success' | 'error' | 'warning' | 'info') => {
    const messages = {
      success: '操作成功！',
      error: '操作失败，请重试',
      warning: '请注意检查输入内容',
      info: '这是一条信息提示'
    };

    toast[type](messages[type]);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Toast 提示演示</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">原生 JavaScript Toast</h2>
        <p className="text-gray-600 mb-4">点击按钮测试不同类型的提示</p>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleToast('success')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            成功提示
          </button>
          <button
            onClick={() => handleToast('error')}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            错误提示
          </button>
          <button
            onClick={() => handleToast('warning')}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
          >
            警告提示
          </button>
          <button
            onClick={() => handleToast('info')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            信息提示
          </button>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">使用说明：</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Toast 会自动在 3 秒后消失</li>
          <li>• 点击 toast 可以手动关闭</li>
          <li>• 支持多个 toast 同时显示</li>
          <li>• 已集成到 request.ts 中用于 API 错误提示</li>
        </ul>
      </div>
    </div>
  );
};

export default SimpleToastDemo; 
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo 区域 */}
          <div className="flex items-center">
            <a 
              href="/" 
              className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200"
            >
              AstroApp
            </a>
          </div>
          
          {/* 导航菜单 */}
          <nav className="flex space-x-8">
            <a 
              href="/" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-100"
            >
              首页
            </a>
            <a 
              href="/toast-demo" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-100"
            >
              Toast 演示
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 
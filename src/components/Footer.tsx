import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          {/* 底部版权信息 */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 AstroApp. 保留所有权利。
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a 
                href="#" 
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
              >
                隐私政策
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
              >
                服务条款
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
              >
                Cookie 政策
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

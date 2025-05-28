import React, { useState, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  position = 'top-right'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // 进入动画
    setIsVisible(true);

    // 自动关闭
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const getToastStyles = () => {
    const styles = {
      success: {
        bg: 'bg-green-500',
        text: 'text-white',
        icon: '✓'
      },
      error: {
        bg: 'bg-red-500',
        text: 'text-white',
        icon: '✕'
      },
      warning: {
        bg: 'bg-yellow-500',
        text: 'text-white',
        icon: '⚠'
      },
      info: {
        bg: 'bg-blue-500',
        text: 'text-white',
        icon: 'ℹ'
      }
    };
    return styles[type];
  };

  const getPositionClasses = () => {
    const positions = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
    };
    return positions[position];
  };

  const styles = getToastStyles();
  const positionClasses = getPositionClasses();

  return (
    <div
      className={`
        fixed ${positionClasses} z-50
        ${styles.bg} ${styles.text}
        px-4 py-3 rounded-lg shadow-lg
        flex items-center gap-3
        min-w-[300px] max-w-[400px]
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isLeaving 
          ? 'opacity-100 translate-x-0' 
          : 'opacity-0 translate-x-full'
        }
      `}
    >
      <span className="text-lg font-semibold">{styles.icon}</span>
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button 
        className="text-lg hover:opacity-70 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
      >
        ×
      </button>
    </div>
  );
};

export default Toast; 
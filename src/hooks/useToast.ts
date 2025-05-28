import { useState, useCallback } from 'react';
import type { ToastType } from '../components/Toast';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((
    message: string, 
    type: ToastType = 'info',
    options?: {
      duration?: number;
      position?: ToastItem['position'];
    }
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastItem = {
      id,
      message,
      type,
      duration: options?.duration || 3000,
      position: options?.position || 'top-right'
    };

    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // 便捷方法
  const success = useCallback((message: string, options?: { duration?: number; position?: ToastItem['position'] }) => {
    return addToast(message, 'success', options);
  }, [addToast]);

  const error = useCallback((message: string, options?: { duration?: number; position?: ToastItem['position'] }) => {
    return addToast(message, 'error', options);
  }, [addToast]);

  const warning = useCallback((message: string, options?: { duration?: number; position?: ToastItem['position'] }) => {
    return addToast(message, 'warning', options);
  }, [addToast]);

  const info = useCallback((message: string, options?: { duration?: number; position?: ToastItem['position'] }) => {
    return addToast(message, 'info', options);
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info
  };
}; 
import React from 'react';
import Toast from './Toast';
import type { ToastItem } from '../hooks/useToast';

interface ToastContainerProps {
  toasts: ToastItem[];
  onRemoveToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemoveToast }) => {
  // 按位置分组 toast
  const groupedToasts = toasts.reduce((groups, toast) => {
    const position = toast.position || 'top-right';
    if (!groups[position]) {
      groups[position] = [];
    }
    groups[position].push(toast);
    return groups;
  }, {} as Record<string, ToastItem[]>);

  return (
    <>
      {Object.entries(groupedToasts).map(([position, positionToasts]) => (
        <div key={position} className="fixed z-50 pointer-events-none">
          {positionToasts.map((toast) => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              position={toast.position}
              onClose={() => onRemoveToast(toast.id)}
            />
          ))}
        </div>
      ))}
    </>
  );
};

export default ToastContainer; 
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  type?: ToastType;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

class ToastManager {
  private container: HTMLElement | null = null;
  private toastCount = 0;

  private createContainer(position: string) {
    if (this.container) return this.container;

    this.container = document.createElement('div');
    this.container.id = 'toast-container';
    
    // 根据位置设置样式
    const positionClasses = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
    };

    this.container.className = `fixed ${positionClasses[position as keyof typeof positionClasses]} z-50 flex flex-col gap-2 pointer-events-none`;
    document.body.appendChild(this.container);
    
    return this.container;
  }

  private getToastStyles(type: ToastType) {
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
  }

  show(message: string, options: ToastOptions = {}) {
    const {
      type = 'info',
      duration = 3000,
      position = 'top-right'
    } = options;

    const container = this.createContainer(position);
    const toastId = `toast-${++this.toastCount}`;
    const styles = this.getToastStyles(type);

    // 创建 toast 元素
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `
      ${styles.bg} ${styles.text}
      px-4 py-3 rounded-lg shadow-lg
      flex items-center gap-3
      transform transition-all duration-300 ease-in-out
      pointer-events-auto cursor-pointer
      min-w-[300px] max-w-[400px]
      opacity-0 translate-x-full
    `.replace(/\s+/g, ' ').trim();

    // 添加内容
    toast.innerHTML = `
      <span class="text-lg font-semibold">${styles.icon}</span>
      <span class="flex-1 text-sm font-medium">${message}</span>
      <button class="text-lg hover:opacity-70 transition-opacity" onclick="this.parentElement.remove()">×</button>
    `;

    // 添加到容器
    container.appendChild(toast);

    // 触发动画
    requestAnimationFrame(() => {
      toast.classList.remove('opacity-0', 'translate-x-full');
      toast.classList.add('opacity-100', 'translate-x-0');
    });

    // 点击关闭
    toast.addEventListener('click', () => {
      this.hide(toastId);
    });

    // 自动关闭
    if (duration > 0) {
      setTimeout(() => {
        this.hide(toastId);
      }, duration);
    }

    return toastId;
  }

  hide(toastId: string) {
    const toast = document.getElementById(toastId);
    if (toast) {
      toast.classList.add('opacity-0', 'translate-x-full');
      setTimeout(() => {
        toast.remove();
        // 如果容器为空，移除容器
        if (this.container && this.container.children.length === 0) {
          this.container.remove();
          this.container = null;
        }
      }, 300);
    }
  }

  // 便捷方法
  success(message: string, options?: Omit<ToastOptions, 'type'>) {
    return this.show(message, { ...options, type: 'success' });
  }

  error(message: string, options?: Omit<ToastOptions, 'type'>) {
    return this.show(message, { ...options, type: 'error' });
  }

  warning(message: string, options?: Omit<ToastOptions, 'type'>) {
    return this.show(message, { ...options, type: 'warning' });
  }

  info(message: string, options?: Omit<ToastOptions, 'type'>) {
    return this.show(message, { ...options, type: 'info' });
  }

  // 清除所有 toast
  clear() {
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
  }
}

// 创建全局实例
const toast = new ToastManager();

export default toast; 
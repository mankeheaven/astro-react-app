

/**
 * API 响应基础类型
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
  count?: number;
}


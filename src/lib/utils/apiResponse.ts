import { z } from 'zod';
import type { ApiResponse } from '../../types/common';

/**
 * API响应工具类
 * 提供统一的响应格式和错误处理
 */
export class ApiResponseHelper {
  /**
   * 创建成功响应
   */
  static success<T>(data: T, message?: string, status: number = 200): Response {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message
    };

    return new Response(JSON.stringify(response), {
      status,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * 创建错误响应
   */
  static error(message: string, status: number = 500, errors?: any[]): Response {
    const response: ApiResponse = {
      success: false,
      message,
      errors
    };

    return new Response(JSON.stringify(response), {
      status,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * 创建验证错误响应
   */
  static validationError(zodError: z.ZodError): Response {
    return this.error(
      '输入数据验证失败',
      400,
      zodError.errors
    );
  }

  /**
   * 创建未找到响应
   */
  static notFound(message: string = '资源不存在'): Response {
    return this.error(message, 404);
  }

  /**
   * 创建未授权响应
   */
  static unauthorized(message: string = '未授权访问'): Response {
    return this.error(message, 401);
  }

  /**
   * 创建禁止访问响应
   */
  static forbidden(message: string = '禁止访问'): Response {
    return this.error(message, 403);
  }

  /**
   * 创建冲突响应（如邮箱已存在）
   */
  static conflict(message: string): Response {
    return this.error(message, 409);
  }

  /**
   * 创建服务器内部错误响应
   */
  static internalError(message: string = '服务器内部错误'): Response {
    return this.error(message, 500);
  }

  /**
   * 创建缺少参数响应
   */
  static badRequest(message: string): Response {
    return this.error(message, 400);
  }
}

/**
 * 错误处理装饰器
 * 用于统一处理API路由中的错误
 */
export function handleApiError(error: unknown): Response {
  console.error('API错误:', error);

  if (error instanceof z.ZodError) {
    return ApiResponseHelper.validationError(error);
  }

  if (error instanceof Error) {
    // 根据错误消息判断错误类型
    if (error.message.includes('不存在')) {
      return ApiResponseHelper.notFound(error.message);
    }
    
    if (error.message.includes('已被注册') || error.message.includes('已存在')) {
      return ApiResponseHelper.conflict(error.message);
    }
    
    if (error.message.includes('缺少') || error.message.includes('参数')) {
      return ApiResponseHelper.badRequest(error.message);
    }
    
    return ApiResponseHelper.error(error.message);
  }

  return ApiResponseHelper.internalError();
}

/**
 * 异步错误处理包装器
 * 用于包装API路由处理函数
 */
export function withErrorHandling<T extends any[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R | Response> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
} 
import type { APIRoute } from 'astro';
import { userService } from '../../../lib/services/userService';
import { ApiResponseHelper, handleApiError } from '../../../lib/utils/apiResponse';

/**
 * GET /api/users/check-email?email={email} - 检查邮箱是否可用
 */
export const GET: APIRoute = async ({ request }) => {
  const startTime = Date.now();
  const url = new URL(request.url);
  const email = url.searchParams.get('email');
  
  console.log('📧 [API] GET /api/users/check-email', { 
    email: email || 'missing',
    timestamp: new Date().toISOString() 
  });

  try {
    if (!email) {
      console.log('⚠️ [API] 邮箱检查请求缺少email参数');
      return ApiResponseHelper.badRequest('缺少邮箱参数');
    }
    
    console.log('🔍 [UserService] 检查邮箱可用性:', email);
    const isAvailable = await userService.isEmailAvailable(email);
    
    const duration = Date.now() - startTime;
    console.log('✅ [API] 邮箱检查完成', { 
      email,
      isAvailable,
      duration: `${duration}ms` 
    });
    
    return ApiResponseHelper.success<boolean>(isAvailable, isAvailable ? '邮箱可用' : '邮箱已被使用');
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('❌ [API] GET /api/users/check-email 失败', { 
      email,
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: `${duration}ms` 
    });
    return handleApiError(error);
  }
}; 
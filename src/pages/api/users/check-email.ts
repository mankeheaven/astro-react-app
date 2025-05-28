import type { APIRoute } from 'astro';
import { userService } from '../../../lib/services/userService';
import { ApiResponseHelper, handleApiError } from '../../../lib/utils/apiResponse';

/**
 * GET /api/users/check-email?email={email} - 检查邮箱是否可用
 */
export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    
    if (!email) {
      return ApiResponseHelper.badRequest('缺少邮箱参数');
    }
    
    const isAvailable = await userService.isEmailAvailable(email);
    
    return ApiResponseHelper.success({
      email,
      available: isAvailable
    }, isAvailable ? '邮箱可用' : '邮箱已被使用');
  } catch (error) {
    return handleApiError(error);
  }
}; 
import type { APIRoute } from 'astro';
import { userService } from '../../../lib/services/userService';
import { ApiResponseHelper, handleApiError } from '../../../lib/utils/apiResponse';

/**
 * GET /api/users/stats - 获取用户统计信息
 */
export const GET: APIRoute = async () => {
  try {
    const stats = await userService.getUserStats();
    
    return ApiResponseHelper.success(stats, '获取统计信息成功');
  } catch (error) {
    return handleApiError(error);
  }
}; 
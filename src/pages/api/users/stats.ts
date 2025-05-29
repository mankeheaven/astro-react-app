import type { APIRoute } from 'astro';
import { userService } from '../../../lib/services/userService';
import { ApiResponseHelper, handleApiError } from '../../../lib/utils/apiResponse';
import type { UserStats } from '../../../types/user';

/**
 * GET /api/users/stats - 获取用户统计信息
**/
export const GET: APIRoute = async () => {
  try {
    const stats: UserStats = await userService.getUserStats();
    
    return ApiResponseHelper.success<UserStats>(stats, '获取统计信息成功');
  } catch (error) {
    return handleApiError(error);
  }
}; 
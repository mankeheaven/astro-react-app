import type { APIRoute } from 'astro';
import { userService } from '../../../lib/services/userService';
import { ApiResponseHelper, handleApiError } from '../../../lib/utils/apiResponse';
import type { UserStats } from '../../../types/user';

/**
 * GET /api/users/stats - 获取用户统计信息
**/
export const GET: APIRoute = async () => {
  const startTime = Date.now();
  
  console.log('📊 [API] GET /api/users/stats', { 
    timestamp: new Date().toISOString() 
  });

  try {
    console.log('📈 [UserService] 获取用户统计信息');
    const stats: UserStats = await userService.getUserStats();
    
    const duration = Date.now() - startTime;
    console.log('✅ [API] 统计信息获取成功', { 
      total: stats.total,
      todayCount: stats.todayCount,
      weekCount: stats.weekCount,
      monthCount: stats.monthCount,
      duration: `${duration}ms` 
    });
    
    return ApiResponseHelper.success<UserStats>(stats, '获取统计信息成功');
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('❌ [API] GET /api/users/stats 失败', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: `${duration}ms` 
    });
    return handleApiError(error);
  }
}; 
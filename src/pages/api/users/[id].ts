import type { APIRoute } from "astro";
import { ApiResponseHelper, handleApiError } from "../../../lib/utils/apiResponse";
import type { User } from "../../../types/user";
import { userService } from "../../../lib/services/userService";

  /**
 * DELETE /api/users/:id - 删除用户
 */
export const DELETE: APIRoute = async ({ request, params }) => {
  const startTime = Date.now();
  const userId = params.id;
  
  console.log('🗑️ [API] DELETE /api/users/:id', { 
    userId,
    timestamp: new Date().toISOString() 
  });

  try {
    if (!userId) {
      console.log('⚠️ [API] DELETE请求缺少用户ID参数');
      return ApiResponseHelper.badRequest('缺少用户ID参数');
    }
    
    console.log('🔄 [UserService] 删除用户:', userId);
    const response: User = await userService.deleteUser(userId);
    
    const duration = Date.now() - startTime;
    console.log('✅ [API] 用户删除成功', { 
      userId: response.id,
      name: response.name,
      duration: `${duration}ms` 
    });
    
    return ApiResponseHelper.success<User>(
      response,
      `用户 ${response.name} 已被删除`
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('❌ [API] DELETE /api/users/:id 失败', { 
      userId,
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: `${duration}ms` 
    });
    return handleApiError(error);
  }
};

/**
 * PUT /api/users/:id - 更新用户信息
 */
export const PUT: APIRoute = async ({ request, params }) => {
  const startTime = Date.now();
  const userId = params.id;
  
  console.log('📝 [API] PUT /api/users/:id', { 
    userId,
    timestamp: new Date().toISOString() 
  });

  try {
    if (!userId) {
      console.log('⚠️ [API] PUT请求缺少用户ID参数');
      return ApiResponseHelper.badRequest('缺少用户ID参数');
    }
    
    const body = await request.json();
    
    // 记录更新请求（不包含敏感信息）
    console.log('🔄 [UserService] 更新用户信息', { 
      userId,
      fields: Object.keys(body) 
    });
    
    const response: User = await userService.updateUser(userId, body);
    
    const duration = Date.now() - startTime;
    console.log('✅ [API] 用户更新成功', { 
      userId: response.id,
      name: response.name,
      updatedFields: Object.keys(body),
      duration: `${duration}ms` 
    });
    
    return ApiResponseHelper.success<User>(
      response,
      `用户 ${response.name} 信息已更新`
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('❌ [API] PUT /api/users/:id 失败', { 
      userId,
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: `${duration}ms` 
    });
    return handleApiError(error);
  }
}; 
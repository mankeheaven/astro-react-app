import type { APIRoute } from 'astro';
import { userService } from '../../lib/services/userService';
import { ApiResponseHelper, handleApiError } from '../../lib/utils/apiResponse';
import type { User, UserList } from '../../types/user';

/**
 * GET /api/users - 获取所有用户
 */
export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search');
    
    if (search) {
      // 搜索用户
      const users = await userService.searchUsers(search);
      const response : UserList = {
        list: users,
        total: users.length
      }
      return ApiResponseHelper.success<UserList>(response, `找到 ${users.length} 个匹配的用户`);
    } else {
      // 获取所有用户
      const response : UserList = await userService.getAllUsers();
      return ApiResponseHelper.success<UserList>(response);
    }
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * POST /api/users - 创建新用户
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const response : User= await userService.createUser(body);
    return ApiResponseHelper.success<User>(
      response,
      `感谢您的注册，${response.name}！我们已收到您的信息并永久保存。`,
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * DELETE /api/users?id={userId} - 删除用户
 */
export const DELETE: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('id');
    
    if (!userId) {
      return ApiResponseHelper.badRequest('缺少用户ID参数');
    }
    
    const response : User = await userService.deleteUser(userId);
    
    return ApiResponseHelper.success<User>(
      response,
      `用户 ${response.name} 已被删除`
    );
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * PUT /api/users?id={userId} - 更新用户信息
 */
export const PUT: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('id');
    
    if (!userId) {
      return ApiResponseHelper.badRequest('缺少用户ID参数');
    }
    
    const body = await request.json();
    const response : User= await userService.updateUser(userId, body);
    
    return ApiResponseHelper.success<User>(
      response,
      `用户 ${response.name} 信息已更新`
    );
  } catch (error) {
    return handleApiError(error);
  }
}; 
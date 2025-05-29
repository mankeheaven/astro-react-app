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


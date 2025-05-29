import type { APIRoute } from "astro";
import { ApiResponseHelper, handleApiError } from "../../../lib/utils/apiResponse";
import type { User } from "../../../types/user";
import { userService } from "../../../lib/services/userService";

  /**
 * DELETE /api/users/:id - 删除用户
 */
export const DELETE: APIRoute = async ({ request, params }) => {
  try {
    const userId = params.id;
    
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
 * PUT /api/users/:id - 更新用户信息
 */
export const PUT: APIRoute = async ({ request, params }) => {
  try {
    const userId = params.id;
    
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
import type { APIRoute } from 'astro';
import { userService } from '../../lib/services/userService';
import { ApiResponseHelper, handleApiError } from '../../lib/utils/apiResponse';
import type { User, UserList } from '../../types/user';

/**
 * GET /api/users - 获取所有用户
 */
export const GET: APIRoute = async ({ request }) => {
  const startTime = Date.now();
  const url = new URL(request.url);
  const search = url.searchParams.get('search');
  
  console.log('🔍 [API] GET /api/users', { 
    search: search || 'all',
    timestamp: new Date().toISOString() 
  });

  try {
    if (search) {
      // 搜索用户
      console.log('🔎 [UserService] 搜索用户:', search);
      const users = await userService.searchUsers(search);
      const response: UserList = {
        list: users,
        total: users.length
      };
      
      const duration = Date.now() - startTime;
      console.log('✅ [API] 用户搜索成功', { 
        count: users.length, 
        duration: `${duration}ms`,
        search 
      });
      
      return ApiResponseHelper.success<UserList>(response, `找到 ${users.length} 个匹配的用户`);
    } else {
      // 获取所有用户
      console.log('📋 [UserService] 获取所有用户');
      const response: UserList = await userService.getAllUsers();
      
      const duration = Date.now() - startTime;
      console.log('✅ [API] 获取用户列表成功', { 
        count: response.total, 
        duration: `${duration}ms` 
      });
      
      return ApiResponseHelper.success<UserList>(response);
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('❌ [API] GET /api/users 失败', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: `${duration}ms`,
      search 
    });
    return handleApiError(error);
  }
};

/**
 * POST /api/users - 创建新用户
 */
export const POST: APIRoute = async ({ request }) => {
  const startTime = Date.now();
  
  console.log('📝 [API] POST /api/users', { 
    timestamp: new Date().toISOString() 
  });

  try {
    const body = await request.json();
    
    // 记录请求数据（不包含敏感信息）
    console.log('📋 [UserService] 创建用户请求', { 
      name: body.name,
      email: body.email,
      hasMessage: !!body.message 
    });
    
    const response: User = await userService.createUser(body);
    
    const duration = Date.now() - startTime;
    console.log('✅ [API] 用户创建成功', { 
      userId: response.id,
      name: response.name,
      email: response.email,
      duration: `${duration}ms` 
    });
    
    return ApiResponseHelper.success<User>(
      response,
      `感谢您的注册，${response.name}！我们已收到您的信息并永久保存。`,
      201
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('❌ [API] POST /api/users 失败', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: `${duration}ms` 
    });
    return handleApiError(error);
  }
};


import { userRepository } from '../dao/userRepository';
import { createUserSchema, userIdSchema } from '../validation/userSchema';
import type { User, CreateUserInput, UserList, UserStats } from '../../types/user';

/**
 * 用户业务逻辑服务类
 * 负责处理用户相关的业务逻辑
 */
export class UserService {
  /**
   * 获取所有用户
   */
  async getAllUsers(): Promise<UserList> {
    const users = await userRepository.findAll();
    return {
      list: users,
      total: users.length
    };
  }

  /**
   * 根据ID获取用户
   */
  async getUserById(id: string): Promise<User> {
    // 验证ID格式
    const validatedId = userIdSchema.parse(id);
    
    const user = await userRepository.findById(validatedId);
    if (!user) {
      throw new Error('用户不存在');
    }
    
    return user;
  }

  /**
   * 创建新用户
   */
  async createUser(input: CreateUserInput): Promise<User> {
    // 验证输入数据
    const validatedData = createUserSchema.parse(input);
    
    // 检查邮箱是否已存在
    const existingUser = await userRepository.findByEmail(validatedData.email);
    if (existingUser) {
      throw new Error('该邮箱已被注册，请使用其他邮箱');
    }
    
    // 创建用户
    const newUser = await userRepository.create({
      name: validatedData.name,
      email: validatedData.email,
      message: validatedData.message
    });
    
    return newUser;
  }

  /**
   * 删除用户
   */
  async deleteUser(id: string): Promise<User> {
    // 验证ID格式
    const validatedId = userIdSchema.parse(id);
    
    const deletedUser = await userRepository.delete(validatedId);
    if (!deletedUser) {
      throw new Error('用户不存在');
    }
    
    return deletedUser;
  }

  /**
   * 更新用户信息
   */
  async updateUser(id: string, input: Partial<CreateUserInput>): Promise<User> {
    // 验证ID格式
    const validatedId = userIdSchema.parse(id);
    
    // 如果有邮箱更新，检查邮箱是否已被其他用户使用
    if (input.email) {
      const existingUser = await userRepository.findByEmail(input.email);
      if (existingUser && existingUser.id !== validatedId) {
        throw new Error('该邮箱已被其他用户使用');
      }
    }
    
    const updatedUser = await userRepository.update(validatedId, input);
    if (!updatedUser) {
      throw new Error('用户不存在');
    }
    
    return updatedUser;
  }

  /**
   * 检查邮箱是否可用
   */
  async isEmailAvailable(email: string): Promise<boolean> {
    const existingUser = await userRepository.findByEmail(email);
    return !existingUser;
  }

  /**
   * 获取用户统计信息
   */
  async getUserStats(): Promise<UserStats> {
    return await userRepository.getStats();
  }

  /**
   * 搜索用户（按姓名或邮箱）
   */
  async searchUsers(query: string): Promise<User[]> {
    const allUsers = await userRepository.findAll();
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) {
      return allUsers;
    }
    
    return allUsers.filter(user => 
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      (user.message && user.message.toLowerCase().includes(searchTerm))
    );
  }
}

// 导出单例实例
export const userService = new UserService(); 
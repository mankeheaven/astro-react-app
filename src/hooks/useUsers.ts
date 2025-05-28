import { useState, useEffect, useCallback } from 'react';
import type { User, FormData, CreateUserInput } from '../types/user';
import { getUsersService, createUserService, deleteUserService, updateUserService, checkEmailAvailabilityService, searchUsersService } from '../services/user';
/**
 * 用户管理 Hook
 * 提供用户相关的状态管理和操作方法
 */
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  /**
   * 获取用户列表
   */
  const fetchUsers = useCallback(async (searchQuery?: string) => {
    try {
      setLoading(true);
      setError('');
      
      const response = searchQuery 
        ? await searchUsersService(searchQuery)
        : await getUsersService();

        console.log(response);
        setUsers(response?.list||[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取用户列表失败');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 创建用户
   */
  const createUser = useCallback(async (userData: FormData) => {
    try {
      setLoading(true);
      setError('');
      const response = await createUserService(userData);
      if (response) {
        await fetchUsers();
      }
      return true
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '创建用户失败';
      setError(errorMsg);
      return false
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  /**
   * 删除用户
   */
  const deleteUser = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError('');
      const response = await deleteUserService(userId);
      if (response) {
        await fetchUsers();
      } 
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '删除用户失败';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  /**
   * 更新用户
   */
  const updateUser = useCallback(async (userId: string, userData: Partial<CreateUserInput>) => {
    try {
      setLoading(true);
      setError('');
      const response = await updateUserService(userId, userData)
      if (response) {
        await fetchUsers();
      } 
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '更新用户失败';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  /**
   * 检查邮箱是否可用
   */
  const checkEmailAvailability = useCallback(async (email: string) => {
    try {
      const response = await checkEmailAvailabilityService(email);
      return response;
    } catch (err) {
      return false;
    }
  }, []);

  // 组件挂载时获取用户列表
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    deleteUser,
    updateUser,
    checkEmailAvailability,
    clearError: () => setError('')
  };
}; 
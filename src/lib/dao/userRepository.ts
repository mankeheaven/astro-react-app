import { promises as fs } from 'fs';
import path from 'path';
import type { User, UserStats } from '../../types/user';
import { generateId } from '../utils/id';

/**
 * 用户数据仓库类
 * 负责处理用户数据的持久化操作
 */
export class UserRepository {
  private readonly dataDir: string;
  private readonly usersFile: string;

  constructor() {
    this.dataDir = path.join(process.cwd(), 'data');
    this.usersFile = path.join(this.dataDir, 'users.json');
  }

  /**
   * 确保数据目录存在
   */
  private async ensureDataDir(): Promise<void> {
    try {
      await fs.access(this.dataDir);
    } catch {
      await fs.mkdir(this.dataDir, { recursive: true });
    }
  }

  /**
   * 读取所有用户数据
   */
  async findAll(): Promise<User[]> {
    try {
      await this.ensureDataDir();
      const data = await fs.readFile(this.usersFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // 如果文件不存在或读取失败，返回空数组并创建文件
      const defaultUsers: User[] = [];
      await this.saveAll(defaultUsers);
      return defaultUsers;
    }
  }

  /**
   * 根据ID查找用户
   */
  async findById(id: string): Promise<User | null> {
    const users = await this.findAll();
    return users.find(user => user.id === id) || null;
  }

  /**
   * 根据邮箱查找用户
   */
  async findByEmail(email: string): Promise<User | null> {
    const users = await this.findAll();
    return users.find(user => user.email === email) || null;
  }

  /**
   * 创建新用户
   */
  async create(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const users = await this.findAll();
    
    const newUser: User = {
      id: generateId(10),
      ...userData,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    await this.saveAll(users);
    
    return newUser;
  }

  /**
   * 删除用户
   */
  async delete(id: string): Promise<User | null> {
    const users = await this.findAll();
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return null;
    }
    
    const deletedUser = users.splice(userIndex, 1)[0];
    await this.saveAll(users);
    
    return deletedUser;
  }

  /**
   * 更新用户
   */
  async update(id: string, userData: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> {
    const users = await this.findAll();
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return null;
    }
    
    users[userIndex] = { ...users[userIndex], ...userData };
    await this.saveAll(users);
    
    return users[userIndex];
  }

  /**
   * 保存所有用户数据到文件
   */
  private async saveAll(users: User[]): Promise<void> {
    try {
      await this.ensureDataDir();
      await fs.writeFile(this.usersFile, JSON.stringify(users, null, 2), 'utf-8');
    } catch (error) {
      console.error('保存用户数据失败:', error);
      throw new Error('保存数据失败');
    }
  }

  /**
   * 获取用户统计信息
   */
  async getStats(): Promise<UserStats> { 
    const users = await this.findAll();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      total: users.length,
      todayCount: users.filter(user => new Date(user.createdAt) >= today).length,
      weekCount: users.filter(user => new Date(user.createdAt) >= thisWeek).length,
      monthCount: users.filter(user => new Date(user.createdAt) >= thisMonth).length
    };
  }
}

// 导出单例实例
export const userRepository = new UserRepository(); 
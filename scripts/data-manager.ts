#!/usr/bin/env tsx

import { promises as fs } from 'fs';
import path from 'path';

interface User {
  id: string;
  name: string;
  email: string;
  message?: string;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// 读取用户数据
async function readUsers(): Promise<User[]> {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.log('📁 数据文件不存在或为空');
    return [];
  }
}

// 显示用户列表
async function listUsers(): Promise<void> {
  const users = await readUsers();
  
  if (users.length === 0) {
    console.log('📭 暂无用户数据');
    return;
  }
  
  console.log(`📊 共有 ${users.length} 个用户:`);
  console.log('─'.repeat(80));
  
  users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.name} (${user.email})`);
    console.log(`   ID: ${user.id}`);
    console.log(`   注册时间: ${new Date(user.createdAt).toLocaleString('zh-CN')}`);
    if (user.message) {
      console.log(`   消息: ${user.message.substring(0, 50)}${user.message.length > 50 ? '...' : ''}`);
    }
    console.log('');
  });
}

// 清空用户数据
async function clearUsers(): Promise<void> {
  try {
    await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2), 'utf-8');
    console.log('🗑️  用户数据已清空');
  } catch (error) {
    console.error('❌ 清空数据失败:', error);
  }
}

// 备份用户数据
async function backupUsers(): Promise<void> {
  try {
    const users = await readUsers();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(DATA_DIR, `users-backup-${timestamp}.json`);
    
    await fs.writeFile(backupFile, JSON.stringify(users, null, 2), 'utf-8');
    console.log(`💾 数据已备份到: ${backupFile}`);
  } catch (error) {
    console.error('❌ 备份失败:', error);
  }
}

// 显示数据统计
async function showStats(): Promise<void> {
  const users = await readUsers();
  
  if (users.length === 0) {
    console.log('📊 暂无数据统计');
    return;
  }
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const todayUsers = users.filter(user => new Date(user.createdAt) >= today);
  const weekUsers = users.filter(user => new Date(user.createdAt) >= thisWeek);
  const monthUsers = users.filter(user => new Date(user.createdAt) >= thisMonth);
  
  console.log('📊 用户统计:');
  console.log('─'.repeat(40));
  console.log(`总用户数: ${users.length}`);
  console.log(`今日注册: ${todayUsers.length}`);
  console.log(`本周注册: ${weekUsers.length}`);
  console.log(`本月注册: ${monthUsers.length}`);
  
  // 邮箱域名统计
  const domains = users.reduce((acc, user) => {
    const domain = user.email.split('@')[1];
    acc[domain] = (acc[domain] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log('\n📧 邮箱域名分布:');
  Object.entries(domains)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .forEach(([domain, count]) => {
      console.log(`  ${domain}: ${count} 个用户`);
    });
}

// 主函数
async function main(): Promise<void> {
  const command = process.argv[2];
  
  console.log('🗄️  用户数据管理工具\n');
  
  switch (command) {
    case 'list':
    case 'ls':
      await listUsers();
      break;
      
    case 'clear':
      await clearUsers();
      break;
      
    case 'backup':
      await backupUsers();
      break;
      
    case 'stats':
      await showStats();
      break;
      
    default:
      console.log('使用方法:');
      console.log('  npm run data:list    - 显示所有用户');
      console.log('  npm run data:stats   - 显示统计信息');
      console.log('  npm run data:backup  - 备份用户数据');
      console.log('  npm run data:clear   - 清空用户数据');
      break;
  }
}

main().catch(console.error); 
import type { ApiResponse } from "./common";

/**
 * 用户数据类型定义
 */
export interface User {
	id: string;
	name: string;
	email: string;
	message?: string;
	createdAt: string;
}

/**
 * 创建用户的输入数据类型
 */
export interface CreateUserInput {
	name: string;
	email: string;
	message: string;
}

/**
 * 用户列表响应类型
 */
export interface UserList {
	list: User[];
	total: number;
}

/**
 * 表单数据类型
 */
export interface FormData {
	name: string;
	email: string;
	message: string;
}

/**
 * 用户搜索参数类型
 */
export interface UserSearchParams {
	search?: string;
}

/**
 * 用户统计响应类型
 */
export interface UserStats {
	total: number;
	todayCount: number;
	weekCount: number;
	monthCount: number;
}

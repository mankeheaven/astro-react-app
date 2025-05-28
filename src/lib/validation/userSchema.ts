import { z } from 'zod';

/**
 * 用户创建输入验证模式
 */
export const createUserSchema = z.object({
  name: z.string()
    .min(2, '姓名至少需要2个字符')
    .max(50, '姓名不能超过50个字符')
    .trim(),
  email: z.string()
    .email('请输入有效的邮箱地址')
    .toLowerCase()
    .trim(),
  message: z.string()
    .min(10, '消息至少需要10个字符')
    .max(500, '消息不能超过500个字符')
    .trim()
});

/**
 * 用户ID验证模式
 */
export const userIdSchema = z.string()
  .min(1, '用户ID不能为空')
  .trim();

/**
 * 导出验证类型
 */
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UserId = z.infer<typeof userIdSchema>; 
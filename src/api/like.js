/**
 * 点赞 / 取消点赞（预留接口）。
 *
 * - 接口：GET /like（配合 @/api/client.js 的 baseURL `/api`，实际请求 /api/like）
 * - 参数：targetType（如 advice / suggestion）、targetId、cancel（true 为取消点赞）
 * - 需要登录：是（请求携带 Session Cookie）。
 */
import { getJson } from '@/api/client';

export const toggleLike = ({ targetType, targetId, cancel = false }) =>
    getJson('/like', { targetType, targetId, cancel }, { success: true, liked: !cancel });

/**
 * 点赞 / 取消点赞。
 *
 * - 接口：GET /like（配合 @/api/client.js 的 baseURL `/api`，实际请求 /api/like）
 * - 参数：targetType（如 advice / suggestion）、targetId、cancel（true 为取消点赞）
 * - 响应：{ success, liked, count }，前端一律以后端返回的 liked/count 为准。
 * - 需要登录：是（请求携带 Session Cookie）。
 */
import { getJson } from '@/api/client';

export const toggleLike = ({ targetType, targetId, cancel = false }) =>
    getJson('/like', { targetType, targetId, cancel }, { success: true, liked: !cancel, count: 0 });

/**
 * 批量查询点赞状态（刷新页面后恢复按钮状态用）。
 *
 * - 接口：GET /like/status?targetType=&ids=1,2,3
 * - 响应：{ success, likes: { "<id>": { liked, count } } }
 */
export const getLikeStatus = ({ targetType, ids }) => {
    const idList = Array.isArray(ids) ? ids.join(',') : String(ids || '');
    return getJson(
        '/like/status',
        { targetType, ids: idList },
        { success: true, likes: {} },
    );
};

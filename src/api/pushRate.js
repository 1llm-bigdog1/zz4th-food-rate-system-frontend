/**
 * 评分提交。
 *
 * - 接口：GET /rate（配合 @/api/client.js 的 baseURL `/api`，实际请求 /api/rate）
 * - 参数（query params）：targetType（dish / selection / comment）、targetId、score
 * - 需要登录：未登录时由前端登录守卫拦截；请求携带 Session Cookie（apiClient 已配置 withCredentials）。
 */
import { getJson } from '@/api/client';

export const pushRate = (payload) =>
    getJson('/rate', payload, {
        success: true,
        rateId: `${payload.targetType || 'dish'}-${payload.targetId}-${Date.now()}`,
    });

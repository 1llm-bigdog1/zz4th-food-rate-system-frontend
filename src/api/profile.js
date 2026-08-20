/**
 * 更新当前用户资料（预留接口）。
 *
 * - 接口：POST /profile（配合 @/api/client.js 的 baseURL `/api`，实际请求 /api/profile）
 * - 请求体：application/json，字段与当前 User 模型一致
 * - 需要登录：是（请求携带 Session Cookie）。
 */
import apiClient, { shouldUseMockApi } from '@/api/client';

export const updateProfile = async (payload) => {
    if (shouldUseMockApi()) {
        return { success: true };
    }
    const response = await apiClient.post(
        '/profile',
        payload,
        {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );
    return response.data;
};

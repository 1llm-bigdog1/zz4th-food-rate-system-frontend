/**
 * 退出登录。
 *
 * - 接口：POST /auth/logout（配合 @/api/client.js 的 baseURL `/api`，实际请求 /api/auth/logout）
 * - 由后端立即使服务器端 Session 失效，并通过 Set-Cookie 清除 HttpOnly Session Cookie。
 * - 前端不保存、不读取 Session ID。
 */
import apiClient from '@/api/client';

export const logout = async () => {
    const response = await apiClient.post(
        '/auth/logout',
        {},
        {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );
    return response.data;
};

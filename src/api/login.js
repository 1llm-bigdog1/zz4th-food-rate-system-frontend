/**
 * 用户登录。
 *
 * - 接口：POST /auth/login（配合 @/api/client.js 的 baseURL `/api`，实际请求 /api/auth/login）
 * - 请求体：{ account, password, altcha }
 * - altcha 为 ALTCHA 人机验证 payload，由后端校验，未通过不能登录。
 * - 前端不做密码加密/摘要处理，不保存、不打印密码；错误由调用方处理。
 */
import apiClient from '@/api/client';

export const login = async ({ account, password, altcha = '', captcha_token = null }) => {
    const response = await apiClient.post(
        '/auth/login',
        { account, password, altcha, captcha_token },
        {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );
    return response.data;
};

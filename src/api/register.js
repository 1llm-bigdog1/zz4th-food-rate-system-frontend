/**
 * 用户注册。
 *
 * - 接口：POST /auth/register（配合 @/api/client.js 的 baseURL `/api`，实际请求 /api/auth/register）
 * - 请求体：{ username, email, password, altcha }
 * - altcha 为 ALTCHA 人机验证 payload，由后端校验，未通过不能注册。
 * - 前端不做密码加密/摘要处理，不保存、不打印密码；错误由调用方处理。
 */
import apiClient from '@/api/client';

export const register = async ({ username, email, password, altcha = '', captcha_token = null }) => {
    const response = await apiClient.post(
        '/auth/register',
        { username, email, password, altcha, captcha_token },
        {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );
    return response.data;
};

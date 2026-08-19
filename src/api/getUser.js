/**
 * 获取当前登录用户的完整用户信息。
 *
 * - 接口：GET /user（配合 @/api/client.js 的 baseURL `/api`，实际请求 /api/user）
 * - 认证方式：沿用现有 apiClient（同源请求默认携带 Cookie，未额外配置凭证）。
 * - 响应适配：支持直接返回用户对象，或 { success: true, user: {...} } / { success: true, data: {...} } 包装结构；
 *   返回数据按当前 src/models/User.js 的字段实例化为 User。
 * - HTTP 错误：抛出带 status 的 Error（如 401 时 error.status === 401，供登录恢复判断未登录）。
 * - 不在 API 层保存用户数据到 localStorage/sessionStorage。
 */
import apiClient from '@/api/client';
import User from '@/models/User';

const toUser = (data) =>
    new User(
        data.id,
        data.username,
        data.avatar_path,
        data.gender,
        data.session,
        data.classid,
        data.nickname,
        data.realname,
        data.level,
        data.register_date,
        data.rate_time,
        data.email,
    );

export const getUser = async () => {
    let response;
    try {
        response = await apiClient.get('/user', {
            headers: {
                Accept: 'application/json',
            },
        });
    } catch (error) {
        const status = error && error.response && error.response.status;
        const message = (error && error.response && error.response.data && error.response.data.message) ||
            (error && error.message) ||
            '获取用户信息失败';
        const wrappedError = new Error(message);
        wrappedError.status = status;
        throw wrappedError;
    }

    const data = response.data;
    if (!data || data.success === false) {
        throw new Error((data && data.message) || '获取用户信息失败');
    }

    const userData = data.user || data.data || data;
    return toUser(userData);
};

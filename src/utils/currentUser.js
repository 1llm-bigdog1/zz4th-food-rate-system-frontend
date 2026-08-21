/**
 * 当前用户获取与开发调试用户。
 *
 * - fetchCurrentUser()：优先请求真实后端（内部调用 getUser()，即 GET /api/user）。
 * - HTTP 401：原样抛出，视为未登录。
 * - 后端不可用（非 401 的失败，如网络错误）且为开发环境时，返回符合当前 User 模型的调试用户用于 UI 调试；
 *   生产环境不会自动使用调试用户。
 * - 调试用户仅用于前端展示，不参与正式认证，不包含调试密码。
 */
import User from '@/models/User';
import { getUser } from '@/api/getUser';

const DEBUG_USER_ENABLED = process.env.NODE_ENV !== 'production';

export const createDebugUser = () =>
    new User(
        0,
        'admin',
        '',
        '男',
        '2026届',
        '3班',
        '调试管理员',
        '管理员',
        1,
        '2026-01-01',
        0,
        'debug@example.com',
        '2026-01-01',
        'admin',
    );

export const fetchCurrentUser = async () => {
    try {
        return await getUser();
    } catch (error) {
        if (error && error.status === 401) {
            throw error;
        }
        if (DEBUG_USER_ENABLED) {
            return createDebugUser();
        }
        throw error;
    }
};

/**
 * 获取当前用户的身份信息（userId / username）。
 * 后端不可用或未登录时返回空身份，不抛出，供提交类参数填充。
 */
export const getCurrentUserIdentity = async () => {
    try {
        const user = await fetchCurrentUser();
        return {
            userId: user ? user.id : null,
            username: user ? user.username : '',
        };
    } catch (error) {
        return {
            userId: null,
            username: '',
        };
    }
};

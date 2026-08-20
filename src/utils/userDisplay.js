/**
 * 内容作者用户信息解析。
 *
 * - 页面显示 Suggestions / Advice 及其评论时，根据 userId 关联 User，
 *   显示对应 username 与 avatar。
 * - 复用现有 User 数据（fetchCurrentUser 获取的当前用户）作为用户注册表；
 *   未注册的 userId 回退为以 userId 本身作为 username 的占位信息。
 */
import { fetchCurrentUser } from '@/utils/currentUser';

const userMap = new Map();

const toDisplayRecord = (user) => ({
    id: user.id,
    username: user.username,
    nickname: user.nickname || user.username,
    avatar_path: user.avatar_path || '',
});

export const ensureCurrentUserRegistered = async () => {
    try {
        const user = await fetchCurrentUser();
        if (user && user.id != null) {
            userMap.set(String(user.id), toDisplayRecord(user));
        }
        return user;
    } catch (error) {
        return null;
    }
};

export const getDisplayUser = (userId) => {
    if (userId == null) {
        return { id: null, username: '', nickname: '', avatar_path: '' };
    }
    const known = userMap.get(String(userId));
    if (known) {
        return known;
    }
    return { id: userId, username: String(userId), nickname: String(userId), avatar_path: '' };
};

export const getDisplayAvatar = (userId) => getDisplayUser(userId).avatar_path || undefined;

export const getDisplayInitial = (userId) => {
    const user = getDisplayUser(userId);
    return (user.nickname || user.username || '\u7528').slice(0, 1);
};

/**
 * 清空用户注册表（登出/切换账号时调用，避免残留旧用户数据）。
 */
export const clearUserRegistry = () => {
    userMap.clear();
};

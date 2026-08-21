/**
 * 点赞状态同步工具。
 *
 * - applyLikeStatus：把后端 /like/status 的批量结果合并进本地数据并持久化；
 * - refreshLikeStatus：登录状态下批量拉取点赞状态并合并（未登录/异常静默跳过）。
 */
import { putRecord } from '@/db/indexedDB';
import { getLikeStatus } from '@/api/toggleLike';
import { fetchCurrentUser } from '@/utils/currentUser';

export const applyLikeStatus = async (items, statusMap, storeName) => {
    if (!statusMap || !Array.isArray(items)) {
        return;
    }
    for (const item of items) {
        const info = statusMap[String(item.id)];
        if (!info) {
            continue;
        }
        item.liked = !!info.liked;
        if (typeof item.like === 'number') {
            item.like = info.count;
        }
        if (typeof item.likes === 'number') {
            item.likes = info.count;
        }
        await putRecord(storeName, item);
    }
};

export const refreshLikeStatus = async (targetType, items, storeName) => {
    const validItems = (items || []).filter((item) => item && item.id != null);
    if (!validItems.length) {
        return;
    }
    try {
        // 未登录时 fetchCurrentUser 抛 401，直接跳过状态恢复。
        await fetchCurrentUser();
        const result = await getLikeStatus({
            targetType,
            ids: validItems.map((item) => item.id),
        });
        if (result && result.success && result.likes) {
            await applyLikeStatus(validItems, result.likes, storeName);
        }
    } catch (error) {
        // 未登录 / 网络异常：保持默认未点赞状态，不影响页面渲染。
    }
};

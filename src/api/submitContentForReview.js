/**
 * 内容提交与统一审核。
 *
 * - 接口：POST /review/content（配合 @/api/client.js 的 baseURL `/api`，实际请求 /api/review/content）
 * - 请求体：application/json，包含 type 及对应字段；positions / target 以原生数组/对象传输。
 * - 除 Rating 评分与补充信息外，所有用户文字内容（建议/分享/评论/回复）均由后端调用第三方内容审核：
 *   前端不直接调用第三方审核，也不保存第三方 API Key。
 * - 审核状态：approved（显示）/ rejected（不显示）/ pending（审核中不显示）；
 *   审核服务异常、超时或无法确定结果时不得默认通过。
 * - 开发调试：无后端时默认模拟 approved；可通过 setDebugReviewStatus('rejected' | 'pending') 切换
 *   模拟不同审核结果（仅开发环境生效）。
 */
import apiClient, { shouldUseMockApi } from '@/api/client';

// 需要审核的文字内容类型（Rating 评分与补充信息不在其中）。
const REVIEWABLE_TYPES = [
    'advice',
    'advice-comment',
    'suggestion',
    'suggestion-comment',
    'selection',
    'selection-comment',
];

// 开发调试用的模拟审核结果：'approved' | 'rejected' | 'pending'。
let debugReviewStatus = 'approved';

export const setDebugReviewStatus = (status) => {
    if (process.env.NODE_ENV !== 'production' && ['approved', 'rejected', 'pending'].includes(status)) {
        debugReviewStatus = status;
    }
};

/**
 * 解析审核结果状态：'approved' | 'rejected' | 'pending' | 'error'。
 * 未知结果、请求失败或审核服务异常一律返回 'error'，不视为审核通过。
 */
export const getReviewStatus = (result) => {
    if (!result || result.success === false) {
        return 'error';
    }
    if (result.status === 'rejected') {
        return 'rejected';
    }
    if (result.status === 'pending') {
        return 'pending';
    }
    if (result.status === 'approved' || result.approved === true) {
        return 'approved';
    }
    return 'error';
};

export const submitContentForReview = async (payload) => {
    const type = payload.type || 'content';
    // Rating 补充信息（dish-supplement）等非审核类内容直接通过，不进入文字审核。
    const isReviewable = REVIEWABLE_TYPES.includes(type);
    const status = isReviewable ? debugReviewStatus : 'approved';

    if (shouldUseMockApi()) {
        return {
            success: true,
            status,
            approved: status === 'approved',
            reviewId: `${type}-${Date.now()}`,
        };
    }

    const response = await apiClient.post('/review/content', payload, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};

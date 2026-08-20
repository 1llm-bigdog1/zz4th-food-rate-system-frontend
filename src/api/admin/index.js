/**
 * 管理端 API（统一 /api/admin/*）。
 *
 * - 鉴权：由后端 Session + role=admin 判断，前端不自行判断管理员资格。
 * - 方法约定：GET=查询、POST=创建/修改/提交、DELETE=删除。
 */
import apiClient, { getJson, shouldUseMockApi } from '@/api/client';

const MOCK_PENDING_SUPPLEMENT_REVIEWS = [
    {
        id: 1,
        dishName: '\u7ea2\u70e7\u8089',
        userName: '\u540c\u5b66A',
        submittedAt: '2026-03-21',
        info: '\u4ef7\u683c\u8c03\u6574\u4e3a18\u5143\uff0c\u4f4d\u7f6e\u57281\u697c1\u53f7\u7a97\u53e3\u3002',
    },
    {
        id: 2,
        dishName: '\u9178\u83dc\u9c7c',
        userName: '\u540c\u5b66B',
        submittedAt: '2026-03-22',
        info: '\u65b0\u589e\u56fe\u7247\u4e0e\u53e3\u5473\u5907\u6ce8\uff0c\u5efa\u8bae\u8865\u5145\u5230\u83dc\u54c1\u8be6\u60c5\u3002',
    },
];

export const verifyAdminPassword = async (password) => {
    if (shouldUseMockApi()) {
        return { success: password === 'admin123' };
    }
    const response = await apiClient.post(
        '/admin/verify-password',
        { password },
        {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );
    return response.data;
};

export const fetchSupplementReviews = () =>
    getJson('/admin/supplement-reviews', {}, {
        pending: MOCK_PENDING_SUPPLEMENT_REVIEWS,
        reviewed: [
            {
                id: 3,
                dishName: '\u756a\u8304\u7092\u86cb',
                userName: '\u540c\u5b66C',
                submittedAt: '2026-03-20',
                reviewedAt: '2026-03-20',
                status: 'approved',
                info: '\u8865\u5145\u4ef7\u683c12\u5143\u548c1\u697c4\u53f7\u7a97\u53e3\u4f4d\u7f6e\u3002',
            },
        ],
    });

/**
 * 获取新的、尚未审核的补充信息（status=pending）。
 */
export const fetchPendingSupplementReviews = () =>
    getJson('/admin/supplement-reviews', { status: 'pending' }, {
        pending: MOCK_PENDING_SUPPLEMENT_REVIEWS,
    });

/**
 * 提交补充信息审核结果（POST JSON body）。
 */
export const reviewSupplementInfo = async ({ id, approved }) => {
    if (shouldUseMockApi()) {
        return { success: true, approved };
    }
    const response = await apiClient.post(
        '/admin/review-supplement',
        { id, approved },
        {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );
    return response.data;
};

/**
 * 菜品新增（管理端，POST JSON body）。
 */
export const createDish = async (payload) => {
    if (shouldUseMockApi()) {
        return { success: true, dishId: (payload && payload.id) || 1 };
    }
    const response = await apiClient.post(
        '/admin/dish/add',
        payload,
        {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );
    return response.data;
};

/**
 * 菜品删除（管理端，DELETE）。
 */
export const deleteDish = async (id) => {
    if (shouldUseMockApi()) {
        return { success: true };
    }
    const response = await apiClient.delete('/admin/dish/delete', { params: { id } });
    return response.data;
};

/**
 * 用户详情（管理端，GET）。
 */
export const fetchUserDetail = (id) =>
    getJson('/admin/user-detail', { id }, {
        success: true,
        user: {
            id,
            username: '\u540c\u5b66A',
            avatar_path: '',
            gender: '\u7537',
            session: '2026\u5c4a',
            classid: '3\u73ed',
            nickname: '\u540c\u5b66A',
            realname: '\u5f20\u4e09',
            level: 3,
            register_date: '2026-01-12',
            rate_time: 8,
            email: 'student@example.com',
        },
    });

/**
 * 用户启用 / 禁用（管理端，POST JSON body）。
 */
export const setUserStatus = async ({ id, enabled }) => {
    if (shouldUseMockApi()) {
        return { success: true, id, enabled };
    }
    const response = await apiClient.post(
        '/admin/user-status',
        { id, enabled },
        {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );
    return response.data;
};

export const fetchUsers = () =>
    getJson('/admin/users', {}, {
        users: [
            { id: 1, username: '\u540c\u5b66A', role: '\u666e\u901a\u7528\u6237', ratingCount: 8, status: '\u6b63\u5e38' },
            { id: 2, username: '\u540c\u5b66B', role: '\u666e\u901a\u7528\u6237', ratingCount: 13, status: '\u6b63\u5e38' },
            { id: 3, username: '\u7ba1\u7406\u5458', role: '\u7ba1\u7406\u5458', ratingCount: 0, status: '\u6b63\u5e38' },
        ],
    });

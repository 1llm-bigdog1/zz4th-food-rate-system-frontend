import { getJson } from '@/api/client';

export const verifyAdminPassword = (password) =>
    getJson('/admin/verify-password', { password }, { success: password === 'admin123' });

export const fetchSupplementReviews = () =>
    getJson('/admin/supplement-reviews', {}, {
        pending: [
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
        ],
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

export const reviewSupplementInfo = ({ id, approved }) =>
    getJson('/admin/review-supplement', { id, approved }, { success: true, approved });

export const fetchUsers = () =>
    getJson('/admin/users', {}, {
        users: [
            { id: 1, name: '\u540c\u5b66A', role: '\u666e\u901a\u7528\u6237', ratingCount: 8, status: '\u6b63\u5e38' },
            { id: 2, name: '\u540c\u5b66B', role: '\u666e\u901a\u7528\u6237', ratingCount: 13, status: '\u6b63\u5e38' },
            { id: 3, name: '\u7ba1\u7406\u5458', role: '\u7ba1\u7406\u5458', ratingCount: 0, status: '\u6b63\u5e38' },
        ],
    });

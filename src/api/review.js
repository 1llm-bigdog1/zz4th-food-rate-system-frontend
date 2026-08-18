import { getJson } from '@/api/client';

export const submitContentForReview = (payload) =>
    getJson('/review/content', payload, {
        success: true,
        approved: true,
        reviewId: `${payload.type || 'content'}-${Date.now()}`,
    });

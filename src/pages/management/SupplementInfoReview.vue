<template>
    <div id="supplement-info-review">
        <section class="review-section">
            <div class="section-header">
                <h2>待审核</h2>
                <a-tag color="processing">{{ pendingReviews.length }} 条</a-tag>
            </div>

            <a-empty v-if="pendingReviews.length === 0" description="暂无待审核信息" />
            <div v-else class="review-list">
                <article v-for="item in pendingReviews" :key="item.id" class="review-item">
                    <div class="review-main">
                        <div class="review-title">{{ item.dishName }}</div>
                        <div class="review-meta">{{ item.userName }} · {{ item.submittedAt }}</div>
                        <p>{{ item.info }}</p>
                    </div>
                    <a-space class="review-actions">
                        <a-button type="primary" @click="handleReview(item, true)">通过</a-button>
                        <a-button danger @click="handleReview(item, false)">不通过</a-button>
                    </a-space>
                </article>
            </div>
        </section>

        <section class="review-section">
            <div class="section-header">
                <h2>已审核</h2>
                <a-tag>{{ reviewedReviews.length }} 条</a-tag>
            </div>

            <a-empty v-if="reviewedReviews.length === 0" description="暂无已审核信息" />
            <div v-else class="review-list">
                <article v-for="item in reviewedReviews" :key="item.id" class="review-item reviewed">
                    <div class="review-main">
                        <div class="review-title">{{ item.dishName }}</div>
                        <div class="review-meta">{{ item.userName }} · {{ item.submittedAt }}</div>
                        <p>{{ item.info }}</p>
                    </div>
                    <a-tag :color="item.status === 'approved' ? 'success' : 'error'">
                        {{ item.status === 'approved' ? '已通过' : '未通过' }}
                    </a-tag>
                </article>
            </div>
        </section>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { message } from 'ant-design-vue';
import { fetchPendingSupplementReviews, fetchSupplementReviews, reviewSupplementInfo } from '@/api/admin';

const pendingReviews = ref([]);
const reviewedReviews = ref([]);

onMounted(async () => {
    const [pendingResult, reviewedResult] = await Promise.all([
        fetchPendingSupplementReviews(),
        fetchSupplementReviews(),
    ]);
    pendingReviews.value = pendingResult.pending || [];
    reviewedReviews.value = reviewedResult.reviewed || [];
});

const handleReview = async (item, approved) => {
    const result = await reviewSupplementInfo({ id: item.id, approved });
    if (!result.success) {
        message.error('审核提交失败');
        return;
    }

    pendingReviews.value = pendingReviews.value.filter((review) => review.id !== item.id);
    reviewedReviews.value.unshift({
        ...item,
        reviewedAt: new Date().toISOString().slice(0, 10),
        status: approved ? 'approved' : 'rejected',
    });
    message.success(approved ? '已通过该补充信息' : '已标记为不通过');
};
</script>

<style scoped>
#supplement-info-review {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.review-section {
    border: 1px solid #e6e6e6;
    border-radius: 8px;
    padding: 16px;
    background: #fff;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
}

.section-header h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 800;
}

.review-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.review-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 14px;
    border: 1px solid #edf0f2;
    border-radius: 8px;
    background: #fafafa;
}

.review-main {
    min-width: 0;
}

.review-title {
    font-weight: 700;
    color: #1f1f1f;
}

.review-meta {
    margin-top: 4px;
    color: #6b7280;
    font-size: 13px;
}

.review-main p {
    margin: 8px 0 0;
    color: #3c4043;
    line-height: 1.7;
}

.review-actions {
    flex-shrink: 0;
}

.reviewed {
    background: #fff;
}

@media (max-width: 768px) {
    .review-item {
        align-items: stretch;
        flex-direction: column;
    }
}
</style>

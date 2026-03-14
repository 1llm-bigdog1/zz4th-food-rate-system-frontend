<template>
    <div id="selection-list-page">
        <div id="rank-show">
            <div class="panel-header">
                <span class="dish-show-title">{{ text.pageTitle }}</span>
                <span class="panel-subtitle">{{ text.listSubtitle }}</span>
            </div>

            <a-list :data-source="visibleSelections" :split="false" class="selection-list">
                <template #renderItem="{ item }">
                    <a-list-item class="selection-list-item">
                        <a-comment class="selection-comment selection-comment-link" @click="goToSelectionDetail(item)">
                            <template #avatar>
                                <a-avatar :size="52" class="user-avatar">{{ getUserInitial(item.user_id) }}</a-avatar>
                            </template>

                            <template #author>
                                <div class="comment-author-row">
                                    <span class="user-name">{{ item.user_id }}</span>
                                    <a-rate :value="item.rate" disabled allow-half class="inline-rate" />
                                    <span class="reply-rate-number">{{ item.rate }}</span>
                                </div>
                            </template>

                            <template #datetime>
                                <span class="meta-date">{{ item.date }}</span>
                            </template>

                            <template #content>
                                <div class="selection-main">
                                    <div class="selection-comment-box">{{ item.comment }}</div>

                                    <div class="selection-extra">
                                        <a-tag color="gold" class="selection-tag">
                                            {{ text.pricePrefix }}{{ item.price }}{{ text.priceSuffix }}
                                        </a-tag>
                                        <a-tag
                                            v-for="(pos, index) in item.position"
                                            :key="`${item.id}-${index}`"
                                            color="blue"
                                            class="selection-tag"
                                        >
                                            {{ formatPosition(pos) }}
                                        </a-tag>
                                    </div>
                                </div>
                            </template>

                            <template #actions>
                                <span class="comment-action" @click.stop="goToSelectionDetail(item)">{{ text.reply }}</span>
                                <span class="comment-action" @click.stop="openRatingModal(item)">{{ text.rateAction }}</span>
                            </template>
                        </a-comment>
                    </a-list-item>
                </template>
            </a-list>

            <a-row id="rank-more" justify="center" v-if="hasMore">
                <a-col :flex="'0 0 auto'" class="see-more-col">
                    <a-button type="default" size="large" class="see-more-button" @click="loadMore">
                        {{ text.loadMore }}
                    </a-button>
                </a-col>
            </a-row>
        </div>

        <div id="rank-show" class="contribute-section">
            <div class="panel-header">
                <span class="dish-show-title">{{ text.contributeTitle }}</span>
                <span class="panel-subtitle">{{ text.contributeSubtitle }}</span>
            </div>

            <div class="form-shell">
                <div class="form-section">
                    <div class="section-title">{{ text.commentTitle }}</div>
                    <a-textarea v-model:value="form.comment" :rows="5" :placeholder="text.commentPlaceholder" />
                </div>

                <div class="form-grid">
                    <div class="form-section">
                        <div class="section-title">{{ text.priceTitle }}</div>
                        <a-input-number
                            v-model:value="form.price"
                            :min="0"
                            :step="0.5"
                            :precision="1"
                            class="price-input"
                            :placeholder="text.pricePlaceholder"
                        >
                            <template #addonAfter>{{ text.yuanSymbol }}</template>
                        </a-input-number>
                    </div>

                    <div class="form-section">
                        <div class="section-title">{{ text.selectPosition }}</div>
                        <div class="position-rows">
                            <div v-for="(item, index) in form.positions" :key="index" class="position-row">
                                <a-space wrap>
                                    <a-select
                                        v-model:value="item.floor"
                                        :options="floorOptions"
                                        :placeholder="text.floorPlaceholder"
                                        style="width: 120px"
                                    />
                                    <a-select
                                        v-model:value="item.window"
                                        :options="windowOptions"
                                        :placeholder="text.windowPlaceholder"
                                        style="width: 120px"
                                    />
                                </a-space>
                                <div class="position-actions">
                                    <a-button
                                        v-if="index === form.positions.length - 1"
                                        type="dashed"
                                        shape="circle"
                                        size="small"
                                        @click="addPositionRow"
                                    >
                                        +
                                    </a-button>
                                    <a-button
                                        v-if="index === form.positions.length - 1 && form.positions.length >= 2"
                                        type="dashed"
                                        shape="circle"
                                        size="small"
                                        @click="removePositionRow"
                                    >
                                        -
                                    </a-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="submit-row">
                    <a-button type="primary" size="large" @click="submitSelection">{{ text.submit }}</a-button>
                </div>
            </div>
        </div>

        <RatingModal
            :open="ratingModalVisible"
            :title="ratingModalTitle"
            :rating-value="ratingValue"
            :submit-text="text.submitRating"
            @update:ratingValue="updateRatingValue"
            @cancel="closeRatingModal"
            @submit="submitRating"
        />
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import Selection from '@/models/Selection';
import Position from '@/models/Position';
import RatingModal from '@/components/RatingModal.vue';
import { buildFloorOptions, buildWindowOptions, createMockSelections } from '@/data/mockData';
import { selectionListText, sharedText } from '@/models/text';

const router = useRouter();

// 页面内统一使用的文案，供列表、表单和评分弹窗复用。
const text = {
    ...sharedText,
    ...selectionListText,
};

// 严选列表使用的本地示例数据源。
const selections = ref(createMockSelections());

// 列表分页显示配置。
const pageSize = 5;
const visibleCount = ref(pageSize);
const visibleSelections = computed(() => selections.value.slice(0, visibleCount.value));
const hasMore = computed(() => visibleCount.value < selections.value.length);

// 投稿表单中“购买位置”选择器的可选项。
const floorOptions = buildFloorOptions(2, text.floor);
const windowOptions = buildWindowOptions(8, text.window);

// “我要分享”表单的本地状态。
const form = ref({
    comment: '',
    price: null,
    positions: [{ floor: null, window: null }],
});

// 评论项触发的评分弹窗状态。
const ratingModalVisible = ref(false);
const ratingTargetName = ref('');
const ratingValue = ref(0);
const ratingModalTitle = computed(() => `${text.rateTitlePrefix}${ratingTargetName.value}${text.rateTitleSuffix}`);

// 评论风格展示用到的小工具函数。
const getUserInitial = (userId) => userId.slice(0, 1);
const formatPosition = (pos) => `${text.purchasePrefix}${pos.floor}${text.floor}(${pos.window}${text.window})`;
const goToSelectionDetail = (item) => {
    router.push(`/selection-detail/${item.id}`);
};

// 在本地示例数据中继续展开更多评论，不重新请求数据。
const loadMore = () => {
    visibleCount.value = Math.min(visibleCount.value + pageSize, selections.value.length);
};

// 增加一行购买位置，支持一条分享对应多个窗口。
const addPositionRow = () => {
    form.value.positions.push({ floor: null, window: null });
};

// 至少保留一行购买位置，避免表单为空。
const removePositionRow = () => {
    if (form.value.positions.length > 1) {
        form.value.positions.pop();
    }
};

// 提交成功后重置分享表单。
const resetForm = () => {
    form.value = {
        comment: '',
        price: null,
        positions: [{ floor: null, window: null }],
    };
};

// 为当前评论对象打开评分弹窗。
const openRatingModal = (item) => {
    ratingTargetName.value = item.user_id;
    ratingValue.value = item.rate || 0;
    ratingModalVisible.value = true;
};

// 同步弹窗内星级评分组件的值。
const updateRatingValue = (value) => {
    ratingValue.value = value;
};

// 关闭评分弹窗，不做持久化写回。
const closeRatingModal = () => {
    ratingModalVisible.value = false;
};

// 保持当前行为：仅关闭弹窗，不回写数据。
const submitRating = () => {
    ratingModalVisible.value = false;
};

// 校验表单并将新的分享内容插入到本地列表顶部。
const submitSelection = () => {
    const cleanComment = form.value.comment.trim();
    const validPositions = form.value.positions.filter((p) => p.floor && p.window);

    if (!cleanComment || form.value.price === null || validPositions.length === 0) {
        message.warning(text.submitWarning);
        return;
    }

    selections.value.unshift(
        new Selection(
            Date.now(),
            text.myUserName,
            new Date().toISOString().slice(0, 10),
            cleanComment,
            form.value.price,
            validPositions.map((p) => new Position(p.floor, p.window)),
            5,
        ),
    );

    visibleCount.value = Math.max(visibleCount.value, pageSize);
    resetForm();
    message.success(text.submitSuccess);
};
</script>

<style scoped>
#rank-show {
    border: 1px solid #e6e6e6;
    border-radius: 8px;
    padding: 16px;
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

#rank-show:hover {
    border-color: #d9d9d9;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.15);
}

.contribute-section {
    margin-top: 20px;
}

.panel-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 18px;
    padding-bottom: 14px;
    border-bottom: 1px solid #f0f0f0;
}

.dish-show-title {
    display: inline-block;
    font-family: 'Noto Serif SC', 'Microsoft YaHei', serif;
    font-weight: 800;
    font-size: 22px;
    color: #1f1f1f;
    letter-spacing: 0.5px;
}

.panel-subtitle {
    color: #8c8c8c;
    font-size: 13px;
    white-space: nowrap;
}

.user-avatar {
    flex-shrink: 0;
    background: linear-gradient(135deg, #fff1f0 0%, #ffd6d6 100%);
    color: #cf1322;
    border: 1px solid #ffb3b3;
    box-shadow: 0 8px 18px rgba(255, 77, 79, 0.16);
}

.selection-list-item {
    padding: 18px 0;
    border-bottom: 1px solid #f0f0f0;
}

:deep(.selection-comment) {
    display: block;
    width: 100%;
    box-sizing: border-box;
    border: 1px solid transparent;
    border-radius: 16px;
    padding: 14px 16px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.selection-comment-link {
    cursor: pointer;
}

:deep(.selection-comment:hover) {
    border-color: #d9d9d9;
    background: #fff;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.15);
}

:deep(.selection-comment .ant-comment-inner) {
    padding: 0;
}

:deep(.selection-comment .ant-comment-content-author) {
    margin-bottom: 10px;
}

:deep(.selection-comment .ant-comment-actions) {
    margin-top: 12px;
}

.selection-main {
    min-width: 0;
}

.comment-author-row {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.user-name {
    font-size: 18px;
    font-weight: 700;
    color: #1f1f1f;
}

.inline-rate {
    transform: scale(0.9);
    transform-origin: left center;
}

.meta-date {
    color: #8c8c8c;
    font-size: 14px;
    flex-shrink: 0;
}

.selection-comment-box {
    border: 1px solid #f0f0f0;
    border-radius: 14px;
    padding: 14px 16px;
    background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
    color: #1f1f1f;
    line-height: 1.8;
    white-space: pre-wrap;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.selection-extra {
    margin-top: 12px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.selection-tag {
    margin: 0;
    padding: 4px 10px;
    border-radius: 999px;
}

.comment-action {
    color: #595959;
    transition: color 0.2s ease;
    cursor: pointer;
}

.comment-action:hover {
    color: #1677ff;
}

.reply-rate-number {
    color: #1f1f1f;
    font-weight: 600;
}

#rank-more {
    margin-top: 16px;
}

.see-more-button {
    width: 200px;
    background: #fff;
    color: #1f1f1f;
    border: 1px solid #d9d9d9;
    border-radius: 8px;
    padding: 0 22px;
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.see-more-col {
    display: flex;
    justify-content: center;
}

.form-shell {
    background: linear-gradient(180deg, #ffffff 0%, #fcfcfc 100%);
    border: 1px solid #f0f0f0;
    border-radius: 18px;
    padding: 18px;
}

.form-grid {
    display: grid;
    grid-template-columns: minmax(220px, 260px) 1fr;
    gap: 18px;
}

.form-section {
    margin-bottom: 14px;
}

.section-title {
    margin-bottom: 8px;
    color: #1f1f1f;
    font-weight: 600;
    font-size: 14px;
}

.position-rows {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.position-row {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: space-between;
    padding: 10px 12px;
    border: 1px solid #f0f0f0;
    border-radius: 12px;
    background: #fff;
}

.position-actions {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.price-input {
    width: 100%;
}

.submit-row {
    display: flex;
    justify-content: flex-end;
}

@media (max-width: 768px) {
    .panel-header {
        align-items: flex-start;
        flex-direction: column;
    }

    .panel-subtitle {
        white-space: normal;
    }

    .form-grid {
        grid-template-columns: 1fr;
        gap: 8px;
    }

    .position-row {
        align-items: flex-start;
        flex-direction: column;
    }

    .submit-row {
        justify-content: stretch;
    }

    .submit-row :deep(.ant-btn) {
        width: 100%;
    }
}
</style>

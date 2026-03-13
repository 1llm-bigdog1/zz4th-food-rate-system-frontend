<template>
    <div id="selection-list-page">
        <div id="rank-show">
            <span class="dish-show-title">{{ text.pageTitle }}</span>
            <a-list :data-source="visibleSelections" :split="true" class="selection-list">
                <template #renderItem="{ item }">
                    <a-list-item>
                        <div class="selection-item">
                            <a-avatar :size="56" class="user-avatar">{{ item.user_id.slice(0, 1) }}</a-avatar>
                            <div class="selection-main">
                                <div class="selection-meta">
                                    <div class="user-main-line">
                                        <span class="user-name">{{ item.user_id }}</span>
                                        <a-rate :value="item.rate" disabled allow-half class="inline-rate" />
                                        <span class="reply-rate-number">{{ item.rate }}</span>
                                    </div>
                                    <span class="meta-date">{{ item.date }}</span>
                                </div>

                                <div class="selection-comment-box">{{ item.comment }}</div>

                                <div class="selection-extra">
                                    <div>{{ text.pricePrefix }}{{ item.price }}{{ text.priceSuffix }}</div>
                                    <div v-for="(pos, index) in item.position" :key="`${item.id}-${index}`">
                                        {{ text.purchasePrefix }}{{ pos.floor }}{{ text.floor }}({{ pos.window }}{{ text.window }})
                                    </div>
                                </div>

                                <div class="reply-row">
                                    <a-button type="link" size="small" class="action-btn">{{ text.reply }}</a-button>
                                    <a-button type="link" size="small" class="action-btn" @click="openRatingModal(item)">
                                        {{ text.rateAction }}
                                    </a-button>
                                </div>
                            </div>
                        </div>
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
            <span class="dish-show-title">{{ text.contributeTitle }}</span>

            <div class="form-section">
                <a-textarea v-model:value="form.comment" :rows="5" :placeholder="text.commentPlaceholder" />
            </div>

            <div class="form-section">
                <a-input-number
                    v-model:value="form.price"
                    :min="0"
                    :step="0.5"
                    :precision="1"
                    style="width: 240px"
                    :placeholder="text.pricePlaceholder"
                />
            </div>

            <div class="form-section">
                <div class="section-title">{{ text.selectPosition }}</div>
                <div class="position-rows">
                    <div v-for="(item, index) in form.positions" :key="index" class="position-row">
                        <a-space>
                            <a-select v-model:value="item.floor" :options="floorOptions" :placeholder="text.floorPlaceholder" style="width: 120px" />
                            <a-select v-model:value="item.window" :options="windowOptions" :placeholder="text.windowPlaceholder" style="width: 120px" />
                        </a-space>
                        <a-button v-if="index === form.positions.length - 1" type="dashed" shape="circle" size="small" @click="addPositionRow">+</a-button>
                        <a-button v-if="index === form.positions.length - 1 && form.positions.length >= 2" type="dashed" shape="circle" size="small" @click="removePositionRow">-</a-button>
                    </div>
                </div>
            </div>

            <a-button type="primary" @click="submitSelection">{{ text.submit }}</a-button>
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
import Selection from '@/models/Selection';
import Position from '@/models/Position';
import RatingModal from '@/components/RatingModal.vue';
import { buildFloorOptions, buildWindowOptions, createMockSelections } from '@/data/mockData';

const text = {
    pageTitle: '\u8001\u5403\u5bb6\u4e25\u9009',
    contributeTitle: '\u6211\u8981\u5206\u4eab',
    loadMore: '\u663e\u793a\u66f4\u591a',
    reply: '\u56de\u590d',
    rateAction: '\u8bc4\u5206',
    submit: '\u63d0\u4ea4',
    submitRating: '\u63d0\u4ea4\u8bc4\u5206',
    rateTitlePrefix: '\u5bf9',
    rateTitleSuffix: '\u8fdb\u884c\u8bc4\u5206',
    commentPlaceholder: '\u8bf7\u8f93\u5165\u8bc4\u8bba\u5185\u5bb9',
    pricePlaceholder: '\u8bf7\u8f93\u5165\u4ef7\u683c',
    selectPosition: '\u9009\u62e9\u4f4d\u7f6e',
    floorPlaceholder: '\u9009\u62e9\u697c\u5c42',
    windowPlaceholder: '\u9009\u62e9\u7a97\u53e3',
    submitSuccess: '\u611f\u8c22\u4f60\u7684\u8d21\u732e\uff0c\u63d0\u4ea4\u540e\u7684\u6570\u636e\u4f1a\u5728\u5ba1\u6838\u540e\u663e\u793a',
    floor: '\u697c',
    window: '\u7a97\u53e3',
    pricePrefix: '\u4ef7\u683c\uff1a',
    priceSuffix: '\u5143',
    purchasePrefix: '\u8d2d\u4e70\u4f4d\u7f6e',
};

// Shared source for selection demo data.
const selections = ref(createMockSelections());

// Display pagination config.
const pageSize = 5;
const visibleCount = ref(pageSize);
const visibleSelections = computed(() => selections.value.slice(0, visibleCount.value));
const hasMore = computed(() => visibleCount.value < selections.value.length);

// Position selectors.
const floorOptions = buildFloorOptions(2, text.floor);
const windowOptions = buildWindowOptions(8, text.window);

// Contribution form state.
const form = ref({
    comment: '',
    price: null,
    positions: [{ floor: null, window: null }],
});

// Rating modal state.
const ratingModalVisible = ref(false);
const ratingTargetName = ref('');
const ratingValue = ref(0);
const ratingModalTitle = computed(() => `${text.rateTitlePrefix}${ratingTargetName.value}${text.rateTitleSuffix}`);

const loadMore = () => {
    visibleCount.value = Math.min(visibleCount.value + pageSize, selections.value.length);
};

const addPositionRow = () => {
    form.value.positions.push({ floor: null, window: null });
};

const removePositionRow = () => {
    if (form.value.positions.length > 1) {
        form.value.positions.pop();
    }
};

const resetForm = () => {
    form.value = {
        comment: '',
        price: null,
        positions: [{ floor: null, window: null }],
    };
};

const openRatingModal = (item) => {
    ratingTargetName.value = item.user_id;
    ratingValue.value = item.rate || 0;
    ratingModalVisible.value = true;
};

const updateRatingValue = (value) => {
    ratingValue.value = value;
};

const closeRatingModal = () => {
    ratingModalVisible.value = false;
};

// Keep the current behavior: close only, no write-back.
const submitRating = () => {
    ratingModalVisible.value = false;
};

const submitSelection = () => {
    const cleanComment = form.value.comment.trim();
    const validPositions = form.value.positions.filter((p) => p.floor && p.window);

    if (!cleanComment || form.value.price === null || validPositions.length === 0) {
        message.warning('\u8bf7\u5b8c\u6574\u586b\u5199\u8bc4\u8bba\u3001\u4ef7\u683c\u548c\u81f3\u5c11\u4e00\u4e2a\u8d2d\u4e70\u4f4d\u7f6e');
        return;
    }

    selections.value.unshift(
        new Selection(
            Date.now(),
            '\u6211',
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

.dish-show-title {
    display: inline-block;
    margin-bottom: 12px;
    font-family: 'Noto Serif SC', 'Microsoft YaHei', serif;
    font-weight: 800;
    font-size: 22px;
    color: #1f1f1f;
    letter-spacing: 0.5px;
}

.selection-item {
    width: 100%;
    display: flex;
    align-items: flex-start;
    gap: 14px;
}

.user-avatar {
    flex-shrink: 0;
    background: #f5f5f5;
    color: #cf1322;
    border: 1px solid #ffa39e;
}

.selection-main {
    flex: 1;
    min-width: 0;
}

.selection-meta {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 18px;
    margin-bottom: 8px;
}

.user-main-line {
    display: inline-flex;
    align-items: center;
    gap: 8px;
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
    border: 1px solid #e6e6e6;
    border-radius: 6px;
    padding: 10px 12px;
    background: #fff;
    color: #1f1f1f;
    line-height: 1.8;
    white-space: pre-wrap;
}

.selection-extra {
    margin-top: 8px;
    color: #434343;
    line-height: 1.8;
}

.reply-row {
    margin-top: 8px;
    display: inline-flex;
    align-items: center;
    gap: 2px;
}

.action-btn {
    padding: 0;
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

.form-section {
    margin-bottom: 14px;
}

.section-title {
    margin-bottom: 8px;
    color: #1f1f1f;
    font-weight: 600;
}

.position-rows {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.position-row {
    display: flex;
    align-items: center;
    gap: 8px;
}
</style>
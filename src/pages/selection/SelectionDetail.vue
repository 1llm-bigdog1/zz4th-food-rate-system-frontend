<template>
    <div id="selection-detail-page">
        <div class="detail-back" @click="goBack">
            <left-outlined class="back-icon" />
            <span>{{ detailText.back }}</span>
        </div>

        <div id="rank-show">
            <div class="panel-header">
                <span class="dish-show-title">{{ detailText.detailTitle }}</span>
                <span class="panel-subtitle">{{ detailText.detailSubtitle }}</span>
            </div>

            <a-comment class="selection-comment detail-comment">
                <template #avatar>
                    <a-avatar :size="56" class="user-avatar">{{ getUserInitial(currentSelection.user_id) }}</a-avatar>
                </template>

                <template #author>
                    <div class="comment-author-row">
                        <span class="user-name">{{ currentSelection.user_id }}</span>
                        <a-rate :value="getTargetRate(getSelectionTargetKey(currentSelection.id))" disabled allow-half class="inline-rate" />
                        <span class="reply-rate-number">{{ getTargetRate(getSelectionTargetKey(currentSelection.id)) }}</span>
                    </div>
                </template>

                <template #datetime>
                    <span class="meta-date">{{ currentSelection.date }}</span>
                </template>

                <template #content>
                    <div class="selection-main">
                        <div class="selection-comment-box detail-comment-box">{{ currentSelection.comment }}</div>

                        <div class="selection-extra">
                            <a-tag color="gold" class="selection-tag">
                                {{ text.pricePrefix }}{{ currentSelection.price }}{{ text.priceSuffix }}
                            </a-tag>
                            <a-tag
                                v-for="(pos, index) in currentSelection.position"
                                :key="`${currentSelection.id}-${index}`"
                                color="blue"
                                class="selection-tag"
                            >
                                {{ formatPosition(pos) }}
                            </a-tag>
                        </div>
                    </div>
                </template>

                <template #actions>
                    <span class="comment-action" @click="openReplyBox('selection', currentSelection.id)">{{ text.reply }}</span>
                    <span class="comment-action" @click="openRatingModal('selection', currentSelection.id, currentSelection.user_id)">
                        {{ text.rateAction }}
                    </span>
                </template>
            </a-comment>

            <div v-if="isReplyingTo('selection', currentSelection.id)" class="reply-editor">
                <div class="section-title">{{ detailText.replyBoxTitle }}</div>
                <a-textarea
                    v-model:value="replyContent"
                    :rows="4"
                    :placeholder="detailText.replyPlaceholder"
                />
                <div class="reply-editor-actions">
                    <a-button @click="cancelReply">{{ detailText.cancelReply }}</a-button>
                    <a-button type="primary" @click="submitReply">{{ text.submit }}</a-button>
                </div>
            </div>
        </div>

        <div id="rank-show" class="comment-panel">
            <div class="panel-header">
                <span class="dish-show-title">{{ detailText.commentTitle }}</span>
                <span class="panel-subtitle">{{ detailText.commentSubtitle }}</span>
            </div>

            <a-list :data-source="commentList" :split="false">
                <template #renderItem="{ item }">
                    <a-list-item class="selection-list-item" :class="{ 'nested-comment-item': item.level > 0 }">
                        <div class="comment-thread">
                            <a-comment class="selection-comment" :style="{ marginLeft: `${item.level * 64}px` }">
                                <template #avatar>
                                    <a-avatar :size="48" class="user-avatar">{{ getUserInitial(item.user_id) }}</a-avatar>
                                </template>

                                <template #author>
                                    <div class="comment-author-row">
                                        <span class="user-name comment-user-name">{{ item.user_id }}</span>
                                        <template v-if="getTargetRate(getCommentTargetKey(item.id)) > 0">
                                            <a-rate
                                                :value="getTargetRate(getCommentTargetKey(item.id))"
                                                disabled
                                                allow-half
                                                class="inline-rate"
                                            />
                                            <span class="reply-rate-number">{{ getTargetRate(getCommentTargetKey(item.id)) }}</span>
                                        </template>
                                    </div>
                                </template>

                                <template #datetime>
                                    <span class="meta-date">{{ item.date }}</span>
                                </template>

                                <template #content>
                                    <div class="selection-main">
                                        <div v-if="item.reply" class="reply-target">
                                            @{{ item.reply['user-id'] }}
                                        </div>
                                        <div class="selection-comment-box">{{ item.detail }}</div>
                                    </div>
                                </template>

                                <template #actions>
                                    <span class="comment-action" @click="openReplyBox('comment', item.id)">{{ text.reply }}</span>
                                    <span class="comment-action" @click="openRatingModal('comment', item.id, item.user_id)">
                                        {{ text.rateAction }}
                                    </span>
                                </template>
                            </a-comment>

                            <div
                                v-if="isReplyingTo('comment', item.id)"
                                class="reply-editor inline-reply-editor"
                                :style="{ marginLeft: `${item.level * 64 + 64}px` }"
                            >
                                <div class="section-title">{{ detailText.replyCommentTitle }}</div>
                                <a-textarea
                                    v-model:value="replyContent"
                                    :rows="4"
                                    :placeholder="detailText.replyPlaceholder"
                                />
                                <div class="reply-editor-actions">
                                    <a-button @click="cancelReply">{{ detailText.cancelReply }}</a-button>
                                    <a-button type="primary" @click="submitReply">{{ text.submit }}</a-button>
                                </div>
                            </div>
                        </div>
                    </a-list-item>
                </template>
            </a-list>
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
import { LeftOutlined } from '@ant-design/icons-vue';
import { useRoute, useRouter } from 'vue-router';
import { createMockSelectionComments, createMockSelections } from '@/data/mockData';
import RatingModal from '@/components/RatingModal.vue';
import Selection_Comment from '@/models/SelectionComment';
import { selectionListText, sharedText } from '@/models/text';

const route = useRoute();
const router = useRouter();

const text = {
    ...sharedText,
    ...selectionListText,
};

const detailText = {
    back: '\u8fd4\u56de',
    detailTitle: '\u5206\u4eab\u8be6\u60c5',
    detailSubtitle: '\u67e5\u770b\u8fd9\u6761\u5206\u4eab\u7684\u5b8c\u6574\u5185\u5bb9\u3001\u4ef7\u683c\u548c\u8d2d\u4e70\u4f4d\u7f6e',
    commentTitle: '\u8bc4\u8bba\u533a',
    commentSubtitle: '\u5ef6\u7eed\u5217\u8868\u9875\u7684\u8bc4\u8bba\u5c55\u793a\u98ce\u683c',
    replyBoxTitle: '\u56de\u590d\u8fd9\u6761\u5206\u4eab',
    replyCommentTitle: '\u56de\u590d\u8fd9\u6761\u8bc4\u8bba',
    replyPlaceholder: '\u8bf7\u8f93\u5165\u4f60\u7684\u56de\u590d\u5185\u5bb9',
    cancelReply: '\u53d6\u6d88',
};

const selections = createMockSelections();
const routeSelectionId = Number(route.params.id);
const currentSelection = computed(
    () => selections.find((item) => item.id === routeSelectionId) || selections[0],
);

const comments = ref(createMockSelectionComments(currentSelection.value.id));

const buildCommentTree = (items, parentId = null, level = 0) =>
    items
        .filter((item) => (item.reply ? item.reply['comment-id'] : null) === parentId)
        .flatMap((item) => [
            { ...item, level },
            ...buildCommentTree(items, item.id, level + 1),
        ]);

const commentList = computed(() =>
    buildCommentTree(
        comments.value.filter((item) => item.selection_id === currentSelection.value.id),
    ),
);

const ratingModalVisible = ref(false);
const ratingValue = ref(0);
const ratingTargetKey = ref('');
const ratingTargetName = ref('');
const targetRates = ref({
    [`selection-${currentSelection.value.id}`]: currentSelection.value.rate,
});

const activeReplyTarget = ref({ type: '', id: '' });
const replyContent = ref('');

const getSelectionTargetKey = (id) => `selection-${id}`;
const getCommentTargetKey = (id) => `comment-${id}`;
const getUserInitial = (userId) => userId.slice(0, 1);
const formatPosition = (pos) => `${text.purchasePrefix}${pos.floor}${text.floor}(${pos.window}${text.window})`;
const getTargetRate = (key) => targetRates.value[key] ?? 0;
const isReplyingTo = (type, id) => activeReplyTarget.value.type === type && activeReplyTarget.value.id === id;

const ratingModalTitle = computed(() => `${text.rateTitlePrefix}${ratingTargetName.value}${text.rateTitleSuffix}`);

const openReplyBox = (type, id) => {
    activeReplyTarget.value = { type, id };
    replyContent.value = '';
};

const cancelReply = () => {
    activeReplyTarget.value = { type: '', id: '' };
    replyContent.value = '';
};

const openRatingModal = (type, id, userName) => {
    ratingTargetKey.value = type === 'selection' ? getSelectionTargetKey(id) : getCommentTargetKey(id);
    ratingTargetName.value = userName;
    ratingValue.value = getTargetRate(ratingTargetKey.value);
    ratingModalVisible.value = true;
};

const updateRatingValue = (value) => {
    ratingValue.value = value;
};

const closeRatingModal = () => {
    ratingModalVisible.value = false;
};

const submitRating = () => {
    targetRates.value = {
        ...targetRates.value,
        [ratingTargetKey.value]: ratingValue.value,
    };
    ratingModalVisible.value = false;
    message.success(text.submitRating);
};

const submitReply = () => {
    const cleanReply = replyContent.value.trim();

    if (!cleanReply) {
        message.warning(detailText.replyPlaceholder);
        return;
    }

    comments.value.push(
        new Selection_Comment(
            `${currentSelection.value.id}-comment-${Date.now()}`,
            text.myUserName,
            new Date().toISOString().slice(0, 10),
            cleanReply,
            currentSelection.value.id,
            activeReplyTarget.value.type === 'comment'
                ? {
                    'user-id': commentList.value.find((item) => item.id === activeReplyTarget.value.id)?.user_id || '',
                    'comment-id': activeReplyTarget.value.id,
                }
                : null,
        ),
    );

    cancelReply();
    message.success(text.submitSuccess);
};

const goBack = () => {
    router.back();
};
</script>

<style scoped>
#selection-detail-page {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.detail-back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    width: fit-content;
    padding: 8px 14px;
    border: 1px solid #e6e6e6;
    border-radius: 999px;
    background: #fff;
    color: #1f1f1f;
    cursor: pointer;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, color 0.2s ease;
}

.detail-back:hover {
    border-color: #d9d9d9;
    color: #1677ff;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
}

.back-icon {
    font-size: 14px;
}

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

.comment-panel {
    margin-bottom: 8px;
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

.selection-list-item:last-child {
    border-bottom: 0;
    padding-bottom: 0;
}

.nested-comment-item {
    padding-top: 14px;
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

.detail-comment {
    padding: 18px 20px;
}

.selection-main {
    min-width: 0;
}

.comment-thread {
    width: 100%;
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

.comment-user-name {
    font-size: 16px;
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

.reply-target {
    margin-bottom: 8px;
    color: #1677ff;
    font-size: 13px;
    font-weight: 600;
}

.detail-comment-box {
    font-size: 15px;
    min-height: 120px;
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

.reply-editor {
    margin-top: 16px;
    padding: 18px;
    border: 1px solid #f0f0f0;
    border-radius: 16px;
    background: linear-gradient(180deg, #ffffff 0%, #fcfcfc 100%);
}

.inline-reply-editor {
    margin-left: 64px;
}

.section-title {
    margin-bottom: 8px;
    color: #1f1f1f;
    font-weight: 600;
    font-size: 14px;
}

.reply-editor-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 14px;
}

@media (max-width: 768px) {
    .panel-header {
        align-items: flex-start;
        flex-direction: column;
    }

    .panel-subtitle {
        white-space: normal;
    }

    .detail-comment {
        padding: 16px;
    }

    .inline-reply-editor {
        margin-left: 0;
    }

    .reply-editor-actions {
        justify-content: stretch;
        flex-direction: column;
    }

    .reply-editor-actions :deep(.ant-btn) {
        width: 100%;
    }
}
</style>

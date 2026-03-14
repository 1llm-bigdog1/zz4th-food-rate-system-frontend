<template>
    <div id="suggestion-detail-page">
        <div class="detail-back" @click="goBack">
            <left-outlined class="back-icon" />
            <span>{{ text.back }}</span>
        </div>

        <div id="rank-show">
            <div class="panel-header">
                <span class="dish-show-title">{{ text.detailTitle }}</span>
                <span class="panel-subtitle">{{ text.detailSubtitle }}</span>
            </div>

            <a-comment class="suggestion-comment detail-comment">
                <template #avatar>
                    <a-avatar :size="56" class="user-avatar">{{ getUserInitial(currentSuggestion.user_id) }}</a-avatar>
                </template>

                <template #author>
                    <div class="comment-author-row">
                        <span class="user-name">{{ currentSuggestion.user_id }}</span>
                        <span class="like-pill">
                            <like-filled />
                            {{ currentSuggestion.like }}
                        </span>
                    </div>
                </template>

                <template #datetime>
                    <span class="meta-date">{{ currentSuggestion.date }}</span>
                </template>

                <template #content>
                    <div class="suggestion-main">
                        <div class="suggestion-comment-box detail-comment-box">{{ currentSuggestion.comment }}</div>
                    </div>
                </template>

                <template #actions>
                    <span class="comment-action" @click="openReplyBox('suggestion', currentSuggestion.id)">{{ text.reply }}</span>
                    <span class="comment-action" @click="toggleSuggestionLike">{{ text.likeAction }}({{ currentSuggestion.like }})</span>
                </template>
            </a-comment>

            <div v-if="isReplyingTo('suggestion', currentSuggestion.id)" class="reply-editor">
                <div class="section-title">{{ text.replySuggestionTitle }}</div>
                <a-textarea v-model:value="replyContent" :rows="4" :placeholder="text.replyPlaceholder" />
                <div class="reply-editor-actions">
                    <a-button @click="cancelReply">{{ text.cancelReply }}</a-button>
                    <a-button type="primary" @click="submitReply">{{ text.submit }}</a-button>
                </div>
            </div>
        </div>

        <div id="rank-show" class="comment-panel">
            <div class="panel-header">
                <span class="dish-show-title">{{ text.commentPanelTitle }}</span>
                <span class="panel-subtitle">{{ text.commentPanelSubtitle }}</span>
            </div>

            <a-list :data-source="commentList" :split="false">
                <template #renderItem="{ item }">
                    <a-list-item class="comment-list-item" :class="{ 'nested-comment-item': item.level > 0 }">
                        <div class="comment-thread">
                            <a-comment class="suggestion-comment" :style="{ marginLeft: `${item.level * 64}px` }">
                                <template #avatar>
                                    <a-avatar :size="48" class="user-avatar">{{ getUserInitial(item.user_id) }}</a-avatar>
                                </template>

                                <template #author>
                                    <div class="comment-author-row">
                                        <span class="user-name comment-user-name">{{ item.user_id }}</span>
                                        <span class="like-pill like-pill-small">
                                            <like-filled />
                                            {{ item.likes }}
                                        </span>
                                    </div>
                                </template>

                                <template #datetime>
                                    <span class="meta-date">{{ item.date }}</span>
                                </template>

                                <template #content>
                                    <div class="suggestion-main">
                                        <div v-if="item.replyTargetUser" class="reply-target">@{{ item.replyTargetUser }}</div>
                                        <div class="suggestion-comment-box">{{ item.reply }}</div>
                                    </div>
                                </template>

                                <template #actions>
                                    <span class="comment-action" @click="openReplyBox('comment', item.id)">{{ text.reply }}</span>
                                    <span class="comment-action" @click="toggleCommentLike(item.id)">{{ text.likeAction }}({{ item.likes }})</span>
                                </template>
                            </a-comment>

                            <div
                                v-if="isReplyingTo('comment', item.id)"
                                class="reply-editor inline-reply-editor"
                                :style="{ marginLeft: `${item.level * 64 + 64}px` }"
                            >
                                <div class="section-title">{{ text.replyCommentTitle }}</div>
                                <a-textarea v-model:value="replyContent" :rows="4" :placeholder="text.replyPlaceholder" />
                                <div class="reply-editor-actions">
                                    <a-button @click="cancelReply">{{ text.cancelReply }}</a-button>
                                    <a-button type="primary" @click="submitReply">{{ text.submit }}</a-button>
                                </div>
                            </div>
                        </div>
                    </a-list-item>
                </template>
            </a-list>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { message } from 'ant-design-vue';
import { LeftOutlined, LikeFilled } from '@ant-design/icons-vue';
import { useRoute, useRouter } from 'vue-router';
import { createMockSuggestionComments, createMockSuggestions } from '@/data/mockData';
import Suggestion_Comment from '@/models/SuggestionComment';

const route = useRoute();
const router = useRouter();

const text = {
    back: '\u8fd4\u56de',
    detailTitle: '\u98df\u5802\u5efa\u8bae\u8be6\u60c5',
    detailSubtitle: '\u67e5\u770b\u8fd9\u6761\u98df\u5802\u5efa\u8bae\u7684\u5b8c\u6574\u5185\u5bb9\u548c\u8ffd\u52a0\u8ba8\u8bba',
    commentPanelTitle: '\u8bc4\u8bba\u533a',
    commentPanelSubtitle: '\u56f4\u7ed5\u8fd9\u6761\u98df\u5802\u5efa\u8bae\u7684\u5c42\u7ea7\u8ba8\u8bba',
    reply: '\u56de\u590d',
    likeAction: '\u70b9\u8d5e',
    submit: '\u63d0\u4ea4',
    cancelReply: '\u53d6\u6d88',
    replySuggestionTitle: '\u56de\u590d\u8fd9\u6761\u98df\u5802\u5efa\u8bae',
    replyCommentTitle: '\u56de\u590d\u8fd9\u6761\u8bc4\u8bba',
    replyPlaceholder: '\u8bf7\u8f93\u5165\u4f60\u7684\u8865\u5145\u60f3\u6cd5',
    submitSuccess: '\u611f\u8c22\u4f60\u7684\u53c2\u4e0e\uff0c\u65b0\u8bc4\u8bba\u5df2\u7ecf\u52a0\u5165\u5230\u5f53\u524d\u5217\u8868',
    submitWarning: '\u8bf7\u5148\u8f93\u5165\u56de\u590d\u5185\u5bb9',
    myUserName: '\u6211',
};

const suggestions = ref(createMockSuggestions());
const currentSuggestionId = Number(route.params.id);
const currentSuggestion = computed(() => suggestions.value.find((item) => item.id === currentSuggestionId) || suggestions.value[0]);
const comments = ref(createMockSuggestionComments(currentSuggestion.value.id));
const activeReplyTarget = ref({ type: '', id: '' });
const replyContent = ref('');

const buildCommentTree = (items, parentId = null, level = 0, usersById = {}) =>
    items
        .filter((item) => item.parent_id === parentId)
        .flatMap((item) => [
            {
                ...item,
                level,
                replyTargetUser: item.parent_id ? usersById[item.parent_id] || '' : '',
            },
            ...buildCommentTree(items, item.id, level + 1, usersById),
        ]);

const commentList = computed(() => {
    const related = comments.value.filter((item) => item.suggestion_id === currentSuggestion.value.id);
    const usersById = Object.fromEntries(related.map((item) => [item.id, item.user_id]));
    return buildCommentTree(related, null, 0, usersById);
});

const getUserInitial = (userId) => userId.slice(0, 1);
const isReplyingTo = (type, id) => activeReplyTarget.value.type === type && activeReplyTarget.value.id === id;

const goBack = () => {
    router.back();
};

const openReplyBox = (type, id) => {
    activeReplyTarget.value = { type, id };
    replyContent.value = '';
};

const cancelReply = () => {
    activeReplyTarget.value = { type: '', id: '' };
    replyContent.value = '';
};

const toggleSuggestionLike = () => {
    currentSuggestion.value.like += 1;
};

const toggleCommentLike = (commentId) => {
    const target = comments.value.find((item) => item.id === commentId);
    if (target) target.likes += 1;
};

const submitReply = () => {
    const cleanReply = replyContent.value.trim();

    if (!cleanReply) {
        message.warning(text.submitWarning);
        return;
    }

    comments.value.push(
        new Suggestion_Comment(
            `${currentSuggestion.value.id}-comment-${Date.now()}`,
            text.myUserName,
            new Date().toISOString().slice(0, 10),
            currentSuggestion.value.id,
            cleanReply,
            activeReplyTarget.value.type === 'comment' ? activeReplyTarget.value.id : null,
            0,
        ),
    );

    cancelReply();
    message.success(text.submitSuccess);
};
</script>

<style scoped>
#suggestion-detail-page {
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
    background: linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%);
    color: #389e0d;
    border: 1px solid #b7eb8f;
    box-shadow: 0 8px 18px rgba(82, 196, 26, 0.18);
}

.comment-list-item {
    padding: 18px 0;
    border-bottom: 1px solid #f0f0f0;
}

.comment-list-item:last-child {
    border-bottom: 0;
    padding-bottom: 0;
}

.nested-comment-item {
    padding-top: 14px;
}

:deep(.suggestion-comment) {
    display: block;
    width: 100%;
    box-sizing: border-box;
    border: 1px solid transparent;
    border-radius: 16px;
    padding: 14px 16px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

:deep(.suggestion-comment:hover) {
    border-color: #d9d9d9;
    background: #fff;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.15);
}

:deep(.suggestion-comment .ant-comment-inner) {
    padding: 0;
}

:deep(.suggestion-comment .ant-comment-content-author) {
    margin-bottom: 10px;
}

:deep(.suggestion-comment .ant-comment-actions) {
    margin-top: 12px;
}

.detail-comment {
    padding: 18px 20px;
}

.suggestion-main {
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

.like-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 999px;
    background: #f6ffed;
    color: #389e0d;
    font-weight: 600;
}

.like-pill-small {
    padding: 2px 8px;
    font-size: 13px;
}

.meta-date {
    color: #8c8c8c;
    font-size: 14px;
    flex-shrink: 0;
}

.suggestion-comment-box {
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

.comment-action {
    color: #595959;
    transition: color 0.2s ease;
    cursor: pointer;
}

.comment-action:hover {
    color: #1677ff;
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

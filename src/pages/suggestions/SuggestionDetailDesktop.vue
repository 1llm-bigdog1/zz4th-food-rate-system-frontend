<!--
  文件说明：SuggestionDetailDesktop.vue
  1. 这是桌面端视图文件，负责在大屏设备中保留更高信息密度的排版结构。
  2. 该文件位于 src\pages\suggestions 目录下，和同层文件一起构成当前功能模块的视图或结构层。
  3. 文件中的脚本、模板和样式会围绕同一职责组织，便于后续维护时快速定位问题。
-->
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
                        <span class="like-pill"><like-filled />{{ currentSuggestion.like }}</span>
                    </div>
                </template>
                <template #datetime><span class="meta-date">{{ currentSuggestion.date }}</span></template>
                <template #content><div class="suggestion-comment-box detail-comment-box">{{ currentSuggestion.comment }}</div></template>
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
            <a-list :data-source="pagedCommentList" :split="false">
                <template #renderItem="{ item }">
                    <a-list-item class="comment-list-item" :class="{ 'nested-comment-item': item.level > 0 }">
                        <div class="comment-thread">
                            <a-comment class="suggestion-comment" :style="{ marginLeft: `${item.level * 64}px` }">
                                <template #avatar><a-avatar :size="48" class="user-avatar">{{ getUserInitial(item.user_id) }}</a-avatar></template>
                                <template #author>
                                    <div class="comment-author-row">
                                        <span class="user-name comment-user-name">{{ item.user_id }}</span>
                                        <span class="like-pill like-pill-small"><like-filled />{{ item.likes }}</span>
                                    </div>
                                </template>
                                <template #datetime><span class="meta-date">{{ item.date }}</span></template>
                                <template #content>
                                    <div>
                                        <div v-if="item.replyTargetUser" class="reply-target">@{{ item.replyTargetUser }}</div>
                                        <div class="suggestion-comment-box">{{ item.reply }}</div>
                                    </div>
                                </template>
                                <template #actions>
                                    <span class="comment-action" @click="openReplyBox('comment', item.id)">{{ text.reply }}</span>
                                    <span class="comment-action" @click="toggleCommentLike(item.id)">{{ text.likeAction }}({{ item.likes }})</span>
                                </template>
                            </a-comment>
                            <div v-if="isReplyingTo('comment', item.id)" class="reply-editor inline-reply-editor" :style="{ marginLeft: `${item.level * 64 + 64}px` }">
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
            <div class="pagination-bar">
                <span class="page-size-text">{{ `${text.pageSizePrefix}${pageSize}${text.pageSizeSuffix}` }}</span>
                <a-pagination v-model:current="currentPage" v-model:page-size="pageSize" :total="commentList.length" :show-size-changer="true" :page-size-options="pageSizeOptions" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { LeftOutlined, LikeFilled } from '@ant-design/icons-vue';
import { useSuggestionDetailPage } from '@/composables/useSuggestionDetailPage';
const { text, currentSuggestion, pagedCommentList, commentList, replyContent, currentPage, pageSize, pageSizeOptions, getUserInitial, isReplyingTo, goBack, openReplyBox, cancelReply, toggleSuggestionLike, toggleCommentLike, submitReply } = useSuggestionDetailPage();
</script>

<style scoped>
#suggestion-detail-page { display: flex; flex-direction: column; gap: 20px; }
.detail-back { display: inline-flex; align-items: center; gap: 8px; width: fit-content; padding: 8px 14px; border: 1px solid #e6e6e6; border-radius: 999px; background: #fff; color: #1f1f1f; cursor: pointer; }
#rank-show { border: 1px solid #e6e6e6; border-radius: 8px; padding: 16px; }
.comment-panel { margin-bottom: 8px; }
.panel-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; margin-bottom: 18px; padding-bottom: 14px; border-bottom: 1px solid #f0f0f0; }
.dish-show-title { display: inline-block; font-family: 'Noto Serif SC', 'Microsoft YaHei', serif; font-weight: 800; font-size: 22px; color: #1f1f1f; }
.panel-subtitle { color: #8c8c8c; font-size: 13px; white-space: nowrap; }
.user-avatar { flex-shrink: 0; background: linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%); color: #389e0d; border: 1px solid #b7eb8f; }
.comment-list-item { padding: 18px 0; border-bottom: 1px solid #f0f0f0; }
.comment-list-item:last-child { border-bottom: 0; padding-bottom: 0; }
.nested-comment-item { padding-top: 14px; }
:deep(.suggestion-comment) { display: block; width: 100%; box-sizing: border-box; border: 1px solid transparent; border-radius: 16px; padding: 14px 16px; }
.detail-comment { padding: 18px 20px; }
.comment-thread { width: 100%; }
.comment-author-row { display: inline-flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.user-name { font-size: 18px; font-weight: 700; color: #1f1f1f; }
.comment-user-name { font-size: 16px; }
.like-pill { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 999px; background: #f6ffed; color: #389e0d; font-weight: 600; }
.like-pill-small { padding: 2px 8px; font-size: 13px; }
.meta-date { color: #8c8c8c; font-size: 14px; }
.suggestion-comment-box { border: 1px solid #f0f0f0; border-radius: 14px; padding: 14px 16px; background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%); color: #1f1f1f; line-height: 1.8; white-space: pre-wrap; }
.reply-target { margin-bottom: 8px; color: #1677ff; font-size: 13px; font-weight: 600; }
.detail-comment-box { font-size: 15px; min-height: 120px; }
.comment-action { color: #595959; cursor: pointer; }
.reply-editor { margin-top: 16px; padding: 18px; border: 1px solid #f0f0f0; border-radius: 16px; background: linear-gradient(180deg, #ffffff 0%, #fcfcfc 100%); }
.inline-reply-editor { margin-left: 64px; }
.section-title { margin-bottom: 8px; color: #1f1f1f; font-weight: 600; font-size: 14px; }
.reply-editor-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 14px; }
.pagination-bar { margin-top: 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.page-size-text { color: #595959; font-size: 14px; }
</style>

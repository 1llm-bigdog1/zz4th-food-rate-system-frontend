<!--
  文件说明：SuggestionDetailMobile.vue
  1. 这是移动端视图文件，负责在小屏设备中提供更紧凑的布局与交互展示。
  2. 该文件位于 src\pages\suggestions 目录下，和同层文件一起构成当前功能模块的视图或结构层。
  3. 文件中的脚本、模板和样式会围绕同一职责组织，便于后续维护时快速定位问题。
-->
<template>
    <MobilePageShell :title="text.detailTitle" :subtitle="text.detailSubtitle">
        <a-button class="back-button" @click="goBack">{{ text.back }}</a-button>
        <section class="detail-card">
            <div class="card-top">
                <div class="author-chip">{{ getUserInitial(currentSuggestion.user_id) }}</div>
                <div class="card-headings">
                    <div class="user-name">{{ currentSuggestion.user_id }}</div>
                    <div class="meta-date">{{ currentSuggestion.date }}</div>
                </div>
                <button type="button" class="like-button" @click="toggleSuggestionLike">{{ text.likeAction }} {{ currentSuggestion.like }}</button>
            </div>
            <div class="comment-body">{{ currentSuggestion.comment }}</div>
            <a-button block @click="openReplyBox('suggestion', currentSuggestion.id)">{{ text.reply }}</a-button>
            <div v-if="isReplyingTo('suggestion', currentSuggestion.id)" class="reply-box">
                <div class="field-label">{{ text.replySuggestionTitle }}</div>
                <a-textarea v-model:value="replyContent" :rows="4" :placeholder="text.replyPlaceholder" />
                <div class="reply-actions">
                    <a-button @click="cancelReply">{{ text.cancelReply }}</a-button>
                    <a-button type="primary" :loading="submitting" @click="submitReply">{{ text.submit }}</a-button>
                </div>
            </div>
        </section>
        <section class="detail-card">
            <h2 class="section-title">{{ text.commentPanelTitle }}</h2>
            <p class="section-subtitle">{{ text.commentPanelSubtitle }}</p>
            <div class="mobile-list">
                <article v-for="item in pagedCommentList" :key="item.id" class="comment-card" :style="{ marginLeft: `${item.level * 12}px` }">
                    <div class="card-top">
                        <div class="author-chip small-chip">{{ getUserInitial(item.user_id) }}</div>
                        <div class="card-headings">
                            <div class="user-name">{{ item.user_id }}</div>
                            <div class="meta-date">{{ item.date }}</div>
                        </div>
                        <button type="button" class="like-button" @click="toggleCommentLike(item.id)">{{ item.likes }}</button>
                    </div>
                    <div v-if="item.replyTargetUser" class="reply-target">@{{ item.replyTargetUser }}</div>
                    <div class="comment-body">{{ item.reply }}</div>
                    <a-button block @click="openReplyBox('comment', item.id)">{{ text.reply }}</a-button>
                    <div v-if="isReplyingTo('comment', item.id)" class="reply-box">
                        <div class="field-label">{{ text.replyCommentTitle }}</div>
                        <a-textarea v-model:value="replyContent" :rows="4" :placeholder="text.replyPlaceholder" />
                        <div class="reply-actions">
                            <a-button @click="cancelReply">{{ text.cancelReply }}</a-button>
                            <a-button type="primary" :loading="submitting" @click="submitReply">{{ text.submit }}</a-button>
                        </div>
                    </div>
                </article>
            </div>
            <div class="pagination-bar">
                <span class="page-size-text">{{ `${text.pageSizePrefix}${pageSize}${text.pageSizeSuffix}` }}</span>
                <a-pagination v-model:current="currentPage" v-model:page-size="pageSize" size="small" :total="commentList.length" :show-size-changer="true" :page-size-options="pageSizeOptions" />
            </div>
        </section>
    </MobilePageShell>
</template>

<script setup>
import MobilePageShell from '@/components/mobile/MobilePageShell.vue';
import { useSuggestionDetailPage } from '@/composables/useSuggestionDetailPage';
const { text, currentSuggestion, pagedCommentList, commentList, replyContent, submitting, currentPage, pageSize, pageSizeOptions, getUserInitial, isReplyingTo, goBack, openReplyBox, cancelReply, toggleSuggestionLike, toggleCommentLike, submitReply } = useSuggestionDetailPage();
</script>

<style scoped>
.back-button { width: fit-content; }
.detail-card, .comment-card { padding: 16px; border: 1px solid #e8eaed; border-radius: 20px; background: #fff; }
.mobile-list { display: flex; flex-direction: column; gap: 12px; }
.card-top { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.author-chip { display: inline-flex; align-items: center; justify-content: center; width: 42px; height: 42px; border-radius: 50%; background: #f6ffed; color: #389e0d; font-weight: 700; }
.small-chip { width: 36px; height: 36px; }
.card-headings { flex: 1; min-width: 0; }
.user-name { color: #202124; font-size: 15px; font-weight: 700; }
.meta-date, .section-subtitle { color: #5f6368; font-size: 12px; }
.like-button { border: 0; border-radius: 999px; padding: 6px 10px; background: #f6ffed; color: #389e0d; }
.comment-body { color: #3c4043; line-height: 1.7; white-space: pre-wrap; }
.reply-actions { display: grid; grid-template-columns: 1fr; gap: 10px; margin-top: 12px; }
.reply-box { margin-top: 14px; }
.field-label, .reply-target { margin-bottom: 8px; color: #1a73e8; font-size: 13px; font-weight: 600; }
.section-title { margin: 0 0 4px; color: #202124; font-size: 18px; font-weight: 800; }
.pagination-bar { display: flex; flex-direction: column; gap: 10px; margin-top: 14px; }
.page-size-text { color: #5f6368; font-size: 13px; }
</style>

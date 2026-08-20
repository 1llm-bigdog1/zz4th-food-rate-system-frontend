<!--
  文件说明：SelectionDetailMobile.vue
  1. 这是移动端视图文件，负责在小屏设备中提供更紧凑的布局与交互展示。
  2. 该文件位于 src\pages\selection 目录下，和同层文件一起构成当前功能模块的视图或结构层。
  3. 文件中的脚本、模板和样式会围绕同一职责组织，便于后续维护时快速定位问题。
-->
<template>
    <MobilePageShell :title="detailText.detailTitle" :subtitle="detailText.detailSubtitle">
        <a-button class="back-button" @click="goBack">{{ detailText.back }}</a-button>
        <a-empty v-if="!currentSelection" class="detail-empty" description="内容不存在或已删除" />
        <section v-if="currentSelection" class="detail-card">
            <div class="card-top">
                <div>
                    <div class="user-name">{{ currentSelection.user_id }}</div>
                    <div class="meta-date">{{ currentSelection.date }}</div>
                </div>
                <div class="rate-chip">{{ getTargetRate(getSelectionTargetKey(currentSelection.id)) }}</div>
            </div>
            <div class="comment-body">{{ currentSelection.comment }}</div>
            <div class="chip-row">
                <span class="info-chip">{{ text.pricePrefix }}{{ currentSelection.price }}{{ text.priceSuffix }}</span>
                <span v-for="(pos, index) in currentSelection.position" :key="`${currentSelection.id}-${index}`" class="info-chip">{{ formatPosition(pos) }}</span>
            </div>
            <div class="action-row">
                <a-button @click="openReplyBox('selection', currentSelection.id)">{{ text.reply }}</a-button>
                <a-button type="primary" @click="openRatingModal('selection', currentSelection.id, currentSelection.user_id)">{{ text.rateAction }}</a-button>
            </div>
            <div v-if="isReplyingTo('selection', currentSelection.id)" class="reply-box">
                <div class="field-label">{{ detailText.replyBoxTitle }}</div>
                <a-textarea v-model:value="replyContent" :rows="4" :placeholder="detailText.replyPlaceholder" />
                <div class="reply-actions">
                    <a-button @click="cancelReply">{{ detailText.cancelReply }}</a-button>
                    <a-button type="primary" :loading="submitting" @click="submitReply">{{ text.submit }}</a-button>
                </div>
            </div>
        </section>
        <section v-if="currentSelection" class="detail-card">
            <h2 class="section-title">{{ detailText.commentTitle }}</h2>
            <p class="section-subtitle">{{ detailText.commentSubtitle }}</p>
            <div class="mobile-list">
                <article v-for="item in pagedCommentList" :key="item.id" class="comment-card" :style="{ marginLeft: `${item.level * 12}px` }">
                    <div class="card-top">
                        <div>
                            <div class="user-name">{{ item.user_id }}</div>
                            <div class="meta-date">{{ item.date }}</div>
                        </div>
                        <div class="rate-chip">{{ getTargetRate(getCommentTargetKey(item.id)) }}</div>
                    </div>
                    <div v-if="item.reply" class="reply-target">@{{ item.reply['user-id'] }}</div>
                    <div class="comment-body">{{ item.detail }}</div>
                    <div class="action-row">
                        <a-button @click="openReplyBox('comment', item.id)">{{ text.reply }}</a-button>
                        <a-button type="primary" @click="openRatingModal('comment', item.id, item.user_id)">{{ text.rateAction }}</a-button>
                    </div>
                    <div v-if="isReplyingTo('comment', item.id)" class="reply-box">
                        <div class="field-label">{{ detailText.replyCommentTitle }}</div>
                        <a-textarea v-model:value="replyContent" :rows="4" :placeholder="detailText.replyPlaceholder" />
                        <div class="reply-actions">
                            <a-button @click="cancelReply">{{ detailText.cancelReply }}</a-button>
                            <a-button type="primary" :loading="submitting" @click="submitReply">{{ text.submit }}</a-button>
                        </div>
                    </div>
                </article>
            </div>
            <div class="pagination-bar">
                <span class="page-size-text">{{ `${detailText.pageSizePrefix}${pageSize}${detailText.pageSizeSuffix}` }}</span>
                <a-pagination v-model:current="currentPage" v-model:page-size="pageSize" size="small" :total="commentList.length" :show-size-changer="true" :page-size-options="pageSizeOptions" />
            </div>
        </section>
        <RatingModal :open="ratingModalVisible" :title="ratingModalTitle" :rating-value="ratingValue" :loading="submitting" :submit-text="text.submitRating" @update:ratingValue="updateRatingValue" @cancel="closeRatingModal" @submit="submitRating" />
    </MobilePageShell>
</template>

<script setup>
import MobilePageShell from '@/components/mobile/MobilePageShell.vue';
import RatingModal from '@/components/RatingModal.vue';
import { useSelectionDetailPage } from '@/composables/useSelectionDetailPage';
const { text, detailText, currentSelection, pagedCommentList, commentList, ratingModalVisible, ratingModalTitle, ratingValue, replyContent, submitting, currentPage, pageSize, pageSizeOptions, getSelectionTargetKey, getCommentTargetKey, formatPosition, getTargetRate, isReplyingTo, openReplyBox, cancelReply, openRatingModal, updateRatingValue, closeRatingModal, submitRating, submitReply, goBack } = useSelectionDetailPage();
</script>

<style scoped>
.back-button { width: fit-content; }
.detail-empty { margin-top: 16px; }
.detail-card, .comment-card { padding: 16px; border: 1px solid #e8eaed; border-radius: 20px; background: #fff; }
.mobile-list { display: flex; flex-direction: column; gap: 12px; }
.card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
.user-name { color: #202124; font-size: 15px; font-weight: 700; }
.meta-date, .section-subtitle { color: #5f6368; font-size: 12px; }
.rate-chip, .info-chip { display: inline-flex; align-items: center; padding: 6px 10px; border-radius: 999px; background: #eef3fd; color: #1a73e8; font-size: 12px; }
.comment-body { color: #3c4043; line-height: 1.7; white-space: pre-wrap; }
.chip-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.action-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.reply-box { margin-top: 14px; }
.reply-actions { display: grid; grid-template-columns: 1fr; gap: 10px; margin-top: 12px; }
.field-label, .reply-target { margin-bottom: 8px; color: #1a73e8; font-size: 13px; font-weight: 600; }
.section-title { margin: 0 0 4px; color: #202124; font-size: 18px; font-weight: 800; }
.pagination-bar { display: flex; flex-direction: column; gap: 10px; margin-top: 14px; }
.page-size-text { color: #5f6368; font-size: 13px; }
</style>

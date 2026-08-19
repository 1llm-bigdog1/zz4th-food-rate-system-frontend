<!--
  文件说明：SelectionDetailDesktop.vue
  1. 这是桌面端视图文件，负责在大屏设备中保留更高信息密度的排版结构。
  2. 该文件位于 src\pages\selection 目录下，和同层文件一起构成当前功能模块的视图或结构层。
  3. 文件中的脚本、模板和样式会围绕同一职责组织，便于后续维护时快速定位问题。
-->
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
                <template #avatar><a-avatar :size="56" class="user-avatar">{{ getUserInitial(currentSelection.user_id) }}</a-avatar></template>
                <template #author>
                    <div class="comment-author-row">
                        <span class="user-name">{{ currentSelection.user_id }}</span>
                        <a-rate :value="getTargetRate(getSelectionTargetKey(currentSelection.id))" disabled allow-half class="inline-rate" />
                        <span class="reply-rate-number">{{ getTargetRate(getSelectionTargetKey(currentSelection.id)) }}</span>
                    </div>
                </template>
                <template #datetime><span class="meta-date">{{ currentSelection.date }}</span></template>
                <template #content>
                    <div class="selection-main">
                        <div class="selection-comment-box detail-comment-box">{{ currentSelection.comment }}</div>
                        <div class="selection-extra">
                            <a-tag color="gold" class="selection-tag">{{ text.pricePrefix }}{{ currentSelection.price }}{{ text.priceSuffix }}</a-tag>
                            <a-tag v-for="(pos, index) in currentSelection.position" :key="`${currentSelection.id}-${index}`" color="blue" class="selection-tag">{{ formatPosition(pos) }}</a-tag>
                        </div>
                    </div>
                </template>
                <template #actions>
                    <span class="comment-action" @click="openReplyBox('selection', currentSelection.id)">{{ text.reply }}</span>
                    <span class="comment-action" @click="openRatingModal('selection', currentSelection.id, currentSelection.user_id)">{{ text.rateAction }}</span>
                </template>
            </a-comment>
            <div v-if="isReplyingTo('selection', currentSelection.id)" class="reply-editor">
                <div class="section-title">{{ detailText.replyBoxTitle }}</div>
                <a-textarea v-model:value="replyContent" :rows="4" :placeholder="detailText.replyPlaceholder" />
                <div class="reply-editor-actions">
                    <a-button @click="cancelReply">{{ detailText.cancelReply }}</a-button>
                    <a-button type="primary" :loading="submitting" @click="submitReply">{{ text.submit }}</a-button>
                </div>
            </div>
        </div>
        <div id="rank-show" class="comment-panel">
            <div class="panel-header">
                <span class="dish-show-title">{{ detailText.commentTitle }}</span>
                <span class="panel-subtitle">{{ detailText.commentSubtitle }}</span>
            </div>
            <a-list :data-source="pagedCommentList" :split="false">
                <template #renderItem="{ item }">
                    <a-list-item class="selection-list-item" :class="{ 'nested-comment-item': item.level > 0 }">
                        <div class="comment-thread">
                            <a-comment class="selection-comment" :style="{ marginLeft: `${item.level * 64}px` }">
                                <template #avatar><a-avatar :size="48" class="user-avatar">{{ getUserInitial(item.user_id) }}</a-avatar></template>
                                <template #author>
                                    <div class="comment-author-row">
                                        <span class="user-name comment-user-name">{{ item.user_id }}</span>
                                        <template v-if="getTargetRate(getCommentTargetKey(item.id)) > 0">
                                            <a-rate :value="getTargetRate(getCommentTargetKey(item.id))" disabled allow-half class="inline-rate" />
                                            <span class="reply-rate-number">{{ getTargetRate(getCommentTargetKey(item.id)) }}</span>
                                        </template>
                                    </div>
                                </template>
                                <template #datetime><span class="meta-date">{{ item.date }}</span></template>
                                <template #content>
                                    <div>
                                        <div v-if="item.reply" class="reply-target">@{{ item.reply['user-id'] }}</div>
                                        <div class="selection-comment-box">{{ item.detail }}</div>
                                    </div>
                                </template>
                                <template #actions>
                                    <span class="comment-action" @click="openReplyBox('comment', item.id)">{{ text.reply }}</span>
                                    <span class="comment-action" @click="openRatingModal('comment', item.id, item.user_id)">{{ text.rateAction }}</span>
                                </template>
                            </a-comment>
                            <div v-if="isReplyingTo('comment', item.id)" class="reply-editor inline-reply-editor" :style="{ marginLeft: `${item.level * 64 + 64}px` }">
                                <div class="section-title">{{ detailText.replyCommentTitle }}</div>
                                <a-textarea v-model:value="replyContent" :rows="4" :placeholder="detailText.replyPlaceholder" />
                                <div class="reply-editor-actions">
                                    <a-button @click="cancelReply">{{ detailText.cancelReply }}</a-button>
                                    <a-button type="primary" :loading="submitting" @click="submitReply">{{ text.submit }}</a-button>
                                </div>
                            </div>
                        </div>
                    </a-list-item>
                </template>
            </a-list>
            <div class="pagination-bar">
                <span class="page-size-text">{{ `${detailText.pageSizePrefix}${pageSize}${detailText.pageSizeSuffix}` }}</span>
                <a-pagination v-model:current="currentPage" v-model:page-size="pageSize" :total="commentList.length" :show-size-changer="true" :page-size-options="pageSizeOptions" />
            </div>
        </div>
        <RatingModal :open="ratingModalVisible" :title="ratingModalTitle" :rating-value="ratingValue" :loading="submitting" :submit-text="text.submitRating" @update:ratingValue="updateRatingValue" @cancel="closeRatingModal" @submit="submitRating" />
    </div>
</template>

<script setup>
import { LeftOutlined } from '@ant-design/icons-vue';
import RatingModal from '@/components/RatingModal.vue';
import { useSelectionDetailPage } from '@/composables/useSelectionDetailPage';
const { text, detailText, currentSelection, pagedCommentList, commentList, ratingModalVisible, ratingModalTitle, ratingValue, replyContent, submitting, currentPage, pageSize, pageSizeOptions, getSelectionTargetKey, getCommentTargetKey, getUserInitial, formatPosition, getTargetRate, isReplyingTo, openReplyBox, cancelReply, openRatingModal, updateRatingValue, closeRatingModal, submitRating, submitReply, goBack } = useSelectionDetailPage();
</script>

<style scoped>
#selection-detail-page { display: flex; flex-direction: column; gap: 20px; }
.detail-back { display: inline-flex; align-items: center; gap: 8px; width: fit-content; padding: 8px 14px; border: 1px solid #e6e6e6; border-radius: 999px; background: #fff; color: #1f1f1f; cursor: pointer; }
#rank-show { border: 1px solid #e6e6e6; border-radius: 8px; padding: 16px; }
.comment-panel { margin-bottom: 8px; }
.panel-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; margin-bottom: 18px; padding-bottom: 14px; border-bottom: 1px solid #f0f0f0; }
.dish-show-title { display: inline-block; font-family: 'Noto Serif SC', 'Microsoft YaHei', serif; font-weight: 800; font-size: 22px; color: #1f1f1f; }
.panel-subtitle { color: #8c8c8c; font-size: 13px; white-space: nowrap; }
.user-avatar { flex-shrink: 0; background: linear-gradient(135deg, #fff1f0 0%, #ffd6d6 100%); color: #cf1322; border: 1px solid #ffb3b3; }
.selection-list-item { padding: 18px 0; border-bottom: 1px solid #f0f0f0; }
.selection-list-item:last-child { border-bottom: 0; padding-bottom: 0; }
.nested-comment-item { padding-top: 14px; }
:deep(.selection-comment) { display: block; width: 100%; box-sizing: border-box; border: 1px solid transparent; border-radius: 16px; padding: 14px 16px; }
.detail-comment { padding: 18px 20px; }
.comment-thread { width: 100%; }
.comment-author-row { display: inline-flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.user-name { font-size: 18px; font-weight: 700; color: #1f1f1f; }
.comment-user-name { font-size: 16px; }
.inline-rate { transform: scale(.9); transform-origin: left center; }
.meta-date { color: #8c8c8c; font-size: 14px; }
.selection-comment-box { border: 1px solid #f0f0f0; border-radius: 14px; padding: 14px 16px; background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%); color: #1f1f1f; line-height: 1.8; white-space: pre-wrap; }
.reply-target { margin-bottom: 8px; color: #1677ff; font-size: 13px; font-weight: 600; }
.detail-comment-box { font-size: 15px; min-height: 120px; }
.selection-extra { margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px; }
.selection-tag { margin: 0; padding: 4px 10px; border-radius: 999px; }
.comment-action { color: #595959; cursor: pointer; }
.reply-rate-number { color: #1f1f1f; font-weight: 600; }
.reply-editor { margin-top: 16px; padding: 18px; border: 1px solid #f0f0f0; border-radius: 16px; background: linear-gradient(180deg, #ffffff 0%, #fcfcfc 100%); }
.inline-reply-editor { margin-left: 64px; }
.section-title { margin-bottom: 8px; color: #1f1f1f; font-weight: 600; font-size: 14px; }
.reply-editor-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 14px; }
.pagination-bar { margin-top: 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.page-size-text { color: #595959; font-size: 14px; }
</style>

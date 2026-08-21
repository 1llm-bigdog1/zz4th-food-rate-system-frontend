<!--
  文件说明：AdviceListMobile.vue
  1. 这是移动端视图文件，负责在小屏设备中提供更紧凑的布局与交互展示。
  2. 该文件位于 src\pages\advice 目录下，和同层文件一起构成当前功能模块的视图或结构层。
  3. 文件中的脚本、模板和样式会围绕同一职责组织，便于后续维护时快速定位问题。
-->
<template>
    <MobilePageShell :title="text.pageTitle" :subtitle="text.listSubtitle">
        <div class="mobile-list">
            <article
                v-for="item in visibleAdvices"
                :key="item.id"
                class="mobile-comment-card"
                @click="goToAdviceDetail(item)"
            >
                <div class="card-top">
                    <div class="author-chip">
                        <img v-if="displayAvatar(item.user_id)" :src="displayAvatar(item.user_id)" alt="" class="chip-avatar" />
                        <span v-else>{{ getUserInitial(item.user_id) }}</span>
                    </div>
                    <div class="card-headings">
                        <div class="user-name">{{ displayUser(item.user_id).username }}</div>
                        <div class="meta-date">{{ item.date }}</div>
                    </div>
                    <button type="button" class="like-button" :class="{ liked: item.liked }" @click.stop="toggleLike(item)">
                        {{ item.liked ? text.likedAction : text.likeAction }} {{ item.like }}
                    </button>
                </div>
                <div class="comment-body">{{ item.comment }}</div>
                <a-button block @click.stop="goToAdviceDetail(item)">{{ text.reply }}</a-button>
            </article>
        </div>

        <a-button v-if="hasMore" block @click="loadMore">{{ text.loadMore }}</a-button>

        <section class="mobile-form-card">
            <h2 class="section-title">{{ text.contributeTitle }}</h2>
            <p class="section-subtitle">{{ text.contributeSubtitle }}</p>
            <div class="field-label">{{ text.commentTitle }}</div>
            <a-textarea v-model:value="form.comment" :rows="5" :placeholder="text.commentPlaceholder" />
            <a-button type="primary" block class="submit-button" :loading="submitting" @click="submitAdvice">{{ text.submit }}</a-button>
        </section>
    </MobilePageShell>
</template>

<script setup>
import MobilePageShell from '@/components/mobile/MobilePageShell.vue';
import { useAdviceListPage } from '@/composables/useAdviceListPage';

// 移动端改成更轻的评论卡片，保留原有交互和提交能力。
const {
    text,
    form,
    submitting,
    visibleAdvices,
    hasMore,
    getUserInitial,
    displayUser,
    displayAvatar,
    loadMore,
    goToAdviceDetail,
    toggleLike,
    submitAdvice,
} = useAdviceListPage();
</script>

<style scoped>
.mobile-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.mobile-comment-card,
.mobile-form-card {
    padding: 16px;
    border: 1px solid #e8eaed;
    border-radius: 20px;
    background: #fff;
}

.card-top {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
}

.author-chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: #fff7e6;
    color: #d48806;
    font-weight: 700;
}

.chip-avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}

.card-headings {
    flex: 1;
    min-width: 0;
}

.user-name {
    color: #202124;
    font-size: 15px;
    font-weight: 700;
}

.meta-date,
.section-subtitle {
    color: #5f6368;
    font-size: 12px;
}

.like-button {
    border: 0;
    border-radius: 999px;
    padding: 6px 10px;
    background: #fff7e6;
    color: #d48806;
}

.like-button.liked {
    background: #e8f0fe;
    color: #1a73e8;
}

.comment-body {
    margin-bottom: 12px;
    color: #3c4043;
    line-height: 1.7;
    white-space: pre-wrap;
}

.section-title {
    margin: 0 0 4px;
    color: #202124;
    font-size: 18px;
    font-weight: 800;
}

.field-label {
    margin: 14px 0 8px;
    color: #3c4043;
    font-size: 13px;
    font-weight: 600;
}

.submit-button {
    margin-top: 14px;
}
</style>

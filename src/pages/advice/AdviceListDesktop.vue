<!--
  文件说明：AdviceListDesktop.vue
  1. 这是桌面端视图文件，负责在大屏设备中保留更高信息密度的排版结构。
  2. 该文件位于 src\pages\advice 目录下，和同层文件一起构成当前功能模块的视图或结构层。
  3. 文件中的脚本、模板和样式会围绕同一职责组织，便于后续维护时快速定位问题。
-->
<template>
    <div id="advice-list-page">
        <div id="rank-show">
            <div class="panel-header">
                <span class="dish-show-title">{{ text.pageTitle }}</span>
                <span class="panel-subtitle">{{ text.listSubtitle }}</span>
            </div>

            <a-list :data-source="visibleAdvices" :split="false" class="advice-list">
                <template #renderItem="{ item }">
                    <a-list-item class="advice-list-item">
                        <a-comment class="advice-comment advice-comment-link" @click="goToAdviceDetail(item)">
                            <template #avatar>
                                <a-avatar :size="52" class="user-avatar">{{ getUserInitial(item.user_id) }}</a-avatar>
                            </template>

                            <template #author>
                                <div class="comment-author-row">
                                    <span class="user-name">{{ item.user_id }}</span>
                                    <span class="like-pill">
                                        <like-filled />
                                        {{ item.like }}
                                    </span>
                                </div>
                            </template>

                            <template #datetime>
                                <span class="meta-date">{{ item.date }}</span>
                            </template>

                            <template #content>
                                <div class="advice-main">
                                    <div class="advice-comment-box">{{ item.comment }}</div>
                                </div>
                            </template>

                            <template #actions>
                                <span class="comment-action" @click.stop="goToAdviceDetail(item)">{{ text.reply }}</span>
                                <span class="comment-action" @click.stop="toggleLike(item)">
                                    {{ text.likeAction }}({{ item.like }})
                                </span>
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

                <div class="submit-row">
                    <a-button type="primary" size="large" :loading="submitting" @click="submitAdvice">{{ text.submit }}</a-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { LikeFilled } from '@ant-design/icons-vue';
import { useAdviceListPage } from '@/composables/useAdviceListPage';

const {
    text,
    form,
    submitting,
    visibleAdvices,
    hasMore,
    getUserInitial,
    loadMore,
    goToAdviceDetail,
    toggleLike,
    submitAdvice,
} = useAdviceListPage();
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
    background: linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%);
    color: #d48806;
    border: 1px solid #ffd591;
    box-shadow: 0 8px 18px rgba(250, 173, 20, 0.18);
}

.advice-list-item {
    padding: 18px 0;
    border-bottom: 1px solid #f0f0f0;
}

:deep(.advice-comment) {
    display: block;
    width: 100%;
    box-sizing: border-box;
    border: 1px solid transparent;
    border-radius: 16px;
    padding: 14px 16px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.advice-comment-link {
    cursor: pointer;
}

:deep(.advice-comment:hover) {
    border-color: #d9d9d9;
    background: #fff;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.15);
}

:deep(.advice-comment .ant-comment-inner) {
    padding: 0;
}

:deep(.advice-comment .ant-comment-content-author) {
    margin-bottom: 10px;
}

:deep(.advice-comment .ant-comment-actions) {
    margin-top: 12px;
}

.advice-main {
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

.like-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 999px;
    background: #fff7e6;
    color: #d48806;
    font-weight: 600;
}

.meta-date {
    color: #8c8c8c;
    font-size: 14px;
    flex-shrink: 0;
}

.advice-comment-box {
    border: 1px solid #f0f0f0;
    border-radius: 14px;
    padding: 14px 16px;
    background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
    color: #1f1f1f;
    line-height: 1.8;
    white-space: pre-wrap;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.comment-action {
    color: #595959;
    transition: color 0.2s ease;
    cursor: pointer;
}

.comment-action:hover {
    color: #1677ff;
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

.form-section {
    margin-bottom: 14px;
}

.section-title {
    margin-bottom: 8px;
    color: #1f1f1f;
    font-weight: 600;
    font-size: 14px;
}

.submit-row {
    display: flex;
    justify-content: flex-end;
}
</style>

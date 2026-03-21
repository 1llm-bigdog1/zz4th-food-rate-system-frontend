<!--
  文件说明：RatingDetailMobile.vue
  1. 这是移动端视图文件，负责在小屏设备中提供更紧凑的布局与交互展示。
  2. 该文件位于 src\pages\rating 目录下，和同层文件一起构成当前功能模块的视图或结构层。
  3. 文件中的脚本、模板和样式会围绕同一职责组织，便于后续维护时快速定位问题。
-->
<template>
    <MobilePageShell :title="text.pageTitle" :subtitle="text.pageSubtitle">
        <section class="mobile-section">
            <div class="section-header">
                <h2 class="section-title">{{ text.standardTitle }}</h2>
            </div>

            <div class="mobile-rank-list">
                <div v-for="item in pagedStandardRankData" :key="`standard-${item.id}`" class="rank-card">
                    <div class="rank-top">
                        <span class="rank-badge">#{{ item.rank }}</span>
                        <span class="dish-name">{{ item.name }}</span>
                    </div>
                    <div class="rank-meta">{{ item.position }}</div>
                    <div class="rank-bottom">
                        <span class="meta-chip">{{ text.rate }} {{ item.rate }}</span>
                        <span class="meta-chip">{{ text.priceWithUnit }} {{ item.price }}</span>
                    </div>
                </div>
            </div>

            <div class="pagination-bar">
                <span class="page-size-text">{{ `${text.pageSizePrefix}${standardPageSize}${text.pageSizeSuffix}` }}</span>
                <a-pagination
                    v-model:current="standardCurrent"
                    v-model:page-size="standardPageSize"
                    size="small"
                    :total="standardRankData.length"
                    :show-size-changer="true"
                    :page-size-options="pageSizeOptions"
                />
            </div>
        </section>

        <section class="mobile-section">
            <div class="section-header">
                <h2 class="section-title">{{ text.weightedTitle }}</h2>
            </div>

            <div class="slider-block">
                <div class="slider-labels">
                    <span>{{ text.priceFocus }}</span>
                    <span>{{ text.tasteFocus }}</span>
                </div>
                <a-slider v-model:value="alpha" :min="0" :max="1" :step="0.1" :marks="alphaMarks" />
            </div>

            <div class="mobile-rank-list">
                <div v-for="item in pagedWeightedRankData" :key="`weighted-${item.id}`" class="rank-card">
                    <div class="rank-top">
                        <span class="rank-badge">#{{ item.rank }}</span>
                        <span class="dish-name">{{ item.name }}</span>
                    </div>
                    <div class="rank-meta">{{ item.position }}</div>
                    <div class="rank-bottom">
                        <span class="meta-chip">{{ text.rate }} {{ item.rate }}</span>
                        <span class="meta-chip">{{ text.priceWithUnit }} {{ item.price }}</span>
                        <span class="meta-chip">{{ text.weightedScore }} {{ item.weightedScore }}</span>
                    </div>
                </div>
            </div>

            <div class="pagination-bar">
                <span class="page-size-text">{{ `${text.pageSizePrefix}${weightedPageSize}${text.pageSizeSuffix}` }}</span>
                <a-pagination
                    v-model:current="weightedCurrent"
                    v-model:page-size="weightedPageSize"
                    size="small"
                    :total="weightedRankData.length"
                    :show-size-changer="true"
                    :page-size-options="pageSizeOptions"
                />
            </div>
        </section>
    </MobilePageShell>
</template>

<script setup>
import MobilePageShell from '@/components/mobile/MobilePageShell.vue';
import { useRatingDetailPage } from '@/composables/useRatingDetailPage';

// 移动端把表格改成卡片列表，避免小屏横向滚动影响阅读。
const {
    text,
    alpha,
    alphaMarks,
    pageSizeOptions,
    standardCurrent,
    standardPageSize,
    weightedCurrent,
    weightedPageSize,
    standardRankData,
    weightedRankData,
    pagedStandardRankData,
    pagedWeightedRankData,
} = useRatingDetailPage();
</script>

<style scoped>
.mobile-section {
    padding: 16px;
    border: 1px solid #e8eaed;
    border-radius: 20px;
    background: #fff;
}

.section-header {
    margin-bottom: 12px;
}

.section-title {
    margin: 0;
    color: #202124;
    font-size: 20px;
    font-weight: 800;
}

.slider-block {
    margin-bottom: 14px;
    padding: 12px 14px;
    border-radius: 16px;
    background: #f8faff;
}

.slider-labels {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    color: #5f6368;
    font-size: 12px;
}

.mobile-rank-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.rank-card {
    padding: 14px;
    border-radius: 16px;
    background: #f8f9fa;
}

.rank-top {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
}

.rank-badge {
    padding: 4px 10px;
    border-radius: 999px;
    background: #e8f0fe;
    color: #1a73e8;
    font-weight: 700;
}

.dish-name {
    color: #202124;
    font-size: 16px;
    font-weight: 700;
}

.rank-meta {
    margin-bottom: 10px;
    color: #5f6368;
    font-size: 13px;
}

.rank-bottom {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.meta-chip {
    padding: 4px 10px;
    border-radius: 999px;
    background: #fff;
    color: #3c4043;
    font-size: 12px;
}

.pagination-bar {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 14px;
}

.page-size-text {
    color: #5f6368;
    font-size: 13px;
}
</style>

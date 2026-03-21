<!--
  文件说明：HomePageMobile.vue
  1. 这是移动端视图文件，负责在小屏设备中提供更紧凑的布局与交互展示。
  2. 该文件位于 src\pages 目录下，和同层文件一起构成当前功能模块的视图或结构层。
  3. 文件中的脚本、模板和样式会围绕同一职责组织，便于后续维护时快速定位问题。
-->
<template>
    <MobilePageShell :title="text.overviewTitle" subtitle="移动端菜品总览与排名">
        <MobileDishCard
            v-for="dish in pagedPreviewDishes"
            :key="dish.id"
            :name="dish.name"
            :image="dish.image"
            :position="formatPosition(dish.position)"
            :price-label="`${text.priceWithUnit} ${dish.price}`"
            :rate="dish.rate"
            :rate-label="`${text.rate} ${dish.rate}`"
        >
            <template #actions>
                <a-button type="text">{{ text.detail }}</a-button>
            </template>
        </MobileDishCard>

        <div class="mobile-pagination">
            <span class="mobile-page-size">{{ `${text.pageSizeText}${overviewPageSize}\u6761` }}</span>
            <a-pagination
                v-model:current="overviewCurrent"
                v-model:page-size="overviewPageSize"
                size="small"
                :total="dishes.length"
                :show-size-changer="true"
                :page-size-options="pageSizeOptions"
            />
        </div>

        <section class="mobile-rank-section">
            <div class="mobile-section-title">{{ text.dailyRank }}</div>
            <a-card v-for="item in rankData.slice(0, 5)" :key="item.id" class="mobile-rank-card" :bordered="false">
                <div class="mobile-rank-row">
                    <span class="mobile-rank-index">#{{ item.rank }}</span>
                    <div class="mobile-rank-main">
                        <div class="mobile-rank-name">{{ item.name }}</div>
                        <div class="mobile-rank-position">{{ item.position }}</div>
                    </div>
                    <div class="mobile-rank-score">{{ item.rate }}</div>
                </div>
            </a-card>
        </section>
    </MobilePageShell>
</template>

<script setup>
import MobileDishCard from '@/components/mobile/MobileDishCard.vue';
import MobilePageShell from '@/components/mobile/MobilePageShell.vue';
import { useHomePageView } from '@/composables/useHomePageView';

const {
    text,
    dishes,
    overviewCurrent,
    overviewPageSize,
    pageSizeOptions,
    pagedPreviewDishes,
    rankData,
    formatPosition,
} = useHomePageView();
</script>

<style scoped>
.mobile-pagination {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.mobile-page-size {
    color: #5f6368;
    font-size: 13px;
}

.mobile-rank-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.mobile-section-title {
    color: #202124;
    font-size: 18px;
    font-weight: 700;
}

.mobile-rank-card {
    border-radius: 18px;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
}

.mobile-rank-row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.mobile-rank-index {
    width: 40px;
    color: #1a73e8;
    font-size: 18px;
    font-weight: 700;
}

.mobile-rank-main {
    min-width: 0;
    flex: 1;
}

.mobile-rank-name {
    color: #202124;
    font-size: 16px;
    font-weight: 700;
}

.mobile-rank-position {
    margin-top: 4px;
    color: #5f6368;
    font-size: 13px;
}

.mobile-rank-score {
    color: #202124;
    font-size: 16px;
    font-weight: 700;
}
</style>

<!--
  文件说明：HomePageDesktop.vue
  1. 这是桌面端视图文件，负责在大屏设备中保留更高信息密度的排版结构。
  2. 该文件位于 src\pages 目录下，和同层文件一起构成当前功能模块的视图或结构层。
  3. 文件中的脚本、模板和样式会围绕同一职责组织，便于后续维护时快速定位问题。
-->
<template>
    <div id="home-page">
        <div id="dish-show">
            <div class="dish-show-header">
                <span class="dish-show-title">{{ text.overviewTitle }}</span>
            </div>
            <div class="dish-show-divider"></div>

            <div id="home-grid">
                <a-row :gutter="[16, 16]">
                    <a-col v-for="dish in pagedPreviewDishes" :key="dish.id" :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
                        <a-card hoverable class="dish-card">
                            <template #cover>
                                <img :alt="dish.name" :src="dish.image" />
                            </template>
                            <template #actions>
                                <a-button type="text" class="detail-btn">{{ text.detail }}</a-button>
                            </template>
                            <a-card-meta :title="dish.name" :description="formatPosition(dish.position)" />
                            <span>
                                <a-rate :value="dish.rate" :tooltips="rateTips" disabled allow-half />
                                <span class="ant-rate-text">{{ dish.rate }}</span>
                            </span>
                        </a-card>
                    </a-col>
                </a-row>
            </div>

            <div class="pagination-bar">
                <span class="page-size-text">{{ `${text.pageSizeText}${overviewPageSize}${text.loadMore.slice(2, 3) || '\u6761'}` }}</span>
                <a-pagination
                    v-model:current="overviewCurrent"
                    v-model:page-size="overviewPageSize"
                    :total="dishes.length"
                    :show-size-changer="true"
                    :page-size-options="pageSizeOptions"
                />
            </div>
        </div>

        <div id="rank-show">
            <span class="dish-show-title">{{ text.dailyRank }}</span>
            <a-table :columns="columns" :data-source="rankData" :row-key="(record) => record.id" :pagination="false">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'rank'">
                        <span class="rank-cell">
                            <crown-filled v-if="record.rank <= 3" :class="`rank-crown rank-${record.rank}`" />
                            <span v-else class="rank-number">{{ record.rank }}</span>
                        </span>
                    </template>
                    <template v-else-if="column.key === 'rate'">
                        <span class="table-rate">
                            <a-rate :value="record.rate" disabled allow-half />
                            <span class="table-rate-number">{{ record.rate }}</span>
                        </span>
                    </template>
                </template>
            </a-table>
            <a-row id="rank-more" justify="center">
                <a-col :flex="'0 0 auto'" class="see-more-col">
                    <a-button type="default" size="large" class="see-more-button">{{ text.more }}</a-button>
                </a-col>
            </a-row>
        </div>
    </div>
</template>

<script setup>
import { CrownFilled } from '@ant-design/icons-vue';
import { useHomePageView } from '@/composables/useHomePageView';

const {
    text,
    dishes,
    rateTips,
    overviewCurrent,
    overviewPageSize,
    pageSizeOptions,
    pagedPreviewDishes,
    columns,
    rankData,
    formatPosition,
} = useHomePageView();
</script>

<style scoped>
#home-grid {
    width: 100%;
}

#dish-show {
    border: 1px solid #e6e6e6;
    border-radius: 8px;
    padding: 16px;
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
    margin-bottom: 20px;
}

#dish-show:hover,
#rank-show:hover {
    border-color: #d9d9d9;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.15);
}

#rank-show {
    border: 1px solid #e6e6e6;
    border-radius: 8px;
    padding: 16px;
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

#rank-show .dish-show-title {
    display: inline-block;
    margin-bottom: 12px;
}

.dish-show-header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 6px 4px 10px;
}

.dish-show-title {
    font-family: 'Noto Serif SC', 'Microsoft YaHei', serif;
    font-weight: 800;
    font-size: 22px;
    color: #1f1f1f;
    letter-spacing: 0.5px;
}

.dish-show-divider {
    height: 1px;
    background: #e9e9e9;
    margin: 0 4px 18px;
}

#rank-more {
    margin-top: 16px;
}

.see-more-col {
    display: flex;
    justify-content: center;
}

:deep(.dish-card) {
    width: 100%;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

:deep(.dish-card:hover) {
    border-color: #d9d9d9;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.16);
}

:deep(.detail-btn) {
    width: 100%;
    border-radius: 0 0 8px 8px;
}

:deep(.dish-card .ant-card-actions > li) {
    margin: 0;
}

:deep(.dish-card .ant-card-actions > li > span) {
    display: block;
}

.rank-cell,
.table-rate {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.rank-cell {
    justify-content: center;
    width: 100%;
}

.rank-crown {
    font-size: 18px;
}

.rank-1 {
    color: #d4af37;
}

.rank-2 {
    color: #c0c0c0;
}

.rank-3 {
    color: #cd7f32;
}

.rank-number,
.table-rate-number {
    color: #1f1f1f;
    font-weight: 600;
}

.pagination-bar {
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.page-size-text {
    color: #595959;
    font-size: 14px;
}
</style>

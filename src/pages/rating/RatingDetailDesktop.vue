<!--
  文件说明：RatingDetailDesktop.vue
  1. 这是桌面端视图文件，负责在大屏设备中保留更高信息密度的排版结构。
  2. 该文件位于 src\pages\rating 目录下，和同层文件一起构成当前功能模块的视图或结构层。
  3. 文件中的脚本、模板和样式会围绕同一职责组织，便于后续维护时快速定位问题。
-->
<template>
    <div id="rating-detail-page">
        <div id="rank-show">
            <span class="dish-show-title">{{ text.standardTitle }}</span>
            <a-table :columns="standardColumns" :data-source="pagedStandardRankData" :row-key="record => record.id" :pagination="false">
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
                            <span class="table-rate-number">{{ record.rate }}（{{ record.rate_count }}次）</span>
                        </span>
                    </template>
                </template>
            </a-table>

            <div class="pagination-bar">
                <span class="page-size-text">{{ `${text.pageSizePrefix}${standardPageSize}${text.pageSizeSuffix}` }}</span>
                <a-pagination
                    v-model:current="standardCurrent"
                    v-model:page-size="standardPageSize"
                    :total="standardRankData.length"
                    :show-size-changer="true"
                    :page-size-options="pageSizeOptions"
                />
            </div>
        </div>

        <div id="rank-show" class="weighted-section">
            <div class="weighted-header">
                <span class="dish-show-title">{{ text.weightedTitle }}</span>
                <div class="alpha-area">
                    <div class="alpha-slider-row">
                        <span class="alpha-side">{{ text.priceFocus }}</span>
                        <a-slider v-model:value="alpha" :min="0" :max="1" :step="0.1" :marks="alphaMarks" class="alpha-slider" />
                        <span class="alpha-side">{{ text.tasteFocus }}</span>
                    </div>
                </div>
            </div>

            <a-table :columns="weightedColumns" :data-source="pagedWeightedRankData" :row-key="record => record.id" :pagination="false">
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
                            <span class="table-rate-number">{{ record.rate }}（{{ record.rate_count }}次）</span>
                        </span>
                    </template>
                </template>
            </a-table>

            <div class="pagination-bar">
                <span class="page-size-text">{{ `${text.pageSizePrefix}${weightedPageSize}${text.pageSizeSuffix}` }}</span>
                <a-pagination
                    v-model:current="weightedCurrent"
                    v-model:page-size="weightedPageSize"
                    :total="weightedRankData.length"
                    :show-size-changer="true"
                    :page-size-options="pageSizeOptions"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { CrownFilled } from '@ant-design/icons-vue';
import { useRatingDetailPage } from '@/composables/useRatingDetailPage';

// 桌面端继续保留表格型排行榜，更适合横向信息密度高的展示。
const {
    text,
    alpha,
    alphaMarks,
    pageSizeOptions,
    standardCurrent,
    standardPageSize,
    weightedCurrent,
    weightedPageSize,
    standardColumns,
    weightedColumns,
    standardRankData,
    weightedRankData,
    pagedStandardRankData,
    pagedWeightedRankData,
} = useRatingDetailPage();
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

.weighted-section {
    margin-top: 20px;
}

.dish-show-title {
    font-family: 'Noto Serif SC', 'Microsoft YaHei', serif;
    font-weight: 800;
    font-size: 22px;
    color: #1f1f1f;
    letter-spacing: 0.5px;
}

.weighted-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 12px;
}

.alpha-area {
    width: min(420px, 100%);
}

.alpha-slider-row {
    display: flex;
    align-items: center;
    gap: 10px;
}

.alpha-slider {
    flex: 1;
    margin: 0;
}

.alpha-side {
    color: #595959;
    font-size: 12px;
    white-space: nowrap;
}

.rank-cell {
    display: inline-flex;
    align-items: center;
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

.rank-number {
    font-weight: 600;
    color: #1f1f1f;
}

.table-rate {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

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

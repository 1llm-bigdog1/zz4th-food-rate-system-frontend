<!--
  文件说明：DishesListDesktop.vue
  1. 这是桌面端视图文件，负责在大屏设备中保留更高信息密度的排版结构。
  2. 该文件位于 src\pages\rating 目录下，和同层文件一起构成当前功能模块的视图或结构层。
  3. 文件中的脚本、模板和样式会围绕同一职责组织，便于后续维护时快速定位问题。
-->
<template>
    <div id="dishes-list-page">
        <div id="rank-show">
            <div class="panel-header">
                <span class="dish-show-title">{{ text.pageTitle }}</span>
                <div class="dish-search">
                    <a-input
                        v-model:value="searchInput"
                        class="dish-search-input"
                        :placeholder="text.searchPlaceholder"
                        @pressEnter="onSearch(searchInput)"
                    />
                    <button type="button" class="search-enter-btn" @click="onSearch(searchInput)">
                        <search-outlined />
                    </button>
                </div>
            </div>

            <div class="filter-row">
                <a-space wrap>
                    <a-select v-model:value="selectedFloor" class="filter-select" allow-clear :placeholder="text.floorPlaceholder" :options="floorOptions" />
                    <a-select v-model:value="selectedWindow" class="filter-select" allow-clear :placeholder="text.windowPlaceholder" :options="windowOptions" />
                    <a-button @click="resetFilters">{{ text.resetFilters }}</a-button>
                </a-space>
            </div>

            <a-table :columns="columns" :data-source="visibleTableData" :pagination="false" :row-key="(record) => record.id">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'rate'">
                        <span class="table-rate">
                            <a-rate :value="record.rate" disabled allow-half />
                            <span class="table-rate-number">{{ record.rate }}</span>
                        </span>
                    </template>
                    <template v-else-if="column.key === 'imagePreview'">
                        <a-popover trigger="hover" placement="left">
                            <template #content>
                                <a-image :src="record.image" :width="160" :preview="false" />
                            </template>
                            <a-button type="link" size="small">{{ text.viewImage }}</a-button>
                        </a-popover>
                    </template>
                    <template v-else-if="column.key === 'action'">
                        <a-space>
                            <a-button type="default" size="small" @click="openEditModal(record)">{{ text.addData }}</a-button>
                            <a-button type="primary" size="small" @click="openRatingModal(record)">{{ text.rateNow }}</a-button>
                        </a-space>
                    </template>
                </template>
            </a-table>

            <a-row id="rank-more" justify="center" v-if="hasMore">
                <a-col :flex="'0 0 auto'" class="see-more-col">
                    <a-button type="default" size="large" class="see-more-button" @click="loadMore">{{ text.loadMore }}</a-button>
                </a-col>
            </a-row>
        </div>

        <RatingModal
            :open="ratingModalVisible"
            :title="ratingModalTitle"
            :rating-value="ratingValue"
            :submit-text="text.submitRating"
            @update:ratingValue="updateRatingValue"
            @cancel="closeRatingModal"
            @submit="submitRating"
        />

        <SupplementInfoModal
            :open="editModalVisible"
            :title="editModalTitle"
            :form="editForm"
            :floor-options="floorOptions"
            :window-options="windowOptions"
            :upload-image-text="text.uploadImage"
            :upload-btn-text="text.uploadBtn"
            :modify-position-text="text.modifyPosition"
            :modify-price-text="text.modifyPrice"
            :floor-placeholder="text.floorPlaceholder"
            :window-placeholder="text.windowPlaceholder"
            :price-placeholder="text.pricePlaceholder"
            :submit-text="text.submitModify"
            @cancel="closeEditModal"
            @submit="submitModify"
        />
    </div>
</template>

<script setup>
import { SearchOutlined } from '@ant-design/icons-vue';
import RatingModal from '@/components/RatingModal.vue';
import SupplementInfoModal from '@/components/SupplementInfoModal.vue';
import { useDishesListPage } from '@/composables/useDishesListPage';

const page = useDishesListPage();
const {
    text,
    searchInput,
    selectedFloor,
    selectedWindow,
    floorOptions,
    windowOptions,
    columns,
    visibleTableData,
    hasMore,
    loadMore,
    onSearch,
    resetFilters,
    ratingModalVisible,
    ratingModalTitle,
    ratingValue,
    updateRatingValue,
    closeRatingModal,
    submitRating,
    openRatingModal,
    editModalVisible,
    editModalTitle,
    editForm,
    openEditModal,
    closeEditModal,
    submitModify,
} = page;
</script>

<style scoped>
#rank-show {
    border: 1px solid #e6e6e6;
    border-radius: 8px;
    padding: 16px;
}

.panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 12px;
}

.dish-show-title {
    font-family: 'Noto Serif SC', 'Microsoft YaHei', serif;
    font-weight: 800;
    font-size: 22px;
    color: #1f1f1f;
}

.dish-search {
    display: flex;
    align-items: stretch;
    flex: 0 1 360px;
    width: min(360px, 100%);
    min-width: 220px;
    overflow: hidden;
    border: 1px solid #d9d9d9;
    border-radius: 12px;
    background: #fff;
}

.dish-search-input {
    flex: 1;
}

.dish-search-input :deep(.ant-input) {
    height: 40px;
    border: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    padding: 0 14px;
}

.search-enter-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 46px;
    border: 0;
    background: linear-gradient(135deg, #5b9cff 0%, #3f7df0 100%);
    color: #fff;
    cursor: pointer;
}

.filter-row {
    margin-bottom: 16px;
}

.filter-select {
    width: 160px;
}

.table-rate {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.table-rate-number {
    font-weight: 600;
}
</style>

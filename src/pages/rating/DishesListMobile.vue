<!--
  文件说明：DishesListMobile.vue
  1. 这是移动端视图文件，负责在小屏设备中提供更紧凑的布局与交互展示。
  2. 该文件位于 src\pages\rating 目录下，和同层文件一起构成当前功能模块的视图或结构层。
  3. 文件中的脚本、模板和样式会围绕同一职责组织，便于后续维护时快速定位问题。
-->
<template>
    <MobilePageShell :title="text.pageTitle" subtitle="移动端菜品列表与评分入口">
        <div class="mobile-toolbar">
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

            <div class="mobile-filters">
                <a-select v-model:value="selectedFloor" class="filter-select" allow-clear :placeholder="text.floorPlaceholder" :options="floorOptions" />
                <a-select v-model:value="selectedWindow" class="filter-select" allow-clear :placeholder="text.windowPlaceholder" :options="windowOptions" />
                <a-button @click="resetFilters">{{ text.resetFilters }}</a-button>
            </div>
        </div>

        <MobileDishCard
            v-for="item in visibleTableData"
            :key="item.id"
            :name="item.name"
            :image="item.image"
            :position="item.position"
            :price-label="`${text.priceWithUnit} ${item.price}`"
            :rate="item.rate"
            :rate-label="`${text.rate} ${item.rate}（${item.rate_count}次）`"
        >
            <template #actions>
                <a-button size="small" @click="openEditModal(item)">{{ text.addData }}</a-button>
                <a-button type="primary" size="small" @click="openRatingModal(item)">{{ text.rateNow }}</a-button>
            </template>
        </MobileDishCard>

        <a-button v-if="hasMore" block @click="loadMore">{{ text.loadMore }}</a-button>

        <RatingModal
            :open="ratingModalVisible"
            :title="ratingModalTitle"
            :rating-value="ratingValue"
            :loading="submitting"
            :submit-text="text.submitRating"
            @update:ratingValue="updateRatingValue"
            @cancel="closeRatingModal"
            @submit="submitRating"
        />

        <SupplementInfoModal
            :open="editModalVisible"
            :title="editModalTitle"
            :form="editForm"
            :loading="submitting"
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
    </MobilePageShell>
</template>

<script setup>
import { SearchOutlined } from '@ant-design/icons-vue';
import MobileDishCard from '@/components/mobile/MobileDishCard.vue';
import MobilePageShell from '@/components/mobile/MobilePageShell.vue';
import RatingModal from '@/components/RatingModal.vue';
import SupplementInfoModal from '@/components/SupplementInfoModal.vue';
import { useDishesListPage } from '@/composables/useDishesListPage';

const {
    text,
    searchInput,
    selectedFloor,
    selectedWindow,
    floorOptions,
    windowOptions,
    visibleTableData,
    hasMore,
    loadMore,
    onSearch,
    resetFilters,
    ratingModalVisible,
    ratingModalTitle,
    ratingValue,
    submitting,
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
} = useDishesListPage();
</script>

<style scoped>
.mobile-toolbar,
.mobile-filters {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.dish-search {
    display: flex;
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
}

.search-enter-btn {
    width: 46px;
    border: 0;
    background: linear-gradient(135deg, #5b9cff 0%, #3f7df0 100%);
    color: #fff;
}

.filter-select {
    width: 100%;
}
</style>

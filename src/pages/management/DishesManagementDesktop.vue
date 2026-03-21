<!--
  文件说明：DishesManagementDesktop.vue
  1. 这是桌面端视图文件，负责在大屏设备中保留更高信息密度的排版结构。
  2. 该文件位于 src\pages\management 目录下，和同层文件一起构成当前功能模块的视图或结构层。
  3. 文件中的脚本、模板和样式会围绕同一职责组织，便于后续维护时快速定位问题。
-->
<template>
    <div id="dishes-management-page">
        <div id="rank-show">
            <div class="panel-header">
                <span class="dish-show-title">{{ text.pageTitle }}</span>
                <div class="header-actions">
                    <a-button type="primary" class="search-trigger-btn" @click="openAddModal">{{ text.addDish }}</a-button>
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
            </div>

            <div class="filter-row">
                <a-space wrap>
                    <a-select v-model:value="selectedFloor" class="filter-select" allow-clear :placeholder="text.floorPlaceholder" :options="floorOptions" />
                    <a-select v-model:value="selectedWindow" class="filter-select" allow-clear :placeholder="text.windowPlaceholder" :options="windowOptions" />
                    <a-button @click="resetFilters">{{ text.resetFilters }}</a-button>
                </a-space>
            </div>

            <a-table :columns="columns" :data-source="pagedTableData" :pagination="false" :row-key="(record) => record.id">
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
                            <a-button size="small" @click="openEditModal(record)">{{ text.editData }}</a-button>
                            <a-button danger size="small" @click="deleteDish(record)">{{ text.deleteDish }}</a-button>
                        </a-space>
                    </template>
                </template>
            </a-table>

            <div class="pagination-bar">
                <span class="page-size-text">{{ `${text.pageSizeText}${pageSize}\u6761` }}</span>
                <a-pagination
                    v-model:current="currentPage"
                    v-model:page-size="pageSize"
                    :total="sortedDishes.length"
                    :show-size-changer="true"
                    :page-size-options="pageSizeOptions"
                />
            </div>
        </div>

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

        <AddDishModal
            :open="addModalVisible"
            :title="addModalTitle"
            :form="addForm"
            :floor-options="floorOptions"
            :window-options="windowOptions"
            :name-label="text.dishName"
            :name-placeholder="text.dishNamePlaceholder"
            :name-required-message="text.dishNameRequired"
            :upload-image-text="text.uploadImage"
            :upload-btn-text="text.uploadBtn"
            :modify-position-text="text.modifyPosition"
            :modify-price-text="text.modifyPrice"
            :floor-placeholder="text.floorPlaceholder"
            :window-placeholder="text.windowPlaceholder"
            :price-placeholder="text.pricePlaceholder"
            :submit-text="text.submitAdd"
            @cancel="closeAddModal"
            @submit="submitAdd"
        />
    </div>
</template>

<script setup>
import { SearchOutlined } from '@ant-design/icons-vue';
import SupplementInfoModal from '@/components/SupplementInfoModal.vue';
import { useDishesManagementPage } from '@/composables/useDishesManagementPage';
import AddDishModal from '@/pages/management/AddDishModal.vue';

const {
    text,
    searchInput,
    selectedFloor,
    selectedWindow,
    currentPage,
    pageSize,
    pageSizeOptions,
    floorOptions,
    windowOptions,
    columns,
    sortedDishes,
    pagedTableData,
    onSearch,
    resetFilters,
    editModalVisible,
    editModalTitle,
    editForm,
    openEditModal,
    closeEditModal,
    submitModify,
    addModalVisible,
    addModalTitle,
    addForm,
    openAddModal,
    closeAddModal,
    submitAdd,
    deleteDish,
} = useDishesManagementPage();
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

.header-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 0 1 520px;
    gap: 12px;
    min-width: 0;
}

.dish-search {
    display: flex;
    flex: 1 1 360px;
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

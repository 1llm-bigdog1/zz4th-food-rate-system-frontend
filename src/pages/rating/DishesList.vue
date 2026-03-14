<template>
    <div id="dishes-list-page">
        <div id="rank-show">
            <span class="dish-show-title">{{ text.pageTitle }}</span>
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
                    <a-button type="default" size="large" class="see-more-button" @click="loadMore">
                        {{ text.loadMore }}
                    </a-button>
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
import { computed, ref } from 'vue';
import { message } from 'ant-design-vue';
import RatingModal from '@/components/RatingModal.vue';
import SupplementInfoModal from '@/components/SupplementInfoModal.vue';
import { buildFloorOptions, buildWindowOptions, createMockDishes } from '@/data/mockData';
import { dishesListText, sharedText } from '@/models/text';

const text = {
    ...sharedText,
    ...dishesListText,
    floorPlaceholder: sharedText.selectFloor,
    windowPlaceholder: sharedText.selectWindow,
    pricePlaceholder: sharedText.inputPrice,
    uploadImage: sharedText.uploadImage,
    modifyPosition: sharedText.modifyPosition,
    modifyPrice: sharedText.modifyPrice,
    submitRating: sharedText.submitRating,
    submitModify: sharedText.submitModify,
};

// Shared source for dish demo data.
const dishes = ref(createMockDishes());

// Pagination config.
const pageSize = 20;
const visibleCount = ref(pageSize);

// Stable sort by floor then window.
const sortedDishes = computed(() =>
    [...dishes.value].sort((a, b) => {
        if (a.position.stair !== b.position.stair) {
            return a.position.stair - b.position.stair;
        }
        return a.position.window - b.position.window;
    }),
);

const columns = [
    { title: text.dishName, dataIndex: 'name', key: 'name' },
    { title: text.dishPosition, dataIndex: 'position', key: 'position' },
    { title: text.rate, dataIndex: 'rate', key: 'rate' },
    { title: text.priceWithUnit, dataIndex: 'price', key: 'price' },
    { title: text.viewImage, dataIndex: 'imagePreview', key: 'imagePreview', width: 110 },
    { title: text.action, dataIndex: 'action', key: 'action', width: 200 },
];

const visibleTableData = computed(() =>
    sortedDishes.value.slice(0, visibleCount.value).map((dish) => ({
        id: dish.id,
        name: dish.name,
        position: `${dish.position.stair}${text.floor}${dish.position.window}${text.window}`,
        rate: dish.rate,
        price: dish.price,
        image: dish.image,
    })),
);

const hasMore = computed(() => visibleCount.value < sortedDishes.value.length);

// Rating modal state.
const ratingModalVisible = ref(false);
const ratingDishName = ref('');
const ratingValue = ref(0);
const ratingModalTitle = computed(() => `${text.rateTitlePrefix}${ratingDishName.value}${text.rateTitleSuffix}`);

// Supplement modal state.
const editModalVisible = ref(false);
const editDishName = ref('');
const editForm = ref({
    fileList: [],
    stair: null,
    window: null,
    price: null,
});

const floorOptions = buildFloorOptions(2, text.floor);
const windowOptions = buildWindowOptions(8, text.window);
const editModalTitle = computed(() => `${text.rateTitlePrefix}${editDishName.value}${text.modifyTitleSuffix}`);

const loadMore = () => {
    visibleCount.value = Math.min(visibleCount.value + pageSize, sortedDishes.value.length);
};

const openRatingModal = (record) => {
    ratingDishName.value = record.name;
    ratingValue.value = 0;
    ratingModalVisible.value = true;
};

const updateRatingValue = (value) => {
    ratingValue.value = value;
};

const closeRatingModal = () => {
    ratingModalVisible.value = false;
};

const submitRating = () => {
    ratingModalVisible.value = false;
};

const openEditModal = (record) => {
    editDishName.value = record.name;
    editForm.value = {
        fileList: [],
        stair: null,
        window: null,
        price: record.price,
    };
    editModalVisible.value = true;
};

const closeEditModal = () => {
    editModalVisible.value = false;
};

// Receive local form payload from modal to avoid child mutating props.
const submitModify = (nextForm) => {
    if (nextForm) {
        editForm.value = nextForm;
    }
    editModalVisible.value = false;
    message.success(text.modifySuccess);
};
</script>

<style scoped>
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

#rank-show:hover {
    border-color: #d9d9d9;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.15);
}

.dish-show-title {
    font-family: 'Noto Serif SC', 'Microsoft YaHei', serif;
    font-weight: 800;
    font-size: 22px;
    color: #1f1f1f;
    letter-spacing: 0.5px;
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
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.see-more-col {
    display: flex;
    justify-content: center;
}

.see-more-button:hover,
.see-more-button:focus {
    background: #ff4d4f;
    border-color: #ff4d4f;
    color: #fff;
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
</style>

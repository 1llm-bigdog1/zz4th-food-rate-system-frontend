<template>
    <div id="dishes-list-page">
        <div id="rank-show">
            <span class="dish-show-title">{{ text.pageTitle }}</span>
            <a-table :columns="columns" :data-source="visibleTableData" :pagination="false" :row-key="record => record.id">
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

        <a-modal :open="ratingModalVisible" :title="ratingModalTitle" :footer="null" centered @cancel="closeRatingModal">
            <div class="rating-modal-content">
                <div class="rating-row">
                    <a-rate v-model:value="ratingValue" allow-half :tooltips="ratingDesc" />
                    <span class="rating-desc">{{ ratingDescText }}</span>
                </div>
                <a-button type="primary" @click="submitRating">{{ text.submitRating }}</a-button>
            </div>
        </a-modal>

        <a-modal :open="editModalVisible" :title="editModalTitle" :footer="null" centered @cancel="closeEditModal">
            <div class="rating-modal-content">
                <div class="form-section">
                    <div class="section-title">{{ text.uploadImage }}</div>
                    <a-upload v-model:file-list="editForm.fileList" :before-upload="() => false" list-type="picture">
                        <a-button>{{ text.uploadBtn }}</a-button>
                    </a-upload>
                </div>
                <div class="form-section">
                    <div class="section-title">{{ text.modifyPosition }}</div>
                    <a-space>
                        <a-select v-model:value="editForm.stair" :options="floorOptions" :placeholder="text.floorPlaceholder" style="width: 120px" />
                        <a-select v-model:value="editForm.window" :options="windowOptions" :placeholder="text.windowPlaceholder" style="width: 120px" />
                    </a-space>
                </div>
                <div class="form-section">
                    <div class="section-title">{{ text.modifyPrice }}</div>
                    <a-input-number v-model:value="editForm.price" :min="0" :step="0.5" :precision="1" style="width: 240px" :placeholder="text.pricePlaceholder" />
                </div>
                <a-button type="primary" @click="submitModify">{{ text.submitModify }}</a-button>
            </div>
        </a-modal>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { message } from 'ant-design-vue';
import Dish from '@/models/Dish';
import noImage from '@/static/no_image.png';

const text = {
    pageTitle: '\u83dc\u54c1\u5217\u8868',
    loadMore: '\u52a0\u8f7d\u66f4\u591a',
    name: '\u83dc\u54c1\u540d\u79f0',
    position: '\u83dc\u54c1\u4f4d\u7f6e',
    rate: '\u8bc4\u5206',
    price: '\u4ef7\u683c(\u5143)',
    action: '\u64cd\u4f5c',
    viewImage: '\u67e5\u770b\u56fe\u7247',
    addData: '\u8865\u5145\u8bc4\u5206',
    rateNow: '\u6211\u8981\u8bc4\u5206',
    submitRating: '\u63d0\u4ea4\u8bc4\u5206',
    submitModify: '\u63d0\u4ea4\u4fee\u6539',
    rateTitlePrefix: '\u5bf9',
    rateTitleSuffix: '\u8fdb\u884c\u8bc4\u5206',
    modifyTitleSuffix: '\u8fdb\u884c\u4fe1\u606f\u4fee\u6539',
    uploadImage: '\u4e0a\u4f20\u56fe\u7247',
    modifyPosition: '\u4f4d\u7f6e\u4fee\u6539',
    modifyPrice: '\u4ef7\u683c',
    floorPlaceholder: '\u9009\u62e9\u697c\u5c42',
    windowPlaceholder: '\u9009\u62e9\u7a97\u53e3',
    pricePlaceholder: '\u8bf7\u8f93\u5165\u4ef7\u683c',
    uploadBtn: '\u70b9\u51fb\u4e0a\u4f20',
    modifySuccess: '\u611f\u8c22\u4f60\u7684\u8d21\u732e\uff0c\u4fee\u6539\u540e\u7684\u6570\u636e\u4f1a\u5728\u5ba1\u6838\u540e\u663e\u793a',
    floor: '\u697c',
    window: '\u53f7\u7a97\u53e3',
};

const dishes = ref([
    new Dish(1, '\u7ea2\u70e7\u8089', { stair: 1, window: 1 }, noImage, 4.8, 18),
    new Dish(2, '\u5bab\u4fdd\u9e21\u4e01', { stair: 1, window: 2 }, noImage, 4.6, 16),
    new Dish(3, '\u9c7c\u9999\u8089\u4e1d', { stair: 1, window: 3 }, noImage, 4.5, 15),
    new Dish(4, '\u756a\u8304\u7092\u86cb', { stair: 1, window: 4 }, noImage, 4.2, 12),
    new Dish(5, '\u9752\u6912\u571f\u8c46\u4e1d', { stair: 1, window: 5 }, noImage, 4.1, 10),
    new Dish(6, '\u9ebb\u5a46\u8c46\u8150', { stair: 1, window: 6 }, noImage, 4.7, 14),
    new Dish(7, '\u9178\u83dc\u9c7c', { stair: 1, window: 7 }, noImage, 4.9, 26),
    new Dish(8, '\u53ef\u4e50\u9e21\u7fc5', { stair: 1, window: 8 }, noImage, 4.4, 20),
    new Dish(9, '\u5496\u55b1\u9e21\u5757', { stair: 1, window: 9 }, noImage, 4.3, 19),
    new Dish(10, '\u9999\u83c7\u6cb9\u83dc', { stair: 1, window: 10 }, noImage, 4.0, 11),
    new Dish(11, '\u6c34\u716e\u8089\u7247', { stair: 2, window: 1 }, noImage, 4.8, 24),
    new Dish(12, '\u56de\u9505\u8089', { stair: 2, window: 2 }, noImage, 4.6, 18),
    new Dish(13, '\u7cd6\u918b\u91cc\u810a', { stair: 2, window: 3 }, noImage, 4.5, 21),
    new Dish(14, '\u5730\u4e09\u9c9c', { stair: 2, window: 4 }, noImage, 4.2, 13),
    new Dish(15, '\u897f\u7ea2\u67ff\u725b\u8169', { stair: 2, window: 5 }, noImage, 4.7, 28),
    new Dish(16, '\u5e72\u9505\u82b1\u83dc', { stair: 2, window: 6 }, noImage, 4.3, 16),
    new Dish(17, '\u9ec4\u7116\u9e21\u7c73\u996d', { stair: 2, window: 7 }, noImage, 4.4, 17),
    new Dish(18, '\u6912\u76d0\u6392\u6761', { stair: 2, window: 8 }, noImage, 4.1, 22),
    new Dish(19, '\u624b\u6495\u5305\u83dc', { stair: 2, window: 9 }, noImage, 4.0, 12),
    new Dish(20, '\u6e05\u84b8\u9c88\u9c7c', { stair: 2, window: 10 }, noImage, 4.9, 32),
    new Dish(21, '\u5b5c\u7136\u725b\u8089', { stair: 3, window: 1 }, noImage, 4.8, 29),
    new Dish(22, '\u7c89\u84b8\u6392\u9aa8', { stair: 3, window: 2 }, noImage, 4.6, 25),
    new Dish(23, '\u97ed\u83dc\u9e21\u86cb', { stair: 3, window: 3 }, noImage, 4.1, 10),
    new Dish(24, '\u7ea2\u70e7\u8304\u5b50', { stair: 3, window: 4 }, noImage, 4.2, 12),
    new Dish(25, '\u9999\u8fa3\u9e21\u4e01', { stair: 3, window: 5 }, noImage, 4.5, 18),
    new Dish(26, '\u8c46\u89d2\u7116\u9762', { stair: 3, window: 6 }, noImage, 4.3, 14),
    new Dish(27, '\u867e\u4ec1\u6ed1\u86cb', { stair: 3, window: 7 }, noImage, 4.7, 23),
    new Dish(28, '\u8471\u7206\u7f8a\u8089', { stair: 3, window: 8 }, noImage, 4.6, 27),
    new Dish(29, '\u9ed1\u6912\u9e21\u6392', { stair: 3, window: 9 }, noImage, 4.4, 21),
    new Dish(30, '\u756a\u8304\u725b\u8089\u9762', { stair: 3, window: 10 }, noImage, 4.2, 16),
]);

const pageSize = 20;
const visibleCount = ref(pageSize);

const sortedDishes = computed(() =>
    [...dishes.value].sort((a, b) => {
        if (a.position.stair !== b.position.stair) {
            return a.position.stair - b.position.stair;
        }
        return a.position.window - b.position.window;
    }),
);

const columns = [
    { title: text.name, dataIndex: 'name', key: 'name' },
    { title: text.position, dataIndex: 'position', key: 'position' },
    { title: text.rate, dataIndex: 'rate', key: 'rate' },
    { title: text.price, dataIndex: 'price', key: 'price' },
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
const ratingModalVisible = ref(false);
const ratingDishName = ref('');
const ratingValue = ref(0);
const ratingDesc = ['0.5', '1.0', '1.5', '2.0', '2.5', '3.0', '3.5', '4.0', '4.5', '5.0'];

const ratingDescText = computed(() => {
    if (ratingValue.value <= 0) return '';
    const index = Math.round(ratingValue.value * 2) - 1;
    return ratingDesc[index] || '';
});

const ratingModalTitle = computed(() => `${text.rateTitlePrefix}${ratingDishName.value}${text.rateTitleSuffix}`);
const editModalVisible = ref(false);
const editDishName = ref('');
const editForm = ref({
    fileList: [],
    stair: null,
    window: null,
    price: null,
});
const floorOptions = [1, 2, 3, 4, 5].map((v) => ({ label: `${v}${text.floor}`, value: v }));
const windowOptions = Array.from({ length: 12 }, (_, i) => i + 1).map((v) => ({ label: `${v}${text.window}`, value: v }));
const editModalTitle = computed(() => `${text.rateTitlePrefix}${editDishName.value}${text.modifyTitleSuffix}`);

const loadMore = () => {
    visibleCount.value = Math.min(visibleCount.value + pageSize, sortedDishes.value.length);
};

const openRatingModal = (record) => {
    ratingDishName.value = record.name;
    ratingValue.value = 0;
    ratingModalVisible.value = true;
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

const submitModify = () => {
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

.rating-modal-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.rating-row {
    display: inline-flex;
    align-items: center;
    gap: 10px;
}

.rating-desc {
    color: #595959;
    min-width: 28px;
}

.form-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.section-title {
    color: #1f1f1f;
    font-weight: 600;
}

:deep(.rating-row .ant-rate-star-zero .ant-rate-star-first),
:deep(.rating-row .ant-rate-star-zero .ant-rate-star-second) {
    color: #d9d9d9;
}
</style>

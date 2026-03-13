<template>
    <div id="rating-detail-page">
        <div id="rank-show">
            <span class="dish-show-title">{{ text.standardTitle }}</span>
            <a-table :columns="standardColumns" :data-source="standardRankData" :row-key="record => record.id" :pagination="false">
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

            <a-table :columns="weightedColumns" :data-source="weightedRankData" :row-key="record => record.id" :pagination="false">
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
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { CrownFilled } from '@ant-design/icons-vue';
import { createMockDishes } from '@/data/mockData';

const text = {
    standardTitle: '\u6807\u51c6\u6392\u540d',
    weightedTitle: '\u52a0\u6743\u6392\u540d',
    rank: '\u6392\u540d',
    name: '\u83dc\u54c1\u540d\u79f0',
    position: '\u83dc\u54c1\u4f4d\u7f6e',
    rate: '\u53e3\u5473\u8bc4\u5206',
    price: '\u4ef7\u683c(\u5143)',
    weightedScore: '\u7efc\u5408\u8bc4\u5206',
    priceFocus: '\u4fa7\u91cd\u4ef7\u683c',
    tasteFocus: '\u4fa7\u91cd\u53e3\u5473',
    floor: '\u697c',
    window: '\u53f7\u7a97\u53e3',
};

// 复用统一菜品样例数据，保证列表/排行榜口径一致。
const dishes = ref(createMockDishes());

// alpha：口味权重（价格权重 = 1 - alpha）。
const alpha = ref(0.5);
watch(alpha, (val) => {
    if (val <= 0) alpha.value = 0.01;
    if (val >= 1) alpha.value = 0.99;
});

const alphaMarks = {
    0: '0',
    1: '1',
};

const standardColumns = [
    { title: text.rank, dataIndex: 'rank', key: 'rank', width: 90 },
    { title: text.name, dataIndex: 'name', key: 'name' },
    { title: text.position, dataIndex: 'position', key: 'position' },
    { title: text.rate, dataIndex: 'rate', key: 'rate' },
    { title: text.price, dataIndex: 'price', key: 'price' },
];

const weightedColumns = [
    { title: text.rank, dataIndex: 'rank', key: 'rank', width: 90 },
    { title: text.name, dataIndex: 'name', key: 'name' },
    { title: text.position, dataIndex: 'position', key: 'position' },
    { title: text.rate, dataIndex: 'rate', key: 'rate' },
    { title: text.price, dataIndex: 'price', key: 'price' },
    { title: text.weightedScore, dataIndex: 'weightedScore', key: 'weightedScore' },
];

const maxPrice = computed(() => Math.max(...dishes.value.map((d) => d.price)));
const minPrice = computed(() => Math.min(...dishes.value.map((d) => d.price)));

const getPositionText = (dish) => `${dish.position.stair}${text.floor}${dish.position.window}${text.window}`;

const standardRankData = computed(() =>
    [...dishes.value]
        .sort((a, b) => b.rate - a.rate)
        .map((dish, index) => ({
            id: dish.id,
            rank: index + 1,
            name: dish.name,
            position: getPositionText(dish),
            rate: dish.rate,
            price: dish.price,
        })),
);

const weightedRankData = computed(() => {
    const priceRange = maxPrice.value - minPrice.value;
    return [...dishes.value]
        .map((dish) => {
            const priceScore = priceRange === 0 ? 5 : 1 + ((maxPrice.value - dish.price) / priceRange) * 4;
            const weightedScore = alpha.value * dish.rate + (1 - alpha.value) * priceScore;
            return {
                id: dish.id,
                name: dish.name,
                position: getPositionText(dish),
                rate: dish.rate,
                price: dish.price,
                weightedScore: weightedScore.toFixed(2),
                rawScore: weightedScore,
            };
        })
        .sort((a, b) => b.rawScore - a.rawScore)
        .map((item, index) => ({
            ...item,
            rank: index + 1,
        }));
});
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
</style>

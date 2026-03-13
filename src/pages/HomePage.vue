<template>
    <div id="home-page">
        <div id="dish-show">
            <div class="dish-show-header">
                <span class="dish-show-title">菜品总览</span>
            </div>
            <div class="dish-show-divider"></div>

            <div id="home-grid">
                <a-row :gutter="[16, 16]">
                    <a-col v-for="dish in previewDishes" :key="dish.id" :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
                        <a-card hoverable class="dish-card">
                            <template #cover>
                                <img :alt="dish.name" :src="dish.image" />
                            </template>
                            <template #actions>
                                <a-button type="text" class="detail-btn">查看详情</a-button>
                            </template>
                            <a-card-meta :title="dish.name" :description="`${dish.position.stair}楼${dish.position.window}号窗口`" />
                            <span>
                                <a-rate :value="dish.rate" :tooltips="rateTips" disabled allow-half />
                                <span class="ant-rate-text">{{ dish.rate }}</span>
                            </span>
                        </a-card>
                    </a-col>
                </a-row>
            </div>

            <a-row id="want-more" justify="center">
                <a-col :flex="'0 0 auto'" class="see-more-col">
                    <a-button type="default" size="large" class="see-more-button">查看更多菜品</a-button>
                </a-col>
            </a-row>
        </div>

        <div id="rank-show">
            <span class="dish-show-title">每日排名</span>
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
                    <a-button type="default" size="large" class="see-more-button">查看更多</a-button>
                </a-col>
            </a-row>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { CrownFilled } from '@ant-design/icons-vue';
import { createMockDishes } from '@/data/mockData';

// 首页只展示前 8 个卡片，排名则基于完整样例数据。
const dishes = ref(createMockDishes());
const previewDishes = computed(() => dishes.value.slice(0, 8));

const rateTips = ['1', '2', '3', '4', '5'];

const columns = [
    { title: '排名', dataIndex: 'rank', key: 'rank', width: 90 },
    { title: '菜品名称', dataIndex: 'name', key: 'name' },
    { title: '菜品位置', dataIndex: 'position', key: 'position' },
    { title: '评分', dataIndex: 'rate', key: 'rate' },
    { title: '价格(元)', dataIndex: 'price', key: 'price' },
];

// 排行按评分从高到低。
const rankData = computed(() =>
    [...dishes.value]
        .sort((a, b) => b.rate - a.rate)
        .map((dish, index) => ({
            id: dish.id,
            rank: index + 1,
            name: dish.name,
            position: `${dish.position.stair}楼${dish.position.window}号窗口`,
            rate: dish.rate,
            price: dish.price,
        })),
);
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

#dish-show:hover {
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

#rank-show:hover {
    border-color: #d9d9d9;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.15);
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

#want-more {
    margin-top: 16px;
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
    height: 48px;
    border-radius: 0 0 8px 8px;
    color: #000;
}

:deep(.detail-btn:hover),
:deep(.detail-btn:focus) {
    background-color: #ff4d4f;
    color: #fff;
}

:deep(.dish-card .ant-card-actions > li) {
    margin: 0;
}

:deep(.dish-card .ant-card-actions > li > span) {
    display: block;
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
<template>
    <div id="dishes-list-page">
        <div id="rank-show">
            <span class="dish-show-title">Daily Ranking</span>
            <a-table :columns="columns" :data-source="dishTableData" :row-key="record => record.id">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'rank'">
                        <span class="rank-cell">
                            <crown-filled v-if="record.rank <= 3" :class="`rank-crown rank-${record.rank}`" />
                            <span v-else class="rank-number">{{ record.rank }}</span>
                        </span>
                    </template>
                    <template v-else-if="column.key === 'rate'">
                        <span class="table-rate">
                            <a-rate :value="record.rate" disabled />
                            <span class="table-rate-number">{{ record.rate }}</span>
                        </span>
                    </template>
                </template>
            </a-table>
            <a-row id="rank-more" justify="center">
                <a-col :flex="'0 0 auto'" class="see-more-col">
                    <a-button type="default" size="large" class="see-more-button">See More</a-button>
                </a-col>
            </a-row>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { CrownFilled } from '@ant-design/icons-vue';

class Dish {
    constructor(id, name, position, rate, price) {
        this.id = id;
        this.name = name;
        this.position = position;
        this.rate = rate;
        this.price = price;
    }
}

const dishes = ref([
    new Dish(1, 'Braised Pork', { stair: 1, window: 2 }, 5.0, 10),
    new Dish(2, 'Kung Pao Chicken', { stair: 1, window: 4 }, 3.5, 15),
    new Dish(3, 'Fish-Flavored Pork', { stair: 2, window: 1 }, 4.2, 20),
    new Dish(4, 'Tomato Egg', { stair: 2, window: 3 }, 4.0, 25),
    new Dish(5, 'Shredded Potato', { stair: 1, window: 6 }, 3.8, 30),
    new Dish(6, 'Mapo Tofu', { stair: 3, window: 2 }, 4.5, 35),
    new Dish(7, 'Sour Fish Soup', { stair: 3, window: 5 }, 4.3, 40),
    new Dish(8, 'Tofu Pudding', { stair: 2, window: 6 }, 4.1, 45),
]);

dishes.value.sort((a, b) => b.rate - a.rate);

const columns = [
    {
        title: 'Rank',
        dataIndex: 'rank',
        key: 'rank',
        width: 90,
    },
    {
        title: 'Dish Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Location',
        dataIndex: 'position',
        key: 'position',
    },
    {
        title: 'Rating',
        dataIndex: 'rate',
        key: 'rate',
    },
    {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
    },
];

const dishTableData = computed(() =>
    dishes.value.map((dish, index) => ({
        id: dish.id,
        rank: index + 1,
        name: dish.name,
        position: `${dish.position.stair}F-${dish.position.window}`,
        rate: dish.rate,
        price: dish.price,
    })),
);
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

#rank-more {
    margin-top: 16px;
}

.dish-show-title {
    font-family: 'Noto Serif SC', 'Microsoft YaHei', serif;
    font-weight: 800;
    font-size: 22px;
    color: #1f1f1f;
    letter-spacing: 0.5px;
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

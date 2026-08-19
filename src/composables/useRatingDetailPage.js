/**
 * 文件说明：useRatingDetailPage.js
 * 1. 这个脚本负责抽离共享状态和页面逻辑，避免桌面端与移动端重复维护同一套业务代码。
 * 2. 该文件位于 src\composables 目录下，是当前模块的重要基础脚本之一。
 * 3. 维护这类文件时，优先保证对外暴露的数据、计算属性和事件接口稳定，避免影响多个视图层。
 */
import { computed, ref, watch } from 'vue';
import { getCached, STORES } from '@/db/indexedDB';
import { ratingDetailText, sharedText } from '@/models/text';

// 排行榜页的桌面端和移动端共用这一份数据组织逻辑。
// 这样以后如果计算规则或分页规则变化，只需要修改这里。
export const useRatingDetailPage = () => {
    const text = {
        ...sharedText,
        ...ratingDetailText,
        pageTitle: '评分排行榜',
        pageSubtitle: '同一套排行榜数据会在桌面表格和移动卡片中复用',
        pageSizePrefix: '每页显示',
        pageSizeSuffix: '条',
    };

    const dishes = ref(getCached(STORES.dishes));
    const alpha = ref(0.5);

    watch(alpha, (value) => {
        if (value <= 0) alpha.value = 0.01;
        if (value >= 1) alpha.value = 0.99;
    });

    const alphaMarks = {
        0: '0',
        1: '1',
    };

    const pageSizeOptions = ['5', '10', '20'];
    const standardCurrent = ref(1);
    const standardPageSize = ref(5);
    const weightedCurrent = ref(1);
    const weightedPageSize = ref(5);

    const standardColumns = [
        { title: text.rank, dataIndex: 'rank', key: 'rank', width: 90 },
        { title: text.dishName, dataIndex: 'name', key: 'name' },
        { title: text.dishPosition, dataIndex: 'position', key: 'position' },
        { title: text.rate, dataIndex: 'rate', key: 'rate' },
        { title: text.priceWithUnit, dataIndex: 'price', key: 'price' },
    ];

    const weightedColumns = [
        { title: text.rank, dataIndex: 'rank', key: 'rank', width: 90 },
        { title: text.dishName, dataIndex: 'name', key: 'name' },
        { title: text.dishPosition, dataIndex: 'position', key: 'position' },
        { title: text.rate, dataIndex: 'rate', key: 'rate' },
        { title: text.priceWithUnit, dataIndex: 'price', key: 'price' },
        { title: text.weightedScore, dataIndex: 'weightedScore', key: 'weightedScore' },
    ];

    const maxPrice = computed(() => Math.max(...dishes.value.map((dish) => dish.price)));
    const minPrice = computed(() => Math.min(...dishes.value.map((dish) => dish.price)));
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

    const pagedStandardRankData = computed(() => {
        const start = (standardCurrent.value - 1) * standardPageSize.value;
        return standardRankData.value.slice(start, start + standardPageSize.value);
    });

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

    const pagedWeightedRankData = computed(() => {
        const start = (weightedCurrent.value - 1) * weightedPageSize.value;
        return weightedRankData.value.slice(start, start + weightedPageSize.value);
    });

    watch([standardPageSize, standardRankData], () => {
        const maxPage = Math.max(1, Math.ceil(standardRankData.value.length / standardPageSize.value));
        if (standardCurrent.value > maxPage) {
            standardCurrent.value = maxPage;
        }
    });

    watch([weightedPageSize, weightedRankData], () => {
        const maxPage = Math.max(1, Math.ceil(weightedRankData.value.length / weightedPageSize.value));
        if (weightedCurrent.value > maxPage) {
            weightedCurrent.value = maxPage;
        }
    });

    return {
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
    };
};

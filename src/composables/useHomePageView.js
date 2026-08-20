/**
 * 文件说明：useHomePageView.js
 * 1. 这个脚本负责抽离共享状态和页面逻辑，避免桌面端与移动端重复维护同一套业务代码。
 * 2. 该文件位于 src\composables 目录下，是当前模块的重要基础脚本之一。
 * 3. 维护这类文件时，优先保证对外暴露的数据、计算属性和事件接口稳定，避免影响多个视图层。
 */
import { computed, ref, watch } from 'vue';
import { STORES } from '@/db/indexedDB';
import { homePageText, sharedText } from '@/models/text';
import { getMenu } from '@/api/getMenu';
import { useSyncedData } from '@/composables/useSyncedData';

export const useHomePageView = () => {
    const text = {
        ...sharedText,
        ...homePageText,
        pageSizeText: '\u6bcf\u9875\u663e\u793a',
    };

    const { data: dishes } = useSyncedData(STORES.dishes, getMenu);
    const overviewCurrent = ref(1);
    const overviewPageSize = ref(8);
    const pageSizeOptions = ['4', '8', '12'];

    const rateTips = ['1', '2', '3', '4', '5'];
    const formatPosition = (position) => `${position.stair}${sharedText.floor}${position.window}${sharedText.window}`;

    const pagedPreviewDishes = computed(() => {
        const start = (overviewCurrent.value - 1) * overviewPageSize.value;
        return dishes.value.slice(start, start + overviewPageSize.value);
    });

    const columns = [
        { title: sharedText.rank, dataIndex: 'rank', key: 'rank', width: 90 },
        { title: sharedText.dishName, dataIndex: 'name', key: 'name' },
        { title: sharedText.dishPosition, dataIndex: 'position', key: 'position' },
        { title: sharedText.rate, dataIndex: 'rate', key: 'rate' },
        { title: sharedText.priceWithUnit, dataIndex: 'price', key: 'price' },
    ];

    const rankData = computed(() =>
        [...dishes.value]
            .sort((a, b) => b.rate - a.rate)
            .map((dish, index) => ({
                id: dish.id,
                rank: index + 1,
                name: dish.name,
                position: formatPosition(dish.position),
                rate: dish.rate,
                price: dish.price,
                image: dish.image,
            })),
    );

    watch([overviewPageSize, dishes], () => {
        const maxPage = Math.max(1, Math.ceil(dishes.value.length / overviewPageSize.value));
        if (overviewCurrent.value > maxPage) {
            overviewCurrent.value = maxPage;
        }
    });

    return {
        text,
        dishes,
        rateTips,
        overviewCurrent,
        overviewPageSize,
        pageSizeOptions,
        pagedPreviewDishes,
        columns,
        rankData,
        formatPosition,
    };
};

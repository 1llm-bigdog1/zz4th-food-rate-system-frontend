/**
 * 文件说明：useDishesListPage.js
 * 1. 这个脚本负责抽离共享状态和页面逻辑，避免桌面端与移动端重复维护同一套业务代码。
 * 2. 该文件位于 src\composables 目录下，是当前模块的重要基础脚本之一。
 * 3. 维护这类文件时，优先保证对外暴露的数据、计算属性和事件接口稳定，避免影响多个视图层。
 */
import { computed, ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import { STORES } from '@/db/indexedDB';
import { dishesListText, sharedText } from '@/models/text';
import { submitContentForReview } from '@/api/review';
import { pushRate } from '@/api/pushRate';
import { resolveUploadedImage } from '@/api/upload';
import { buildFloorOptions, buildWindowOptions } from '@/utils/options';
import { useLoginGuard } from '@/composables/useLoginGuard';
import { getMenu } from '@/api/getMenu';
import { useSyncedData } from '@/composables/useSyncedData';

export const useDishesListPage = () => {
    const { ensureLoggedIn } = useLoginGuard();

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
        searchPlaceholder: '\u641c\u7d22\u83dc\u54c1\u540d\u79f0',
        resetFilters: '\u91cd\u7f6e\u7b5b\u9009',
    };

    const { data: dishes } = useSyncedData(STORES.dishes, getMenu);
    const searchInput = ref('');
    const searchKeyword = ref('');
    const selectedFloor = ref(undefined);
    const selectedWindow = ref(undefined);

    const pageSize = 20;
    const visibleCount = ref(pageSize);

    const floorOptions = buildFloorOptions(2, text.floor);
    const windowOptions = buildWindowOptions(8, text.window);

    const matchesKeyword = (dish) => {
        const keyword = searchKeyword.value.trim().toLowerCase();
        if (!keyword) {
            return true;
        }
        const positionText = `${dish.position.stair}${text.floor}${dish.position.window}${text.window}`;
        return [dish.name, positionText].some((value) => value.toLowerCase().includes(keyword));
    };

    const filteredDishes = computed(() =>
        dishes.value.filter((dish) => {
            const matchesFloor = !selectedFloor.value || dish.position.stair === selectedFloor.value;
            const matchesWindow = !selectedWindow.value || dish.position.window === selectedWindow.value;
            return matchesFloor && matchesWindow && matchesKeyword(dish);
        }),
    );

    const sortedDishes = computed(() =>
        [...filteredDishes.value].sort((a, b) => {
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

    const ratingModalVisible = ref(false);
    const ratingDishId = ref(null);
    const ratingDishName = ref('');
    const ratingValue = ref(0);
    const submitting = ref(false);
    const ratingModalTitle = computed(() => `${text.rateTitlePrefix}${ratingDishName.value}${text.rateTitleSuffix}`);

    const editModalVisible = ref(false);
    const editDishName = ref('');
    const editForm = ref({
        fileList: [],
        stair: null,
        window: null,
        price: null,
    });
    const editModalTitle = computed(() => `${text.rateTitlePrefix}${editDishName.value}${text.modifyTitleSuffix}`);

    const loadMore = () => {
        visibleCount.value = Math.min(visibleCount.value + pageSize, sortedDishes.value.length);
    };

    const onSearch = (value) => {
        searchKeyword.value = String(value || '').trim();
    };

    const resetFilters = () => {
        searchInput.value = '';
        searchKeyword.value = '';
        selectedFloor.value = undefined;
        selectedWindow.value = undefined;
    };

    const openRatingModal = (record) => {
        ratingDishId.value = record.id;
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

    const submitRating = async () => {
        if (submitting.value) {
            return;
        }
        if (!(await ensureLoggedIn())) {
            return;
        }
        if (!ratingValue.value) {
            message.warning('请先选择评分');
            return;
        }
        submitting.value = true;
        try {
            const result = await pushRate({
                targetType: 'dish',
                targetId: ratingDishId.value,
                score: ratingValue.value,
            });
            if (result && result.success === false) {
                message.error((result.message && String(result.message)) || '评分提交失败，请稍后重试');
                return;
            }
            ratingModalVisible.value = false;
            message.success(text.submitRating);
        } finally {
            submitting.value = false;
        }
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

    const submitModify = async (nextForm) => {
        if (submitting.value) {
            return;
        }
        if (!nextForm) {
            editModalVisible.value = false;
            return;
        }
        if (!(await ensureLoggedIn())) {
            return;
        }
        submitting.value = true;
        try {
            const image = await resolveUploadedImage(nextForm.fileList, '');
            await submitContentForReview({
                type: 'dish-supplement',
                dishName: editDishName.value,
                image,
                ...nextForm,
            });
            editForm.value = nextForm;
            editModalVisible.value = false;
            message.success(text.modifySuccess);
        } finally {
            submitting.value = false;
        }
    };

    watch([searchKeyword, selectedFloor, selectedWindow], () => {
        visibleCount.value = pageSize;
    });

    return {
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
    };
};

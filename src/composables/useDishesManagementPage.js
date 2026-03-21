/**
 * 文件说明：useDishesManagementPage.js
 * 1. 这个脚本负责抽离共享状态和页面逻辑，避免桌面端与移动端重复维护同一套业务代码。
 * 2. 该文件位于 src\composables 目录下，是当前模块的重要基础脚本之一。
 * 3. 维护这类文件时，优先保证对外暴露的数据、计算属性和事件接口稳定，避免影响多个视图层。
 */
import { computed, ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import Dish from '@/models/Dish';
import noImage from '@/static/no_image.png';
import { buildFloorOptions, buildWindowOptions, createMockDishes } from '@/data/mockData';
import { dishesListText, sharedText } from '@/models/text';

export const useDishesManagementPage = () => {
    const text = {
        ...sharedText,
        ...dishesListText,
        pageTitle: '\u83dc\u54c1\u7ba1\u7406',
        editData: '\u4fee\u6539\u4fe1\u606f',
        deleteDish: '\u5220\u9664\u83dc\u54c1',
        addDish: '\u6dfb\u52a0\u83dc\u54c1',
        addModalTitle: '\u6dfb\u52a0\u65b0\u83dc\u54c1',
        submitAdd: '\u6dfb\u52a0\u83dc\u54c1',
        searchPlaceholder: '\u641c\u7d22\u83dc\u54c1\u540d\u79f0',
        resetFilters: '\u91cd\u7f6e\u7b5b\u9009',
        dishNamePlaceholder: '\u8bf7\u8f93\u5165\u83dc\u54c1\u540d\u79f0',
        dishNameRequired: '\u8bf7\u586b\u5199\u83dc\u54c1\u540d\u79f0',
        addSuccess: '\u83dc\u54c1\u5df2\u6dfb\u52a0',
        deleteSuccess: '\u83dc\u54c1\u5df2\u5220\u9664',
        pageSizeText: '\u6bcf\u9875\u663e\u793a',
        floorPlaceholder: sharedText.selectFloor,
        windowPlaceholder: sharedText.selectWindow,
        pricePlaceholder: sharedText.inputPrice,
        uploadImage: sharedText.uploadImage,
        modifyPosition: sharedText.modifyPosition,
        modifyPrice: sharedText.modifyPrice,
        submitModify: sharedText.submitModify,
    };

    const dishes = ref(createMockDishes());
    const searchInput = ref('');
    const searchKeyword = ref('');
    const selectedFloor = ref(undefined);
    const selectedWindow = ref(undefined);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const pageSizeOptions = ['5', '10', '20'];

    const editModalVisible = ref(false);
    const editDishId = ref(null);
    const editDishName = ref('');
    const editForm = ref({
        fileList: [],
        stair: null,
        window: null,
        price: null,
    });

    const addModalVisible = ref(false);
    const addForm = ref({
        name: '',
        fileList: [],
        stair: null,
        window: null,
        price: null,
    });

    const floorOptions = buildFloorOptions(2, text.floor);
    const windowOptions = buildWindowOptions(8, text.window);
    const editModalTitle = computed(() => `${text.rateTitlePrefix}${editDishName.value}${text.modifyTitleSuffix}`);

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
        { title: text.action, dataIndex: 'action', key: 'action', width: 220 },
    ];

    const pagedTableData = computed(() => {
        const start = (currentPage.value - 1) * pageSize.value;
        return sortedDishes.value.slice(start, start + pageSize.value).map((dish) => ({
            id: dish.id,
            name: dish.name,
            position: `${dish.position.stair}${text.floor}${dish.position.window}${text.window}`,
            rate: dish.rate,
            price: dish.price,
            image: dish.image,
        }));
    });

    const onSearch = (value) => {
        searchKeyword.value = String(value || '').trim();
    };

    const resetFilters = () => {
        searchInput.value = '';
        searchKeyword.value = '';
        selectedFloor.value = undefined;
        selectedWindow.value = undefined;
    };

    const openEditModal = (record) => {
        const dish = dishes.value.find((item) => item.id === record.id);
        if (!dish) {
            return;
        }
        editDishId.value = dish.id;
        editDishName.value = dish.name;
        editForm.value = {
            fileList: [],
            stair: dish.position.stair,
            window: dish.position.window,
            price: dish.price,
        };
        editModalVisible.value = true;
    };

    const closeEditModal = () => {
        editModalVisible.value = false;
    };

    const getImageFromFileList = (fileList, fallback) => {
        const [firstFile] = fileList || [];
        if (!firstFile) {
            return fallback;
        }
        return firstFile.thumbUrl || firstFile.url || fallback;
    };

    const submitModify = (nextForm) => {
        if (editDishId.value === null || !nextForm) {
            editModalVisible.value = false;
            return;
        }
        const targetDish = dishes.value.find((item) => item.id === editDishId.value);
        if (targetDish) {
            targetDish.position = {
                stair: nextForm.stair ?? targetDish.position.stair,
                window: nextForm.window ?? targetDish.position.window,
            };
            targetDish.price = nextForm.price ?? targetDish.price;
            targetDish.image = getImageFromFileList(nextForm.fileList, targetDish.image);
        }
        editForm.value = nextForm;
        editModalVisible.value = false;
        message.success(text.modifySuccess);
    };

    const openAddModal = () => {
        addForm.value = {
            name: '',
            fileList: [],
            stair: null,
            window: null,
            price: null,
        };
        addModalVisible.value = true;
    };

    const closeAddModal = () => {
        addModalVisible.value = false;
    };

    const submitAdd = (nextForm) => {
        const nextId = dishes.value.length ? Math.max(...dishes.value.map((dish) => dish.id)) + 1 : 1;
        dishes.value.unshift(
            new Dish(
                nextId,
                nextForm.name.trim(),
                { stair: nextForm.stair ?? 1, window: nextForm.window ?? 1 },
                getImageFromFileList(nextForm.fileList, noImage),
                0,
                nextForm.price ?? 0,
            ),
        );
        addModalVisible.value = false;
        currentPage.value = 1;
        message.success(text.addSuccess);
    };

    const deleteDish = (record) => {
        dishes.value = dishes.value.filter((dish) => dish.id !== record.id);
        message.success(text.deleteSuccess);
    };

    watch([searchKeyword, selectedFloor, selectedWindow], () => {
        currentPage.value = 1;
    });

    watch([pageSize, sortedDishes], () => {
        const maxPage = Math.max(1, Math.ceil(sortedDishes.value.length / pageSize.value));
        if (currentPage.value > maxPage) {
            currentPage.value = maxPage;
        }
    });

    return {
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
        addModalTitle: text.addModalTitle,
        addForm,
        openAddModal,
        closeAddModal,
        submitAdd,
        deleteDish,
    };
};

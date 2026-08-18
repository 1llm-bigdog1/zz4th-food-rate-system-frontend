/**
 * 文件说明：useSelectionListPage.js
 * 1. 这个脚本负责抽离共享状态和页面逻辑，避免桌面端与移动端重复维护同一套业务代码。
 * 2. 该文件位于 src\composables 目录下，是当前模块的重要基础脚本之一。
 * 3. 维护这类文件时，优先保证对外暴露的数据、计算属性和事件接口稳定，避免影响多个视图层。
 */
import { computed, ref } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import Selection from '@/models/Selection';
import Position from '@/models/Position';
import { buildFloorOptions, buildWindowOptions, createMockSelections } from '@/data/mockData';
import { selectionListText, sharedText } from '@/models/text';
import { submitContentForReview } from '@/api/review';

// 严选列表页相对复杂，包含分享表单和评分弹窗。
// 这里把业务状态全部抽离，保证双端行为完全一致。
export const useSelectionListPage = () => {
    const router = useRouter();

    const text = {
        ...sharedText,
        ...selectionListText,
    };

    const selections = ref(createMockSelections());
    const pageSize = 5;
    const visibleCount = ref(pageSize);
    const visibleSelections = computed(() => selections.value.slice(0, visibleCount.value));
    const hasMore = computed(() => visibleCount.value < selections.value.length);

    const floorOptions = buildFloorOptions(2, text.floor);
    const windowOptions = buildWindowOptions(8, text.window);

    const form = ref({
        comment: '',
        price: null,
        positions: [{ floor: null, window: null }],
    });

    const ratingModalVisible = ref(false);
    const ratingTargetName = ref('');
    const ratingValue = ref(0);
    const ratingModalTitle = computed(() => `${text.rateTitlePrefix}${ratingTargetName.value}${text.rateTitleSuffix}`);

    const getUserInitial = (userId) => userId.slice(0, 1);
    const formatPosition = (pos) => `${text.purchasePrefix}${pos.floor}${text.floor}(${pos.window}${text.window})`;

    const goToSelectionDetail = (item) => {
        router.push(`/selection-detail/${item.id}`);
    };

    const loadMore = () => {
        visibleCount.value = Math.min(visibleCount.value + pageSize, selections.value.length);
    };

    const addPositionRow = () => {
        form.value.positions.push({ floor: null, window: null });
    };

    const removePositionRow = () => {
        if (form.value.positions.length > 1) {
            form.value.positions.pop();
        }
    };

    const resetForm = () => {
        form.value = {
            comment: '',
            price: null,
            positions: [{ floor: null, window: null }],
        };
    };

    const openRatingModal = (item) => {
        ratingTargetName.value = item.user_id;
        ratingValue.value = item.rate || 0;
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

    const submitSelection = async () => {
        const cleanComment = form.value.comment.trim();
        const validPositions = form.value.positions.filter((item) => item.floor && item.window);

        if (!cleanComment || form.value.price === null || validPositions.length === 0) {
            message.warning(text.submitWarning);
            return;
        }

        const reviewResult = await submitContentForReview({
            type: 'selection',
            comment: cleanComment,
            price: form.value.price,
            positions: validPositions,
        });

        if (reviewResult.approved) {
            selections.value.unshift(
                new Selection(
                    Date.now(),
                    text.myUserName,
                    new Date().toISOString().slice(0, 10),
                    cleanComment,
                    form.value.price,
                    validPositions.map((item) => new Position(item.floor, item.window)),
                    5,
                ),
        );
        }

        visibleCount.value = Math.max(visibleCount.value, pageSize);
        resetForm();
        message.success(text.submitSuccess);
    };

    return {
        text,
        floorOptions,
        windowOptions,
        form,
        visibleSelections,
        hasMore,
        ratingModalVisible,
        ratingModalTitle,
        ratingValue,
        getUserInitial,
        formatPosition,
        goToSelectionDetail,
        loadMore,
        addPositionRow,
        removePositionRow,
        openRatingModal,
        updateRatingValue,
        closeRatingModal,
        submitRating,
        submitSelection,
    };
};

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
import { putRecord, STORES } from '@/db/indexedDB';
import { selectionListText, sharedText } from '@/models/text';
import { getReviewStatus, submitContentForReview } from '@/api/review';
import { pushRate } from '@/api/pushRate';
import { buildFloorOptions, buildWindowOptions } from '@/utils/options';
import { useLoginGuard } from '@/composables/useLoginGuard';
import { getSelection } from '@/api/getSelection';
import { useSyncedData } from '@/composables/useSyncedData';

// 严选列表页相对复杂，包含分享表单和评分弹窗。
// 这里把业务状态全部抽离，保证双端行为完全一致。
export const useSelectionListPage = () => {
    const router = useRouter();
    const { ensureLoggedIn } = useLoginGuard();

    const text = {
        ...sharedText,
        ...selectionListText,
    };

    const { data: selections } = useSyncedData(STORES.selections, getSelection);
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
    const submitting = ref(false);

    const ratingModalVisible = ref(false);
    const ratingTargetId = ref(null);
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
        ratingTargetId.value = item.id;
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
                targetType: 'selection',
                targetId: ratingTargetId.value,
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

    const submitSelection = async () => {
        if (submitting.value) {
            return;
        }
        const cleanComment = form.value.comment.trim();
        const validPositions = form.value.positions.filter((item) => item.floor && item.window);

        if (!cleanComment || form.value.price === null || validPositions.length === 0) {
            message.warning(text.submitWarning);
            return;
        }

        if (!(await ensureLoggedIn())) {
            return;
        }

        submitting.value = true;
        try {
            const reviewResult = await submitContentForReview({
                type: 'selection',
                comment: cleanComment,
                price: form.value.price,
                positions: validPositions,
            });
            const status = getReviewStatus(reviewResult);
            if (status === 'rejected') {
                message.error('内容未通过审核，无法显示');
                return;
            }
            if (status === 'pending') {
                message.info('内容已提交，审核通过后显示');
                return;
            }
            if (status !== 'approved') {
                message.error('提交失败，请稍后重试');
                return;
            }

            const newSelection = new Selection(
                Date.now(),
                text.myUserName,
                new Date().toISOString().slice(0, 10),
                cleanComment,
                form.value.price,
                validPositions.map((item) => new Position(item.floor, item.window)),
                5,
            );
            selections.value.unshift(newSelection);
            await putRecord(STORES.selections, newSelection);
            visibleCount.value = Math.max(visibleCount.value, pageSize);
            resetForm();
            message.success(text.submitSuccess);
        } finally {
            submitting.value = false;
        }
    };

    return {
        text,
        floorOptions,
        windowOptions,
        form,
        submitting,
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

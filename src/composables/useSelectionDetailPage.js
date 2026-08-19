/**
 * 文件说明：useSelectionDetailPage.js
 * 1. 这个脚本负责抽离共享状态和页面逻辑，避免桌面端与移动端重复维护同一套业务代码。
 * 2. 该文件位于 src\composables 目录下，是当前模块的重要基础脚本之一。
 * 3. 维护这类文件时，优先保证对外暴露的数据、计算属性和事件接口稳定，避免影响多个视图层。
 */
import { computed, ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import { useRoute, useRouter } from 'vue-router';
import { getCached, putRecord, STORES } from '@/db/indexedDB';
import SelectionComment from '@/models/SelectionComment';
import { selectionListText, sharedText } from '@/models/text';
import { submitContentForReview } from '@/api/review';

// 严选详情页包含回复树和针对主贴/评论的评分状态。
export const useSelectionDetailPage = () => {
    const route = useRoute();
    const router = useRouter();

    const text = {
        ...sharedText,
        ...selectionListText,
    };

    const detailText = {
        back: '返回',
        detailTitle: '分享详情',
        detailSubtitle: '查看这条分享的完整内容、价格和购买位置',
        commentTitle: '评论区',
        commentSubtitle: '延续列表页的评论展示风格',
        replyBoxTitle: '回复这条分享',
        replyCommentTitle: '回复这条评论',
        replyPlaceholder: '请输入你的回复内容',
        cancelReply: '取消',
        pageSizePrefix: '每页显示',
        pageSizeSuffix: '条',
    };

    const selections = ref(getCached(STORES.selections));
    const routeSelectionId = Number(route.params.id);
    const currentSelection = computed(() => selections.value.find((item) => item.id === routeSelectionId) || selections.value[0]);
    const comments = ref(getCached(STORES.selectionComments));

    const buildCommentTree = (items, parentId = null, level = 0) =>
        items
            .filter((item) => (item.reply ? item.reply['comment-id'] : null) === parentId)
            .flatMap((item) => [{ ...item, level }, ...buildCommentTree(items, item.id, level + 1)]);

    const commentList = computed(() =>
        buildCommentTree(comments.value.filter((item) => item.selection_id === currentSelection.value.id)),
    );

    const pagedCommentList = computed(() => {
        const start = (currentPage.value - 1) * pageSize.value;
        return commentList.value.slice(start, start + pageSize.value);
    });

    const ratingModalVisible = ref(false);
    const ratingValue = ref(0);
    const ratingTargetKey = ref('');
    const ratingTargetName = ref('');
    const targetRates = ref({
        [`selection-${currentSelection.value.id}`]: currentSelection.value.rate,
    });

    const activeReplyTarget = ref({ type: '', id: '' });
    const replyContent = ref('');
    const currentPage = ref(1);
    const pageSize = ref(5);
    const pageSizeOptions = ['5', '10', '20'];

    const getSelectionTargetKey = (id) => `selection-${id}`;
    const getCommentTargetKey = (id) => `comment-${id}`;
    const getUserInitial = (userId) => userId.slice(0, 1);
    const formatPosition = (pos) => `${text.purchasePrefix}${pos.floor}${text.floor}(${pos.window}${text.window})`;
    const getTargetRate = (key) => targetRates.value[key] ?? 0;
    const isReplyingTo = (type, id) => activeReplyTarget.value.type === type && activeReplyTarget.value.id === id;
    const ratingModalTitle = computed(() => `${text.rateTitlePrefix}${ratingTargetName.value}${text.rateTitleSuffix}`);

    const openReplyBox = (type, id) => {
        activeReplyTarget.value = { type, id };
        replyContent.value = '';
    };

    const cancelReply = () => {
        activeReplyTarget.value = { type: '', id: '' };
        replyContent.value = '';
    };

    const openRatingModal = (type, id, userName) => {
        ratingTargetKey.value = type === 'selection' ? getSelectionTargetKey(id) : getCommentTargetKey(id);
        ratingTargetName.value = userName;
        ratingValue.value = getTargetRate(ratingTargetKey.value);
        ratingModalVisible.value = true;
    };

    const updateRatingValue = (value) => {
        ratingValue.value = value;
    };

    const closeRatingModal = () => {
        ratingModalVisible.value = false;
    };

    const submitRating = () => {
        targetRates.value = {
            ...targetRates.value,
            [ratingTargetKey.value]: ratingValue.value,
        };
        ratingModalVisible.value = false;
        message.success(text.submitRating);
    };

    const submitReply = async () => {
        const cleanReply = replyContent.value.trim();

        if (!cleanReply) {
            message.warning(detailText.replyPlaceholder);
            return;
        }

        const reviewResult = await submitContentForReview({
            type: 'selection-comment',
            selectionId: currentSelection.value.id,
            reply: cleanReply,
            target: activeReplyTarget.value,
        });

        if (reviewResult.approved) {
            const newComment = new SelectionComment(
                `${currentSelection.value.id}-comment-${Date.now()}`,
                text.myUserName,
                new Date().toISOString().slice(0, 10),
                cleanReply,
                currentSelection.value.id,
                activeReplyTarget.value.type === 'comment'
                    ? {
                        'user-id': commentList.value.find((item) => item.id === activeReplyTarget.value.id)?.user_id || '',
                        'comment-id': activeReplyTarget.value.id,
                    }
                    : null,
            );
            comments.value.push(newComment);
            await putRecord(STORES.selectionComments, newComment);
        }

        cancelReply();
        message.success(text.submitSuccess);
    };

    const goBack = () => {
        router.back();
    };

    watch([pageSize, commentList], () => {
        const maxPage = Math.max(1, Math.ceil(commentList.value.length / pageSize.value));
        if (currentPage.value > maxPage) {
            currentPage.value = maxPage;
        }
    });

    return {
        text,
        detailText,
        currentSelection,
        pagedCommentList,
        commentList,
        ratingModalVisible,
        ratingModalTitle,
        ratingValue,
        replyContent,
        currentPage,
        pageSize,
        pageSizeOptions,
        getSelectionTargetKey,
        getCommentTargetKey,
        getUserInitial,
        formatPosition,
        getTargetRate,
        isReplyingTo,
        openReplyBox,
        cancelReply,
        openRatingModal,
        updateRatingValue,
        closeRatingModal,
        submitRating,
        submitReply,
        goBack,
    };
};

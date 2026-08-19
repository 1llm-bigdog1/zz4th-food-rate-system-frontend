/**
 * 文件说明：useAdviceDetailPage.js
 * 1. 这个脚本负责抽离共享状态和页面逻辑，避免桌面端与移动端重复维护同一套业务代码。
 * 2. 该文件位于 src\composables 目录下，是当前模块的重要基础脚本之一。
 * 3. 维护这类文件时，优先保证对外暴露的数据、计算属性和事件接口稳定，避免影响多个视图层。
 */
import { computed, ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import { useRoute, useRouter } from 'vue-router';
import { getCached, putRecord, STORES } from '@/db/indexedDB';
import AdviceComment from '@/models/AdviceComment';
import { submitContentForReview } from '@/api/review';

// 建议详情页的回复树、分页和点赞逻辑由桌面/移动端共享。
export const useAdviceDetailPage = () => {
    const route = useRoute();
    const router = useRouter();

    const text = {
        back: '返回',
        detailTitle: '新品建议详情',
        detailSubtitle: '查看这条建议的完整内容和同学们的追加讨论',
        commentPanelTitle: '评论区',
        commentPanelSubtitle: '围绕这条新品建议的层级讨论',
        reply: '回复',
        likeAction: '点赞',
        submit: '提交',
        cancelReply: '取消',
        replyAdviceTitle: '回复这条建议',
        replyCommentTitle: '回复这条评论',
        replyPlaceholder: '请输入你的补充想法',
        submitSuccess: '感谢你的参与，新评论已经加入到当前列表',
        submitWarning: '请先输入回复内容',
        myUserName: '我',
        pageSizePrefix: '每页显示',
        pageSizeSuffix: '条',
    };

    const advices = ref(getCached(STORES.advices));
    const currentAdviceId = Number(route.params.id);
    const currentAdvice = computed(() => advices.value.find((item) => item.id === currentAdviceId) || advices.value[0]);
    const comments = ref(getCached(STORES.adviceComments));
    const activeReplyTarget = ref({ type: '', id: '' });
    const replyContent = ref('');
    const currentPage = ref(1);
    const pageSize = ref(5);
    const pageSizeOptions = ['5', '10', '20'];

    const buildCommentTree = (items, parentId = null, level = 0, usersById = {}) =>
        items
            .filter((item) => item.parent_id === parentId)
            .flatMap((item) => [
                {
                    ...item,
                    level,
                    replyTargetUser: item.parent_id ? usersById[item.parent_id] || '' : '',
                },
                ...buildCommentTree(items, item.id, level + 1, usersById),
            ]);

    const commentList = computed(() => {
        const related = comments.value.filter((item) => item.advice_id === currentAdvice.value.id);
        const usersById = Object.fromEntries(related.map((item) => [item.id, item.user_id]));
        return buildCommentTree(related, null, 0, usersById);
    });

    const pagedCommentList = computed(() => {
        const start = (currentPage.value - 1) * pageSize.value;
        return commentList.value.slice(start, start + pageSize.value);
    });

    const getUserInitial = (userId) => userId.slice(0, 1);
    const isReplyingTo = (type, id) => activeReplyTarget.value.type === type && activeReplyTarget.value.id === id;

    const goBack = () => {
        router.back();
    };

    const openReplyBox = (type, id) => {
        activeReplyTarget.value = { type, id };
        replyContent.value = '';
    };

    const cancelReply = () => {
        activeReplyTarget.value = { type: '', id: '' };
        replyContent.value = '';
    };

    const toggleAdviceLike = async () => {
        currentAdvice.value.like += 1;
        await putRecord(STORES.advices, currentAdvice.value);
    };

    const toggleCommentLike = async (commentId) => {
        const target = comments.value.find((item) => item.id === commentId);
        if (target) {
            target.likes += 1;
            await putRecord(STORES.adviceComments, target);
        }
    };

    const submitReply = async () => {
        const cleanReply = replyContent.value.trim();

        if (!cleanReply) {
            message.warning(text.submitWarning);
            return;
        }

        const reviewResult = await submitContentForReview({
            type: 'advice-comment',
            adviceId: currentAdvice.value.id,
            reply: cleanReply,
            target: activeReplyTarget.value,
        });

        if (reviewResult.approved) {
            const newComment = new AdviceComment(
                `${currentAdvice.value.id}-comment-${Date.now()}`,
                text.myUserName,
                new Date().toISOString().slice(0, 10),
                currentAdvice.value.id,
                cleanReply,
                activeReplyTarget.value.type === 'comment' ? activeReplyTarget.value.id : null,
                0,
            );
            comments.value.push(newComment);
            await putRecord(STORES.adviceComments, newComment);
        }

        cancelReply();
        message.success(text.submitSuccess);
    };

    watch([pageSize, commentList], () => {
        const maxPage = Math.max(1, Math.ceil(commentList.value.length / pageSize.value));
        if (currentPage.value > maxPage) {
            currentPage.value = maxPage;
        }
    });

    return {
        text,
        currentAdvice,
        pagedCommentList,
        commentList,
        activeReplyTarget,
        replyContent,
        currentPage,
        pageSize,
        pageSizeOptions,
        getUserInitial,
        isReplyingTo,
        goBack,
        openReplyBox,
        cancelReply,
        toggleAdviceLike,
        toggleCommentLike,
        submitReply,
    };
};

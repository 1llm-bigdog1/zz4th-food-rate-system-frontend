/**
 * 文件说明：useAdviceDetailPage.js
 * 1. 这个脚本负责抽离共享状态和页面逻辑，避免桌面端与移动端重复维护同一套业务代码。
 * 2. 该文件位于 src\composables 目录下，是当前模块的重要基础脚本之一。
 * 3. 维护这类文件时，优先保证对外暴露的数据、计算属性和事件接口稳定，避免影响多个视图层。
 */
import { computed, onMounted, ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import { useRoute, useRouter } from 'vue-router';
import { putRecord, STORES } from '@/db/indexedDB';
import AdviceComment from '@/models/AdviceComment';
import { getReviewStatus, submitContentForReview } from '@/api/submitContentForReview';
import { toggleLike as toggleLikeRequest } from '@/api/toggleLike';
import { shouldUseMockApi } from '@/api/client';
import { useLoginGuard } from '@/composables/useLoginGuard';
import { getAdvice } from '@/api/getAdvice';
import { getAdviceComments } from '@/api/getAdviceComments';
import { useSyncedData } from '@/composables/useSyncedData';
import { getCurrentUserIdentity } from '@/utils/currentUser';
import { ensureCurrentUserRegistered, getDisplayAvatar, getDisplayInitial, getDisplayUser } from '@/utils/userDisplay';

// 建议详情页的回复树、分页和点赞逻辑由桌面/移动端共享。
export const useAdviceDetailPage = () => {
    const route = useRoute();
    const router = useRouter();
    const { ensureLoggedIn, handleApiError } = useLoginGuard();

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

    const { data: advices } = useSyncedData(STORES.advices, getAdvice);
    const currentAdviceId = Number(route.params.id);
    const currentAdvice = computed(() => advices.value.find((item) => item.id === currentAdviceId) || advices.value[0] || null);
    const { data: comments } = useSyncedData(STORES.adviceComments, getAdviceComments);
    const activeReplyTarget = ref({ type: '', id: '' });
    const replyContent = ref('');
    const submitting = ref(false);
    const likeSubmitting = ref(false);
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
        if (!currentAdvice.value) {
            return [];
        }
        const related = comments.value.filter((item) => item.advice_id === currentAdvice.value.id);
        const usersById = Object.fromEntries(related.map((item) => [item.id, item.user_id]));
        return buildCommentTree(related, null, 0, usersById);
    });

    const pagedCommentList = computed(() => {
        const start = (currentPage.value - 1) * pageSize.value;
        return commentList.value.slice(start, start + pageSize.value);
    });

    const getUserInitial = (userId) => getDisplayInitial(userId);
    const isReplyingTo = (type, id) => activeReplyTarget.value.type === type && activeReplyTarget.value.id === id;

    onMounted(() => {
        ensureCurrentUserRegistered();
    });

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
        if (likeSubmitting.value) {
            return;
        }
        if (!(await ensureLoggedIn())) {
            return;
        }
        likeSubmitting.value = true;
        try {
            const { userId, username } = await getCurrentUserIdentity();
            const result = await toggleLikeRequest({
                targetType: 'advice',
                targetId: currentAdvice.value.id,
                userId,
                username,
            });
            if (result && result.success === false) {
                message.error((result.message && String(result.message)) || '操作失败，请稍后重试');
                return;
            }
            currentAdvice.value.like += 1;
            await putRecord(STORES.advices, currentAdvice.value);
        } catch (error) {
            message.error('操作失败，请稍后重试');
        } finally {
            likeSubmitting.value = false;
        }
    };

    const toggleCommentLike = async (commentId) => {
        const target = comments.value.find((item) => item.id === commentId);
        if (!target) {
            return;
        }
        if (likeSubmitting.value) {
            return;
        }
        if (!(await ensureLoggedIn())) {
            return;
        }
        likeSubmitting.value = true;
        try {
            const { userId, username } = await getCurrentUserIdentity();
            const result = await toggleLikeRequest({
                targetType: 'advice-comment',
                targetId: commentId,
                userId,
                username,
            });
            if (result && result.success === false) {
                message.error((result.message && String(result.message)) || '操作失败，请稍后重试');
                return;
            }
            target.likes += 1;
            await putRecord(STORES.adviceComments, target);
        } catch (error) {
            message.error('操作失败，请稍后重试');
        } finally {
            likeSubmitting.value = false;
        }
    };

    const submitReply = async () => {
        if (submitting.value) {
            return;
        }
        const cleanReply = replyContent.value.trim();

        if (!cleanReply) {
            message.warning(text.submitWarning);
            return;
        }

        if (!(await ensureLoggedIn())) {
            return;
        }

        submitting.value = true;
        try {
            const { userId, username } = await getCurrentUserIdentity();
            const reviewResult = await submitContentForReview({
                type: 'advice-comment',
                adviceId: currentAdvice.value.id,
                reply: cleanReply,
                target: activeReplyTarget.value,
                userId,
                username,
            });
            const status = getReviewStatus(reviewResult);
            if (status === 'rejected') {
                message.error('评论未通过审核，无法显示');
                return;
            }
            if (status === 'pending') {
                message.info('评论已提交，审核通过后显示');
                return;
            }
            if (status !== 'approved') {
                message.error('提交失败，请稍后重试');
                return;
            }

            if (shouldUseMockApi()) {
                const newComment = new AdviceComment(
                    `${currentAdvice.value.id}-comment-${Date.now()}`,
                    userId || text.myUserName,
                    new Date().toISOString().slice(0, 10),
                    currentAdvice.value.id,
                    cleanReply,
                    activeReplyTarget.value.type === 'comment' ? activeReplyTarget.value.id : null,
                    0,
                );
                comments.value.push(newComment);
                await putRecord(STORES.adviceComments, newComment);
            } else {
                // 真实后端：等待增量同步拉取正式评论，避免临时 id 与后端 id 重复。
                try {
                    await getAdviceComments();
                } catch (syncError) {
                    // 提交已成功，同步失败不阻塞，内容稍后经同步显示。
                }
            }
            cancelReply();
            message.success(text.submitSuccess);
        } catch (error) {
            handleApiError(error, '提交失败，请稍后重试');
        } finally {
            submitting.value = false;
        }
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
        submitting,
        currentPage,
        pageSize,
        pageSizeOptions,
        getUserInitial,
        displayUser: getDisplayUser,
        displayAvatar: getDisplayAvatar,
        isReplyingTo,
        goBack,
        openReplyBox,
        cancelReply,
        toggleAdviceLike,
        toggleCommentLike,
        submitReply,
    };
};

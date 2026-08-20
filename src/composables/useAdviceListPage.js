/**
 * 文件说明：useAdviceListPage.js
 * 1. 这个脚本负责抽离共享状态和页面逻辑，避免桌面端与移动端重复维护同一套业务代码。
 * 2. 该文件位于 src\composables 目录下，是当前模块的重要基础脚本之一。
 * 3. 维护这类文件时，优先保证对外暴露的数据、计算属性和事件接口稳定，避免影响多个视图层。
 */
import { computed, onMounted, ref } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import Advice from '@/models/Advice';
import { putRecord, STORES } from '@/db/indexedDB';
import { sharedText } from '@/models/text';
import { getReviewStatus, submitContentForReview } from '@/api/review';
import { toggleLike as toggleLikeRequest } from '@/api/like';
import { useLoginGuard } from '@/composables/useLoginGuard';
import { getAdvice } from '@/api/getAdvice';
import { useSyncedData } from '@/composables/useSyncedData';
import { getCurrentUserIdentity } from '@/utils/currentUser';
import { ensureCurrentUserRegistered, getDisplayAvatar, getDisplayInitial, getDisplayUser } from '@/utils/userDisplay';

// 新品建议列表页的所有业务状态都集中在这里，
// 桌面端和移动端只负责展示，不复制提交和跳转逻辑。
export const useAdviceListPage = () => {
    const router = useRouter();
    const { ensureLoggedIn } = useLoginGuard();

    const text = {
        ...sharedText,
        pageTitle: '新品建议',
        listSubtitle: '像评论区一样浏览大家对新品的想法和补充意见',
        contributeTitle: '我要提建议',
        contributeSubtitle: '发布你想看到的新品点子',
        commentTitle: '建议内容',
        commentPlaceholder: '请输入你的新品建议',
        submit: '提交',
        submitSuccess: '感谢你的建议，提交后的内容会在审核后显示',
        submitWarning: '请先填写建议内容',
        reply: '回复',
        likeAction: '点赞',
        myUserName: '我',
    };

    const { data: advices } = useSyncedData(STORES.advices, getAdvice);
    const pageSize = 5;
    const visibleCount = ref(pageSize);
    const visibleAdvices = computed(() => advices.value.slice(0, visibleCount.value));
    const hasMore = computed(() => visibleCount.value < advices.value.length);

    const form = ref({
        comment: '',
    });
    const submitting = ref(false);

    const getUserInitial = (userId) => getDisplayInitial(userId);

    onMounted(() => {
        ensureCurrentUserRegistered();
    });

    const loadMore = () => {
        visibleCount.value = Math.min(visibleCount.value + pageSize, advices.value.length);
    };

    const goToAdviceDetail = (item) => {
        router.push(`/advice-detail/${item.id}`);
    };

    const toggleLike = async (item) => {
        if (!(await ensureLoggedIn())) {
            return;
        }
        try {
            const { userId, username } = await getCurrentUserIdentity();
            const result = await toggleLikeRequest({ targetType: 'advice', targetId: item.id, userId, username });
            if (result && result.success === false) {
                message.error((result.message && String(result.message)) || '操作失败，请稍后重试');
                return;
            }
            item.like += 1;
            await putRecord(STORES.advices, item);
        } catch (error) {
            message.error('操作失败，请稍后重试');
        }
    };

    const submitAdvice = async () => {
        if (submitting.value) {
            return;
        }
        const cleanComment = form.value.comment.trim();

        if (!cleanComment) {
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
                type: 'advice',
                comment: cleanComment,
                userId,
                username,
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

            const newAdvice = new Advice(
                Date.now(),
                userId || text.myUserName,
                new Date().toISOString().slice(0, 10),
                cleanComment,
                0,
                [],
            );
            advices.value.unshift(newAdvice);
            await putRecord(STORES.advices, newAdvice);
            visibleCount.value = Math.max(visibleCount.value, pageSize);
            form.value.comment = '';
            message.success(text.submitSuccess);
        } finally {
            submitting.value = false;
        }
    };

    return {
        text,
        form,
        submitting,
        visibleAdvices,
        hasMore,
        getUserInitial,
        displayUser: getDisplayUser,
        displayAvatar: getDisplayAvatar,
        loadMore,
        goToAdviceDetail,
        toggleLike,
        submitAdvice,
    };
};

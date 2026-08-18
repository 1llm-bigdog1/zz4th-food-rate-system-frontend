/**
 * 文件说明：useAdviceListPage.js
 * 1. 这个脚本负责抽离共享状态和页面逻辑，避免桌面端与移动端重复维护同一套业务代码。
 * 2. 该文件位于 src\composables 目录下，是当前模块的重要基础脚本之一。
 * 3. 维护这类文件时，优先保证对外暴露的数据、计算属性和事件接口稳定，避免影响多个视图层。
 */
import { computed, ref } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import Advice from '@/models/Advice';
import { createMockAdvices } from '@/data/mockData';
import { sharedText } from '@/models/text';
import { submitContentForReview } from '@/api/review';

// 新品建议列表页的所有业务状态都集中在这里，
// 桌面端和移动端只负责展示，不复制提交和跳转逻辑。
export const useAdviceListPage = () => {
    const router = useRouter();

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

    const advices = ref(createMockAdvices());
    const pageSize = 5;
    const visibleCount = ref(pageSize);
    const visibleAdvices = computed(() => advices.value.slice(0, visibleCount.value));
    const hasMore = computed(() => visibleCount.value < advices.value.length);

    const form = ref({
        comment: '',
    });

    const getUserInitial = (userId) => userId.slice(0, 1);

    const loadMore = () => {
        visibleCount.value = Math.min(visibleCount.value + pageSize, advices.value.length);
    };

    const goToAdviceDetail = (item) => {
        router.push(`/advice-detail/${item.id}`);
    };

    const toggleLike = (item) => {
        item.like += 1;
    };

    const submitAdvice = async () => {
        const cleanComment = form.value.comment.trim();

        if (!cleanComment) {
            message.warning(text.submitWarning);
            return;
        }

        const reviewResult = await submitContentForReview({ type: 'advice', comment: cleanComment });

        if (reviewResult.approved) {
            advices.value.unshift(
                new Advice(
                    Date.now(),
                    text.myUserName,
                    new Date().toISOString().slice(0, 10),
                    cleanComment,
                    0,
                    [],
                ),
            );
        }

        visibleCount.value = Math.max(visibleCount.value, pageSize);
        form.value.comment = '';
        message.success(text.submitSuccess);
    };

    return {
        text,
        form,
        visibleAdvices,
        hasMore,
        getUserInitial,
        loadMore,
        goToAdviceDetail,
        toggleLike,
        submitAdvice,
    };
};

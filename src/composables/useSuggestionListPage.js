/**
 * 文件说明：useSuggestionListPage.js
 * 1. 这个脚本负责抽离共享状态和页面逻辑，避免桌面端与移动端重复维护同一套业务代码。
 * 2. 该文件位于 src\composables 目录下，是当前模块的重要基础脚本之一。
 * 3. 维护这类文件时，优先保证对外暴露的数据、计算属性和事件接口稳定，避免影响多个视图层。
 */
import { computed, ref } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import Suggestion from '@/models/Suggestion';
import { createMockSuggestions } from '@/data/mockData';
import { sharedText } from '@/models/text';

// 食堂建议列表页的桌面端和移动端共享逻辑。
export const useSuggestionListPage = () => {
    const router = useRouter();

    const text = {
        ...sharedText,
        pageTitle: '食堂建议',
        listSubtitle: '浏览大家对食堂环境、服务和管理的建议',
        contributeTitle: '我要提建议',
        contributeSubtitle: '发布你对食堂的改进想法',
        commentTitle: '建议内容',
        commentPlaceholder: '请输入你的食堂建议',
        submit: '提交',
        submitSuccess: '感谢你的建议，提交后的内容会在审核后显示',
        submitWarning: '请先填写建议内容',
        reply: '回复',
        likeAction: '点赞',
        myUserName: '我',
    };

    const suggestions = ref(createMockSuggestions());
    const pageSize = 5;
    const visibleCount = ref(pageSize);
    const visibleSuggestions = computed(() => suggestions.value.slice(0, visibleCount.value));
    const hasMore = computed(() => visibleCount.value < suggestions.value.length);

    const form = ref({
        comment: '',
    });

    const getUserInitial = (userId) => userId.slice(0, 1);

    const loadMore = () => {
        visibleCount.value = Math.min(visibleCount.value + pageSize, suggestions.value.length);
    };

    const goToSuggestionDetail = (item) => {
        router.push(`/suggestion-detail/${item.id}`);
    };

    const toggleLike = (item) => {
        item.like += 1;
    };

    const submitSuggestion = () => {
        const cleanComment = form.value.comment.trim();

        if (!cleanComment) {
            message.warning(text.submitWarning);
            return;
        }

        suggestions.value.unshift(
            new Suggestion(
                Date.now(),
                text.myUserName,
                new Date().toISOString().slice(0, 10),
                cleanComment,
                0,
                [],
            ),
        );

        visibleCount.value = Math.max(visibleCount.value, pageSize);
        form.value.comment = '';
        message.success(text.submitSuccess);
    };

    return {
        text,
        form,
        visibleSuggestions,
        hasMore,
        getUserInitial,
        loadMore,
        goToSuggestionDetail,
        toggleLike,
        submitSuggestion,
    };
};

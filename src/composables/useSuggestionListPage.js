/**
 * 文件说明：useSuggestionListPage.js
 * 1. 这个脚本负责抽离共享状态和页面逻辑，避免桌面端与移动端重复维护同一套业务代码。
 * 2. 该文件位于 src\composables 目录下，是当前模块的重要基础脚本之一。
 * 3. 维护这类文件时，优先保证对外暴露的数据、计算属性和事件接口稳定，避免影响多个视图层。
 */
import { computed, onMounted, ref } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import Suggestion from '@/models/Suggestion';
import { putRecord, STORES } from '@/db/indexedDB';
import { sharedText } from '@/models/text';
import { getReviewStatus, submitContentForReview } from '@/api/submitContentForReview';
import { toggleLike as toggleLikeRequest } from '@/api/toggleLike';
import { shouldUseMockApi } from '@/api/client';
import { useLoginGuard } from '@/composables/useLoginGuard';
import { getSuggestion } from '@/api/getSuggestion';
import { useSyncedData } from '@/composables/useSyncedData';
import { getCurrentUserIdentity } from '@/utils/currentUser';
import { ensureCurrentUserRegistered, getDisplayAvatar, getDisplayUser } from '@/utils/userDisplay';
import { refreshLikeStatus } from '@/utils/likeSync';

// 食堂建议列表页的桌面端和移动端共享逻辑。
export const useSuggestionListPage = () => {
    const router = useRouter();
    const { ensureLoggedIn, handleApiError } = useLoginGuard();

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
        likedAction: '已点赞',
        myUserName: '我',
    };

    const { data: suggestions, reload: reloadSuggestions } = useSyncedData(STORES.suggestions, getSuggestion);
    const pageSize = 5;
    const visibleCount = ref(pageSize);
    const visibleSuggestions = computed(() => suggestions.value.slice(0, visibleCount.value));
    const hasMore = computed(() => visibleCount.value < suggestions.value.length);

    const form = ref({
        comment: '',
    });
    const submitting = ref(false);
    const likeSubmitting = ref(false);

    const getUserInitial = (item) => ((item && item.nickname) || '同').slice(0, 1);

    onMounted(() => {
        ensureCurrentUserRegistered();
        refreshLikeStatus('suggestion', suggestions.value, STORES.suggestions);
    });

    const loadMore = () => {
        visibleCount.value = Math.min(visibleCount.value + pageSize, suggestions.value.length);
    };

    const goToSuggestionDetail = (item) => {
        router.push(`/suggestion-detail/${item.id}`);
    };

    const toggleLike = async (item) => {
        if (likeSubmitting.value) {
            return;
        }
        if (!(await ensureLoggedIn())) {
            return;
        }
        likeSubmitting.value = true;
        try {
            const result = await toggleLikeRequest({
                targetType: 'suggestion',
                targetId: item.id,
                cancel: !!item.liked,
            });
            if (result && result.success === false) {
                message.error((result.message && String(result.message)) || '操作失败，请稍后重试');
                return;
            }
            item.liked = !!result.liked;
            if (typeof result.count === 'number') {
                item.like = result.count;
            }
            await putRecord(STORES.suggestions, item);
        } catch (error) {
            handleApiError(error, '操作失败，请稍后重试');
        } finally {
            likeSubmitting.value = false;
        }
    };

    const submitSuggestion = async () => {
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
                type: 'suggestion',
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

            if (shouldUseMockApi()) {
                const newSuggestion = new Suggestion(
                    Date.now(),
                    userId || text.myUserName,
                    new Date().toISOString().slice(0, 10),
                    cleanComment,
                    0,
                    [],
                );
                suggestions.value.unshift(newSuggestion);
                await putRecord(STORES.suggestions, newSuggestion);
            } else {
                // 真实后端：等待增量同步拉取正式记录，避免临时 id 与后端 id 重复。
                try {
                    await getSuggestion();
                    await refreshLikeStatus('suggestion', suggestions.value, STORES.suggestions);
                    reloadSuggestions();
                } catch (syncError) {
                    // 提交已成功，同步失败不阻塞，内容稍后经同步显示。
                }
            }
            visibleCount.value = Math.max(visibleCount.value, pageSize);
            form.value.comment = '';
            message.success(text.submitSuccess);
        } catch (error) {
            handleApiError(error, '提交失败，请稍后重试');
        } finally {
            submitting.value = false;
        }
    };

    return {
        text,
        form,
        submitting,
        visibleSuggestions,
        hasMore,
        getUserInitial,
        displayUser: getDisplayUser,
        displayAvatar: getDisplayAvatar,
        loadMore,
        goToSuggestionDetail,
        toggleLike,
        submitSuggestion,
    };
};

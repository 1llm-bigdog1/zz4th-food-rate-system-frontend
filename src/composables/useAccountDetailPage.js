/**
 * 文件说明：useAccountDetailPage.js
 * 1. 这个脚本负责抽取用户中心共享状态：页面加载时独立调用 getUser() 获取当前登录用户，
 *    桌面端与移动端共用，不依赖 GlobalHeader 传递 User。
 * 2. 该文件位于 src\composables 目录下，是当前模块的重要基础脚本之一。
 * 3. 数据源为当前 User 模型实例；HTTP 401 按项目现有未登录逻辑进入登录页；
 *    后端不可用的开发环境由 fetchCurrentUser 提供调试用户。
 */
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { fetchCurrentUser } from '@/utils/currentUser';

export const useAccountDetailPage = () => {
    const router = useRouter();

    const user = ref(null);
    const loading = ref(true);

    const loadUser = async () => {
        loading.value = true;
        try {
            user.value = await fetchCurrentUser();
        } catch (error) {
            // HTTP 401：视为未登录，进入登录页面。
            if (error && error.status === 401 && router.currentRoute.value.path !== '/login') {
                router.push('/login');
            }
        } finally {
            loading.value = false;
        }
    };

    const avatarPreview = computed(() => (user.value && user.value.avatar_path) || undefined);
    const avatarFallback = computed(
        () => (user.value && (user.value.nickname || user.value.username || '用').slice(0, 1)) || '用',
    );

    loadUser();

    return {
        user,
        loading,
        avatarPreview,
        avatarFallback,
        loadUser,
    };
};

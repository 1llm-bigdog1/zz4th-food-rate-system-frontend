/**
 * 文件说明：useGlobalHeader.js
 * 1. 全局头部用户入口的共享逻辑：加载当前用户（真实后端用户或开发调试用户）、登录状态与菜单跳转。
 * 2. 登录状态判断：getUser() 成功（含调试用户）→ 已登录；HTTP 401 → 未登录。
 * 3. 复用 useSession 的登录保持状态，在真实登录成功后自动刷新用户信息。
 */
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { fetchCurrentUser } from '@/utils/currentUser';
import { useSession } from '@/composables/useSession';

export const useGlobalHeader = () => {
    const router = useRouter();
    const { isLoggedIn: sessionLoggedIn, logout } = useSession();

    const user = ref(null);
    const loading = ref(false);

    const loadUser = async () => {
        loading.value = true;
        try {
            user.value = await fetchCurrentUser();
        } catch (error) {
            user.value = null;
        } finally {
            loading.value = false;
        }
    };

    onMounted(() => {
        loadUser();
    });

    // 真实登录成功后刷新用户信息；退出后清空本地用户展示。
    watch(sessionLoggedIn, (value) => {
        if (value) {
            loadUser();
        } else {
            user.value = null;
        }
    });

    const isLoggedIn = computed(() => !!user.value);
    const avatarPath = computed(() => (user.value && user.value.avatar_path) || undefined);
    const avatarFallback = computed(
        () => (user.value && (user.value.nickname || user.value.username || '用').slice(0, 1)) || '',
    );

    const goToLogin = () => router.push('/login');
    const goToRegister = () => router.push('/register');
    const goToAccount = () => router.push('/account');

    const handleLogout = async () => {
        const ok = await logout();
        if (ok) {
            user.value = null;
        }
    };

    return {
        user,
        loading,
        isLoggedIn,
        avatarPath,
        avatarFallback,
        goToLogin,
        goToRegister,
        goToAccount,
        handleLogout,
    };
};

/**
 * 文件说明：useSession.js
 * 1. 登录保持与会话状态：登录状态由后端 HttpOnly Session Cookie 维持（30 天），
 *    前端不保存、不读取 Session ID（不写入 localStorage/sessionStorage/IndexedDB/Vue 状态/User.js）。
 * 2. restoreSession()：Vue 启动时调用 GET /api/user（浏览器自动携带 Cookie）；
 *    HTTP 200 恢复登录状态，HTTP 401 视为未登录并进入登录页。
 * 3. logout()：调用 POST /api/auth/logout 使 Session 失效并清除 Cookie，随后立即清除本地登录状态并回到登录页。
 */
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { getUser } from '@/api/getUser';
import { logout as requestLogout } from '@/api/logout';
import { clearUserRegistry } from '@/utils/userDisplay';

// 模块级共享状态：登录标志（布尔值），不包含 Session ID 等敏感信息。
const isLoggedIn = ref(false);
const isSessionChecked = ref(false);

export const useSession = () => {
    const router = useRouter();

    const restoreSession = async () => {
        try {
            await getUser();
            isLoggedIn.value = true;
        } catch (error) {
            isLoggedIn.value = false;
            // HTTP 401：视为未登录，进入登录页面。
            if (error && error.status === 401 && router.currentRoute.value.path !== '/login') {
                router.push('/login');
            }
        } finally {
            isSessionChecked.value = true;
        }
    };

    const markLoggedIn = () => {
        isLoggedIn.value = true;
        clearUserRegistry();
    };

    const logout = async () => {
        try {
            await requestLogout();
            isLoggedIn.value = false;
            clearUserRegistry();
            if (router.currentRoute.value.path !== '/login') {
                router.push('/login');
            }
            return true;
        } catch (error) {
            // 退出失败时保持本地登录状态，避免界面状态与后端 Session 不一致。
            message.error('退出登录失败，请稍后重试');
            return false;
        }
    };

    return {
        isLoggedIn,
        isSessionChecked,
        restoreSession,
        markLoggedIn,
        logout,
    };
};

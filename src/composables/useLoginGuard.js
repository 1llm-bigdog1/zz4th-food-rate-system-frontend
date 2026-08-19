/**
 * 文件说明：useLoginGuard.js
 * 1. 提交类操作（评分、内容提交、评论/回复提交）的登录校验守卫。
 * 2. 登录检查优先使用现有会话状态（useSession.isLoggedIn）；需要主动检查时调用 fetchCurrentUser()
 *    （内部为 getUser()）：成功 → 已登录；HTTP 401 → 未登录。
 * 3. 未登录时弹出 Ant Design Vue Modal 提示，点击“登录”跳转现有登录页。
 * 4. 开发环境无后端时由 fetchCurrentUser 返回调试用户，保证提交与评论 UI 可进行前端调试。
 */
import { useRouter } from 'vue-router';
import { Modal } from 'ant-design-vue';
import { fetchCurrentUser } from '@/utils/currentUser';
import { useSession } from '@/composables/useSession';

export const useLoginGuard = () => {
    const router = useRouter();
    const { isLoggedIn } = useSession();

    const showLoginModal = () => {
        Modal.confirm({
            title: '提示',
            content: '请先登录后再进行此操作。',
            okText: '登录',
            cancelText: '取消',
            onOk: () => router.push('/login'),
        });
    };

    const ensureLoggedIn = async () => {
        if (isLoggedIn.value) {
            return true;
        }
        try {
            // 主动复核登录状态：成功（真实或开发调试用户）→ 已登录。
            await fetchCurrentUser();
            return true;
        } catch (error) {
            // HTTP 401 等 → 未登录，弹出登录提示。
            showLoginModal();
            return false;
        }
    };

    return {
        ensureLoggedIn,
        showLoginModal,
    };
};

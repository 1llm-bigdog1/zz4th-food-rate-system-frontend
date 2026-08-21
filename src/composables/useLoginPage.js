/**
 * 文件说明：useLoginPage.js
 * 1. 这个脚本负责抽取登录页共享状态和提交逻辑，桌面端与移动端共用。
 * 2. 该文件位于 src\composables 目录下，是当前模块的重要基础脚本之一。
 * 3. altcha 为 ALTCHA 人机验证 payload，未通过验证时不允许提交登录；
 *    前端不保存、不打印密码与验证密钥。
 */
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { login } from '@/api/login';
import { useSession } from '@/composables/useSession';

export const useLoginPage = () => {
    const router = useRouter();
    const { markLoggedIn } = useSession();

    const form = ref({
        account: '',
        password: '',
        altcha: '',
    });
    const submitting = ref(false);

    const goToRegister = () => {
        router.push('/register');
    };

    const validate = () => {
        if (!form.value.account.trim()) {
            message.warning('请输入账号');
            return false;
        }
        if (!form.value.password) {
            message.warning('请输入密码');
            return false;
        }
        if (!form.value.altcha) {
            message.warning('请完成人机验证');
            return false;
        }
        return true;
    };

    const submitLogin = async () => {
        if (submitting.value || !validate()) {
            return;
        }

        submitting.value = true;
        try {
            const result = await login({
                account: form.value.account.trim(),
                password: form.value.password,
                altcha: form.value.altcha,
            });
            if (result && result.success === false) {
                message.error((result.message && String(result.message)) || '登录失败，请稍后重试');
                return;
            }
            markLoggedIn();
            message.success('登录成功');
            router.push('/');
        } catch (error) {
            const serverMessage = error && error.response && error.response.data && error.response.data.message;
            message.error(serverMessage || '登录失败，请检查网络或账号密码');
        } finally {
            submitting.value = false;
        }
    };

    return {
        form,
        submitting,
        goToRegister,
        submitLogin,
    };
};

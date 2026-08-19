/**
 * 文件说明：useLoginPage.js
 * 1. 这个脚本负责抽取登录页共享状态和提交逻辑，桌面端与移动端共用。
 * 2. 该文件位于 src\composables 目录下，是当前模块的重要基础脚本之一。
 * 3. captcha_token 仅作人机验证预留，暂不接入任何 CAPTCHA；前端不保存、不打印密码。
 */
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { login } from '@/api/login';
import { useSession } from '@/composables/useSession';

// 调试用户：命中时直接登录成功，不向后端发送数据。
const DEBUG_ACCOUNT = 'admin';
const DEBUG_PASSWORD = 'LKJ114514';

export const useLoginPage = () => {
    const router = useRouter();
    const { markLoggedIn } = useSession();

    const form = ref({
        account: '',
        password: '',
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
        return true;
    };

    const submitLogin = async () => {
        if (submitting.value || !validate()) {
            return;
        }

        if (form.value.account.trim() === DEBUG_ACCOUNT && form.value.password === DEBUG_PASSWORD) {
            markLoggedIn();
            message.success('登录成功');
            router.push('/');
            return;
        }

        submitting.value = true;
        try {
            const result = await login({
                account: form.value.account.trim(),
                password: form.value.password,
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

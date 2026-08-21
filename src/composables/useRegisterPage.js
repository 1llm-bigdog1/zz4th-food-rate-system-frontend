/**
 * 文件说明：useRegisterPage.js
 * 1. 这个脚本负责抽取注册页共享状态和提交逻辑，桌面端与移动端共用。
 * 2. 该文件位于 src\composables 目录下，是当前模块的重要基础脚本之一。
 * 3. 注册时电子邮箱可选，其余必填；altcha 为 ALTCHA 人机验证 payload，
 *    未通过验证时不允许提交注册；前端不保存、不打印密码与验证密钥。
 */
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { register } from '@/api/register';

export const useRegisterPage = () => {
    const router = useRouter();

    const form = ref({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        altcha: '',
    });
    const submitting = ref(false);

    const goToLogin = () => {
        router.push('/login');
    };

    const validate = () => {
        if (!form.value.username.trim()) {
            message.warning('请输入用户名');
            return false;
        }
        if (!form.value.password) {
            message.warning('请输入密码');
            return false;
        }
        if (!/^[A-Za-z0-9]{6,}$/.test(form.value.password)) {
            message.warning('密码需至少6位，且只能由数字和英文字母组成');
            return false;
        }
        if (!form.value.confirmPassword) {
            message.warning('请再次输入密码');
            return false;
        }
        if (form.value.password !== form.value.confirmPassword) {
            message.warning('两次输入的密码不一致');
            return false;
        }
        if (!form.value.altcha) {
            message.warning('请完成人机验证');
            return false;
        }
        return true;
    };

    const submitRegister = async () => {
        if (submitting.value || !validate()) {
            return;
        }

        submitting.value = true;
        try {
            const result = await register({
                username: form.value.username.trim(),
                email: form.value.email.trim() || null,
                password: form.value.password,
                altcha: form.value.altcha,
            });
            if (result && result.success === false) {
                message.error((result.message && String(result.message)) || '注册失败，请稍后重试');
                return;
            }
            message.success('注册成功');
            router.push('/');
        } catch (error) {
            const serverMessage = error && error.response && error.response.data && error.response.data.message;
            message.error(serverMessage || '注册失败，请检查网络或输入信息');
        } finally {
            submitting.value = false;
        }
    };

    return {
        form,
        submitting,
        goToLogin,
        submitRegister,
    };
};

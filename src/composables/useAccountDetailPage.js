/**
 * 文件说明：useAccountDetailPage.js
 * 1. 这个脚本负责抽取用户中心共享状态：页面加载时独立调用 getUser() 获取当前登录用户，
 *    桌面端与移动端共用，不依赖 GlobalHeader 传递 User。
 * 2. 该文件位于 src\composables 目录下，是当前模块的重要基础脚本之一。
 * 3. 数据源为当前 User 模型实例；HTTP 401 按项目现有未登录逻辑进入登录页；
 *    后端不可用的开发环境由 fetchCurrentUser 提供调试用户。
 */
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { fetchCurrentUser } from '@/utils/currentUser';
import { updateProfile } from '@/api/updateProfile';

const genderOptions = [
    { value: '\u7537', label: '\u7537' },
    { value: '\u5973', label: '\u5973' },
    { value: '\u4e0d\u613f\u900f\u9732', label: '\u4e0d\u613f\u900f\u9732' },
    { value: '\u81ea\u5b9a\u4e49', label: '\u81ea\u5b9a\u4e49' },
];

// 届别：2026~2030；班级：0~25（与后端校验一致）。
const sessionOptions = Array.from({ length: 5 }, (_, i) => ({
    value: String(2026 + i),
    label: `${2026 + i} 届`,
}));
const classidOptions = Array.from({ length: 26 }, (_, i) => ({
    value: String(i),
    label: `${i} 班`,
}));

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

    // 注册时间：优先 created_at（后端返回 ISO 时间），回退 register_date，避免显示 0/空。
    const displayCreatedAt = computed(() => {
        const raw = (user.value && (user.value.created_at || user.value.register_date)) || '';
        if (!raw) {
            return '-';
        }
        return String(raw).slice(0, 10);
    });
    // 等级：以后端返回为准（Lv0-Lv6，0 也是合法等级）。
    const displayLevel = computed(() => {
        const level = Number(user.value && user.value.level);
        return Number.isInteger(level) ? level : 0;
    });

    const editing = ref(false);
    const saving = ref(false);
    const profileForm = reactive({
        nickname: '',
        realname: '',
        gender: '',
        email: '',
        session: '',
        classid: '',
    });

    const startEditing = () => {
        profileForm.nickname = (user.value && user.value.nickname) || '';
        profileForm.realname = (user.value && user.value.realname) || '';
        profileForm.gender = (user.value && user.value.gender) || '';
        profileForm.email = (user.value && user.value.email) || '';
        profileForm.session = (user.value && user.value.session) || '';
        profileForm.classid = (user.value && user.value.classid) || '';
        editing.value = true;
    };

    const cancelEditing = () => {
        editing.value = false;
    };

    const saveProfile = async () => {
        if (saving.value) {
            return;
        }
        const sessionValue = String(profileForm.session || '');
        const classidValue = String(profileForm.classid || '');
        const sessionNum = Number(sessionValue.replace(/届$/, ''));
        const classNum = Number(classidValue.replace(/班$/, ''));
        if (sessionValue && !(sessionNum >= 2026 && sessionNum <= 2030)) {
            message.error('\u5c4a\u522b\u5fc5\u987b\u4e3a 2026~2030');
            return;
        }
        if (classidValue && !(Number.isInteger(classNum) && classNum >= 0 && classNum <= 25)) {
            message.error('\u73ed\u7ea7\u5fc5\u987b\u4e3a 0~25');
            return;
        }
        saving.value = true;
        try {
            const result = await updateProfile({
                ...profileForm,
                session: sessionValue ? String(sessionNum) : '',
                classid: classidValue ? String(classNum) : '',
            });
            if (result && result.success === false) {
                message.error((result.message && String(result.message)) || '资料保存失败，请稍后重试');
                return;
            }
            message.success('\u8d44\u6599\u5df2\u66f4\u65b0');
            editing.value = false;
            await loadUser();
        } catch (error) {
            const serverMessage = error && error.response && error.response.data && error.response.data.message;
            message.error(serverMessage || '\u8d44\u6599\u4fdd\u5b58\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5');
        } finally {
            saving.value = false;
        }
    };

    loadUser();

    return {
        user,
        loading,
        avatarPreview,
        avatarFallback,
        displayCreatedAt,
        displayLevel,
        loadUser,
        editing,
        saving,
        profileForm,
        genderOptions,
        sessionOptions,
        classidOptions,
        startEditing,
        cancelEditing,
        saveProfile,
    };
};

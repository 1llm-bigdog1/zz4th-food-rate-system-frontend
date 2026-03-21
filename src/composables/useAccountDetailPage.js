/**
 * 文件说明：useAccountDetailPage.js
 * 1. 这个脚本负责抽离共享状态和页面逻辑，避免桌面端与移动端重复维护同一套业务代码。
 * 2. 该文件位于 src\composables 目录下，是当前模块的重要基础脚本之一。
 * 3. 维护这类文件时，优先保证对外暴露的数据、计算属性和事件接口稳定，避免影响多个视图层。
 */
import { computed, reactive } from 'vue';

// 账户页当前还没有接口交互，所以把演示态数据集中到 composable 中，
// 方便桌面和移动端共用，也方便以后替换成真实接口。
export const useAccountDetailPage = () => {
    const genderOptions = [
        { value: '男', label: '男' },
        { value: '女', label: '女' },
        { value: '不愿透露', label: '不愿透露' },
        { value: '自定义', label: '自定义' },
    ];

    const gradYearOptions = [
        { value: '2026', label: '2026届' },
        { value: '2027', label: '2027届' },
        { value: '2028', label: '2028届' },
        { value: '2029', label: '2029届' },
    ];

    const form = reactive({
        username: 'student_2026',
        nickname: '食堂观察员',
        gender: '不愿透露',
        customGender: '',
        gradYear: undefined,
        className: '',
        realName: '',
        avatar: '',
        registerDate: '2026-01-12',
        level: 3,
        ratingCount: 128,
    });

    const avatarPreview = computed(() => form.avatar || undefined);
    const avatarFallback = computed(() => (form.nickname?.trim() || form.username?.trim() || '用').slice(0, 1));

    return {
        form,
        genderOptions,
        gradYearOptions,
        avatarPreview,
        avatarFallback,
    };
};

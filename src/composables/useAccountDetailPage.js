/**
 * 文件说明：useAccountDetailPage.js
 * 1. 这个脚本负责抽取共享状态和页面逻辑，避免桌面端与移动端重复维护同一套业务代码。
 * 2. 该文件位于 src\composables 目录下，是当前模块的重要基础脚本之一。
 * 3. 维护这类文件时，优先保证对外暴露的数据、计算属性和事件接口稳定，避免影响多个视图层。
 */
import { computed, reactive } from 'vue';
import { getCached, putRecord, STORES } from '@/db/indexedDB';

const ACCOUNT_RECORD_ID = 'current';

const createDefaultAccount = () => ({
    id: ACCOUNT_RECORD_ID,
    username: 'student_2026',
    nickname: '\u98df\u5802\u89c2\u5bdf\u5458',
    gender: '\u4e0d\u613f\u900f\u9732',
    customGender: '',
    gradYear: undefined,
    className: '',
    realName: '',
    avatar: '',
    registerDate: '2026-01-12',
    level: 3,
    ratingCount: 128,
});

export const useAccountDetailPage = () => {
    const genderOptions = [
        { value: '\u7537', label: '\u7537' },
        { value: '\u5973', label: '\u5973' },
        { value: '\u4e0d\u613f\u900f\u9732', label: '\u4e0d\u613f\u900f\u9732' },
        { value: '\u81ea\u5b9a\u4e49', label: '\u81ea\u5b9a\u4e49' },
    ];

    const gradYearOptions = [
        { value: '2026', label: '2026\u5c4a' },
        { value: '2027', label: '2027\u5c4a' },
        { value: '2028', label: '2028\u5c4a' },
        { value: '2029', label: '2029\u5c4a' },
    ];

    // 账户资料存于本地 IndexedDB（首次创建数据库时写入一条演示数据），
    // 后续保存通过 saveAccount 写回本地库；正式环境应替换为后端用户接口。
    const storedAccount =
        getCached(STORES.account).find((item) => item.id === ACCOUNT_RECORD_ID) || createDefaultAccount();

    const form = reactive({
        username: storedAccount.username,
        nickname: storedAccount.nickname,
        gender: storedAccount.gender,
        customGender: storedAccount.customGender ?? '',
        gradYear: storedAccount.gradYear ?? undefined,
        className: storedAccount.className ?? '',
        realName: storedAccount.realName ?? '',
        avatar: storedAccount.avatar ?? '',
        registerDate: storedAccount.registerDate,
        level: storedAccount.level,
        ratingCount: storedAccount.ratingCount,
    });

    const avatarPreview = computed(() => form.avatar || undefined);
    const avatarFallback = computed(() => (form.nickname?.trim() || form.username?.trim() || '\u7528').slice(0, 1));

    const saveAccount = async () => {
        await putRecord(STORES.account, { ...form, id: ACCOUNT_RECORD_ID });
    };

    return {
        form,
        genderOptions,
        gradYearOptions,
        avatarPreview,
        avatarFallback,
        saveAccount,
    };
};

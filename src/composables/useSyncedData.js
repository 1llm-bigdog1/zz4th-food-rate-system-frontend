/**
 * 文件说明：useSyncedData.js
 * 1. 页面数据接入增量同步的共享逻辑：挂载时调用对应同步 API（如 getMenu/getAdvice），
 *    由 syncEngine 将结果写入 IndexedDB 缓存，再把 ref 重新绑定到缓存数组以触发视图刷新。
 * 2. 该文件位于 src\composables 目录下，供列表/详情等页面 composable 复用，避免重复实现。
 */
import { onMounted, ref } from 'vue';
import { getCached } from '@/db/indexedDB';

export const useSyncedData = (storeName, syncFn) => {
    const data = ref(getCached(storeName));

    onMounted(async () => {
        try {
            await syncFn();
        } finally {
            // 同步完成后重新绑定缓存数组（同一底层数组），确保视图显示同步后的数据。
            data.value = getCached(storeName);
        }
    });

    return {
        data,
    };
};

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

    // 重新读取缓存并绑定新数组副本，强制视图刷新（提交后直接同步数据时使用）。
    const reload = () => {
        data.value = getCached(storeName).slice();
    };

    onMounted(async () => {
        try {
            await syncFn();
        } catch (error) {
            // 同步失败时保留本地缓存数据，不抛出，避免触发全局错误页。
        } finally {
            // 同步完成后重新绑定缓存数组的“副本”：
            // 直接绑定同一数组引用时 Vue 无法感知原地增删，视图会停留在旧数据
            // （例如审核通过的新内容不显示、列表残留种子数据）。
            reload();
        }
    });

    return {
        data,
        reload,
    };
};

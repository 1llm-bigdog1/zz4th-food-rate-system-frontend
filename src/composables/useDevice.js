/**
 * 文件说明：useDevice.js
 * 1. 这个脚本负责抽离共享状态和页面逻辑，避免桌面端与移动端重复维护同一套业务代码。
 * 2. 该文件位于 src\composables 目录下，是当前模块的重要基础脚本之一。
 * 3. 维护这类文件时，优先保证对外暴露的数据、计算属性和事件接口稳定，避免影响多个视图层。
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const MOBILE_BREAKPOINT = 768;

export const useDevice = () => {
    const width = ref(typeof window !== 'undefined' ? window.innerWidth : MOBILE_BREAKPOINT);

    const updateWidth = () => {
        width.value = window.innerWidth;
    };

    onMounted(() => {
        updateWidth();
        window.addEventListener('resize', updateWidth);
    });

    onBeforeUnmount(() => {
        window.removeEventListener('resize', updateWidth);
    });

    const isMobile = computed(() => width.value < MOBILE_BREAKPOINT);

    return {
        width,
        isMobile,
    };
};

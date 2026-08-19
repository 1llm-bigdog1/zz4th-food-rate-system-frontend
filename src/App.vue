<!--
  文件说明：App.vue
  1. 这是 Vue 单文件组件，用于组织模板、脚本和样式。
  2. 该文件位于 src 目录下，和同层文件一起构成当前功能模块的视图或结构层。
  3. 文件中的脚本、模板和样式会围绕同一职责组织，便于后续维护时快速定位问题。
-->
<template>
  <div id="app">
    <!-- 根组件只负责承载全局布局，具体页面由 BasicLayout 内部 router-view 渲染。 -->
    <BasicLayout />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import BasicLayout from './layouts/BasicLayout.vue';
import { useSession } from '@/composables/useSession';

const { restoreSession } = useSession();

onMounted(() => {
    // 启动时恢复登录状态：GET /api/user 携带 Session Cookie，HTTP 401 视为未登录并进入登录页。
    restoreSession();
});
</script>

<style>
#app {
    --google-blue: #1a73e8;
    --google-blue-hover: #1765cc;
    --google-surface: #ffffff;
    --google-surface-muted: #f8f9fa;
    --google-border: #dadce0;
    --google-text: #3c4043;
    --google-subtle-text: #5f6368;
    --google-shadow: 0 1px 2px rgba(60, 64, 67, 0.16), 0 1px 3px 1px rgba(60, 64, 67, 0.08);
    --google-shadow-hover: 0 2px 6px 2px rgba(60, 64, 67, 0.16), 0 1px 2px rgba(60, 64, 67, 0.2);
    --google-focus-ring: 0 0 0 4px rgba(26, 115, 232, 0.14);
}

#app :is(.ant-btn, .see-more-button, .search-trigger-btn, .search-enter-btn, .next-btn) {
    height: auto;
    min-height: 32px;
    padding: 6px 14px;
    border-radius: 999px !important;
    border: 1px solid var(--google-border) !important;
    background: var(--google-surface) !important;
    color: var(--google-text) !important;
    box-shadow: var(--google-shadow) !important;
    font-weight: 500;
    font-size: 13px;
    line-height: 1.2;
    transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

#app :is(.ant-btn, .see-more-button, .search-trigger-btn, .search-enter-btn, .next-btn):hover,
#app :is(.ant-btn, .see-more-button, .search-trigger-btn, .search-enter-btn, .next-btn):focus {
    border-color: #c6cacf !important;
    background: var(--google-surface-muted) !important;
    color: var(--google-text) !important;
    box-shadow: var(--google-shadow-hover) !important;
}

#app :is(.ant-btn-primary, .search-trigger-btn, .search-enter-btn, .next-btn) {
    border-color: var(--google-blue) !important;
    background: var(--google-blue) !important;
    color: #fff !important;
}

#app :is(.ant-btn-primary, .search-trigger-btn, .search-enter-btn, .next-btn):hover,
#app :is(.ant-btn-primary, .search-trigger-btn, .search-enter-btn, .next-btn):focus {
    border-color: var(--google-blue-hover) !important;
    background: var(--google-blue-hover) !important;
    color: #fff !important;
}

#app .ant-btn-dangerous {
    border-color: #d93025 !important;
    background: #d93025 !important;
    color: #fff !important;
}

#app .ant-btn-dangerous:hover,
#app .ant-btn-dangerous:focus {
    border-color: #b3261e !important;
    background: #b3261e !important;
    color: #fff !important;
}

#app :is(.ant-btn-link, .ant-btn-text) {
    border-color: transparent !important;
    background: transparent !important;
    color: var(--google-blue) !important;
    box-shadow: none !important;
}

#app :is(.ant-btn-link, .ant-btn-text):hover,
#app :is(.ant-btn-link, .ant-btn-text):focus {
    background: rgba(26, 115, 232, 0.08) !important;
    color: var(--google-blue-hover) !important;
    box-shadow: none !important;
}

#app .search-enter-btn {
    min-width: 46px;
    padding: 6px 10px !important;
}

#app :is(.ant-input, .ant-input-affix-wrapper, .ant-input-number, .ant-input-number-affix-wrapper, .ant-select-selector, .ant-picker) {
    min-height: 40px;
    border-radius: 12px !important;
    border-color: var(--google-border) !important;
    box-shadow: none !important;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

#app :is(.ant-input, .ant-input-affix-wrapper, .ant-input-number, .ant-input-number-affix-wrapper, .ant-picker) {
    padding-top: 0;
    padding-bottom: 0;
    background: var(--google-surface) !important;
    color: var(--google-text) !important;
}

#app :is(.ant-input:hover, .ant-input-affix-wrapper:hover, .ant-input-number:hover, .ant-input-number-affix-wrapper:hover, .ant-select:not(.ant-select-disabled):hover .ant-select-selector, .ant-picker:hover) {
    border-color: #c6cacf !important;
}

#app :is(.ant-input:focus, .ant-input-focused, .ant-input-affix-wrapper-focused, .ant-input-number-focused, .ant-picker-focused, .ant-select-focused .ant-select-selector) {
    border-color: var(--google-blue) !important;
    box-shadow: var(--google-focus-ring) !important;
}

#app .ant-select-selector {
    display: flex !important;
    align-items: center !important;
    padding: 0 12px !important;
    background: var(--google-surface) !important;
}

#app .ant-select-single .ant-select-selector {
    height: 40px !important;
}

#app .ant-select-single .ant-select-selector .ant-select-selection-search,
#app .ant-select-single .ant-select-selector .ant-select-selection-item,
#app .ant-select-single .ant-select-selector .ant-select-selection-placeholder {
    display: flex;
    align-items: center;
    height: 100%;
    line-height: 1;
}

#app .ant-select-selection-placeholder,
#app .ant-input::placeholder,
#app .ant-input-number input::placeholder,
#app textarea::placeholder {
    color: #80868b !important;
}

#app .ant-pagination {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
}

#app .ant-pagination .ant-pagination-item,
#app .ant-pagination .ant-pagination-prev,
#app .ant-pagination .ant-pagination-next,
#app .ant-pagination .ant-pagination-options .ant-select-selector {
    border-radius: 999px !important;
}

#app .ant-pagination .ant-pagination-item,
#app .ant-pagination .ant-pagination-prev,
#app .ant-pagination .ant-pagination-next {
    min-width: 32px;
    height: 32px;
    line-height: 30px;
    border-color: transparent;
    background: var(--google-surface);
    transition: background-color 0.2s ease, box-shadow 0.2s ease, color 0.2s ease;
}

#app .ant-pagination .ant-pagination-item:hover,
#app .ant-pagination .ant-pagination-prev:hover,
#app .ant-pagination .ant-pagination-next:hover {
    background: #eef3fd;
    box-shadow: var(--google-shadow);
}

#app .ant-pagination .ant-pagination-item-active {
    border-color: transparent;
    background: #e8f0fe;
}

#app .ant-pagination .ant-pagination-item-active a {
    color: var(--google-blue);
    font-weight: 600;
}

#app .ant-pagination .ant-pagination-options {
    margin-inline-start: 4px;
}

#app .ant-select-dropdown,
#app .ant-picker-dropdown {
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(60, 64, 67, 0.18);
}

#app .ant-select-item-option-selected {
    background: #e8f0fe !important;
    color: var(--google-blue) !important;
}

#app textarea.ant-input {
    min-height: 96px;
    padding: 10px 12px;
}
</style>

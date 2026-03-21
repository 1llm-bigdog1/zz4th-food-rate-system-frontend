<!--
  文件说明：MobilePageShell.vue
  1. 这是可复用组件文件，用于为多个页面提供统一的界面片段和交互外壳。
  2. 该文件位于 src\components\mobile 目录下，和同层文件一起构成当前功能模块的视图或结构层。
  3. 文件中的脚本、模板和样式会围绕同一职责组织，便于后续维护时快速定位问题。
-->
<template>
    <div class="mobile-page-shell">
        <header v-if="title || subtitle" class="mobile-page-header">
            <h1 v-if="title" class="mobile-page-title">{{ title }}</h1>
            <p v-if="subtitle" class="mobile-page-subtitle">{{ subtitle }}</p>
        </header>
        <div class="mobile-page-content">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    name: 'MobilePageShell',
    props: {
        title: { type: String, default: '' },
        subtitle: { type: String, default: '' },
    },
};
</script>

<style scoped>
.mobile-page-shell {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.mobile-page-header {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.mobile-page-title {
    margin: 0;
    color: #202124;
    font-family: 'Noto Serif SC', 'Microsoft YaHei', serif;
    font-size: 24px;
    font-weight: 800;
    line-height: 1.2;
}

.mobile-page-subtitle {
    margin: 0;
    color: #5f6368;
    font-size: 13px;
    line-height: 1.5;
}

.mobile-page-content {
    display: flex;
    flex-direction: column;
    gap: 14px;
}
</style>

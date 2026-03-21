<!--
  文件说明：GlobalHeader.vue
  1. 这是可复用组件文件，用于为多个页面提供统一的界面片段和交互外壳。
  2. 该文件位于 src\components 目录下，和同层文件一起构成当前功能模块的视图或结构层。
  3. 如果这个文件同时承担入口职责，它通常只负责装配其它视图或共享逻辑，而不重复实现业务规则。
-->
<template>
    <GlobalHeaderMobile v-if="isMobile" />
    <GlobalHeaderDesktop v-else />
</template>

<script setup>
import GlobalHeaderDesktop from '@/components/GlobalHeaderDesktop.vue';
import GlobalHeaderMobile from '@/components/GlobalHeaderMobile.vue';
import { useDevice } from '@/composables/useDevice';

const { isMobile } = useDevice();
</script>

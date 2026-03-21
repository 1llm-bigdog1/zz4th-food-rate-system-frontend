<!--
  文件说明：SuggestionDetail.vue
  1. 这是页面级单文件组件，用于承接路由页面或页面入口层的展示职责。
  2. 该文件位于 src\pages\suggestions 目录下，和同层文件一起构成当前功能模块的视图或结构层。
  3. 如果这个文件同时承担入口职责，它通常只负责装配其它视图或共享逻辑，而不重复实现业务规则。
-->
<template>
    <SuggestionDetailMobile v-if="isMobile" />
    <SuggestionDetailDesktop v-else />
</template>

<script setup>
import SuggestionDetailDesktop from '@/pages/suggestions/SuggestionDetailDesktop.vue';
import SuggestionDetailMobile from '@/pages/suggestions/SuggestionDetailMobile.vue';
import { useDevice } from '@/composables/useDevice';

const { isMobile } = useDevice();
</script>

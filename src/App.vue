<template>
  <div id="app">
    <!-- 根组件只负责承载全局布局，具体页面由 BasicLayout 内部 router-view 渲染。 -->
    <BasicLayout />
  </div>
</template>

<script setup>
import BasicLayout from './layouts/BasicLayout.vue';
</script>

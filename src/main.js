/**
 * 文件说明：main.js
 * 1. 这个脚本是应用启动入口，负责挂载应用实例并注册全局依赖。
 * 2. 该文件位于 src 目录下，是当前模块的重要基础脚本之一。
 * 3. 维护这类文件时，应优先关注它和其它模块之间的依赖关系，避免改动牵连过大。
 */
import { createApp } from 'vue';
import App from './App.vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import router from './router';

// 应用入口：统一挂载 UI 库与路由。
createApp(App)
	.use(Antd)
	.use(router)
	.mount('#app');

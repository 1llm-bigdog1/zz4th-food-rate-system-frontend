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

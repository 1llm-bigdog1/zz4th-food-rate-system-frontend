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
import { clearTestData, initLocalData } from '@/db/indexedDB';
import { setDebugReviewStatus } from '@/api/submitContentForReview';

// 开发环境暴露测试数据清理入口，便于在浏览器控制台验证：
// 调用 window.__LOCAL_DB.clearTestData() 只会删除首次初始化写入的测试数据。
if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
    window.__LOCAL_DB = { clearTestData };
    // 开发调试：模拟审核结果 approved / rejected / pending。
    window.__REVIEW_DEBUG = { setStatus: setDebugReviewStatus };
}

// 应用入口：统一挂载 UI 库与路由。
// 先初始化本地 IndexedDB（首次创建时写入测试数据），再挂载应用。
initLocalData().finally(() => {
    const app = createApp(App)
        .use(Antd)
        .use(router);
    let errorPageNavigated = false;
    app.config.errorHandler = (error) => {
        // axios 错误已由 src/api/client.js 拦截器按状态码导航（403/5xx/网络错误）或
        // 由登录恢复/守卫处理（401），此处不再覆盖为 /500。
        if (error && error.isAxiosError) {
            return;
        }
        if (!errorPageNavigated) {
            errorPageNavigated = true;
            router.push('/500');
        }
    };
    app.mount('#app');
});

<!--
  文件说明：BasicLayout.vue
  1. 这是布局层组件文件，用于组织全站页面的公共结构和骨架区域。
  2. 该文件位于 src\layouts 目录下，和同层文件一起构成当前功能模块的视图或结构层。
  3. 文件中的脚本、模板和样式会围绕同一职责组织，便于后续维护时快速定位问题。
-->
<template>
    <div id="basic-layout">
        <a-layout>
            <!-- 顶部全局导航 -->
            <a-layout-header class="header">
                <global-header />
            </a-layout-header>

            <!-- 页面主内容：由路由渲染 -->
            <a-layout-content class="content">
                <router-view />
            </a-layout-content>

            <!-- 全站页脚 -->
            <a-layout-footer class="footer">
                <div class="footer-inner">
                    <div class="footer-side">{{ text.schoolName }}</div>
                    <div class="footer-center">
                        <p>&copy; 2026 {{ text.systemName }}</p>
                        <div class="footer-links">
                            <a href="#">{{ text.privacyPolicy }}</a>
                            <a href="#">{{ text.termsOfService }}</a>
                            <a href="#">{{ text.contactUs }}</a>
                        </div>
                    </div>
                    <div class="footer-side">
                        <p>{{ text.disclaimerLine1 }}</p>
                        <p>{{ text.disclaimerLine2 }}</p>
                    </div>
                </div>
            </a-layout-footer>
        </a-layout>

        <!-- 回到顶部按钮 -->
        <div id="components-back-top-demo-custom">
            <a-back-top>
                <div class="ant-back-top-inner">{{ text.backToTop }}</div>
            </a-back-top>
        </div>
    </div>
</template>

<script>
import GlobalHeader from '@/components/GlobalHeader.vue';
import { basicLayoutText as text } from '@/models/text';

export default {
    name: 'BasicLayout',
    components: {
        GlobalHeader,
    },
    data() {
        return {
            text,
        };
    },
};
</script>

<style scoped>
#basic-layout .footer {
    background-color: white;
    border-top: 1px solid #e5e7eb;
    padding: 18px 16px;
    color: #6b7280;
    font-size: 14px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 20;
}

/* 页脚三栏：左说明 / 中主信息 / 右说明 */
#basic-layout .footer-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

#basic-layout .footer-center {
    flex: 1;
    text-align: center;
    line-height: 1.6;
}

#basic-layout .footer-links {
    display: flex;
    justify-content: center;
    gap: 16px;
}

#basic-layout .footer-links a {
    color: #6b7280;
    text-decoration: none;
    transition: color 0.2s ease;
}

#basic-layout .footer-links a:hover {
    color: #374151;
}

#basic-layout .footer-side {
    width: 180px;
}

/* 给内容区预留空间，避免被页脚视觉压缩 */
#basic-layout .content {
    padding: 24px;
    padding-bottom: 96px;
}

#basic-layout .header {
    background-color: white;
    color: unset;
    padding-inline: 20px;
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

/* 回顶按钮上移，避免与页脚重叠 */
#components-back-top-demo-custom .ant-back-top {
    bottom: 100px;
}

#components-back-top-demo-custom .ant-back-top-inner {
    height: 40px;
    width: 40px;
    line-height: 40px;
    border-radius: 4px;
    background-color: #1088e9;
    color: #fff;
    text-align: center;
    font-size: 20px;
}

@media (max-width: 768px) {
    #basic-layout .footer {
        padding: 14px 12px;
    }

    #basic-layout .footer-side {
        display: none;
    }

    #basic-layout .footer-links {
        gap: 12px;
        flex-wrap: wrap;
    }
}
</style>

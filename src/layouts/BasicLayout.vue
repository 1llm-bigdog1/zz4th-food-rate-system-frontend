<template>
    <div id="basic-layout">
        <a-layout>
            <!-- 顶部全局导航 -->
            <a-layout-header class="header">
                <global-header position="fixed"></global-header>
            </a-layout-header>
            <!-- 页面主内容渲染区域 -->
            <a-layout-content class="content">
                <router-view></router-view>
            </a-layout-content>
            <!-- 全站页脚（固定在窗口底部） -->
            <a-layout-footer class="footer">
                <div class="footer-inner">
                    <div class="footer-side">郑州市第四高级中学·食</div>
                    <div class="footer-center">
                        <p>&copy; 2026 郑州市第四高级中学菜品评分系统</p>
                        <div class="footer-links">
                            <a href="#">隐私政策</a>
                            <a href="#">服务条款</a>
                            <a href="#">联系我们</a>
                        </div>
                    </div>
                    <div class="footer-side">
                        <p>此系统非学校官方开发</p>
                        <p>由学生开发，仅供参考</p>
                    </div>
                </div>
            </a-layout-footer>
        </a-layout>
        <div id="components-back-top-demo-custom">
            <a-back-top>
                <div class="ant-back-top-inner">UP</div>
            </a-back-top>
        </div>
    </div>
</template>

<script>
import GlobalHeader from '@/components/GlobalHeader.vue';

export default {
    name: 'BasicLayout',
    components: {
        GlobalHeader,
    },
};
</script>

<style scoped>
/* 固定页脚，始终贴底显示 */
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

/* 页脚三栏布局：左侧说明 / 中间主信息 / 右侧占位 */
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

/* 给内容区预留空间，避免被固定页脚遮挡 */
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

/* 回到顶部按钮上移，避免与固定页脚重叠 */
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

<template>
    <div id="GlobalHeader">
        <div class="header-inner">
            <router-link to="/" class="brand-link">
                <img :src="badgeLogo" alt="校徽" class="brand-logo" />
                <span class="brand-title">郑州市第四高级中学菜品评分系统</span>
            </router-link>
            <a-menu v-model:selectedKeys="current" mode="horizontal" class="header-menu">
                <a-menu-item key="dishOverview">
                    <template #icon>
                        <appstore-outlined />
                    </template>
                    菜品总览
                </a-menu-item>
                <a-menu-item key="rating">
                    <template #icon>
                        <star-outlined />
                    </template>
                    我要评分
                </a-menu-item>
                <a-menu-item key="rank">
                    <template #icon>
                        <trophy-outlined />
                    </template>
                    评分排行榜
                </a-menu-item>
                <a-menu-item key="selection">
                    <template #icon>
                        <crown-outlined />
                    </template>
                    老吃家严选
                </a-menu-item>
                <a-menu-item key="newSuggestion">
                    <template #icon>
                        <bulb-outlined />
                    </template>
                    新品建议
                </a-menu-item>
                <a-menu-item key="canteenFeedback">
                    <template #icon>
                        <message-outlined />
                    </template>
                    食堂意见
                </a-menu-item>
                <a-menu-item key="dishManage">
                    <template #icon>
                        <setting-outlined />
                    </template>
                    菜品管理
                </a-menu-item>
            </a-menu>
            <a-avatar size="large" class="header-avatar">
                <template #icon>
                    <UserOutlined />
                </template>
            </a-avatar>
        </div>
    </div>
</template>

<script>
import { UserOutlined } from '@ant-design/icons-vue';
import { defineComponent, ref } from 'vue';
import { StarOutlined, AppstoreOutlined, TrophyOutlined, CrownOutlined, BulbOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons-vue';
import badgeLogo from '../static/badge.png';

export default defineComponent({
    setup() {
        const current = ref(['mail']);
        return {
            current,
            badgeLogo,
        };
    },
    components: {
        StarOutlined,
        AppstoreOutlined,
        TrophyOutlined,
        CrownOutlined,
        BulbOutlined,
        MessageOutlined,
        SettingOutlined,
        UserOutlined,
    },
});
</script>

<style scoped>
#GlobalHeader .header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
}

#GlobalHeader .brand-link {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    min-width: 0;
    flex-shrink: 0;
}

#GlobalHeader .brand-logo {
    width: 36px;
    height: 36px;
    object-fit: contain;
    margin-right: 10px;
}

#GlobalHeader .brand-title {
    color: #1f1f1f;
    font-family: 'Noto Serif SC', 'Microsoft YaHei', serif;
    font-weight: 700;
    font-size: 18px;
    letter-spacing: 0.5px;
    white-space: nowrap;
}

#GlobalHeader .header-menu {
    flex: 1;
    min-width: 0;
}

#GlobalHeader .header-avatar {
    margin-left: 16px;
    flex-shrink: 0;
}

@media (max-width: 960px) {
    #GlobalHeader .brand-title {
        font-size: 15px;
    }

    #GlobalHeader .brand-logo {
        width: 30px;
        height: 30px;
        margin-right: 8px;
    }
}
</style>

<template>
    <div id="GlobalHeader">
        <div class="header-inner">
            <router-link to="/" class="brand-link">
                <img :src="badgeLogo" alt="logo" class="brand-logo" />
                <span class="brand-title">{{ text.brandTitle }}</span>
            </router-link>
            <a-menu v-model:selectedKeys="current" mode="horizontal" class="header-menu">
                <a-menu-item key="dishOverview">
                    <template #icon>
                        <appstore-outlined />
                    </template>
                    <router-link to="/dishes">{{ text.dishOverview }}</router-link>
                </a-menu-item>
                <a-menu-item key="rating">
                    <template #icon>
                        <star-outlined />
                    </template>
                    {{ text.rating }}
                </a-menu-item>
                <a-menu-item key="rank">
                    <template #icon>
                        <trophy-outlined />
                    </template>
                    {{ text.rank }}
                </a-menu-item>
                <a-menu-item key="selection">
                    <template #icon>
                        <crown-outlined />
                    </template>
                    {{ text.selection }}
                </a-menu-item>
                <a-menu-item key="newSuggestion">
                    <template #icon>
                        <bulb-outlined />
                    </template>
                    {{ text.newSuggestion }}
                </a-menu-item>
                <a-menu-item key="canteenFeedback">
                    <template #icon>
                        <message-outlined />
                    </template>
                    {{ text.canteenFeedback }}
                </a-menu-item>
                <a-menu-item key="dishManage">
                    <template #icon>
                        <setting-outlined />
                    </template>
                    {{ text.dishManage }}
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
import { defineComponent, ref } from 'vue';
import { UserOutlined } from '@ant-design/icons-vue';
import {
    StarOutlined,
    AppstoreOutlined,
    TrophyOutlined,
    CrownOutlined,
    BulbOutlined,
    MessageOutlined,
    SettingOutlined,
} from '@ant-design/icons-vue';
import badgeLogo from '../static/badge.png';

export default defineComponent({
    setup() {
        const current = ref(['dishOverview']);
        const text = {
            brandTitle: '\u90d1\u5dde\u5e02\u7b2c\u56db\u9ad8\u7ea7\u4e2d\u5b66\u83dc\u54c1\u8bc4\u5206\u7cfb\u7edf',
            dishOverview: '\u83dc\u54c1\u603b\u89c8',
            rating: '\u6211\u8981\u8bc4\u5206',
            rank: '\u8bc4\u5206\u6392\u884c\u699c',
            selection: '\u8001\u5403\u5bb6\u4e25\u9009',
            newSuggestion: '\u65b0\u54c1\u5efa\u8bae',
            canteenFeedback: '\u98df\u5802\u610f\u89c1',
            dishManage: '\u83dc\u54c1\u7ba1\u7406',
        };
        return {
            current,
            text,
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

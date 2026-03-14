<template>
    <div id="GlobalHeader">
        <div class="header-inner">
            <router-link to="/" class="brand-link">
                <img :src="badgeLogo" alt="logo" class="brand-logo" />
                <span class="brand-title">{{ text.brandTitle }}</span>
            </router-link>

            <a-menu v-model:selectedKeys="current" mode="horizontal" class="header-menu">
                <!-- 菜单项使用配置驱动，避免重复模板 -->
                <a-menu-item v-for="item in menuItems" :key="item.key">
                    <template #icon>
                        <component :is="item.icon" />
                    </template>
                    <router-link v-if="item.to" :to="item.to">{{ item.label }}</router-link>
                    <span v-else>{{ item.label }}</span>
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

<script setup>
import { ref } from 'vue';
import {
    AppstoreOutlined,
    BulbOutlined,
    CrownOutlined,
    MessageOutlined,
    SettingOutlined,
    StarOutlined,
    TrophyOutlined,
    UserOutlined,
} from '@ant-design/icons-vue';
import badgeLogo from '@/static/badge.png';
import { globalHeaderText as text } from '@/models/text';

const current = ref(['dishOverview']);

const menuItems = [
    { key: 'dishOverview', label: text.dishOverview, icon: AppstoreOutlined, to: '/dishes' },
    { key: 'rating', label: text.rating, icon: StarOutlined, to: null },
    { key: 'rank', label: text.rank, icon: TrophyOutlined, to: '/rating-detail' },
    { key: 'selection', label: text.selection, icon: CrownOutlined, to: '/selectionlist' },
    { key: 'newSuggestion', label: text.newSuggestion, icon: BulbOutlined, to: '/advice-list' },
    { key: 'canteenFeedback', label: text.canteenFeedback, icon: MessageOutlined, to: '/suggestion-list' },
    { key: 'dishManage', label: text.dishManage, icon: SettingOutlined, to: null },
];
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

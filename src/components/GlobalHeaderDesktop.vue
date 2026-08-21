<!--
  文件说明：GlobalHeaderDesktop.vue
  1. 这是桌面端视图文件，负责在大屏设备中保留更高信息密度的排版结构。
  2. 该文件位于 src\components 目录下，和同层文件一起构成当前功能模块的视图或结构层。
  3. 文件中的脚本、模板和样式会围绕同一职责组织，便于后续维护时快速定位问题。
-->
<template>
    <div id="GlobalHeaderDesktop">
        <div class="header-inner">
            <router-link to="/" class="brand-link">
                <img :src="badgeLogo" alt="logo" class="brand-logo" />
                <span class="brand-title">{{ text.brandTitle }}</span>
            </router-link>

            <a-menu v-model:selectedKeys="current" mode="horizontal" class="header-menu">
                <a-menu-item v-for="item in menuItems" :key="item.key">
                    <template #icon>
                        <component :is="item.icon" />
                    </template>
                    <router-link v-if="item.to" :to="item.to">{{ item.label }}</router-link>
                    <span v-else>{{ item.label }}</span>
                </a-menu-item>
            </a-menu>

            <a-dropdown>
                <a-avatar size="large" class="header-avatar" :src="avatarPath || undefined">
                    <template #icon>
                        <UserOutlined />
                    </template>
                </a-avatar>
                <template #overlay>
                    <a-menu v-if="isLoggedIn">
                        <a-menu-item key="account" @click="goToAccount">个人中心</a-menu-item>
                        <a-menu-item key="logout" @click="handleLogout">退出登录</a-menu-item>
                    </a-menu>
                    <a-menu v-else>
                        <a-menu-item key="login" @click="goToLogin">登录</a-menu-item>
                        <a-menu-item key="register" @click="goToRegister">注册</a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import {
    AppstoreOutlined,
    BulbOutlined,
    CrownOutlined,
    HeartOutlined,
    MessageOutlined,
    SettingOutlined,
    TrophyOutlined,
    UserOutlined,
} from '@ant-design/icons-vue';
import badgeLogo from '@/static/badge.png';
import { globalHeaderText as text } from '@/models/text';
import { useGlobalHeader } from '@/composables/useGlobalHeader';

const current = ref(['dishOverview']);
const { isLoggedIn, avatarPath, goToLogin, goToRegister, goToAccount, handleLogout } = useGlobalHeader();

const menuItems = [
    { key: 'dishOverview', label: text.dishOverview, icon: AppstoreOutlined, to: '/dishes' },
    { key: 'rank', label: text.rank, icon: TrophyOutlined, to: '/rating-detail' },
    { key: 'selection', label: text.selection, icon: CrownOutlined, to: '/selectionlist' },
    { key: 'newSuggestion', label: text.newSuggestion, icon: BulbOutlined, to: '/advice-list' },
    { key: 'canteenFeedback', label: text.canteenFeedback, icon: MessageOutlined, to: '/suggestion-list' },
    { key: 'dishManage', label: text.dishManage, icon: SettingOutlined, to: '/admin' },
    { key: 'sponsor', label: text.sponsor, icon: HeartOutlined, to: '/sponsor' },
];
</script>

<style scoped>
.header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
}

.brand-link {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    min-width: 0;
    flex-shrink: 0;
}

.brand-logo {
    width: 36px;
    height: 36px;
    object-fit: contain;
    margin-right: 10px;
}

.brand-title {
    color: #1f1f1f;
    font-family: 'Noto Serif SC', 'Microsoft YaHei', serif;
    font-weight: 700;
    font-size: 18px;
    letter-spacing: 0.5px;
    white-space: nowrap;
}

.header-menu {
    flex: 1;
    min-width: 0;
}

.header-avatar {
    margin-left: 16px;
    flex-shrink: 0;
}
</style>

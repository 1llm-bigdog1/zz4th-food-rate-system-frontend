<!--
  文件说明：GlobalHeaderMobile.vue
  1. 这是移动端视图文件，负责在小屏设备中提供更紧凑的布局与交互展示。
  2. 该文件位于 src\components 目录下，和同层文件一起构成当前功能模块的视图或结构层。
  3. 文件中的脚本、模板和样式会围绕同一职责组织，便于后续维护时快速定位问题。
-->
<template>
    <div id="GlobalHeaderMobile">
        <div class="mobile-header">
            <router-link to="/" class="brand-link">
                <img :src="badgeLogo" alt="logo" class="brand-logo" />
                <span class="brand-title">{{ text.systemName }}</span>
            </router-link>

            <a-button type="text" class="menu-button" @click="open = true">
                <menu-outlined />
            </a-button>
        </div>

        <a-drawer v-model:open="open" placement="right" :closable="false" width="82vw" class="mobile-drawer">
            <div class="drawer-top">
                <div class="drawer-brand">{{ text.brandTitle }}</div>
                <a-button type="text" @click="open = false">
                    <close-outlined />
                </a-button>
            </div>

            <div class="drawer-nav">
                <router-link
                    v-for="item in menuItems"
                    :key="item.key"
                    :to="item.to || $route.fullPath"
                    class="drawer-link"
                    @click="open = false"
                >
                    <component :is="item.icon" />
                    <span>{{ item.label }}</span>
                </router-link>
            </div>
        </a-drawer>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import {
    AppstoreOutlined,
    BulbOutlined,
    CloseOutlined,
    CrownOutlined,
    MenuOutlined,
    MessageOutlined,
    SettingOutlined,
    StarOutlined,
    TrophyOutlined,
} from '@ant-design/icons-vue';
import badgeLogo from '@/static/badge.png';
import { basicLayoutText, globalHeaderText } from '@/models/text';

const open = ref(false);

const text = {
    ...globalHeaderText,
    systemName: basicLayoutText.systemName,
};

const menuItems = [
    { key: 'dishOverview', label: text.dishOverview, icon: AppstoreOutlined, to: '/dishes' },
    { key: 'rating', label: text.rating, icon: StarOutlined, to: null },
    { key: 'rank', label: text.rank, icon: TrophyOutlined, to: '/rating-detail' },
    { key: 'selection', label: text.selection, icon: CrownOutlined, to: '/selectionlist' },
    { key: 'newSuggestion', label: text.newSuggestion, icon: BulbOutlined, to: '/advice-list' },
    { key: 'canteenFeedback', label: text.canteenFeedback, icon: MessageOutlined, to: '/suggestion-list' },
    { key: 'dishManage', label: text.dishManage, icon: SettingOutlined, to: '/dishes-management' },
];
</script>

<style scoped>
.mobile-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.brand-link {
    display: inline-flex;
    align-items: center;
    min-width: 0;
    text-decoration: none;
}

.brand-logo {
    width: 32px;
    height: 32px;
    margin-right: 8px;
}

.brand-title {
    color: #202124;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.3;
}

.drawer-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 20px;
}

.drawer-brand {
    color: #202124;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.5;
}

.drawer-nav {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.drawer-link {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 44px;
    padding: 0 14px;
    border-radius: 14px;
    color: #202124;
    text-decoration: none;
    background: #f8f9fa;
}
</style>

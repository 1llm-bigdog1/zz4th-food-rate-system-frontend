<!--
  文件说明：MobileDishCard.vue
  1. 这是可复用组件文件，用于为多个页面提供统一的界面片段和交互外壳。
  2. 该文件位于 src\components\mobile 目录下，和同层文件一起构成当前功能模块的视图或结构层。
  3. 文件中的脚本、模板和样式会围绕同一职责组织，便于后续维护时快速定位问题。
-->
<template>
    <a-card class="mobile-dish-card" :bordered="false">
        <div class="mobile-dish-top">
            <img :src="image" :alt="name" class="mobile-dish-image" />
            <div class="mobile-dish-main">
                <div class="mobile-dish-name">{{ name }}</div>
                <div class="mobile-dish-position">{{ position }}</div>
                <div class="mobile-dish-meta">
                    <span class="mobile-dish-price">{{ priceLabel }}</span>
                    <span v-if="typeof rate === 'number'" class="mobile-dish-rate">{{ rateLabel }}</span>
                </div>
            </div>
        </div>
        <div v-if="$slots.actions" class="mobile-dish-actions">
            <slot name="actions" />
        </div>
    </a-card>
</template>

<script>
export default {
    name: 'MobileDishCard',
    props: {
        name: { type: String, required: true },
        position: { type: String, default: '' },
        image: { type: String, default: '' },
        priceLabel: { type: String, default: '' },
        rateLabel: { type: String, default: '' },
        rate: { type: Number, default: undefined },
    },
};
</script>

<style scoped>
.mobile-dish-card {
    border-radius: 20px;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
}

.mobile-dish-top {
    display: flex;
    gap: 12px;
    align-items: flex-start;
}

.mobile-dish-image {
    width: 88px;
    height: 88px;
    object-fit: cover;
    border-radius: 16px;
    background: #f1f3f4;
}

.mobile-dish-main {
    min-width: 0;
    flex: 1;
}

.mobile-dish-name {
    color: #202124;
    font-size: 17px;
    font-weight: 700;
    line-height: 1.4;
}

.mobile-dish-position {
    margin-top: 4px;
    color: #5f6368;
    font-size: 13px;
}

.mobile-dish-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
}

.mobile-dish-price,
.mobile-dish-rate {
    display: inline-flex;
    align-items: center;
    min-height: 28px;
    padding: 0 10px;
    border-radius: 999px;
    background: #eef3fd;
    color: #1a73e8;
    font-size: 12px;
    font-weight: 600;
}

.mobile-dish-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 14px;
}
</style>

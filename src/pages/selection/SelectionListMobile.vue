<!--
  文件说明：SelectionListMobile.vue
  1. 这是移动端视图文件，负责在小屏设备中提供更紧凑的布局与交互展示。
  2. 该文件位于 src\pages\selection 目录下，和同层文件一起构成当前功能模块的视图或结构层。
  3. 文件中的脚本、模板和样式会围绕同一职责组织，便于后续维护时快速定位问题。
-->
<template>
    <MobilePageShell :title="text.pageTitle" :subtitle="text.listSubtitle">
        <div class="mobile-list">
            <article
                v-for="item in visibleSelections"
                :key="item.id"
                class="selection-card"
                @click="goToSelectionDetail(item)"
            >
                <div class="card-top">
                    <div>
                        <div class="user-name">{{ item.nickname || '同学' }}</div>
                        <div class="meta-date">{{ item.date }}</div>
                    </div>
                    <div class="rate-chip">{{ text.rate }} {{ item.rate }}</div>
                </div>

                <div class="comment-body">{{ item.comment }}</div>

                <div class="chip-row">
                    <span class="info-chip">{{ text.pricePrefix }}{{ item.price }}{{ text.priceSuffix }}</span>
                    <span v-for="(pos, index) in item.position" :key="`${item.id}-${index}`" class="info-chip">
                        {{ formatPosition(pos) }}
                    </span>
                </div>

                <div class="action-row">
                    <a-button @click.stop="goToSelectionDetail(item)">{{ text.reply }}</a-button>
                    <a-button type="primary" @click.stop="openRatingModal(item)">{{ text.rateAction }}</a-button>
                </div>
            </article>
        </div>

        <a-button v-if="hasMore" block @click="loadMore">{{ text.loadMore }}</a-button>

        <section class="mobile-form-card">
            <h2 class="section-title">{{ text.contributeTitle }}</h2>
            <p class="section-subtitle">{{ text.contributeSubtitle }}</p>

            <div class="field-label">{{ text.commentTitle }}</div>
            <a-textarea v-model:value="form.comment" :rows="4" :placeholder="text.commentPlaceholder" />

            <div class="field-label">{{ text.priceTitle }}</div>
            <a-input-number
                v-model:value="form.price"
                :min="0"
                :step="0.5"
                :precision="1"
                class="price-input"
                :placeholder="text.pricePlaceholder"
            >
                <template #addonAfter>{{ text.yuanSymbol }}</template>
            </a-input-number>

            <div class="field-label">{{ text.selectPosition }}</div>
            <div class="position-rows">
                <div v-for="(item, index) in form.positions" :key="index" class="position-row">
                    <a-select
                        v-model:value="item.floor"
                        :options="floorOptions"
                        :placeholder="text.floorPlaceholder"
                    />
                    <a-select
                        v-model:value="item.window"
                        :options="windowOptions"
                        :placeholder="text.windowPlaceholder"
                    />
                    <div class="position-actions">
                        <a-button
                            v-if="index === form.positions.length - 1"
                            type="dashed"
                            shape="circle"
                            size="small"
                            @click="addPositionRow"
                        >
                            +
                        </a-button>
                        <a-button
                            v-if="index === form.positions.length - 1 && form.positions.length >= 2"
                            type="dashed"
                            shape="circle"
                            size="small"
                            @click="removePositionRow"
                        >
                            -
                        </a-button>
                    </div>
                </div>
            </div>

            <a-button type="primary" block class="submit-button" :loading="submitting" @click="submitSelection">{{ text.submit }}</a-button>
        </section>

        <RatingModal
            :open="ratingModalVisible"
            :title="ratingModalTitle"
            :rating-value="ratingValue"
            :loading="submitting"
            :submit-text="text.submitRating"
            @update:ratingValue="updateRatingValue"
            @cancel="closeRatingModal"
            @submit="submitRating"
        />
    </MobilePageShell>
</template>

<script setup>
import MobilePageShell from '@/components/mobile/MobilePageShell.vue';
import RatingModal from '@/components/RatingModal.vue';
import { useSelectionListPage } from '@/composables/useSelectionListPage';

const {
    text,
    floorOptions,
    windowOptions,
    form,
    submitting,
    visibleSelections,
    hasMore,
    ratingModalVisible,
    ratingModalTitle,
    ratingValue,
    formatPosition,
    goToSelectionDetail,
    loadMore,
    addPositionRow,
    removePositionRow,
    openRatingModal,
    updateRatingValue,
    closeRatingModal,
    submitRating,
    submitSelection,
} = useSelectionListPage();
</script>

<style scoped>
.mobile-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.selection-card,
.mobile-form-card {
    padding: 16px;
    border: 1px solid #e8eaed;
    border-radius: 20px;
    background: #fff;
}

.card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 10px;
}

.user-name {
    color: #202124;
    font-size: 16px;
    font-weight: 700;
}

.meta-date,
.section-subtitle {
    color: #5f6368;
    font-size: 12px;
}

.rate-chip,
.info-chip {
    display: inline-flex;
    align-items: center;
    padding: 6px 10px;
    border-radius: 999px;
    background: #eef3fd;
    color: #1a73e8;
    font-size: 12px;
}

.comment-body {
    margin-bottom: 12px;
    color: #3c4043;
    line-height: 1.7;
    white-space: pre-wrap;
}

.chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
}

.action-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.section-title {
    margin: 0 0 4px;
    color: #202124;
    font-size: 18px;
    font-weight: 800;
}

.field-label {
    margin: 14px 0 8px;
    color: #3c4043;
    font-size: 13px;
    font-weight: 600;
}

.price-input {
    width: 100%;
}

.position-rows {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.position-row {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px;
    border-radius: 14px;
    background: #f8f9fa;
}

.position-actions {
    display: flex;
    gap: 8px;
}

.submit-button {
    margin-top: 16px;
}
</style>

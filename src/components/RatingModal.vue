<!--
  文件说明：RatingModal.vue
  1. 这是可复用组件文件，用于为多个页面提供统一的界面片段和交互外壳。
  2. 该文件位于 src\components 目录下，和同层文件一起构成当前功能模块的视图或结构层。
  3. 如果这个文件同时承担入口职责，它通常只负责装配其它视图或共享逻辑，而不重复实现业务规则。
-->
<template>
    <a-modal :open="open" :title="title" :footer="null" centered @cancel="$emit('cancel')">
        <div class="rating-modal-content">
            <div class="rating-row">
                <a-rate :value="ratingValue" allow-half :tooltips="tooltips" @update:value="onUpdateRating" />
                <span class="rating-desc">{{ ratingDescText }}</span>
            </div>
            <a-button type="primary" :loading="loading" @click="$emit('submit')">{{ submitText }}</a-button>
        </div>
    </a-modal>
</template>

<script>
import { ratingModalText } from '@/models/text';

export default {
    name: 'RatingModal',
    props: {
        open: { type: Boolean, default: false },
        title: { type: String, default: '' },
        ratingValue: { type: Number, default: 0 },
        loading: { type: Boolean, default: false },
        submitText: { type: String, default: ratingModalText.submitText },
        tooltips: {
            type: Array,
            default: () => ['0.5', '1.0', '1.5', '2.0', '2.5', '3.0', '3.5', '4.0', '4.5', '5.0'],
        },
    },
    emits: ['cancel', 'submit', 'update:ratingValue'],
    computed: {
        // 星级右侧显示当前选中的分值。
        ratingDescText() {
            if (this.ratingValue <= 0) return '';
            const index = Math.round(this.ratingValue * 2) - 1;
            return this.tooltips[index] || '';
        },
    },
    methods: {
        onUpdateRating(value) {
            this.$emit('update:ratingValue', value);
        },
    },
};
</script>

<style scoped>
.rating-modal-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.rating-row {
    display: inline-flex;
    align-items: center;
    gap: 10px;
}

.rating-desc {
    color: #595959;
    min-width: 28px;
}

:deep(.rating-row .ant-rate-star-zero .ant-rate-star-first),
:deep(.rating-row .ant-rate-star-zero .ant-rate-star-second) {
    color: #d9d9d9;
}
</style>

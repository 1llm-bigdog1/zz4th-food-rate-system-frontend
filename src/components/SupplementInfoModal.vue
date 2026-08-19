<!--
  文件说明：SupplementInfoModal.vue
  1. 这是可复用组件文件，用于为多个页面提供统一的界面片段和交互外壳。
  2. 该文件位于 src\components 目录下，和同层文件一起构成当前功能模块的视图或结构层。
  3. 如果这个文件同时承担入口职责，它通常只负责装配其它视图或共享逻辑，而不重复实现业务规则。
-->
<template>
    <a-modal :open="open" :title="title" :footer="null" centered @cancel="$emit('cancel')">
        <div class="modal-content">
            <div class="form-section">
                <div class="section-title">{{ uploadImageText }}</div>
                <a-upload v-model:file-list="localForm.fileList" :before-upload="() => false" list-type="picture">
                    <a-button>{{ uploadBtnText }}</a-button>
                </a-upload>
            </div>

            <div class="form-section">
                <div class="section-title">{{ modifyPositionText }}</div>
                <a-space>
                    <a-select v-model:value="localForm.stair" :options="floorOptions" :placeholder="floorPlaceholder" style="width: 120px" />
                    <a-select v-model:value="localForm.window" :options="windowOptions" :placeholder="windowPlaceholder" style="width: 120px" />
                </a-space>
            </div>

            <div class="form-section">
                <div class="section-title">{{ modifyPriceText }}</div>
                <a-input-number v-model:value="localForm.price" :min="0" :step="0.5" :precision="1" style="width: 240px" :placeholder="pricePlaceholder" />
            </div>

            <a-button type="primary" :loading="loading" @click="onSubmit">{{ submitText }}</a-button>
        </div>
    </a-modal>
</template>

<script>
import { supplementInfoModalText } from '@/models/text';

export default {
    name: 'SupplementInfoModal',
    props: {
        open: { type: Boolean, default: false },
        title: { type: String, default: '' },
        form: { type: Object, required: true },
        floorOptions: { type: Array, default: () => [] },
        windowOptions: { type: Array, default: () => [] },
        uploadImageText: { type: String, default: supplementInfoModalText.uploadImageText },
        uploadBtnText: { type: String, default: supplementInfoModalText.uploadBtnText },
        modifyPositionText: { type: String, default: supplementInfoModalText.modifyPositionText },
        modifyPriceText: { type: String, default: supplementInfoModalText.modifyPriceText },
        floorPlaceholder: { type: String, default: supplementInfoModalText.floorPlaceholder },
        windowPlaceholder: { type: String, default: supplementInfoModalText.windowPlaceholder },
        pricePlaceholder: { type: String, default: supplementInfoModalText.pricePlaceholder },
        loading: { type: Boolean, default: false },
        submitText: { type: String, default: supplementInfoModalText.submitText },
    },
    emits: ['cancel', 'submit'],
    data() {
        return {
            // 使用本地副本，避免直接修改父组件传入的 props。
            localForm: this.normalizeForm(this.form),
        };
    },
    watch: {
        form: {
            deep: true,
            handler(nextVal) {
                this.localForm = this.normalizeForm(nextVal);
            },
        },
        open(nextOpen) {
            if (nextOpen) {
                this.localForm = this.normalizeForm(this.form);
            }
        },
    },
    methods: {
        normalizeForm(source) {
            return {
                fileList: Array.isArray(source?.fileList) ? [...source.fileList] : [],
                stair: source?.stair ?? null,
                window: source?.window ?? null,
                price: source?.price ?? null,
            };
        },
        onSubmit() {
            this.$emit('submit', this.normalizeForm(this.localForm));
        },
    },
};
</script>

<style scoped>
.modal-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.form-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.section-title {
    color: #1f1f1f;
    font-weight: 600;
}
</style>

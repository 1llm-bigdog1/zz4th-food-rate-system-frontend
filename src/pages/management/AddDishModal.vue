<!--
  文件说明：AddDishModal.vue
  1. 这是页面级单文件组件，用于承接路由页面或页面入口层的展示职责。
  2. 该文件位于 src\pages\management 目录下，和同层文件一起构成当前功能模块的视图或结构层。
  3. 如果这个文件同时承担入口职责，它通常只负责装配其它视图或共享逻辑，而不重复实现业务规则。
-->
<template>
    <a-modal :open="open" :title="title" :footer="null" centered @cancel="$emit('cancel')">
        <div class="modal-content">
            <div class="form-section">
                <div class="section-title">{{ nameLabel }}</div>
                <a-input v-model:value="localForm.name" :placeholder="namePlaceholder" />
            </div>

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

            <a-button type="primary" @click="onSubmit">{{ submitText }}</a-button>
        </div>
    </a-modal>
</template>

<script>
import { message } from 'ant-design-vue';
import { supplementInfoModalText } from '@/models/text';

export default {
    name: 'AddDishModal',
    props: {
        open: { type: Boolean, default: false },
        title: { type: String, default: '' },
        form: { type: Object, required: true },
        floorOptions: { type: Array, default: () => [] },
        windowOptions: { type: Array, default: () => [] },
        nameLabel: { type: String, default: '\u83dc\u54c1\u540d\u79f0' },
        namePlaceholder: { type: String, default: '\u8bf7\u8f93\u5165\u83dc\u54c1\u540d\u79f0' },
        nameRequiredMessage: { type: String, default: '\u8bf7\u586b\u5199\u83dc\u54c1\u540d\u79f0' },
        uploadImageText: { type: String, default: supplementInfoModalText.uploadImageText },
        uploadBtnText: { type: String, default: supplementInfoModalText.uploadBtnText },
        modifyPositionText: { type: String, default: supplementInfoModalText.modifyPositionText },
        modifyPriceText: { type: String, default: supplementInfoModalText.modifyPriceText },
        floorPlaceholder: { type: String, default: supplementInfoModalText.floorPlaceholder },
        windowPlaceholder: { type: String, default: supplementInfoModalText.windowPlaceholder },
        pricePlaceholder: { type: String, default: supplementInfoModalText.pricePlaceholder },
        submitText: { type: String, default: '\u6dfb\u52a0\u83dc\u54c1' },
    },
    emits: ['cancel', 'submit'],
    data() {
        return {
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
                name: source?.name ?? '',
                fileList: Array.isArray(source?.fileList) ? [...source.fileList] : [],
                stair: source?.stair ?? null,
                window: source?.window ?? null,
                price: source?.price ?? null,
            };
        },
        onSubmit() {
            if (!this.localForm.name.trim()) {
                message.warning(this.nameRequiredMessage);
                return;
            }
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

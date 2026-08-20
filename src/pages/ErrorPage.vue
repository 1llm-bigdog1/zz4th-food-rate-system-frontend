<!--
  文件说明：ErrorPage.vue
  1. 通用错误页：404（路由不存在）、403（无权限）、500（服务器内部错误）、网络错误/后端不可用。
  2. 该文件位于 src\pages 目录下，由路由直接渲染，兼容桌面与移动端布局。
  3. 提供“返回上一页”“返回首页”，500/网络错误额外提供“重试”。
-->
<template>
    <div id="error-page">
        <a-card :bordered="false" class="error-card">
            <div class="error-code">{{ displayCode }}</div>
            <h1 class="error-title">{{ title }}</h1>
            <p class="error-message">{{ message }}</p>
            <div class="error-actions">
                <a-space wrap>
                    <a-button @click="goBack">返回上一页</a-button>
                    <a-button type="primary" @click="goHome">返回首页</a-button>
                    <a-button v-if="retryable" @click="retry">重试</a-button>
                </a-space>
            </div>
        </a-card>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

// eslint-disable-next-line no-undef
const props = defineProps({
    code: { type: [String, Number], default: 404 },
    message: { type: String, default: '' },
});

const router = useRouter();

const META = {
    404: { title: '\u9875\u9762\u4e0d\u5b58\u5728', message: '\u4f60\u8bbf\u95ee\u7684\u9875\u9762\u4e0d\u5b58\u5728\u6216\u5df2\u88ab\u79fb\u52a8\u3002', retryable: false },
    403: { title: '\u6ca1\u6709\u8bbf\u95ee\u6743\u9650', message: '\u4f60\u6ca1\u6709\u6743\u9650\u8bbf\u95ee\u8be5\u9875\u9762\u6216\u6267\u884c\u8be5\u64cd\u4f5c\u3002', retryable: false },
    500: { title: '\u670d\u52a1\u5668\u5185\u90e8\u9519\u8bef', message: '\u670d\u52a1\u5668\u5f00\u5c0f\u5dee\u4e86\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002', retryable: true },
    network: { title: '\u7f51\u7edc\u9519\u8bef', message: '\u65e0\u6cd5\u8fde\u63a5\u670d\u52a1\u5668\uff0c\u8bf7\u68c0\u67e5\u7f51\u7edc\u540e\u91cd\u8bd5\u3002', retryable: true },
};

const meta = computed(() => META[props.code] || META['404']);
const displayCode = computed(() => (props.code === 'network' ? 'NET' : String(props.code)));
const title = computed(() => meta.value.title);
const message = computed(() => props.message || meta.value.message);
const retryable = computed(() => meta.value.retryable);

const goBack = () => {
    if (window.history.length > 1) {
        router.back();
    } else {
        router.push('/');
    }
};

const goHome = () => router.push('/');
const retry = () => window.location.reload();
</script>

<style scoped>
#error-page {
    min-height: calc(100vh - 64px - 96px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
    box-sizing: border-box;
}

.error-card {
    width: min(520px, 100%);
    border-radius: 24px;
    text-align: center;
    padding: 40px 24px;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
}

.error-code {
    font-size: 72px;
    font-weight: 800;
    line-height: 1;
    color: #1a73e8;
}

.error-title {
    margin: 18px 0 10px;
    color: #202124;
    font-size: 24px;
    font-weight: 700;
}

.error-message {
    margin: 0 0 24px;
    color: #5f6368;
    font-size: 14px;
    line-height: 1.7;
}
</style>

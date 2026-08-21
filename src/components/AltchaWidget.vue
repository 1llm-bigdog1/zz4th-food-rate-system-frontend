<!--
  文件说明：AltchaWidget.vue
  1. ALTCHA 人机验证组件（自托管 PoW，协议与官方 altcha 3.x 一致）；
  2. 挑战由后端 GET /api/auth/altcha-challenge 生成，组件在浏览器内用 WebCrypto
     PBKDF2-HMAC-SHA256 求解，验证通过后通过 v-model 输出 altcha payload；
  3. 说明：官方 <altcha-widget> 自定义元素与本项目 Vue 3.5 运行时存在兼容问题
     （渲染时无限递归导致白屏），故改为纯 JS 求解器实现，不依赖自定义元素；
  4. 不保存、不打印任何密钥；payload 仅随表单提交给后端校验。
-->
<template>
    <div class="altcha-widget-wrap">
        <a-button
            v-if="state === 'idle'"
            class="altcha-btn"
            :loading="busy"
            @click="start"
        >完成人机验证</a-button>
        <a-button
            v-else-if="state === 'solving'"
            class="altcha-btn"
            loading
            disabled
        >验证中…</a-button>
        <div v-else-if="state === 'done'" class="altcha-status altcha-ok">✓ 验证通过</div>
        <a-button
            v-else
            class="altcha-btn"
            @click="start"
        >验证失败，点击重试</a-button>
    </div>
</template>

<script setup>
import { ref } from 'vue';

// eslint-disable-next-line no-undef
const emit = defineEmits(['update:modelValue']);

const challengeUrl =
    process.env.VUE_APP_ALTCHA_CHALLENGE_URL || 'http://localhost:5000/api/auth/altcha-challenge';

const state = ref('idle');
const busy = ref(false);

const hexToBytes = (hex) => {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i += 1) {
        bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return bytes;
};

const bytesToHex = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

const startsWith = (bytes, prefix) => {
    if (prefix.length > bytes.length) {
        return false;
    }
    for (let i = 0; i < prefix.length; i += 1) {
        if (bytes[i] !== prefix[i]) {
            return false;
        }
    }
    return true;
};

/**
 * 求解 ALTCHA PoW v2 挑战：
 * derivedKey = PBKDF2-HMAC-SHA256(password=nonce||uint32be(counter), salt, cost, keyLength)
 * 要求 derivedKey 以 keyPrefix 开头（与官方 altcha 3.x worker 一致）。
 */
const deriveKey = async (parameters, counter) => {
    const nonce = hexToBytes(parameters.nonce);
    const salt = hexToBytes(parameters.salt);
    const password = new Uint8Array(nonce.length + 4);
    password.set(nonce);
    new DataView(password.buffer).setUint32(nonce.length, counter, false);
    const keyMaterial = await crypto.subtle.importKey('raw', password, 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits(
        { name: 'PBKDF2', salt, iterations: parameters.cost, hash: 'SHA-256' },
        keyMaterial,
        parameters.keyLength * 8,
    );
    return new Uint8Array(bits);
};

const solveChallenge = async (challenge) => {
    const parameters = challenge.parameters;
    const prefix = hexToBytes(parameters.keyPrefix);
    let counter = 0;
    for (;;) {
        const derivedKey = await deriveKey(parameters, counter);
        if (startsWith(derivedKey, prefix)) {
            return { counter, derivedKey: bytesToHex(derivedKey) };
        }
        counter += 1;
        // 给主线程让出时间片，避免页面卡死。
        if (counter % 32 === 0) {
            await new Promise((resolve) => setTimeout(resolve, 0));
        }
    }
};

const start = async () => {
    if (busy.value) {
        return;
    }
    busy.value = true;
    state.value = 'solving';
    emit('update:modelValue', '');
    try {
        const response = await fetch(challengeUrl, { method: 'GET' });
        if (!response.ok) {
            throw new Error('challenge request failed');
        }
        const challenge = await response.json();
        const solution = await solveChallenge(challenge);
        const payload = btoa(
            JSON.stringify({
                challenge: {
                    parameters: challenge.parameters,
                    signature: challenge.signature,
                },
                solution,
            }),
        );
        state.value = 'done';
        emit('update:modelValue', payload);
    } catch (error) {
        state.value = 'error';
        emit('update:modelValue', '');
    } finally {
        busy.value = false;
    }
};
</script>

<style scoped>
.altcha-widget-wrap {
    width: 100%;
    display: flex;
    justify-content: flex-start;
}
.altcha-status {
    display: inline-flex;
    align-items: center;
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 500;
}
.altcha-ok {
    background: #e8f0fe;
    color: #1a73e8;
}
</style>

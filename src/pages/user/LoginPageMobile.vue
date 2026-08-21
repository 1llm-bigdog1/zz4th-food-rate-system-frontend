<!--
  文件说明：LoginPageMobile.vue
  1. 这是移动端视图文件，负责在小屏设备中提供更紧凑的布局与交互展示。
  2. 该文件位于 src\pages\user 目录下，和同层文件一起构成当前功能模块的视图或结构层。
  3. 文件中的脚本、模板和样式会围绕同一职责组织，便于后续维护时快速定位问题。
-->
<template>
    <MobilePageShell title="登录" subtitle="在移动端以更紧凑的单列方式完成登录。">
        <section class="auth-card">
            <img :src="badgeLogo" alt="校徽" class="logo-image" />
            <a-input v-model:value="form.account" size="large" placeholder="请输入你的用户名" @pressEnter="submitLogin" />
            <a-input-password v-model:value="form.password" size="large" placeholder="请输入你的密码" @pressEnter="submitLogin" />
            <div class="captcha-placeholder">
                <AltchaWidget v-model="form.altcha" />
            </div>
            <a-button type="link" class="text-link">忘记了密码？</a-button>
            <a-button type="link" class="text-link forum-link">校园论坛授权登录</a-button>
            <a-button type="primary" block size="large" :loading="submitting" @click="submitLogin">登录</a-button>
            <a-button type="link" class="text-link" @click="goToRegister">注册新账户</a-button>
        </section>
    </MobilePageShell>
</template>

<script setup>
import MobilePageShell from '@/components/mobile/MobilePageShell.vue';
import badgeLogo from '@/static/badge.png';
import AltchaWidget from '@/components/AltchaWidget.vue';
import { useLoginPage } from '@/composables/useLoginPage';

const { form, submitting, submitLogin, goToRegister } = useLoginPage();
</script>

<style scoped>
.auth-card { display: flex; flex-direction: column; gap: 14px; padding: 18px; border: 1px solid #e8eaed; border-radius: 20px; background: #fff; }
.logo-image { width: 56px; height: 56px; object-fit: contain; }
.captcha-placeholder { display: flex; align-items: center; }
.text-link { padding: 0; text-align: left; justify-content: flex-start; }
.forum-link { color: #d97706; }
</style>

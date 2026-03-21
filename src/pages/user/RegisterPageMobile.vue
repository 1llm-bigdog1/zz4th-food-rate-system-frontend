<!--
  文件说明：RegisterPageMobile.vue
  1. 这是移动端视图文件，负责在小屏设备中提供更紧凑的布局与交互展示。
  2. 该文件位于 src\pages\user 目录下，和同层文件一起构成当前功能模块的视图或结构层。
  3. 文件中的脚本、模板和样式会围绕同一职责组织，便于后续维护时快速定位问题。
-->
<template>
    <MobilePageShell title="注册" subtitle="移动端使用单列注册表单，减少横向拥挤。">
        <section class="auth-card">
            <img :src="badgeLogo" alt="校徽" class="logo-image" />
            <a-input size="large" placeholder="请输入用户名" />
            <a-input size="large" placeholder="请输入邮箱" />
            <a-input-password size="large" placeholder="请输入密码" />
            <a-input-password size="large" placeholder="请再次输入密码" />
            <div class="captcha-placeholder">
                <span class="captcha-title">人机验证预留区域</span>
                <span class="captcha-hint">后续可接入验证码组件</span>
            </div>
            <a-button type="primary" block size="large">注册</a-button>
            <a-button type="link" class="text-link">已有账号，去登录</a-button>
        </section>
    </MobilePageShell>
</template>

<script setup>
import MobilePageShell from '@/components/mobile/MobilePageShell.vue';
import badgeLogo from '@/static/badge.png';
</script>

<style scoped>
.auth-card { display: flex; flex-direction: column; gap: 14px; padding: 18px; border: 1px solid #e8eaed; border-radius: 20px; background: #fff; }
.logo-image { width: 56px; height: 56px; object-fit: contain; }
.captcha-placeholder { border: 2px dashed #f59e0b; border-radius: 14px; background: #fff7ed; padding: 10px 14px; display: flex; flex-direction: column; gap: 4px; }
.captcha-title { color: #c2410c; font-size: 14px; font-weight: 600; }
.captcha-hint { color: #9a3412; font-size: 12px; line-height: 1.35; }
.text-link { padding: 0; text-align: left; justify-content: flex-start; }
</style>

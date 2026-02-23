<template>
    <div id="register-page">
        <div class="register-shell">
            <a-card class="register-card" :bordered="false">
                <a-row :gutter="[36, 24]" align="top">
                    <a-col :xs="24" :md="11" class="left-panel">
                        <div class="google-logo" aria-label="Logo">
                            <img :src="badgeLogo" alt="校徽" class="logo-image" />
                        </div>
                        <h1 class="title">注册</h1>
                        <p class="subtitle">创建账号后即可参与菜品评分、查看排行并管理个人记录。</p>
                    </a-col>

                    <a-col :xs="24" :md="13" class="right-panel">
                        <a-input size="large" placeholder="请输入用户名" class="account-input" />
                        <a-input size="large" placeholder="请输入邮箱" class="input-gap" />
                        <a-input-password size="large" placeholder="请输入密码" class="password-input" />
                        <a-input-password size="large" placeholder="请再次输入密码" class="input-gap password-input" />
                        <div class="captcha-placeholder">
                            <span class="captcha-title">人机验证预留区域</span>
                            <span class="captcha-hint">后续可接入滑块或图形验证码组件</span>
                        </div>
                        <div class="actions">
                            <a-button type="link" class="create-btn">已有账号，去登录</a-button>
                            <a-button type="primary" shape="round" size="large" class="next-btn">注册</a-button>
                        </div>
                    </a-col>
                </a-row>
            </a-card>
        </div>
    </div>
</template>

<script setup>
import badgeLogo from '@/static/badge.png';
</script>

<style scoped>
#register-page {
    --page-bg: #f8f9fa;
    --card-bg: #f8f9fa;
    --text-color: #202124;
    --link-color: #1a73e8;
    --primary-color: #0b57d0;
    --primary-color-hover: #0a4ec3;
    --input-border: #9aa0a6;
    --font-family: 'Google Sans', 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
    min-height: calc(100vh - 64px - 96px);
    background: var(--page-bg);
    color: var(--text-color);
    font-family: var(--font-family);
    width: 100vw;
    margin-left: calc(50% - 50vw);
    padding: 0 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
}

.register-shell {
    width: min(940px, 100%);
    margin: 0 auto;
}

.register-card {
    background: var(--card-bg);
    border-radius: 30px;
    padding: clamp(24px, 3.2vh, 38px) clamp(20px, 2.4vw, 32px);
}

.left-panel {
    padding-left: 6px;
}

.google-logo {
    width: 62px;
    height: 62px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.logo-image {
    width: 58px;
    height: 58px;
    object-fit: contain;
}

.title {
    margin: 14px 0 12px;
    font-size: clamp(28px, 2.2vw, 40px);
    line-height: 1.06;
    font-weight: 400;
}

.subtitle {
    margin: 0;
    max-width: 360px;
    font-size: clamp(14px, 0.92vw, 16px);
    line-height: 1.5;
}

.right-panel {
    padding-top: clamp(24px, 3vh, 42px);
}

#register-page :deep(.account-input .ant-input),
#register-page :deep(.input-gap .ant-input) {
    height: 58px;
    border-color: var(--input-border);
    border-radius: 14px;
    font-size: 17px;
}

#register-page :deep(.input-gap) {
    margin-top: 16px;
}

#register-page :deep(.password-input .ant-input-affix-wrapper) {
    height: 58px;
    border-color: var(--input-border);
    border-radius: 14px;
    font-size: 17px;
}

#register-page :deep(.password-input) {
    margin-top: 16px;
}

.captcha-placeholder {
    margin-top: 16px;
    min-height: 76px;
    border: 2px dashed #f59e0b;
    border-radius: 14px;
    background: #fff7ed;
    padding: 10px 14px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
}

.captcha-title {
    color: #c2410c;
    font-size: 14px;
    font-weight: 600;
}

.captcha-hint {
    color: #9a3412;
    font-size: 12px;
    line-height: 1.35;
}

.create-btn {
    margin-top: 14px;
    padding: 0;
    color: var(--link-color);
    font-size: 14px;
    font-weight: 500;
}

.actions {
    margin-top: 24px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 20px;
}

.next-btn {
    min-width: 96px;
    height: 42px;
    font-size: 14px;
    padding: 0 22px;
    background: var(--primary-color);
}

#register-page :deep(.next-btn:hover),
#register-page :deep(.next-btn:focus) {
    background: var(--primary-color-hover);
}
</style>

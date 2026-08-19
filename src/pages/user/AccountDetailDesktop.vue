<!--
  文件说明：AccountDetailDesktop.vue
  1. 这是桌面端视图文件，负责在大屏设备中保留更高信息密度的排版结构。
  2. 该文件位于 src\pages\user 目录下，和同层文件一起构成当前功能模块的视图或结构层。
  3. 文件中的脚本、模板和样式会围绕同一职责组织，便于后续维护时快速定位问题。
-->
<template>
    <div id="account-detail-page">
        <div class="account-shell">
            <a-card :bordered="false" class="account-card">
                <a-row :gutter="[36, 24]" align="top">
                    <a-col :xs="24" :md="9" class="left-panel">
                        <div class="logo-wrap" aria-label="账户中心"><img :src="badgeLogo" alt="校徽" class="logo-image" /></div>
                        <h1 class="title">管理您的账户</h1>
                        <p class="subtitle">账户信息、等级和统计都在这里查看与编辑。</p>
                    </a-col>
                    <a-col :xs="24" :md="15" class="right-panel">
                        <a-card size="small" :bordered="false" class="editor-card">
                            <a-form layout="vertical">
                                <a-row :gutter="14">
                                    <a-col :xs="24" :sm="12"><a-form-item label="用户名"><a-input v-model:value="form.username" placeholder="请输入用户名" /></a-form-item></a-col>
                                    <a-col :xs="24" :sm="12"><a-form-item label="昵称"><a-input v-model:value="form.nickname" placeholder="请输入昵称" /></a-form-item></a-col>
                                </a-row>
                                <a-form-item label="性别"><a-select v-model:value="form.gender" :options="genderOptions" /></a-form-item>
                                <a-form-item v-if="form.gender === '自定义'" label="自定义性别"><a-input v-model:value="form.customGender" placeholder="请输入自定义性别" /></a-form-item>
                                <a-row :gutter="14">
                                    <a-col :xs="24" :sm="8"><a-form-item label="届别（可选）"><a-select v-model:value="form.gradYear" placeholder="选择届别" :options="gradYearOptions" allow-clear /></a-form-item></a-col>
                                    <a-col :xs="24" :sm="8"><a-form-item label="班级（可选）"><a-input v-model:value="form.className" placeholder="例如：3班" /></a-form-item></a-col>
                                    <a-col :xs="24" :sm="8"><a-form-item label="姓名（可选）"><a-input v-model:value="form.realName" placeholder="请输入姓名" /></a-form-item></a-col>
                                </a-row>
                                <a-form-item label="头像">
                                    <div class="avatar-row">
                                        <a-avatar :size="72" :src="avatarPreview">{{ avatarFallback }}</a-avatar>
                                        <a-input v-model:value="form.avatar" placeholder="请输入头像链接（可选）" />
                                    </div>
                                </a-form-item>
                                <a-form-item class="submit-item"><a-button type="primary" @click="saveAccount">提交更改</a-button></a-form-item>
                            </a-form>
                        </a-card>
                        <a-divider />
                        <a-row :gutter="[14, 14]">
                            <a-col :xs="24" :sm="12"><a-card size="small" class="info-card"><a-statistic title="注册日期" :value="form.registerDate" /></a-card></a-col>
                            <a-col :xs="24" :sm="12"><a-card size="small" class="info-card"><div class="level-title">等级</div><a-tag color="blue" class="level-text">Lv{{ form.level }}</a-tag></a-card></a-col>
                            <a-col :xs="24"><a-card size="small" class="info-card"><a-statistic title="参与评分数量" :value="form.ratingCount" suffix="次" /></a-card></a-col>
                        </a-row>
                    </a-col>
                </a-row>
            </a-card>
        </div>
    </div>
</template>

<script setup>
import badgeLogo from '@/static/badge.png';
import { useAccountDetailPage } from '@/composables/useAccountDetailPage';
const { form, genderOptions, gradYearOptions, avatarPreview, avatarFallback, saveAccount } = useAccountDetailPage();
</script>

<style scoped>
#account-detail-page { --page-bg: #f8f9fa; --card-bg: #f8f9fa; --text-color: #202124; --border-color: #d2d5da; --font-family: 'Google Sans', 'Noto Sans SC', 'Microsoft YaHei', sans-serif; min-height: calc(100vh - 64px - 96px); background: var(--page-bg); color: var(--text-color); font-family: var(--font-family); width: 100vw; margin-left: calc(50% - 50vw); padding: 18px 16px; box-sizing: border-box; }
.account-shell { width: min(980px, 100%); margin: 0 auto; }
.account-card { background: var(--card-bg); border-radius: 30px; padding: clamp(22px, 3.2vh, 36px) clamp(20px, 2.4vw, 32px); }
.left-panel { padding-left: 6px; }
.logo-wrap { width: 62px; height: 62px; display: inline-flex; align-items: center; justify-content: center; }
.logo-image { width: 58px; height: 58px; object-fit: contain; }
.title { margin: 14px 0 12px; font-size: clamp(28px, 2.2vw, 40px); line-height: 1.06; font-weight: 400; }
.subtitle { margin: 0; max-width: 360px; font-size: clamp(14px, .92vw, 16px); line-height: 1.5; }
.right-panel { padding-top: clamp(8px, 1.4vh, 18px); }
.editor-card, .info-card { border-radius: 14px; background: #ffffff; }
#account-detail-page :deep(.ant-form-item) { margin-bottom: 14px; }
#account-detail-page :deep(.ant-input), #account-detail-page :deep(.ant-input-affix-wrapper), #account-detail-page :deep(.ant-select-selector) { min-height: 42px; border-radius: 10px; border-color: var(--border-color); }
.avatar-row { display: flex; align-items: center; gap: 14px; }
#account-detail-page :deep(.avatar-row .ant-input) { max-width: 320px; }
.submit-item { margin-bottom: 0; }
.level-title { margin-bottom: 10px; color: #5f6368; font-size: 12px; }
.level-text { border-radius: 999px; padding: 4px 12px; font-weight: 600; }
</style>

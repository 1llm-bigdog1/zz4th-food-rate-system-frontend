<!--
  文件说明：AccountDetailDesktop.vue
  1. 这是桌面端视图文件，负责在大屏设备中保留更高信息密度的排版结构。
  2. 该文件位于 src\pages\user 目录下，和同层文件一起构成当前功能模块的视图或结构层。
  3. 数据源为 getUser() 返回的 User 实例；加载期间显示 Skeleton，401 由 composable 处理跳转登录页。
-->
<template>
    <div id="account-detail-page">
        <div class="account-shell">
            <a-card :bordered="false" class="account-card">
                <a-row :gutter="[36, 24]" align="top">
                    <a-col :xs="24" :md="9" class="left-panel">
                        <div class="logo-wrap" aria-label="账户中心"><img :src="badgeLogo" alt="校徽" class="logo-image" /></div>
                        <h1 class="title">管理您的账户</h1>
                        <p class="subtitle">账户信息、等级和统计都在这里查看。</p>
                    </a-col>
                    <a-col :xs="24" :md="15" class="right-panel">
                        <a-card size="small" :bordered="false" class="editor-card">
                            <a-skeleton v-if="loading" :paragraph="{ rows: 7 }" active />
                            <template v-else-if="user">
                                <div class="user-head">
                                    <a-avatar :size="72" :src="avatarPreview">{{ avatarFallback }}</a-avatar>
                                    <div class="user-head-info">
                                        <div class="user-name">{{ user.nickname || user.username }}</div>
                                        <div class="user-account">@{{ user.username }}</div>
                                    </div>
                                </div>
                                <a-divider />
                                <div class="info-list">
                                    <div class="info-row"><span class="info-label">用户ID</span><span class="info-value">{{ user.id }}</span></div>
                                    <div class="info-row"><span class="info-label">用户名</span><span class="info-value">{{ user.username }}</span></div>
                                    <div class="info-row"><span class="info-label">昵称</span><span class="info-value">{{ user.nickname }}</span></div>
                                    <div class="info-row"><span class="info-label">真实姓名</span><span class="info-value">{{ user.realname }}</span></div>
                                    <div class="info-row"><span class="info-label">性别</span><span class="info-value">{{ user.gender }}</span></div>
                                    <div class="info-row"><span class="info-label">届别</span><span class="info-value">{{ user.session }}</span></div>
                                    <div class="info-row"><span class="info-label">班级</span><span class="info-value">{{ user.classid }}</span></div>
                                    <div class="info-row"><span class="info-label">邮箱</span><span class="info-value">{{ user.email }}</span></div>
                                </div>
                                <a-divider />
                                <a-row :gutter="[14, 14]">
                                    <a-col :xs="24" :sm="12"><a-card size="small" class="info-card"><a-statistic title="注册日期" :value="user.register_date" /></a-card></a-col>
                                    <a-col :xs="24" :sm="12"><a-card size="small" class="info-card"><div class="level-title">等级</div><a-tag color="blue" class="level-text">Lv{{ user.level }}</a-tag></a-card></a-col>
                                    <a-col :xs="24"><a-card size="small" class="info-card"><a-statistic title="参与评分数量" :value="user.rate_time" suffix="次" /></a-card></a-col>
                                </a-row>
                            </template>
                            <a-empty v-else description="无法获取用户信息" />
                        </a-card>
                    </a-col>
                </a-row>
            </a-card>
        </div>
    </div>
</template>

<script setup>
import badgeLogo from '@/static/badge.png';
import { useAccountDetailPage } from '@/composables/useAccountDetailPage';

const { user, loading, avatarPreview, avatarFallback } = useAccountDetailPage();
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
.user-head { display: flex; align-items: center; gap: 16px; }
.user-head-info { min-width: 0; }
.user-name { color: #202124; font-size: 20px; font-weight: 700; }
.user-account { color: #5f6368; font-size: 13px; }
.info-list { display: flex; flex-direction: column; gap: 12px; }
.info-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-bottom: 10px; border-bottom: 1px solid #f0f1f2; }
.info-row:last-child { border-bottom: 0; padding-bottom: 0; }
.info-label { color: #5f6368; font-size: 13px; flex-shrink: 0; }
.info-value { color: #202124; font-size: 14px; font-weight: 500; text-align: right; word-break: break-all; }
.level-title { margin-bottom: 10px; color: #5f6368; font-size: 12px; }
.level-text { border-radius: 999px; padding: 4px 12px; font-weight: 600; }
</style>

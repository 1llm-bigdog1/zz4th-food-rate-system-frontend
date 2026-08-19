<!--
  文件说明：AccountDetailMobile.vue
  1. 这是移动端视图文件，负责在小屏设备中提供更紧凑的布局与交互展示。
  2. 该文件位于 src\pages\user 目录下，和同层文件一起构成当前功能模块的视图或结构层。
  3. 数据源为 getUser() 返回的 User 实例；加载期间显示 Skeleton，401 由 composable 处理跳转登录页。
-->
<template>
    <MobilePageShell title="账户中心" subtitle="查看当前登录用户的账户信息与统计。">
        <section class="profile-card">
            <a-skeleton v-if="loading" :paragraph="{ rows: 8 }" active />
            <template v-else-if="user">
                <div class="profile-top">
                    <a-avatar :size="64" :src="avatarPreview">{{ avatarFallback }}</a-avatar>
                    <div>
                        <div class="profile-name">{{ user.nickname || user.username }}</div>
                        <div class="profile-sub">@{{ user.username }}</div>
                    </div>
                </div>
                <div class="info-list">
                    <div class="stat-row"><span>用户ID</span><strong>{{ user.id }}</strong></div>
                    <div class="stat-row"><span>昵称</span><strong>{{ user.nickname }}</strong></div>
                    <div class="stat-row"><span>真实姓名</span><strong>{{ user.realname }}</strong></div>
                    <div class="stat-row"><span>性别</span><strong>{{ user.gender }}</strong></div>
                    <div class="stat-row"><span>届别</span><strong>{{ user.session }}</strong></div>
                    <div class="stat-row"><span>班级</span><strong>{{ user.classid }}</strong></div>
                    <div class="stat-row"><span>邮箱</span><strong>{{ user.email }}</strong></div>
                </div>
            </template>
            <a-empty v-else description="无法获取用户信息" />
        </section>
        <section v-if="user" class="stats-card">
            <div class="stat-row"><span>注册日期</span><strong>{{ user.register_date }}</strong></div>
            <div class="stat-row"><span>等级</span><strong>Lv{{ user.level }}</strong></div>
            <div class="stat-row"><span>参与评分数量</span><strong>{{ user.rate_time }} 次</strong></div>
        </section>
    </MobilePageShell>
</template>

<script setup>
import MobilePageShell from '@/components/mobile/MobilePageShell.vue';
import { useAccountDetailPage } from '@/composables/useAccountDetailPage';

const { user, loading, avatarPreview, avatarFallback } = useAccountDetailPage();
</script>

<style scoped>
.profile-card, .stats-card { padding: 18px; border: 1px solid #e8eaed; border-radius: 20px; background: #fff; }
.profile-top { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
.profile-name { color: #202124; font-size: 18px; font-weight: 700; }
.profile-sub { color: #5f6368; font-size: 13px; }
.info-list { display: flex; flex-direction: column; }
.stat-row { display: flex; justify-content: space-between; gap: 12px; padding: 12px 0; border-bottom: 1px solid #eef0f1; color: #3c4043; }
.stat-row:last-child { border-bottom: 0; }
.stat-row strong { font-weight: 600; text-align: right; word-break: break-all; }
</style>

<!--
  文件说明：AccountDetailMobile.vue
  1. 这是移动端视图文件，负责在小屏设备中提供更紧凑的布局与交互展示。
  2. 该文件位于 src\pages\user 目录下，和同层文件一起构成当前功能模块的视图或结构层。
  3. 文件中的脚本、模板和样式会围绕同一职责组织，便于后续维护时快速定位问题。
-->
<template>
    <MobilePageShell title="账户中心" subtitle="移动端把资料编辑和统计拆成上下两块，更容易浏览。">
        <section class="profile-card">
            <div class="profile-top">
                <a-avatar :size="64" :src="avatarPreview">{{ avatarFallback }}</a-avatar>
                <div>
                    <div class="profile-name">{{ form.nickname }}</div>
                    <div class="profile-sub">{{ form.username }}</div>
                </div>
            </div>
            <a-form layout="vertical">
                <a-form-item label="用户名"><a-input v-model:value="form.username" /></a-form-item>
                <a-form-item label="昵称"><a-input v-model:value="form.nickname" /></a-form-item>
                <a-form-item label="性别"><a-select v-model:value="form.gender" :options="genderOptions" /></a-form-item>
                <a-form-item v-if="form.gender === '自定义'" label="自定义性别"><a-input v-model:value="form.customGender" /></a-form-item>
                <a-form-item label="届别"><a-select v-model:value="form.gradYear" :options="gradYearOptions" allow-clear /></a-form-item>
                <a-form-item label="班级"><a-input v-model:value="form.className" /></a-form-item>
                <a-form-item label="姓名"><a-input v-model:value="form.realName" /></a-form-item>
                <a-form-item label="头像链接"><a-input v-model:value="form.avatar" /></a-form-item>
                <a-button type="primary" block @click="saveAccount">提交更改</a-button>
            </a-form>
        </section>
        <section class="stats-card">
            <div class="stat-row"><span>注册日期</span><strong>{{ form.registerDate }}</strong></div>
            <div class="stat-row"><span>等级</span><strong>Lv{{ form.level }}</strong></div>
            <div class="stat-row"><span>参与评分数量</span><strong>{{ form.ratingCount }} 次</strong></div>
        </section>
    </MobilePageShell>
</template>

<script setup>
import MobilePageShell from '@/components/mobile/MobilePageShell.vue';
import { useAccountDetailPage } from '@/composables/useAccountDetailPage';
const { form, genderOptions, gradYearOptions, avatarPreview, avatarFallback, saveAccount } = useAccountDetailPage();
</script>

<style scoped>
.profile-card, .stats-card { padding: 18px; border: 1px solid #e8eaed; border-radius: 20px; background: #fff; }
.profile-top { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
.profile-name { color: #202124; font-size: 18px; font-weight: 700; }
.profile-sub { color: #5f6368; font-size: 13px; }
.stat-row { display: flex; justify-content: space-between; gap: 12px; padding: 12px 0; border-bottom: 1px solid #eef0f1; color: #3c4043; }
.stat-row:last-child { border-bottom: 0; }
</style>

<template>
    <div id="admin-channel-page">
        <a-modal
            v-model:open="passwordModalOpen"
            title="管理员密码验证"
            :closable="false"
            :mask-closable="false"
            ok-text="验证"
            cancel-text="返回首页"
            @ok="submitPassword"
            @cancel="goHome"
        >
            <a-alert v-if="passwordError" type="error" show-icon class="password-alert" :message="passwordError" />
            <a-input-password
                v-model:value="password"
                placeholder="请输入管理员密码"
                @pressEnter="submitPassword"
            />
        </a-modal>

        <div v-if="isVerified" class="admin-shell">
            <div class="admin-header">
                <h1>管理员通道</h1>
                <a-button @click="logoutAdmin">退出验证</a-button>
            </div>

            <a-tabs v-model:activeKey="activeTab" type="card">
                <a-tab-pane key="dishes" tab="菜品管理">
                    <DishesManagement />
                </a-tab-pane>
                <a-tab-pane key="supplement" tab="补充信息审核">
                    <SupplementInfoReview />
                </a-tab-pane>
                <a-tab-pane key="users" tab="用户管理">
                    <UserList />
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { verifyAdminPassword } from '@/api/admin';
import { getUser } from '@/api/getUser';
import DishesManagement from '@/pages/management/DishesManagement.vue';
import SupplementInfoReview from '@/pages/management/SupplementInfoReview.vue';
import UserList from '@/pages/management/UserList.vue';

const router = useRouter();
const storageKey = 'zz4th-admin-verified';
const activeTab = ref('dishes');
const isVerified = ref(false);
const passwordModalOpen = ref(true);
const password = ref('');
const passwordError = ref('');

onMounted(() => {
    isVerified.value = sessionStorage.getItem(storageKey) === 'true';
    passwordModalOpen.value = !isVerified.value;
});

const submitPassword = async () => {
    let result;
    try {
        result = await verifyAdminPassword(password.value);
    } catch (error) {
        passwordError.value = '验证失败，请稍后重试';
        return;
    }

    if (!result || !result.success) {
        passwordError.value = '密码错误，请重新输入';
        return;
    }

    // 密码验证通过后，还需确认当前后端 Session 是管理员角色：
    // 管理员接口由后端按 Session + role=admin 鉴权，未登录/普通用户访问仍会 403。
    try {
        const user = await getUser();
        if (!user || user.role !== 'admin') {
            passwordError.value = '当前账号不是管理员，请先使用管理员账号登录';
            return;
        }
    } catch (error) {
        passwordError.value = '请先使用管理员账号登录';
        return;
    }

    sessionStorage.setItem(storageKey, 'true');
    isVerified.value = true;
    passwordModalOpen.value = false;
    passwordError.value = '';
    message.success('管理员验证已通过');
};

const logoutAdmin = () => {
    sessionStorage.removeItem(storageKey);
    isVerified.value = false;
    password.value = '';
    passwordModalOpen.value = true;
};

const goHome = () => {
    router.push('/');
};
</script>

<style scoped>
#admin-channel-page {
    min-height: calc(100vh - 160px);
}

.admin-shell {
    width: min(1180px, 100%);
    margin: 0 auto;
}

.admin-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 16px;
}

.admin-header h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 800;
    color: #1f1f1f;
}

.password-alert {
    margin-bottom: 12px;
}
</style>

<template>
    <div id="user-list-page">
        <div class="panel-header">
            <span class="panel-title">用户管理</span>
            <div class="user-search">
                <a-input-search v-model:value="keyword" placeholder="搜索用户名" allow-clear />
            </div>
        </div>

        <a-table :columns="columns" :data-source="filteredUsers" :pagination="false" :row-key="(record) => record.id">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'status'">
                    <a-tag :color="record.status === '已禁用' ? 'error' : 'success'">{{ record.status }}</a-tag>
                </template>
                <template v-else-if="column.key === 'action'">
                    <a-space>
                        <a-button size="small" @click="openDetail(record)">查看</a-button>
                        <a-button size="small" @click="handleStatusChange(record)">
                            {{ record.status === '已禁用' ? '启用' : '禁用' }}
                        </a-button>
                    </a-space>
                </template>
            </template>
        </a-table>

        <a-modal v-model:open="detailVisible" title="用户详情" :footer="null" centered>
            <a-skeleton v-if="detailLoading" :paragraph="{ rows: 4 }" active />
            <div v-else-if="detailUser" class="detail-list">
                <div class="detail-avatar-row">
                    <a-avatar :size="56" :src="detailUser.avatar_path || undefined">{{ (detailUser.nickname || detailUser.username || '用').slice(0, 1) }}</a-avatar>
                    <div class="detail-user-name">{{ detailUser.nickname || detailUser.username }}</div>
                </div>
                <div class="detail-row"><span class="detail-label">用户ID</span><span class="detail-value">{{ detailUser.id }}</span></div>
                <div class="detail-row"><span class="detail-label">用户名</span><span class="detail-value">{{ detailUser.username || detailUser.name }}</span></div>
                <div class="detail-row"><span class="detail-label">昵称</span><span class="detail-value">{{ detailUser.nickname }}</span></div>
                <div class="detail-row"><span class="detail-label">真实姓名</span><span class="detail-value">{{ detailUser.realname }}</span></div>
                <div class="detail-row"><span class="detail-label">性别</span><span class="detail-value">{{ detailUser.gender }}</span></div>
                <div class="detail-row"><span class="detail-label">届别</span><span class="detail-value">{{ detailUser.session }}</span></div>
                <div class="detail-row"><span class="detail-label">班级</span><span class="detail-value">{{ detailUser.classid }}</span></div>
                <div class="detail-row"><span class="detail-label">邮箱</span><span class="detail-value">{{ detailUser.email }}</span></div>
                <div class="detail-row"><span class="detail-label">等级</span><span class="detail-value">Lv{{ detailUser.level }}</span></div>
                <div class="detail-row"><span class="detail-label">注册日期</span><span class="detail-value">{{ detailUser.register_date }}</span></div>
                <div class="detail-row"><span class="detail-label">参与评分数量</span><span class="detail-value">{{ detailUser.rate_time }} 次</span></div>
                <div class="detail-row"><span class="detail-label">状态</span><span class="detail-value">{{ detailUser.status }}</span></div>
            </div>
            <a-empty v-else description="无法获取用户详情" />
        </a-modal>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { message } from 'ant-design-vue';
import { fetchUserDetail, fetchUsers, setUserStatus } from '@/api/admin';

const keyword = ref('');
const users = ref([]);
const detailVisible = ref(false);
const detailLoading = ref(false);
const detailUser = ref(null);
const columns = [
    { title: '用户ID', dataIndex: 'id', key: 'id', width: 100 },
    { title: '用户名', dataIndex: 'name', key: 'name' },
    { title: '角色', dataIndex: 'role', key: 'role' },
    { title: '参与评分数量', dataIndex: 'ratingCount', key: 'ratingCount' },
    { title: '状态', dataIndex: 'status', key: 'status' },
    { title: '操作', dataIndex: 'action', key: 'action', width: 160 },
];

const filteredUsers = computed(() => {
    const cleanKeyword = keyword.value.trim().toLowerCase();
    if (!cleanKeyword) {
        return users.value;
    }
    return users.value.filter((user) => user.name.toLowerCase().includes(cleanKeyword));
});

onMounted(async () => {
    const result = await fetchUsers();
    users.value = result.users || [];
});

const openDetail = async (record) => {
    detailVisible.value = true;
    detailLoading.value = true;
    detailUser.value = null;
    try {
        const result = await fetchUserDetail(record.id);
        detailUser.value = (result && result.user) || null;
    } finally {
        detailLoading.value = false;
    }
};

const handleStatusChange = async (record) => {
    const targetEnabled = record.status === '已禁用';
    const result = await setUserStatus({ id: record.id, enabled: targetEnabled });
    if (!result || result.success === false) {
        message.error((result && result.message) || '操作失败，请稍后重试');
        return;
    }
    record.status = targetEnabled ? '正常' : '已禁用';
    message.success(targetEnabled ? '已启用该用户' : '已禁用该用户');
};
</script>

<style scoped>
#user-list-page {
    border: 1px solid #e6e6e6;
    border-radius: 8px;
    padding: 16px;
    background: #fff;
}

.panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 16px;
}

.panel-title {
    font-size: 18px;
    font-weight: 800;
}

.user-search {
    width: min(320px, 100%);
}

.detail-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.detail-avatar-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f1f2;
}

.detail-user-name {
    color: #202124;
    font-size: 16px;
    font-weight: 700;
}

.detail-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f1f2;
}

.detail-row:last-child {
    border-bottom: 0;
    padding-bottom: 0;
}

.detail-label {
    color: #5f6368;
    font-size: 13px;
}

.detail-value {
    color: #202124;
    font-size: 14px;
    font-weight: 500;
    text-align: right;
}

@media (max-width: 768px) {
    .panel-header {
        align-items: stretch;
        flex-direction: column;
    }
}
</style>

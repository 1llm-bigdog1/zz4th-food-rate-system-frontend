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
                    <a-tag color="success">{{ record.status }}</a-tag>
                </template>
                <template v-else-if="column.key === 'action'">
                    <a-space>
                        <a-button size="small">查看</a-button>
                        <a-button size="small">禁用</a-button>
                    </a-space>
                </template>
            </template>
        </a-table>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { fetchUsers } from '@/api/admin';

const keyword = ref('');
const users = ref([]);
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

@media (max-width: 768px) {
    .panel-header {
        align-items: stretch;
        flex-direction: column;
    }
}
</style>

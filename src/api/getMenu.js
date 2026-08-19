/**
 * 菜单增量同步。
 *
 * 数据来源：
 * - 本地菜单：IndexedDB 的 dishes 仓库（复用 src/db/indexedDB.js，不修改其实现）。
 * - sync_version：IndexedDB 的 meta 仓库（记录 id：menuSyncVersion）。
 *
 * 接口约定（GET /menu/sync，参数全部走 query params）：
 * - 有 sync_version 时携带 since=sync_version；无本地菜单或无 sync_version 时不带 since，执行 Full Sync。
 * - fullsync 响应：
 *   { success: true, mode: 'fullsync', version: number, menu: Dish[] }
 * - incremental 响应（changes 已按版本顺序排列）：
 *   {
 *     success: true,
 *     mode: 'incremental',
 *     version: number,
 *     changes: [
 *       { op: 'create', data: Dish },
 *       { op: 'update', data: Partial<Dish> },
 *       { op: 'delete', id: number }
 *     ]
 *   }
 * - 是否增量由后端决定，前端不判断版本差距；增量应用成功后才保存最新 version。
 */
import { getJson } from '@/api/client';
import { getCached, putRecord, removeRecord, STORES } from '@/db/indexedDB';
import Dish from '@/models/Dish';

const MENU_SYNC_URL = '/menu/sync';
const MENU_SYNC_VERSION_KEY = 'menuSyncVersion';

const readSyncVersion = () => {
    const record = getCached(STORES.meta).find((item) => item.id === MENU_SYNC_VERSION_KEY);
    return record ? record.value : 0;
};

const readLocalMenu = () => getCached(STORES.dishes);

const toDish = (record) =>
    new Dish(record.id, record.name, record.position, record.image, record.rate, record.price);

const saveSyncVersion = async (version) => {
    await putRecord(STORES.meta, { id: MENU_SYNC_VERSION_KEY, value: version });
};

const applyFullSync = async (response) => {
    const menu = Array.isArray(response.menu) ? response.menu : [];
    // 收到 fullsync 时获取完整菜单、覆盖本地数据并更新 sync_version。
    const current = readLocalMenu().slice();
    for (const item of current) {
        await removeRecord(STORES.dishes, item.id);
    }
    for (const item of menu) {
        await putRecord(STORES.dishes, item);
    }
    await saveSyncVersion(response.version);
};

const applyIncremental = async (response) => {
    const changes = Array.isArray(response.changes) ? response.changes : [];
    // changes 由后端按版本顺序返回，逐条应用。
    for (const change of changes) {
        const op = change && change.op;
        if (op === 'create') {
            await putRecord(STORES.dishes, change.data);
        } else if (op === 'update') {
            // update 只合并返回字段；rate 更新只修改对应 Dish 的 rate，其余字段保持不变。
            const existing = readLocalMenu().find((item) => item.id === change.data.id);
            if (existing) {
                await putRecord(STORES.dishes, { ...existing, ...change.data });
            }
        } else if (op === 'delete') {
            const id = change.id != null ? change.id : change.data && change.data.id;
            if (id != null) {
                await removeRecord(STORES.dishes, id);
            }
        }
    }
    await saveSyncVersion(response.version);
};

// 开发环境 mock 回退：无 since 时模拟 fullsync（保持当前本地菜单），有 since 时模拟空增量。
const buildMockSyncResponse = (syncVersion) => {
    if (syncVersion) {
        return { success: true, mode: 'incremental', version: syncVersion + 1, changes: [] };
    }
    return { success: true, mode: 'fullsync', version: 1, menu: readLocalMenu() };
};

/**
 * 同步菜单并返回完整 Dish[]。
 */
export const getMenu = async () => {
    const syncVersion = readSyncVersion();
    const localMenu = readLocalMenu();
    const needFullSync = localMenu.length === 0 || !syncVersion;

    const response = await getJson(
        MENU_SYNC_URL,
        needFullSync ? {} : { since: syncVersion },
        buildMockSyncResponse(syncVersion),
    );

    if (!response || response.success === false) {
        console.warn('[getMenu] menu sync failed; keep local menu unchanged.');
        return localMenu.map(toDish);
    }

    if (response.mode === 'fullsync') {
        await applyFullSync(response);
    } else if (response.mode === 'incremental') {
        // 无本地菜单或无 sync_version 时必须 Full Sync；若后端仍返回增量，视为契约异常，不做合并。
        if (needFullSync) {
            console.warn('[getMenu] expected fullsync but got incremental; keep local menu unchanged.');
            return localMenu.map(toDish);
        }
        await applyIncremental(response);
    } else {
        console.warn('[getMenu] unknown sync mode:', response.mode);
    }

    return readLocalMenu().map(toDish);
};

/**
 * 数据域增量同步引擎（供各 getXxx API 复用，机制与 getMenu.js 一致）。
 *
 * 每个数据域拥有完全独立的全局版本号（IndexedDB meta 仓库记录 id），
 * 不同数据域之间不共用、不互相修改版本号与数据。
 *
 * 接口约定（GET <url>，参数全部走 query params）：
 * - 有版本号时携带 since=<版本号>；无本地数据或无版本号时不带 since，执行 Full Sync。
 * - fullsync 响应：
 *   { success: true, mode: 'fullsync', version: number, [dataField]: Array }
 * - incremental 响应（changes 已按版本顺序排列）：
 *   {
 *     success: true,
 *     mode: 'incremental',
 *     version: number,
 *     changes: [
 *       { op: 'create', data: Record },
 *       { op: 'update', data: Partial<Record> },
 *       { op: 'delete', id: number }
 *     ]
 *   }
 * - 是否增量由后端决定，前端不判断版本差距；增量应用成功后才保存最新版本号。
 */
import { getJson } from '@/api/client';
import { getCached, putRecord, removeRecord, STORES } from '@/db/indexedDB';

export const createSyncApi = ({
    apiName,
    url,
    storeName,
    versionKey,
    dataField,
    mapRecord = (record) => record,
}) => {
    const readVersion = () => {
        const record = getCached(STORES.meta).find((item) => item.id === versionKey);
        return record ? record.value : 0;
    };

    const readLocal = () => getCached(storeName);

    const saveVersion = async (version) => {
        await putRecord(STORES.meta, { id: versionKey, value: version });
    };

    const applyFullSync = async (response) => {
        const data = Array.isArray(response[dataField]) ? response[dataField] : [];
        // Full Sync：获取完整数据、覆盖本地数据并更新版本号。
        const current = readLocal().slice();
        for (const item of current) {
            await removeRecord(storeName, item.id);
        }
        for (const item of data) {
            await putRecord(storeName, item);
        }
        await saveVersion(response.version);
    };

    const applyIncremental = async (response) => {
        const changes = Array.isArray(response.changes) ? response.changes : [];
        // changes 由后端按版本顺序返回，逐条应用。
        for (const change of changes) {
            const op = change && change.op;
            if (op === 'create') {
                await putRecord(storeName, change.data);
            } else if (op === 'update') {
                // update 只合并返回字段，其余字段保持不变；本地不存在该记录时忽略。
                const existing = readLocal().find((item) => item.id === change.data.id);
                if (existing) {
                    await putRecord(storeName, { ...existing, ...change.data });
                }
            } else if (op === 'delete') {
                const id = change.id != null ? change.id : change.data && change.data.id;
                if (id != null) {
                    await removeRecord(storeName, id);
                }
            }
        }
        await saveVersion(response.version);
    };

    // 开发环境 mock 回退：无 since 时模拟 fullsync（保持当前本地数据），有 since 时模拟空增量。
    const buildMockSyncResponse = (syncVersion) => {
        if (syncVersion) {
            return { success: true, mode: 'incremental', version: syncVersion + 1, changes: [] };
        }
        return { success: true, mode: 'fullsync', version: 1, [dataField]: readLocal() };
    };

    const sync = async () => {
        const syncVersion = readVersion();
        const localData = readLocal();
        const needFullSync = localData.length === 0 || !syncVersion;

        const response = await getJson(
            url,
            needFullSync ? {} : { since: syncVersion },
            buildMockSyncResponse(syncVersion),
        );

        if (!response || response.success === false) {
            console.warn(`[${apiName}] sync failed; keep local data unchanged.`);
            return localData.map(mapRecord);
        }

        if (response.mode === 'fullsync') {
            await applyFullSync(response);
        } else if (response.mode === 'incremental') {
            // 无本地数据或无版本号时必须 Full Sync；若后端仍返回增量，视为契约异常，不做合并。
            if (needFullSync) {
                console.warn(`[${apiName}] expected fullsync but got incremental; keep local data unchanged.`);
                return localData.map(mapRecord);
            }
            await applyIncremental(response);
        } else {
            console.warn(`[${apiName}] unknown sync mode:`, response.mode);
        }

        return readLocal().map(mapRecord);
    };

    return sync;
};

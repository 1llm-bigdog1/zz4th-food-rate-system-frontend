/**
 * 新品建议增量同步（Advice，独立版本号 advice_version）。
 *
 * - 接口：GET /advice/sync
 * - Full Sync 响应：{ success, mode: 'fullsync', version, advices: Advice[] }
 * - 增量响应：{ success, mode: 'incremental', version, changes: [{ op: 'create'|'update'|'delete', data?, id? }] }
 * - 机制与 getMenu.js 一致，复用 src/db/indexedDB.js。
 */
import { createSyncApi } from '@/api/syncEngine';
import { STORES } from '@/db/indexedDB';
import Advice from '@/models/Advice';

const toAdvice = (record) =>
    new Advice(record.id, record.user_id, record.date, record.comment, record.like ?? 0, record.follow_comments ?? []);

export const getAdvice = createSyncApi({
    apiName: 'getAdvice',
    url: '/advice/sync',
    storeName: STORES.advices,
    versionKey: 'advice_version',
    dataField: 'advices',
    mapRecord: toAdvice,
});

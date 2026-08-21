/**
 * 严选分享增量同步（Selection，独立版本号 selection_version）。
 *
 * - 接口：GET /selection/sync
 * - Full Sync 响应：{ success, mode: 'fullsync', version, selections: Selection[] }
 * - 增量响应：{ success, mode: 'incremental', version, changes: [{ op: 'create'|'update'|'delete', data?, id? }] }
 * - 机制与 getMenu.js 一致，复用 src/db/indexedDB.js。
 */
import { createSyncApi } from '@/api/syncEngine';
import { STORES } from '@/db/indexedDB';
import Selection from '@/models/Selection';

const toSelection = (record) =>
    new Selection(
        record.id,
        record.user_id,
        record.date,
        record.comment,
        record.price ?? 0,
        record.position ?? [],
        record.rate ?? 0,
        record.follow_comments ?? [],
        record.nickname ?? '',
        record.rate_count ?? 0,
    );

export const getSelection = createSyncApi({
    apiName: 'getSelection',
    url: '/selection/sync',
    storeName: STORES.selections,
    versionKey: 'selection_version',
    dataField: 'selections',
    mapRecord: toSelection,
});

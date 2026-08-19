/**
 * 新品建议评论增量同步（AdviceComment，独立版本号 advice_comment_version）。
 *
 * - 接口：GET /advice-comments/sync
 * - Full Sync 响应：{ success, mode: 'fullsync', version, adviceComments: AdviceComment[] }
 * - 增量响应：{ success, mode: 'incremental', version, changes: [{ op: 'create'|'update'|'delete', data?, id? }] }
 * - 机制与 getMenu.js 一致，复用 src/db/indexedDB.js。
 */
import { createSyncApi } from '@/api/syncEngine';
import { STORES } from '@/db/indexedDB';
import AdviceComment from '@/models/AdviceComment';

const toAdviceComment = (record) =>
    new AdviceComment(
        record.id,
        record.user_id,
        record.date,
        record.advice_id,
        record.reply,
        record.parent_id ?? null,
        record.likes ?? 0,
    );

export const getAdviceComments = createSyncApi({
    apiName: 'getAdviceComments',
    url: '/advice-comments/sync',
    storeName: STORES.adviceComments,
    versionKey: 'advice_comment_version',
    dataField: 'adviceComments',
    mapRecord: toAdviceComment,
});

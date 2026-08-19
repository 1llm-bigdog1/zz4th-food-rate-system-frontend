/**
 * 严选分享评论增量同步（SelectionComment，独立版本号 selection_comment_version）。
 *
 * - 接口：GET /selection-comments/sync
 * - Full Sync 响应：{ success, mode: 'fullsync', version, selectionComments: SelectionComment[] }
 * - 增量响应：{ success, mode: 'incremental', version, changes: [{ op: 'create'|'update'|'delete', data?, id? }] }
 * - 机制与 getMenu.js 一致，复用 src/db/indexedDB.js。
 */
import { createSyncApi } from '@/api/syncEngine';
import { STORES } from '@/db/indexedDB';
import SelectionComment from '@/models/SelectionComment';

const toSelectionComment = (record) =>
    new SelectionComment(record.id, record.user_id, record.date, record.detail, record.selection_id, record.reply ?? null);

export const getSelectionComments = createSyncApi({
    apiName: 'getSelectionComments',
    url: '/selection-comments/sync',
    storeName: STORES.selectionComments,
    versionKey: 'selection_comment_version',
    dataField: 'selectionComments',
    mapRecord: toSelectionComment,
});

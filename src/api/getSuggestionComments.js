/**
 * 食堂建议评论增量同步（SuggestionComment，独立版本号 suggestion_comment_version）。
 *
 * - 接口：GET /suggestion-comments/sync
 * - Full Sync 响应：{ success, mode: 'fullsync', version, suggestionComments: SuggestionComment[] }
 * - 增量响应：{ success, mode: 'incremental', version, changes: [{ op: 'create'|'update'|'delete', data?, id? }] }
 * - 机制与 getMenu.js 一致，复用 src/db/indexedDB.js。
 */
import { createSyncApi } from '@/api/syncEngine';
import { STORES } from '@/db/indexedDB';
import SuggestionComment from '@/models/SuggestionComment';

const toSuggestionComment = (record) =>
    new SuggestionComment(
        record.id,
        record.user_id,
        record.date,
        record.suggestion_id,
        record.reply,
        record.parent_id ?? null,
        record.likes ?? 0,
        record.liked ?? false,
        record.nickname ?? '',
    );

export const getSuggestionComments = createSyncApi({
    apiName: 'getSuggestionComments',
    url: '/suggestion-comments/sync',
    storeName: STORES.suggestionComments,
    versionKey: 'suggestion_comment_version',
    dataField: 'suggestionComments',
    mapRecord: toSuggestionComment,
});

/**
 * 食堂建议增量同步（Suggestion，独立版本号 suggestion_version）。
 *
 * - 接口：GET /suggestion/sync
 * - Full Sync 响应：{ success, mode: 'fullsync', version, suggestions: Suggestion[] }
 * - 增量响应：{ success, mode: 'incremental', version, changes: [{ op: 'create'|'update'|'delete', data?, id? }] }
 * - 机制与 getMenu.js 一致，复用 src/db/indexedDB.js。
 */
import { createSyncApi } from '@/api/syncEngine';
import { STORES } from '@/db/indexedDB';
import Suggestion from '@/models/Suggestion';

const toSuggestion = (record) =>
    new Suggestion(
        record.id,
        record.user_id,
        record.date,
        record.comment,
        record.like ?? 0,
        record.follow_comments ?? [],
        record.liked ?? false,
        record.nickname ?? '',
    );

export const getSuggestion = createSyncApi({
    apiName: 'getSuggestion',
    url: '/suggestion/sync',
    storeName: STORES.suggestions,
    versionKey: 'suggestion_version',
    dataField: 'suggestions',
    mapRecord: toSuggestion,
});

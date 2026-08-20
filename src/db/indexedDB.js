/**
 * 本地 IndexedDB 封装（原生实现，不依赖任何第三方库）。
 *
 * - 仅用于浏览器端本地数据存储/缓存，不替代后端 API。
 * - 首次创建数据库时写入开发用测试数据；数据库已存在时不会重复初始化。
 * - 导出 clearTestData()：只删除首次初始化写入的测试记录，不影响用户后续产生的数据。
 */
import { toRaw } from 'vue';
import {
    createSeedDishes,
    createSeedSelections,
    createSeedSelectionComments,
    createSeedAdvices,
    createSeedAdviceComments,
    createSeedSuggestions,
    createSeedSuggestionComments,
    createSeedAccount,
} from '@/db/seedData';

export const DB_NAME = 'zz4th-blog-local-db';
export const DB_VERSION = 1;

export const STORES = {
    dishes: 'dishes',
    selections: 'selections',
    selectionComments: 'selectionComments',
    advices: 'advices',
    adviceComments: 'adviceComments',
    suggestions: 'suggestions',
    suggestionComments: 'suggestionComments',
    account: 'account',
    meta: 'meta',
};

const STORE_NAMES = Object.values(STORES);
const SEED_REGISTRY_KEY = 'seedRegistry';
const SEEDED_KEY = 'seeded';

// 内存缓存：应用启动时从 IndexedDB 一次性载入，页面同步读取；
// 写入先更新缓存保证 UI 即时响应，再异步持久化到 IndexedDB。
const cache = {};
STORE_NAMES.forEach((name) => {
    cache[name] = [];
});

let dbPromise = null;

const requestToPromise = (request) =>
    new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error('IndexedDB request failed'));
    });

const openDb = () => {
    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve, reject) => {
        if (typeof indexedDB === 'undefined') {
            console.warn('[local-db] IndexedDB unavailable; local persistence disabled.');
            resolve(null);
            return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = request.result;
            STORE_NAMES.forEach((name) => {
                if (!db.objectStoreNames.contains(name)) {
                    db.createObjectStore(name, { keyPath: 'id' });
                }
            });
            // 测试种子数据仅允许开发/mock 环境写入；生产环境不得出现测试数据。
            if (event.oldVersion === 0 && process.env.NODE_ENV !== 'production') {
                seedTestData(request.transaction);
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => {
            dbPromise = null;
            reject(request.error || new Error('Failed to open IndexedDB'));
        };
        request.onblocked = () => {
            console.warn('[local-db] IndexedDB open is blocked by another connection.');
        };
    });

    return dbPromise;
};

const seedTestData = (transaction) => {
    const registry = {};

    const putAll = (storeName, records) => {
        const store = transaction.objectStore(storeName);
        const ids = [];
        records.forEach((record) => {
            store.put(record);
            ids.push(record.id);
        });
        registry[storeName] = ids;
    };

    putAll(STORES.dishes, createSeedDishes());
    putAll(STORES.selections, createSeedSelections());
    putAll(STORES.selectionComments, createSeedSelectionComments());
    putAll(STORES.advices, createSeedAdvices());
    putAll(STORES.adviceComments, createSeedAdviceComments());
    putAll(STORES.suggestions, createSeedSuggestions());
    putAll(STORES.suggestionComments, createSeedSuggestionComments());
    putAll(STORES.account, [createSeedAccount()]);

    const metaStore = transaction.objectStore(STORES.meta);
    metaStore.put({ id: SEEDED_KEY, value: true });
    metaStore.put({ id: SEED_REGISTRY_KEY, value: registry });
};

const getAllFromStore = async (db, storeName) => {
    const transaction = db.transaction(storeName, 'readonly');
    return requestToPromise(transaction.objectStore(storeName).getAll());
};

const putToStore = async (db, storeName, record) => {
    const transaction = db.transaction(storeName, 'readwrite');
    return requestToPromise(transaction.objectStore(storeName).put(record));
};

const removeFromStore = async (db, storeName, id) => {
    const transaction = db.transaction(storeName, 'readwrite');
    return requestToPromise(transaction.objectStore(storeName).delete(id));
};

const updateCache = (storeName, record) => {
    const list = cache[storeName];
    if (!list) return;
    const index = list.findIndex((item) => item && item.id === record.id);
    if (index >= 0) {
        list[index] = record;
    } else {
        list.push(record);
    }
};

const removeFromCache = (storeName, id) => {
    const list = cache[storeName];
    if (!list) return;
    const index = list.findIndex((item) => item && item.id === id);
    if (index >= 0) {
        list.splice(index, 1);
    }
};

/** 打开数据库并把各表数据载入内存缓存，供页面同步读取。 */
export const initLocalData = async () => {
    const db = await openDb();
    if (!db) return;
    await Promise.all(
        STORE_NAMES.map(async (name) => {
            cache[name] = await getAllFromStore(db, name);
        }),
    );
};

/** 获取某个表的内存缓存数组（与 IndexedDB 保持同步）。 */
export const getCached = (storeName) => cache[storeName] || [];

/** 写入/更新一条本地记录（先更新缓存，再异步写入 IndexedDB）。 */
export const putRecord = async (storeName, record) => {
    const raw = toRaw(record);
    updateCache(storeName, raw);
    const db = await openDb();
    if (!db) return;
    try {
        await putToStore(db, storeName, raw);
    } catch (error) {
        console.warn(`[local-db] Failed to persist record in "${storeName}":`, error);
    }
};

/** 删除一条本地记录（先更新缓存，再异步从 IndexedDB 删除）。 */
export const removeRecord = async (storeName, id) => {
    removeFromCache(storeName, id);
    const db = await openDb();
    if (!db) return;
    try {
        await removeFromStore(db, storeName, id);
    } catch (error) {
        console.warn(`[local-db] Failed to delete record in "${storeName}":`, error);
    }
};

/** 删除首次初始化写入的测试数据，不影响用户后续产生的正式本地数据。 */
export const clearTestData = async () => {
    const db = await openDb();
    if (!db) return;

    const metaRecords = await getAllFromStore(db, STORES.meta);
    const registryRecord = metaRecords.find((item) => item.id === SEED_REGISTRY_KEY);
    const registry = (registryRecord && registryRecord.value) || {};

    await Promise.all(
        Object.entries(registry).map(async ([storeName, ids]) => {
            if (storeName === STORES.meta || !Array.isArray(ids) || !STORES[storeName]) {
                return;
            }
            await Promise.all(
                ids.map(async (id) => {
                    removeFromCache(storeName, id);
                    try {
                        await removeFromStore(db, storeName, id);
                    } catch (error) {
                        console.warn(`[local-db] Failed to clear test record "${id}" in "${storeName}":`, error);
                    }
                }),
            );
        }),
    );

    removeFromCache(STORES.meta, SEED_REGISTRY_KEY);
    removeFromCache(STORES.meta, SEEDED_KEY);

    const metaTransaction = db.transaction(STORES.meta, 'readwrite');
    metaTransaction.objectStore(STORES.meta).delete(SEED_REGISTRY_KEY);
    metaTransaction.objectStore(STORES.meta).delete(SEEDED_KEY);
    return requestToPromise(metaTransaction.objectStore(STORES.meta).get(SEED_REGISTRY_KEY));
};

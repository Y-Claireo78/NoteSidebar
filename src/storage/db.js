// src/storage/db.js
// 负责打开和初始化 IndexedDB 数据库

const DB_NAME = 'SideNoteDB';
const DB_VERSION = 1;

let dbInstance = null;

// 打开数据库（如果不存在则自动创建）
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        // 当数据库版本升级或首次创建时触发
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            // 如果不存在 "notebooks" 表（对象存储空间），则创建
            if (!db.objectStoreNames.contains('notebooks')) {
                // 使用 autoIncrement 自动生成 id
                const store = db.createObjectStore('notebooks', { keyPath: 'id', autoIncrement: true });
                // 为 name 字段创建索引，便于后续搜索
                store.createIndex('name', 'name', { unique: false });
                store.createIndex('createdAt', 'createdAt', { unique: false });
                console.log('✅ 数据表 "notebooks" 创建成功');
            }
        };

        request.onsuccess = (event) => {
            dbInstance = event.target.result;
            console.log('✅ 数据库连接成功');
            resolve(dbInstance);
        };

        request.onerror = (event) => {
            console.error('❌ 数据库打开失败', event.target.error);
            reject(event.target.error);
        };
    });
}

// 获取数据库实例（如果已打开则直接返回，否则重新打开）
function getDB() {
    if (dbInstance) {
        return Promise.resolve(dbInstance);
    }
    return openDB();
}
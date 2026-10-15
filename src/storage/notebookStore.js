// src/storage/notebookStore.js
// 依赖 db.js，提供笔记本的增删改查方法

// 创建一个新笔记本
function createNotebook(name) {
    return getDB().then(db => {
        return new Promise((resolve, reject) => {
            const tx = db.transaction('notebooks', 'readwrite');
            const store = tx.objectStore('notebooks');
            const data = {
                name: name.trim(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            const request = store.add(data);
            request.onsuccess = () => {
                console.log(`📓 笔记本 "${name}" 创建成功，ID: ${request.result}`);
                resolve(request.result); // 返回新生成的 id
            };
            request.onerror = () => {
                console.error('创建笔记本失败', request.error);
                reject(request.error);
            };
        });
    });
}

// 获取所有笔记本（按创建时间升序排列）
function getAllNotebooks() {
    return getDB().then(db => {
        return new Promise((resolve, reject) => {
            const tx = db.transaction('notebooks', 'readonly');
            const store = tx.objectStore('notebooks');
            // 使用索引按创建时间排序（越早的越靠前）
            const index = store.index('createdAt');
            const request = index.getAll();
            request.onsuccess = () => {
                resolve(request.result);
            };
            request.onerror = () => {
                reject(request.error);
            };
        });
    });
}

// （后续会用到重命名和删除，先预留接口）
// function renameNotebook(id, newName) { ... }
// function deleteNotebook(id) { ... }
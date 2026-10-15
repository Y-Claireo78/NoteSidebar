// src/sidebar/sidebar.js

// ----- 关闭按钮逻辑（继承第二步） -----
const closeBtn = document.getElementById('close-btn');
if (closeBtn) {
    closeBtn.addEventListener('click', function () {
        window.parent.postMessage({ type: 'CLOSE_SIDEBAR' }, '*');
    });
}

// ----- 核心：渲染笔记本列表 -----
async function renderNotebooks() {
    const listContainer = document.getElementById('notebook-list');
    try {
        const notebooks = await getAllNotebooks();
        listContainer.innerHTML = ''; // 清空列表

        if (!notebooks || notebooks.length === 0) {
            // 显示空状态提示
            const emptyItem = document.createElement('li');
            emptyItem.className = 'empty-hint';
            emptyItem.textContent = '📭 还没有笔记本，点击 “＋” 创建';
            listContainer.appendChild(emptyItem);
            return;
        }

        // 遍历并生成列表项
        notebooks.forEach((notebook, index) => {
            const li = document.createElement('li');
            li.textContent = notebook.name;
            li.dataset.id = notebook.id;
            // 默认选中第一个笔记本（方便测试）
            if (index === 0) {
                li.classList.add('active');
            }
            // 点击列表项时切换激活状态（后续绑定打开笔记本功能）
            li.addEventListener('click', function () {
                // 移除所有激活状态
                document.querySelectorAll('#notebook-list li').forEach(el => el.classList.remove('active'));
                this.classList.add('active');
                console.log(`📂 切换到笔记本: ${this.textContent} (ID: ${this.dataset.id})`);
                // TODO: 第四步将在这里加载对应笔记本的内容
            });
            listContainer.appendChild(li);
        });
    } catch (error) {
        console.error('渲染笔记本列表失败', error);
        listContainer.innerHTML = '<li style="color:red;">加载失败，请刷新页面</li>';
    }
}

// ----- 新建笔记本 -----
async function handleAddNotebook() {
    const name = prompt('📓 请输入新笔记本的名称：');
    if (!name || name.trim() === '') {
        return; // 用户取消或输入空值
    }
    try {
        await createNotebook(name.trim());
        // 重新渲染列表
        await renderNotebooks();
        // 自动点击第一个笔记本（模拟选中）
        const firstItem = document.querySelector('#notebook-list li:not(.empty-hint)');
        if (firstItem) {
            firstItem.click();
        }
    } catch (error) {
        alert('创建笔记本失败，请查看控制台错误');
        console.error(error);
    }
}

// ----- 绑定新建按钮事件 -----
const addBtn = document.getElementById('add-notebook-btn');
if (addBtn) {
    addBtn.addEventListener('click', handleAddNotebook);
}

// ----- 初始化：自动检查并创建默认笔记本（如果是首次使用） -----
async function initDefaultNotebook() {
    try {
        const notebooks = await getAllNotebooks();
        if (notebooks.length === 0) {
            console.log('🆕 首次使用，创建默认笔记本...');
            await createNotebook('📒 默认笔记本');
            await renderNotebooks(); // 重新渲染
            // 自动选中默认笔记本
            const firstItem = document.querySelector('#notebook-list li:not(.empty-hint)');
            if (firstItem) firstItem.click();
        }
    } catch (error) {
        console.error('初始化默认笔记本失败', error);
    }
}

// ----- 启动侧边栏 -----
(async function init() {
    console.log('✅ SideNote 侧边栏已启动');
    // 1. 先渲染列表
    await renderNotebooks();
    // 2. 如果没有笔记本，创建一个默认的
    await initDefaultNotebook();
})();
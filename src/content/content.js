// 清理旧元素
const oldTip = document.getElementById('side-note-test-tip');
if (oldTip) oldTip.remove();
const oldContainer = document.getElementById('side-note-container');
if (oldContainer) oldContainer.remove();
const oldToggle = document.getElementById('side-note-toggle');
if (oldToggle) oldToggle.remove();

// ----- 创建切换按钮 -----
const toggleBtn = document.createElement('div');
toggleBtn.id = 'side-note-toggle';
toggleBtn.textContent = '📝';
toggleBtn.style.cssText = `
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 36px;
    height: 72px;
    background: #4A90D9;
    color: white;
    border-radius: 8px 0 0 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 20px;
    box-shadow: -2px 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 2147483646;
    transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-family: Arial, sans-serif;
    user-select: none;
`;
document.body.appendChild(toggleBtn);

// ----- 创建侧边栏容器和 iframe -----
const container = document.createElement('div');
container.id = 'side-note-container';
container.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: 0;
    height: 100%;
    z-index: 2147483647;
    pointer-events: none;
    overflow: hidden;
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

const iframe = document.createElement('iframe');
iframe.src = chrome.runtime.getURL('src/sidebar/sidebar.html');
iframe.style.cssText = `
    width: 420px;
    height: 100%;
    border: none;
    pointer-events: auto;
    position: absolute;
    right: 0;
    top: 0;
`;
container.appendChild(iframe);
document.body.appendChild(container);

// ----- 状态与核心函数 -----
let isOpen = false;

// 展开侧边栏
function openSidebar() {
    isOpen = true;
    container.style.width = '420px';
    toggleBtn.style.right = '420px';
}

// 收起侧边栏
function closeSidebar() {
    isOpen = false;
    container.style.width = '0px';
    toggleBtn.style.right = '0px';
}

// 切换侧边栏（点击按钮时调用）
function toggleSidebar() {
    if (isOpen) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

// ----- 监听来自 iframe 的 postMessage 消息 -----
window.addEventListener('message', function(event) {
    // 为了安全，可以验证来源，但我们这里直接处理
    if (event.data && event.data.type === 'CLOSE_SIDEBAR') {
        closeSidebar();
    }
});

// ----- 按钮点击切换 -----
toggleBtn.addEventListener('click', toggleSidebar);

console.log('SideNote 内容脚本已注入);

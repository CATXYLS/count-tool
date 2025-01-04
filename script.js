// 预定义的浅色数组
const colors = [
    "#f0f8ff", "#fafad2", "#f5f5f5", "#f0fff0", "#f0ffff", "#f5f5dc", "#fdf5e6", "#fffaf0",
    "#fff8dc", "#fffacd", "#fff0f5", "#ffe4e1", "#ffe4b5", "#ffebcd", "#ffefd5", "#ffdab9",
    "#ffdead", "#faf0e6", "#f8f8ff", "#f5fffa", "#f0e68c", "#e6e6fa", "#e0ffff", "#dcdcdc",
    "#d3d3d3", "#d8bfd8", "#da70d6", "#dda0dd", "#deb887", "#e0eeee", "#e6e6fa", "#eee8aa",
    "#f0e68c", "#f5f5f5", "#f5fffa", "#f8f8ff", "#faf0e6", "#fafad2", "#fdf5e6", "#fff0f5",
    "#fff5ee", "#fff8dc", "#fffacd", "#fffaf0", "#ffffe0", "#fffff0", "#ffffff"
];

// 存储计数器的数据
const counters = {};
const quantityHistory = [];

// 悬浮窗元素
const modal = document.getElementById('quantity-modal');
const closeModal = document.querySelector('.close');

// 打开悬浮窗
function openModal(title) {
    const quantityItems = document.getElementById('quantity-items');
    quantityItems.innerHTML = ''; // 清空列表

    // 过滤当前计数器的数量记录
    const filteredHistory = quantityHistory.filter(item => item.title === title);

    // 显示数量记录
    filteredHistory.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.title}: ${item.quantity > 0 ? '+' : ''}${item.quantity}`;
        quantityItems.appendChild(li);
    });

    // 计算总数
    document.getElementById('total-quantity').textContent = filteredHistory.reduce((sum, item) => sum + item.quantity, 0);

    // 生成算术式
    generateArithmeticExpression(filteredHistory);

    // 显示悬浮窗
    modal.style.display = 'flex';
}

// 生成算术式
function generateArithmeticExpression(history) {
    const quantityMap = new Map();

    // 统计每个数量的出现次数
    history.forEach(item => {
        if (quantityMap.has(item.quantity)) {
            quantityMap.set(item.quantity, quantityMap.get(item.quantity) + 1);
        } else {
            quantityMap.set(item.quantity, 1);
        }
    });

    // 生成算术式
    let expression = '';
    quantityMap.forEach((count, quantity) => {
        if (count > 1) {
            expression += `${count}*${quantity}+`;
        } else {
            expression += `${quantity}+`;
        }
    });

    // 去掉最后一个加号
    expression = expression.slice(0, -1);

    // 显示算术式
    const arithmeticExpression = document.getElementById('arithmetic-expression');
    arithmeticExpression.value = expression;
}

// 复制算术式
document.getElementById('copy-arithmetic').addEventListener('click', function () {
    const arithmeticExpression = document.getElementById('arithmetic-expression');
    arithmeticExpression.select();
    document.execCommand('copy');
    alert('算术式已复制到剪贴板！');
});

// 关闭悬浮窗
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// 点击悬浮窗外部关闭
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// 添加计数器的函数
function addCounter() {
    const titleInput = document.getElementById('counter-title');
    const quantityInput = document.getElementById('counter-quantity');
    const title = titleInput.value.trim();
    let quantity = parseInt(quantityInput.value);

    if (title === '') {
        alert('请输入有效的自定义内容！');
        return;
    }

    if (isNaN(quantity)) {
        const confirmZero = confirm('你确定没有数量吗？点击“确定”按 0 录入，点击“取消”返回修改。');
        if (confirmZero) {
            quantity = 0;
        } else {
            return;
        }
    }

    const countersContainer = document.getElementById('counters');

    if (counters[title]) {
        counters[title].count += 1; // 计数 +1
        counters[title].countSpan.textContent = counters[title].count;
        counters[title].quantity += quantity; // 数量累加
        counters[title].quantitySpan.textContent = `数量: ${counters[title].quantity}`;
    } else {
        // 创建计数器容器
        const counterDiv = document.createElement('div');
        counterDiv.className = 'counter';
        counterDiv.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]; // 随机分配浅色背景

        // 创建自定义标题
        const counterTitle = document.createElement('h3');
        counterTitle.textContent = title;

        // 创建计数显示
        const countSpan = document.createElement('span');
        countSpan.textContent = '1'; // 默认计数为 1

        // 创建数量显示
        const quantitySpan = document.createElement('span');
        quantitySpan.textContent = `数量: ${quantity}`;

        // 创建+1按钮
        const incrementButton = document.createElement('button');
        incrementButton.textContent = '+1';
        incrementButton.addEventListener('click', function () {
            countSpan.textContent = parseInt(countSpan.textContent) + 1;
            counters[title].count += 1;
        });

        // 创建-1按钮
        const decrementButton = document.createElement('button');
        decrementButton.textContent = '-1';
        decrementButton.addEventListener('click', function () {
            countSpan.textContent = parseInt(countSpan.textContent) - 1;
            counters[title].count -= 1;
        });

        // 创建重置按钮
        const resetButton = document.createElement('button');
        resetButton.textContent = '重置';
        resetButton.addEventListener('click', function () {
            countSpan.textContent = '1'; // 重置为 1
            counters[title].count = 1;
        });

        // 创建删除按钮
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '删除';
        deleteButton.addEventListener('click', function () {
            countersContainer.removeChild(counterDiv);
            delete counters[title];
        });

        // 创建显示数量列表按钮
        const showListButton = document.createElement('button');
        showListButton.className = 'show-list-button';
        showListButton.textContent = '显示列表';
        showListButton.addEventListener('click', () => openModal(title));

        // 创建控制按钮容器
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'controls';
        controlsDiv.appendChild(countSpan);
        controlsDiv.appendChild(incrementButton);
        controlsDiv.appendChild(decrementButton);
        controlsDiv.appendChild(resetButton);
        controlsDiv.appendChild(deleteButton);

        // 将标题和控制按钮添加到计数器容器中
        counterDiv.appendChild(counterTitle);
        counterDiv.appendChild(quantitySpan);
        counterDiv.appendChild(controlsDiv);
        counterDiv.appendChild(showListButton);

        // 将计数器容器添加到页面中
        countersContainer.appendChild(counterDiv);

        // 存储计数器数据
        counters[title] = { count: 1, countSpan, quantity, quantitySpan };
    }

    // 记录数量变化
    quantityHistory.push({ title, quantity });

    // 清空输入框并将焦点切换回“输入自定义内容”
    titleInput.value = '';
    quantityInput.value = '';
    titleInput.focus();
}

// 点击按钮添加计数器
document.getElementById('add-counter').addEventListener('click', addCounter);

// 按下回车键添加计数器
document.getElementById('counter-quantity').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        addCounter();
    }
});
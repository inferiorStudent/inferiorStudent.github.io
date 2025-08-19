document.addEventListener('DOMContentLoaded', function () {
    // --- 主题切换 ---
    const themeSwitcher = document.querySelector('.theme-switcher');
    const html = document.documentElement;
    const currentTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', currentTheme);

    themeSwitcher.addEventListener('click', () => {
        const targetTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', targetTheme);
        localStorage.setItem('theme', targetTheme);
    });

    // --- 搜索功能 ---
    const searchTrigger = document.querySelector('.search-trigger');
    const searchModal = document.getElementById('search-modal');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    let searchData = null;

    // 获取搜索数据
    async function fetchSearchData() {
        try {
            const response = await fetch('/search.xml'); // 对应 _config.yml 的路径
            const text = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, 'text/xml');
            const entries = xmlDoc.getElementsByTagName('entry');
            searchData = Array.from(entries).map(entry => ({
                title: entry.getElementsByTagName('title')[0].textContent,
                url: entry.getElementsByTagName('url')[0].textContent,
                content: entry.getElementsByTagName('content')[0].textContent
            }));
        } catch (error) {
            console.error('Failed to load search data:', error);
        }
    }

    function performSearch(query) {
        if (!query || !searchData) {
            searchResults.innerHTML = '';
            return;
        }
        const lowerCaseQuery = query.toLowerCase();
        const results = searchData.filter(item =>
            item.title.toLowerCase().includes(lowerCaseQuery) ||
            item.content.toLowerCase().includes(lowerCaseQuery)
        ).slice(0, 10); // 只显示前10条结果

        searchResults.innerHTML = results.length
            ? `<ul>${results.map(item => `<li><a href="${item.url}">${item.title}</a></li>`).join('')}</ul>`
            : '<p>没有找到相关内容</p>';
    }
    
    // 打开搜索框
    searchTrigger.addEventListener('click', () => {
        if (!searchData) fetchSearchData();
        searchModal.style.display = 'flex';
        searchInput.focus();
    });

    // Ctrl+K 快捷键
    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            if (!searchData) fetchSearchData();
            searchModal.style.display = 'flex';
            searchInput.focus();
        }
        if(e.key === 'Escape') {
            searchModal.style.display = 'none';
        }
    });
    
    // 关闭搜索框
    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) {
            searchModal.style.display = 'none';
        }
    });

    searchInput.addEventListener('input', () => {
        performSearch(searchInput.value);
    });
});

// markdown 提示框
document.addEventListener('DOMContentLoaded', () => {
    // 检查是否存在帖子内容区域
    const postBody = document.querySelector('.post-body');
    if (!postBody) return;

    // 查找所有以 > [! 开头的引用块
    const blockquotes = postBody.querySelectorAll('blockquote');

    blockquotes.forEach(quote => {
        const firstParagraph = quote.querySelector('p:first-of-type');
        if (firstParagraph) {
            const content = firstParagraph.textContent.trim();
            // 使用正则表达式匹配 [!...] 语法
            const match = content.match(/^\[!(NOTE|WARNING|DANGER|INFO)\]/);
            
            if (match) {
                // 找到匹配的类型，例如 "NOTE"
                const type = match[1].toLowerCase();
                // 在 blockquote 上添加 data 属性
                quote.setAttribute('data-alert-type', type);
                // 移除 Markdown 标记文本，使其不显示在页面上
                firstParagraph.textContent = firstParagraph.textContent.replace(match[0], '').trim();
                // 如果移除后p标签为空，移除p标签本身
                if (!firstParagraph.textContent) {
                    firstParagraph.remove();
                }
            }
        }
    });
});
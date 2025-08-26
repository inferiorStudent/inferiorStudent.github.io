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

    // --- TOC 功能 ---
    const tocContainer = document.getElementById('toc-container');
    if (tocContainer) {
        const tocToggleBtn = document.getElementById('toc-toggle-btn');
        const tocLinks = tocContainer.querySelectorAll('.toc-list-link');
        const headings = document.querySelectorAll('.post-body h1, .post-body h2, .post-body h3, .post-body h4, .post-body h5, .post-body h6');

        // 切换TOC的展开和收起
        tocToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            tocContainer.classList.toggle('collapsed');
            if (tocContainer.classList.contains('collapsed')) {
                tocToggleBtn.textContent = '☰';
            } else {
                tocToggleBtn.textContent = '✕';
            }
        });
        
        // 点击页面其他地方收起TOC
        document.addEventListener('click', (e) => {
            if (!tocContainer.contains(e.target) && !tocContainer.classList.contains('collapsed')) {
                tocContainer.classList.add('collapsed');
                tocToggleBtn.textContent = '☰';
            }
        });

        // 平滑滚动
        tocLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                // Forcing collapse after click on mobile or small screens can be a good UX
                if (window.innerWidth < 768) {
                    tocContainer.classList.add('collapsed');
                    tocToggleBtn.textContent = '☰';
                }
            });
        });

        // 滚动时高亮当前TOC项
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const id = entry.target.getAttribute('id');
                const tocLink = document.querySelector(`.toc-list-link[href="#${id}"]`);
                if (entry.isIntersecting) {
                    tocLinks.forEach(link => link.classList.remove('active'));
                    if (tocLink) {
                        tocLink.classList.add('active');
                    }
                }
            });
        }, { rootMargin: "0px 0px -80% 0px" });

        headings.forEach(heading => {
            observer.observe(heading);
        });
    }
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
document.addEventListener('DOMContentLoaded', () => {
  const postContent = document.querySelector('.post-content');
  if (postContent) {
    const tocList = document.getElementById('toc-list');
    const headers = postContent.querySelectorAll('h1, h2, h3, h4, h5, h6');

    headers.forEach((header, index) => {
      // 为每个标题生成一个唯一的ID
      const id = `toc-heading-${index}`;
      header.setAttribute('id', id);

      // 创建目录项
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${id}`;
      a.textContent = header.textContent;
      li.appendChild(a);

      // 根据标题级别添加缩进
      const level = parseInt(header.tagName.substring(1));
      if (level > 1) {
          li.style.paddingLeft = `${(level - 1) * 15}px`;
      }
      
      tocList.appendChild(li);
    });

    // 为目录链接添加平滑滚动
    tocList.addEventListener('click', (event) => {
      if (event.target.tagName === 'A' && event.target.hash) {
        event.preventDefault();
        const targetId = event.target.hash;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 20, // 减去一些像素以避免被顶部遮挡
            behavior: 'smooth'
          });
        }
      }
    });
  }
});
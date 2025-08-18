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
        if (header.tagName === 'H2') li.style.paddingLeft = '15px';
        if (header.tagName === 'H3') li.style.paddingLeft = '30px';
        
        tocList.appendChild(li);
      });
    }
  });
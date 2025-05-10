const notes = [
    { title: "数学笔记", path: "notes/math.md"  },
    { title: "编程笔记", path: "notes/coding.md"  }
];

// 生成目录
function buildNav() {
    const list = document.getElementById('note-list'); 
    notes.forEach(note  => {
        const li = document.createElement('li'); 
        li.innerHTML  = `<a href="#" onclick="loadNote('${note.path}')">${note.title}</a>`; 
        list.appendChild(li); 
    });
}

// 加载并渲染Markdown
function loadNote(path) {
    fetch(path)
        .then(res => res.text()) 
        .then(md => {
            document.getElementById('content').innerHTML  = marked.parse(md); 
            MathJax.typesetPromise();  // 重新渲染公式
        });
}

// 初始化
window.onload  = () => {
    buildNav();
    if (location.hash)  {
        loadNote(decodeURIComponent(location.hash.substr(1))); 
    } else {
        loadNote(notes[0].path);
    }
};

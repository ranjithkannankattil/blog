(function(){
  const listEl   = document.getElementById('archive');
  const countEl  = document.getElementById('result-count');
  const searchEl = document.getElementById('search-input');
  const tagEl    = document.getElementById('tag-filter');
  const blogEl   = document.getElementById('blog-filter');

  const SRC_LABEL = { blogspot: "Blog", facebook: "Facebook", original: "Original" };

  function blogLabel(post){
    return post.blog || SRC_LABEL[post.source] || post.source;
  }

  function populateTags(){
    const tags = new Set();
    const blogs = new Set();
    POSTS.forEach(p => {
      (p.tags || []).forEach(t => tags.add(t));
      if (p.blog) blogs.add(p.blog);
    });
    [...tags].sort().forEach(t => {
      const opt = document.createElement('option');
      opt.value = t; opt.textContent = t;
      tagEl.appendChild(opt);
    });
    [...blogs].sort().forEach(b => {
      const opt = document.createElement('option');
      opt.value = b; opt.textContent = b;
      blogEl.appendChild(opt);
    });
  }

  function matches(post, query, tag, blog){
    if (blog && post.blog !== blog) return false;
    if (tag && !(post.tags || []).includes(tag)) return false;
    if (!query) return true;
    const hay = [
      post.title_ml, post.title_en,
      (post.tags || []).join(' '),
      (post.body || []).join(' ')
    ].join(' ').toLowerCase();
    return hay.includes(query.toLowerCase());
  }

  function render(){
    const query = searchEl.value.trim();
    const tag   = tagEl.value;
    const blog  = blogEl.value;
    const filtered = POSTS.filter(p => matches(p, query, tag, blog));

    countEl.textContent = filtered.length + (filtered.length === 1 ? " post" : " posts")
      + (query || tag || blog ? " found" : " total");

    listEl.innerHTML = '';
    if (filtered.length === 0){
      listEl.innerHTML = '<p style="color:var(--ink-soft); font-family:var(--f-mono); font-size:.85rem;">No posts match. Try another word or clear the filters.</p>';
      return;
    }

    const byYear = {};
    filtered.forEach(p => {
      const y = p.date.slice(0,4);
      (byYear[y] = byYear[y] || []).push(p);
    });

    Object.keys(byYear).sort((a,b)=>b-a).forEach(year => {
      const group = document.createElement('div');
      group.className = 'year-group';
      const h2 = document.createElement('h2');
      h2.textContent = year;
      group.appendChild(h2);

      const ul = document.createElement('ul');
      ul.className = 'entry-list';
      byYear[year].forEach(p => {
        const li = document.createElement('li');
        li.className = 'entry';
        li.innerHTML = `
          <time>${p.date}</time>
          <a class="title" href="writing-post.html?slug=${encodeURIComponent(p.slug)}">
            ${p.title_ml}${p.title_en ? ` <span class="en">— ${p.title_en}</span>` : ''}
          </a>
          <span class="src">${blogLabel(p)}</span>
        `;
        ul.appendChild(li);
      });
      group.appendChild(ul);
      listEl.appendChild(group);
    });
  }

  populateTags();
  searchEl.addEventListener('input', render);
  tagEl.addEventListener('change', render);
  blogEl.addEventListener('change', render);
  render();
})();

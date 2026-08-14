(function(){
  const listEl   = document.getElementById('archive');
  const countEl  = document.getElementById('result-count');
  const searchEl = document.getElementById('search-input');
  const tagEl    = document.getElementById('tag-filter');
  const popularEl = document.getElementById('popular-tags');
  const activeEl   = document.getElementById('active-filters');
  const backTop    = document.getElementById('back-to-top');
  const randomEl   = document.getElementById('random-post');

  const FORM_TAG = { 'ഗദ്യം': 'Prose', 'കവിത': 'Poem' };

  function syncURL(query, tag){
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (tag)   params.set('tag', tag);
    const qs = params.toString();
    history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
  }

  function readURL(){
    const params = new URLSearchParams(location.search);
    return { q: params.get('q') || '', tag: params.get('tag') || '' };
  }

  function topTags(n){
    const counts = {};
    POSTS.forEach(p => (p.tags||[]).forEach(t => counts[t] = (counts[t]||0)+1));
    return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,n).map(e=>e[0]);
  }

  function populateTags(){
    const tags = new Set();
    POSTS.forEach(p => (p.tags || []).forEach(t => tags.add(t)));
    [...tags].sort().forEach(t => {
      const opt = document.createElement('option');
      opt.value = t; opt.textContent = t;
      tagEl.appendChild(opt);
    });

    topTags(10).forEach(t => {
      const btn = document.createElement('button');
      btn.className = 'chip-btn';
      btn.textContent = t;
      btn.dataset.tag = t;
      btn.addEventListener('click', () => {
        tagEl.value = (tagEl.value === t) ? '' : t;
        render();
      });
      popularEl.appendChild(btn);
    });
  }

  function renderActiveFilters(query, tag){
    activeEl.innerHTML = '';
    const pills = [];
    if (query) pills.push({label:`“${query}”`, clear:()=>{searchEl.value='';}});
    if (tag)   pills.push({label:tag, clear:()=>{tagEl.value='';}});
    pills.forEach(p => {
      const span = document.createElement('span');
      span.className = 'filter-pill';
      span.innerHTML = `${p.label} <button aria-label="Remove filter">×</button>`;
      span.querySelector('button').addEventListener('click', () => { p.clear(); render(); });
      activeEl.appendChild(span);
    });
    if (pills.length){
      const clearAll = document.createElement('button');
      clearAll.className = 'clear-all';
      clearAll.textContent = 'Clear all';
      clearAll.addEventListener('click', () => {
        searchEl.value=''; tagEl.value='';
        render();
      });
      activeEl.appendChild(clearAll);
    }
    [...popularEl.children].forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tag === tag);
    });
  }

  function matches(post, query, tag){
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
    const filtered = POSTS.filter(p => matches(p, query, tag));

    renderActiveFilters(query, tag);
    syncURL(query, tag);

    countEl.textContent = filtered.length + (filtered.length === 1 ? " post" : " posts")
      + (query || tag ? " found" : " total");

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
      h2.innerHTML = `${year} <span class="year-count">${byYear[year].length} post${byYear[year].length===1?'':'s'}</span>`;
      group.appendChild(h2);

      const ul = document.createElement('ul');
      ul.className = 'entry-list';
      byYear[year].forEach(p => {
        const li = document.createElement('li');
        li.className = 'entry';
        const originalLink = p.source_url
          ? ` <a class="src-link" href="${p.source_url}" target="_blank" rel="noopener" title="Read original">↗</a>` : '';
        const form = (p.tags||[]).find(t => FORM_TAG[t]);
        const formBadge = form ? `<span class="form-badge">${FORM_TAG[form]}</span>` : '';
        li.innerHTML = `
          <time>${p.date}</time>
          <a class="title" href="writing-post.html?slug=${encodeURIComponent(p.slug)}">
            ${formBadge}${p.title_ml}${p.title_en ? ` <span class="en">— ${p.title_en}</span>` : ''}
          </a>${originalLink}
        `;
        ul.appendChild(li);
      });
      group.appendChild(ul);
      listEl.appendChild(group);
    });
  }

  window.addEventListener('scroll', () => {
    backTop.classList.toggle('show', window.scrollY > 800);
  });

  randomEl.addEventListener('click', (e) => {
    e.preventDefault();
    const pick = POSTS[Math.floor(Math.random() * POSTS.length)];
    location.href = `writing-post.html?slug=${encodeURIComponent(pick.slug)}`;
  });

  populateTags();
  const initial = readURL();
  searchEl.value = initial.q;
  tagEl.value = initial.tag;
  searchEl.addEventListener('input', render);
  tagEl.addEventListener('change', render);
  render();
})();

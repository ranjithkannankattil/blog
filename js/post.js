(function(){
  const main = document.getElementById('post-main');
  const SRC_LABEL = { blogspot: "Blog", facebook: "Facebook", original: "Original" };

  const slug = new URLSearchParams(location.search).get('slug');
  const chrono = [...POSTS].sort((a,b) => new Date(a.date) - new Date(b.date)); // oldest→newest
  const idx = chrono.findIndex(p => p.slug === slug);
  const post = chrono[idx];

  if (!post){
    main.innerHTML = `
      <p style="margin-top:2rem; font-family:var(--f-mono); font-size:.9rem; color:var(--ink-soft);">
        Post not found. <a href="writings.html" style="border-bottom:1px solid currentColor;">Back to the archive</a>.
      </p>`;
    return;
  }

  const prev = chrono[idx - 1]; // older
  const next = chrono[idx + 1]; // newer

  const related = POSTS.filter(p =>
    p.slug !== post.slug && (p.tags || []).some(t => (post.tags || []).includes(t))
  ).slice(0, 4);

  main.innerHTML = `
    <div class="post-meta">
      ${post.date}
      ${post.tags && post.tags.length ? '&nbsp;·&nbsp; ' + post.tags.join(', ') : ''}
      ${post.source_url ? `&nbsp;·&nbsp; <a href="${post.source_url}" target="_blank" rel="noopener" style="border-bottom:1px solid currentColor;">original ↗</a>` : ''}
    </div>
    <h1 class="post-title">${post.title_ml}${post.title_en ? `<br><span style="font-family:var(--f-body); font-style:italic; font-size:1.1rem; color:var(--ink-soft);">${post.title_en}</span>` : ''}</h1>
    <div class="post-body">
      ${post.body.map(p => `<p>${p}</p>`).join('')}
    </div>

    <div class="post-nav">
      <a href="${prev ? `writing-post.html?slug=${encodeURIComponent(prev.slug)}` : '#'}"
         style="${prev ? '' : 'visibility:hidden;'}">
        <span class="dir">← Earlier</span>${prev ? prev.title_ml : ''}
      </a>
      <a href="${next ? `writing-post.html?slug=${encodeURIComponent(next.slug)}` : '#'}"
         style="${next ? 'text-align:right;' : 'visibility:hidden; text-align:right;'}">
        <span class="dir">Later →</span>${next ? next.title_ml : ''}
      </a>
    </div>

    ${related.length ? `
      <div class="diamond-rule"><span class="diamond-mark">◆</span></div>
      <div class="related-list">
        <div class="post-meta">Related</div>
        <ul class="entry-list">
          ${related.map(p => `
            <li class="entry" style="grid-template-columns:6.5rem 1fr;">
              <time>${p.date}</time>
              <a class="title" href="writing-post.html?slug=${encodeURIComponent(p.slug)}">${p.title_ml}</a>
            </li>`).join('')}
        </ul>
      </div>` : ''}

    <p style="margin-top:2.5rem;">
      <a href="writings.html" style="font-family:var(--f-mono); font-size:.78rem; border-bottom:1px solid currentColor;">← Back to full archive</a>
    </p>
  `;

  document.title = post.title_ml + " — Writings — Ranjith";
})();

(function(){
  // Timeline bars: smooth-scroll to the matching company section and flash-highlight it
  document.querySelectorAll('.timeline-bar').forEach(bar => {
    bar.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById(bar.dataset.target);
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.classList.remove('cv-flash');
      // force reflow so the animation can restart if clicked again
      void target.offsetWidth;
      target.classList.add('cv-flash');
    });
  });

  // Collapse each role's bullet list to 2 items with a "Show more" toggle
  document.querySelectorAll('.cv-bullets').forEach(list => {
    const items = list.querySelectorAll('li');
    if (items.length <= 2) return; // nothing to collapse

    list.classList.add('is-collapsed');
    const btn = document.createElement('button');
    btn.className = 'cv-toggle';
    btn.type = 'button';
    btn.textContent = `Show ${items.length - 2} more →`;
    list.insertAdjacentElement('afterend', btn);

    btn.addEventListener('click', () => {
      const collapsed = list.classList.toggle('is-collapsed');
      btn.textContent = collapsed ? `Show ${items.length - 2} more →` : '← Show less';
    });
  });
})();

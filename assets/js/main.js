(() => {
  const sidebar = document.getElementById('sidebar');
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = [...document.querySelectorAll('.side-nav a')];

  // ---- mobile menu ----
  const setMenu = (open) => {
    sidebar.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? 'Close' : 'Menu';
  };
  menuBtn.addEventListener('click', () => setMenu(!sidebar.classList.contains('is-open')));
  navLinks.forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // ---- active section in side menu ----
  const byId = new Map(navLinks.map((a) => [a.getAttribute('href').slice(1), a]));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => a.classList.remove('is-active'));
      byId.get(entry.target.id)?.classList.add('is-active');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  byId.forEach((_, id) => {
    const el = document.getElementById(id);
    if (el) spy.observe(el);
  });

  // ---- publication filter ----
  const chips = document.querySelectorAll('.filter .chip');
  const pubs = document.querySelectorAll('#pubList .pub');
  chips.forEach((chip) => chip.addEventListener('click', () => {
    const f = chip.dataset.filter;
    chips.forEach((c) => c.classList.toggle('is-active', c === chip));
    pubs.forEach((p) => {
      const show = f === 'all' || p.dataset.tags.split(' ').includes(f);
      p.classList.toggle('is-hidden', !show);
    });
  }));

  // ---- copy email ----
  document.querySelectorAll('.copy').forEach((btn) => btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      btn.textContent = 'Copied';
    } catch {
      btn.textContent = 'Press ⌘C';
    }
    setTimeout(() => { btn.textContent = 'Copy'; }, 1600);
  }));

  // ---- scroll reveal ----
  const targets = document.querySelectorAll(
    '.sec-head, .stat, .interest-list li, .feature, .pub, .bring li, .skill-group, .tl-item, .course-cols > div, .docs li, .contact-big'
  );
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach((el) => { el.classList.add('reveal'); io.observe(el); });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();

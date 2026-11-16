/* Motion layer: kinetic hero, greeting rotator, count-ups, scroll reveals, progress bar. */
(function () {
  /* always open a page at the top (the viewer otherwise keeps the old scroll position) */
  try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {}
  var toTop = function () { if (!location.hash) window.scrollTo(0, 0); };
  toTop(); addEventListener('load', toTop); addEventListener('pageshow', toTop);
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  root.classList.add('js');
  if (reduce) root.classList.add('reduce');

  /* greeting rotator */
  var words = document.querySelectorAll('.greet-word i');
  if (words.length) {
    var i = 0;
    words[0].classList.add('on');
    if (!reduce) setInterval(function () {
      words[i].classList.remove('on'); words[i].classList.add('off');
      var prev = words[i];
      setTimeout(function () { prev.classList.remove('off'); }, 600);
      i = (i + 1) % words.length;
      words[i].classList.add('on');
    }, 2200);
  }

  /* reveal on scroll */
  var targets = document.querySelectorAll('.card, .section-head, .about, .figures-band, .proj section, .proj .shot, .facts, .band, .timeline, .results div');
  targets.forEach(function (el) { el.classList.add('rv'); });
  var grid = document.querySelectorAll('.grid .card');
  grid.forEach(function (c, n) { c.style.setProperty('--d', (n % 3) * 70 + 'ms'); });

  function countUp(el) {
    var end = +el.dataset.count, pre = el.dataset.prefix || '', t0 = null, dur = 1100;
    if (reduce) { el.textContent = pre + end; return; }
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + Math.round(end * e);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      e.target.querySelectorAll('[data-count]').forEach(countUp);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  targets.forEach(function (el) { io.observe(el); });

  /* reading progress on project pages */
  if (document.querySelector('.proj')) {
    var bar = document.createElement('div'); bar.className = 'progress'; bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    var tick = function () {
      var h = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')';
    };
    addEventListener('scroll', tick, { passive: true }); tick();
  }
})();

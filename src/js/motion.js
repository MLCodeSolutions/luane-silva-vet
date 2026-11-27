/* ==========================================================================
   motion.js — animações suaves do Modelo 3
   Reveals ao rolar, stagger por grupo e sombra do header sticky.
   Sem estado oculto inicial: o conteúdo continua visível se o JS falhar.
   ========================================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header + barra de progresso ---------- */

  var header = document.querySelector('.site-header');
  var progress = document.querySelector('[data-scroll-progress]');
  var ticking = false;

  function updateScrollUI() {
    var offset = window.pageYOffset || 0;

    if (header) header.classList.toggle('is-scrolled', offset > 8);

    if (progress) {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, offset / max) : 0) + ')';
    }

    ticking = false;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateScrollUI);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  window.addEventListener('load', updateScrollUI);
  updateScrollUI();

  /* ---------- Navegação ativa por seção ---------- */

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link[href^="#"]'));

  if (navLinks.length && 'IntersectionObserver' in window) {
    var byId = {};

    navLinks.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      if (id) byId[id] = link;
    });

    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var active = byId[entry.target.id];
        if (!active) return;

        navLinks.forEach(function (link) {
          link.classList.remove('is-active');
        });
        active.classList.add('is-active');
      });
    }, {
      rootMargin: '-45% 0px -50% 0px',
      threshold: 0
    });

    Object.keys(byId).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });
  }

  /* ---------- Reveals: respeitar movimento reduzido ---------- */

  if (reduceMotion) return;
  if (!('IntersectionObserver' in window)) return;

  var targets = document.querySelectorAll('[data-reveal]');
  var groups = document.querySelectorAll('[data-reveal-group]');

  Array.prototype.forEach.call(groups, function (group) {
    var step = parseInt(group.getAttribute('data-reveal-group'), 10);
    if (!step || step < 0) step = 70;

    var index = 0;

    Array.prototype.forEach.call(group.children, function (child) {
      if (!child.hasAttribute('data-reveal')) return;

      if (!child.hasAttribute('data-reveal-delay')) {
        child.style.setProperty('--reveal-delay', Math.min(index * step, 350) + 'ms');
      }

      index += 1;
    });
  });

  Array.prototype.forEach.call(targets, function (target) {
    var delay = target.getAttribute('data-reveal-delay');

    if (delay !== null && delay !== '') {
      var parsed = parseInt(delay, 10);
      if (!isNaN(parsed)) target.style.setProperty('--reveal-delay', parsed + 'ms');
    }
  });

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      revealObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0,
    rootMargin: '0px 0px -32px 0px'
  });

  Array.prototype.forEach.call(targets, function (target) {
    revealObserver.observe(target);
  });
}());

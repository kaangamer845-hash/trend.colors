/* =============================================
   Trend Colors — Landing interactions
   ============================================= */

(function () {
  'use strict';

  // -------- Sticky header shadow on scroll --------
  const header = document.getElementById('siteHeader');
  let lastScroll = 0;
  const onScroll = () => {
    const y = window.scrollY;
    if (y > 12) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
    lastScroll = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // -------- Mobile nav toggle --------
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');
  if (navToggle && navMobile) {
    navToggle.addEventListener('click', () => {
      const open = navMobile.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'Затвори меню' : 'Отвори меню');
    });
    navMobile.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        navMobile.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // -------- Reveal on scroll --------
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  // -------- Gallery videos: static posters; play only on click, muted --------
  const galleryVideos = document.querySelectorAll('.gallery-video');
  galleryVideos.forEach((v) => { v.muted = true; v.pause(); });

  // -------- Lightbox: enlarge gallery media on click; videos play/pause --------
  const lightbox = document.getElementById('lightbox');
  const lightboxInner = document.getElementById('lightboxInner');
  const lightboxClose = document.getElementById('lightboxClose');

  const playIcon = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';

  function openLightbox(node) {
    if (!lightbox) return;
    // pause all grid videos while enlarged
    galleryVideos.forEach((v) => v.pause());
    lightboxInner.innerHTML = '';
    lightboxInner.appendChild(node);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxInner.innerHTML = '';
    document.body.style.overflow = '';
  }

  // video tiles → open enlarged, unmuted, with controls (play/pause/seek)
  galleryVideos.forEach((v) => {
    const item = v.closest('.gallery-item');
    if (!item) return;
    item.classList.add('has-video');
    // hover play badge
    const badge = document.createElement('span');
    badge.className = 'gallery-play';
    badge.innerHTML = playIcon;
    item.appendChild(badge);
    // persistent corner hint
    const corner = document.createElement('span');
    corner.className = 'gallery-badge';
    corner.innerHTML = playIcon;
    item.appendChild(corner);

    item.addEventListener('click', () => {
      const big = document.createElement('video');
      big.src = v.getAttribute('src');
      big.controls = true;
      big.autoplay = true;
      big.loop = true;
      big.playsInline = true;
      big.muted = true; // без звук
      const tryPlay = () => { const p = big.play(); if (p && p.catch) p.catch(() => {}); };
      big.addEventListener('canplay', tryPlay, { once: true });
      openLightbox(big);
      tryPlay();
    });
  });

  // photo tiles → open enlarged
  document.querySelectorAll('.gallery-media').forEach((img) => {
    const item = img.closest('.gallery-item');
    if (!item) return;
    item.classList.add('has-photo');
    item.addEventListener('click', () => {
      const big = document.createElement('img');
      big.src = img.getAttribute('src');
      big.alt = img.getAttribute('alt') || '';
      openLightbox(big);
    });
  });

  if (lightbox) {
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  // -------- Smooth anchor offset for sticky header --------
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const headerH = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH + 1;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // -------- Footer year --------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

// Pike & West Theme JavaScript
// ============================
// Optimized for CSS Scroll-Snap gallery

document.addEventListener('DOMContentLoaded', function () {
  initMobileNav();
  initGalleryScrollButtons();
  initLightbox();
  initScrollAnimations();
});

// Mobile Navigation
function initMobileNav() {
  const hamburger = document.querySelector('.header__hamburger');
  const nav = document.querySelector('.header__nav');

  if (!hamburger || !nav) return;

  function closeMenu() {
    hamburger.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  }

  function openMenu() {
    hamburger.setAttribute('aria-expanded', 'true');
    nav.classList.add('is-open');
  }

  function toggleMenu() {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  hamburger.addEventListener('click', toggleMenu);

  // Close menu when clicking a link
  nav.querySelectorAll('.header__link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    if (isOpen && !nav.contains(e.target) && !hamburger.contains(e.target)) {
      closeMenu();
    }
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'Escape' &&
      hamburger.getAttribute('aria-expanded') === 'true'
    ) {
      closeMenu();
      hamburger.focus();
    }
  });

  // Close menu when viewport expands past mobile breakpoint
  const mobileBreakpoint = window.matchMedia('(max-width: 767px)');

  function handleBreakpointChange(e) {
    if (!e.matches) {
      closeMenu();
    }
  }

  if (mobileBreakpoint.addEventListener) {
    mobileBreakpoint.addEventListener('change', handleBreakpointChange);
  } else {
    // Legacy Safari (iOS < 14)
    mobileBreakpoint.addListener(handleBreakpointChange);
  }
}

// Gallery Scroll Buttons (for CSS scroll-snap gallery)
function initGalleryScrollButtons() {
  const track = document.getElementById('gallery-track');
  const prevBtn = document.querySelector('.venue-gallery__arrow--prev');
  const nextBtn = document.querySelector('.venue-gallery__arrow--next');

  if (!track || (!prevBtn && !nextBtn)) return;

  // Get slide width for scroll amount
  function getScrollAmount() {
    const slide = track.querySelector('.venue-gallery__slide');
    if (!slide) return 300;
    const style = getComputedStyle(track);
    const gap = parseInt(style.gap) || 16;
    return slide.offsetWidth + gap;
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      track.scrollBy({
        left: -getScrollAmount(),
        behavior: 'smooth',
      });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      track.scrollBy({
        left: getScrollAmount(),
        behavior: 'smooth',
      });
    });
  }
}

// Lightbox with WebP support
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxSourceWebp = document.getElementById('lightbox-source-webp');
  const closeBtn = lightbox?.querySelector('.lightbox__close');
  const galleryTrack = document.getElementById('gallery-track');

  if (!lightbox || !lightboxImage) return;

  // Use event delegation for better INP - single listener instead of many
  if (galleryTrack) {
    galleryTrack.addEventListener('click', (e) => {
      const img = e.target.closest('.venue-gallery__image');
      if (!img) return;

      const fullSrc = img.dataset.full || img.src;
      const fullSrcWebp = img.dataset.fullWebp || '';

      // Set WebP source if available
      if (lightboxSourceWebp && fullSrcWebp) {
        lightboxSourceWebp.srcset = fullSrcWebp;
      }

      lightboxImage.src = fullSrc;
      lightboxImage.alt = img.alt;
      lightbox.classList.add('lightbox--open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // Focus management for accessibility
      closeBtn?.focus();
    });
  }

  // Close lightbox
  function closeLightbox() {
    lightbox.classList.remove('lightbox--open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lightboxImage.src =
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    if (lightboxSourceWebp) {
      lightboxSourceWebp.srcset = '';
    }
  }

  closeBtn?.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('lightbox--open')) {
      closeLightbox();
    }
  });
}

// Scroll Animations (Fade-in on scroll)
function initScrollAnimations() {
  const fadeElements = document.querySelectorAll('.fade-in-up');

  if (fadeElements.length === 0) return;

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    fadeElements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach((el) => observer.observe(el));
}

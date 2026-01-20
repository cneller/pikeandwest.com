// Pike & West Theme JavaScript
// ============================

document.addEventListener('DOMContentLoaded', function () {
  initMobileNav();
  initGalleryCarousel();
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
      hamburger.focus(); // Return focus to hamburger for accessibility
    }
  });

  // Close menu when viewport expands past mobile breakpoint
  const mobileBreakpoint = window.matchMedia('(max-width: 767px)');

  function handleBreakpointChange(e) {
    // If we crossed INTO desktop (breakpoint no longer matches)
    if (!e.matches) {
      closeMenu();
    }
  }

  // Modern browsers
  if (mobileBreakpoint.addEventListener) {
    mobileBreakpoint.addEventListener('change', handleBreakpointChange);
  } else {
    // Legacy Safari (iOS < 14)
    mobileBreakpoint.addListener(handleBreakpointChange);
  }
}

// Gallery Carousel
function initGalleryCarousel() {
  const track = document.getElementById('gallery-track');
  const nav = document.getElementById('gallery-nav');

  if (!track || !nav) return;

  const slides = track.querySelectorAll('.venue-gallery__slide');
  const navBtns = nav.querySelectorAll('.venue-gallery__nav-btn');
  const prevBtn = document.querySelector('.venue-gallery__arrow--prev');
  const nextBtn = document.querySelector('.venue-gallery__arrow--next');

  if (slides.length === 0) return;

  let currentIndex = 0;
  const slideWidth = slides[0].offsetWidth + 16; // Width + gap
  const visibleSlides = Math.floor(
    track.parentElement.offsetWidth / slideWidth
  );
  const maxIndex = Math.max(0, slides.length - visibleSlides);

  function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

    // Update nav buttons
    navBtns.forEach((btn, i) => {
      btn.classList.toggle(
        'venue-gallery__nav-btn--active',
        i === currentIndex
      );
    });
  }

  // Nav button clicks
  navBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => goToSlide(i));
  });

  // Arrow clicks
  if (prevBtn) {
    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
  }

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  track.addEventListener(
    'touchend',
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    },
    { passive: true }
  );

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(currentIndex - 1);
      }
    }
  }
}

// Lightbox
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const closeBtn = lightbox?.querySelector('.lightbox__close');

  if (!lightbox || !lightboxImage) return;

  // Open lightbox on image click
  document.querySelectorAll('.venue-gallery__image').forEach((img) => {
    img.addEventListener('click', () => {
      const fullSrc = img.dataset.full || img.src;
      lightboxImage.src = fullSrc;
      lightboxImage.alt = img.alt;
      lightbox.classList.add('lightbox--open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close lightbox
  function closeLightbox() {
    lightbox.classList.remove('lightbox--open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lightboxImage.src = '';
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
    // Show all elements immediately for users who prefer reduced motion
    fadeElements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observerOptions = {
    root: null, // viewport
    rootMargin: '0px 0px -50px 0px', // Trigger slightly before fully in view
    threshold: 0.1, // 10% visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  fadeElements.forEach((el) => observer.observe(el));
}

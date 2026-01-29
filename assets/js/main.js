// Pike & West Theme JavaScript
// ============================
// Optimized for CSS Scroll-Snap gallery

document.addEventListener('DOMContentLoaded', function () {
  initMobileNav();
  initGalleryScrollButtons();
  initPhotoSwipe();
  initScrollAnimations();
  initLazyIframes();
  initContactShimmer();
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

// PhotoSwipe Gallery (replaces custom lightbox)
async function initPhotoSwipe() {
  const galleries = document.querySelectorAll('[data-pswp-gallery]');
  if (galleries.length === 0) return;

  try {
    // Dynamic import - only loads when galleries exist on page
    const { default: PhotoSwipeLightbox } = await import(
      'https://cdn.jsdelivr.net/npm/photoswipe@5/dist/photoswipe-lightbox.esm.min.js'
    );

    galleries.forEach((gallery) => {
      const lightbox = new PhotoSwipeLightbox({
        gallery: gallery,
        children: 'a[data-pswp-width]',
        pswpModule: () =>
          import(
            'https://cdn.jsdelivr.net/npm/photoswipe@5/dist/photoswipe.esm.min.js'
          ),
        // Luxury feel - slower, smoother animations
        showAnimationDuration: 300,
        hideAnimationDuration: 200,
        // Accessibility
        trapFocus: true,
        returnFocus: true,
        // Touch UX
        pinchToClose: true,
        closeOnVerticalDrag: true,
      });
      lightbox.init();
    });
  } catch (error) {
    // Graceful degradation - galleries remain as simple links to full images
    console.warn('PhotoSwipe failed to load:', error);
  }
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

// Lazy-load iframes with Intersection Observer
// Delays iframe loading until user scrolls near, improving initial page load
function initLazyIframes() {
  const lazyContainers = document.querySelectorAll('.iframe-lazy');

  if (lazyContainers.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '200px 0px', // Start loading 200px before visible
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const container = entry.target;
        const src = container.dataset.src;
        const title = container.dataset.title || 'Embedded content';
        const isMap = container.classList.contains('iframe-lazy--map');

        if (!src) return;

        // Create the iframe element
        const iframe = document.createElement('iframe');
        iframe.src = src;
        iframe.title = title;
        iframe.setAttribute('loading', 'lazy');
        iframe.setAttribute('frameborder', '0');

        if (isMap) {
          iframe.setAttribute('allowfullscreen', '');
          iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
          iframe.style.border = '0';
        } else {
          iframe.setAttribute('scrolling', 'no');
        }

        // Mark as loaded and insert iframe
        container.classList.add('iframe-lazy--loaded');
        container.appendChild(iframe);

        // Fade out placeholder after iframe loads
        const placeholder = container.querySelector('.iframe-placeholder');
        if (placeholder) {
          const hidePlaceholder = () => {
            placeholder.classList.add('iframe-placeholder--hidden');
            // Remove from DOM after fade completes
            setTimeout(() => placeholder.remove(), 300);
          };

          iframe.addEventListener('load', hidePlaceholder);
          // Fallback: fade out after timeout if load doesn't fire
          setTimeout(() => {
            if (
              placeholder.parentNode &&
              !placeholder.classList.contains('iframe-placeholder--hidden')
            ) {
              hidePlaceholder();
            }
          }, 5000);
        }

        observer.unobserve(container);
      }
    });
  }, observerOptions);

  lazyContainers.forEach((container) => observer.observe(container));
}

// Contact Form Shimmer
// Loads iframe on scroll, crossfades from shimmer
function initContactShimmer() {
  const shimmer = document.querySelector('.contact-shimmer');
  if (!shimmer) return;

  const src = shimmer.dataset.iframeSrc;
  const iframeContainer = shimmer.querySelector('.contact-shimmer__iframe');
  if (!src || !iframeContainer) return;

  // Load iframe when shimmer scrolls into view
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const iframe = document.createElement('iframe');
          iframe.src = src;
          iframe.title = 'Contact Form';
          iframe.setAttribute('scrolling', 'no');

          iframe.addEventListener('load', () => {
            shimmer.classList.add('contact-shimmer--loaded');
          });

          // Fallback: mark loaded after timeout
          setTimeout(() => {
            if (!shimmer.classList.contains('contact-shimmer--loaded')) {
              shimmer.classList.add('contact-shimmer--loaded');
            }
          }, 8000);

          iframeContainer.appendChild(iframe);
          observer.disconnect();
        }
      });
    },
    { rootMargin: '100px' }
  );

  observer.observe(shimmer);
}

// Pike & West Theme JavaScript
// ============================

document.addEventListener('DOMContentLoaded', function () {
  initMobileNav();
  initGalleryCarousel();
  initLightbox();
});

// Mobile Navigation
function initMobileNav() {
  const hamburger = document.querySelector('.header__hamburger');
  const nav = document.querySelector('.header__nav');

  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isOpen);
    nav.classList.toggle('is-open', !isOpen);
  });

  // Close menu when clicking a link
  nav.querySelectorAll('.header__link').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    });
  });
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

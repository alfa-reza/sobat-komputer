// Mobile menu toggle
const menuBtn = document.getElementById('menuBtn');
const navList = document.getElementById('navList');

menuBtn.addEventListener('click', () => {
  const isOpen = menuBtn.classList.toggle('open');
  navList.classList.toggle('show');
  menuBtn.setAttribute('aria-expanded', isOpen);
});

// Close menu when a nav link is clicked
navList.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    menuBtn.classList.remove('open');
    navList.classList.remove('show');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
});

// Close menu with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navList.classList.contains('show')) {
    menuBtn.classList.remove('open');
    navList.classList.remove('show');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.focus();
  }
});

// Back to top button
const backTop = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backTop.classList.add('visible');
  } else {
    backTop.classList.remove('visible');
  }
});

backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Highlight active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-list a');

function setActiveNav() {
  const scrollY = window.scrollY + 100;
  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector('.nav-list a[href="#' + id + '"]');
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
}

window.addEventListener('scroll', setActiveNav);
setActiveNav();

// Carousel Implementation
const promoSection = document.getElementById('promo');
if (promoSection) {
  const track = promoSection.querySelector('.carousel-track');
  const slides = Array.from(promoSection.querySelectorAll('.carousel-slide'));
  const nextBtn = promoSection.querySelector('.carousel-btn.next');
  const prevBtn = promoSection.querySelector('.carousel-btn.prev');
  const playPauseBtn = promoSection.querySelector('.play-pause');
  const dots = Array.from(promoSection.querySelectorAll('.indicator-dot'));
  const status = promoSection.querySelector('.carousel-status');
  const viewport = promoSection.querySelector('.carousel-viewport');

  let currentIndex = 0;
  let autoplayInterval = null;
  let isPaused = false;
  let userPaused = false;

  const totalSlides = slides.length;

  function updateCarousel(announce = false) {
    track.style.transform = `translateX(-${currentIndex * 25}%)`;

    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add('active');
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.classList.remove('active');
        dot.setAttribute('aria-current', 'false');
      }
    });

    slides.forEach((slide, index) => {
      if (index === currentIndex) {
        slide.setAttribute('aria-hidden', 'false');
        slide.querySelectorAll('a, button, input').forEach(el => el.removeAttribute('tabindex'));
      } else {
        slide.setAttribute('aria-hidden', 'true');
        slide.querySelectorAll('a, button, input').forEach(el => el.setAttribute('tabindex', '-1'));
      }
    });

    status.textContent = `${currentIndex + 1} / ${totalSlides}`;

    if (announce) {
      status.setAttribute('aria-live', 'polite');
    } else {
      status.setAttribute('aria-live', 'off');
    }
  }

  function nextSlide(announce = false) {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel(announce);
  }

  function prevSlide(announce = false) {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarousel(announce);
  }

  function goToSlide(index, announce = true) {
    currentIndex = index;
    updateCarousel(announce);
  }

  function startAutoplay() {
    stopAutoplay();
    if (userPaused || isPaused) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    autoplayInterval = setInterval(() => {
      nextSlide(false);
    }, 5000);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  nextBtn.addEventListener('click', () => {
    nextSlide(true);
    if (!userPaused) startAutoplay();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide(true);
    if (!userPaused) startAutoplay();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index, true);
      if (!userPaused) startAutoplay();
    });
  });

  function setPlayPauseState(pausedByBtn) {
    userPaused = pausedByBtn;
    if (userPaused) {
      stopAutoplay();
      playPauseBtn.setAttribute('aria-label', 'Putar carousel');
      playPauseBtn.setAttribute('aria-pressed', 'true');
      playPauseBtn.querySelector('.icon-pause').style.display = 'none';
      playPauseBtn.querySelector('.icon-play').style.display = 'block';
    } else {
      playPauseBtn.setAttribute('aria-label', 'Jeda carousel');
      playPauseBtn.setAttribute('aria-pressed', 'false');
      playPauseBtn.querySelector('.icon-pause').style.display = 'block';
      playPauseBtn.querySelector('.icon-play').style.display = 'none';
      startAutoplay();
    }
  }

  playPauseBtn.addEventListener('click', () => {
    setPlayPauseState(!userPaused);
  });

  viewport.addEventListener('mouseenter', () => {
    isPaused = true;
    stopAutoplay();
  });

  viewport.addEventListener('mouseleave', () => {
    isPaused = false;
    startAutoplay();
  });

  promoSection.addEventListener('focusin', () => {
    isPaused = true;
    stopAutoplay();
  });

  promoSection.addEventListener('focusout', () => {
    isPaused = false;
    startAutoplay();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  let touchStartX = 0;
  let touchEndX = 0;

  viewport.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        prevSlide(true);
      } else {
        nextSlide(true);
      }
      if (!userPaused) startAutoplay();
    }
  }, { passive: true });

  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    if (e.matches) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  updateCarousel(false);
  startAutoplay();
}

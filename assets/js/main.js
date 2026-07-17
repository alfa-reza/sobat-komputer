// Mobile menu toggle
const menuBtn = document.getElementById('menuBtn');
const navList = document.getElementById('navList');

menuBtn.addEventListener('click', () => {
  menuBtn.classList.toggle('open');
  navList.classList.toggle('show');
});

// Close menu when a nav link is clicked
navList.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    menuBtn.classList.remove('open');
    navList.classList.remove('show');
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

document.documentElement.classList.add("js-ready");

// Mobile menu toggle
const menuBtn = document.getElementById("menuBtn");
const navList = document.getElementById("navList");

if (menuBtn && navList) {
  menuBtn.addEventListener("click", () => {
    const isOpen = menuBtn.classList.toggle("open");
    navList.classList.toggle("show");
    menuBtn.setAttribute("aria-expanded", isOpen);
  });

  // Close menu when a nav link is clicked
  navList.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      menuBtn.classList.remove("open");
      navList.classList.remove("show");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      navList.classList.contains("show") &&
      !menuBtn.contains(e.target) &&
      !navList.contains(e.target)
    ) {
      menuBtn.classList.remove("open");
      navList.classList.remove("show");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });

  // Close menu with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navList.classList.contains("show")) {
      menuBtn.classList.remove("open");
      navList.classList.remove("show");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.focus();
    }
  });
}

// Back to top button
const backTop = document.getElementById("backTop");
if (backTop) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      backTop.classList.add("visible");
    } else {
      backTop.classList.remove("visible");
    }
  });

  backTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const initApp = () => {
  const hamburgerBtn = document.getElementById("hamburger-button");
  const mobileMenu = document.getElementById("mobile-menu");

  const toggleMenu = () => {
    // toggle for mobile menu
    mobileMenu.classList.remove("hidden"); // remove hidden on first click
    mobileMenu.classList.toggle("flex");
    mobileMenu.classList.toggle("animate-close-menu");
    mobileMenu.classList.toggle("animate-open-menu");

    // for hamburger menu
    hamburgerBtn.classList.toggle("toggle-btn");
  };

  hamburgerBtn.addEventListener("click", toggleMenu);
  mobileMenu.addEventListener("click", toggleMenu);
};

document.addEventListener("DOMContentLoaded", initApp);

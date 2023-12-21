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

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener("click", toggleMenu);
    mobileMenu.addEventListener("click", toggleMenu);
  }

  // for different operations
  const operationMenu = document.getElementById("operation-menu");
  const uploadBtn = document.getElementById("upload-button");

  const toggleOpMenu = () => {
    operationMenu.classList.toggle("hidden");
  };

  if (uploadBtn && operationMenu) {
    uploadBtn.addEventListener("click", toggleOpMenu);
    operationMenu.addEventListener("click", toggleOpMenu);
  }
};

document.addEventListener("DOMContentLoaded", initApp);

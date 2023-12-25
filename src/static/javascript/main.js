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

  // UPLOAD FILES (PDF manip section)
  // Listen to uploaded files
  const uploadInput = document.getElementById("file-upload");
  const listSection = document.getElementById("list-section");

  // check the file type
  function typeValidation(type) {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (allowedTypes.includes(type)) {
      return true;
    }
  }

  // append the uploaded file to the list
  function uploadFile(file) {
    listSection.style.display = "block";
    const newListItem = document.createElement("li");
    newListItem.innerHTML = file.name;
    listSection.appendChild(newListItem);
  }

  // if you can select the element
  if (uploadInput) {
    uploadInput.onchange = () => {
      console.log(uploadInput.files.length);
      [...uploadInput.files].forEach((file) => {
        if (typeValidation(file.type)) {
          uploadFile(file);
        }
      });
    };
  }
};

document.addEventListener("DOMContentLoaded", initApp);

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
  const uploadList = document.getElementById("list-section");
  const submitBtn = document.getElementById("submit-files");
  const deleteSection = document.getElementById("delete-area");
  const deleteList = document.getElementById("delete-list");

  let fileCount = 0;
  const fileArr = [];

  // check the file type
  function typeValidation(type) {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (allowedTypes.includes(type)) {
      return true;
    }
  }

  // append the uploaded file to the list
  function uploadFile(file) {
    uploadList.style.display = "block";
    deleteSection.style.display = "block";
    const newListItem = document.createElement("li");
    newListItem.setAttribute("id", fileCount);
    newListItem.innerHTML = file.name;
    uploadList.appendChild(newListItem);

    fileArr.push(file);
    console.log(fileArr);
    ++fileCount;
  }

  // if you can select the element
  if (uploadInput && submitBtn && deleteSection && deleteList) {
    // make the file upload list sortable
    let sortableList = Sortable.create(uploadList, {
      group: "shared",
      animation: 150,
    });

    // make upload and delete list draggable
    new Sortable(deleteList, {
      group: "shared",
      animation: 150,
    });

    // listen to uploaded files
    uploadInput.onchange = () => {
      console.log(uploadInput.files.length);
      [...uploadInput.files].forEach((file) => {
        if (typeValidation(file.type)) {
          uploadFile(file);
        }
      });
    };

    // submit the files for processing
    submitBtn.addEventListener("click", async (event) => {
      event.stopPropagation();

      // add each file into the form in correct order
      let listItems = uploadList.querySelectorAll("li");
      let data = new FormData();
      listItems.forEach(function (li, index) {
        // Print information about each <li>
        console.log(`Item ${index + 1} - ID: ${li.id}`);
        data.append("file_field", fileArr[li.id], fileArr[li.id].name);
      });

      // try submit the form
      try {
        const csrftoken = Cookies.get("csrftoken");
        const response = await fetch("/merge/", {
          method: "POST",
          headers: { "X-CSRFToken": csrftoken },
          mode: "same-origin", // Do not send CSRF token to another domain.
          body: data,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    });
  }
};

document.addEventListener("DOMContentLoaded", initApp);

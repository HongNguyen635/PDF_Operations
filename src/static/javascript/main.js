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

  // Listen to dropdown menu button
  const dropdownBtn = document.getElementById("dropdown-button");
  const dropdownMenu = document.getElementById("dropdown-menu");

  // if you can select the dropdown btn
  if (dropdownBtn && dropdownMenu) {
    dropdownBtn.addEventListener("click", () => {
      dropdownMenu.classList.toggle("hidden");
      dropdownMenu.classList.toggle("flex");
    });
  }

  ////////////////////////////////////
  // UPLOAD FILES (PDF manip section - combine)
  ////////////////////////////////////////////

  // Listen to uploaded files
  const uploadInput = document.getElementById("file-upload");
  const fileListSection = document.getElementById("uploaded-list");
  const uploadList = document.getElementById("list-section");
  const submitBtn = document.getElementById("submit-files");
  const deleteList = document.getElementById("delete-list");
  const resultFile = document.getElementById("result-download");

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
    submitBtn.style.display = "block";
    fileListSection.style.display = "flex";
    const newListItem = document.createElement("li");
    newListItem.setAttribute("id", fileCount);
    newListItem.setAttribute("class", "cursor-pointer py-1");
    newListItem.innerText = file.name;
    uploadList.appendChild(newListItem);

    fileArr.push(file);
    console.log(fileArr);
    ++fileCount;
  }

  // if you can select the upload, file list, and result elements
  if (
    uploadInput &&
    uploadList &&
    submitBtn &&
    fileListSection &&
    deleteList &&
    resultFile
  ) {
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
        } else {
          // if the process is ok, then show the result file
          resultFile.classList.toggle("hidden");
          resultFile.classList.toggle("flex");
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    });
  }

  ////////////////////////////////////////////
  // UPLOAD FILES (PDF manip section - compress)
  ////////////////////////////////////////////
  const compressInput = document.getElementById("upload-input-compress");
  const compressUploadedDiv = document.getElementById("uploaded-compress");
  const compressFileName = document.getElementById("compress-filename");
  const compressBtn = document.getElementById("compress-button");
  const compressDownload = document.getElementById("compress-result");
  let acceptedFile;

  // check if we can select the element
  if (
    compressInput &&
    compressUploadedDiv &&
    compressFileName &&
    compressBtn &&
    compressDownload
  ) {
    // check for uploaded pdf
    compressInput.onchange = () => {
      if (compressInput.files[0].type == "application/pdf") {
        compressBtn.style.display = "block";
        compressUploadedDiv.classList.remove("hidden");
        compressUploadedDiv.classList.add("flex");
        compressFileName.innerText = compressInput.files[0].name;
        acceptedFile = compressInput.files[0];
      }
    };

    // if submit the file for compress
    compressBtn.addEventListener("click", async (event) => {
      event.stopPropagation();

      const formData = new FormData();
      formData.append("file", acceptedFile);

      // try submit the form
      try {
        const csrftoken = Cookies.get("csrftoken");
        const response = await fetch("/compress/", {
          method: "POST",
          headers: { "X-CSRFToken": csrftoken },
          mode: "same-origin", // Do not send CSRF token to another domain.
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        } else {
          // if the process is ok, then show the result file
          compressDownload.classList.toggle("hidden");
          compressDownload.classList.toggle("flex");
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    });
  }

  ////////////////////////////////////////////
  // UPLOAD FILES (PDF manip section - watermark)
  ////////////////////////////////////////////
  const watermarkInputSource = document.getElementById(
    "upload-input-watermark-source"
  );
  const watermarkInputMark = document.getElementById(
    "upload-input-watermark-mark"
  );
  const watermarkUploadedSourceDiv = document.getElementById(
    "uploaded-watermark-source"
  );
  const watermarkUploadedMarkDiv = document.getElementById(
    "uploaded-watermark-mark"
  );
  const watermarkSourceFileName = document.getElementById(
    "watermark-source-filename"
  );
  const watermarkMarkFileName = document.getElementById(
    "watermark-mark-filename"
  );
  const watermarkBtn = document.getElementById("watermark-button");
  const watermarkDownload = document.getElementById("watermark-result");
  const errorMessage = document.getElementById("error-message");
  const acceptedFiles = [null, null];

  // check if we can select the element
  if (
    watermarkInputSource &&
    watermarkInputMark &&
    watermarkUploadedSourceDiv &&
    watermarkUploadedMarkDiv &&
    watermarkSourceFileName &&
    watermarkMarkFileName &&
    watermarkBtn &&
    watermarkDownload &&
    errorMessage
  ) {
    // check for uploaded source file
    watermarkInputSource.onchange = () => {
      if (watermarkInputSource.files[0].type == "application/pdf") {
        watermarkBtn.style.display = "block";
        watermarkUploadedSourceDiv.classList.remove("hidden");
        watermarkUploadedSourceDiv.classList.add("flex");
        watermarkSourceFileName.innerText = watermarkInputSource.files[0].name;
        acceptedFiles[0] = watermarkInputSource.files[0];
      }
    };

    // check for uploaded watermark file
    watermarkInputMark.onchange = () => {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (allowedTypes.includes(watermarkInputMark.files[0].type)) {
        watermarkUploadedMarkDiv.classList.remove("hidden");
        watermarkUploadedMarkDiv.classList.add("flex");
        watermarkMarkFileName.innerText = watermarkInputMark.files[0].name;
        acceptedFiles[1] = watermarkInputMark.files[0];
      }
    };

    // if submit the file for watermark
    watermarkBtn.addEventListener("click", async (event) => {
      event.stopPropagation();

      // if user didn't uploaded both files
      // each empty innerText result in undefined
      if (
        !watermarkSourceFileName.innerText ||
        !watermarkMarkFileName.innerText
      ) {
        errorMessage.classList.remove("hidden");
        errorMessage.classList.add("block");
        return;
      }

      const formData = new FormData();
      formData.append("source_file", acceptedFiles[0]);
      formData.append("watermark", acceptedFiles[1]);

      // try submit the form
      try {
        const csrftoken = Cookies.get("csrftoken");
        const response = await fetch("/watermark/", {
          method: "POST",
          headers: { "X-CSRFToken": csrftoken },
          mode: "same-origin", // Do not send CSRF token to another domain.
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        } else {
          // hide the error message
          errorMessage.classList.add("hidden");
          errorMessage.classList.remove("block");

          // if the process is ok, then show the result file
          watermarkDownload.classList.toggle("hidden");
          watermarkDownload.classList.toggle("flex");
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    });
  }

  ////////////////////////////////////////////
  // UPLOAD FILES (PDF manip section - encryption)
  ////////////////////////////////////////////
  const encryptInput = document.getElementById("upload-input-encrypt");
  const encryptUploadedDiv = document.getElementById("uploaded-encrypt");
  const encryptFileName = document.getElementById("encrypt-filename");
  const encryptPassword = document.getElementById("encrypt-password");
  const encryptPasswordRetype = document.getElementById(
    "encrypt-password-retype"
  );
  const checkShowPassword = document.getElementById("show-password");
  const checkShowPasswordRetype = document.getElementById(
    "show-password-retype"
  );
  const encryptBtn = document.getElementById("encrypt-button");
  const encryptDownload = document.getElementById("encrypt-result");
  const passwordErrorMessage = document.getElementById(
    "password-error-message"
  );

  // check if we can select the element
  if (
    encryptInput &&
    encryptUploadedDiv &&
    encryptFileName &&
    encryptPassword &&
    encryptPasswordRetype &&
    encryptBtn &&
    encryptDownload &&
    passwordErrorMessage
  ) {
    // check for uploaded pdf
    encryptInput.onchange = () => {
      if (encryptInput.files[0].type == "application/pdf") {
        encryptBtn.style.display = "block";
        encryptUploadedDiv.classList.remove("hidden");
        encryptUploadedDiv.classList.add("flex");
        encryptFileName.innerText = encryptInput.files[0].name;
        acceptedFile = encryptInput.files[0];
      }
    };

    // listen if user want to show password
    // for password field
    checkShowPassword.addEventListener("change", function () {
      if (checkShowPassword.checked) {
        // Show password for 1 second
        encryptPassword.type = "text";
      } else {
        encryptPassword.type = "password";
      }
    });

    // for password retype field
    checkShowPasswordRetype.addEventListener("change", function () {
      if (checkShowPasswordRetype.checked) {
        // Show password for 1 second
        encryptPasswordRetype.type = "text";
      } else {
        encryptPasswordRetype.type = "password";
      }
    });

    // if submit the file for compress
    encryptBtn.addEventListener("click", async (event) => {
      event.stopPropagation();

      // check if password and retype matches or pass is empty
      if (
        encryptPassword.value != encryptPasswordRetype.value ||
        !encryptPassword.value
      ) {
        passwordErrorMessage.classList.remove("hidden");
        passwordErrorMessage.classList.add("block");
        return;
      }

      const formData = new FormData();
      formData.append("file", acceptedFile);
      formData.append("password", encryptPassword.value);
      formData.append("confirmed_password", encryptPasswordRetype.value);

      // try submit the form
      try {
        const csrftoken = Cookies.get("csrftoken");
        const response = await fetch("/encrypt/", {
          method: "POST",
          headers: { "X-CSRFToken": csrftoken },
          mode: "same-origin", // Do not send CSRF token to another domain.
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        } else {
          // hide the error message
          passwordErrorMessage.classList.add("hidden");
          passwordErrorMessage.classList.remove("block");

          // if the process is ok, then show the result file
          encryptDownload.classList.toggle("hidden");
          encryptDownload.classList.toggle("flex");
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    });
  }
};

document.addEventListener("DOMContentLoaded", initApp);

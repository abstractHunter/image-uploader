let uploadCard = document.querySelector(".upload-card");
let dropZone = document.querySelector(".drop-zone");
let fileInput = document.querySelector("#file-input");

let uploadProcessing = document.querySelector(".upload-processing");

let uploadSuccess = document.querySelector(".upload-success");
let uploadSuccessImage = document.querySelector(".upload-success-image");
let uploadSuccessLink = document.querySelector(".upload-success-link");
let uploadSuccessCopy = document.querySelector(".upload-success-copy-link");


let sendingFile = false;

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault()
    dropZone.classList.add("drop-zone-dragover")
});

["dragleave", "dragend"].forEach((typed) => {
    dropZone.addEventListener(typed, (e) => {
        e.preventDefault()
        dropZone.classList.remove("drop-zone-dragover")
    })
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault()
    dropZone.classList.remove("drop-zone-dragover")
    fileInput.files = e.dataTransfer.files

    // if there is more than one file, reject it
    if (fileInput.files.length > 1) {
        alert("Only one file is allowed!");
        fileInput.value = "";
        return;
    }

    // if the file is not an image, reject it
    if (!fileInput.files[0].type.match('image.*')) {
        alert("Only images are allowed!");
        fileInput.value = "";
        return;
    }

    // if the file is too big, reject it (1MB)
    if (fileInput.files[0].size > 1000000) {
        alert("The file is too big! (max 1MB)");
        fileInput.value = "";
        return;
    }

    // if the file is valid, send it to the server
    uploadImage(fileInput.files[0]);
});

fileInput.addEventListener("change", (e) => {
    // if there is more than one file, reject it
    if (fileInput.files.length > 1) {
        alert("Only one file is allowed!");
        fileInput.value = "";
        return;
    }

    // if the file is not an image, reject it
    if (!fileInput.files[0].type.match('image.*')) {
        alert("Only images are allowed!");
        fileInput.value = "";
        return;
    }

    // if the file is too big, reject it (1MB)
    if (fileInput.files[0].size > 1000000) {
        alert("The file is too big! (max 1MB)");
        fileInput.value = "";
        return;
    }

    // if the file is valid, send it to the server
    uploadImage(fileInput.files[0]);
});


// send the image to node server
function uploadImage(file) {
    if (sendingFile) return;
    sendingFile = true;

    imageLink = "";

    uploadCard.style.display = "none";
    uploadProcessing.style.display = "block";

    const formData = new FormData();
    formData.append("image", file);

    fetch("/", {
        method: "POST",
        body: formData
    })
        .then(res => res.json())
        .then(data => {
            imageLink = data.link;

            setTimeout(() => {
                uploadProcessing.style.display = "none";
                uploadSuccess.style.display = "flex";
                uploadSuccessImage.src = window.location.href + imageLink;
                uploadSuccessLink.value = window.location.href + imageLink;
            }, 1000);
        })
        .catch(err => {
            console.log(err);
            setTimeout(() => {
                uploadProcessing.style.display = "none";
                uploadCard.style.display = "flex";
                alert("An error occurred while uploading the image!");
            }, 1000);
        })
        .finally(() => {
            sendingFile = false;
        });
}


uploadSuccessCopy.addEventListener("click", () => {
    uploadSuccessLink.select();
    document.execCommand("copy");
    alert("Link copied to clipboard!");
});
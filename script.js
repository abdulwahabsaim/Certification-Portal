// Accessing Values entered by user
let inputName = document.querySelector("#inputName");
let inputDate = document.querySelector("#inputDate");
let inputSignature = document.querySelector("#inputSignature");
let inputDetails = document.querySelector("#inputDetails");
let createButton = document.querySelector("#createButton");

let templates = document.querySelectorAll(".certificate-template");
let displayCertificateDiv = document.querySelector(".displayCertificateDiv");

// Accessing elements to enter details in certificate
let certificateBackground = document.querySelector("#certificateBackground");

let certificateName = document.querySelector("#certificateName");
let certificateDate = document.querySelector("#certificateDate");
let certificateSignature = document.querySelector("#certificateSignature");
let certificateDetails = document.querySelector("#certificateDetails");



// Download logic
const downloadButton = document.querySelector("#downloadButton");
downloadButton.addEventListener("click", function () {
    const certificate = document.querySelector(".generatedCertificate");
    const fileFormat = document.querySelector("#fileFormat").value; // Get selected format

    if (fileFormat === "jpg") {
        // Image Download Logic (JPG)
        html2canvas(certificate, {
            scale: 2, // Improves resolution
            useCORS: true // Handles cross-origin images
        }).then((canvas) => {
            const link = document.createElement("a");
            link.download = "certificate.jpg"; // File name
            link.href = canvas.toDataURL("image/jpeg"); // Convert canvas to JPG image
            link.click(); // Trigger the download
        });
    } else if (fileFormat === "pdf") {
        // PDF Download Logic
        html2canvas(certificate, {
            scale: 1.5, // Reducing scale to 1.5 to reduce the resolution
            useCORS: true // Handles cross-origin images
        }).then((canvas) => {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4'); // Create a PDF instance

            // Get the dimensions of the canvas
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;

            // A4 size in mm (portrait)
            const a4Width = 210;
            const a4Height = 297;

            // Calculate the aspect ratio of the canvas
            const aspectRatio = canvasWidth / canvasHeight;

            // Calculate the new width and height to maintain the aspect ratio
            let newWidth = a4Width;
            let newHeight = newWidth / aspectRatio;

            // If the new height exceeds the A4 page height, adjust the width accordingly
            if (newHeight > a4Height) {
                newHeight = a4Height;
                newWidth = newHeight * aspectRatio;
            }

            // Center the image on the page
            const marginX = (a4Width - newWidth) / 2;
            const marginY = (a4Height - newHeight) / 2;

            // Convert the canvas to image data URL and add it to the PDF
            const imgData = canvas.toDataURL('image/jpeg', 0.7); // Compressing to JPEG with 70% quality
            pdf.addImage(imgData, 'JPEG', marginX, marginY, newWidth, newHeight);

            // Save the PDF
            pdf.save('certificate.pdf');
        });
    }
});


// Accessing template selected by user
let certificateBackgroundSrc = "assets/Certificate Template 1.jpg";

templates.forEach((template) => {
    template.addEventListener("click", ()=>{
        certificateBackgroundSrc = template.getAttribute('alt');
        templates.forEach((temp) => {
            temp.classList.remove('selected');
        });
        template.classList.add('selected');
    });
});
// Accessing values entered by user in form
let inputNameValue;
let inputDateValue;
let inputSignatureValue;
let inputDetailsValue;

let inputValues = () => {
    inputNameValue = inputName.value || "Abdul Wahab Saim";
    inputDateValue = inputDate.value || "29-12-2024";
    inputSignatureValue = inputSignature.value || "saim";
    inputDetailsValue = inputDetails.value || "Hi, I am Saim. rehan is not my friend; instead, i am a friend of Rehan. That is why I am giving this certificate to rehan.";
}

const certificate = document.querySelector(".generatedCertificate");
const adjustFontSizes = () => {
    const certificateWidth = certificate.offsetWidth;

    // Scale font sizes based on certificate width
    document.querySelector("#certificateName").style.fontSize = `${certificateWidth * 0.05}px`;
    document.querySelector("#certificateDate").style.fontSize = `${certificateWidth * 0.015}px`;
    document.querySelector("#certificateSignature").style.fontSize = `${certificateWidth * 0.025}px`;
    document.querySelector("#certificateDetails").style.fontSize = `${certificateWidth * 0.020}px`;
};

// Adjust fonts on window resize
window.addEventListener("resize", adjustFontSizes);
adjustFontSizes();

// Generating certificate and putting values in selected template
displayCertificate = () => {
    displayCertificateDiv.classList.remove('hidden');
    certificateBackground.setAttribute("style", `background-image: url('${certificateBackgroundSrc}');`);
    inputValues();
    certificateName.textContent = inputNameValue;
    certificateDate.textContent = inputDateValue;
    certificateSignature.textContent = inputSignatureValue;
    certificateDetails.textContent = inputDetailsValue;
    adjustFontSizes();
}

createButton.addEventListener("click", displayCertificate);

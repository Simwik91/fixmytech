// Constants
const PREFERENCES_KEY = 'qrPreferences';

// DOM Elements
const qrType = document.getElementById('qr-type');
const numericInput = document.getElementById('numeric-input');
const urlInput = document.getElementById('url-input');
const textInput = document.getElementById('text-input');
const vcardName = document.getElementById('vcard-name');
const vcardPhone = document.getElementById('vcard-phone');
const vcardEmail = document.getElementById('vcard-email');
const wifiSsid = document.getElementById('wifi-ssid');
const wifiPassword = document.getElementById('wifi-password');
const wifiType = document.getElementById('wifi-type');
const smsPhone = document.getElementById('sms-phone');
const smsMessage = document.getElementById('sms-message');
const emailAddress = document.getElementById('email-address');
const emailSubject = document.getElementById('email-subject');
const emailBody = document.getElementById('email-body');
const qrCanvas = document.getElementById('qr-canvas');
const fgColor = document.getElementById('fg-color');
const bgColor = document.getElementById('bg-color');
const transparentBg = document.getElementById('transparent-bg');
const logoUpload = document.getElementById('logo-upload');
const logoUploadArea = document.getElementById('logo-upload-area');
const logoPreview = document.getElementById('logo-preview');
const logoPreviewImg = document.getElementById('logo-preview-img');
const qrLoading = document.getElementById('qr-loading');
const qrError = document.getElementById('qr-error');
const qrSuccess = document.getElementById('qr-success');
const downloadButtons = document.getElementById('download-buttons');
const video = document.getElementById('scanner-video');
const scanResult = document.getElementById('scan-result');
const startScanBtn = document.getElementById('start-scan');
const stopScanBtn = document.getElementById('stop-scan');
const scannerOverlay = document.getElementById('scanner-overlay');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const bulkInput = document.getElementById('bulk-input');
const bulkFileUpload = document.getElementById('bulk-file-upload');
const bulkFilePrefix = document.getElementById('bulk-file-prefix');
const bulkFileName = document.getElementById('bulk-file-name');
const bulkFileAffix = document.getElementById('bulk-file-affix');
const bulkLoading = document.getElementById('bulk-loading');
const bulkProgress = document.getElementById('bulk-progress');
const bulkSuccess = document.getElementById('bulk-success');
const bulkError = document.getElementById('bulk-error');
const fileUpload = document.getElementById('file-upload');
const scanUploadArea = document.getElementById('scan-upload-area');
const bulkInputType = document.getElementById('bulk-input-type');
const bulkListFields = document.getElementById('bulk-list-fields');
const bulkRangeFields = document.getElementById('bulk-range-fields');
const bulkCsvFields = document.getElementById('bulk-csv-fields');
const rangeStart = document.getElementById('range-start');
const rangeEnd = document.getElementById('range-end');
const bulkLogoUploadArea = document.getElementById('bulk-logo-upload-area');
const logoSize = document.getElementById('logo-size');
const borderColor = document.getElementById('border-color');
const borderWidth = document.getElementById('border-width');
const stopScanContainer = document.getElementById('stop-scan-container');
const borderUnavailableMessage = document.getElementById('border-unavailable-message');

// Bulk options
const bulkFgColor = document.getElementById('bulk-fg-color');
const bulkBgColor = document.getElementById('bulk-bg-color');
const bulkTransparentBg = document.getElementById('bulk-transparent-bg');
const bulkLogoUpload = document.getElementById('bulk-logo-upload');
const bulkLogoPreview = document.getElementById('bulk-logo-preview');
const bulkLogoPreviewImg = document.getElementById('bulk-logo-preview-img');
const bulkLogoSize = document.getElementById('bulk-logo-size');
const bulkBorderColor = document.getElementById('bulk-border-color');
const bulkBorderWidth = document.getElementById('bulk-border-width');
const bulkBorderUnavailableMessage = document.getElementById('bulk-border-unavailable-message');


let logoImage = null;
let bulkLogoImage = null;
let qrCode = null;
let svgString = '';

function startScanner() {
    const scannerContainer = document.querySelector('.scanner-container');
    scannerContainer.style.display = 'block';
    if(stopScanContainer) stopScanContainer.style.display = 'flex'; // Show the stop button container
    if(startScanBtn) startScanBtn.style.display = 'none';
    if(scanUploadArea) scanUploadArea.style.display = 'none';


    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(function(stream) {
            video.srcObject = stream;
            video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
            video.play();
            requestAnimationFrame(tick);
        })
        .catch(function(err) {
            console.log(err);
            scanResult.textContent = "Could not access camera";
        });
}

function stopScanner() {
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
    }
    document.querySelector('.scanner-container').style.display = 'none';
    if(stopScanContainer) stopScanContainer.style.display = 'none'; // Hide the stop button container
    if(startScanBtn) startScanBtn.style.display = 'block';
    if(scanUploadArea) scanUploadArea.style.display = 'block';
}

function tick() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        const canvasElement = document.createElement('canvas');
        const canvas = canvasElement.getContext('2d', { willReadFrequently: true });
        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        var code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });
        if (code) {
            scanResult.textContent = code.data;
            scanResult.style.display = 'block';
            stopScanner();
        }
    }
    if (video.srcObject) { // Only request animation frame if video stream is active
        requestAnimationFrame(tick);
    }
}

function handleFileSelect(evt) {
    var file = evt.target.files[0];
    var reader = new FileReader();
    reader.onload = (function(theFile) {
        return function(e) {
            var img = new Image();
            img.onload = function() {
                const canvasElement = document.createElement('canvas');
                const canvas = canvasElement.getContext('2d', { willReadFrequently: true });
                canvasElement.height = img.height;
                canvasElement.width = img.width;
                canvas.drawImage(img, 0, 0, canvasElement.width, canvasElement.height);
                var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
                var code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: "dontInvert",
                });
                if (code) {
                    scanResult.textContent = code.data;
                    scanResult.style.display = 'block';
                } else {
                    scanResult.textContent = "Could not find QR code in image";
                    scanResult.style.display = 'block';
                }
            }
            img.src = e.target.result;
        }
    })(file);
    reader.readAsDataURL(file);
}

function generateQR() {
    const type = qrType.value;
    const content = getQRContent(type);
    
    console.log('generateQR: logoImage value:', logoImage); // Debugging line
    
    if (!content) {
        qrError.textContent = "Please enter content for the QR code";
        qrError.style.display = 'block';
        return;
    }
    
    qrError.style.display = 'none';
    qrSuccess.style.display = 'none';
    qrLoading.style.display = 'block';
    
    // Clear previous QR code
    qrCanvas.innerHTML = '';
    
    try {
        qrCode = new QRCode(qrCanvas, {
            text: content,
            width: 256,
            height: 256,
            colorDark : fgColor.value,
            colorLight : transparentBg.checked ? 'transparent' : bgColor.value,
            correctLevel : QRCode.CorrectLevel.H
        });
        
        // Use a small timeout to allow QR code to render before processing further
        setTimeout(() => {
            const canvas = qrCanvas.getElementsByTagName('canvas')[0];
            const ctx = canvas.getContext('2d');
            const qrSize = qrCode._oDrawing._htOption.width;
            
            const finalizeQrGeneration = () => {
                validateQrCodeReadability(canvas, content);
                qrLoading.style.display = 'none';
                document.querySelector('.qr-result-container').style.display = 'block';
                downloadButtons.style.display = 'flex';
                // No need to disconnect observer here as it's not observing any more
            };

            if(logoImage) {
                console.log('generateQR: Drawing logo and border logic executed.'); // Debugging line
                const logo = new Image();
                logo.src = logoImage;
                logo.onload = function() {
                    const effectiveLogoSize = qrSize * (logoSize.value / 100);
                    const effectiveBorderWidth = parseInt(borderWidth.value);

                    const logoDrawSize = effectiveLogoSize - (effectiveBorderWidth * 2);
                    const logoX = (qrSize - effectiveLogoSize) / 2;
                    const logoY = (qrSize - effectiveLogoSize) / 2;

                    // Draw background for logo (only if not transparent)
                    if (!transparentBg.checked) {
                        ctx.fillStyle = borderColor.value; // Border color as background
                        ctx.fillRect(logoX, logoY, effectiveLogoSize, effectiveLogoSize);
                    } else {
                         ctx.fillStyle = '#FFFFFF'; // Fallback white for transparent QR background
                         ctx.fillRect(logoX, logoY, effectiveLogoSize, effectiveLogoSize);
                    }

                    // Draw logo
                    ctx.drawImage(logo, logoX + effectiveBorderWidth, logoY + effectiveBorderWidth, logoDrawSize, logoDrawSize);

                    finalizeQrGeneration();
                };
                logo.onerror = function() {
                    qrError.textContent = "Error loading logo image.";
                    qrError.style.display = 'block';
                    qrLoading.style.display = 'none';
                }
            } else {
                finalizeQrGeneration();
            }
        }, 100); // Small delay to allow QR code to render
        
    } catch (e) {
        qrError.textContent = "Error generating QR code. Please check your input.";
        qrError.style.display = 'block';
        qrLoading.style.display = 'none';
        return;
    }
}

function validateQrCodeReadability(canvas, expectedContent) {
    const imageData = canvas.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code && code.data === expectedContent) {
        qrSuccess.textContent = "QR code generated successfully and is readable!";
        qrSuccess.style.display = 'block';
        qrError.style.display = 'none';
    } else {
        qrError.textContent = "Warning: QR code might not be perfectly readable, consider reducing logo size or border width.";
        qrError.style.display = 'block';
        qrSuccess.style.display = 'none';
    }
}


function generateBulkQR(format) {
    const zip = new JSZip();
    const inputType = bulkInputType.value;
    let data = [];

    if (inputType === 'list') {
        data = bulkInput.value.split('\n').filter(line => line.trim() !== '');
    } else if (inputType === 'range') {
        const start = parseInt(rangeStart.value);
        const end = parseInt(rangeEnd.value);
        if (!isNaN(start) && !isNaN(end)) {
            for (let i = start; i <= end; i++) {
                data.push(i.toString());
            }
        }
    } else if (inputType === 'csv' && bulkFileUpload.files.length > 0) {
        const file = bulkFileUpload.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            const csvData = e.target.result;
            data = csvData.split('\n').filter(line => line.trim() !== '');
            generateZip(zip, data, format, data.length);
        }
        reader.readAsText(file);
        return;
    }

    if (data.length > 0) {
        generateZip(zip, data, format, data.length); // Pass data.length
    } else {
        bulkError.textContent = "No data to generate QR codes from.";
        bulkError.style.display = 'block';
    }
}

function generateZip(zip, data, format, totalItems) {
    bulkLoading.style.display = 'block';
    let generatedCount = 0;
    const total = totalItems; // Use passed totalItems

    const generateAndAddQr = (item, index) => {
        return new Promise(resolve => {
            const tempDiv = document.createElement('div');
            const qr = new QRCode(tempDiv, {
                text: item,
                width: 256,
                height: 256,
                colorDark : bulkFgColor.value,
                colorLight : bulkTransparentBg.checked ? 'transparent' : bulkBgColor.value,
                correctLevel : QRCode.CorrectLevel.H
            });

            const canvas = tempDiv.getElementsByTagName('canvas')[0];
            const fileName = getBulkFileName(item) || `qr-code-${index + 1}`;

            const finalizeBulkQrGeneration = () => {
                canvas.toBlob(function(blob) {
                    zip.file(`${fileName}.png`, blob);
                    generatedCount++;
                    bulkProgress.textContent = `Generating: ${generatedCount}/${total}`;
                    resolve();
                });
            };

            if (bulkLogoImage) {
                const logo = new Image();
                logo.src = bulkLogoImage;
                logo.onload = function() {
                    const ctx = canvas.getContext('2d', { willReadFrequently: true });
                    const qrSize = qr._oDrawing._htOption.width;
                    const effectiveLogoSize = qrSize * (bulkLogoSize.value / 100);
                    const effectiveBorderWidth = parseInt(bulkBorderWidth.value);

                    const logoDrawSize = effectiveLogoSize - (effectiveBorderWidth * 2);
                    const logoX = (qrSize - effectiveLogoSize) / 2;
                    const logoY = (qrSize - effectiveLogoSize) / 2;

                    // Draw background for logo (only if not transparent)
                    if (!bulkTransparentBg.checked) {
                        ctx.fillStyle = bulkBorderColor.value; // Border color as background
                        ctx.fillRect(logoX, logoY, effectiveLogoSize, effectiveLogoSize);
                    } else {
                         ctx.fillStyle = '#FFFFFF'; // Fallback white for transparent QR background
                         ctx.fillRect(logoX, logoY, effectiveLogoSize, effectiveLogoSize);
                    }

                    // Draw logo
                    ctx.drawImage(logo, logoX + effectiveBorderWidth, logoY + effectiveBorderWidth, logoDrawSize, logoDrawSize);

                    finalizeBulkQrGeneration();
                };
            } else {
                finalizeBulkQrGeneration();
            }
        });
    };

    const promises = data.map((item, index) => generateAndAddQr(item, index));

    Promise.all(promises).then(() => {
        downloadZip(zip, total); // Pass total to downloadZip
    });
}

function downloadZip(zip, totalItems) {
    zip.generateAsync({type:"blob"}).then(function(content) {
        saveAs(content, "qr-codes.zip");
        bulkLoading.style.display = 'none';
        bulkSuccess.textContent = `${totalItems} QR codes generated and downloaded successfully!`;
        bulkSuccess.style.display = 'block';
        bulkError.style.display = 'none';
    }).catch(error => {
        bulkError.textContent = `Error zipping QR codes: ${error}`;
        bulkError.style.display = 'block';
        bulkSuccess.style.display = 'none';
        bulkLoading.style.display = 'none';
    });
}


function downloadQR(format) {
    // No SVG download for single QR, fallback to PNG
    const canvas = qrCanvas.getElementsByTagName('canvas')[0];
    canvas.toBlob(function(blob) {
        saveAs(blob, "qr-code.png");
    });
}

function getBulkFileName(baseName) {
    const prefix = bulkFilePrefix.value.trim();
    const name = bulkFileName.value.trim() || baseName;
    const affix = bulkFileAffix.value.trim();
    
    let fileName = name;
    if(prefix) {
        fileName = `${prefix} ${fileName}`;
    }
    if(affix) {
        fileName = `${fileName} ${affix}`;
    }
    return fileName;
}



function toggleQRTypeFields() {
  document.querySelectorAll('.qr-type-fields').forEach(field => {
    field.style.display = 'none';
  });
  const selectedType = qrType.value;
  document.getElementById(`${selectedType}-fields`).style.display = 'block';
}

function initBulkInputType() {
    if(bulkInputType) {
        bulkInputType.addEventListener('change', (e) => {
            bulkListFields.style.display = 'none';
            bulkRangeFields.style.display = 'none';
            bulkCsvFields.style.display = 'none';

            if(e.target.value === 'list') {
                bulkListFields.style.display = 'block';
            } else if (e.target.value === 'range') {
                bulkRangeFields.style.display = 'block';
            } else if (e.target.value === 'csv') {
                bulkCsvFields.style.display = 'block';
            }
        });
    }
}

function getQRContent(type) {
    switch (type) {
        case 'numeric': return numericInput.value;
        case 'url': return urlInput.value;
        case 'text': return textInput.value;
        case 'vcard': return `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardName.value}\nTEL:${vcardPhone.value}\nEMAIL:${vcardEmail.value}\nEND:VCARD`;
        case 'wifi': return `WIFI:T:${wifiType.value};S:${wifiSsid.value};P:${wifiPassword.value};;`;
        case 'sms': return `SMSTO:${smsPhone.value}:${smsMessage.value}`;
        case 'email': return `MATMSG:TO:${emailAddress.value};SUB:${emailSubject.value};BODY:${emailBody.value};;`;
        default: throw new Error('Invalid QR code type');
    }
}

function handleLogoUpload(event, previewElement, imgElement, type) {
    const file = event.target.files[0];
    if (!file) return; 
    
    const reader = new FileReader();
    reader.onload = (e) => {
        if(type === 'single') {
            logoImage = e.target.result;
            console.log('handleLogoUpload: single logoImage set to', logoImage);
        } else {
            bulkLogoImage = e.target.result;
            console.log('handleLogoUpload: bulk logoImage set to', bulkLogoImage);
        }
        imgElement.src = e.target.result;
        previewElement.style.display = 'block';

        // Enable border options
        if (logoSize) logoSize.disabled = false;
        if (borderColor) borderColor.disabled = false;
        if (borderWidth) borderWidth.disabled = false;
        if (borderUnavailableMessage) borderUnavailableMessage.style.display = 'none';

        // For bulk options
        if (bulkLogoSize) bulkLogoSize.disabled = false;
        if (bulkBorderColor) bulkBorderColor.disabled = false;
        if (bulkBorderWidth) bulkBorderWidth.disabled = false;
        if (bulkBorderUnavailableMessage) bulkBorderUnavailableMessage.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

function handleLogoDrop(event, previewElement, imgElement, type) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) return; 
    
    const reader = new FileReader();
    reader.onload = (e) => {
        if(type === 'single') {
            logoImage = e.target.result;
        } else {
            bulkLogoImage = e.target.result;
        }
        imgElement.src = e.target.result;
        previewElement.style.display = 'block';

        // Enable border options
        if (logoSize) logoSize.disabled = false;
        if (borderColor) borderColor.disabled = false;
        if (borderWidth) borderWidth.disabled = false;
        if (borderUnavailableMessage) borderUnavailableMessage.style.display = 'none';

        // For bulk options
        if (bulkLogoSize) bulkLogoSize.disabled = false;
        if (bulkBorderColor) bulkBorderColor.disabled = false;
        if (bulkBorderWidth) bulkBorderWidth.disabled = false;
        if (bulkBorderUnavailableMessage) bulkBorderUnavailableMessage.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function resetSingleQRTab() {
    const qrResultContainer = document.querySelector('.qr-result-container');
    if (qrResultContainer) qrResultContainer.style.display = 'none';
    if (downloadButtons) downloadButtons.style.display = 'none';
    if (qrCanvas) qrCanvas.innerHTML = ''; // Clear generated QR code
    if (qrError) {
        qrError.textContent = '';
        qrError.style.display = 'none';
    }
    if (qrSuccess) {
        qrSuccess.textContent = '';
        qrSuccess.style.display = 'none';
    }
    logoImage = null; // Reset logo image
}

window.initQrGenerator = function() {

    function setupEventListeners() {
      if(qrType) qrType.addEventListener('change', toggleQRTypeFields);
      if(logoUpload) {
        logoUpload.addEventListener('change', (e) => handleLogoUpload(e, logoPreview, logoPreviewImg, 'single'));
        logoUpload.addEventListener('change', (e) => {
            if (!e.target.files[0]) {
                if (logoSize) logoSize.disabled = true;
                if (borderColor) borderColor.disabled = true;
                if (borderWidth) borderWidth.disabled = true;
                if (borderUnavailableMessage) borderUnavailableMessage.style.display = 'block';
                logoPreview.style.display = 'none';
                logoImage = null;
            }
        });
      }
      
      // Drag and drop for logo
      if(logoUploadArea) {
        ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            logoUploadArea.addEventListener(eventName, preventDefaults, false);
        });

        logoUploadArea.addEventListener('drop', (e) => handleLogoDrop(e, logoPreview, logoPreviewImg, 'single'));
        logoUploadArea.addEventListener('dragleave', () => {
            if (!logoImage) { // Only hide message if no logo is uploaded
                if (logoSize) logoSize.disabled = true;
                if (borderColor) borderColor.disabled = true;
                if (borderWidth) borderWidth.disabled = true;
                if (borderUnavailableMessage) borderUnavailableMessage.style.display = 'block';
                logoPreview.style.display = 'none';
            }
        });
      }

      // Bulk Logo Upload
      if(bulkLogoUpload) {
        bulkLogoUpload.addEventListener('change', (e) => handleLogoUpload(e, bulkLogoPreview, bulkLogoPreviewImg, 'bulk'));
        bulkLogoUpload.addEventListener('change', (e) => {
            if (!e.target.files[0]) {
                if (bulkLogoSize) bulkLogoSize.disabled = true;
                if (bulkBorderColor) bulkBorderColor.disabled = true;
                if (bulkBorderWidth) bulkBorderWidth.disabled = true;
                if (bulkBorderUnavailableMessage) bulkBorderUnavailableMessage.style.display = 'block';
                bulkLogoPreview.style.display = 'none';
                bulkLogoImage = null;
            }
        });
      }

      // Drag and drop for bulk logo
      if(bulkLogoUploadArea) {
        ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            bulkLogoUploadArea.addEventListener(eventName, preventDefaults, false);
        });

        bulkLogoUploadArea.addEventListener('drop', (e) => handleLogoDrop(e, bulkLogoPreview, bulkLogoPreviewImg, 'bulk'));
        bulkLogoUploadArea.addEventListener('dragleave', () => {
            if (!bulkLogoImage) { // Only hide message if no logo is uploaded
                if (bulkLogoSize) bulkLogoSize.disabled = true;
                if (bulkBorderColor) bulkBorderColor.disabled = true;
                if (bulkBorderWidth) bulkBorderWidth.disabled = true;
                if (bulkBorderUnavailableMessage) bulkBorderUnavailableMessage.style.display = 'block';
                bulkLogoPreview.style.display = 'none';
            }
        });
      }
      
      if(tabs)
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
              const tabName = tab.dataset.tab;
              console.log('Tab clicked:', tabName); // Debugging
              tabs.forEach(t => t.classList.remove('active'));
              tab.classList.add('active');
              tabContents.forEach(c => c.classList.remove('active'));
              const targetTabContent = document.getElementById(`${tabName}-tab`);
              if (targetTabContent) {
                targetTabContent.classList.add('active');
                console.log('Tab content activated:', `${tabName}-tab`); // Debugging
              } else {
                console.warn('Target tab content not found:', `${tabName}-tab`); // Debugging
              }

              // Reset single QR tab content when switching away from it
              if (tabName !== 'single') {
                  resetSingleQRTab();
              }
            });
        });
      
      if(startScanBtn) startScanBtn.addEventListener('click', startScanner);
      if(stopScanBtn) stopScanBtn.addEventListener('click', stopScanner);
      if(fileUpload) fileUpload.addEventListener('change', handleFileSelect);

      // New options toggle logic
      const newOptionsToggles = document.querySelectorAll('.options-toggle-btn');
      if (newOptionsToggles) {
        newOptionsToggles.forEach(toggleBtn => {
          toggleBtn.addEventListener('click', () => {
            const optionsContainer = toggleBtn.closest('.options-container');
            const optionsContent = optionsContainer.querySelector('.options-content');
            const toggleIcon = toggleBtn.querySelector('.toggle-icon');

            optionsContainer.classList.toggle('open');


            if (toggleIcon) {
              toggleIcon.classList.toggle('rotate');
            }
          });
        });
      }
    }

    setupEventListeners();
    if(qrType) toggleQRTypeFields();
    if(bulkInputType) initBulkInputType();

    // Initial state for border options
    if (logoSize) logoSize.disabled = true;
    if (borderColor) borderColor.disabled = true;
    if (borderWidth) borderWidth.disabled = true;
    if (borderUnavailableMessage && !logoImage) borderUnavailableMessage.style.display = 'block';
    
    if (bulkLogoSize) bulkLogoSize.disabled = true;
    if (bulkBorderColor) bulkBorderColor.disabled = true;
    if (bulkBorderWidth) bulkBorderWidth.disabled = true;
    if (bulkBorderUnavailableMessage && !bulkLogoImage) bulkBorderUnavailableMessage.style.display = 'block';
};
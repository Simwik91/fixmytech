
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
    const bulkTransparentBg = document.getElementById('bulk-transparent-bg');
    const sizeSlider = document.getElementById('size-slider');
    const sizeValue = document.getElementById('size-value');
    const borderSize = document.getElementById('border-size');
    const borderSizeValue = document.getElementById('border-size-value');
    const borderColor = document.getElementById('border-color');
    const logoSize = document.getElementById('logo-size');
    const logoSizeValue = document.getElementById('logo-size-value');
    const bulkLogoSize = document.getElementById('bulk-logo-size');
    const bulkLogoSizeValue = document.getElementById('bulk-logo-size-value');
    const logoUpload = document.getElementById('logo-upload');
    const logoUploadArea = document.getElementById('logo-upload-area');
    const logoPreview = document.getElementById('logo-preview');
    const qrLoading = document.getElementById('qr-loading');
    const qrError = document.getElementById('qr-error');
    const qrSuccess = document.getElementById('qr-success');
    const downloadButtons = document.getElementById('download-buttons');
    const downloadPngBtn = document.getElementById('download-png-btn');
    const downloadSvgBtn = document.getElementById('download-svg-btn');
    const video = document.getElementById('scanner-video');
    const scanResult = document.getElementById('scan-result');
    const startScanBtn = document.getElementById('start-scan');
    const stopScanBtn = document.getElementById('stop-scan');
    const scannerOverlay = document.getElementById('scanner-overlay');
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const bulkInput = document.getElementById('bulk-input');
    const bulkFileUpload = document.getElementById('bulk-file-upload');
    const bulkFilename = document.getElementById('bulk-filename');
    const bulkLoading = document.getElementById('bulk-loading');
    const bulkProgress = document.getElementById('bulk-progress');
    const bulkSuccess = document.getElementById('bulk-success');
    const bulkError = document.getElementById('bulk-error');
    const fileUpload = document.getElementById('file-upload');
    const bulkFgColor = document.getElementById('bulk-fg-color');
    const bulkBgColor = document.getElementById('bulk-bg-color');
    const bulkSizeSlider = document.getElementById('bulk-size-slider');
    const bulkSizeValue = document.getElementById('bulk-size-value');
    const bulkBorderSize = document.getElementById('bulk-border-size');
    const bulkBorderSizeValue = document.getElementById('bulk-border-size-value');
    const bulkBorderColor = document.getElementById('bulk-border-color');
    const bulkLogoUpload = document.getElementById('bulk-logo-upload');
    const bulkLogoUploadArea = document.getElementById('bulk-logo-upload-area');
    const bulkLogoPreview = document.getElementById('bulk-logo-preview');
    const bulkInputType = document.getElementById('bulk-input-type');
    const bulkListFields = document.getElementById('bulk-list-fields');
    const bulkRangeFields = document.getElementById('bulk-range-fields');
    const bulkCsvFields = document.getElementById('bulk-csv-fields');
    const rangeStart = document.getElementById('range-start');
    const rangeEnd = document.getElementById('range-end');
    const rangePrefix = document.getElementById('range-prefix');
    const rangeSuffix = document.getElementById('range-suffix');
    const borderPreview = document.getElementById('border-preview');
    const bulkBorderPreview = document.getElementById('bulk-border-preview');
    const scannerStatus = document.getElementById('scanner-status');
    const scannerGuides = document.getElementById('scanner-guides');

    // Text display elements
    const showTextDisplay = document.getElementById('show-text-display');
    const textDisplayFields = document.getElementById('text-display-fields');
    const customText = document.getElementById('custom-text');
    const textPrefix = document.getElementById('text-prefix');
    const textSuffix = document.getElementById('text-suffix');
    const textColor = document.getElementById('text-color');
    const textSize = document.getElementById('text-size');
    const textAlign = document.getElementById('text-align');
    const textPreview = document.getElementById('text-preview');
    const qrTextDisplay = document.getElementById('qr-text-display');

    // Bulk text display elements
    const bulkShowTextDisplay = document.getElementById('bulk-show-text-display');
    const bulkTextDisplayFields = document.getElementById('bulk-text-display-fields');
    const bulkCustomText = document.getElementById('bulk-custom-text');
    const bulkTextPrefix = document.getElementById('bulk-text-prefix');
    const bulkTextSuffix = document.getElementById('bulk-text-suffix');
    const bulkTextColor = document.getElementById('bulk-text-color');
    const bulkTextSize = document.getElementById('bulk-text-size');
    const bulkTextAlign = document.getElementById('bulk-text-align');

    // Size options elements
    const showSizeOptions = document.getElementById('show-size-options');
    const sizeOptionsContent = document.getElementById('size-options-content');
    const bulkShowSizeOptions = document.getElementById('bulk-show-size-options');
    const bulkSizeOptionsContent = document.getElementById('bulk-size-options-content');

    // New elements for toggleable sections
    const showColorOptions = document.getElementById('show-color-options');
    const colorOptionsContent = document.getElementById('color-options-content');
    const showLogoOptions = document.getElementById('show-logo-options');
    const logoOptionsContent = document.getElementById('logo-options-content');
    const bulkShowColorOptions = document.getElementById('bulk-show-color-options');
    const bulkColorOptionsContent = document.getElementById('bulk-color-options-content');
    const bulkShowLogoOptions = document.getElementById('bulk-show-logo-options');
    const bulkLogoOptionsContent = document.getElementById('bulk-logo-options-content');

    let previewTimeout = null;

    function toggleQRTypeFields() {
      document.querySelectorAll('.qr-type-fields').forEach(field => {
        field.classList.remove('active');
      });
      const selectedType = qrType.value;
      document.getElementById(`${selectedType}-fields`).classList.add('active');
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

    function handleLogoUpload(event, previewElement, type) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            if(type === 'single') {
                logoImage = e.target.result;
            } else {
                bulkLogoImage = e.target.result;
            }
            previewElement.innerHTML = `<img src="${e.target.result}" alt="Logo Preview">`;
        };
        reader.readAsDataURL(file);
    }

    function handleLogoDrop(event, previewElement, type) {
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
            previewElement.innerHTML = `<img src="${e.target.result}" alt="Logo Preview">`;
        };
        reader.readAsDataURL(file);
    }
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function startScanner() {
        // Implementation of startScanner
    }

    function stopScanner() {
        // Implementation of stopScanner
    }

    function handleFileSelect() {
        // Implementation of handleFileSelect
    }
    
    function loadQRPreferences() {
        // Implementation of loadQRPreferences
    }

    // Initialize the page
    document.addEventListener('DOMContentLoaded', () => {
    function updateSizeValue() {
      if (sizeValue && sizeSlider) {
        sizeValue.textContent = `${sizeSlider.value}px`;
      }
    }
    
    function updateBorderSizeValue() {
      if (borderSizeValue && borderSize) {
        borderSizeValue.textContent = `${borderSize.value}px`;
      }
    }
    
    function updateLogoSizeValue() {
      if (logoSizeValue && logoSize) {
        logoSizeValue.textContent = `${logoSize.value}%`;
      }
    }

    function updateBulkSizeValue() {
        if (bulkSizeValue && bulkSizeSlider) {
            bulkSizeValue.textContent = `${bulkSizeSlider.value}px`;
        }
    }

    function updateBulkBorderSizeValue() {
        if (bulkBorderSizeValue && bulkBorderSize) {
            bulkBorderSizeValue.textContent = `${bulkBorderSize.value}px`;
        }
    }

    function updateBulkLogoSizeValue() {
        if (bulkLogoSizeValue && bulkLogoSize) {
            bulkLogoSizeValue.textContent = `${bulkLogoSize.value}%`;
        }
    }
    
    function updateBorderPreview() {
      if (borderPreview && borderSize) {
        borderPreview.style.borderWidth = `${borderSize.value}px`;
      }
    }
    
    function updateBulkBorderPreview() {
      if (bulkBorderPreview && bulkBorderSize) {
        bulkBorderPreview.style.borderWidth = `${bulkBorderSize.value}px`;
      }
    }
    
    function setupEventListeners() {
      qrType.addEventListener('change', toggleQRTypeFields);
      sizeSlider.addEventListener('input', updateSizeValue);
      borderSize.addEventListener('input', () => {
        updateBorderSizeValue();
        updateBorderPreview();
      });
      logoSize.addEventListener('input', updateLogoSizeValue);
      bulkSizeSlider.addEventListener('input', updateBulkSizeValue);
      bulkBorderSize.addEventListener('input', () => {
        updateBulkBorderSizeValue();
        updateBulkBorderPreview();
      });
      bulkLogoSize.addEventListener('input', updateBulkLogoSizeValue);
      logoUpload.addEventListener('change', (e) => handleLogoUpload(e, logoPreview, 'single'));
      bulkLogoUpload.addEventListener('change', (e) => handleLogoUpload(e, bulkLogoPreview, 'bulk'));
      
      // Drag and drop for logo
      ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        logoUploadArea.addEventListener(eventName, preventDefaults, false);
        bulkLogoUploadArea.addEventListener(eventName, preventDefaults, false);
      });
      
      logoUploadArea.addEventListener('drop', (e) => handleLogoDrop(e, logoPreview, 'single'));
      bulkLogoUploadArea.addEventListener('drop', (e) => handleLogoDrop(e, bulkLogoPreview, 'bulk'));
      
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const tabName = tab.dataset.tab;
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          tabContents.forEach(c => c.classList.remove('active'));
          document.getElementById(`${tabName}-tab`).classList.add('active');
        });
      });
      
      startScanBtn.addEventListener('click', startScanner);
      stopScanBtn.addEventListener('click', stopScanner);
      fileUpload.addEventListener('change', handleFileSelect);
    }
      updateSizeValue();
      updateBorderSizeValue();
      updateLogoSizeValue();
      updateBulkLogoSizeValue();
      updateBulkBorderSizeValue();
      updateBulkLogoSizeValue();
      updateBorderPreview();
      updateBulkBorderPreview();
      setupEventListeners();
      toggleQRTypeFields();
      initBulkInputType();
      initTextDisplay();
      initBulkTextDisplay();
      initToggleableSections();
      initSizeOptions();
      loadQRPreferences();
    });

    function initSizeOptions() {
      // Single QR size options
      if (showSizeOptions) {
        showSizeOptions.addEventListener('change', function() {
          sizeOptionsContent.style.display = this.checked ? 'block' : 'none';
        });
      }
      
      // Bulk QR size options
      if (bulkShowSizeOptions) {
        bulkShowSizeOptions.addEventListener('change', function() {
          bulkSizeOptionsContent.style.display = this.checked ? 'block' : 'none';
        });
      }
    }

    function initToggleableSections() {
      // Single QR color options
      if (showColorOptions) {
        showColorOptions.addEventListener('change', function() {
          colorOptionsContent.style.display = this.checked ? 'block' : 'none';
        });
      }
      
      // Single QR logo options
      if (showLogoOptions) {
        showLogoOptions.addEventListener('change', function() {
          logoOptionsContent.style.display = this.checked ? 'flex' : 'none';
        });
      }
      
      // Bulk QR color options
      if (bulkShowColorOptions) {
        bulkShowColorOptions.addEventListener('change', function() {
          bulkColorOptionsContent.style.display = this.checked ? 'block' : 'none';
        });
      }
      
      // Bulk QR logo options
      if (bulkShowLogoOptions) {
        bulkShowLogoOptions.addEventListener('change', function() {
          bulkLogoOptionsContent.style.display = this.checked ? 'flex' : 'none';
        });
      }
    }

    function initTextDisplay() {
      // Toggle text display fields
      if (showTextDisplay) {
        showTextDisplay.addEventListener('change', function() {
          textDisplayFields.style.display = this.checked ? 'block' : 'none';
          updateTextPreview();
        });
      }
      
      // Update preview when any text-related field changes
      const textFields = [customText, textPrefix, textSuffix, textColor, textSize, textAlign];
      textFields.forEach(field => {
        if (field) {
          field.addEventListener('input', updateTextPreview);
        }
      });
    }

    function initBulkTextDisplay() {
      // Toggle bulk text display fields
      if (bulkShowTextDisplay) {
        bulkShowTextDisplay.addEventListener('change', function() {
          bulkTextDisplayFields.style.display = this.checked ? 'block' : 'none';
        });
      }
    }

    function updateTextPreview() {
      if (!showTextDisplay || !showTextDisplay.checked) return;
      
      let displayText = customText.value.trim();
      
      // If no custom text, use QR content
      if (!displayText) {
        const type = qrType.value;
        try {
          displayText = getQRContent(type);
        } catch {
          displayText = "QR code content will appear here";
        }
      }
      
      // Add prefix and suffix with spaces
      const prefixVal = textPrefix.value.trim();
      const suffixVal = textSuffix.value.trim();
      
      if (prefixVal || suffixVal) {
        const parts = [];
        if (prefixVal) parts.push(prefixVal);
        if (displayText) parts.push(displayText);
        if (suffixVal) parts.push(suffixVal);
        displayText = parts.join(' ');
      }
      
      // Update preview
      if (textPreview) {
        textPreview.textContent = displayText;
        textPreview.style.color = textColor.value;
        textPreview.style.fontSize = textSize.value;
        textPreview.style.textAlign = textAlign.value;
      }
    }
   
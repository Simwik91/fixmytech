
// Barcode Generator Functionality
function initBarcodeGenerator() {
  // Constants
  const elements = {
    tabs: document.querySelectorAll('.tab'),
    tabContents: document.querySelectorAll('.tab-content'),
    singleCanvas: document.getElementById('ean-canvas'),
    downloadBtn: document.getElementById('download-btn'),
    downloadSvgBtn: document.getElementById('download-svg-btn'),
    singleLoading: document.getElementById('single-loading'),
    batchLoading: document.getElementById('batch-loading'),
    batchProgress: document.getElementById('batch-progress'),
    singleError: document.getElementById('single-error'),
    batchError: document.getElementById('batch-error'),
    singleSuccess: document.getElementById('single-success'),
    batchSuccess: document.getElementById('batch-success'),
    eanType: document.getElementById('ean-type'),
    eanInput: document.getElementById('ean-input'),
    eanInputFeedback: document.getElementById('ean-input-feedback'),
    batchEanType: document.getElementById('batch-ean-type'),
    batchAmount: document.getElementById('batch-amount'),
    generateSingleBtn: document.getElementById('generate-single-btn'),
    generateBatchPngBtn: document.getElementById('generate-batch-png-btn'),
    generateBatchSvgBtn: document.getElementById('generate-batch-svg-btn'),
    
    // Copy to clipboard elements
    copyBtn: document.getElementById('copy-btn'),
  };

  const barcodeConfig = {
    ean13: { length: 12, regex: /^\d{12,13}$/, format: 'ean13' },
    ean8: { length: 7, regex: /^\d{7,8}$/, format: 'ean8' },
    upc: { length: 11, regex: /^\d{11,12}$/, format: 'UPC' },
    itf14: { length: 13, regex: /^\d{13,14}$/, format: 'itf14' },
    code128: { regex: /^[\w\s-]+$/, format: 'code128' },
    code39: { regex: /^[0-9A-Z\s-.%*+$/]+$/, format: 'code39' },
    codabar: { regex: /^[A-D][0-9-:$/.+]*[A-D]$/, format: 'codabar' },
    pharmacode: { min: 3, max: 131070, regex: /^\d+$/, format: 'pharmacode' }
  };

  function initCopyToClipboard() {
    const copySuccess = document.getElementById('copy-success');
    // Copy button functionality
    elements.copyBtn.addEventListener('click', function() {
      const barcodeValue = elements.singleCanvas.dataset.code;
      if (!barcodeValue) return;
      
      navigator.clipboard.writeText(barcodeValue)
        .then(() => {
          copySuccess.style.display = 'inline-block';
          setTimeout(() => {
            copySuccess.style.display = 'none';
          }, 2000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = barcodeValue;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          
          copySuccess.style.display = 'inline-block';
          setTimeout(() => {
            copySuccess.style.display = 'none';
          }, 2000);
        });
    });
  }


  async function generateBarcode({ canvas, code, type, errorElement, successElement, downloadButton, svgDownloadButton, loadingElement }) {
    const ctx = canvas.getContext('2d');
    canvas.style.display = 'none'; // Explicitly hide canvas at the beginning
    loadingElement.style.display = 'flex';
    downloadButton.style.display = 'none';
    svgDownloadButton.style.display = 'none';
    elements.copyBtn.style.display = 'none';
    errorElement.style.display = 'none';

    const validation = validateInput(code, type);
    if (validation !== true) {
      errorElement.textContent = validation;
      errorElement.style.display = 'block';
      loadingElement.style.display = 'none';
      return;
    }

    const finalCode = code || generateRandomBarcode(type);
    const isPharmacode = type === 'pharmacode';
    // Fixed size as requested
    const width = 320;
    const height = 150;
    
    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.dataset.code = finalCode;
    canvas.dataset.type = type;

    try {
      // Generate the barcode with custom colors and background
      JsBarcode(canvas, finalCode, {
        format: barcodeConfig[type].format,
        displayValue: true,
        width: 2,
        height: isPharmacode ? height * 0.5 : height * 0.7,
        lineColor: '#000000',
        textColor: '#000000',
        background: '#FFFFFF'
      });

      downloadButton.style.display = 'inline-block';
      svgDownloadButton.style.display = 'inline-block';
      canvas.style.display = 'block';
      
      // Show the copy to clipboard section
      elements.copyBtn.style.display = 'inline-block';
      
    } catch (error) {
      console.error(`Failed to generate barcode:`, error);
      errorElement.textContent = 'Ugyldig verdi for den valgte strekkodetypen.';
      errorElement.style.display = 'block';
    } finally {
      loadingElement.style.display = 'none';
    }
  }

  function downloadBarcode(canvas, errorElement) {
    try {
      const code = canvas.dataset.code;
      const link = document.createElement('a');
      link.download = `${sanitizeFilename(code)}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      showError(errorElement, 'Error downloading barcode');
    }
  }

  function downloadSVG(canvas, errorElement) {
    try {
      const code = canvas.dataset.code;
      const type = canvas.dataset.type;
      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("xmlns", svgNS);
      svg.setAttribute("version", "1.1");
      svg.setAttribute("width", canvas.width);
      svg.setAttribute("height", canvas.height);
      
      // Create SVG barcode
      JsBarcode(svg, code, {
        format: barcodeConfig[type].format,
        displayValue: true,
        width: 2,
        height: canvas.height * 0.7,
        lineColor: '#000000',
        textColor: '#000000',
        background: '#FFFFFF'
      });

      // Serialize SVG
      const serializer = new XMLSerializer();
      let svgString = serializer.serializeToString(svg);
      if (!svgString.includes('xmlns')) {
        svgString = svgString.replace(/<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }

      // Create blob and download
      const blob = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${sanitizeFilename(code)}.svg`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      showError(errorElement, 'Error generating SVG: ' + error.message);
    }
  }

  async function generateBatchBarcodes(format) {
    const type = elements.batchEanType.value;
    const amount = parseInt(elements.batchAmount.value);
    // Fixed size as requested
    const width = 320;
    const height = 150;

            if (isNaN(amount) || amount < 1 || amount > 100) {

              console.error('Please enter a number between 1 and 100');

              return;

            }

        

            elements.batchLoading.style.display = 'block';

    

        try {

          const zip = new JSZip();

          const canvas = document.createElement('canvas');

          const isPharmacode = type === 'pharmacode';

    

          for (let i = 0; i < amount; i++) {

            elements.batchProgress.textContent = `Generating barcodes: ${i + 1}/${amount}`;

            const code = generateRandomBarcode(type);

            canvas.width = width;

            canvas.height = height;

    

            try {

              // Generate the barcode with customization

              const ctx = canvas.getContext('2d');

              ctx.clearRect(0, 0, canvas.width, canvas.height);

              

              if (format === 'svg') {

                // Create SVG element

                const svgNS = "http://www.w3.org/2000/svg";

                const svg = document.createElementNS(svgNS, "svg");

                svg.setAttribute("xmlns", svgNS);

                svg.setAttribute("version", "1.1");

                svg.setAttribute("width", width);

                svg.setAttribute("height", height);

                

                // Generate SVG barcode

                JsBarcode(svg, code, {

                  format: barcodeConfig[type].format,

                  displayValue: true,

                  width: 2,

                  height: isPharmacode ? height * 0.5 : height * 0.7,

                  lineColor: '#000000',

                  textColor: '#000000',

                  background: '#FFFFFF'

                });

    

                // Serialize SVG

                const serializer = new XMLSerializer();

                let svgString = serializer.serializeToString(svg);

                if (!svgString.includes('xmlns')) {

                  svgString = svgString.replace(/<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');

                }

                zip.file(`${sanitizeFilename(code)}.svg`, svgString);

              } else {

                // Generate PNG barcode

                JsBarcode(canvas, code, {

                  format: barcodeConfig[type].format,

                  displayValue: true,

                  width: 2,

                  height: isPharmacode ? height * 0.5 : height * 0.7,

                  lineColor: '#000000',

                  textColor: '#000000',

                  background: '#FFFFFF'

                });

                                const dataUrl = canvas.toDataURL('image/png', 1.0);

                                const imgData = dataUrl.replace(/^data:image\/png;base64,/, '');

                                zip.file(`${sanitizeFilename(code)}.png`, imgData, { base64: true });

                              }

            } catch (err) {

              console.warn(`Error generating barcode for code ${code}: ${err.message}`);

            }

    

            await new Promise(resolve => setTimeout(resolve, 10));

          }

    

          const blob = await zip.generateAsync({ type: 'blob' });

          saveAs(blob, `batch-${sanitizeFilename(type)}-${format}.zip`);

        } catch (error) {

          console.error(`Error creating ZIP file: ${error.message}`);

        } finally {

          elements.batchLoading.style.display = 'none';

        }
  }

  function initializeBarcodeGenerator() {
    // Initialize copy to clipboard functionality
    initCopyToClipboard();

    function updateEanInputFeedback() {
        const selectedType = elements.eanType.value;
        const config = barcodeConfig[selectedType];
        let feedback = '';

        if (config.length) {
            feedback = `For ${selectedType.toUpperCase()}, forventes ${config.length} siffer.`;
        } else if (config.min && config.max) {
            feedback = `For ${selectedType.toUpperCase()}, forventes et tall mellom ${config.min} og ${config.max}.`;
        } else {
            feedback = `For ${selectedType.toUpperCase()}, forventes et format som: ${config.regex}`;
        }
        elements.eanInputFeedback.textContent = feedback;
    }

    elements.eanType.addEventListener('change', updateEanInputFeedback);
    updateEanInputFeedback();
    
    // Tabs functionality
    elements.tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        elements.tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        elements.tabContents.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
      });
      tab.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          tab.click();
        }
      });
    });

    // Input events
    elements.eanInput.addEventListener('keypress', e => {
      if (e.key === 'Enter') elements.generateSingleBtn.click();
    });

    // Button click handlers
    elements.generateSingleBtn.addEventListener('click', () => generateBarcode({
      canvas: elements.singleCanvas,
      code: elements.eanInput.value.trim(),
      type: elements.eanType.value,
      errorElement: elements.singleError,
      successElement: elements.singleSuccess,
      downloadButton: elements.downloadBtn,
      svgDownloadButton: elements.downloadSvgBtn,
      loadingElement: elements.singleLoading
    }));

    elements.downloadBtn.addEventListener('click', () => downloadBarcode(elements.singleCanvas, elements.singleError));
    elements.downloadSvgBtn.addEventListener('click', () => downloadSVG(elements.singleCanvas, elements.singleError));

    elements.generateBatchPngBtn.addEventListener('click', () => generateBatchBarcodes('png'));
    elements.generateBatchSvgBtn.addEventListener('click', () => generateBatchBarcodes('svg'));
  }
  
  function calculateChecksum(code, type) {
    let sum = 0;
    if (type === 'ean8') {
      const weights = [3, 1, 3, 1, 3, 1, 3];
      for (let i = 0; i < code.length; i++) sum += parseInt(code[i]) * weights[i];
    } else if (type === 'upc' || type === 'itf14') {
      for (let i = 0; i < code.length; i++) sum += parseInt(code[i]) * (i % 2 === 0 ? 3 : 1);
    } else {
      const weights = [1, 3];
      for (let i = 0; i < code.length; i++) sum += parseInt(code[i]) * weights[i % 2];
    }
    return (10 - (sum % 10)) % 10;
  }

  function generateRandomEAN(type) {
    const { length } = barcodeConfig[type];
    let base = Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
    return base + calculateChecksum(base, type);
  }

  function validateInput(code, type) {
    const config = barcodeConfig[type];
    if (!code) return true;
    
    if (!config.regex.test(code)) {
        return `Ugyldig format. For ${type}, bruk formatet: ${config.regex}`;
    }
    
    if (config.length && code.length !== config.length) {
        return `Ugyldig lengde. ${type} må ha ${config.length} siffer.`
    }

    if (type === 'pharmacode') {
      const num = parseInt(code);
      if (isNaN(num) || num < config.min || num > config.max) {
        return `Ugyldig verdi for Pharmacode. Må være et tall mellom ${config.min} og ${config.max}.`;
      }
    }
    
    return true;
  }

  function generateRandomBarcode(type) {
    if (['ean13', 'ean8', 'upc', 'itf14'].includes(type)) {
      return generateRandomEAN(type);
    }
    switch (type) {
      case 'code128':
      case 'code39':
        return Math.random().toString(36).slice(2, 12).toUpperCase();
      case 'codabar':
        return `A${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}B`;
      case 'pharmacode':
        return Math.floor(Math.random() * (barcodeConfig.pharmacode.max - barcodeConfig.pharmacode.min + 1) + barcodeConfig.pharmacode.min).toString();
      default:
        return '123456';
    }
  }

  function sanitizeFilename(str) {
    return str.replace(/[^a-zA-Z00-9-]+/g, '_').slice(0, 50) || 'barcode';
  }
  
  initializeBarcodeGenerator();
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initBarcodeGenerator();
});

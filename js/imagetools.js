// State management
    const state = {
      crop: {
        originalImage: null,
        croppedImage: null,
        cropRect: null,
        isDrawing: false,
        cropStart: null,
        initialImage: null,
        quality: 80
      },
      resize: {
        originalImage: null,
        resizedImage: null,
        initialImage: null,
        quality: 80
      },
      convert: {
        originalImage: null,
        convertedImage: null,
        initialImage: null,
        quality: 80
      },
      color: {
        originalImage: null,
        initialImage: null
      }
    };

    // Helper Functions
    function showError(element, message) {
      if (element) {
        element.textContent = message;
        element.style.display = 'block';
      }
    }

    function showSuccess(element, message) {
      if (element) {
        element.textContent = message;
        element.style.display = 'block';
      }
    }

    function hideElements(section = null) {
      const errors = section ? [document.getElementById(`${section}-error`)] : document.querySelectorAll('.error');
      const successes = section ? [document.getElementById(`${section}-success`)] : document.querySelectorAll('.success');
      errors.forEach(el => { if (el) { el.style.display = 'none'; el.textContent = ''; } });
      successes.forEach(s => { if (s) { s.style.display = 'none'; s.textContent = ''; } });
    }

    function showLoading(section) {
      const loading = document.getElementById(`${section}-loading`);
      if (loading) loading.style.display = 'block';
    }

    function hideLoading(section) {
      const loading = document.getElementById(`${section}-loading`);
      if (loading) loading.style.display = 'none';
    }

    function calculateFileSize(dataUrl) {
      // Base64 encoding is about 4/3 the size of the binary data
      const sizeInBytes = Math.round((dataUrl.length * 3) / 4);
      const sizeInKB = (sizeInBytes / 1024).toFixed(2);
      return sizeInKB;
    }

    function getDataUrlWithQuality(canvas, format, quality) {
      switch(format) {
        case 'jpeg':
          return canvas.toDataURL('image/jpeg', quality / 100);
        case 'webp':
          return canvas.toDataURL('image/webp', quality / 100);
        case 'png':
          // PNG doesn't support quality, but we can reduce colors
          return canvas.toDataURL('image/png');
        case 'bmp':
          return canvas.toDataURL('image/bmp');
        case 'gif':
          return canvas.toDataURL('image/gif');
        default:
          return canvas.toDataURL('image/png');
      }
    }

    function updateFileSizeDisplay(section, canvas, format) {
      const sizeDisplay = document.getElementById(`${section}-file-size`);
      if (!sizeDisplay || !canvas) return;
      
      // Get data URL with current quality settings
      const quality = state[section].quality;
      const dataUrl = getDataUrlWithQuality(canvas, format, quality);
      const sizeInKB = calculateFileSize(dataUrl);
      
      sizeDisplay.textContent = `Estimated file size: ${sizeInKB} KB (Quality: ${quality}%)`;
    }

    async function loadImage(file) {
      return new Promise((resolve, reject) => {
        const fileType = file.type.toLowerCase();
        if (!fileType.match(/image\/(png|jpeg|jpg|webp|bmp|gif|heic|heif)/)) {
          reject(new Error('Invalid file type. Please upload a valid image (PNG, JPEG, WEBP, BMP, GIF, or HEIC).'));
          return;
        }

        if (file.size > 10 * 1024 * 1024) {
          reject(new Error('File size exceeds 10MB limit. Please select a smaller file.'));
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            resolve(img);
          };
          img.onerror = () => reject(new Error('Failed to load image'));
          img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error('Failed to read image file'));
        reader.readAsDataURL(file);
      });
    }

    function drawImageOnCanvas(image, canvasId) {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const maxWidth = 500;
      const scale = Math.min(maxWidth / image.width, 1);
      const pixelRatio = window.devicePixelRatio || 1;

      canvas.style.width = `${image.width * scale}px`;
      canvas.style.height = `${image.height * scale}px`;
      canvas.width = image.width * scale * pixelRatio;
      canvas.height = image.height * scale * pixelRatio;
      ctx.scale(pixelRatio, pixelRatio);

      ctx.clearRect(0, 0, canvas.width / pixelRatio, canvas.height / pixelRatio);
      ctx.drawImage(image, 0, 0, canvas.width / pixelRatio, canvas.height / pixelRatio);
    }
    
    function resetCanvas(canvasId) {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      canvas.style.width = '300px';
      canvas.style.height = '200px';
      canvas.width = 300;
      canvas.height = 200;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    function clamp(value) {
      return Math.max(0, Math.min(255, value));
    }
    
    function resetToInitial(tab) {
      const stateTab = state[tab];
      if (stateTab.initialImage) {
        stateTab.originalImage = stateTab.initialImage;
        drawImageOnCanvas(stateTab.initialImage, `${tab}Canvas`);
        showSuccess(document.getElementById(`${tab}-success`), 'Reset to original image!');
      }
    }

    function initQualityControls() {
      // Initialize all quality sliders
      document.querySelectorAll('.quality-slider').forEach(slider => {
        const tab = slider.id.replace('Quality', '');
        const valueDisplay = document.getElementById(`${tab}QualityValue`);
        
        slider.addEventListener('input', () => {
          const value = slider.value;
          valueDisplay.textContent = `${value}%`;
          state[tab].quality = parseInt(value);
          
          // Update file size display if we have an image
          if (state[tab].originalImage) {
            const canvas = document.getElementById(`${tab}Canvas`);
            const format = tab === 'convert' ? document.getElementById('outputFormat').value : 'jpeg';
            updateFileSizeDisplay(tab, canvas, format);
          }
        });
      });
    }

    // Color Picker Functions
    function rgbToHex(r, g, b) {
      return "#" + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      }).join("");
    }
    
    // NEW: RGB to HSL conversion function
    function rgbToHsl(r, g, b) {
      r /= 255;
      g /= 255;
      b /= 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;
      
      if (max === min) {
        h = s = 0; // achromatic
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        
        h /= 6;
      }
      
      return [
        Math.round(h * 360),
        Math.round(s * 100),
        Math.round(l * 100)
      ];
    }

    // MODIFIED: handleColorPick function
    function handleColorPick(event, canvas, image) {
      const rect = canvas.getBoundingClientRect();
      const pixelRatio = window.devicePixelRatio || 1;
      const x = Math.floor((event.clientX - rect.left) * pixelRatio);
      const y = Math.floor((event.clientY - rect.top) * pixelRatio);
      
      // Create a temporary canvas to get the pixel data
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = image.width;
      tempCanvas.height = image.height;
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.drawImage(image, 0, 0);
      
      // Get the pixel data
      const pixelData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data;
      
      // Calculate the position in the pixel data array
      const scaleX = image.width / (canvas.width / pixelRatio);
      const scaleY = image.height / (canvas.height / pixelRatio);
      const imageX = Math.floor(x * scaleX / pixelRatio);
      const imageY = Math.floor(y * scaleY / pixelRatio);
      const pos = (imageY * image.width + imageX) * 4;
      
      // Get RGB values
      const r = pixelData[pos];
      const g = pixelData[pos + 1];
      const b = pixelData[pos + 2];
      
      // Convert to HEX
      const hex = rgbToHex(r, g, b);
      
      // Convert to RGB
      const rgb = `rgb(${r}, ${g}, ${b})`;
      
      // Convert to HSL
      const [h, s, l] = rgbToHsl(r, g, b);
      const hsl = `hsl(${h}, ${s}%, ${l}%)`;
      
      // Update the display
      const colorDisplay = document.getElementById('colorDisplay');
      
      colorDisplay.style.backgroundColor = hex;
      document.getElementById('colorValueHex').textContent = hex;
      document.getElementById('colorValueRgb').textContent = rgb;
      document.getElementById('colorValueHsl').textContent = hsl;
      
      // Show success message
      showSuccess(document.getElementById('color-success'), `Color picked: ${hex}`);
    }

    // Initialize Image Tools
    function initializeImageTools() {
      // Tabs
      document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
          const tabName = tab.dataset.tab;
          document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
          document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
          
          tab.classList.add('active');
          document.getElementById(`${tabName}-tab`).classList.add('active');
        });
      });

      // Setup drag and drop functionality
      function setupDragAndDrop(dragArea, fileInput, section) {
        dragArea.addEventListener('click', () => fileInput.click());
        dragArea.addEventListener('dragover', (e) => {
          e.preventDefault();
          dragArea.classList.add('drag-over');
        });
        dragArea.addEventListener('dragenter', (e) => {
          e.preventDefault();
          dragArea.classList.add('drag-over');
        });
        dragArea.addEventListener('dragleave', () => {
          dragArea.classList.remove('drag-over');
        });
        dragArea.addEventListener('drop', (e) => {
          e.preventDefault();
          dragArea.classList.remove('drag-over');
          const files = e.dataTransfer.files;
          if (files.length > 0) {
            fileInput.files = files;
            fileInput.dispatchEvent(new Event('change'));
          }
        });
      }

      // Crop Functionality
      const cropUpload = document.getElementById('cropUpload');
      const cropCanvas = document.getElementById('cropCanvas');
      const cropBtn = document.getElementById('cropBtn');
      const downloadCrop = document.getElementById('downloadCrop');
      const resetCrop = document.getElementById('resetCrop');
      
      setupDragAndDrop(document.getElementById('cropDragArea'), cropUpload, 'crop');
      
      cropUpload.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        hideElements('crop');
        showLoading('crop');
        try {
          const img = await loadImage(file);
          state.crop.originalImage = img;
          state.crop.initialImage = img;
          drawImageOnCanvas(img, 'cropCanvas');
          cropBtn.style.display = 'inline-block';
          resetCrop.style.display = 'inline-block';
          updateFileSizeDisplay('crop', cropCanvas, 'jpeg');
          showSuccess(document.getElementById('crop-success'), 'Image loaded successfully!');
        } catch (err) {
          showError(document.getElementById('crop-error'), err.message);
          resetCanvas('cropCanvas');
        } finally {
          hideLoading('crop');
        }
      });

      // Crop drawing functionality
      cropCanvas.addEventListener('mousedown', (e) => {
        if (!state.crop.originalImage) {
          showError(document.getElementById('crop-error'), 'Please upload an image first.');
          return;
        }
        state.crop.isDrawing = true;
        const rect = cropCanvas.getBoundingClientRect();
        const pixelRatio = window.devicePixelRatio || 1;
        state.crop.cropStart = { x: (e.clientX - rect.left) * pixelRatio, y: (e.clientY - rect.top) * pixelRatio };
      });

      cropCanvas.addEventListener('mousemove', (e) => {
        if (!state.crop.isDrawing || !state.crop.originalImage) return;
        const rect = cropCanvas.getBoundingClientRect();
        const pixelRatio = window.devicePixelRatio || 1;
        const currentX = (e.clientX - rect.left) * pixelRatio;
        const currentY = (e.clientY - rect.top) * pixelRatio;
        state.crop.cropRect = {
          x: Math.min(state.crop.cropStart.x, currentX),
          y: Math.min(state.crop.cropStart.y, currentY),
          width: Math.abs(currentX - state.crop.cropStart.x),
          height: Math.abs(currentY - state.crop.cropStart.y),
        };
        const ctx = cropCanvas.getContext('2d');
        ctx.clearRect(0, 0, cropCanvas.width / pixelRatio, cropCanvas.height / pixelRatio);
        ctx.drawImage(state.crop.originalImage, 0, 0, cropCanvas.width / pixelRatio, cropCanvas.height / pixelRatio);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeRect(state.crop.cropRect.x / pixelRatio, state.crop.cropRect.y / pixelRatio, state.crop.cropRect.width / pixelRatio, state.crop.cropRect.height / pixelRatio);
      });

      cropCanvas.addEventListener('mouseup', () => {
        state.crop.isDrawing = false;
      });

      cropBtn.addEventListener('click', () => {
        hideElements('crop');
        if (!state.crop.cropRect || !state.crop.originalImage) {
          showError(document.getElementById('crop-error'), 'Please draw a crop area on an uploaded image.');
          return;
        }
        showLoading('crop');
        setTimeout(() => {
          try {
            const pixelRatio = window.devicePixelRatio || 1;
            const scale = state.crop.originalImage.width / (cropCanvas.width / pixelRatio);
            const sx = state.crop.cropRect.x * scale / pixelRatio;
            const sy = state.crop.cropRect.y * scale / pixelRatio;
            const sWidth = state.crop.cropRect.width * scale / pixelRatio;
            const sHeight = state.crop.cropRect.height * scale / pixelRatio;
            const croppedCanvas = document.createElement('canvas');
            croppedCanvas.width = sWidth;
            croppedCanvas.height = sHeight;
            const ctx = croppedCanvas.getContext('2d');
            ctx.drawImage(state.crop.originalImage, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);
            state.crop.croppedImage = croppedCanvas;
            drawImageOnCanvas(croppedCanvas, 'cropCanvas');
            downloadCrop.style.display = 'inline-block';
            updateFileSizeDisplay('crop', croppedCanvas, 'jpeg');
            showSuccess(document.getElementById('crop-success'), 'Image cropped successfully!');
          } catch (err) {
            showError(document.getElementById('crop-error'), 'Error cropping image: ' + err.message);
          } finally {
            hideLoading('crop');
          }
        }, 300);
      });

      downloadCrop.addEventListener('click', () => {
        if (state.crop.croppedImage) {
          const link = document.createElement('a');
          link.download = 'cropped-image.jpg';
          const quality = state.crop.quality / 100;
          link.href = state.crop.croppedImage.toDataURL('image/jpeg', quality);
          link.click();
          showSuccess(document.getElementById('crop-success'), 'Image downloaded successfully!');
        } else {
          showError(document.getElementById('crop-error'), 'No cropped image available for download.');
        }
      });

      resetCrop.addEventListener('click', () => {
        resetToInitial('crop');
        updateFileSizeDisplay('crop', cropCanvas, 'jpeg');
      });

      // Resize Functionality
      const resizeUpload = document.getElementById('resizeUpload');
      const resizeCanvas = document.getElementById('resizeCanvas');
      const resizeBtn = document.getElementById('resizeBtn');
      const downloadResize = document.getElementById('downloadResize');
      const resetResize = document.getElementById('resetResize');
      
      setupDragAndDrop(document.getElementById('resizeDragArea'), resizeUpload, 'resize');
      
      resizeUpload.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        hideElements('resize');
        showLoading('resize');
        try {
          const img = await loadImage(file);
          state.resize.originalImage = img;
          state.resize.initialImage = img;
          drawImageOnCanvas(img, 'resizeCanvas');
          resizeBtn.style.display = 'inline-block';
          resetResize.style.display = 'inline-block';
          updateFileSizeDisplay('resize', resizeCanvas, 'jpeg');
          showSuccess(document.getElementById('resize-success'), 'Image loaded successfully!');
        } catch (err) {
          showError(document.getElementById('resize-error'), err.message);
          resetCanvas('resizeCanvas');
        } finally {
          hideLoading('resize');
        }
      });

      resizeBtn.addEventListener('click', () => {
        hideElements('resize');
        if (!state.resize.originalImage) {
          showError(document.getElementById('resize-error'), 'Please upload an image first.');
          return;
        }
        const targetWidth = parseInt(document.getElementById('resizeWidth').value);
        const targetHeight = parseInt(document.getElementById('resizeHeight').value);
        if (isNaN(targetWidth) || isNaN(targetHeight) || targetWidth <= 0 || targetHeight <= 0) {
          showError(document.getElementById('resize-error'), 'Please enter valid width and height values.');
          return;
        }
        showLoading('resize');
        setTimeout(() => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(state.resize.originalImage, 0, 0, targetWidth, targetHeight);
            state.resize.resizedImage = canvas;
            drawImageOnCanvas(state.resize.resizedImage, 'resizeCanvas');
            downloadResize.style.display = 'inline-block';
            updateFileSizeDisplay('resize', canvas, 'jpeg');
            showSuccess(document.getElementById('resize-success'), 'Image resized successfully!');
          } catch (err) {
            showError(document.getElementById('resize-error'), 'Error resizing image: ' + err.message);
          } finally {
            hideLoading('resize');
          }
        }, 300);
      });

      downloadResize.addEventListener('click', () => {
        if (state.resize.resizedImage) {
          const link = document.createElement('a');
          link.download = 'resized-image.jpg';
          const quality = state.resize.quality / 100;
          link.href = state.resize.resizedImage.toDataURL('image/jpeg', quality);
          link.click();
          showSuccess(document.getElementById('resize-success'), 'Image downloaded successfully!');
        } else {
          showError(document.getElementById('resize-error'), 'No resized image available for download.');
        }
      });

      resetResize.addEventListener('click', () => {
        resetToInitial('resize');
        updateFileSizeDisplay('resize', resizeCanvas, 'jpeg');
      });
      
      // Convert Functionality
      const convertUpload = document.getElementById('convertUpload');
      const convertCanvas = document.getElementById('convertCanvas');
      const convertBtn = document.getElementById('convertBtn');
      
      setupDragAndDrop(document.getElementById('convertDragArea'), convertUpload, 'convert');
      
      convertUpload.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        hideElements('convert');
        showLoading('convert');
        try {
          const img = await loadImage(file);
          state.convert.originalImage = img;
          state.convert.initialImage = img;
          drawImageOnCanvas(img, 'convertCanvas');
          convertBtn.style.display = 'inline-block';
          updateFileSizeDisplay('convert', convertCanvas, document.getElementById('outputFormat').value);
          showSuccess(document.getElementById('convert-success'), 'Image loaded successfully!');
        } catch (err) {
          showError(document.getElementById('convert-error'), err.message);
          resetCanvas('convertCanvas');
        } finally {
          hideLoading('convert');
        }
      });

      // Update file size when format changes
      document.getElementById('outputFormat').addEventListener('change', () => {
        if (state.convert.originalImage) {
          updateFileSizeDisplay('convert', convertCanvas, document.getElementById('outputFormat').value);
        }
      });

      convertBtn.addEventListener('click', () => {
        hideElements('convert');
        if (!state.convert.originalImage) {
          showError(document.getElementById('convert-error'), 'Please upload an image first.');
          return;
        }
        showLoading('convert');
        setTimeout(() => {
          try {
            const format = document.getElementById('outputFormat').value;
            const canvas = document.createElement('canvas');
            canvas.width = state.convert.originalImage.width;
            canvas.height = state.convert.originalImage.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(state.convert.originalImage, 0, 0, canvas.width, canvas.height);
            
            let mimeType, fileExtension;
            switch(format) {
              case 'jpeg':
                mimeType = 'image/jpeg';
                fileExtension = 'jpg';
                break;
              case 'png':
                mimeType = 'image/png';
                fileExtension = 'png';
                break;
              case 'webp':
                mimeType = 'image/webp';
                fileExtension = 'webp';
                break;
              case 'bmp':
                mimeType = 'image/bmp';
                fileExtension = 'bmp';
                break;
              case 'gif':
                mimeType = 'image/gif';
                fileExtension = 'gif';
                break;
              default:
                mimeType = 'image/png';
                fileExtension = 'png';
            }
            
            const quality = state.convert.quality / 100;
            const dataUrl = canvas.toDataURL(mimeType, format === 'png' ? undefined : quality);
            updateFileSizeDisplay('convert', canvas, format);
            
            const link = document.createElement('a');
            link.download = `converted-image.${fileExtension}`;
            link.href = dataUrl;
            link.click();
            showSuccess(document.getElementById('convert-success'), `Image converted to ${format.toUpperCase()} successfully!`);
          } catch (err) {
            showError(document.getElementById('convert-error'), 'Error converting image: ' + err.message);
          } finally {
            hideLoading('convert');
          }
        }, 300);
      });

      // Color Picker Functionality
      const colorUpload = document.getElementById('colorUpload');
      const colorCanvas = document.getElementById('colorCanvas');
      const resetColor = document.getElementById('resetColor');
      
      setupDragAndDrop(document.getElementById('colorDragArea'), colorUpload, 'color');
      
      colorUpload.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        hideElements('color');
        showLoading('color');
        try {
          const img = await loadImage(file);
          state.color.originalImage = img;
          state.color.initialImage = img;
          drawImageOnCanvas(img, 'colorCanvas');
          resetColor.style.display = 'inline-block';
          showSuccess(document.getElementById('color-success'), 'Image loaded successfully! Click on the image to pick colors.');
          
          // Add click event listener to canvas for color picking
          colorCanvas.addEventListener('click', (e) => {
            handleColorPick(e, colorCanvas, img);
          });
        } catch (err) {
          showError(document.getElementById('color-error'), err.message);
          resetCanvas('colorCanvas');
        } finally {
          hideLoading('color');
        }
      });

      resetColor.addEventListener('click', () => {
        resetToInitial('color');
      });

      // Initialize quality controls
      initQualityControls();
    }
    
    // Initialize everything when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
      initializeImageTools();
    });
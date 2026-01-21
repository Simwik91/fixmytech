document.addEventListener('DOMContentLoaded', () => {
    const { createFFmpeg, fetchFile } = FFmpeg;
    let ffmpeg;
    let selectedFiles = [];

    // Cache DOM elements
    const imageUpload = document.getElementById('imageFileUpload');
    const imageThumbnails = document.getElementById('imageThumbnails');
    const imageUploadArea = document.getElementById('imageUploadArea');
    const confirmConvertImageBtn = document.getElementById('confirmConvertImageBtn');
    const imageFormat = document.getElementById('imageFormat');

    const audioUpload = document.getElementById('audioFileUpload');
    const audioFileList = document.getElementById('audioFileList');
    const audioUploadArea = document.getElementById('audioUploadArea');
    const confirmConvertAudioBtn = document.getElementById('confirmConvertAudioBtn');
    const audioFormat = document.getElementById('audioFormat');
    const audioProgressContainer = document.getElementById('audioProgressContainer');
    const audioProgressBar = document.getElementById('audioProgressBar');
    const audioProgressPercent = document.getElementById('audioProgressPercent');
    const audioProgressMessage = document.getElementById('audioProgressMessage');
    const downloadAudioBtn = document.getElementById('downloadAudioBtn');
    const audioPlayer = document.getElementById('audioPlayer');

    const videoUpload = document.getElementById('videoFileUpload');
    const videoFileList = document.getElementById('videoFileList');
    const videoUploadArea = document.getElementById('videoUploadArea');
    const confirmConvertVideoBtn = document.getElementById('confirmConvertVideoBtn');
    const videoFormat = document.getElementById('videoFormat');
    const videoProgressContainer = document.getElementById('videoProgressContainer');
    const videoProgressBar = document.getElementById('videoProgressBar');
    const videoProgressPercent = document.getElementById('videoProgressPercent');
    const videoProgressMessage = document.getElementById('videoProgressMessage');
    const downloadVideoBtn = document.getElementById('downloadVideoBtn');
    const videoPlayer = document.getElementById('videoPlayer');

    // --- FFmpeg setup ---
    async function loadFFmpeg() {
        if (!ffmpeg) {
            ffmpeg = createFFmpeg({
                log: true,
                corePath: 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js'
            });
        }
        if (!ffmpeg.isLoaded()) {
            await ffmpeg.load();
        }
    }

    // --- Conversion Logic ---
    async function convertFile(file, outputFormat, progressContainer, progressBar, progressPercent, progressMessage) {
        try {
            progressContainer.style.display = 'block';
            await loadFFmpeg();
            progressMessage.textContent = 'Laster inn fil...';
            const outputFilename = `${file.name.split('.').slice(0, -1).join('.')}.${outputFormat}`;
            ffmpeg.FS('writeFile', file.name, await fetchFile(file));
            ffmpeg.setProgress(({ ratio }) => {
                const percent = Math.round(ratio * 100);
                progressBar.style.width = `${percent}%`;
                progressPercent.textContent = `${percent}%`;
                progressMessage.textContent = `Konverterer... (${percent}%)`;
            });
            await ffmpeg.run('-i', file.name, outputFilename);
            progressMessage.textContent = 'Fullført! Klargjør nedlasting...';
            const data = ffmpeg.FS('readFile', outputFilename);
            const url = URL.createObjectURL(new Blob([data.buffer], { type: getMimeType(outputFormat) }));
            ffmpeg.FS('unlink', file.name);
            ffmpeg.FS('unlink', outputFilename);
            return { url, outputFilename };
        } catch (error) {
            console.error('Konverteringsfeil:', error);
            progressMessage.textContent = `Feil: ${error.message}`;
            return null;
        }
    }
    
    function getMimeType(format) {
        const mimeTypes = { 'mp4': 'video/mp4', 'webm': 'video/webm', 'gif': 'image/gif', 'mp3': 'audio/mpeg', 'wav': 'audio/wav', 'ogg': 'audio/ogg', 'jpg': 'image/jpeg', 'png': 'image/png', 'webp': 'image/webp', 'bmp': 'image/bmp' };
        return mimeTypes[format] || 'application/octet-stream';
    }

    // --- UI and Event Handling ---
    function setupTabs() {
        const tabs = document.querySelectorAll('.tab');
        const tabContents = document.querySelectorAll('.tab-content');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
                resetConverterState();
            });
        });
        document.querySelector('.tab[data-tab="image"]').click();
    }
    
    function setupFileUpload(uploadArea, fileInput, fileList, isImage) {
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
        uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            fileInput.files = e.dataTransfer.files;
            handleFiles(fileInput.files, fileList, isImage);
        });
        fileInput.addEventListener('change', () => handleFiles(fileInput.files, fileList, isImage));
    }

    function handleFiles(files, listElement, isImage) {
        selectedFiles = Array.from(files);
        listElement.innerHTML = ''; 
        for (const file of selectedFiles) {
            if (isImage) {
                const reader = new FileReader();
                reader.onload = e => {
                    listElement.insertAdjacentHTML('beforeend', `<div class="thumbnail-container" data-file-name="${file.name}"><img src="${e.target.result}" class="thumbnail" alt="Preview"><div class="thumbnail-overlay">${file.name}</div><div class="thumbnail-remove" title="Remove">&times;</div></div>`);
                };
                reader.readAsDataURL(file);
            } else {
                listElement.innerHTML = `<div class="file-item" data-file-name="${file.name}"><div class="file-info"><i class="fas fa-file file-icon"></i><div class="file-details"><div class="file-name">${file.name}</div><div class="file-size">${(file.size / (1024 * 1024)).toFixed(2)} MB</div></div></div><span class="file-status status-queued">Klar</span></div>`;
            }
        }
        updateConvertButtonVisibility();
    }
    
    function updateConvertButtonVisibility() {
        const currentActiveTab = document.querySelector('.tab.active');
        if (!currentActiveTab) return;
        const activeTabName = currentActiveTab.dataset.tab;
        
        confirmConvertImageBtn.style.display = 'none';
        confirmConvertAudioBtn.style.display = 'none';
        confirmConvertVideoBtn.style.display = 'none';

        if (selectedFiles.length > 0) {
            if (activeTabName === 'image') confirmConvertImageBtn.style.display = 'block';
            else if (activeTabName === 'audio') confirmConvertAudioBtn.style.display = 'block';
            else if (activeTabName === 'video') confirmConvertVideoBtn.style.display = 'block';
        }
    }

    function resetConverterState() {
        selectedFiles = [];
        imageThumbnails.innerHTML = '';
        audioFileList.innerHTML = '';
        videoFileList.innerHTML = '';
        document.querySelectorAll('.progress-modal, .preview-container').forEach(el => el.style.display = 'none');
        updateConvertButtonVisibility();
    }

    // --- Specific Converters Setup ---
    setupFileUpload(imageUploadArea, imageUpload, imageThumbnails, true);
    setupFileUpload(audioUploadArea, audioUpload, audioFileList, false);
    setupFileUpload(videoUploadArea, videoUpload, videoFileList, false);
    
    confirmConvertImageBtn.addEventListener('click', () => {
        if (selectedFiles.length === 0) {
            alert("Vennligst velg en fil først.");
            return;
        }
        const file = selectedFiles[0];
        const format = imageFormat.value;
        const mockProgress = { style: {}, set textContent(text) { console.log(text); } };
        
        convertFile(file, format, mockProgress, mockProgress, mockProgress, mockProgress).then(result => {
            if (result) {
                const link = document.createElement('a');
                link.href = result.url;
                link.download = result.outputFilename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        });
    });

    function setupDirectConversion(convertBtn, progressContainer, type) {
        convertBtn.addEventListener('click', async () => {
            if (selectedFiles.length !== 1) {
                alert("Vennligst velg en fil først.");
                return;
            };
            const file = selectedFiles[0];
            const format = document.getElementById(`${type}Format`).value;
            const progressBar = document.getElementById(`${type}ProgressBar`);
            const progressPercent = document.getElementById(`${type}ProgressPercent`);
            const progressMessage = document.getElementById(`${type}ProgressMessage`);
            const player = document.getElementById(`${type}Player`);
            const downloadBtn = document.getElementById(`download${type.charAt(0).toUpperCase() + type.slice(1)}Btn`);
            const preview = document.getElementById(`${type}Preview`);

            const result = await convertFile(file, format, progressContainer, progressBar, progressPercent, progressMessage);
            if (result) {
                player.src = result.url;
                downloadBtn.href = result.url;
                downloadBtn.download = result.outputFilename;
                preview.style.display = 'block';
            }
        });
    }

    setupDirectConversion(confirmConvertAudioBtn, audioProgressContainer, 'audio');
    setupDirectConversion(confirmConvertVideoBtn, videoProgressContainer, 'video');

    function stopClickHandler(event) {
        event.stopImmediatePropagation();
    }

    downloadAudioBtn.addEventListener('click', stopClickHandler);
    downloadVideoBtn.addEventListener('click', stopClickHandler);


    document.body.addEventListener('click', e => {
        if (e.target.classList.contains('thumbnail-remove') || e.target.classList.contains('file-remove')) {
            const parent = e.target.closest('.thumbnail-container, .file-item');
            if (parent) {
                parent.remove();
                selectedFiles = selectedFiles.filter(f => f.name !== parent.dataset.fileName);
                updateConvertButtonVisibility();
            }
        }
    });
    
    function init() {
        console.log("File Converter Initializing...");
        setupTabs();
        resetConverterState();
        loadFFmpeg().then(() => console.log("FFmpeg core loaded.")).catch(e => console.error("FFmpeg core failed to load:", e));
    }

    init();
});
// File Converter Functionality
function initFileConverter() {
    // Tab Switching
    function switchTab(tabName) {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const activeTab = document.querySelector(`.tab[data-tab="${tabName}"]`);
        const activeContent = document.getElementById(`${tabName}-tab`);
        
        if (activeTab && activeContent) {
            activeTab.classList.add('active');
            activeTab.setAttribute('aria-selected', 'true');
            activeContent.classList.add('active');
        }
    }
    
    // Initialize Tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
        tab.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                switchTab(tab.dataset.tab);
            }
        });
    });
    
    // Initialize with first tab active
    switchTab('image');
    
    // General file handling
    function handleFileUpload(input, list, isImage = false) {
        const files = input.files;
        if (files.length === 0) return;
        
        for (const file of files) {
            if (isImage) {
                const reader = new FileReader();
                reader.onload = e => {
                    const thumbnail = `
                        <div class="thumbnail-container" data-file-name="${file.name}">
                            <img src="${e.target.result}" class="thumbnail" alt="Preview of ${file.name}">
                            <div class="thumbnail-overlay">${file.name}</div>
                            <div class="thumbnail-remove" title="Remove">&times;</div>
                        </div>
                    `;
                    list.insertAdjacentHTML('beforeend', thumbnail);
                    updateImageButtons();
                };
                reader.readAsDataURL(file);
            } else {
                const fileItem = `
                    <div class="file-item" data-file-name="${file.name}">
                        <div class="file-info">
                            <i class="fas fa-file file-icon"></i>
                            <div class="file-details">
                                <div class="file-name">${file.name}</div>
                                <div class="file-size">${(file.size / (1024 * 1024)).toFixed(2)} MB</div>
                            </div>
                        </div>
                        <span class="file-status status-queued">Queued</span>
                        <span class="file-remove" title="Remove">&times;</span>
                    </div>
                `;
                list.insertAdjacentHTML('beforeend', fileItem);
            }
        }
    }

    function updateImageButtons() {
        const imageThumbnails = document.getElementById('imageThumbnails');
        const convertImageBtn = document.getElementById('convertImageBtn');
        const batchConvertBtn = document.getElementById('batchConvertBtn');
        const fileCount = imageThumbnails.children.length;

        if (fileCount === 1) {
            convertImageBtn.style.display = 'inline-flex';
            batchConvertBtn.style.display = 'none';
        } else if (fileCount > 1) {
            convertImageBtn.style.display = 'none';
            batchConvertBtn.style.display = 'inline-flex';
        } else {
            convertImageBtn.style.display = 'none';
            batchConvertBtn.style.display = 'none';
        }
    }

    // Image Converter
    const imageUpload = document.getElementById('imageFileUpload');
    const imageThumbnails = document.getElementById('imageThumbnails');
    const imageUploadArea = document.getElementById('imageUploadArea');
    
    imageUpload.addEventListener('change', () => handleFileUpload(imageUpload, imageThumbnails, true));
    imageUploadArea.addEventListener('click', () => imageUpload.click());

    // Audio Converter
    const audioUpload = document.getElementById('audioFileUpload');
    const audioFileList = document.getElementById('audioFileList');
    const audioUploadArea = document.getElementById('audioUploadArea');
    
    audioUpload.addEventListener('change', () => handleFileUpload(audioUpload, audioFileList));
    audioUploadArea.addEventListener('click', () => audioUpload.click());
    
    // Video Converter
    const videoUpload = document.getElementById('videoFileUpload');
    const videoFileList = document.getElementById('videoFileList');
    const videoUploadArea = document.getElementById('videoUploadArea');
    
    videoUpload.addEventListener('change', () => handleFileUpload(videoUpload, videoFileList));
    videoUploadArea.addEventListener('click', () => videoUpload.click());
    
    // Remove file listeners
    document.body.addEventListener('click', e => {
        if (e.target.classList.contains('thumbnail-remove') || e.target.classList.contains('file-remove')) {
            const parent = e.target.closest('.thumbnail-container, .file-item');
            if (parent) {
                parent.remove();
                updateImageButtons();
            }
        }
    });

    updateImageButtons();
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initFileConverter();
});
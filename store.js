const CLOUDINARY_CLOUD_NAME = 'dv8p0jznw';
const UPLOAD_PRESET = 'ml_default';

let vault;

class DocumentVault {
    constructor() {
        this.files = [];
        vault = this;
        this.init();
        console.log("✅ Document Vault Ready");
    }

    init() {
        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('fileInput');
        const uploadBtn = document.getElementById('uploadBtn');

        if (!dropZone || !fileInput || !uploadBtn) {
            console.error("❌ Required HTML elements missing.");
            return;
        }

        dropZone.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
            fileInput.value = '';
        });

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            this.handleFiles(e.dataTransfer.files);
        });

        uploadBtn.addEventListener('click', () => this.uploadAll());
    }

    handleFiles(files) {
        Array.from(files).forEach(file => {

            if (file.size > 10 * 1024 * 1024) {
                alert(`${file.name} exceeds 10MB limit`);
                return;
            }

            if (!this.files.some(f => f.name === file.name && f.size === file.size)) {
                this.files.push({
                    file: file,
                    name: file.name,
                    size: this.formatBytes(file.size),
                    status: 'Pending'
                });
            }
        });

        this.renderFileList();
        document.getElementById('uploadBtn').disabled = this.files.length === 0;
    }

    renderFileList() {
        const container = document.getElementById('fileList');
        if (!container) return;

        container.innerHTML = this.files.map((file, index) => `
            <div class="file-item">
                <div>
                    <strong>${file.name}</strong>
                    <div>${file.size}</div>
                    <div style="color:${this.getStatusColor(file.status)};">
                        ${file.status}
                    </div>
                </div>
                <button onclick="vault.removeFile(${index})">×</button>
            </div>
        `).join('');
    }

    getStatusColor(status) {
        if (status === 'Uploading...') return '#f59e0b';
        if (status === '✅ Uploaded') return '#10b981';
        if (status === '❌ Failed') return '#ef4444';
        return '#6b7280';
    }

    removeFile(index) {
        this.files.splice(index, 1);
        this.renderFileList();
        document.getElementById('uploadBtn').disabled = this.files.length === 0;
    }

    async uploadAll() {
        if (!this.files.length) return;

        const progressContainer = document.getElementById('progressContainer');
        const uploadArea = document.getElementById('uploadArea');

        progressContainer.style.display = 'block';
        uploadArea.style.opacity = '0.6';

        const results = [];

        for (let i = 0; i < this.files.length; i++) {
            const fileObj = this.files[i];
            fileObj.status = 'Uploading...';
            this.renderFileList();

            try {
                const url = await this.uploadFile(fileObj.file);
                fileObj.status = '✅ Uploaded';
                results.push({ name: fileObj.name, url: url });
            } catch (error) {
                fileObj.status = '❌ Failed';
                console.error(error);
            }

            this.updateProgress(i + 1);
            this.renderFileList();
        }

        uploadArea.style.opacity = '1';
        progressContainer.style.display = 'none';

        this.displayVault(results);

        this.files = [];
        this.renderFileList();
        document.getElementById('uploadBtn').disabled = true;
        this.resetProgress();
    }

    updateProgress(current) {
        const percent = (current / this.files.length) * 100;
        document.getElementById('progressFill').style.width = percent + '%';
        document.getElementById('progressText').textContent = Math.round(percent) + '%';
    }

    resetProgress() {
        document.getElementById('progressFill').style.width = '0%';
        document.getElementById('progressText').textContent = '0%';
    }

    async uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
            {
                method: 'POST',
                body: formData
            }
        );

        const data = await response.json();

        if (!response.ok || !data.secure_url) {
            throw new Error(data.error?.message || 'Upload failed');
        }

        return data.secure_url;
    }

    displayVault(results) {
        const container = document.getElementById('downloadLinks');
        if (!container) return;

        const newFilesHTML = results.map(file => `
            <div class="vault-file">
                <span>${file.name}</span>
                <a href="${file.url}" target="_blank" rel="noopener noreferrer">
                    View
                </a>
            </div>
        `).join('');

        container.innerHTML += newFilesHTML;
    }

    formatBytes(bytes) {
        const sizes = ['B', 'KB', 'MB'];
        let i = 0;
        while (bytes >= 1024 && i < sizes.length - 1) {
            bytes /= 1024;
            i++;
        }
        return bytes.toFixed(1) + ' ' + sizes[i];
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new DocumentVault();
});
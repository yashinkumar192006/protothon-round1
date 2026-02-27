// Data structure from govt services (50+ services grouped)
const domainsData = {
    "Identity & Financial": [
        { name: "PAN Card", docs: ["Aadhaar (OTP)", "Photo", "ID Proof (Voter/Passport)"] },
        { name: "Aadhaar Enrollment", docs: ["POI (Passport/PAN)", "POA (Utility Bill)", "DOB Proof"] },
        { name: "Aadhaar Update", docs: ["Aadhaar Number", "QR Code", "Supporting Docs"] },
        { name: "Voter ID (EPIC)", docs: ["Aadhaar/Birth Cert", "Address Proof", "Photo"] },
        { name: "Bank KYC", docs: ["Aadhaar/Passport/Voter ID", "NREGA Card"] },
        { name: "PAN-Aadhaar Link", docs: ["PAN Number", "Aadhaar Number"] },
        { name: "Income Certificate", docs: ["Aadhaar", "Ration Card", "Salary Slips"] },
        { name: "Domicile Certificate", docs: ["Aadhaar", "Voter ID", "School Cert"] },
        { name: "Caste Certificate", docs: ["Aadhaar", "Father's Caste Cert"] },
        { name: "Name Change Gazette", docs: ["Aadhaar", "Affidavit", "Newspaper Clipping"] }
    ],
    "Travel & Mobility": [
        { name: "Passport (Fresh)", docs: ["Aadhaar/PAN", "Address Proof", "Annexures"] },
        { name: "Passport Reissue", docs: ["Old Passport", "Aadhaar", "Address Proof"] },
        { name: "Driving License", docs: ["Aadhaar/10th Marksheet", "Address Proof"] },
        { name: "DL Duplicate", docs: ["DL Copy", "FIR", "Address Proof"] },
        { name: "Vehicle RC", docs: ["Insurance", "PUC", "Aadhaar"] },
        { name: "RC Transfer", docs: ["Seller/Buyer ID", "PUC", "Insurance"] },
        { name: "International Driving Permit", docs: ["Valid DL", "Passport", "Photos"] }
    ],
    "Welfare & Rations": [
        { name: "Ration Card (New)", docs: ["Aadhaar", "Family IDs", "Income Proof"] },
        { name: "Ration Surrender", docs: ["Existing Card", "Aadhaar"] },
        { name: "LPG Connection", docs: ["Aadhaar", "Bank Proof"] },
        { name: "PM Awas Yojana", docs: ["Aadhaar", "Ration Card"] },
        { name: "Ayushman Bharat", docs: ["Aadhaar", "Ration Card"] },
        { name: "Senior Citizen Card", docs: ["Aadhaar/Age Proof", "Photo"] },
        { name: "PM Kisan Samman", docs: ["Aadhaar", "Land Records"] }
    ],
    "Certificates": [
        { name: "Birth Certificate", docs: ["Parents Aadhaar", "Hospital Records"] },
        { name: "Death Certificate", docs: ["Medical Proof", "Applicant ID"] },
        { name: "Marriage Certificate", docs: ["Age Proof", "Photos", "Witnesses"] },
        { name: "Succession Certificate", docs: ["Death Cert", "Heirs Aadhaar"] },
        { name: "Legal Heir Certificate", docs: ["Ration Card", "Death Cert"] }
    ],
    "Special Services": [
        { name: "UDID Card", docs: ["Medical Report", "Aadhaar", "Photo"] },
        { name: "Disability Pension", docs: ["UDID", "Aadhaar", "Bank Details"] },
        { name: "NREGA Job Card", docs: ["Aadhaar", "Bank Passbook"] },
        { name: "EWS Certificate", docs: ["Income Cert", "Aadhaar"] },
        { name: "Trade License", docs: ["Aadhaar", "Shop Photos"] }
    ]
};

let currentDomain = null;
let currentService = null;
let fileInputs = [];

// Initialize app
document.addEventListener('DOMContentLoaded', function () {
    initDomains();
});

// Initialize domains
function initDomains() {
    const domains = document.getElementById('domains');
    domains.innerHTML = '';
    Object.keys(domainsData).forEach(domain => {
        const card = document.createElement('div');
        card.className = 'domain-card';
        card.innerHTML = `<h3>${domain}</h3><p>${domainsData[domain].length} services</p>`;
        card.onclick = () => selectDomain(domain);
        domains.appendChild(card);
    });
}

function selectDomain(domain) {
    currentDomain = domain;
    document.getElementById('step1').classList.remove('active');
    document.getElementById('step2').classList.add('active');
    populateServices(domain);
}

function populateServices(domain) {
    const services = document.getElementById('services');
    services.innerHTML = '';
    domainsData[domain].forEach(service => {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.innerHTML = `<h3>${service.name}</h3>`;
        card.onclick = () => selectService(service);
        services.appendChild(card);
    });
}

function selectService(service) {
    currentService = service;
    document.getElementById('step2').classList.remove('active');
    document.getElementById('step3').classList.add('active');
    populateDocuments(service.docs);
}

function populateDocuments(docs) {
    const section = document.getElementById('upload-section');
    section.innerHTML = `<h3>${currentService.name}</h3><p>Upload the following documents:</p>`;
    fileInputs = [];

    docs.forEach((doc, index) => {
        const group = document.createElement('div');
        group.className = 'upload-group';
        group.innerHTML = `
            <label>${doc}</label>
            <div class="file-input-wrapper">
                <input type="file" class="file-input" id="file${index}" accept="image/*,.pdf" onchange="handleFile(event, ${index})">
                <div class="file-btn">📱💻 Choose File (Phone/Laptop)</div>
            </div>
            <div class="file-list" id="filelist${index}">
                <div class="file-item">
                    <span id="filename${index}">No file selected</span>
                    <button class="btn btn-secondary remove-file-btn" onclick="clearFile(${index})">❌ Remove</button>
                </div>
            </div>
        `;
        section.appendChild(group);
        fileInputs.push(document.getElementById(`file${index}`));
    });
    updateProgress();
}

function handleFile(event, index) {
    const file = event.target.files[0];
    if (file) {
        document.getElementById(`filename${index}`).textContent = file.name;
        document.getElementById(`filelist${index}`).style.display = 'block';
        updateProgress();
    }
}

function clearFile(index) {
    document.getElementById(`file${index}`).value = '';
    document.getElementById(`filename${index}`).textContent = 'No file selected';
    document.getElementById(`filelist${index}`).style.display = 'none';
    updateProgress();
}

function updateProgress() {
    const filled = fileInputs.filter(input => input.files.length > 0).length;
    const total = fileInputs.length;
    const progress = document.getElementById('progress');
    const percentage = total > 0 ? (filled / total * 100) : 0;
    progress.style.width = percentage + '%';
}

function goBack(step) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step${step}`).classList.add('active');
    if (step === 1) {
        document.getElementById('domains').innerHTML = '';
        initDomains();
    }
    fileInputs = [];
}

function submitApplication() {
    const filledCount = fileInputs.filter(input => input.files.length > 0).length;
    if (filledCount === fileInputs.length && fileInputs.length > 0) {
        const year = new Date().getFullYear();
        const trackingNumber = "APP-" + year + "-" + Math.floor(100000 + Math.random() * 900000);

        const applications = JSON.parse(localStorage.getItem("applications")) || {};
        applications[trackingNumber] = {
            status: "Application Submitted",
            service: currentService.name
        };
        localStorage.setItem("applications", JSON.stringify(applications));

        document.getElementById('result').innerHTML = `
            <div style="background: rgba(255,255,255,0.95); padding: 1.5rem; border-radius: 8px; color: #4b006e; border: 2px solid green; margin-top: 2rem;">
                <h3 style="color: green; margin-bottom: 1rem;">✅ Application Submitted Successfully</h3>
                <p>For: <strong>${currentService.name}</strong></p>
                <p style="margin-top: 1rem;">Your Reference ID:</p>
                <strong style="font-size: 1.4rem; color: #ff8c00;">${trackingNumber}</strong>
                <p style="margin-top: 1rem;">Use this number to track your application.</p>
                <a href="track.html" style="display: inline-block; margin-top: 1rem; padding: 0.8rem 1.5rem; background-color: #007bff; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">Track Application</a>
            </div>
        `;

        // Hide submit button to prevent duplicate submissions
        document.querySelector('.submit-btn').style.display = 'none';
    } else {
        alert(`⚠️ Please upload all ${fileInputs.length} required documents first.
Currently uploaded: ${filledCount}`);
    }
}
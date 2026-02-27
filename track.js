document.addEventListener('DOMContentLoaded', () => {
    loadRecentComplaints();
    loadRecentApplications();
});

function loadRecentComplaints() {
    const complaints = JSON.parse(localStorage.getItem("complaints"));
    const container = document.getElementById("recentComplaintsContainer");
    const list = document.getElementById("recentComplaintsList");

    if (complaints && Object.keys(complaints).length > 0) {
        container.style.display = "block";
        list.innerHTML = "";

        for (const [trackingId, details] of Object.entries(complaints)) {
            const item = document.createElement("div");
            item.style.cssText = "background: rgba(255, 255, 255, 0.95); padding: 1rem; border-radius: 8px; color: #4b006e; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: background 0.2s;";

            // Re-use logic to apply specific colors to statuses if needed, default dark text
            let statusColor = "#6a0dad";
            if (details.status === "Approved" || details.status === "Resolved") statusColor = "green";
            if (details.status === "Under Review") statusColor = "orange";

            item.innerHTML = `
                <div>
                    <strong>ID: ${trackingId}</strong>
                </div>
                <div style="font-weight: bold; color: ${statusColor};">
                    ${details.status}
                </div>
            `;

            // Clicking a complaint automatically fills the input and checks status
            item.onclick = () => {
                document.getElementById("trackInput").value = trackingId;
                trackComplaint();
            };

            list.appendChild(item);
        }
    } else {
        container.style.display = "none";
    }
}

function loadRecentApplications() {
    const applications = JSON.parse(localStorage.getItem("applications"));
    const container = document.getElementById("recentApplicationsContainer");
    const list = document.getElementById("recentApplicationsList");

    if (applications && Object.keys(applications).length > 0) {
        container.style.display = "block";
        list.innerHTML = "";

        for (const [trackingId, details] of Object.entries(applications)) {
            const item = document.createElement("div");
            item.style.cssText = "background: rgba(255, 255, 255, 0.95); padding: 1rem; border-radius: 8px; color: #4b006e; display: flex; flex-direction: column; gap: 0.5rem; cursor: pointer; transition: background 0.2s;";

            let statusColor = "#6a0dad";
            if (details.status === "Approved") statusColor = "green";
            if (details.status === "Application Submitted") statusColor = "orange";

            const serviceName = details.service ? `<span style="font-size: 0.9rem; color: #555;">${details.service}</span>` : "";

            item.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong>ID: ${trackingId}</strong>
                    <div style="font-weight: bold; color: ${statusColor};">
                        ${details.status}
                    </div>
                </div>
                ${serviceName}
            `;

            item.onclick = () => {
                document.getElementById("appInput").value = trackingId;
                trackApplication();
            };

            list.appendChild(item);
        }
    } else {
        if (container) container.style.display = "none";
    }
}

function switchTab(tab) {
    const tabComplaint = document.getElementById("tab-complaint");
    const tabApplication = document.getElementById("tab-application");
    const secComplaint = document.getElementById("section-complaint");
    const secApplication = document.getElementById("section-application");

    const activeStyle = "flex: 1; text-align: center; padding: 1.5rem; background: linear-gradient(135deg, #ff8c00, #6a0dad); color: white; border-radius: 12px; cursor: pointer; font-weight: bold; font-size: 1.2rem; border: 2px solid #ff8c00; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.2s;";
    const inactiveStyle = "flex: 1; text-align: center; padding: 1.5rem; background: #e0e0e0; color: #555; border-radius: 12px; cursor: pointer; font-weight: bold; font-size: 1.2rem; border: 2px solid transparent; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.2s;";

    if (tab === 'complaint') {
        tabComplaint.style.cssText = activeStyle;
        tabApplication.style.cssText = inactiveStyle;
        secComplaint.style.display = "block";
        secApplication.style.display = "none";
    } else {
        tabApplication.style.cssText = activeStyle;
        tabComplaint.style.cssText = inactiveStyle;
        secApplication.style.display = "block";
        secComplaint.style.display = "none";
    }
}

function trackComplaint() {
    const tracking = document.getElementById("trackInput").value.trim();
    const complaints = JSON.parse(localStorage.getItem("complaints")) || {};
    const result = document.getElementById("statusResult");

    if (!tracking) {
        result.innerText = "⚠️ Please enter a tracking number.";
        result.style.color = "yellow";
        return;
    }

    if (!complaints[tracking]) {
        result.innerText = "❌ Tracking number not found.";
        result.style.color = "yellow";
    } else {
        result.innerText = "✅ Status: " + complaints[tracking].status;
        result.style.color = "lightgreen";
    }
}

function trackApplication() {
    const tracking = document.getElementById("appInput").value.trim();
    // Simulate application tracking
    const applications = JSON.parse(localStorage.getItem("applications")) || {};
    const result = document.getElementById("appStatusResult");

    if (!tracking) {
        result.innerText = "⚠️ Please enter an application ID.";
        result.style.color = "yellow";
        return;
    }

    if (applications[tracking]) {
        result.innerText = "✅ Status: " + applications[tracking].status;
        result.style.color = "lightgreen";
    } else {
        // Fallback for prototype: mock the tracking to show success
        const mockStatuses = ["Application Submitted", "Under Review", "Pending Document Verification", "Approved"];
        const randomStatus = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];
        result.innerText = "🔍 Status: " + randomStatus + " (ID: " + tracking + ")";
        result.style.color = "lightgreen";
    }
}
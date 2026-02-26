document.getElementById("complaintForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const year = new Date().getFullYear();
    const trackingNumber =
        "PSC-" + year + "-" + Math.floor(100000 + Math.random() * 900000);

    const complaints =
        JSON.parse(localStorage.getItem("complaints")) || {};

    complaints[trackingNumber] = {
        status: "Submitted"
    };

    localStorage.setItem("complaints", JSON.stringify(complaints));

    document.getElementById("result").innerHTML = `
        <div class="tracking-box">
            <h3>Complaint Submitted Successfully</h3>
            <p>Your Tracking Number:</p>
            <strong>${trackingNumber}</strong>
            <p>Use this number to track your complaint.</p>
            <a href="track-complaint.html">Track Complaint</a>
        </div>
    `;

    this.reset();
});
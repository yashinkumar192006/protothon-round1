function trackComplaint() {
    const tracking = document.getElementById("trackInput").value.trim();
    const complaints =
        JSON.parse(localStorage.getItem("complaints")) || {};

    const result = document.getElementById("statusResult");

    if (!complaints[tracking]) {
        result.innerText = "❌ Tracking number not found.";
        result.style.color = "yellow";
    } else {
        result.innerText = "✅ Status: " + complaints[tracking].status;
        result.style.color = "lightgreen";
    }
}
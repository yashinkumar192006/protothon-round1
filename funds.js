const schemeData = [
    {
        name: "Pradhan Mantri Awas Yojana (Urban)",
        description: "Housing for All initiative ensuring affordable pucca houses with water facility, sanitation, and electricity supply.",
        totalBudget: "₹ 80,000 Cr",
        amountReleased: 65000,
        amountSpent: 59000,
        beneficiaries: "1.18 Crore Families",
        unit: "Cr"
    },
    {
        name: "Jal Jeevan Mission",
        description: "Har Ghar Jal scheme to provide safe and adequate drinking tap water to all households in rural India.",
        totalBudget: "₹ 70,000 Cr",
        amountReleased: 55000,
        amountSpent: 48000,
        beneficiaries: "3.5 Crore Households",
        unit: "Cr"
    },
    {
        name: "Smart City Mission",
        description: "An urban renewal and retrofitting program by the Government of India with the mission to develop smart cities across the country.",
        totalBudget: "₹ 48,000 Cr",
        amountReleased: 36000,
        amountSpent: 30000,
        beneficiaries: "100+ Cities / ~10Cr People",
        unit: "Cr"
    },
    {
        name: "Ayushman Bharat PM-JAY",
        description: "World's largest health insurance scheme providing health cover of ₹5 lakh per family per year for secondary and tertiary care hospitalization.",
        totalBudget: "₹ 7,200 Cr",
        amountReleased: 6000,
        amountSpent: 5500,
        beneficiaries: "4.5 Crore Admissions",
        unit: "Cr"
    },
    {
        name: "National Education Mission",
        description: "Funding across states to improve educational infrastructure, quality of teaching, and provide digital learning resources.",
        totalBudget: "₹ 38,953 Cr",
        amountReleased: 29000,
        amountSpent: 26000,
        beneficiaries: "15 Lakh Schools",
        unit: "Cr"
    },
    {
        name: "PM GS Yojana (Rural Roads)",
        description: "Nationwide plan to provide good all-weather road connectivity to unconnected villages of India.",
        totalBudget: "₹ 19,000 Cr",
        amountReleased: 15000,
        amountSpent: 13500,
        beneficiaries: "68,000+ Km Roads Built",
        unit: "Cr"
    }
];

// Summary Statistics
const summaryStats = [
    {
        title: "Total Allocated Budget",
        value: "₹ 2.63 Lakh Cr",
        icon: "fa-sack-dollar"
    },
    {
        title: "Total Funds Released",
        value: "₹ 2.06 Lakh Cr",
        icon: "fa-money-bill-transfer"
    },
    {
        title: "Total Funds Spent",
        value: "₹ 1.82 Lakh Cr",
        icon: "fa-chart-pie"
    },
    {
        title: "Citizens Benefited",
        value: "25+ Crore",
        icon: "fa-users"
    }
];

document.addEventListener("DOMContentLoaded", () => {
    renderSummary();
    renderSchemes();
});

function renderSummary() {
    const container = document.getElementById("summaryContainer");
    summaryStats.forEach(stat => {
        const card = document.createElement("div");
        card.className = "summary-card";
        card.innerHTML = `
            <i class="fa ${stat.icon}"></i>
            <h3>${stat.title}</h3>
            <p>${stat.value}</p>
        `;
        container.appendChild(card);
    });
}

function renderSchemes() {
    const container = document.getElementById("schemesContainer");

    schemeData.forEach(scheme => {
        const spentPercentage = Math.round((scheme.amountSpent / scheme.amountReleased) * 100);

        const card = document.createElement("div");
        card.className = "scheme-card";

        card.innerHTML = `
            <h3>${scheme.name}</h3>
            <p class="scheme-desc">${scheme.description}</p>
            
            <div class="stats-grid">
                <div class="stat-item">
                    <span>Approved Budget</span>
                    <strong>${scheme.totalBudget}</strong>
                </div>
                <div class="stat-item">
                    <span>Amount Released</span>
                    <strong>₹ ${scheme.amountReleased.toLocaleString()} ${scheme.unit}</strong>
                </div>
            </div>

            <div class="progress-container">
                <div class="progress-label">
                    <span>Fund Utilization (₹ ${scheme.amountSpent.toLocaleString()} ${scheme.unit} Spent)</span>
                    <span style="color: #6a0dad; font-weight: bold;">${spentPercentage}%</span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-fill" style="width: 0%;" data-target="${spentPercentage}%"></div>
                </div>
            </div>

            <div class="beneficiaries">
                <i class="fa fa-hand-holding-heart"></i> Benefited: ${scheme.beneficiaries}
            </div>
        `;

        container.appendChild(card);
    });

    // Trigger progress bar animations after rendering
    setTimeout(() => {
        const progressFills = document.querySelectorAll(".progress-fill");
        progressFills.forEach(fill => {
            fill.style.width = fill.getAttribute("data-target");
        });
    }, 100);
}

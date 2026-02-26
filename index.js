const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.static(__dirname));
app.use(express.json());

const PORT = process.env.PORT || 3000;
const CLIENT_ID = process.env.SETU_CLIENT_ID;
const CLIENT_SECRET = process.env.SETU_CLIENT_SECRET;
const SETU_BASE_URL = process.env.SETU_BASE_URL;

// Route to serve your HTML Request Page
app.get('/digilocker', (req, res) => {
    res.sendFile(path.join(__dirname, 'digilocker_request.html'));
});

// STEP 1: Initiate DigiLocker Session
app.get('/verify', async (req, res) => {
    try {
        const response = await axios.post(`${SETU_BASE_URL}/api/digilocker`, {
            redirectUrl: `http://localhost:${PORT}/callback`
        }, {
            headers: { 'x-client-id': CLIENT_ID, 'x-client-secret': CLIENT_SECRET }
        });
        // The 'id' in this response is your Request ID
        res.redirect(response.data.url); 
    } catch (error) {
        console.error("Initiate Error:", error.response ? error.response.data : error.message);
        res.status(500).send("Could not connect to DigiLocker. Check .env values.");
    }
});

// STEP 2: Handle the Return & Fetch Data
app.get('/callback', async (req, res) => {
    const requestId = req.query.id; // Request ID from URL query string
    
    try {
        // Fetching verified Aadhaar data
        const response = await axios.get(`${SETU_BASE_URL}/api/digilocker/${requestId}/aadhaar`, {
            headers: { 'x-client-id': CLIENT_ID, 'x-client-secret': CLIENT_SECRET }
        });

        const rawData = response.data;
        
        // DPDP COMPLIANCE: Masking Aadhaar for privacy
        const maskedAadhaar = rawData.aadhaar_number.replace(/\d(?=\d{4})/g, "X");

        res.send(`
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ccc; border-radius: 8px; max-width: 400px; margin: 50px auto;">
                <h2 style="color: green;">✅ Verification Successful</h2>
                <hr>
                <p><strong>Name:</strong> ${rawData.full_name}</p>
                <p><strong>Aadhaar:</strong> ${maskedAadhaar}</p>
                <p><strong>DOB:</strong> ${rawData.dob}</p>
                <p style="font-size: 0.8em; color: #666;">Data verified via API Setu Sandbox.</p>
                <a href="/digilocker" style="display: inline-block; margin-top: 15px; text-decoration: none; color: blue;">← Go Back</a>
            </div>
        `);
    } catch (error) {
        res.status(500).send("Verification failed or session expired.");
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Seva Connect Server: http://localhost:${PORT}/digilocker`);
});
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
            <a href="track.html" style="display: inline-block; margin-top: 1rem; padding: 0.8rem 1.5rem; background-color: #007bff; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: background-color 0.2s;">Track Complaint</a>
        </div>
    `;

    this.reset();
});

// AI Voice Assist Implementation using SpeechRecognition API
document.addEventListener("DOMContentLoaded", () => {
    const voiceBtn = document.getElementById("voiceBtn");
    const complaintText = document.getElementById("complaintText");
    let isRecording = false;

    // Check if the browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = function () {
            isRecording = true;
            voiceBtn.style.backgroundColor = "lightcoral";
            voiceBtn.style.color = "white";
            voiceBtn.innerHTML = `<i class="fa fa-stop-circle"></i> Recording...`;

            // If the textbox isn't empty, add a space before appending new voice text
            if (complaintText.value.length > 0 && !complaintText.value.endsWith(' ')) {
                complaintText.value += ' ';
            }
        };

        recognition.onresult = function (event) {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                complaintText.value += finalTranscript + ' ';
            }
        };

        recognition.onerror = function (event) {
            console.error("Speech recognition error", event.error);
            resetVoiceBtn();
        };

        recognition.onend = function () {
            resetVoiceBtn();
        };

        voiceBtn.addEventListener("click", () => {
            if (isRecording) {
                recognition.stop();
            } else {
                recognition.start();
            }
        });

        function resetVoiceBtn() {
            isRecording = false;
            voiceBtn.style.backgroundColor = "#ffcf99";
            voiceBtn.style.color = "#6a0dad";
            voiceBtn.innerHTML = `<i class="fa fa-microphone"></i> AI Voice Assist`;
        }
    } else {
        voiceBtn.style.display = "none";
        console.warn("Speech Recognition API is not supported in this browser.");
    }
});
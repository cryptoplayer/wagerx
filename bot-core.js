// WAGERX AI AGENT v1.3 - THE SCANNING UPDATE
async function loadWagerXBot() {
    const DATA_PATH = 'https://raw.githubusercontent.com/cryptoplayer/wagerx/main/research.json';
    const display = document.getElementById('bot-display');
    const status = document.getElementById('bot-status');

    try {
        const response = await fetch(DATA_PATH);
        window.wagerxData = await response.json();
        status.classList.add('online');
        display.innerHTML = `<div class="bot-msg">AGENT: INITIALIZED. Connection to WagerX Database secure.</div>`;
    } catch (err) {
        display.innerHTML = `<div class="bot-msg" style="color:#ff7b72">AGENT: ERROR. Database offline. Check connection.</div>`;
    }
}

function typeWriter(text, i, element, callback) {
    if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(() => typeWriter(text, i, element, callback), 25);
    } else if (callback) { callback(); }
}

function runResearch() {
    const input = document.getElementById('bot-input');
    const display = document.getElementById('bot-display');
    const val = input.value.toLowerCase().trim();
    if(!val || !window.wagerxData) return;

    // Show User Command
    display.innerHTML += `<div class="user-msg">> ${input.value}</div>`;
    
    // Create the "Scanning" message
    const scanMsg = document.createElement('div');
    scanMsg.className = 'bot-msg';
    scanMsg.style.color = '#8b949e';
    scanMsg.innerHTML = 'AGENT: Scanning database...';
    display.appendChild(scanMsg);
    display.scrollTop = display.scrollHeight;

    setTimeout(() => {
        // Remove "Scanning" message
        scanMsg.remove();

        let response = "NO_MATCH: Audit not found. Type 'help' for commands.";
        if (val === "cryptoplayer") {
            response = "AUTH_GRANTED: Welcome, Creator. Terminal in Full Developer Mode.";
        } else {
            for (let key in window.wagerxData) {
                if (val.includes(key)) response = window.wagerxData[key];
            }
        }

        const botMsgDiv = document.createElement('div');
        botMsgDiv.className = 'bot-msg';
        botMsgDiv.innerHTML = 'AGENT: ';
        display.appendChild(botMsgDiv);

        typeWriter(response, 0, botMsgDiv, () => {
            display.scrollTop = display.scrollHeight;
        });
    }, 800); // 0.8 second "scan" time for realism

    input.value = '';
}

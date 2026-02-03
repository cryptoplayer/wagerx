// WAGERX CORE SCRIPT v1.2
async function loadWagerXBot() {
    // Note: We use the 'raw' link for the JSON data
    const DATA_PATH = 'https://raw.githubusercontent.com/cryptoplayer/wagerx/main/research.json';
    const display = document.getElementById('bot-display');
    const status = document.getElementById('bot-status');

    try {
        const response = await fetch(DATA_PATH);
        if (!response.ok) throw new Error('Network response was not ok');
        window.wagerxData = await response.json();
        
        status.classList.add('online');
        display.innerHTML = `<div class="bot-msg">SYSTEM: CONNECTION_STABLE. Auditor is online.</div>`;
    } catch (err) {
        console.error("WagerX Error:", err);
        display.innerHTML = `<div class="bot-msg" style="color:#ff7b72">SYSTEM_ERROR: Data node unreachable.</div>`;
    }
}

function typeWriter(text, i, element, callback) {
    if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(() => typeWriter(text, i, element, callback), 25);
    } else if (callback) {
        callback();
    }
}

function runResearch() {
    const input = document.getElementById('bot-input');
    const display = document.getElementById('bot-display');
    const val = input.value.toLowerCase().trim();
    
    if(!val || !window.wagerxData) return;

    // Show User Input
    display.innerHTML += `<div class="user-msg">> ${input.value}</div>`;
    
    // Logic for response
    let response = "";
    if (val === "cryptoplayer") {
        response = "ACCESS GRANTED: Welcome back, Commander. WagerX terminal fully operational.";
    } else {
        response = "NO_MATCH: Data not found. Try 'bitsler' or 'payout'.";
        for (let key in window.wagerxData) {
            if (val.includes(key)) response = window.wagerxData[key];
        }
    }

    // Create response container
    const botMsgDiv = document.createElement('div');
    botMsgDiv.className = 'bot-msg';
    botMsgDiv.innerHTML = 'AUDITOR: ';
    display.appendChild(botMsgDiv);

    // Run Typewriter
    setTimeout(() => {
        typeWriter(response, 0, botMsgDiv, () => {
            display.scrollTop = display.scrollHeight;
        });
    }, 200);

    input.value = '';
}

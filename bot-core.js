async function loadWagerXBot() {
    const GITHUB_DATA = 'https://raw.githubusercontent.com/cryptoplayer/wagerx/main/research.json';
    const display = document.getElementById('bot-display');
    const status = document.getElementById('bot-status');

    try {
        const response = await fetch(GITHUB_DATA);
        const knowledge = await response.json();
        status.classList.add('online');
        display.innerHTML = `<div class="bot-msg">SYSTEM: DATABASE_SYNC_COMPLETE. Auditor is online.</div>`;
        window.wagerxData = knowledge; 
    } catch (err) {
        display.innerHTML = `<div class="bot-msg" style="color:#ff7b72">SYSTEM_ERROR: Data node unreachable.</div>`;
    }
}

function runResearch() {
    const input = document.getElementById('bot-input');
    const display = document.getElementById('bot-display');
    const query = input.value.toLowerCase().trim();
    if (!query || !window.wagerxData) return;

    display.innerHTML += `<div class="user-msg">> ${input.value}</div>`;
    
    setTimeout(() => {
        let response = "NO_MATCH: Data not found. Try 'bitsler' or 'payout'.";
        for (let key in window.wagerxData) {
            if (query.includes(key)) response = window.wagerxData[key];
        }
        display.innerHTML += `<div class="bot-msg">AUDITOR: ${response}</div>`;
        display.scrollTop = display.scrollHeight;
    }, 400);
    input.value = '';
}

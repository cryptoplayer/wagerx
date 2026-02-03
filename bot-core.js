// WAGERX AI AGENT v1.4 - FULL REPLACEMENT
async function loadWagerXBot() {
    const DATA_PATH = 'https://raw.githubusercontent.com/cryptoplayer/wagerx/main/research.json';
    const status = document.getElementById('bot-status');
    const display = document.getElementById('bot-display');
    try {
        const response = await fetch(DATA_PATH);
        window.wagerxData = await response.json();
        status.classList.add('online');
        display.innerHTML = `<div class="bot-msg">AGENT: INITIALIZED. Database connection secure.</div>`;
    } catch (err) {
        display.innerHTML = `<div class="bot-msg" style="color:#ff7b72">AGENT: OFFLINE. Database link failed.</div>`;
    }
}

async function getLivePrice(coin) {
    try {
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd&include_24hr_change=true`);
        const data = await res.json();
        const price = data[coin].usd;
        const change = data[coin].usd_24h_change.toFixed(2);
        const emoji = change >= 0 ? "📈" : "📉";
        return `LIVE_DATA: ${coin.toUpperCase()} is $${price.toLocaleString()} USD (${emoji} ${change}% 24h).`;
    } catch (err) { return "ERROR: Market Node timed out."; }
}

function typeWriter(text, i, element, callback) {
    if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(() => typeWriter(text, i, element, callback), 25);
    } else if (callback) { callback(); }
}

async function runResearch() {
    const input = document.getElementById('bot-input');
    const display = document.getElementById('bot-display');
    const val = input.value.toLowerCase().trim();
    if(!val || !window.wagerxData) return;

    display.innerHTML += `<div class="user-msg">> ${input.value}</div>`;
    const scanMsg = document.createElement('div');
    scanMsg.className = 'bot-msg';
    scanMsg.innerHTML = 'AGENT: Scanning database...';
    display.appendChild(scanMsg);
    display.scrollTop = display.scrollHeight;

    setTimeout(async () => {
        scanMsg.remove();
        let response = "NO_MATCH: Type 'help' for valid commands.";
        
        if (val === "btc" || val === "bitcoin") response = await getLivePrice("bitcoin");
        else if (val === "eth" || val === "ethereum") response = await getLivePrice("ethereum");
        else if (val === "sol" || val === "solana") response = await getLivePrice("solana");
        else if (val === "cryptoplayer") response = "ACCESS_GRANTED: Welcome back, Commander. All systems 100%.";
        else {
            for (let key in window.wagerxData) {
                if (val.includes(key)) response = window.wagerxData[key];
            }
        }

        const botMsgDiv = document.createElement('div');
        botMsgDiv.className = 'bot-msg';
        botMsgDiv.innerHTML = 'AGENT: ';
        display.appendChild(botMsgDiv);
        typeWriter(response, 0, botMsgDiv, () => { display.scrollTop = display.scrollHeight; });
    }, 800);
    input.value = '';
}

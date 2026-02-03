// WAGERX AI CORE v1.8
const DATA_PATH = 'https://raw.githubusercontent.com/cryptoplayer/wagerx/main/research.json';

async function loadWagerXBot() {
    const display = document.getElementById('bot-display');
    try {
        // Fetch with cache-busting to prevent "System Error" on updates
        const response = await fetch(DATA_PATH + '?v=' + Date.now());
        if (!response.ok) throw new Error("File not found");
        window.wagerxData = await response.json();
        
        console.log("WagerX Data Loaded Successfully");
        // Start the UI greeting
        setTimeout(sendWelcome, 1000);
    } catch (err) {
        console.error("Initialization Failed:", err);
        display.innerHTML += `<div class="bot-msg" style="color:red">CRITICAL_ERROR: Connection to GitHub failed. Check if research.json is Public.</div>`;
    }
}

function sendWelcome() {
    const display = document.getElementById('bot-display');
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'bot-msg';
    welcomeDiv.style.color = '#00d4ff';
    display.appendChild(welcomeDiv);
    typeWriter("AGENT: WagerX Terminal Online. I can audit casinos or check market prices. How can I help?", 0, welcomeDiv);
}

async function runResearch() {
    const input = document.getElementById('bot-input');
    const display = document.getElementById('bot-display');
    const val = input.value.toLowerCase().trim();
    if (!val) return;

    // Show User Input
    display.innerHTML += `<div class="user-msg">> ${input.value}</div>`;
    
    let response = "COMMAND_UNKNOWN: Type 'help' for directory.";
    
    // 1. Check for Market Keywords
    if (val.includes("btc") || val.includes("bitcoin")) response = await getLivePrice("bitcoin");
    else if (val.includes("eth") || val.includes("ethereum")) response = await getLivePrice("ethereum");
    
    // 2. Check for JSON Keywords (The "Human" Layer)
    else {
        for (let key in window.wagerxData) {
            if (val.includes(key)) {
                response = window.wagerxData[key];
                break;
            }
        }
    }

    const botDiv = document.createElement('div');
    botDiv.className = 'bot-msg';
    display.appendChild(botDiv);
    typeWriter("AGENT: " + response, 0, botDiv);
    
    input.value = '';
    display.scrollTop = display.scrollHeight;
}

async function getLivePrice(coin) {
    try {
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd&include_24hr_change=true`);
        const data = await res.json();
        return `MARKET_DATA: ${coin.toUpperCase()} is $${data[coin].usd.toLocaleString()} (${data[coin].usd_24h_change.toFixed(2)}% 24h).`;
    } catch (e) { return "ERROR: Price Node Offline."; }
}

function typeWriter(text, i, element) {
    if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(() => typeWriter(text, i, element), 20);
    }
}

// Global scope for the Enter key
window.runResearch = runResearch;

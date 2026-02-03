/**
 * WAGERX AI AGENT - CORE SCRIPT v2.0
 * Features: Multi-keyword detection, Typewriter Effect, Live Price Feeds, Fail-safe Mode.
 */

// 1. DATA SOURCE
const DATA_PATH = 'https://raw.githubusercontent.com/cryptoplayer/wagerx/main/research.json';

// 2. OFFLINE BRAIN (Fail-safe if GitHub is unreachable)
const OFFLINE_DATA = {
    "hello": "AGENT: Connectivity limited, but local nodes are active. How can I help?",
    "help": "COMMANDS: [bitsler] [toshi] [btc] [eth] [stats] [safety]",
    "stats": "SYSTEM: Backup Node Online. GitHub Link: Waiting for handshake...",
    "bitsler": "AUDIT: Bitsler is Tier 1. Payouts: Instant. Verified by local cache."
};

// 3. INITIALIZATION
async function loadWagerXBot() {
    const display = document.getElementById('bot-display');
    try {
        // Fetch with cache-busting
        const response = await fetch(DATA_PATH + '?v=' + Date.now());
        if (!response.ok) throw new Error("Connection Refused");
        
        window.wagerxData = await response.json();
        console.log("WAGERX: Data Node Linked.");
        
    } catch (err) {
        console.warn("WAGERX: Link failed. Activating Offline Brain.", err);
        window.wagerxData = OFFLINE_DATA;
    } finally {
        // Small delay for dramatic effect
        setTimeout(sendWelcome, 800);
    }
}

// 4. WELCOME MESSAGE
function sendWelcome() {
    const display = document.getElementById('bot-display');
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'bot-msg';
    display.appendChild(welcomeDiv);
    
    typeWriter("AGENT: WagerX Terminal Online. Secure link established. Type 'help' for directory.", 0, welcomeDiv);
}

// 5. MAIN LOGIC (Smarter Sentence Recognition)
async function runResearch() {
    const input = document.getElementById('bot-input');
    const display = document.getElementById('bot-display');
    const val = input.value.toLowerCase().trim();
    
    if (!val) return;

    // Show User Input
    display.innerHTML += `<div class="user-msg">> ${input.value}</div>`;
    
    let response = "COMMAND_UNKNOWN: Keyword not found in database. Type 'help'.";
    
    // Check for Market Price Requests first
    if (val.includes("btc") || val.includes("bitcoin")) {
        response = await getLivePrice("bitcoin");
    } else if (val.includes("eth") || val.includes("ethereum")) {
        response = await getLivePrice("ethereum");
    } else if (val.includes("sol") || val.includes("solana")) {
        response = await getLivePrice("solana");
    } 
    // Check JSON keywords (Includes multi-word support)
    else {
        for (let key in window.wagerxData) {
            if (val.includes(key)) {
                response = window.wagerxData[key];
                break;
            }
        }
    }

    // Create Bot Response Element
    const botDiv = document.createElement('div');
    botDiv.className = 'bot-msg';
    display.appendChild(botDiv);
    
    typeWriter(response, 0, botDiv);
    
    // Clear & Scroll
    input.value = '';
    display.scrollTop = display.scrollHeight;
}

// 6. LIVE PRICE ENGINE
async function getLivePrice(coin) {
    try {
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd&include_24hr_change=true`);
        const data = await res.json();
        const price = data[coin].usd.toLocaleString();
        const change = data[coin].usd_24h_change.toFixed(2);
        const trend = change >= 0 ? "📈" : "📉";
        return `MARKET_DATA: ${coin.toUpperCase()} is $${price} USD (${trend} ${change}%).`;
    } catch (e) {
        return "ERROR: Price Node Offline. Check network settings.";
    }
}

// 7. TYPEWRITER EFFECT
function typeWriter(text, i, element) {
    if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(() => {
            typeWriter(text, i, element);
            // Keep scrolling as we type
            const display = document.getElementById('bot-display');
            display.scrollTop = display.scrollHeight;
        }, 25);
    }
}

// Global initialization
window.onload = loadWagerXBot;
window.runResearch = runResearch;

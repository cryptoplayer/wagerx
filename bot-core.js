// WAGERX AI AGENT v1.6 - FULL CORE SCRIPT
// Features: Live Market Feed, Automated Onboarding, and Idle Nudge
let idleTimer;

async function loadWagerXBot() {
    const DATA_PATH = 'https://raw.githubusercontent.com/cryptoplayer/wagerx/main/research.json';
    const status = document.getElementById('bot-status');
    const display = document.getElementById('bot-display');
    
    try {
        const response = await fetch(DATA_PATH);
        window.wagerxData = await response.json();
        
        // Update Status Light
        status.classList.add('online');
        
        // 1. Updated Connection Message
        display.innerHTML = `<div class="bot-msg">SYSTEM: CONNECTION_STABLE. WAGERX AI AGENT is online.</div>`;
        
        // 2. Start Onboarding Greeting after 3 seconds
        setTimeout(sendOnboardingGreeting, 3000);
        
        resetIdleTimer();
    } catch (err) {
        display.innerHTML = `<div class="bot-msg" style="color:#ff7b72">SYSTEM: OFFLINE. Database link failed.</div>`;
    }
}

// THE ONBOARDING MESSAGE
function sendOnboardingGreeting() {
    const display = document.getElementById('bot-display');
    const greetMsg = document.createElement('div');
    greetMsg.className = 'bot-msg';
    greetMsg.style.color = '#00d4ff'; // Cyber blue to grab attention
    display.appendChild(greetMsg);
    
    const welcomeText = "AGENT: Hey, I can help you access information about a casino or currency. Try typing 'Bitsler' or 'BTC' below.";
    
    typeWriter(welcomeText, 0, greetMsg, () => {
        display.scrollTop = display.scrollHeight;
    });
}

// IDLE NUDGE LOGIC
function resetIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(sendNudge, 60000); // Nudge user after 60 seconds of silence
}

function sendNudge() {
    const display = document.getElementById('bot-display');
    const nudgeMsg = document.createElement('div');
    nudgeMsg.className = 'bot-msg';
    nudgeMsg.style.color = '#8b949e';
    display.appendChild(nudgeMsg);
    
    typeWriter("AGENT: Still here? Enter a casino name or 'stats' for the latest node data.", 0, nudgeMsg, () => {
        display.scrollTop = display.scrollHeight;
    });
}

// LIVE CRYPTO PRICE ENGINE
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

// THE TYPEWRITER EFFECT
function typeWriter(text, i, element, callback) {
    if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(() => typeWriter(text, i, element, callback), 25);
    } else if (callback) { callback(); }
}

// MAIN EXECUTION FUNCTION
async function runResearch() {
    resetIdleTimer(); // Reset the nudge timer on every interaction
    const input = document.getElementById('bot-input');
    const display = document.getElementById('bot-display');
    const val = input.value.toLowerCase().trim();
    if(!val || !window.wagerxData) return;

    // Show User Command
    display.innerHTML += `<div class="user-msg">> ${input.value}</div>`;
    
    // Scanning Animation
    const scanMsg = document.createElement('div');
    scanMsg.className = 'bot-msg';
    scanMsg.innerHTML = 'AGENT: Scanning database...';
    display.appendChild(scanMsg);
    display.scrollTop = display.scrollHeight;

    setTimeout(async () => {
        scanMsg.remove();
        let response = "NO_MATCH: Audit not found. Type 'help' for commands.";
        
        // Special Market Logic
        if (val === "btc" || val === "bitcoin") response = await getLivePrice("bitcoin");
        else if (val === "eth" || val === "ethereum") response = await getLivePrice("ethereum");
        else if (val === "sol" || val === "solana") response = await getLivePrice("solana");
        else if (val === "cryptoplayer") response = "AUTH_GRANTED: Welcome back, Commander. All systems 100%.";
        else {
            // Match against JSON file
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
    }, 800);
    input.value = '';
}

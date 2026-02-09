// WagerX Intelligence Core v2.5
let wagerxData = null;

async function getBotResponse(userInput) {
    const input = userInput.toLowerCase().trim();
    
    // 1. Fetch data if not already loaded
    if (!wagerxData) {
        try {
            const response = await fetch(`https://cryptoplayer.github.io/wagerx/research.json?t=${Date.now()}`);
            wagerxData = await response.json();
        } catch (e) {
            return "⚠️ Connection to the Forensic Ledger failed. Please check back in a moment.";
        }
    }

    const { personality, audits } = wagerxData;

    // 2. Identity Queries
    if (input.includes("andreas")) return personality.identity_responses.andreas;
    if (input.includes("who") || input.includes("what is wagerx")) return personality.identity_responses.who;
    if (input.includes("trust") || input.includes("reliable")) return personality.identity_responses.trust;

    // 3. Discovery Queries (The "Best" Logic)
    const discoveryKeywords = ["best", "top", "recommend", "list", "where to play"];
    if (discoveryKeywords.some(kw => input.includes(kw))) {
        return "🔍 **WagerX 2026 Top Picks:**\n\n1. **Bitsler** (9.8/10)\n2. **Toshi Bet** (9.8/10)\n3. **Rainbet** (9.8/10)\n\nThese sites have passed the most recent withdrawal stress tests.";
    }

    // 4. Audit Search (The "Bitsler" Logic)
    const match = audits.find(a => input.includes(a.casino.toLowerCase()));
    if (match) {
        let color = match.trust_score > 9 ? "🟢" : "🟡";
        return `${color} **${match.casino.toUpperCase()} AUDIT**\n\n**Status:** ${match.status}\n**Score:** ${match.trust_score}/10\n**Withdrawal:** ${match.withdrawal_speed}\n**KYC:** ${match.kyc_triggered}\n\n**Forensic Note:** ${match.notes}`;
    }

    // 5. Fallback
    return "🔍 No Forensic Match in the current ledger. Type a casino name (like Bitsler) or ask for 'best crypto casinos'.";
}

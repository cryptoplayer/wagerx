let wagerxData = null;

async function getBotResponse(userInput) {
  const input = userInput.toLowerCase().trim();

  try {
    // 1. FORCED FETCH (Prevents the "Nothing Happens" bug)
    if (!wagerxData) {
      const timestamp = new Date().getTime();
      const response = await fetch(`https://raw.githubusercontent.com/cryptoplayer/wagerx/main/research.json?t=${timestamp}`);
      
      if (!response.ok) throw new Error("JSON not found on GitHub");
      
      const textData = await response.text(); // Get raw text first
      wagerxData = JSON.parse(textData); // Parse carefully
    }

    const { intents, casinos, glossary, personality } = wagerxData;

    // A. PRIORITY GATE: BEST CASINOS
    if (intents && intents.best_casinos) {
      if (intents.best_casinos.keywords.some(kw => input.includes(kw))) {
        return intents.best_casinos.answer;
      }
    }

    // B. CASINO AUDITS
    if (casinos) {
      for (const [name, info] of Object.entries(casinos)) {
        if (input.includes(name)) {
            // Check for the "Naked Emperor" Red Alert
            if (info.status === "Naked Emperor") {
                return `🚨 WAGERX RED ALERT 🚨\n\nSite: ${name.toUpperCase()}\nStatus: BLACKLISTED\nReason: ${info.reason}`;
            }
            return typeof info === 'string' ? info : `🟢 ${name.toUpperCase()}: ${info.status}. Score: ${info.trust_score}. ${info.notes}`;
        }
      }
    }

    // C. IDENTITY/ANDREAS
    if (input.includes("andreas") || input.includes("who are you")) {
       return personality.identity_responses.andreas || personality.identity_responses.who;
    }

    return "🔍 No Forensic Match. Ask for 'best casinos' or a specific brand.";

  } catch (error) {
    console.error("Critical WagerX Error:", error);
    return "⚠️ System error: The Ledger is currently updating. Try again in 30 seconds.";
  }
}

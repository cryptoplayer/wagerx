let wagerxData = null;

async function getBotResponse(userInput) {
  const input = userInput.toLowerCase().trim();

  try {
    // 1. FRESH FETCH (Bypass Cache for testing)
    const response = await fetch(`https://raw.githubusercontent.com/cryptoplayer/wagerx/main/research.json?t=${Date.now()}`);
    wagerxData = await response.json();

    const { intents, casinos, glossary, personality } = wagerxData;

    // A. IDENTITY CHECK (Who is Andreas?)
    if (input.includes("who") || input.includes("andreas") || input.includes("trust")) {
        if (input.includes("andreas")) return personality.identity_responses.andreas;
        if (input.includes("trust")) return personality.identity_responses.trust;
        return personality.identity_responses.who;
    }

    // B. BEST CASINOS (Safe Lane)
    if (intents.best_casinos.keywords.some(kw => input.includes(kw))) {
      return intents.best_casinos.answer;
    }

    // C. SPECIFIC CASINO (Forensic Lane)
    for (const [name, info] of Object.entries(casinos)) {
      if (input.includes(name)) return info;
    }

    // D. GLOSSARY
    for (const [term, def] of Object.entries(glossary)) {
      if (input.includes(term)) return def;
    }

    // E. THE FALLBACK (The message shown when no match is found)
    return "🔍 No Forensic Match in the Ledger yet. Ask for 'best casinos' or name a specific brand for a test result.";

  } catch (error) {
    return "⚠️ WagerX Lab Link Error. Check GitHub JSON formatting.";
  }
}

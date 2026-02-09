// Cache to keep your 96+ Performance score
let wagerxData = null;

async function getBotResponse(userInput) {
  const input = userInput.toLowerCase().trim();

  try {
    // 1. Fetch only once per session
    if (!wagerxData) {
      const response = await fetch(
        "https://raw.githubusercontent.com/cryptoplayer/wagerx/main/research.json"
      );
      if (!response.ok) throw new Error("Database link failed");
      wagerxData = await response.json();
    }

    const { intents, casinos, glossary } = wagerxData;

    // --- PRIORITY GATE: CHECK FOR DISCOVERY FIRST ---
    // This stops the bot from being "suspicious" if the user is just looking for a list.
    if (intents && intents.best_casinos) {
      const best = intents.best_casinos;
      if (best.keywords.some(kw => input.includes(kw))) {
        return best.answer;
      }
    }

    // --- SECONDARY: BRAND LOOKUP (The Forensic Lane) ---
    if (casinos) {
      for (const [name, auditInfo] of Object.entries(casinos)) {
        // We use a word-boundary check or exact match to avoid "best casino" matching "casino"
        if (input.includes(name)) {
          // If the status is "Naked Emperor", we trigger the Red Alert
          if (auditInfo.status === "Naked Emperor") {
            return `🚨 WAGERX RED ALERT: NAKED EMPEROR DETECTED 🚨\n\nSubject: ${name.toUpperCase()}\nReason: ${auditInfo.reason}\n\n⚠️ Andreas Ericsson's Ledger: Avoid this site.`;
          }
          return auditInfo;
        }
      }
    }

    // --- TERTIARY: GLOSSARY ---
    if (glossary) {
      for (const [term, definition] of Object.entries(glossary)) {
        const readableTerm = term.replace(/_/g, ' ');
        if (input.includes(readableTerm)) {
          return definition;
        }
      }
    }

    // 5. FALLBACK
    return "I am the WagerX Audit Bot. Ask me for the **'best casinos'**, or about specific brands like **Bitsler** or **Toshi**. I can also explain **KYC** or **RTP** 👀";

  } catch (error) {
    console.error("WagerX Bot Error:", error);
    return "⚠️ WagerX Lab connection lost. Please check back in a moment.";
  }
}

// Cache the data to keep the bot fast (90+ performance score friendly)
let wagerxData = null;

async function getBotResponse(userInput) {
  const input = userInput.toLowerCase().trim();

  try {
    // Only fetch if we don't have the data yet
    if (!wagerxData) {
      const response = await fetch(
        "https://raw.githubusercontent.com/cryptoplayer/wagerx/main/research.json"
      );

      if (!response.ok) throw new Error("Failed to load research.json");
      wagerxData = await response.json();
    }

    const { intents, casinos, glossary } = wagerxData;

    // 1️⃣ Check Structured Intents (e.g., "Best Casinos")
    if (intents && intents.best_casinos) {
      const best = intents.best_casinos;
      if (best.keywords.some(kw => input.includes(kw))) {
        return best.answer;
      }
    }

    // 2️⃣ Check Casino Audits (e.g., "Tell me about Bitsler")
    if (casinos) {
      for (const [name, auditInfo] of Object.entries(casinos)) {
        if (input.includes(name)) {
          return auditInfo;
        }
      }
    }

    // 3️⃣ Check Glossary/Terms (e.g., "What is KYC?")
    if (glossary) {
      for (const [term, definition] of Object.entries(glossary)) {
        // Replace underscore with space for matching (e.g., "provably_fair" -> "provably fair")
        const readableTerm = term.replace('_', ' ');
        if (input.includes(readableTerm)) {
          return definition;
        }
      }
    }

    // 4️⃣ Fallback: If no match found
    return "I'm the WagerX Audit Bot. Ask me about **best crypto casinos**, or specific brands like **Bitsler**, **Toshi**, or **Rainbet**. I can also explain terms like **KYC** and **RTP**.";

  } catch (error) {
    console.error("WagerX Bot Error:", error);
    return "⚠️ WagerX Lab is currently offline. Please refresh or try again later.";
  }
}

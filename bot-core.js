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

    // 2. CHECK INTENTS (Best Casinos / Where to play)
    if (intents && intents.best_casinos) {
      const best = intents.best_casinos;
      // Check if user input matches any of the keywords in your JSON
      if (best.keywords.some(kw => input.includes(kw))) {
        return best.answer;
      }
    }

    // 3. CHECK CASINO AUDITS (Specific Brand Lookup)
    if (casinos) {
      // We look for keys like "bitsler", "rainbet", etc.
      for (const [name, auditInfo] of Object.entries(casinos)) {
        if (input.includes(name)) {
          return auditInfo;
        }
      }
    }

    // 4. CHECK GLOSSARY (Terms like KYC, RTP)
    if (glossary) {
      for (const [term, definition] of Object.entries(glossary)) {
        // Handle underscores (e.g., matching "provably fair" to "provably_fair")
        const readableTerm = term.replace(/_/g, ' ');
        if (input.includes(readableTerm)) {
          return definition;
        }
      }
    }

    // 5. FALLBACK (Guidance for the user)
    return "I am the WagerX Audit Bot. Ask me for the **'best casinos'**, or about specific brands like **Bitsler** or **Toshi**. I can also explain **KYC** or **RTP** 👀";

  } catch (error) {
    console.error("WagerX Bot Error:", error);
    return "⚠️ WagerX Lab connection lost. Please check back in a moment.";
  }
}

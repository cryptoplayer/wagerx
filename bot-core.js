async function getBotResponse(userInput) {
  try {
    // Load the knowledge base
    const res = await fetch('research.json');
    const data = await res.json();

    const input = userInput.toLowerCase().trim();

    /* ----------------------------------------
       1️⃣ HIGH PRIORITY INTENT: BEST CASINOS
    ---------------------------------------- */
    if (data.intent_best_casinos) {
      const intent = data.intent_best_casinos;

      for (const keyword of intent.keywords) {
        if (input.includes(keyword)) {
          return intent.answer;
        }
      }
    }

    /* ----------------------------------------
       2️⃣ CASINO-SPECIFIC & TERM MATCHING
    ---------------------------------------- */
    for (const key in data) {
      // skip intent blocks
      if (key.startsWith("intent_")) continue;

      const value = data[key];

      if (
        typeof value === "string" &&
        input.includes(key.toLowerCase())
      ) {
        return value;
      }
    }

    /* ----------------------------------------
       3️⃣ FALLBACK RESPONSE
    ---------------------------------------- */
    return "I can help with **best crypto casinos**, live audit reports, KYC, RTP, VPN-friendly sites, or specific casinos like Bitsler or BetFury 👀";

  } catch (error) {
    console.error("WagerX bot error:", error);
    return "Something went wrong loading WagerX data. Please try again shortly ⚠️";
  }
}

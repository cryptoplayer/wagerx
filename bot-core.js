async function getBotResponse(userInput) {
  const input = userInput.toLowerCase().trim();

  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/YOUR_GITHUB_USERNAME/YOUR_REPO/main/research.json"
    );

    if (!res.ok) {
      throw new Error("Failed to load research.json");
    }

    const data = await res.json();

    /* ----------------------------------------
       1️⃣ HIGH PRIORITY: BEST CASINOS
    ---------------------------------------- */
    if (data.intent_best_casinos) {
      for (const keyword of data.intent_best_casinos.keywords) {
        if (input.includes(keyword)) {
          return data.intent_best_casinos.answer;
        }
      }
    }

    /* ----------------------------------------
       2️⃣ STANDARD KEYWORD MATCHING
    ---------------------------------------- */
    for (const key in data) {
      if (key.startsWith("intent_")) continue;

      const value = data[key];
      if (typeof value === "string" && input.includes(key.toLowerCase())) {
        return value;
      }
    }

    return "I can help with best crypto casinos, audits, KYC, RTP, VPN-friendly sites, or specific casinos like Bitsler 👀";

  } catch (err) {
    console.error("WagerX Bot Error:", err);
    return "⚠️ WagerX bot couldn’t load audit data. Please try again in a moment.";
  }
}

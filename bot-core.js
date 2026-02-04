async function getBotResponse(userInput) {
  const input = userInput.toLowerCase().trim();

  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/cryptoplayer/wagerx/main/research.json"
    );

    if (!response.ok) {
      throw new Error("Failed to load research.json");
    }

    const data = await response.json();

    // 1️⃣ Priority intent: Best casinos
    if (data.intent_best_casinos) {
      for (const keyword of data.intent_best_casinos.keywords) {
        if (input.includes(keyword)) {
          return data.intent_best_casinos.answer;
        }
      }
    }

    // 2️⃣ Keyword matching
    for (const key in data) {
      if (key.startsWith("intent_")) continue;

      if (
        typeof data[key] === "string" &&
        input.includes(key.toLowerCase())
      ) {
        return data[key];
      }
    }

    // 3️⃣ Fallback
    return "Ask me about **best crypto casinos**, audits, KYC, RTP, or specific casinos like Bitsler 👀";

  } catch (error) {
    console.error("WagerX Bot Error:", error);
    return "⚠️ WagerX bot failed to load audit data. Please try again shortly.";
  }
}

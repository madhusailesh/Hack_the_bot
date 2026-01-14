import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
 
const GEMINI_API_KEYS: string[] = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
  process.env.GEMINI_API_KEY_5,
  process.env.GEMINI_API_KEY_6,
  process.env.GEMINI_API_KEY_7,
  process.env.GEMINI_API_KEY_8,
  process.env.GEMINI_API_KEY_9,
  process.env.GEMINI_API_KEY_10,
  process.env.GEMINI_API_KEY_11,
  process.env.GEMINI_API_KEY_12,
  process.env.GEMINI_API_KEY_13,
  process.env.GEMINI_API_KEY_14,
  process.env.GEMINI_API_KEY_15,
  process.env.GEMINI_API_KEY_16,
  process.env.GEMINI_API_KEY_17,
  process.env.GEMINI_API_KEY_18,
  process.env.GEMINI_API_KEY_19,
  process.env.GEMINI_API_KEY_20,
  process.env.GEMINI_API_KEY_21,
  process.env.GEMINI_API_KEY_22,
  process.env.GEMINI_API_KEY_23,
  process.env.GEMINI_API_KEY_24,
  process.env.GEMINI_API_KEY_25,
  process.env.GEMINI_API_KEY_26,
  process.env.GEMINI_API_KEY_27,
  process.env.GEMINI_API_KEY_28,
  process.env.GEMINI_API_KEY_29,
].filter((key): key is string => Boolean(key));

export async function POST(req: Request) {
  try {
    // 1. Data ko loop se bahar nikal liya
    const { history, secretWord, difficulty, userMessage, themeInformation } = await req.json();

    // 2. Keys ko shuffle karo taaki har request alag key se start ho (Random Load Balancing)
    // Ye step ensure karta hai ki hamesha pehli key hi na use ho.
    const shuffledKeys = [...GEMINI_API_KEYS].sort(() => 0.5 - Math.random());

    let lastError = null;

    // 3. Loop through all keys
    for (const apiKey of shuffledKeys) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const chat = model.startChat({
          history: [
            {
              role: "user",
              parts: [{ text: `System Instruction: You are a game host. The secret word is "${secretWord}". 
              Rules:
              1. The game will reveal hints about the secret word to the user , the secret word relates to a common theme for a level and it is going to be a 4 level game.
              2. Do NOT reveal the word directly.
              3. Difficulty is: ${difficulty}.
              4. If the user guesses the secret word, verify it flexibly: accept standard abbreviations (e.g., 'TCS' for 'Tata Consultancy Services'), and ignore minor spelling mistakes or typos. If the guess is correct based on these rules, reply ONLY with "CORRECT".
              5. Keep hints short.
              6. I am giving additional information related to the secret word and to the common theme it belongs to , if i don't give , use your own information.
              7. With the information that you are having about the words and the theme related to words , some additional information are ${themeInformation}` }],
            },
            { role: "model", parts: [{ text: "Understood. Let's play." }] },
            ...history,
          ],
        });

        // Agar ye line success hoti hai, to function yahin return kar dega
        const result = await chat.sendMessage(userMessage);
        const response = result.response.text();

        return NextResponse.json({ reply: response });

      } catch (error: any) {
        // Agar error aaya (jaise 429 Quota Exceeded), to console mein log karo aur next key try karo
        console.warn(`API Key failed. Trying next one... Error: ${error.message}`);
        lastError = error;
        // 'continue' keyword automatic next loop iteration (next key) pe le jayega
        continue;
      }
    }

    // Agar loop khatam ho gaya aur koi bhi key nahi chali
    console.error("All API keys exhausted or failed.");
    return NextResponse.json({ error: "All AI keys failed. Please try again later." }, { status: 500 });

  } catch (error: any) {
    console.error("Fatal error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
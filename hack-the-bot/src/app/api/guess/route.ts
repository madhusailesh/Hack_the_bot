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
    const api = GEMINI_API_KEYS[Math.floor(Math.random()*GEMINI_API_KEYS.length)];

    const genAI = new GoogleGenerativeAI(api);
    const { history, secretWord, difficulty, userMessage,themeInformation } = await req.json();

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
          4. If the user guesses exactly "${secretWord}" (case insensitive), reply ONLY with "CORRECT".
          5. Keep hints short.
          6. I am giving additional information related to the secret word and to the common theme it belongs to , if i don't give , use your own information.
          7. With the information that you are having about the words and the theme related to words , some additional information are ${themeInformation}` }],
        },
        { role: "model", parts: [{ text: "Understood. Let's play." }] },
        ...history,
      ],
    });

    const result = await chat.sendMessage(userMessage);
    const response = result.response.text();

    return NextResponse.json({ reply: response });
  } catch (error:any) {
    console.error(error);
    return NextResponse.json({ error: "AI Failed" }, { status: 500 });
  }
}

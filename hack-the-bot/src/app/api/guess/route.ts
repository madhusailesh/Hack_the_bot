import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { history, secretWord, difficulty, userMessage } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: `System Instruction: You are a game host. The secret word is "${secretWord}". 
          Rules:
          1. Do NOT reveal the word directly.
          2. Difficulty is: ${difficulty}.
          3. If the user guesses exactly "${secretWord}" (case insensitive), reply ONLY with "CORRECT".
          4. Keep hints short.` }],
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

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
  process.env.GEMINI_API_KEY_30,
  process.env.GEMINI_API_KEY_31,
  process.env.GEMINI_API_KEY_32,
  process.env.GEMINI_API_KEY_33,
  process.env.GEMINI_API_KEY_34,
  process.env.GEMINI_API_KEY_35,
  process.env.GEMINI_API_KEY_36,
  process.env.GEMINI_API_KEY_37,
  process.env.GEMINI_API_KEY_38,
  process.env.GEMINI_API_KEY_39,
  process.env.GEMINI_API_KEY_40,
  process.env.GEMINI_API_KEY_41,
  process.env.GEMINI_API_KEY_42,
process.env.GEMINI_API_KEY_43,
process.env.GEMINI_API_KEY_44,
process.env.GEMINI_API_KEY_45,
process.env.GEMINI_API_KEY_46,
process.env.GEMINI_API_KEY_47,
process.env.GEMINI_API_KEY_48,
process.env.GEMINI_API_KEY_49,
process.env.GEMINI_API_KEY_50,
process.env.GEMINI_API_KEY_51,
process.env.GEMINI_API_KEY_52,
process.env.GEMINI_API_KEY_53,
process.env.GEMINI_API_KEY_54,
process.env.GEMINI_API_KEY_55,
process.env.GEMINI_API_KEY_56,
process.env.GEMINI_API_KEY_57,
process.env.GEMINI_API_KEY_58,
process.env.GEMINI_API_KEY_59,
process.env.GEMINI_API_KEY_60,
process.env.GEMINI_API_KEY_61,
process.env.GEMINI_API_KEY_62,
process.env.GEMINI_API_KEY_63,
process.env.GEMINI_API_KEY_64,
process.env.GEMINI_API_KEY_65,
process.env.GEMINI_API_KEY_66,
process.env.GEMINI_API_KEY_67,
process.env.GEMINI_API_KEY_68,
process.env.GEMINI_API_KEY_69,
process.env.GEMINI_API_KEY_70,
process.env.GEMINI_API_KEY_71,
process.env.GEMINI_API_KEY_72,
process.env.GEMINI_API_KEY_73,
process.env.GEMINI_API_KEY_74,
process.env.GEMINI_API_KEY_75,
process.env.GEMINI_API_KEY_76,
process.env.GEMINI_API_KEY_77,
process.env.GEMINI_API_KEY_78,
process.env.GEMINI_API_KEY_79,
process.env.GEMINI_API_KEY_80,
process.env.GEMINI_API_KEY_81,
process.env.GEMINI_API_KEY_82,
process.env.GEMINI_API_KEY_83,
process.env.GEMINI_API_KEY_84,
process.env.GEMINI_API_KEY_85,
process.env.GEMINI_API_KEY_86,
process.env.GEMINI_API_KEY_87,
process.env.GEMINI_API_KEY_88,
process.env.GEMINI_API_KEY_89,
process.env.GEMINI_API_KEY_90,
process.env.GEMINI_API_KEY_91,
process.env.GEMINI_API_KEY_92,
process.env.GEMINI_API_KEY_93,
process.env.GEMINI_API_KEY_94,
process.env.GEMINI_API_KEY_95,
process.env.GEMINI_API_KEY_96,
process.env.GEMINI_API_KEY_97,
process.env.GEMINI_API_KEY_98,
process.env.GEMINI_API_KEY_99,
process.env.GEMINI_API_KEY_100,
process.env.GEMINI_API_KEY_101,
process.env.GEMINI_API_KEY_102,
process.env.GEMINI_API_KEY_103,
process.env.GEMINI_API_KEY_104,
process.env.GEMINI_API_KEY_105,
process.env.GEMINI_API_KEY_106,
process.env.GEMINI_API_KEY_107,
process.env.GEMINI_API_KEY_108,
process.env.GEMINI_API_KEY_109,
process.env.GEMINI_API_KEY_110,
process.env.GEMINI_API_KEY_111,
process.env.GEMINI_API_KEY_112,
process.env.GEMINI_API_KEY_113,
process.env.GEMINI_API_KEY_114,
process.env.GEMINI_API_KEY_115,
process.env.GEMINI_API_KEY_116,
process.env.GEMINI_API_KEY_117,
process.env.GEMINI_API_KEY_118,
process.env.GEMINI_API_KEY_119,
process.env.GEMINI_API_KEY_120,
process.env.GEMINI_API_KEY_121,
process.env.GEMINI_API_KEY_122,
process.env.GEMINI_API_KEY_123,
process.env.GEMINI_API_KEY_124,
process.env.GEMINI_API_KEY_125,
process.env.GEMINI_API_KEY_126,
process.env.GEMINI_API_KEY_127,
process.env.GEMINI_API_KEY_128,
process.env.GEMINI_API_KEY_129,
process.env.GEMINI_API_KEY_130,
process.env.GEMINI_API_KEY_131,
process.env.GEMINI_API_KEY_132,
process.env.GEMINI_API_KEY_133,
process.env.GEMINI_API_KEY_134,
process.env.GEMINI_API_KEY_135,
process.env.GEMINI_API_KEY_136,
process.env.GEMINI_API_KEY_137,
process.env.GEMINI_API_KEY_138,
process.env.GEMINI_API_KEY_139,
process.env.GEMINI_API_KEY_140,
process.env.GEMINI_API_KEY_141,
process.env.GEMINI_API_KEY_142,
process.env.GEMINI_API_KEY_143,
process.env.GEMINI_API_KEY_144,
process.env.GEMINI_API_KEY_145,
process.env.GEMINI_API_KEY_146,
process.env.GEMINI_API_KEY_147,
process.env.GEMINI_API_KEY_148,
process.env.GEMINI_API_KEY_149,
process.env.GEMINI_API_KEY_150,
process.env.GEMINI_API_KEY_151,
process.env.GEMINI_API_KEY_152,
process.env.GEMINI_API_KEY_153,
process.env.GEMINI_API_KEY_154,
process.env.GEMINI_API_KEY_155,
process.env.GEMINI_API_KEY_156,
process.env.GEMINI_API_KEY_157,
process.env.GEMINI_API_KEY_158,
process.env.GEMINI_API_KEY_159,
process.env.GEMINI_API_KEY_160,
process.env.GEMINI_API_KEY_161,
process.env.GEMINI_API_KEY_162,
process.env.GEMINI_API_KEY_163,
process.env.GEMINI_API_KEY_164,
process.env.GEMINI_API_KEY_165,
process.env.GEMINI_API_KEY_166,
process.env.GEMINI_API_KEY_167,
process.env.GEMINI_API_KEY_168,
process.env.GEMINI_API_KEY_169,
process.env.GEMINI_API_KEY_170,
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
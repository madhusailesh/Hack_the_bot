"use client";
import { useState, useEffect } from "react";
import { LEVEL_DATA } from "@/data/words";
import { useRouter } from "next/navigation";

export default function GamePage() {
  const router = useRouter();

  // Game State
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(80);
  const [secretWord, setSecretWord] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalTimeTaken, setTotalTimeTaken] = useState(0);

  // Start Level
  useEffect(() => {
    if (level > 4) {
      handleVictory();
      return;
    }

    // 1. Pick Random Word & Validate Level Data
    const lvlData = LEVEL_DATA[level as keyof typeof LEVEL_DATA];
    
    // Safety check: Agar level data missing ho to crash na ho
    if (!lvlData) {
      console.error("Level data not found for level:", level);
      return;
    }

    const word = lvlData.words[Math.floor(Math.random() * lvlData.words.length)];

    setSecretWord(word);
    setTimeLeft(lvlData.time);
    setMessages([
      {
        role: "model",
        parts: [
          {
            text: `LEVEL ${level}: I have picked a word related to Tech. Ask me hints!`,
          },
        ],
      },
    ]);
  }, [level]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      alert("Time Up! Game Over.");
      router.push("/");
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const newMsg = { role: "user", parts: [{ text: input }] };
    // @ts-ignore
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/guess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: messages,
          secretWord,
          difficulty: LEVEL_DATA[level as keyof typeof LEVEL_DATA].difficulty,
          userMessage: input,
        }),
      });

      const data = await res.json();
      setLoading(false);

      // --- FIX: Check for Errors ---
      if (!res.ok || data.error) {
        console.error("AI Error:", data.error);
        alert("Error from AI: " + (data.error || "Unknown Error"));
        return;
      }

      // --- FIX: Safe Check for 'includes' ---
      // Pehle check karo ki 'reply' exist karta hai ya nahi
      if (data.reply && data.reply.includes("CORRECT")) {
        const timeTaken = LEVEL_DATA[level as keyof typeof LEVEL_DATA].time - timeLeft;
        setTotalTimeTaken((prev) => prev + timeTaken);
        
        // Thoda wait karke alert dikhao
        setTimeout(() => {
            alert(`Level ${level} Cleared!`);
            setLevel((prev) => prev + 1);
        }, 100);

      } else if (data.reply) {
        // @ts-ignore
        setMessages((prev) => [
          ...prev,
          { role: "model", parts: [{ text: data.reply }] },
        ]);
      } else {
        console.warn("No reply field in data:", data);
      }

    } catch (error) {
      console.error("Network/Server Error:", error);
      setLoading(false);
      alert("Failed to connect to the server.");
    }
  };

  const handleVictory = async () => {
    // LocalStorage se details nikalo
    const name = localStorage.getItem("playerName");
    const regNo = localStorage.getItem("playerReg");

    try {
      // Save score to DB
      await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          regNo: Number(regNo),
          totalTime: totalTimeTaken,
        }),
      });

      alert(`CONGRATS! You finished in ${totalTimeTaken} seconds.`);
      router.push("/leaderboard"); // Redirect to leaderboard
    } catch (err) {
      console.error("Score save failed:", err);
      alert("You won, but score could not be saved.");
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
          <h2 className="text-xl font-bold text-green-400">Level {level}/4</h2>
          <div className={`text-2xl font-mono ${timeLeft < 10 ? 'text-red-500' : 'text-white'}`}>
            {timeLeft}s
          </div>
        </div>

        {/* Chat Box */}
        <div className="bg-zinc-900 h-96 overflow-y-auto p-4 rounded mb-4 space-y-3 border border-zinc-800">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg max-w-[80%] ${
                m.role === "user"
                  ? "bg-blue-600 ml-auto"
                  : "bg-zinc-700 mr-auto"
              }`}
            >
              {m.parts[0].text}
            </div>
          ))}
          {loading && (
            <div className="text-gray-500 animate-pulse text-sm">AI is thinking...</div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            className="flex-1 p-3 bg-zinc-800 rounded outline-none border border-zinc-700 focus:border-green-500 transition-colors"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your guess..."
            disabled={loading}
          />
          <button
            onClick={handleSendMessage}
            disabled={loading}
            className={`px-6 py-3 rounded font-bold transition-colors ${
                loading ? "bg-gray-600 cursor-not-allowed" : "bg-green-600 hover:bg-green-500"
            }`}
          >
            {loading ? "..." : "SEND"}
          </button>
        </div>
      </div>
    </div>
  );
}
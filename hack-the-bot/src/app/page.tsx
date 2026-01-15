"use client";

import { useState, useEffect, useRef } from "react";
import { LEVEL_DATA } from "@/src/data/words";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Lightbulb,
  Send,
  Clock,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { Timer } from "@/src/components/timer";
import { registerSchema } from "@/src/schemas/registerSchema";
import { AnimatePresence, motion } from "framer-motion";
import { TailSpin } from "react-loader-spinner";
import toast, { Toaster } from "react-hot-toast";
import GameOverModal from "@/src/components/game-over-modal";
import CongratulationsModal from "@/src/components/congratulations-modal";

interface InstructionsPageProps {
  userName: string;
  onStartGame: () => void;
}

interface Player {
  name: string;
  totalTime: number;
  level?: number;
  totalGueses?: number;
  levelsWon?: number; 
}

export type PageState = "login" | "instructions" | "game" | "results";

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPage, setCurrentPage] = useState<PageState>("login");
  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [userId, setUserId] = useState("");
  const router = useRouter();
  const [nameError, setNameError] = useState<boolean | string>("");
  const [nameErr, setNameErr] = useState<string>("");
  const [regNoError, setRegNoError] = useState<boolean | string>("");
  const [regNoErr, setRegNoErr] = useState<string>("");
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState<number | null>(10);
  const [secretWord, setSecretWord] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalTimeTaken, setTotalTimeTaken] = useState(0);
  const [guesses, setGuesses] = useState<number>(0);
  const [showCongrats, setShowCongrats] = useState<boolean>(false);
  const [showGameOver, setShowGameOver] = useState<boolean>(false);
  
  // ✅ New Ref: Ye track karega ki is level ka score process ho gaya hai ya nahi
  // Taaki Win aur Loss dono case mein time double add na ho.
  const isLevelScoreProcessed = useRef(false);

  const [levelsWonCount, setLevelsWonCount] = useState<number>(0);

  const levelHints = {
    1: "I've picked a place you'll find inside our university campus.",
    2: "This comes from the world of anime and its characters.",
    3: "I've picked the name of a well-known company.",
    4: "I've picked an abstract word, not a place or name. This word represents an idea, feeling, or state.",
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const res = await fetch("/api/score/list");
      const data = await res.json();
      setPlayers(Array.isArray(data.scores) ? data.scores : []);
    };
    fetchLeaderboard();
  }, [level, currentPage]);

  // ✅ Updated: Added optional 'overrideTotalTime' argument
  const saveGameData = async (levelToSave: number, overrideTotalTime?: number) => {
    const playerName = localStorage.getItem("playerName");
    const playerReg = localStorage.getItem("playerReg");

    if (!playerName || !playerReg) return;
    
    const finalLevel = Math.max(0, levelToSave);
    
    // Agar override time diya hai (Loss ke case mein immediate update), toh wo use karo
    const timeToSend = overrideTotalTime !== undefined ? overrideTotalTime : totalTimeTaken;

    try {
      setLoading(true);
      await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: playerName,
          regNo: Number(playerReg),
          userId: userId,
          totalTime: timeToSend, 
          totalGueses: guesses,
          level: finalLevel,
          levelsWon: levelsWonCount, 
        }),
      });
      setLoading(false);
    } catch {
      setLoading(false);
      toast.error("DATA CORRUPTION: Score save failed", {
        style: {
          border: "1px solid #ff006e",
          background: "#0f172a",
          color: "#ff006e",
        },
      });
    }
  };

  // ✅ MAIN FIX: Handle Timeout / Game Over Score
  useEffect(() => {
    if (showGameOver) {
      // Agar pehle se process ho chuka hai (e.g. Win ho gaya tha), toh skip karo
      if (isLevelScoreProcessed.current) return;

      // Calculate Full Time for this level (Kyunki user haar gaya)
      const lvlData = LEVEL_DATA[level as keyof typeof LEVEL_DATA];
      const timeToAdd = lvlData ? lvlData.time : 0;
      
      const newTotal = totalTimeTaken + timeToAdd;
      
      // State update karo
      setTotalTimeTaken(newTotal);

      // Database mein save karo (Updated time ke sath)
      saveGameData(level - 1, newTotal);
      
      // Flag set karo taaki dubara add na ho
      isLevelScoreProcessed.current = true;
    }
  }, [showGameOver, level, totalTimeTaken]);

  const handleProceedToNextLevel = () => {
    if (level < 4) {
      setLevel((prev) => prev + 1);
      setShowGameOver(false);
      setShowCongrats(false);
      setInput("");
    } else {
      saveGameData(4).then(() => {
        setCurrentPage("results");
      });
    }
  };

  // Level Reset Logic
  useEffect(() => {
    // ✅ Reset processed flag for new level
    isLevelScoreProcessed.current = false;

    const lvlData = LEVEL_DATA[level as keyof typeof LEVEL_DATA];
    if (!lvlData) return;

    // Previous level data saving (redundant but safe)
    if (level > 1) {
       saveGameData(level - 1);
    }

    const word =
      lvlData.words[Math.floor(Math.random() * lvlData.words.length)];

    setSecretWord(word);
    setTimeLeft(lvlData.time);
    setMessages([
      {
        role: "model",
        parts: [
          {
            text: levelHints[level as keyof typeof levelHints],
          },
        ],
      },
    ]);
  }, [level]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", parts: [{ text: input }] };
    setMessages((prev) => [...prev, userMsg]);
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
          themeInformation:
            LEVEL_DATA[level as keyof typeof LEVEL_DATA].themeInformation,
        }),
      });
      const data = await res.json();
      setLoading(false);
      setGuesses((prev) => prev + 1);

      if (!res.ok || data.error) {
        toast.error(data.error || "SYSTEM MALFUNCTION: AI Error", {
          style: {
            border: "1px solid #ff006e",
            background: "#0f172a",
            color: "#ff006e",
          },
        });
        return;
      }

      if (data.reply && data.reply.includes("CORRECT")) {
        // ✅ WIN Logic: Add only time spent
        const timeTaken =
          LEVEL_DATA[level as keyof typeof LEVEL_DATA].time - (timeLeft ?? 0);

        setTotalTimeTaken((p) => p + timeTaken);
        setLevelsWonCount((prev) => prev + 1);
        
        // ✅ Flag set karo taaki Game Over logic trigger na ho agar timer race condition ho
        isLevelScoreProcessed.current = true;

        setShowCongrats(true);
        setTimeout(() => {
            handleProceedToNextLevel();
        }, 5000);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "model", parts: [{ text: data.reply }] },
        ]);
      }
    } catch {
      setLoading(false);
      toast.error("CONNECTION LOST: Server error", {
        style: {
          border: "1px solid #ff006e",
          background: "#0f172a",
          color: "#ff006e",
        },
      });
    }
  };

  const validateName = () => {
    const res = registerSchema.shape.name.safeParse(name);
    if (!res.success) {
      setNameError(false);
      setNameErr(res.error.issues[0].message);
    } else {
      setNameError(true);
      setNameErr("");
    }
  };

  const validateRegNo = () => {
    const res = registerSchema.shape.regdNo.safeParse(regNo);
    if (!res.success) {
      setRegNoError(false);
      setRegNoErr(res.error.issues[0].message);
    } else {
      setRegNoError(true);
      setRegNoErr("");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (nameErr || regNoErr) {
      return;
    }
    setLoading(true);
    
    const res = await fetch("/services/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, regd_no: Number(regNo) }),
    });

    const data = await res.json();
    setUserId(data.uId);

    if (res.ok || data.status === 200 || data.status === 401) {
      localStorage.setItem("playerName", name);
      localStorage.setItem("playerReg", regNo);
      localStorage.setItem("UserId", data.uId);
      setLoading(false);

      if (data.alreadyPlayed) {
        toast("Welcome back! Showing leaderboard.", {
          icon: '🏆',
          style: {
            borderRadius: '10px',
            background: '#1e293b',
            color: '#00d9ff',
            border: '1px solid #00d9ff'
          },
        });
        setCurrentPage("results");
      } else {
        setCurrentPage("instructions");
      }
    } else {
      setLoading(false);
      toast.error("ACCESS DENIED: " + data.message, {
        style: {
          border: "1px solid #ff006e",
          padding: "16px",
          color: "#ff006e",
          background: "#0f172a",
        },
        iconTheme: {
          primary: "#ff006e",
          secondary: "#fff",
        },
      });
    }
  };

  const handleStartGame = () => {
    setCurrentPage("game");
  };

  return (
    <main className="min-h-screen min-w-screen relative overflow-hidden bg-black">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: "url(/images/image.png)",
        }}
      />
      <div className="fixed inset-0 z-0 bg-black/50" />
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,217,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,217,255,0.05)_1px,transparent_1px)] bg-[length:60px_60px]" />
      </div>
      
      <div className="min-h-screen z-20 flex items-center justify-center px-4 py-12">
        {currentPage === "login" && (
            <>
            <div className="w-full max-w-md">
              <div className="relative z-30 text-center mb-12">
                <h1 className="text-6xl font-black mb-2 tracking-wider animate-pulse" style={{ color: "#00d9ff", textShadow: "0 0 20px rgba(0, 217, 255, 0.6)", fontFamily: "'Noto Sans JP', sans-serif" }}>
                  HACK THE BOT
                </h1>
                <p className="text-xl font-bold tracking-widest uppercase text-gray-400">ボットをハック</p>
                <p className="text-sm text-gray-400 mt-2 uppercase tracking-wide">4-Level Cyberpunk Challenge</p>
              </div>

              <div className="space-y-6 p-8 bg-slate-950/40 border border-cyan-500/30 rounded-lg backdrop-blur-sm">
                <div className="space-y-2">
                  <label className="block text-sm font-bold uppercase tracking-widest text-cyan-400">Operative Name</label>
                  <Input placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} onBlur={validateName} className={`h-12 bg-slate-900/50 border-2 text-gray-100 placeholder-gray-600 focus:outline-none transition-all ${nameError === false ? "border-red-500/50" : nameError === true ? "border-green-500/50" : "border-cyan-500/30 focus:border-cyan-500 focus:shadow-lg focus:shadow-cyan-500/20"}`} />
                  <AnimatePresence>{!nameError && nameErr && (<motion.p initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="text-xs text-red-400 font-bold">{nameErr}</motion.p>)}</AnimatePresence>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold uppercase tracking-widest text-cyan-400">Registration ID</label>
                  <Input placeholder="Enter your registration number" value={regNo} onChange={(e) => setRegNo(e.target.value)} onBlur={validateRegNo} className={`h-12 bg-slate-900/50 border-2 text-gray-100 placeholder-gray-600 focus:outline-none transition-all ${regNoError === false ? "border-red-500/50" : regNoError === true ? "border-green-500/50" : "border-cyan-500/30 focus:border-cyan-500 focus:shadow-lg focus:shadow-cyan-500/20"}`} />
                  <AnimatePresence>{!regNoError && regNoErr && (<motion.p initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="text-xs text-red-400 font-bold">{regNoErr}</motion.p>)}</AnimatePresence>
                </div>
                <Button type="submit" onClick={handleLogin} className="loginButton w-full h-12 font-bold text-lg uppercase tracking-wider cursor-pointer  transition-all duration-300" style={{ background: "linear-gradient(90deg, #00d9ff, #ff006e)", color: "#000", boxShadow: "0 0 10px rgba(0, 217, 255, 0.3)" }} onMouseEnter={(e) => { (e.target as HTMLElement).style.boxShadow = "0 0 30px rgba(0, 217, 255, 0.6)"; }} onMouseLeave={(e) => { (e.target as HTMLElement).style.boxShadow = "0 0 20px rgba(0, 217, 255, 0.3)"; }}>{loading ? (<TailSpin height={19} width={19} strokeWidth={10} color="#00d9ff" />) : (<>INITIATE SYSTEM{" "} <span className="move font-bold">&gt;</span></>)}</Button>
              </div>
              <div className="relative z-30 mt-8 text-center"><p className="text-xs text-gray-500 uppercase tracking-wider">システム準備完了 | Ready to enter the cyber realm</p></div>
            </div>
            </>
        )}

        {currentPage === "instructions" && (
            <>
            <div className="w-full max-w-3xl">
              <div className="z-30 relative text-center mb-12">
                <h1 className="text-6xl font-black mb-2 tracking-wider animate-pulse" style={{ color: "#00d9ff", textShadow: "0 0 20px rgba(0, 217, 255, 0.6)", fontFamily: "'Noto Sans JP', sans-serif" }}>HACK THE BOT</h1>
                <p className="text-xl font-bold tracking-widest uppercase text-gray-400">ボットをハック</p>
                <p className="text-white text-sm">Welcome,{" "} <span className="text-cyan-400 font-bold">{name}</span> — Prepare for the challenge</p>
              </div>
              <div className="space-y-6 p-8 bg-slate-950/40 border-2 border-cyan-500/30 rounded-lg backdrop-blur-sm mb-6">
                <div className="space-y-4">
                  {[{ icon: Target, title: "Objective", desc: "Guess the hidden word at each level using hint words and AI questions", color: "#00d9ff" }, { icon: Zap, title: "4 Progressive Levels", desc: "From Beginner to Expert - each level increases in difficulty", color: "#ff006e" }, { icon: Lightbulb, title: "Use Hints & Questions", desc: "Hint words guide you. Ask the AI chatbot questions to narrow down options", color: "#00d9ff" }, { icon: Trophy, title: "Make Your Guess", desc: "Submit your answer whenever confident. You have unlimited attempts", color: "#ff006e" }].map((item, idx) => { const Icon = item.icon; return (<div key={idx} className="flex gap-4 p-4 rounded-lg bg-slate-900/20 border border-cyan-500/10 hover:border-cyan-500/30 transition-all"><Icon className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: item.color }} /><div><h3 className="font-bold text-gray-100 uppercase tracking-wider text-sm">{item.title}</h3><p className="text-gray-400 text-sm mt-1">{item.desc}</p></div></div>); })}
                </div>
              </div>
              <div className="relative z-30">
                <Button onClick={handleStartGame} className="startButton cursor-pointer z-10 w-full h-12 text-lg font-bold uppercase tracking-widest transition-all duration-300" style={{ background: "linear-gradient(90deg, #00d9ff, #ff006e)", color: "#000", boxShadow: "0 0 30px rgba(0, 217, 255, 0.4)" }} onMouseEnter={(e) => { (e.target as HTMLElement).style.boxShadow = "0 0 40px rgba(0, 217, 255, 0.6)"; }} onMouseLeave={(e) => { (e.target as HTMLElement).style.boxShadow = "0 0 30px rgba(0, 217, 255, 0.4)"; }}>START CHALLENGE <span className="move">🚀</span></Button>
                <p className="text-center text-xs text-gray-500 uppercase tracking-wider mt-4">準備はいいですか? Are you ready?</p>
              </div>
            </div>
            </>
        )}

        {currentPage === "game" && level <= 4 && (
          <>
            <div className="w-full max-w-7xl flex gap-6">
              <GameOverModal
                isOpen={showGameOver}
                level={level}
                secretWord={secretWord}
                userName={name}
                attempts={guesses}
                timeUsed={totalTimeTaken}
                isLastLevel={level === 4}
                onNext={handleProceedToNextLevel} 
              />
              <CongratulationsModal
                isOpen={showCongrats}
                level={level}
                secretWord={secretWord}
                userName={name}
                attempts={guesses}
                timeUsed={totalTimeTaken}
                isLastLevel={level === 4}
                onNext={handleProceedToNextLevel}
              />
              <div className="w-80 relative z-30 space-y-6">
                <div className="flex flex-col space-y-2 p-4 bg-slate-950/50 rounded-lg border border-cyan-500/30">
                  <p className="text-center text-xl font-bold tracking-tight text-gray-300 mt-2">{name}</p>
                  <p className="text-center text-md font-medium tracking-tight text-gray-400">{userId}</p>
                  <p className="text-center text-xl font-semibold tracking-tight text-gray-300 mb-2">{regNo}</p>
                </div>
                <div className="p-4 bg-slate-950/50 border border-pink-500/30 rounded-lg">
                  <div className="text-xs uppercase tracking-widest text-pink-500">Security Level</div>
                  <div className="text-5xl font-black text-pink-500">{level} / 4</div>
                </div>{" "}
                <div className="p-4 rounded-lg border-2" style={{ borderColor: (timeLeft ?? 0) < 10 ? "#ff006e" : "#00d9ff" }}>
                  <div className="flex items-center gap-2 text-xs uppercase"><Clock className="w-4 h-4" /> Time Remaining</div>
                  <div className="text-4xl font-black"><Timer time={timeLeft} setCurrentPage={setCurrentPage} setShowGameOver={setShowGameOver} setTimeLeft={setTimeLeft} /></div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs uppercase text-yellow-400"><Lightbulb className="w-4 h-4" /> Hints</div>
                  <div className="text-xs text-gray-400">Ask the AI for hints in chat</div>
                </div>
              </div>{" "}
              <div className="flex-1 relative z-30 space-y-6">
                <h1 className="text-5xl font-black text-cyan-400">HACK THE BOT</h1>
                <div className="h-96 flex flex-col bg-slate-950/40 border-2 border-cyan-500/30 rounded-lg p-6">
                  <div className="flex-1 overflow-y-auto space-y-4">
                    {messages.map((m, i) => (
                      <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-sm px-4 py-3 rounded-lg text-sm ${m.role === "user" ? "bg-pink-500/20 border border-pink-500/50" : "bg-cyan-500/20 border border-cyan-500/50"}`}>
                          {m.parts[0].text}
                        </div>{" "}
                      </div>
                    ))}
                    {loading && (<div className="text-xs text-gray-500">Thinking…</div>)}
                  </div>
                  <div className="pt-4 border-t border-cyan-500/20 flex gap-2">
                    <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} placeholder="Ask or guess…" disabled={loading} />
                    <Button onClick={handleSendMessage} disabled={loading}><Send className="w-4 h-4" /></Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        
         {(currentPage === "game" && level>4 && loading) && (
          <>
            <div className="fixed inset-0 flex justify-center items-center">
              <TailSpin height={28} width={28} strokeWidth={12} color="#00d9ff" />
            </div>
          </>
        )}

        {currentPage === "results" && (
            <>
             {" "}
            <div className="w-full max-w-4xl">
              <div className="relative z-30 text-center mb-12">
                <div className="flex justify-center mb-4"><Trophy className="w-16 h-16" style={{ color: "#ff006e" }} /></div>
                <h1 className="text-6xl font-black mb-2 tracking-wider" style={{ color: "#00d9ff", textShadow: "0 0 20px rgba(0, 217, 255, 0.6)" }}>LEADERBOARD</h1>
                <p className="text-gray-400 uppercase tracking-widest">Top Hackers Ranked by Wins & Time</p>
              </div>{" "}
              <div className="relative z-30 space-y-4 mb-12">
                {players?.length == 0 ? (
                  <div className="flex justify-center"><TailSpin height={24} width={24} strokeWidth={10} color="#00d9ff" /></div>
                ) : (
                  <>
                    {players.map((player, idx) => (
                      <div key={idx} className="p-6 bg-slate-950/40 border-2 rounded-lg flex items-center justify-between" style={{ borderColor: "rgba(0, 217, 255, 0.3)", backgroundColor: "rgba(0, 217, 255, 0.05)" }}>
                        <div className="flex items-center gap-6">
                          <div className="text-4xl font-black" style={{ color: "#ff006e" }}>#{idx + 1}</div>
                          <div>
                            <p className="text-xl font-bold text-gray-100">{player.name}</p>{" "}
                            <p className="text-xs text-gray-400 uppercase tracking-widest">Operative</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-right">
                          <div className="flex flex-col items-end">
                            <div className="flex items-center gap-2">
                              <Zap className="w-4 h-4" style={{ color: "#fbbf24" }} />
                              <span className="text-xl font-bold" style={{ color: "#fbbf24" }}>
                                {player.levelsWon ?? 0}
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Wins</p>
                          </div>

                          <div className="flex flex-col items-end">
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4" style={{ color: "#ff006e" }} />
                              <span className="text-xl font-bold" style={{ color: "#ff006e" }}>{player.totalGueses ?? 0}</span>
                            </div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Guesses</p>
                          </div>

                          <div className="flex flex-col items-end w-20">
                              <div className="flex items-center gap-2 justify-end">
                              <Clock className="w-4 h-4" style={{ color: "#00d9ff" }} />
                              <span className="text-xl font-bold" style={{ color: "#00d9ff" }}>{formatTime(player.totalTime)}</span>
                            </div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Time</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
              <div className="relative z-30 text-center">
                <Button onClick={() => { window.location.reload(); }} className="px-12 h-12 cursor-pointer font-bold uppercase tracking-widest text-lg" style={{ background: "linear-gradient(90deg, #00d9ff, #ff006e)", color: "#000", boxShadow: "0 0 30px rgba(0, 217, 255, 0.4)" }}>RETURN TO MAIN MENU</Button>
                <p className="text-xs text-gray-500 uppercase tracking-wider mt-6">HACK THE BOT | Rankings</p>
              </div>
            </div>
            </>
        )}
        <Toaster position="top-center" reverseOrder={false} />
      </div>
    </main>
  );
}
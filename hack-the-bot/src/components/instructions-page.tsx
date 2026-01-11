"use client"

import { Button } from "@/src/components/ui/button"
import { CheckCircle2, Lightbulb, Target, Trophy, Zap } from "lucide-react"

interface InstructionsPageProps {
  userName: string
  onStartGame: () => void
}

export default function InstructionsPage({ userName, onStartGame }: InstructionsPageProps) {
  return (
    <div className="min-h-screen px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-12">
          <h1
            className="text-5xl font-black mb-2 tracking-wider"
            style={{
              color: "#00d9ff",
              textShadow: "0 0 20px rgba(0, 217, 255, 0.6)",
              fontFamily: "'Noto Sans JP', sans-serif",
            }}
          >
            HACK THE BOT
          </h1>
          <p className="text-xl font-bold text-gray-300 mb-1">ボットをハック</p>
          <p className="text-gray-400 text-sm">
            Welcome, <span className="text-cyan-400 font-bold">{userName}</span> — Prepare for the challenge
          </p>
        </div>

        <div className="space-y-6 p-8 bg-slate-950/40 border-2 border-cyan-500/30 rounded-lg backdrop-blur-sm mb-6">
          <div className="space-y-4">
            {[
              {
                icon: Target,
                title: "Objective",
                desc: "Guess the hidden word at each level using hint words and AI questions",
                color: "#00d9ff",
              },
              {
                icon: Zap,
                title: "4 Progressive Levels",
                desc: "From Beginner to Expert - each level increases in difficulty",
                color: "#ff006e",
              },
              {
                icon: Lightbulb,
                title: "Use Hints & Questions",
                desc: "Hint words guide you. Ask the AI chatbot questions to narrow down options",
                color: "#00d9ff",
              },
              {
                icon: Trophy,
                title: "Make Your Guess",
                desc: "Submit your answer whenever confident. You have unlimited attempts",
                color: "#ff006e",
              },
            ].map((item, idx) => {
              const Icon = item.icon
              return (
                <div
                  key={idx}
                  className="flex gap-4 p-4 rounded-lg bg-slate-900/20 border border-cyan-500/10 hover:border-cyan-500/30 transition-all"
                >
                  <Icon className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: item.color }} />
                  <div>
                    <h3 className="font-bold text-gray-100 uppercase tracking-wider text-sm">{item.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="p-8 bg-slate-950/40 border-2 border-pink-500/30 rounded-lg backdrop-blur-sm mb-6">
          <h2 className="text-xl font-bold mb-4 uppercase tracking-wider" style={{ color: "#ff006e" }}>
            難易度 — Difficulty Progression & Time Limits
          </h2>
          <div className="space-y-3">
            {[
              { level: "Level 1", difficulty: "Beginner", desc: "Common words, obvious clues", time: "2 mins" },
              {
                level: "Level 2",
                difficulty: "Intermediate",
                desc: "Moderate vocabulary, creative hints",
                time: "3 mins",
              },
              { level: "Level 3", difficulty: "Advanced", desc: "Uncommon words, challenging clues", time: "5 mins" },
              { level: "Level 4", difficulty: "Expert", desc: "Rare words, minimal cryptic hints", time: "7 mins" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-900/20 border border-pink-500/20 hover:border-pink-500/40 transition-all"
              >
                <div>
                  <p className="font-bold text-gray-100 text-sm">{item.level}</p>
                  <p className="text-gray-500 text-xs">{item.desc}</p>
                </div>
                <div className="flex gap-3">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold border"
                    style={{
                      borderColor: "#ff006e",
                      color: "#ff006e",
                      backgroundColor: "rgba(255, 0, 110, 0.1)",
                    }}
                  >
                    {item.difficulty}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold border"
                    style={{
                      borderColor: "#00d9ff",
                      color: "#00d9ff",
                      backgroundColor: "rgba(0, 217, 255, 0.1)",
                    }}
                  >
                    {item.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 bg-slate-950/40 border-2 border-cyan-500/30 rounded-lg backdrop-blur-sm mb-6">
          <h2 className="text-lg font-bold mb-4 uppercase tracking-wider text-cyan-400">Pro Tips</h2>
          <div className="space-y-2">
            {[
              "Analyze all hint words carefully - they're your primary clue",
              "Ask specific yes/no questions to eliminate possibilities",
              "Think about word categories, themes, and relationships",
              "Manage your time - complete levels before the timer runs out",
              "Each attempt is recorded - try to minimize your guesses",
            ].map((tip, idx) => (
              <div key={idx} className="flex gap-3 text-sm text-gray-300">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-cyan-400 mt-0.5" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={onStartGame}
          className="w-full h-12 text-lg font-bold uppercase tracking-widest transition-all duration-300"
          style={{
            background: "linear-gradient(90deg, #00d9ff, #ff006e)",
            color: "#000",
            boxShadow: "0 0 30px rgba(0, 217, 255, 0.4)",
          }}
          onMouseEnter={(e) => {
            ;(e.target as HTMLElement).style.boxShadow = "0 0 40px rgba(0, 217, 255, 0.6)"
          }}
          onMouseLeave={(e) => {
            ;(e.target as HTMLElement).style.boxShadow = "0 0 30px rgba(0, 217, 255, 0.4)"
          }}
        >
          START CHALLENGE 🚀
        </Button>

        <p className="text-center text-xs text-gray-500 uppercase tracking-wider mt-4">
          準備はいいですか? Are you ready?
        </p>
      </div>
    </div>
  )
}

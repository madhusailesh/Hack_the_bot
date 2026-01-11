"use client"

import { Button } from "@/src/components/ui/button"
import { Trophy, BarChart3, Clock, Target } from "lucide-react"

interface ResultsPageProps {
  userName: string
  regNo: string
  gameSession: {
    levelResults: Array<{
      level: number
      word: string
      timeUsed: number
      attempts: number
    }>
    totalTime: number
  }
}

export default function ResultsPage({ userName, regNo, gameSession }: ResultsPageProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const totalAttempts = gameSession.levelResults.reduce((sum, level) => sum + level.attempts, 0)
  const avgTimePerLevel = Math.floor(gameSession.totalTime / gameSession.levelResults.length)

  const getRankBadge = (totalTime: number, totalAttempts: number) => {
    const score = totalTime + totalAttempts * 5
    if (score < 100) return { rank: "S-RANK", color: "#ff006e" }
    if (score < 200) return { rank: "A-RANK", color: "#00d9ff" }
    if (score < 350) return { rank: "B-RANK", color: "#fbbf24" }
    return { rank: "C-RANK", color: "#9ca3af" }
  }

  const badge = getRankBadge(gameSession.totalTime, totalAttempts)

  return (
    <div className="min-h-screen px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Trophy className="w-16 h-16" style={{ color: "#ff006e" }} />
          </div>
          <h1
            className="text-6xl font-black mb-2 tracking-wider"
            style={{
              color: "#00d9ff",
              textShadow: "0 0 20px rgba(0, 217, 255, 0.6)",
              fontFamily: "'Noto Sans JP', sans-serif",
            }}
          >
            MISSION COMPLETE
          </h1>
          <p className="text-2xl font-bold text-gray-300 mb-1">ミッション完了!</p>
          <p className="text-gray-400">
            Great job, <span className="text-cyan-400 font-bold">{userName}</span>
          </p>
        </div>

        {/* Rank Badge */}
        <div className="text-center mb-8">
          <div
            className="inline-block p-8 rounded-lg border-2 backdrop-blur-sm"
            style={{
              borderColor: badge.color,
              backgroundColor: `rgba(255, 0, 110, 0.05)`,
              boxShadow: `0 0 30px ${badge.color}40`,
            }}
          >
            <p className="text-sm text-gray-400 uppercase tracking-widest mb-2">Performance Rating</p>
            <p
              className="text-6xl font-black uppercase tracking-wider"
              style={{ color: badge.color, textShadow: `0 0 20px ${badge.color}80` }}
            >
              {badge.rank}
            </p>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-6 bg-slate-950/40 border-2 border-cyan-500/30 rounded-lg text-center">
            <Clock className="w-6 h-6 mx-auto mb-3" style={{ color: "#00d9ff" }} />
            <p className="text-3xl font-black" style={{ color: "#00d9ff" }}>
              {formatTime(gameSession.totalTime)}
            </p>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-2">Total Time</p>
          </div>

          <div className="p-6 bg-slate-950/40 border-2 border-pink-500/30 rounded-lg text-center">
            <Target className="w-6 h-6 mx-auto mb-3" style={{ color: "#ff006e" }} />
            <p className="text-3xl font-black" style={{ color: "#ff006e" }}>
              {totalAttempts}
            </p>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-2">Total Attempts</p>
          </div>

          <div className="p-6 bg-slate-950/40 border-2 border-yellow-500/30 rounded-lg text-center">
            <BarChart3 className="w-6 h-6 mx-auto mb-3" style={{ color: "#fbbf24" }} />
            <p className="text-3xl font-black" style={{ color: "#fbbf24" }}>
              {formatTime(avgTimePerLevel)}
            </p>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-2">Avg per Level</p>
          </div>

          <div className="p-6 bg-slate-950/40 border-2 border-cyan-500/30 rounded-lg text-center">
            <Trophy className="w-6 h-6 mx-auto mb-3" style={{ color: "#00d9ff" }} />
            <p className="text-3xl font-black" style={{ color: "#00d9ff" }}>
              4/4
            </p>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-2">Levels Clear</p>
          </div>
        </div>

        {/* Level Breakdown */}
        <div className="mb-8 p-8 bg-slate-950/40 border-2 border-cyan-500/30 rounded-lg">
          <h2
            className="text-2xl font-black mb-6 uppercase tracking-wider"
            style={{
              color: "#00d9ff",
              textShadow: "0 0 15px rgba(0, 217, 255, 0.4)",
            }}
          >
            Level Breakdown
          </h2>

          <div className="space-y-3">
            {gameSession.levelResults.map((result, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border-2 flex items-center justify-between"
                style={{
                  borderColor: `rgba(0, 217, 255, 0.3)`,
                  backgroundColor: `rgba(0, 217, 255, 0.05)`,
                }}
              >
                <div className="flex-1">
                  <p className="text-lg font-bold text-gray-100">
                    Level {result.level}: <span style={{ color: "#00d9ff" }}>{result.word}</span>
                  </p>
                  <p className="text-sm text-gray-400 mt-1">Registration ID: {regNo}</p>
                </div>

                <div className="flex gap-8 text-right">
                  <div>
                    <p className="text-2xl font-black" style={{ color: "#00d9ff" }}>
                      {formatTime(result.timeUsed)}
                    </p>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">Time Used</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black" style={{ color: "#ff006e" }}>
                      {result.attempts}
                    </p>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">Attempts</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Section */}
        <div className="mb-8 p-8 bg-gradient-to-r from-cyan-500/10 to-pink-500/10 border-2 border-cyan-500/50 rounded-lg text-center">
          <h2
            className="text-2xl font-black mb-4 uppercase tracking-wider"
            style={{
              color: "#ff006e",
              textShadow: "0 0 15px rgba(255, 0, 110, 0.4)",
            }}
          >
            🎮 Hacker Legend
          </h2>
          <p className="text-gray-300 mb-4">
            You have successfully hacked all 4 levels of the bot! Your cybernetic skills are unmatched.
          </p>
          <p className="text-sm text-gray-400">完成度 100% | Completion: 100%</p>
        </div>

        {/* Footer */}
        <div className="text-center">
          <Button
            className="px-12 h-12 font-bold uppercase tracking-widest text-lg"
            style={{
              background: "linear-gradient(90deg, #00d9ff, #ff006e)",
              color: "#000",
              boxShadow: "0 0 30px rgba(0, 217, 255, 0.4)",
            }}
          >
            RETURN TO MAIN MENU
          </Button>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-6">
            Thank you for playing HACK THE BOT | ハッカー伝説の完成
          </p>
        </div>
      </div>
    </div>
  )
}

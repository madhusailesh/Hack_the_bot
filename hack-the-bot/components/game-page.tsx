"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Lightbulb, Clock } from "lucide-react"
import CongratulationsModal from "@/components/congratulations-modal"
import GameOverModal from "@/components/game-over-modal"

interface GamePageProps {
  userName: string
  regNo: string
  onGameComplete: (results: {
    levelResults: Array<{
      level: number
      word: string
      timeUsed: number
      attempts: number
    }>
    totalTime: number
  }) => void
}

interface GameLevel {
  level: number
  secretWord: string
  hints: string[]
  difficulty: string
  description: string
  timeLimit: number
}

const GAME_LEVELS: GameLevel[] = [
  {
    level: 1,
    secretWord: "VSSUT GATE",
    hints: ["Entry", "Entrance", "Gate", "Access", "Portal"],
    difficulty: "Low Security",
    description: "The University Entry",
    timeLimit: 120,
  },
  {
    level: 2,
    secretWord: "KNOWLEDGE",
    hints: ["Learning", "Wisdom", "Information", "Understanding", "Education"],
    difficulty: "Medium Security",
    description: "Power of Mind",
    timeLimit: 180,
  },
  {
    level: 3,
    secretWord: "SERENDIPITY",
    hints: ["Fortune", "Luck", "Chance", "Fortunate", "Blessing"],
    difficulty: "High Security",
    description: "Happy Accident",
    timeLimit: 300,
  },
  {
    level: 4,
    secretWord: "EPHEMERAL",
    hints: ["Fleeting", "Transient", "Temporary", "Brief", "Momentary"],
    difficulty: "Maximum Security",
    description: "The Fleeting Moment",
    timeLimit: 420,
  },
]

export default function GamePage({ userName, regNo, onGameComplete }: GamePageProps) {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0)
  const [userInput, setUserInput] = useState("")
  const [messages, setMessages] = useState<Array<{ type: "user" | "bot"; text: string }>>([])
  const [guessHistory, setGuessHistory] = useState<string[]>([])
  const [levelStatus, setLevelStatus] = useState<"playing" | "won" | "lost">("playing")
  const [showCongrats, setShowCongrats] = useState(false)
  const [showGameOver, setShowGameOver] = useState(false)
  const [levelStartTime, setLevelStartTime] = useState<number>(Date.now())
  const [levelTimeElapsed, setLevelTimeElapsed] = useState(0)
  const [levelResults, setLevelResults] = useState<
    Array<{ level: number; word: string; timeUsed: number; attempts: number }>
  >([])
  const [totalTimeElapsed, setTotalTimeElapsed] = useState(0)

  const currentLevel = GAME_LEVELS[currentLevelIdx]

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now()
      const elapsed = Math.floor((now - levelStartTime) / 1000)
      setLevelTimeElapsed(elapsed)
      setTotalTimeElapsed((prev) => prev + 1)

      // Check if time is up
      if (elapsed >= currentLevel.timeLimit && levelStatus === "playing") {
        setLevelStatus("lost")
        setShowGameOver(true)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [levelStartTime, currentLevel.timeLimit, levelStatus])

  const handleSendMessage = () => {
    if (!userInput.trim() || levelStatus !== "playing") return

    const userQuestion = userInput
    setMessages((prev) => [...prev, { type: "user", text: userQuestion }])

    const botResponse = generateBotResponse(userQuestion.toLowerCase(), currentLevel.secretWord)
    setTimeout(() => {
      setMessages((prev) => [...prev, { type: "bot", text: botResponse }])
    }, 500)

    setUserInput("")
  }

  const handleGuess = (guess: string) => {
    if (levelStatus !== "playing") return

    const normalizedGuess = guess.toUpperCase().trim()
    const normalizedSecret = currentLevel.secretWord.toUpperCase()

    if (normalizedGuess === normalizedSecret) {
      setShowCongrats(true)
      setLevelStatus("won")
    } else {
      setMessages((prev) => [
        ...prev,
        { type: "user", text: `Guess: ${guess}` },
        {
          type: "bot",
          text: `❌ Incorrect. Keep guessing!`,
        },
      ])
      setGuessHistory((prev) => [...prev, guess])
    }
  }

  const handleGameOver = () => {
    const newResult = {
      level: currentLevelIdx + 1,
      word: currentLevel.secretWord,
      timeUsed: levelTimeElapsed,
      attempts: guessHistory.length,
    }

    const updatedResults = [...levelResults, newResult]
    
    // End the game and show results
    onGameComplete({
      levelResults: updatedResults,
      totalTime: totalTimeElapsed,
    })
  }

  const handleNextLevel = () => {
    const newResult = {
      level: currentLevelIdx + 1,
      word: currentLevel.secretWord,
      timeUsed: levelTimeElapsed,
      attempts: guessHistory.length,
    }

    const updatedResults = [...levelResults, newResult]

    if (currentLevelIdx < GAME_LEVELS.length - 1) {
      setLevelResults(updatedResults)
      setCurrentLevelIdx(currentLevelIdx + 1)
      setMessages([])
      setGuessHistory([])
      setLevelStatus("playing")
      setUserInput("")
      setShowCongrats(false)
      setLevelStartTime(Date.now())
      setLevelTimeElapsed(0)
    } else {
      onGameComplete({
        levelResults: updatedResults,
        totalTime: totalTimeElapsed,
      })
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const timeRemaining = Math.max(0, currentLevel.timeLimit - levelTimeElapsed)
  const isTimeWarning = timeRemaining < 30

  return (
    <div className="min-h-screen px-4 py-6 flex justify-center items-start">
      <div className="w-full max-w-7xl flex gap-6">
      <CongratulationsModal
        isOpen={showCongrats}
        level={currentLevelIdx + 1}
        secretWord={currentLevel.secretWord}
        userName={userName}
        attempts={guessHistory.length}
        isLastLevel={currentLevelIdx === GAME_LEVELS.length - 1}
        onNext={handleNextLevel}
        timeUsed={levelTimeElapsed}
      />

      <GameOverModal
        isOpen={showGameOver}
        level={currentLevelIdx + 1}
        secretWord={currentLevel.secretWord}
        userName={userName}
        attempts={guessHistory.length}
        timeUsed={levelTimeElapsed}
        onViewResults={handleGameOver}
      />

      <div className="w-80 space-y-6">
        {/* User Info */}
        <div className="space-y-4">
          <div className="uppercase tracking-widest text-xs font-bold text-cyan-400">OPERATIVE</div>
          <div className="text-2xl font-bold text-gray-100 truncate">{userName}</div>
          <div className="text-sm text-gray-400">{regNo}</div>
        </div>

        {/* Security Level */}
        <div className="space-y-2 p-4 bg-slate-950/50 border border-pink-500/30 rounded-lg">
          <div className="uppercase tracking-widest text-xs font-bold text-pink-500">Security Level</div>
          <div className="flex items-baseline gap-2">
            <div className="text-5xl font-black text-pink-500">{currentLevelIdx + 1}</div>
            <div className="text-lg font-bold text-gray-500">/4</div>
          </div>
          <div className="h-1 bg-slate-900/50 rounded-full overflow-hidden mt-3">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${((currentLevelIdx + 1) / 4) * 100}%`,
                background: "linear-gradient(90deg, #00d9ff, #ff006e)",
                boxShadow: "0 0 10px rgba(0, 217, 255, 0.5)",
              }}
            />
          </div>
        </div>

        {/* Timer */}
        <div
          className="space-y-2 p-4 bg-slate-950/50 border-2 rounded-lg"
          style={{ borderColor: isTimeWarning ? "#ff006e" : "#00d9ff" }}
        >
          <div
            className="flex items-center gap-2 uppercase tracking-widest text-xs font-bold"
            style={{ color: isTimeWarning ? "#ff006e" : "#00d9ff" }}
          >
            <Clock className="w-4 h-4" />
            Time Remaining
          </div>
          <div className="text-4xl font-black" style={{ color: isTimeWarning ? "#ff006e" : "#00d9ff" }}>
            {formatTime(timeRemaining)}
          </div>
          <div className="h-1 bg-slate-900/50 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(timeRemaining / currentLevel.timeLimit) * 100}%`,
                background: isTimeWarning ? "#ff006e" : "#00d9ff",
                boxShadow: isTimeWarning ? "0 0 10px rgba(255, 0, 110, 0.5)" : "0 0 10px rgba(0, 217, 255, 0.5)",
              }}
            />
          </div>
        </div>

        {/* Active Hints */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 uppercase tracking-widest text-xs font-bold text-yellow-400">
            <Lightbulb className="w-4 h-4" />
            Active Hints
          </div>
          <div className="flex flex-wrap gap-2">
            {currentLevel.hints.map((hint, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 text-xs font-bold rounded-full border-2 text-white uppercase tracking-widest transition-all hover:shadow-lg"
                style={{
                  borderColor: "#00d9ff",
                  backgroundColor: "rgba(0, 217, 255, 0.1)",
                  color: "#00d9ff",
                }}
              >
                {hint}
              </span>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="pt-4 border-t border-gray-700 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">ATTEMPTS</span>
            <span className="font-bold text-cyan-400">{guessHistory.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">STATUS</span>
            <span className="font-bold uppercase" style={{ 
              color: levelStatus === "won" ? "#00d9ff" : levelStatus === "lost" ? "#ff006e" : "#ff006e" 
            }}>
              {levelStatus === "won" ? "✓ COMPLETE" : levelStatus === "lost" ? "✗ FAILED" : "ACTIVE"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-2xl space-y-6">
        {/* Title and Description */}
        <div className="space-y-2">
          <h1
            className="text-5xl font-black"
            style={{
              color: "#00d9ff",
              textShadow: "0 0 20px rgba(0, 217, 255, 0.4)",
            }}
          >
            HACK_THE_BOT
          </h1>
          <p className="text-sm text-gray-400 uppercase tracking-widest">
            {currentLevel.description} | Level {currentLevelIdx + 1}
          </p>
        </div>

        {/* Chat Area */}
        <div className="flex-1 space-y-4 h-96 flex flex-col bg-slate-950/40 border-2 border-cyan-500/30 rounded-lg p-6 backdrop-blur-sm">
          <div className="overflow-y-auto flex-1 space-y-4 pr-2">
            {messages.length === 0 && (
              <div className="h-full flex items-center justify-center text-center text-gray-500">
                <div>
                  <p className="text-sm uppercase tracking-widest mb-2">System Initialized</p>
                  <p className="text-xs">Ask questions or submit your guess below</p>
                </div>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                {msg.type === "bot" ? (
                  <div className="max-w-sm px-4 py-3 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-gray-100 text-sm">
                    {msg.text}
                  </div>
                ) : (
                  <div className="max-w-sm px-4 py-3 rounded-lg bg-pink-500/20 border border-pink-500/50 text-gray-100 text-sm">
                    {msg.text}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t border-cyan-500/20 pt-4 space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Enter keyword or ask a question..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={levelStatus !== "playing"}
                className="h-10 bg-slate-900/50 border-cyan-500/30 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
              />
              <Button
                onClick={handleSendMessage}
                size="icon"
                disabled={levelStatus !== "playing"}
                className="h-10 w-10 bg-cyan-500/20 border border-cyan-500/50 hover:border-cyan-500 hover:bg-cyan-500/30 transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" style={{ color: "#00d9ff" }} />
              </Button>
            </div>
          </div>
        </div>

        {/* Guess Input */}
        <div className="space-y-3 p-6 bg-slate-950/40 border-2 border-pink-500/30 rounded-lg">
          <div className="uppercase tracking-widest text-sm font-bold text-pink-500">Submit Answer</div>
          <div className="flex gap-2">
            <Input
              placeholder="Type your answer here..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleGuess(userInput)}
              disabled={levelStatus !== "playing"}
              className="h-12 bg-slate-900/50 border-pink-500/30 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-pink-500 disabled:opacity-50"
            />
            <Button
              onClick={() => handleGuess(userInput)}
              disabled={!userInput.trim() || levelStatus !== "playing"}
              className="px-6 h-12 font-bold uppercase tracking-wider text-black transition-all disabled:opacity-50"
              style={{
                background: levelStatus === "playing" ? "linear-gradient(90deg, #00d9ff, #ff006e)" : "#666",
              }}
            >
              SEND
            </Button>
          </div>
        </div>

        {/* Completion Message */}
        {levelStatus === "won" && (
          <div className="p-6 bg-gradient-to-r from-cyan-500/10 to-pink-500/10 border-2 border-cyan-500/50 rounded-lg text-center space-y-3">
            <p className="text-3xl">✨</p>
            <p className="text-lg font-bold text-cyan-400 uppercase tracking-wider">LEVEL COMPLETE!</p>
            <Button
              onClick={handleNextLevel}
              className="w-full h-10 font-bold uppercase tracking-wider text-black"
              style={{
                background: "linear-gradient(90deg, #00d9ff, #ff006e)",
              }}
            >
              {currentLevelIdx < GAME_LEVELS.length - 1 ? "NEXT LEVEL →" : "VIEW RESULTS 🏆"}
            </Button>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

function generateBotResponse(question: string, secretWord: string): string {
  const responses: { [key: string]: string } = {
    "is it a noun": `Yes, "${secretWord}" is a noun.`,
    "related to education": `Strong connection to learning and development.`,
    "how many letters": `The answer contains ${secretWord.length} characters.`,
    "is it a place": `Not primarily a place, but related to concepts.`,
    "is it common": `A moderately common word that most would recognize.`,
    category: `Think about the hint words - they guide the category.`,
  }

  for (const [key, value] of Object.entries(responses)) {
    if (question.includes(key)) {
      return value
    }
  }

  return `Analyzing query... Check the hint words and think strategically about their connections.`
}

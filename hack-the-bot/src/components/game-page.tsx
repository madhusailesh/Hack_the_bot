"use client"

import { useState, useEffect } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Send, Lightbulb, Clock } from "lucide-react"
import CongratulationsModal from "@/src/components/congratulations-modal"
import GameOverModal from "@/src/components/game-over-modal"

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
  const [levelTimeElapsed, setLevelTimeElapsed] = useState<number>(0)
  const [totalTimeElapsed, setTotalTimeElapsed] = useState<number>(0)

  const [levelResults, setLevelResults] = useState<
    Array<{ level: number; word: string; timeUsed: number; attempts: number }>
  >([])

  const currentLevel = GAME_LEVELS[currentLevelIdx]

  // ⏱️ TIMER
  useEffect(() => {
    if (levelStatus !== "playing") return

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - levelStartTime) / 1000)
      setLevelTimeElapsed(elapsed)
      setTotalTimeElapsed((t) => t + 1)

      if (elapsed >= currentLevel.timeLimit) {
        setLevelStatus("lost")
        setShowGameOver(true)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [levelStartTime, levelStatus, currentLevel.timeLimit])

  const handleSendMessage = () => {
    if (!userInput.trim() || levelStatus !== "playing") return

    const question = userInput.trim()
    setMessages((m) => [...m, { type: "user", text: question }])

    const response = generateBotResponse(question.toLowerCase(), currentLevel.secretWord)
    setTimeout(() => {
      setMessages((m) => [...m, { type: "bot", text: response }])
    }, 400)

    setUserInput("")
  }

  const handleGuess = (guess: string) => {
    if (levelStatus !== "playing") return

    const normalizedGuess = guess.trim().toUpperCase()
    const secret = currentLevel.secretWord.toUpperCase()

    if (normalizedGuess === secret) {
      setLevelStatus("won")
      setShowCongrats(true)
    } else {
      setGuessHistory((g) => [...g, guess])
      setMessages((m) => [
        ...m,
        { type: "user", text: `Guess: ${guess}` },
        { type: "bot", text: "❌ Incorrect. Try again!" },
      ])
    }
  }

  const saveLevelResult = () => ({
    level: currentLevelIdx + 1,
    word: currentLevel.secretWord,
    timeUsed: levelTimeElapsed,
    attempts: guessHistory.length,
  })

  const handleNextLevel = () => {
    const updated = [...levelResults, saveLevelResult()]

    if (currentLevelIdx < GAME_LEVELS.length - 1) {
      setLevelResults(updated)
      setCurrentLevelIdx((i) => i + 1)
      setMessages([])
      setGuessHistory([])
      setUserInput("")
      setLevelStatus("playing")
      setShowCongrats(false)
      setLevelStartTime(Date.now())
      setLevelTimeElapsed(0)
    } else {
      onGameComplete({ levelResults: updated, totalTime: totalTimeElapsed })
    }
  }

  const handleGameOver = () => {
    const updated = [...levelResults, saveLevelResult()]
    onGameComplete({ levelResults: updated, totalTime: totalTimeElapsed })
  }

  const timeRemaining = Math.max(0, currentLevel.timeLimit - levelTimeElapsed)
  const isTimeWarning = timeRemaining < 30

  return (
    <>
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
    </>
  )
}

// 🤖 BOT LOGIC
function generateBotResponse(question: string, secretWord: string): string {
  const responses: Record<string, string> = {
    noun: `Yes, "${secretWord}" is a noun.`,
    education: "Strongly related to learning and growth.",
    letters: `The answer has ${secretWord.length} characters.`,
    place: "Not exactly a place, more of a concept.",
    category: "Think about the hints carefully.",
  }

  for (const key in responses) {
    if (question.includes(key)) return responses[key]
  }

  return "Analyze the hints and think logically 👀"
}

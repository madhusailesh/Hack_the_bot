"use client"

import { useState } from "react"
import LoginPage from "@/components/login-page"
import InstructionsPage from "@/components/instructions-page"
import GamePage from "@/components/game-page"
import ResultsPage from "@/components/results-page"

type PageState = "login" | "instructions" | "game" | "results"

interface GameSession {
  levelResults: Array<{
    level: number
    word: string
    timeUsed: number
    attempts: number
  }>
  totalTime: number
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageState>("login")
  const [userInfo, setUserInfo] = useState({ name: "", regNo: "" })
  const [gameSession, setGameSession] = useState<GameSession>({
    levelResults: [],
    totalTime: 0,
  })

  const handleLoginSubmit = (name: string, regNo: string) => {
    setUserInfo({ name, regNo })
    setCurrentPage("instructions")
  }

  const handleStartGame = () => {
    setCurrentPage("game")
  }

  const handleGameComplete = (results: GameSession) => {
    setGameSession(results)
    setCurrentPage("results")
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-black">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: "url(/images/image.png)",
        }}
      />

      <div className="fixed inset-0 z-1 bg-black/50" />

      <div className="fixed inset-0 z-1 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,217,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,217,255,0.05)_1px,transparent_1px)] bg-[length:60px_60px]" />
      </div>

      <div className="relative z-10">
        {currentPage === "login" && <LoginPage onSubmit={handleLoginSubmit} />}
        {currentPage === "instructions" && <InstructionsPage userName={userInfo.name} onStartGame={handleStartGame} />}
        {currentPage === "game" && (
          <GamePage userName={userInfo.name} regNo={userInfo.regNo} onGameComplete={handleGameComplete} />
        )}
        {currentPage === "results" && (
          <ResultsPage userName={userInfo.name} regNo={userInfo.regNo} gameSession={gameSession} />
        )}
      </div>
    </main>
  )
}

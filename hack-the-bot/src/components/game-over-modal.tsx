"use client"

interface GameOverModalProps {
  isOpen: boolean
  level: number
  secretWord: string
  userName: string
  attempts: number
  timeUsed: number
  isLastLevel: boolean // ✅ New Prop
  onNext: () => void // ✅ Renamed for clarity (pehle onViewResults tha)
}

export default function GameOverModal({
  isOpen,
  level,
  secretWord,
  userName,
  attempts,
  timeUsed,
  isLastLevel,
  onNext,
}: GameOverModalProps) {
  if (!isOpen) return null

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={(e) => e.preventDefault()} />

      <div
        className="relative w-full max-w-md p-8 rounded-lg border-2 backdrop-blur-sm animate-in zoom-in duration-500"
        style={{
          borderColor: "#ff006e",
          backgroundColor: "rgba(39, 14, 14, 0.95)",
          boxShadow: "0 0 40px rgba(255, 0, 110, 0.4), inset 0 0 20px rgba(255, 0, 110, 0.1)",
        }}
      >
        <div className="flex justify-center gap-6 text-5xl mb-6 animate-pulse">
          <span>💀</span>
          <span>⏰</span>
          <span>💀</span>
        </div>

        <div className="text-center space-y-2 mb-8">
          <h2
            className="text-4xl font-black uppercase tracking-widest animate-pulse"
            style={{
              color: "#ff006e",
              textShadow: "0 0 20px rgba(255, 0, 110, 0.6)",
              fontFamily: "'Noto Sans JP', sans-serif",
            }}
          >
            TIME'S UP!
          </h2>
          <p
            className="text-xl font-bold"
            style={{
              color: "#ff6b6b",
              textShadow: "0 0 15px rgba(255, 107, 107, 0.4)",
            }}
          >
            Level Failed!
          </p>
          <p className="text-sm text-gray-400">
             {/* ✅ Message condition ke hisab se */}
             {isLastLevel ? "Game Over" : "Don't give up! Proceeding to next level..."}
          </p>
        </div>

        <div
          className="space-y-3 mb-8 p-6 rounded-lg"
          style={{ backgroundColor: "rgba(255, 0, 110, 0.1)", borderColor: "#ff006e", borderWidth: "1px" }}
        >
          <p className="text-center text-gray-300 text-sm uppercase tracking-widest">The Answer Was</p>
          <p
            className="text-center text-3xl font-black uppercase tracking-wider"
            style={{
              color: "#00d9ff",
              textShadow: "0 0 15px rgba(0, 217, 255, 0.5)",
            }}
          >
            {secretWord}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="p-4 rounded-lg text-center border-2" style={{ borderColor: "#ff006e", backgroundColor: "rgba(255, 0, 110, 0.1)" }}>
            <p className="text-3xl font-black" style={{ color: "#ff006e" }}>{attempts}</p>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-2">Attempts</p>
          </div>
          <div className="p-4 rounded-lg text-center border-2" style={{ borderColor: "#ff6b6b", backgroundColor: "rgba(255, 107, 107, 0.1)" }}>
            <p className="text-3xl font-black" style={{ color: "#ff6b6b" }}>{formatTime(timeUsed)}</p>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-2">Time Used</p>
          </div>
          <div className="p-4 rounded-lg text-center border-2" style={{ borderColor: "#ff006e", backgroundColor: "rgba(255, 0, 110, 0.1)" }}>
            <p className="text-3xl font-black" style={{ color: "#ff006e" }}>{level}/4</p>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-2">Level</p>
          </div>
        </div>

        <button
          onClick={onNext}
          className="w-full py-3 px-6 rounded-lg font-bold uppercase tracking-widest text-white transition-all duration-300 text-lg border-2"
          style={{
            backgroundColor: "rgba(255, 0, 110, 0.2)",
            borderColor: "#ff006e",
            boxShadow: "0 0 25px rgba(255, 0, 110, 0.4)",
          }}
        >
          {/* ✅ Button text condition ke hisab se */}
          {isLastLevel ? "📊 VIEW RESULTS" : "⏭️ NEXT LEVEL"}
        </button>
      </div>
    </div>
  )
}
"use client"

interface CongratulationsModalProps {
  isOpen: boolean
  level: number
  secretWord: string
  userName: string
  attempts: number
  timeUsed: number
}

export default function CongratulationsModal({
  isOpen,
  level,
  secretWord,
  userName,
  attempts,
  timeUsed,
}: CongratulationsModalProps) {
  if (!isOpen) return null

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

      <div
        className="relative w-full max-w-md p-8 rounded-lg border-2 backdrop-blur-sm animate-in zoom-in duration-500"
        style={{
          borderColor: "#00d9ff",
          backgroundColor: "rgba(10, 14, 39, 0.95)",
          boxShadow: "0 0 40px rgba(0, 217, 255, 0.4), inset 0 0 20px rgba(0, 217, 255, 0.1)",
        }}
      >
        {/* 🎉 */}
        <div className="flex justify-center gap-6 text-5xl mb-6 animate-bounce">
          <span>🎉</span>
          <span>✨</span>
          <span>🎉</span>
        </div>

        <div className="text-center space-y-2 mb-8">
          <h2
            className="text-5xl font-black uppercase tracking-widest animate-pulse"
            style={{ color: "#ff006e" }}
          >
            COMPLETE!
          </h2>
          <p className="text-xl font-bold text-cyan-400">
            Great job, {userName} 🚀
          </p>
        </div>

        <div className="space-y-3 mb-8 p-6 rounded-lg border border-cyan-500/40 bg-cyan-500/10">
          <p className="text-center text-gray-300 text-sm uppercase tracking-widest">
            You Found The Word
          </p>
          <p className="text-center text-4xl font-black text-cyan-400">
            {secretWord}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          <Stat label="Attempts" value={attempts} color="#ff006e" />
          <Stat label="Time Used" value={formatTime(timeUsed)} color="#00d9ff" />
          <Stat label="Level" value={`${level}/4`} color="#ff006e" />
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="p-4 rounded-lg text-center border-2" style={{ borderColor: color }}>
      <p className="text-3xl font-black" style={{ color }}>
        {value}
      </p>
      <p className="text-xs text-gray-400 uppercase tracking-widest mt-2">{label}</p>
    </div>
  )
}

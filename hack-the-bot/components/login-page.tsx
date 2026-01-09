"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface LoginPageProps {
  onSubmit: (name: string, regNo: string) => void
}

export default function LoginPage({ onSubmit }: LoginPageProps) {
  const [name, setName] = useState("")
  const [regNo, setRegNo] = useState("")
  const [errors, setErrors] = useState({ name: "", regNo: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = { name: "", regNo: "" }

    if (!name.trim()) {
      newErrors.name = "Name is required"
    }
    if (!regNo.trim()) {
      newErrors.regNo = "Registration number is required"
    }

    setErrors(newErrors)

    if (!newErrors.name && !newErrors.regNo) {
      onSubmit(name, regNo)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1
            className="text-6xl font-black mb-2 tracking-wider animate-pulse"
            style={{
              color: "#00d9ff",
              textShadow: "0 0 20px rgba(0, 217, 255, 0.6)",
              fontFamily: "'Noto Sans JP', sans-serif",
            }}
          >
            HACK THE BOT
          </h1>
          <p className="text-xl font-bold tracking-widest uppercase text-gray-300">ボットをハック</p>
          <p className="text-sm text-gray-400 mt-2 uppercase tracking-wide">4-Level Cyberpunk Challenge</p>
        </div>

        <div className="space-y-6 p-8 bg-slate-950/40 border border-cyan-500/30 rounded-lg backdrop-blur-sm">
          <div className="space-y-2">
            <label className="block text-sm font-bold uppercase tracking-widest text-cyan-400">Operative Name</label>
            <Input
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`h-12 bg-slate-900/50 border-2 text-gray-100 placeholder-gray-600 focus:outline-none transition-all ${
                errors.name
                  ? "border-red-500/50"
                  : "border-cyan-500/30 focus:border-cyan-500 focus:shadow-lg focus:shadow-cyan-500/20"
              }`}
            />
            {errors.name && <p className="text-xs text-red-400 font-medium">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold uppercase tracking-widest text-cyan-400">Registration ID</label>
            <Input
              placeholder="Enter your registration number"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              className={`h-12 bg-slate-900/50 border-2 text-gray-100 placeholder-gray-600 focus:outline-none transition-all ${
                errors.regNo
                  ? "border-red-500/50"
                  : "border-cyan-500/30 focus:border-cyan-500 focus:shadow-lg focus:shadow-cyan-500/20"
              }`}
            />
            {errors.regNo && <p className="text-xs text-red-400 font-medium">{errors.regNo}</p>}
          </div>

          <Button
            type="submit"
            onClick={handleSubmit}
            className="w-full h-12 font-bold uppercase tracking-widest text-lg transition-all duration-300"
            style={{
              background: "linear-gradient(90deg, #00d9ff, #ff006e)",
              color: "#000",
              boxShadow: "0 0 20px rgba(0, 217, 255, 0.3)",
            }}
            onMouseEnter={(e) => {
              ;(e.target as HTMLElement).style.boxShadow = "0 0 30px rgba(0, 217, 255, 0.6)"
            }}
            onMouseLeave={(e) => {
              ;(e.target as HTMLElement).style.boxShadow = "0 0 20px rgba(0, 217, 255, 0.3)"
            }}
          >
            INITIATE SYSTEM →
          </Button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            システム準備完了 | Ready to enter the cyber realm
          </p>
        </div>
      </div>
    </div>
  )
}

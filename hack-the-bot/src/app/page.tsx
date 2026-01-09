"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Call your existing auth service
    const res = await fetch("/services/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, regd_no: Number(regNo) }),
    });

    const data = await res.json();
    
    if (res.ok || data.status === 200 || data.status === 401) { 
      // 200 = New User, 401 = Existing User (Both allowed to play)
      localStorage.setItem("playerName", name);
      localStorage.setItem("playerReg", regNo);
      router.push("/game");
    } else {
      alert("Login Failed: " + data.message);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-6">
      <div className="max-w-md w-full bg-zinc-900 p-8 rounded-xl border border-zinc-800">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-500">Hack The Bot 🤖</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Name</label>
            <input 
              type="text" 
              required
              className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 text-white focus:border-green-500 outline-none"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Registration Number</label>
            <input 
              type="number" 
              required
              className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 text-white focus:border-green-500 outline-none"
              onChange={(e) => setRegNo(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded transition"
          >
            ENTER GAME
          </button>
        </form>
      </div>
    </main>
  );
}
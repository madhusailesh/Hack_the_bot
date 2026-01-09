"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Player {
  name: string;
  totalTime: number;
}

export default function Leaderboard() {
  const [players, setPlayers] = useState<Player[]>([]);
  const router = useRouter();

  useEffect(() => {
    // API se leaderboard fetch karna
    // Note: Iske liye ek GET API banani padegi, ya hum direct server component use kar sakte hain.
    // Simplicity ke liye abhi hum maan lete hain ki tumne ek GET route banaya hai ya fir client side fetch kar rahe ho.
    
    // Abhi ke liye hum dummy data ya fetch logic daal rahe hain. 
    // Real implementation mein `api/score` mein GET method add karna padega.
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    // Score API mein GET method add karna hoga (Step 8.1 dekho niche)
    const res = await fetch("/api/score/list"); 
    const data = await res.json();
    setPlayers(data.scores);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-green-500 mb-8">🏆 TOP HACKERS 🏆</h1>
      
      <div className="w-full max-w-md bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-zinc-800 text-green-400">
            <tr>
              <th className="p-4">Rank</th>
              <th className="p-4">Name</th>
              <th className="p-4 text-right">Time (s)</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p, i) => (
              <tr key={i} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                <td className="p-4 font-mono text-gray-400">#{i + 1}</td>
                <td className="p-4 font-bold">{p.name}</td>
                <td className="p-4 text-right font-mono text-yellow-400">{p.totalTime}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
    </div>
  );
}
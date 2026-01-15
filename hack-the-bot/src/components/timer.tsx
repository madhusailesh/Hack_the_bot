"use client";

import { useEffect } from "react";
import { PageState } from "@/src/app/page";

export function Timer(props: {
  time: number | null;
  setCurrentPage: React.Dispatch<React.SetStateAction<PageState>>;
  setTimeLeft: React.Dispatch<React.SetStateAction<number | null>>;
  setShowGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
}) {
  const setShowGameOver = props.setShowGameOver;
  const setLevel = props.setLevel;
  // const setCurrentPage = props.setCurrentPage; // Ab iski zarurat nahi hai yahan

  useEffect(() => {
    if (props.time === null) return;

    // Agar time khatam ho gaya (0 ya usse kam)
    if (props.time <= 0) {
      setShowGameOver(true);
      setTimeout(()=>{
        setShowGameOver(false);
        setLevel((p)=>p+1);
      },5000);
      
      // 🛑 REMOVED: Yahan se wo 'setTimeout' aur 'setCurrentPage("results")' 
      // wala code hata diya hai jo zabardasti leaderboard dikha raha tha.
      // Ab control puri tarah se Modal aur Next Level button ke paas hai.
      
      return;
    }

    // Timer countdown logic
    const timer = setInterval(() => {
      props.setTimeLeft((prev) => {
        if (prev === null || prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [props.time, setShowGameOver, props.setTimeLeft]);

  return <span>{props.time}</span>;
}
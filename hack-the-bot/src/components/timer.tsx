"use client";

import { useEffect } from "react";
import { PageState } from "@/src/app/page";

export function Timer(props: {
  time: number | null;
  setCurrentPage: React.Dispatch<React.SetStateAction<PageState>>;
  setTimeLeft: React.Dispatch<React.SetStateAction<number | null>>;
  setShowGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
  level: number;
}) {
  const setShowGameOver = props.setShowGameOver;
  const setLevel = props.setLevel;
  const level = props.level;

  useEffect(() => {
    // Agar time null hai to kuch mat karo (Safe state)
    if (props.time === null) return;

    // ✅ CASE: TIME KHATAM (Game Over)
    if (props.time <= 0) {
      setShowGameOver(true);

      // Level 4 (Last Level) mein auto-skip nahi karna hai
      if (level < 4) {
        const timeoutId = setTimeout(() => {
          setShowGameOver(false);
          
          // ✅ CRITICAL FIX: Time ko pehle NULL karo taaki agle level mein '0' detect na ho
          props.setTimeLeft(null); 
          
          setLevel((p) => p + 1);
        }, 4000);

        return () => clearTimeout(timeoutId);
      }
      return;
    }

    // ✅ CASE: TIMER RUNNING
    // Pause timer when AI is thinking
    const timer = setInterval(() => {
      if (!props.loading) {
        props.setTimeLeft((prev) => {
          if (prev === null || prev <= 0) return 0;
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [props.time, setShowGameOver, props.setTimeLeft, props.loading, level, setLevel]);

  return <span>{props.time}</span>;
}
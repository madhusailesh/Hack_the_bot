"use client";

import {useState,useEffect} from "react";
import {useRouter} from "next/navigation";

export function Timer(props:{time:number}){
    const [timeLeft,setTimeLeft]=useState(props.time);
    const router = useRouter();

    useEffect(()=>{
        if(timeLeft<=0){
            alert("Time Up! Game Over.");
            router.replace("/");
            return;
        }

        const timer = setInterval(()=>setTimeLeft((prev)=>prev-1),1000);
        return ()=>clearInterval(timer);
    },[timeLeft]);

    return(
        <span>{timeLeft}</span>
    );
}

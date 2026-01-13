"use client";

import {useState,useEffect} from "react";
import {useRouter} from "next/navigation";
import {PageState} from "@/src/app/page";

export function Timer(props:{time:number | null,setCurrentPage:React.Dispatch<React.SetStateAction<PageState>>,setTimeLeft:React.Dispatch<React.SetStateAction<number | null>>,setShowGameOver:React.Dispatch<React.SetStateAction<boolean>>}){
    const setCurrentPage = props.setCurrentPage;
    const router = useRouter();

    useEffect(()=>{
        if(props.time==null)return;

        if((props.time)<=0){
            setTimeout(()=>{
                setCurrentPage("results");
            },5000);
            return;
        }

        const timer = setInterval(()=>props.setTimeLeft((prev)=>prev-1),1000);
        return ()=>clearInterval(timer);
    },[props.time]);

    return(
        <span>{props.time}</span>
    );
}

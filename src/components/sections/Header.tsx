"use client";

import React, { useState, useEffect } from "react";
import { Mic, VolumeX, Wifi, BatteryMedium } from "lucide-react";

const Header = () => {
  const [time, setTime] = useState("18:59:33");
  const [date, setDate] = useState("JAN 13, 2026");
  const [isVoiceOn, setIsVoiceOn] = useState(true);
  const [isSoundOn, setIsSoundOn] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-GB", { hour12: false }));
      setDate(
        now
          .toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
          .toUpperCase()
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header
      id="masthead"
      className="flex items-center justify-between w-full h-[103px] px-4 py-3 bg-transparent border-b border-primary shadow-[inset_0_1px_0_0_rgba(255,0,0,0.2)] crt-flicker"
      style={{ fontFamily: 'var(--font-mono)' }}
    >
      {/* Brand Left */}
      <div className="flex items-center gap-3">
        <div className="relative w-7 h-7 flex items-center justify-center border border-primary animate-pulse-red">
          <div className="w-4 h-4 border border-primary rotate-45 animate-spin [animation-duration:3s]"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1 h-1 bg-primary"></div>
          </div>
        </div>
        <span className="text-[17.6px] font-bold tracking-tighter text-primary terminal-text">
          PSYCHO V1.0
        </span>
      </div>

      {/* Masthead Right */}
      <div className="flex flex-col items-end gap-2">
        {/* Top Row: Meta Info */}
        <div className="flex items-center gap-6 text-[11px] font-medium text-primary/80">
          <span className="tabular-nums">{time}</span>
          <span>{date}</span>
          <span className="flex items-center gap-2">
            NETWORK: <span className="text-primary animate-pulse">ONLINE</span>
          </span>
        </div>

        {/* Bottom Row: Controls & Status */}
        <div className="flex items-center gap-4">
          {/* CA Section */}
          <div className="flex items-center border border-primary/40 bg-black/40 h-7 overflow-hidden">
            <span className="px-2 text-[10px] bg-primary text-black font-bold h-full flex items-center">
              CA
            </span>
            <button 
              onClick={() => navigator.clipboard.writeText("6tTAzyGCDfeY8g6P7aL35qp53RZo9HvWKHMapa2pump")}
              className="px-3 text-[10px] text-primary/90 hover:text-primary transition-colors h-full border-none lowercase"
            >
              6tTAzyGCDfeY8g6P7aL35qp53RZo9HvWKHMapa2pump
            </button>
          </div>

          {/* Status Actions */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-2">
              <div className="status-led"></div>
              <span className="text-[10px] font-bold text-primary animate-pulse">LIVE</span>
            </div>

            <button
              onClick={() => setIsVoiceOn(!isVoiceOn)}
              className={`flex items-center gap-2 h-7 px-3 text-[10px] ${
                isVoiceOn ? "bg-primary text-black" : "text-primary border-primary"
              }`}
            >
              <Mic size={12} fill={isVoiceOn ? "currentColor" : "none"} />
              VOICE {isVoiceOn ? "ON" : "OFF"}
            </button>

            <button
              onClick={() => setIsSoundOn(!isSoundOn)}
              className={`flex items-center gap-2 h-7 px-3 text-[10px] ${
                isSoundOn ? "bg-primary text-black" : "text-primary border-primary"
              }`}
            >
              <VolumeX size={12} />
              SOUND {isSoundOn ? "ON" : "OFF"}
            </button>

            {/* System Icons */}
            <div className="flex items-center gap-3 ml-2 text-primary">
              <div className="flex items-end gap-[2px] h-3">
                <div className="w-[3px] h-1 bg-primary"></div>
                <div className="w-[3px] h-2 bg-primary"></div>
                <div className="w-[3px] h-3 bg-primary"></div>
              </div>
              <BatteryMedium size={14} className="rotate-0" />
              <div className="flex flex-col gap-[2px]">
                <div className="w-3 h-[1px] bg-primary"></div>
                <div className="w-3 h-[1px] bg-primary"></div>
                <div className="w-3 h-[1px] bg-primary"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
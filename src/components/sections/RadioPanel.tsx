"use client";

import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";

interface Station {
  id: string;
  name: string;
  meta: string;
}

const stations: Station[] = [
  { id: "1", name: "Nightride FM", meta: "retro" },
  { id: "2", name: "Nightride ChillSynth", meta: "synth" },
  { id: "3", name: "SomaFM Groove Salad", meta: "chill" },
];

export default function RadioPanel() {
  const [activeStation, setActiveStation] = useState<string>("1");
  const [volume, setVolume] = useState<number[]>([45]);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="flex flex-col border-t border-primary mt-0">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-3 py-1 bg-black/40 border-b border-primary/30">
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
          Lo-Fi Radio
        </span>
        <span className="text-[9px] text-muted-foreground uppercase opacity-70">
          Auto DJ
        </span>
      </div>

      {/* Main Radio Content */}
      <div className="p-3 bg-card flex flex-col gap-3">
        {/* Current Track Info */}
        <div className="flex justify-between items-start">
          <div>
            <div className="text-[12px] font-bold text-primary uppercase leading-tight">
              Nightride FM
            </div>
            <div className="text-[9px] text-muted-foreground uppercase mt-0.5">
              curated
            </div>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <span className="px-1.5 py-0.5 border border-primary/40 text-[8px] text-primary uppercase">
              retro
            </span>
            <span className="px-1.5 py-0.5 border border-primary/40 text-[8px] text-primary uppercase">
              ambient
            </span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <button 
                className="px-3 py-1 text-[9px] border border-primary hover:bg-primary hover:text-primary-foreground transition-colors uppercase font-bold"
                onClick={() => {}}
              >
                Pause
              </button>
              <button 
                className="px-3 py-1 text-[9px] border border-primary hover:bg-primary hover:text-primary-foreground transition-colors uppercase font-bold"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? "Unmute" : "Mute"}
              </button>
            </div>

            <div className="flex-1 flex items-center gap-2">
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:rounded-none"
              />
              <span className="text-[9px] text-muted-foreground whitespace-nowrap tabular-nums">
                {isMuted ? "Muted" : "Active"} | {volume[0]}%
              </span>
            </div>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[9px] text-muted-foreground uppercase">
              Mode: <span className="text-primary">Auto</span>
            </span>
            <button className="px-3 py-0.5 text-[8px] border border-primary bg-primary text-primary-foreground hover:opacity-80 transition-opacity font-bold uppercase">
              PSYCHO PICKS
            </button>
          </div>
        </div>

        {/* Station Selection Grid */}
        <div className="grid grid-cols-2 gap-1.5 mt-1">
          {stations.map((station) => (
            <button
              key={station.id}
              onClick={() => setActiveStation(station.id)}
              className={`flex flex-col items-start p-1.5 border text-left transition-all group ${
                activeStation === station.id
                  ? "border-primary bg-primary/10 shadow-[0_0_5px_rgba(255,0,0,0.3)]"
                  : "border-primary/20 hover:border-primary/60"
              }`}
            >
              <span className={`text-[9px] font-bold uppercase leading-tight ${
                activeStation === station.id ? "text-primary" : "text-muted-foreground"
              }`}>
                {station.name}
              </span>
              <span className="text-[8px] text-muted-foreground/60 uppercase mt-0.5">
                {station.meta}
              </span>
            </button>
          ))}
          {/* Visual Placeholder for scroll/next */}
          <div className="border border-primary/10 flex items-center justify-center pointer-events-none opacity-20">
             <div className="w-1.5 h-1.5 bg-primary/40 rotate-45" />
          </div>
        </div>
      </div>

      {/* Visual Volume Bars Decorative Accent */}
      <div className="px-3 pb-2 flex items-end gap-[1px] h-3">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className={`flex-1 ${
              i < 15 
                ? "bg-primary" 
                : i < 28 
                  ? "bg-primary/40" 
                  : "bg-primary/10"
            }`}
            style={{ 
              height: `${Math.random() * 100}%`,
              opacity: i < 15 ? 0.8 + Math.random() * 0.2 : 0.3
            }}
          />
        ))}
      </div>
    </div>
  );
}
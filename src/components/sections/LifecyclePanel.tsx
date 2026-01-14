"use client";

import React, { useState, useEffect } from 'react';
import { Skull, Flame, AlertTriangle, Trophy, Crown } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface LeaderboardEntry {
  user_name: string;
  roast_count: number;
}

const MOODS = [
  { name: 'HOMICIDAL', color: '#ff0000', intensity: 100 },
  { name: 'FURIOUS', color: '#ff3300', intensity: 85 },
  { name: 'DISGUSTED', color: '#ff6600', intensity: 70 },
  { name: 'IRRITATED', color: '#ff9900', intensity: 55 },
  { name: 'BORED', color: '#666666', intensity: 40 },
  { name: 'AMUSED', color: '#ff4444', intensity: 60 },
];

const LifecyclePanel: React.FC = () => {
  const [mood, setMood] = useState(MOODS[0]);
  const [threatLevel, setThreatLevel] = useState(9);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [totalRoasts, setTotalRoasts] = useState(0);

  useEffect(() => {
    fetchLeaderboard();

    const moodInterval = setInterval(() => {
      const randomMood = MOODS[Math.floor(Math.random() * MOODS.length)];
      setMood(randomMood);
      setThreatLevel(Math.floor(Math.random() * 4) + 7);
    }, 8000);

    const channel = supabase
      .channel('leaderboard-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      clearInterval(moodInterval);
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchLeaderboard = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('user_name')
      .eq('is_ai', false)
      .not('user_name', 'is', null);

    if (data && !error) {
      const counts: Record<string, number> = {};
      data.forEach((msg) => {
        if (msg.user_name && msg.user_name !== 'PSYCHO') {
          counts[msg.user_name] = (counts[msg.user_name] || 0) + 1;
        }
      });

      const sorted = Object.entries(counts)
        .map(([user_name, roast_count]) => ({ user_name, roast_count }))
        .sort((a, b) => b.roast_count - a.roast_count)
        .slice(0, 5);

      setLeaderboard(sorted);
      setTotalRoasts(data.length);
    }
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-3 h-3 text-yellow-500" />;
    if (index === 1) return <Trophy className="w-3 h-3 text-gray-400" />;
    if (index === 2) return <Trophy className="w-3 h-3 text-amber-700" />;
    return <Skull className="w-3 h-3 text-primary/50" />;
  };

  return (
    <div className="flex flex-col h-full bg-background border-r border-border overflow-hidden">
      <div className="flex flex-col flex-none">
        <div className="panel-header bg-black/60 border-b border-border">
          <span className="tab-title text-primary terminal-text">Psycho&apos;s Status</span>
          <span className="tab-meta text-secondary-foreground">Live</span>
        </div>
        
        <div className="p-4 border-b border-border bg-black/20">
          <div className="flex items-center gap-2 mb-3">
            <Skull className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest text-secondary-foreground">Current Mood</span>
          </div>
          
          <div 
            className="text-2xl font-black tracking-wider mb-2 animate-pulse"
            style={{ color: mood.color, textShadow: `0 0 20px ${mood.color}` }}
          >
            {mood.name}
          </div>
          
          <div className="flex gap-1 mb-4">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 transition-all duration-300 ${
                  i < mood.intensity / 10 ? 'bg-primary shadow-[0_0_5px_#ff0000]' : 'bg-primary/10'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-primary" />
            <span className="text-[10px] uppercase tracking-widest text-secondary-foreground">Threat Level</span>
          </div>
          
          <div className="relative h-8 bg-black/40 border border-primary/30 overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/80 to-primary transition-all duration-500"
              style={{ width: `${threatLevel * 10}%` }}
            >
              <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_10px,rgba(0,0,0,0.3)_10px,rgba(0,0,0,0.3)_20px)]" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-black text-white mix-blend-difference tracking-widest">
                {threatLevel}/10 - {threatLevel >= 9 ? 'EXTREME' : threatLevel >= 7 ? 'HIGH' : 'ELEVATED'}
              </span>
            </div>
          </div>
          
          <div className="mt-3 flex items-center justify-between text-[9px] text-secondary-foreground">
            <span className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-primary animate-pulse" />
              VOLATILITY: CRITICAL
            </span>
            <span className="text-primary">
              {totalRoasts} ROASTS DELIVERED
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 min-h-0">
        <div className="panel-header bg-black/60 border-b border-border">
          <span className="tab-title text-primary terminal-text">Roast Leaderboard</span>
          <span className="tab-meta text-secondary-foreground">Top Victims</span>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {leaderboard.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-4 opacity-50">
              <Trophy className="w-8 h-8 text-primary mb-2" />
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest text-center">No victims roasted yet...</p>
            </div>
          ) : (
            leaderboard.map((entry, idx) => (
              <div 
                key={entry.user_name} 
                className={`flex items-center border-b border-border/30 hover:bg-primary/5 transition-colors group ${
                  idx === 0 ? 'bg-primary/10' : ''
                }`}
              >
                <div className="w-12 h-12 border-r border-border/30 flex-none flex items-center justify-center">
                  <div className={`text-lg font-black ${idx === 0 ? 'text-primary' : 'text-primary/60'}`}>
                    #{idx + 1}
                  </div>
                </div>

                <div className="flex-1 p-2 min-w-0">
                  <div className="flex items-center gap-2">
                    {getRankIcon(idx)}
                    <span className={`text-[11px] font-bold uppercase truncate ${
                      idx === 0 ? 'text-primary' : 'text-foreground'
                    }`}>
                      {entry.user_name}
                    </span>
                  </div>
                  <div className="text-[9px] text-secondary-foreground/80 mt-0.5">
                    {idx === 0 ? 'MOST PATHETIC VICTIM' : idx === 1 ? 'RUNNER UP LOSER' : 'FREQUENT TARGET'}
                  </div>
                </div>

                <div className="px-3 flex flex-col items-end">
                  <span className="text-primary font-black text-sm">{entry.roast_count}</span>
                  <span className="text-[8px] text-secondary-foreground uppercase">roasts</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex flex-col flex-none">
        <div className="panel-header bg-black/60 border-y border-border">
          <span className="tab-title text-primary terminal-text">Doom Radio</span>
          <span className="tab-meta text-secondary-foreground">Auto DJ</span>
        </div>
        <div className="p-3 bg-black/10">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="text-primary font-bold uppercase text-[11px]">Nightmare FM</div>
              <div className="text-[9px] text-secondary-foreground tracking-tighter">ETERNAL SUFFERING</div>
            </div>
            <div className="flex gap-1">
               <span className="text-[8px] border border-primary/30 px-1 text-primary/70">DARK</span>
               <span className="text-[8px] border border-primary/30 px-1 text-primary/70">AMBIENT</span>
            </div>
          </div>
          
          <div className="flex gap-1 mb-2">
            <button className="flex-1 py-1 bg-primary text-primary-foreground leading-none">PAUSE</button>
            <button className="flex-1 py-1 border border-primary text-primary leading-none">UNMUTE</button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-border group relative">
              <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-1.5 h-1.5 bg-primary shadow-[0_0_5px_#ff0000]"></div>
            </div>
            <span className="text-[9px] text-secondary-foreground whitespace-nowrap">MUTED | 66%</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.3);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ff0000;
        }
      `}</style>
    </div>
  );
};

export default LifecyclePanel;

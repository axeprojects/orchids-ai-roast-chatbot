"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Volume2, Skull } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { emitPsychoReaction, Mood } from '@/lib/psychoEvents';

interface Message {
  id: string;
  content: string;
  user_name: string;
  created_at: string;
  is_ai?: boolean;
  audio_url?: string;
}

const CommunityChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel('messages-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(50);

    if (data && !error) {
      setMessages(data);
    }
  };

  const playAudio = (audioUrl: string, messageId: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    audioRef.current = new Audio(audioUrl);
    audioRef.current.play();
    setPlayingId(messageId);
    
    audioRef.current.onended = () => {
      setPlayingId(null);
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    const { error: insertError } = await supabase
      .from('messages')
      .insert([{ content: userMessage, user_name: `VERMIN_${Math.floor(Math.random() * 9999)}` }]);

    if (insertError) {
      console.error('Insert error:', insertError);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

if (data.text) {
          const { error: aiInsertError, data: aiMessageData } = await supabase
            .from('messages')
            .insert([{ content: data.text, user_name: 'PSYCHO', is_ai: true, audio_url: data.audio }])
            .select()
            .single();

          emitPsychoReaction({
            mood: (data.mood as Mood) || 'angry',
            intensity: data.roastIntensity || 5,
            text: data.text,
            audio: data.audio,
          });

          if (!aiInsertError && data.audio) {
            playAudio(data.audio, aiMessageData?.id || 'ai-response');
          }
        }
    } catch (err) {
      console.error('API Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="col-span-1 border-l border-border bg-card flex flex-col h-full overflow-hidden">
      <div className="panel-header border-b border-border bg-black/40 flex items-center justify-between px-3 py-1.5 min-h-[32px]">
        <div className="flex items-center gap-2">
          <Skull className="w-3.5 h-3.5 text-primary animate-pulse" />
          <span className="tab-title text-[10px] font-bold tracking-widest uppercase">Global Roast Chamber</span>
        </div>
        <span className="tab-meta text-[9px] text-muted-foreground uppercase opacity-70">{messages.length} victims</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/10 p-3 space-y-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-50">
            <MessageSquare className="w-8 h-8 text-primary mb-2" />
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">No victims yet...</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 border transition-all ${
                msg.is_ai
                  ? 'border-primary/60 bg-primary/10 shadow-[0_0_15px_rgba(255,0,0,0.2)]'
                  : 'border-border/30 bg-black/20 hover:bg-black/30'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  {msg.is_ai && <Skull className="w-3 h-3 text-primary" />}
                  <span className={`text-[9px] font-bold tracking-widest uppercase ${msg.is_ai ? 'text-primary' : 'text-muted-foreground'}`}>
                    {msg.user_name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {msg.audio_url && (
                    <button
                      onClick={() => playAudio(msg.audio_url!, msg.id)}
                      className={`p-1 hover:text-primary transition-colors ${playingId === msg.id ? 'text-primary animate-pulse' : 'text-muted-foreground'}`}
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  )}
                  <span className="text-[8px] text-muted-foreground/60">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
              <p className={`text-[11px] leading-relaxed font-mono ${msg.is_ai ? 'text-primary' : 'text-foreground'}`}>
                {msg.content}
              </p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t border-border bg-black/60">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isLoading ? "PSYCHO IS PROCESSING YOUR FATE..." : "TYPE YOUR MESSAGE, MORTAL..."}
            disabled={isLoading}
            className="flex-1 bg-black/60 border border-border/60 px-3 py-2 text-[11px] font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="px-4 py-2 bg-primary/20 border border-primary/60 text-primary hover:bg-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-4 h-4 border border-primary border-t-transparent animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CommunityChat;

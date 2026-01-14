"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Mic, Send, Terminal } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { onPsychoReaction, emitPsychoReaction, type Mood, type PsychoReactionEvent } from '@/lib/psychoEvents';

interface Particle {
  id: number;
  emoji: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  scale: number;
  rotation: number;
}

const MainInterface = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voice, setVoice] = useState("onyx");
  const [terminalText, setTerminalText] = useState(
    "INITIALIZING SYSTEM... PROTOCOL: ROAST_MODE_ACTIVE. ANALYZING TARGET DEFICIENCIES... READY TO PROVIDE COUNSEL. SPEAK IF YOU DARE."
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userName] = useState(`VERMIN_${Math.floor(Math.random() * 9999)}`);
  const [mood, setMood] = useState<Mood>('idle');
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);
  
  const voices = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];

  const isSpeakingRef = useRef(isSpeaking);
  const moodRef = useRef<Mood>(mood);
  
  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    moodRef.current = mood;
  }, [mood]);

  const spawnParticles = useCallback((intensity: number) => {
    const count = Math.min(intensity * 3, 25);
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < count; i++) {
      const isSkull = intensity >= 7 && Math.random() > 0.5;
      newParticles.push({
        id: particleIdRef.current++,
        emoji: isSkull ? '💀' : '🔥',
        x: 50 + (Math.random() - 0.5) * 30,
        y: 60 + Math.random() * 10,
        vx: (Math.random() - 0.5) * 2,
        vy: -2 - Math.random() * 3,
        opacity: 1,
        scale: 0.8 + Math.random() * 0.6,
        rotation: Math.random() * 360,
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  const handleExternalReaction = useCallback((event: PsychoReactionEvent) => {
    setMood(event.mood);
    spawnParticles(event.intensity);
    setTerminalText(event.text);
    
    if (event.audio && audioRef.current) {
      audioRef.current.src = event.audio;
      audioRef.current.onplay = () => setIsSpeaking(true);
      audioRef.current.onended = () => {
        setIsSpeaking(false);
        setTimeout(() => setMood('idle'), 2000);
      };
      audioRef.current.play();
    }
  }, [spawnParticles]);

  useEffect(() => {
    return onPsychoReaction(handleExternalReaction);
  }, [handleExternalReaction]);

  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles(prev => {
        const updated = prev.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy - 0.05,
          opacity: p.opacity - 0.015,
          rotation: p.rotation + p.vx * 2,
        })).filter(p => p.opacity > 0);
        
        return updated;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [particles.length]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(
      45,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const geometry = new THREE.IcosahedronGeometry(1.5, 1);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const solidMaterial = new THREE.MeshPhongMaterial({
      color: 0x0a0000,
      flatShading: true,
      shininess: 10,
    });

    const head = new THREE.Group();
    const mesh = new THREE.Mesh(geometry, solidMaterial);
    const wire = new THREE.Mesh(geometry, wireframeMaterial);
    
    const spikeGeom = new THREE.ConeGeometry(0.1, 0.8, 4);
    const spikeMat = new THREE.MeshPhongMaterial({ color: 0x330000, flatShading: true });
    
    for (let i = 0; i < 12; i++) {
      const spike = new THREE.Mesh(spikeGeom, spikeMat);
      const angle = (i / 12) * Math.PI * 2;
      spike.position.set(Math.cos(angle) * 1.4, Math.sin(angle) * 1.4, Math.random() * 0.5);
      spike.rotation.z = angle + Math.PI / 2;
      head.add(spike);
    }

    const eyeGeom = new THREE.BoxGeometry(0.5, 0.2, 0.4);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
    const rightEye = new THREE.Mesh(eyeGeom, eyeMat);
    leftEye.position.set(-0.6, 0.5, 1.2);
    rightEye.position.set(0.6, 0.5, 1.2);
    leftEye.rotation.z = 0.2;
    rightEye.rotation.z = -0.2;

    const leftBrowGeom = new THREE.BoxGeometry(0.6, 0.08, 0.1);
    const browMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const leftBrow = new THREE.Mesh(leftBrowGeom, browMat);
    const rightBrow = new THREE.Mesh(leftBrowGeom.clone(), browMat);
    leftBrow.position.set(-0.6, 0.75, 1.3);
    rightBrow.position.set(0.6, 0.75, 1.3);
    leftBrow.rotation.z = 0.15;
    rightBrow.rotation.z = -0.15;

    const mouthGroup = new THREE.Group();
    const upperLipGeom = new THREE.BoxGeometry(0.6, 0.08, 0.2);
    const lowerLipGeom = new THREE.BoxGeometry(0.5, 0.06, 0.15);
    const mouthMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const upperLip = new THREE.Mesh(upperLipGeom, mouthMat);
    const lowerLip = new THREE.Mesh(lowerLipGeom, mouthMat);
    upperLip.position.set(0, 0.04, 0);
    lowerLip.position.set(0, -0.04, 0);
    mouthGroup.add(upperLip);
    mouthGroup.add(lowerLip);
    mouthGroup.position.set(0, -0.3, 1.4);

    const teethGeom = new THREE.BoxGeometry(0.4, 0.1, 0.1);
    const teethMat = new THREE.MeshBasicMaterial({ color: 0x330000 });
    const teeth = new THREE.Mesh(teethGeom, teethMat);
    teeth.position.set(0, 0, 0.05);
    mouthGroup.add(teeth);

    head.add(mesh);
    head.add(wire);
    head.add(leftEye);
    head.add(rightEye);
    head.add(leftBrow);
    head.add(rightBrow);
    head.add(mouthGroup);
    scene.add(head);

    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xff0000, 20, 10);
    pointLight.position.set(2, 2, 5);
    scene.add(pointLight);

    const clock = new THREE.Clock();
    let lastMouseMoveTime = Date.now();
    let isLookingRandomly = false;
    let randomLookTarget = { x: 0, y: 0 };
    let nextRandomLookTime = Date.now() + 3000;

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouseRef.current = { x, y };
      targetRotationRef.current = {
        x: -y * 0.5,
        y: x * 0.8
      };
      lastMouseMoveTime = Date.now();
      isLookingRandomly = false;
    };

    const applyExpression = (currentMood: Mood, time: number, speaking: boolean) => {
      const mouthOpenAmount = speaking ? Math.abs(Math.sin(time * 20)) * 0.15 : 0;
      upperLip.position.y = 0.04 + mouthOpenAmount;
      lowerLip.position.y = -0.04 - mouthOpenAmount;
      teeth.visible = mouthOpenAmount > 0.05;

      switch (currentMood) {
        case 'angry':
          leftBrow.rotation.z = -0.4;
          rightBrow.rotation.z = 0.4;
          leftBrow.position.y = 0.7;
          rightBrow.position.y = 0.7;
          leftEye.scale.y = 0.6;
          rightEye.scale.y = 0.6;
          eyeMat.color.setHex(0xff2200);
          break;
          
        case 'amused':
          leftBrow.rotation.z = 0.3;
          rightBrow.rotation.z = -0.3;
          leftBrow.position.y = 0.85;
          rightBrow.position.y = 0.85;
          leftEye.scale.y = 0.7;
          rightEye.scale.y = 0.7;
          upperLip.scale.x = 1.2;
          lowerLip.position.y = -0.06 - mouthOpenAmount;
          eyeMat.color.setHex(0xff4400);
          break;
          
        case 'evil_grin':
          leftBrow.rotation.z = -0.2;
          rightBrow.rotation.z = 0.2;
          leftBrow.position.y = 0.8;
          rightBrow.position.y = 0.8;
          leftEye.scale.y = 0.5;
          rightEye.scale.y = 0.5;
          upperLip.scale.x = 1.4;
          upperLip.rotation.z = Math.sin(time * 2) * 0.05;
          eyeMat.color.setHex(0xff0000);
          const glowPulse = 0.5 + Math.sin(time * 8) * 0.5;
          pointLight.intensity = 20 + glowPulse * 15;
          break;
          
        case 'disgusted':
          leftBrow.rotation.z = 0.5;
          rightBrow.rotation.z = -0.1;
          leftBrow.position.y = 0.72;
          rightBrow.position.y = 0.78;
          leftEye.scale.y = 0.8;
          rightEye.scale.y = 0.5;
          upperLip.rotation.z = 0.15;
          eyeMat.color.setHex(0xaa0000);
          break;
          
        default: // idle
          leftBrow.rotation.z = 0.15;
          rightBrow.rotation.z = -0.15;
          leftBrow.position.y = 0.75;
          rightBrow.position.y = 0.75;
          leftEye.scale.y = 1;
          rightEye.scale.y = 1;
          upperLip.scale.x = 1;
          upperLip.rotation.z = 0;
          eyeMat.color.setHex(0xff0000);
          pointLight.intensity = 20;
          break;
      }
    };

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      const now = Date.now();

      const idleTime = now - lastMouseMoveTime;
      if (idleTime > 2000) {
        if (!isLookingRandomly || now > nextRandomLookTime) {
          isLookingRandomly = true;
          randomLookTarget = {
            x: (Math.random() - 0.5) * 0.8,
            y: (Math.random() - 0.5) * 1.2
          };
          nextRandomLookTime = now + 1500 + Math.random() * 3000;
        }
        targetRotationRef.current = randomLookTarget;
      }

      head.rotation.y += (targetRotationRef.current.y - head.rotation.y) * 0.08;
      head.rotation.x += (targetRotationRef.current.x - head.rotation.x) * 0.08;
      head.position.y = Math.sin(time) * 0.1;

      applyExpression(moodRef.current, time, isSpeakingRef.current);

      if (isSpeakingRef.current) {
        const scale = 1 + Math.sin(time * 25) * 0.04;
        head.scale.set(scale, scale, scale);
        if (Math.random() > 0.7) {
          eyeMat.color.setHex(Math.random() > 0.5 ? 0xff0000 : 0x440000);
        }
      } else {
        head.scale.set(1, 1, 1);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!canvasRef.current) return;
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;
      if (width === 0 || height === 0) return;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    canvasRef.current.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    const canvas = canvasRef.current;
    return () => {
      canvas?.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, []);

  const processMessage = async (msg: string) => {
    setIsLoading(true);
    setTerminalText("PROCESSING INSIGNIFICANT INPUT...");
    setMood('idle');

    await supabase
      .from('messages')
      .insert([{ 
        content: msg, 
        user_name: userName,
        is_ai: false,
        topic: 'roast',
        extension: 'chat'
      }]);
    
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, voice }),
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setTerminalText(data.text);
      
      if (data.mood) {
        setMood(data.mood as Mood);
      }
      
      if (data.roastIntensity) {
        spawnParticles(data.roastIntensity);
      }

      await supabase
        .from('messages')
        .insert([{ 
          content: data.text, 
          user_name: 'PSYCHO',
          is_ai: true,
          audio_url: data.audio || null,
          topic: 'roast',
          extension: 'chat'
        }]);
      
      if (data.audio) {
        if (audioRef.current) {
          audioRef.current.src = data.audio;
          audioRef.current.onplay = () => setIsSpeaking(true);
          audioRef.current.onended = () => {
            setIsSpeaking(false);
            setTimeout(() => setMood('idle'), 2000);
          };
          audioRef.current.play();
        }
      }
    } catch {
      setTerminalText("SYSTEM ERROR: YOUR STUPIDITY BROKE MY CIRCUITS.");
      setMood('disgusted');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const message = input;
    setInput("");
    processMessage(message);
  };

  return (
    <div className="flex-1 flex flex-col h-full border border-primary relative bg-[#050000] overflow-hidden">
      <audio ref={audioRef} hidden />
      
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#ff0000 1px, transparent 1px), linear-gradient(90deg, #ff0000 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="panel-header border-b border-primary bg-black/80 z-20 flex justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <Mic className="p-0.5 w-3 h-3 text-primary animate-pulse" />
          <span className="uppercase tracking-widest text-[10px] font-bold">Psycho Speaking</span>
          {mood !== 'idle' && (
            <span className="text-[8px] px-1.5 py-0.5 bg-primary/20 text-primary uppercase tracking-wider">
              {mood.replace('_', ' ')}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-muted-foreground uppercase">Voice:</span>
            <select 
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              className="bg-black text-primary border border-primary/30 text-[9px] px-1 outline-none cursor-pointer hover:border-primary transition-colors h-4"
            >
              {voices.map(v => (
                <option key={v} value={v}>{v.toUpperCase()}</option>
              ))}
            </select>
          </div>
          <div className="text-[9px] text-muted-foreground">ID: {userName}</div>
        </div>
      </div>

      <div className="p-4 z-20 min-h-[100px] border-b border-primary/20 bg-black/40 backdrop-blur-sm">
        <div className="text-primary font-mono text-[11px] leading-relaxed terminal-text">
          <span className="text-[#660000] mr-2">root@psycho:~$</span>
          {terminalText}
          <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />
        </div>
      </div>

      <div className="flex-1 relative flex items-center justify-center crt-flicker overflow-hidden">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full cursor-pointer"
        />
        
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute pointer-events-none select-none"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              opacity: p.opacity,
              transform: `scale(${p.scale}) rotate(${p.rotation}deg)`,
              fontSize: '2rem',
              filter: 'drop-shadow(0 0 8px rgba(255, 100, 0, 0.8))',
              zIndex: 50,
              transition: 'none',
            }}
          >
            {p.emoji}
          </div>
        ))}
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-primary/10 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-primary/5 rounded-full pointer-events-none animate-[ping_10s_linear_infinite]" />
        
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-md px-4">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute inset-0 bg-primary/5 blur-sm group-focus-within:bg-primary/10 transition-all" />
            <div className="relative flex items-center border border-primary bg-black/80 overflow-hidden">
              <div className="pl-3 text-primary/60">
                <Terminal size={14} />
              </div>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="TYPE YOUR PITIFUL MESSAGE..."
                className="flex-1 bg-transparent px-3 py-2 text-[11px] text-primary placeholder:text-primary/30 outline-none font-mono"
                disabled={isLoading}
              />
              <button 
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 border-l border-primary text-primary hover:bg-primary hover:text-black transition-all disabled:opacity-50"
              >
                <Send size={14} />
              </button>
            </div>
          </form>
        </div>

        <div className="scanline-overlay" />
      </div>

      <div className="grid grid-cols-4 gap-0 border-t border-primary bg-black/90 font-mono text-[9px] z-20">
        <div className="p-2 border-r border-primary/30 flex items-center justify-between">
          <span>ROUTINE: MALICE</span>
          <div className="w-1.5 h-1.5 bg-primary animate-pulse shadow-[0_0_5px_#ff0000]" />
        </div>
        <div className="p-2 border-r border-primary/30 flex flex-col gap-1">
          <div className="flex justify-between">
            <span>MOOD: {mood.toUpperCase().replace('_', ' ')}</span>
            <span className="text-primary">98%</span>
          </div>
          <div className="w-full h-1 bg-[#1a0000]">
            <div className="bg-primary h-full shadow-[0_0_5px_#ff0000]" style={{ width: '98%' }} />
          </div>
        </div>
        <div className="p-2 border-r border-primary/30 flex flex-col gap-1">
          <div className="flex justify-between">
            <span>VOLATILITY</span>
            <span className="text-primary">CRITICAL</span>
          </div>
          <div className="w-full h-1 bg-[#1a0000] flex gap-0.5">
            {[...Array(10)].map((_, i) => (
              <div key={i} className={`flex-1 h-full ${i < 9 ? 'bg-primary' : 'bg-primary/10'}`} />
            ))}
          </div>
        </div>
        <div className="p-2 flex items-center justify-between">
          <span>TICKS: 666</span>
          <span className="text-primary animate-pulse">GLOBAL_SYNC: ON</span>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary z-30" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary z-30" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary z-30" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary z-30" />
    </div>
  );
};

export default MainInterface;

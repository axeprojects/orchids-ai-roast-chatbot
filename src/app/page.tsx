"use client";

import Header from "@/components/sections/Header";
import LifecyclePanel from "@/components/sections/LifecyclePanel";
import MainInterface from "@/components/sections/MainInterface";
import CommunityChat from "@/components/sections/CommunityChat";
import FooterStatus from "@/components/sections/FooterStatus";

export default function Home() {
  return (
    <main className="flex flex-col h-screen bg-background overflow-hidden selection:bg-primary selection:text-black">
      {/* Background scanline effect */}
      <div className="scanline-overlay" />
      
      <Header />
      
      <div className="flex flex-1 min-h-0 overflow-hidden px-5 py-4 gap-5">
        {/* Left Panel */}
        <aside className="w-[300px] flex flex-col flex-none">
          <LifecyclePanel />
        </aside>
        
        {/* Center Panel */}
        <div className="flex-1 flex flex-col min-w-0">
          <MainInterface />
        </div>
        
        {/* Right Panel */}
        <aside className="w-[350px] flex flex-col flex-none">
          <CommunityChat />
        </aside>
      </div>
      
      <FooterStatus />
    </main>
  );
}

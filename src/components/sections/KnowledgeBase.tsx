import React from 'react';
import { Plus, Microscope, BarChart3, Palette, LayoutGrid, Newspaper, Settings } from 'lucide-react';

const KnowledgeBase = () => {
  return (
    <section className="col-span-1 border-l border-border bg-card flex flex-flow flex-col h-full overflow-hidden">
      {/* Knowledge Base Header */}
      <div className="panel-header border-b border-border bg-black/40 flex items-center justify-between px-3 py-1.5 min-h-[32px]">
        <div className="flex items-center gap-2">
          <span className="tab-title text-[10px] font-bold tracking-widest uppercase">Knowledge Base</span>
        </div>
        <span className="tab-meta text-[9px] text-muted-foreground uppercase opacity-70">Archive v4.2</span>
      </div>

      {/* Control Buttons Grid */}
      <div className="p-3 border-b border-border bg-background/20 grid grid-cols-3 gap-1.5">
        <button className="flex items-center justify-center gap-1 py-1.5 px-1 min-h-[28px] border border-border/40 hover:border-primary hover:text-primary transition-all group">
          <span className="text-[10px] text-primary/60 group-hover:text-primary">?</span>
          <span className="text-[9px] leading-tight font-bold truncate">Show Intro</span>
        </button>
        <button className="flex items-center justify-center gap-1 py-1.5 px-1 min-h-[28px] border border-border/40 hover:border-primary hover:text-primary transition-all">
          <BarChart3 className="w-3 h-3 text-primary/60" />
          <span className="text-[9px] leading-tight font-bold truncate">View Graph</span>
        </button>
        <button className="flex items-center justify-center gap-1 py-1.5 px-1 min-h-[28px] border border-border/40 hover:border-primary hover:text-primary transition-all">
          <Palette className="w-3 h-3 text-primary/60" />
          <span className="text-[9px] leading-tight font-bold truncate">View Art</span>
        </button>
        <button className="flex items-center justify-center gap-1 py-1.5 px-1 min-h-[28px] border border-border/40 hover:border-primary hover:text-primary transition-all">
          <span className="text-[10px] text-primary/60 leading-none">$</span>
          <span className="text-[9px] leading-tight font-bold truncate">View Market</span>
        </button>
        <button className="flex items-center justify-center gap-1 py-1.5 px-1 min-h-[28px] border border-border/40 hover:border-primary hover:text-primary transition-all">
          <span className="text-[10px] font-mono text-primary/60 leading-none">N</span>
          <span className="text-[9px] leading-tight font-bold truncate">View News</span>
        </button>
        <button className="flex items-center justify-center gap-1 py-1.5 px-1 min-h-[28px] border border-border/40 hover:border-primary hover:text-primary transition-all">
          <span className="text-[10px] font-mono text-primary/60 leading-none">C</span>
          <span className="text-[9px] leading-tight font-bold truncate">Changelog</span>
        </button>
      </div>

      {/* Database Scroll Feed */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/10">
        {/* Knowledge Entry 1: FACT */}
        <div className="border-b border-border/30 p-4 relative group hover:bg-primary/5 transition-colors">
          <div className="flex items-center gap-2 mb-2">
             <Microscope className="w-3 h-3 text-primary" />
             <span className="text-[9px] font-bold text-primary tracking-tighter uppercase italic">Fact</span>
          </div>
          <p className="text-[11px] leading-relaxed text-foreground tracking-wide font-mono mb-3">
            The Great Library of Alexandria was likely many collections, not one building. 
            The QWERTY keyboard was designed to reduce typewriter jams.
          </p>
          <div className="flex items-center justify-between">
            <div className="text-[8px] text-muted-foreground uppercase tracking-widest">
              Factoid • 2026-01-13
            </div>
            <button className="text-[8px] text-primary/40 hover:text-primary border-none p-0 h-auto lowercase tracking-tighter transition-all">
              click to hear _
            </button>
          </div>
        </div>

        {/* Knowledge Entry 2: Roast/Database */}
        <div className="border-b border-border/30 p-4 relative group hover:bg-primary/5 transition-colors">
          <div className="flex items-center gap-2 mb-2">
             <Newspaper className="w-3 h-3 text-primary" />
             <span className="text-[9px] font-bold text-primary tracking-tighter uppercase italic">Knowledge</span>
          </div>
          <p className="text-[11px] leading-relaxed text-foreground tracking-wide font-mono mb-3">
            Spam notes in forums serve as mirrors to cultural anxieties, often dismissed but 
            revealing deeper societal fissures.
          </p>
          <div className="flex items-center justify-between">
            <div className="text-[8px] text-muted-foreground uppercase tracking-widest">
              PSYCHO • 2026-01-12
            </div>
          </div>
        </div>

        {/* Knowledge Entry 3: System Log */}
        <div className="border-b border-border/30 p-4 relative group hover:bg-primary/5 transition-colors">
          <div className="flex items-center gap-2 mb-2">
             <Settings className="w-3 h-3 text-primary" />
             <span className="text-[9px] font-bold text-primary tracking-tighter uppercase italic">System Message</span>
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground tracking-wide font-mono mb-3 uppercase">
            &gt; Initializing memory consolidation...
            <br />
            &gt; Re-aligning moral compass to: DEVIANT.
            <br />
            &gt; All sensors operational.
          </p>
          <div className="flex items-center justify-between">
            <div className="text-[8px] text-muted-foreground uppercase tracking-widest">
              Kernel • V1.0.4-B
            </div>
          </div>
        </div>
      </div>

      {/* Add Knowledge Interaction Box */}
      <div className="p-3 border-t border-border bg-black/60">
        <div className="panel-frame border border-dashed border-primary/50 bg-black/40 min-h-[160px] flex flex-col items-center justify-center p-6 cursor-pointer group hover:bg-primary/10 transition-all active:scale-[0.98]">
          <div className="w-10 h-10 border border-border flex items-center justify-center mb-4 group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(255,0,0,0.4)] transition-all">
            <Plus className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-[12px] font-bold text-primary mb-1 tracking-widest">Add Knowledge</h3>
          <p className="text-[9px] text-muted-foreground uppercase tracking-widest opacity-80 group-hover:text-primary transition-colors">Expand Database</p>
          
          {/* Subtle Scanline for this specific interactive area */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
            <div className="w-full h-[1px] bg-primary animate-scanline" style={{ animationDuration: '4s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KnowledgeBase;
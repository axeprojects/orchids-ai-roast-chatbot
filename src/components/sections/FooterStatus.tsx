import React from 'react';

const FooterStatus = () => {
  return (
    <footer className="w-full mt-auto px-5 pb-5">
      <div 
        className="flex items-center justify-between border border-primary bg-background py-[6px] px-3 font-mono"
        style={{ fontSize: '10px' }}
      >
        {/* Left Section: System Status */}
        <div className="flex items-center gap-2 tracking-widest uppercase">
          <span className="text-primary-foreground bg-primary px-1 font-bold">
            SYSTEM: NORMAL
          </span>
        </div>

        {/* Right Section: Indicators */}
        <div className="flex items-center gap-4 text-primary tracking-widest uppercase font-bold">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground opacity-60">PERSISTENCE:</span>
            <span className="terminal-text">REAL-TIME</span>
          </div>
          
          <div className="flex items-center gap-2 border-l border-primary/30 pl-4">
            <span className="text-muted-foreground opacity-60">MODE:</span>
            <span className="terminal-text">SOVEREIGN</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .terminal-text {
          text-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
        }
      `}</style>
    </footer>
  );
};

export default FooterStatus;
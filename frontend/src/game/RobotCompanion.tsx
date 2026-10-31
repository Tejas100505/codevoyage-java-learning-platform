import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Bot, AlertCircle, CheckCircle2, ChevronRight, X, Terminal } from 'lucide-react';
import byteImg from '../assets/images/byte_guide.jpg';
import { soundManager } from '../services/soundService';

export type CompanionMood = 'idle' | 'encouraging' | 'explaining' | 'analyzing' | 'warning' | 'celebrating';

interface RobotCompanionProps {
  message: string;
  subtext?: string;
  mood?: CompanionMood;
  codeHint?: string;
  className?: string;
  compact?: boolean;
}

export const RobotCompanion: React.FC<RobotCompanionProps> = ({
  message,
  subtext,
  mood = 'idle',
  codeHint,
  className = '',
  compact = false,
}) => {
  const [minimized, setMinimized] = useState<boolean>(false);
  const [pulse, setPulse] = useState<boolean>(false);

  // Trigger subtle antenna pulse and chirp when message updates
  useEffect(() => {
    setPulse(true);
    soundManager.emit('byte_chirp');
    const timer = setTimeout(() => setPulse(false), 1200);
    return () => clearTimeout(timer);
  }, [message]);

  const moodColors: Record<CompanionMood, { border: string; glow: string; text: string; badge: string }> = {
    idle: {
      border: 'border-cyber-cyan/30',
      glow: 'shadow-[0_0_20px_rgba(0,240,255,0.15)]',
      text: 'text-cyber-cyan',
      badge: 'bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/30',
    },
    encouraging: {
      border: 'border-cyber-cyan/40',
      glow: 'shadow-[0_0_25px_rgba(0,240,255,0.25)]',
      text: 'text-cyber-cyan',
      badge: 'bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/40',
    },
    explaining: {
      border: 'border-cyber-purple/40',
      glow: 'shadow-[0_0_25px_rgba(139,92,246,0.25)]',
      text: 'text-cyber-purple',
      badge: 'bg-cyber-purple/15 text-cyber-purple border-cyber-purple/40',
    },
    analyzing: {
      border: 'border-amber-400/40',
      glow: 'shadow-[0_0_25px_rgba(245,158,11,0.25)]',
      text: 'text-amber-400',
      badge: 'bg-amber-400/15 text-amber-400 border-amber-400/40',
    },
    warning: {
      border: 'border-rose-500/50',
      glow: 'shadow-[0_0_30px_rgba(244,63,94,0.3)]',
      text: 'text-rose-400',
      badge: 'bg-rose-500/15 text-rose-400 border-rose-500/40',
    },
    celebrating: {
      border: 'border-cyber-emerald/50',
      glow: 'shadow-[0_0_30px_rgba(16,185,129,0.35)]',
      text: 'text-cyber-emerald',
      badge: 'bg-cyber-emerald/15 text-cyber-emerald border-cyber-emerald/40',
    },
  };

  const currentTheme = moodColors[mood] || moodColors.idle;

  if (compact) {
    return (
      <div className={`flex items-center space-x-3 p-3 rounded-2xl bg-space-950/80 border ${currentTheme.border} ${currentTheme.glow} backdrop-blur-md ${className}`}>
        <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-cyber-cyan/40 shrink-0">
          <img src={byteImg} alt="B.Y.T.E. Guide" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-cyber-cyan/10" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1.5 text-[10px] font-mono font-bold text-cyber-cyan">
            <span>B.Y.T.E.</span>
            <span className="text-slate-500">•</span>
            <span className="uppercase text-slate-400">{mood}</span>
          </div>
          <p className="text-xs text-slate-200 font-mono truncate">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative rounded-2xl bg-space-950/90 border ${currentTheme.border} ${currentTheme.glow} backdrop-blur-xl p-4 sm:p-5 overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Robot Scanline Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      <div className="relative z-10 flex items-start gap-3 sm:gap-4">
        {/* Animated Avatar */}
        <div className="relative shrink-0">
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border-2 border-cyber-cyan/50 shadow-glow-cyan/30 relative group"
          >
            <img src={byteImg} alt="B.Y.T.E. Guide" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-cyber-cyan/15 mix-blend-overlay" />
            {pulse && (
              <motion.div
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 bg-cyber-cyan/40"
              />
            )}
          </motion.div>

          {/* Online LED indicator */}
          <div className="absolute -bottom-1 -right-1 flex items-center justify-center">
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${mood === 'warning' ? 'bg-rose-400' : 'bg-cyber-cyan'}`} />
              <span className={`relative inline-flex rounded-full h-3 w-3 ${mood === 'warning' ? 'bg-rose-500' : 'bg-cyber-cyan'}`} />
            </span>
          </div>
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-black tracking-wider text-white">B.Y.T.E.</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${currentTheme.badge}`}>
                {mood === 'warning' ? 'Telemetry Warning' : mood === 'celebrating' ? 'Transmission Nominal' : 'Tactical Guide'}
              </span>
            </div>
            <button
              onClick={() => setMinimized(!minimized)}
              className="text-slate-500 hover:text-slate-300 transition-colors p-1"
              title={minimized ? 'Expand guide' : 'Minimize guide'}
            >
              {minimized ? <ChevronRight className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
            </button>
          </div>

          <AnimatePresence>
            {!minimized && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <p className="text-xs sm:text-sm font-mono text-slate-200 leading-relaxed font-medium">
                  &ldquo;{message}&rdquo;
                </p>

                {subtext && (
                  <p className="text-[11px] font-mono text-slate-400 leading-normal">
                    {subtext}
                  </p>
                )}

                {codeHint && (
                  <div className="mt-2 p-2.5 rounded-xl bg-space-900/90 border border-space-800 flex items-center space-x-2 font-mono text-xs text-cyber-cyan">
                    <Terminal className="w-3.5 h-3.5 shrink-0 text-cyber-purple" />
                    <span className="text-slate-400 text-[11px]">Suggestion:</span>
                    <code className="text-cyber-cyan text-[11px] bg-space-950 px-1.5 py-0.5 rounded border border-white/5">
                      {codeHint}
                    </code>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

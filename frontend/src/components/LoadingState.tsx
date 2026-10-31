import React from 'react';
import { Cpu, Terminal, Radio } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoadingStateProps {
  message?: string;
  submessage?: string;
  compact?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Transmitting sub-space data packets...',
  submessage = 'Calibrating quantum telemetry relays',
  compact = false,
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center font-mono ${compact ? 'p-6 space-y-3' : 'p-12 space-y-4'}`}>
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-14 h-14 rounded-2xl bg-cyber-cyan/10 border border-cyber-cyan/40 flex items-center justify-center text-cyber-cyan shadow-glow-cyan/40"
        >
          <Cpu className="w-7 h-7" />
        </motion.div>
        {/* Subtle radar sonar echo */}
        <div className="absolute -inset-2 rounded-2xl border border-cyber-cyan/30 animate-ping pointer-events-none opacity-40"></div>
      </div>

      <div className="space-y-1.5 max-w-sm">
        <div className="flex items-center justify-center space-x-1.5 text-xs text-cyber-cyan font-bold tracking-wider uppercase">
          <Radio className="w-3.5 h-3.5 animate-pulse text-amber-400" />
          <span>SUBSPHERE LINK ACTIVE</span>
        </div>
        <h4 className="text-sm font-bold text-white tracking-tight">{message}</h4>
        <p className="text-[11px] text-slate-400">{submessage}</p>
      </div>

      {/* Micro-loading progress bar */}
      <div className="w-36 h-1 bg-space-900 rounded-full overflow-hidden border border-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-emerald to-cyber-cyan rounded-full"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
};

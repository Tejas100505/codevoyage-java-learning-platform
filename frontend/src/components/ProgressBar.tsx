import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number; // 0 - 100
  max?: number;
  label?: string;
  showPercent?: boolean;
  color?: 'cyan' | 'purple' | 'amber' | 'emerald';
  size?: 'sm' | 'md' | 'lg';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercent = false,
  color = 'cyan',
  size = 'md',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const colorStyles = {
    cyan: 'bg-gradient-to-r from-blue-500 to-cyber-cyan shadow-[0_0_12px_rgba(0,240,255,0.5)]',
    purple: 'bg-gradient-to-r from-indigo-500 to-cyber-purple shadow-[0_0_12px_rgba(139,92,246,0.5)]',
    amber: 'bg-gradient-to-r from-yellow-500 to-cyber-amber shadow-[0_0_12px_rgba(245,158,11,0.5)]',
    emerald: 'bg-gradient-to-r from-teal-500 to-cyber-emerald shadow-[0_0_12px_rgba(16,185,129,0.5)]',
  }[color];

  const heightStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }[size];

  return (
    <div className="w-full space-y-1.5">
      {(label || showPercent) && (
        <div className="flex items-center justify-between text-xs font-mono text-slate-300">
          {label && <span>{label}</span>}
          {showPercent && <span className="font-semibold">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className={`w-full bg-space-950/80 rounded-full overflow-hidden p-0.5 border border-white/10 ${heightStyles}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${colorStyles}`}
        />
      </div>
    </div>
  );
};

import React from 'react';
import { ProgressBar } from './ProgressBar';
import { Zap, Shield } from 'lucide-react';

interface XPBarProps {
  currentXP: number;
  nextLevelXP: number;
  level: number;
}

export const XPBar: React.FC<XPBarProps> = ({ currentXP, nextLevelXP, level }) => {
  return (
    <div className="p-4 rounded-xl bg-space-900/90 border border-white/10 space-y-2">
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-1.5 text-cyber-cyan font-bold">
          <Shield className="w-4 h-4 text-cyber-cyan" />
          <span>RANK LEVEL {level}</span>
        </div>
        <div className="flex items-center space-x-1 text-cyber-amber">
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>{currentXP} / {nextLevelXP} XP</span>
        </div>
      </div>
      <ProgressBar value={currentXP} max={nextLevelXP} color="cyan" size="sm" />
    </div>
  );
};

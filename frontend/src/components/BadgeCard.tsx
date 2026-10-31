import React from 'react';
import { GlassCard } from './GlassCard';
import { Award, Lock, Star } from 'lucide-react';

interface BadgeCardProps {
  title: string;
  description: string;
  unlocked: boolean;
  xpBonus: number;
  iconName?: string;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({
  title,
  description,
  unlocked,
  xpBonus,
}) => {
  return (
    <GlassCard
      glow={unlocked ? 'cyan' : 'none'}
      interactive={unlocked}
      className={`p-5 flex flex-col justify-between ${
        unlocked ? 'border-cyber-cyan/30' : 'opacity-50 border-white/5'
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
              unlocked
                ? 'bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/40 shadow-glow-cyan/20'
                : 'bg-space-900 text-slate-500 border-white/10'
            }`}
          >
            <Award className="w-5 h-5" />
          </div>

          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
              unlocked
                ? 'bg-cyber-emerald/10 text-cyber-emerald border-cyber-emerald/30'
                : 'bg-space-900 text-slate-500 border-white/5'
            }`}
          >
            {unlocked ? 'ACQUIRED' : 'LOCKED'}
          </span>
        </div>

        <h4 className="text-sm font-bold text-white mb-1 font-mono">{title}</h4>
        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      </div>

      <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
        <span className="flex items-center space-x-1 text-cyber-amber">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>+{xpBonus} XP</span>
        </span>
        {!unlocked && <Lock className="w-3.5 h-3.5 text-slate-600" />}
      </div>
    </GlassCard>
  );
};

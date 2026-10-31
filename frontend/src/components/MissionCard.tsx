import React from 'react';
import { GlassCard } from './GlassCard';
import { BookOpen, Star, Lock, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MissionCardProps {
  id: number;
  missionOrder: number;
  title: string;
  objective: string;
  javaConcept: string;
  xpReward: number;
  difficulty: string;
  unlocked: boolean;
  completed?: boolean;
}

export const MissionCard: React.FC<MissionCardProps> = ({
  id,
  missionOrder,
  title,
  objective,
  javaConcept,
  xpReward,
  difficulty,
  unlocked,
  completed = false,
}) => {
  return (
    <GlassCard
      glow={unlocked ? 'cyan' : 'none'}
      interactive={unlocked}
      className={`p-6 flex flex-col justify-between ${
        unlocked
          ? 'border-cyber-cyan/40 bg-space-850/80 shadow-glow-cyan/10'
          : 'border-white/5 opacity-55 bg-space-950/40'
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono text-cyber-cyan font-bold tracking-wider">
            MISSION 0{missionOrder}
          </span>
          {unlocked ? (
            completed ? (
              <span className="inline-flex items-center space-x-1 text-[11px] text-cyber-emerald bg-cyber-emerald/10 border border-cyber-emerald/30 px-2.5 py-0.5 rounded-full font-mono font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                <span>COMPLETED</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 text-[11px] text-cyan-300 bg-cyber-cyan/10 border border-cyber-cyan/30 px-2.5 py-0.5 rounded-full font-mono">
                <span>AVAILABLE</span>
              </span>
            )
          ) : (
            <span className="inline-flex items-center space-x-1 text-[11px] text-slate-400 bg-space-900 border border-white/5 px-2.5 py-0.5 rounded-full font-mono">
              <Lock className="w-3 h-3" />
              <span>LOCKED</span>
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-white mb-2 font-mono tracking-tight">{title}</h3>
        <p className="text-xs text-slate-300 mb-4 leading-relaxed line-clamp-2">
          {objective}
        </p>

        <div className="p-2.5 rounded-xl bg-space-950/80 border border-white/10 text-xs text-slate-300 font-mono flex items-center space-x-2 mb-4">
          <BookOpen className="w-3.5 h-3.5 text-cyber-purple shrink-0" />
          <span className="text-slate-400">Concept:</span>
          <span className="text-white font-semibold truncate">{javaConcept}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-3 text-slate-400">
          <span className="flex items-center space-x-1 text-cyber-amber font-semibold">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>+{xpReward} XP</span>
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-space-900 border border-white/10 text-slate-400">
            {difficulty}
          </span>
        </div>

        {unlocked ? (
          <Link
            to={`/mission/${id}`}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-cyber-cyan hover:underline group"
          >
            <span>Launch</span>
            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : (
          <span className="text-[11px] text-slate-500 italic">Clear prior mission</span>
        )}
      </div>
    </GlassCard>
  );
};

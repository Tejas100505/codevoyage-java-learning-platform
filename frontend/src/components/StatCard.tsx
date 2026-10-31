import React from 'react';
import { GlassCard } from './GlassCard';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'cyan' | 'purple' | 'amber' | 'emerald';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'cyan',
}) => {
  const colorMap = {
    cyan: 'text-cyber-cyan bg-cyber-cyan/10 border-cyber-cyan/30 shadow-[0_0_15px_rgba(0,240,255,0.15)]',
    purple: 'text-cyber-purple bg-cyber-purple/10 border-cyber-purple/30 shadow-[0_0_15px_rgba(139,92,246,0.15)]',
    amber: 'text-cyber-amber bg-cyber-amber/10 border-cyber-amber/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]',
    emerald: 'text-cyber-emerald bg-cyber-emerald/10 border-cyber-emerald/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
  }[color];

  return (
    <GlassCard glow={color} interactive className="p-5">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">{title}</span>
          <div className="text-2xl font-black text-white font-mono">{value}</div>
          {subtitle && <p className="text-[11px] text-slate-500 font-mono">{subtitle}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${colorMap}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </GlassCard>
  );
};

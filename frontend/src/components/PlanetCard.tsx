import React from 'react';
import { GlassCard } from './GlassCard';
import { GlowButton } from './GlowButton';
import { Flame, ChevronRight, Globe2 } from 'lucide-react';

interface PlanetCardProps {
  name: string;
  theme: string;
  lore: string;
  missionCount: number;
  imageSrc?: string;
  unlocked?: boolean;
  onExplore?: () => void;
}

export const PlanetCard: React.FC<PlanetCardProps> = ({
  name,
  theme,
  lore,
  missionCount,
  imageSrc,
  unlocked = true,
  onExplore,
}) => {
  return (
    <GlassCard glow="amber" className="group overflow-hidden">
      <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-space-950">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-space-950 via-space-900 to-indigo-950">
            <Globe2 className="w-16 h-16 text-cyber-cyan/30 animate-pulse" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-space-900 via-space-900/40 to-transparent"></div>

        {/* Planet Sector Badge */}
        <div className="absolute top-4 left-4 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-space-950/80 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-mono">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>{theme}</span>
        </div>

        <div className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-space-950/80 border border-white/10 text-xs font-mono text-slate-300">
          <span className="text-cyber-cyan font-bold">{missionCount}</span> Missions
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-white tracking-wide font-mono">{name}</h3>
          <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mt-1">{lore}</p>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs font-mono text-cyber-emerald flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-cyber-emerald animate-ping inline-block mr-1"></span>
            <span>Sector Active</span>
          </span>

          <GlowButton
            variant="primary"
            size="sm"
            onClick={onExplore}
            icon={<ChevronRight className="w-3.5 h-3.5" />}
          >
            Enter Sector
          </GlowButton>
        </div>
      </div>
    </GlassCard>
  );
};

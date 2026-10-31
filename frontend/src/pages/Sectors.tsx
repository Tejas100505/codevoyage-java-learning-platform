import React, { useEffect, useState } from 'react';
import { missionService, WorldData } from '../services/missionService';
import { Lock, CheckCircle2, ChevronRight, BookOpen, Star, Flame, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Sectors: React.FC = () => {
  const [worlds, setWorlds] = useState<WorldData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    missionService.getWorlds()
      .then((data) => setWorlds(data))
      .catch((err) => console.error('Failed to load worlds', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-10">
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyber-purple/10 border border-cyber-purple/30 text-cyber-purple text-xs font-mono mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>GALACTIC EXPLORATION SECTOR MAP</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Active Star Systems</h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Progress through celestial outposts. Each mission trains cadets in authentic Java syntax, logical deduction, and system execution.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 font-mono text-sm">
          Calibrating sub-space long range scanners...
        </div>
      ) : (
        <div className="space-y-12">
          {worlds.map((world) => (
            <div key={world.id} className="space-y-6">
              {/* World Header Card */}
              <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-amber-500/30 shadow-glow-amber/10 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 font-semibold">
                      <Flame className="w-4 h-4" />
                      <span>{world.theme.toUpperCase()}</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">{world.name}</h2>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                      {world.lore}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center space-x-2 px-4 py-2 rounded-xl bg-space-900/90 border border-white/10 font-mono text-xs text-slate-300">
                    <span className="text-cyber-cyan font-bold">{world.missions.length}</span>
                    <span>Missions</span>
                  </div>
                </div>
              </div>

              {/* Missions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {world.missions.map((mission) => (
                  <div
                    key={mission.id}
                    className={`p-6 rounded-xl glass-panel border flex flex-col justify-between transition-all ${
                      mission.unlocked
                        ? 'border-cyber-cyan/40 bg-space-900/60 shadow-glow-cyan/10 hover:border-cyber-cyan'
                        : 'border-white/5 opacity-60 bg-space-950/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono text-cyber-cyan font-semibold">
                          MISSION 0{mission.missionOrder}
                        </span>
                        {mission.completed ? (
                          <span className="inline-flex items-center space-x-1 text-[11px] text-cyber-emerald bg-cyber-emerald/10 border border-cyber-emerald/20 px-2 py-0.5 rounded-full font-mono">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>CLEARED</span>
                          </span>
                        ) : mission.unlocked ? (
                          <span className="inline-flex items-center space-x-1 text-[11px] text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/30 px-2 py-0.5 rounded-full font-mono">
                            <Sparkles className="w-3 h-3" />
                            <span>READY</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-[11px] text-slate-400 bg-space-800 px-2 py-0.5 rounded-full font-mono">
                            <Lock className="w-3 h-3" />
                            <span>LOCKED</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-white mb-2">{mission.title}</h3>
                      <p className="text-xs text-slate-400 mb-4 leading-relaxed line-clamp-3">
                        {mission.objective}
                      </p>

                      <div className="p-2.5 rounded-lg bg-space-950 border border-white/5 text-xs text-slate-300 font-mono flex items-center space-x-2 mb-4">
                        <BookOpen className="w-3.5 h-3.5 text-cyber-purple shrink-0" />
                        <span className="text-slate-400">Concept:</span>
                        <span className="text-white font-semibold truncate">{mission.javaConcept}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center space-x-3 text-slate-400">
                        <span className="flex items-center space-x-1 text-cyber-amber font-semibold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>+{mission.xpReward} XP</span>
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-space-800 border border-white/5">
                          {mission.difficulty}
                        </span>
                      </div>

                      {mission.unlocked || mission.completed ? (
                        <Link
                          to={`/mission/${mission.id}`}
                          className="inline-flex items-center space-x-1 text-xs font-semibold text-cyber-cyan hover:underline group"
                        >
                          <span>{mission.completed ? 'Replay' : 'Launch'}</span>
                          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">Requires M0{Math.max(1, mission.missionOrder - 1)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

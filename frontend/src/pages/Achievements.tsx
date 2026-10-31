import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService, AchievementItem } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { Starfield } from '../game/Starfield';
import { GlassCard } from '../components/GlassCard';
import { GlowButton } from '../components/GlowButton';
import { ProgressBar } from '../components/ProgressBar';
import { LoadingState } from '../components/LoadingState';
import {
  Award,
  Zap,
  Shield,
  Radio,
  Flame,
  Terminal,
  Trophy,
  Rocket,
  Lock,
  CheckCircle2,
  Sparkles,
  Search,
  Filter,
  Star,
  Swords,
  Footprints,
  Variable,
  LightbulbOff,
  Compass,
  Cpu
} from 'lucide-react';
import { soundManager } from '../services/soundService';

const ICON_MAP: Record<string, React.ElementType> = {
  Award,
  Zap,
  Shield,
  Radio,
  Flame,
  Terminal,
  Trophy,
  Rocket,
  Swords,
  Footprints,
  Variable,
  LightbulbOff,
  Compass,
  Cpu,
  Sparkles,
};

export const Achievements: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'UNLOCKED' | 'LOCKED'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementItem | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        const data = await authService.getAchievements();
        if (isMounted) {
          setAchievements(data);
        }
      } catch (err) {
        console.error('Failed to load achievements', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAchievements();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const totalXpEarned = achievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + (a.xpReward || 0), 0);
  const totalPossibleXp = achievements.reduce((sum, a) => sum + (a.xpReward || 0), 0);

  const filteredAchievements = achievements.filter((a) => {
    if (selectedFilter === 'UNLOCKED' && !a.unlocked) return false;
    if (selectedFilter === 'LOCKED' && a.unlocked) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q)
      );
    }
    return true;
  });

  if (loading && achievements.length === 0) {
    return (
      <div className="py-32">
        <LoadingState message="SCANNING STARFLEET COMMENDATION REGISTRY..." />
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-5rem)] space-y-8 pb-16">
      <Starfield />

      {/* Hero Banner Header */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl glass-panel border border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.15)] overflow-hidden">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>STARFLEET ACADEMY // COMMENDATIONS & MEDALS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight uppercase">
            CADET ACHIEVEMENTS
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed">
            Commendations earned through authentic Java 21 compilation milestones, algorithm precision, zero-hint mastery, and world sector exploration.
          </p>
        </div>

        {/* Global Stats Matrix */}
        <div className="flex items-center space-x-4 sm:space-x-6 p-4 rounded-2xl bg-space-950/80 border border-space-800 font-mono text-xs">
          <div>
            <div className="text-slate-400 text-[10px] tracking-wider uppercase">Unlocked</div>
            <div className="text-2xl font-black text-cyber-emerald flex items-baseline space-x-1">
              <span>{unlockedCount}</span>
              <span className="text-xs text-slate-500 font-normal">/ {totalCount}</span>
            </div>
          </div>
          <div className="h-10 w-px bg-space-800" />
          <div>
            <div className="text-slate-400 text-[10px] tracking-wider uppercase">Medal XP</div>
            <div className="text-2xl font-black text-amber-400">
              +{totalXpEarned}
            </div>
          </div>
          <div className="h-10 w-px bg-space-800" />
          <div>
            <div className="text-slate-400 text-[10px] tracking-wider uppercase">Mastery</div>
            <div className="text-2xl font-black text-cyber-cyan">
              {totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0}%
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-3.5 rounded-2xl bg-space-950/70 border border-white/10 backdrop-blur-xl">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search commendations by title, code, or directive..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-space-900/80 border border-space-800 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyber-cyan transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1 bg-space-900/90 p-1 rounded-xl border border-space-800 font-mono text-xs">
          {(['ALL', 'UNLOCKED', 'LOCKED'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 rounded-lg transition-all font-bold ${
                selectedFilter === filter
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-glow-amber/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Achievement Grid with futuristic cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAchievements.map((badge, idx) => {
          const IconComponent = ICON_MAP[badge.icon] || Award;
          const isUnlocked = badge.unlocked;

          return (
            <motion.div
              key={badge.id || badge.code}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(0.3, idx * 0.04) }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              onClick={() => {
                if (isUnlocked) {
                  soundManager.emit('achievement_unlocked');
                } else {
                  soundManager.emit('button_click');
                }
                setSelectedAchievement(badge);
              }}
              className={`group relative rounded-3xl p-6 border transition-all cursor-pointer overflow-hidden flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-gradient-to-br from-space-900/90 via-space-950/95 to-space-900/80 border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:border-amber-400'
                  : 'bg-space-950/60 border-space-800/80 hover:border-space-700 opacity-75 hover:opacity-90'
              }`}
            >
              {/* Subtle top scanline */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-r from-amber-500 via-cyber-cyan to-amber-400 shadow-glow-amber'
                    : 'bg-space-800'
                }`}
              />

              <div>
                {/* Header Icon + Status Pill */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-105 ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-amber-500/20 to-cyber-cyan/15 border-amber-400 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.35)]'
                        : 'bg-space-900/80 border-space-800 text-slate-600'
                    }`}
                  >
                    <IconComponent className="w-7 h-7" />
                  </div>

                  <div className="flex flex-col items-end space-y-1">
                    <span
                      className={`text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center space-x-1 ${
                        isUnlocked
                          ? 'bg-cyber-emerald/20 text-cyber-emerald border border-cyber-emerald/40'
                          : 'bg-space-900 text-slate-500 border border-space-800'
                      }`}
                    >
                      {isUnlocked ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>UNLOCKED</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3" />
                          <span>LOCKED</span>
                        </>
                      )}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                      CODE // {badge.code}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <div className="space-y-1.5">
                  <h3 className="text-lg font-black text-white font-mono tracking-tight uppercase group-hover:text-amber-300 transition-colors">
                    {badge.name}
                  </h3>
                  <p className="text-xs text-slate-300 font-mono leading-relaxed line-clamp-3">
                    {badge.description}
                  </p>
                </div>
              </div>

              {/* Footer Reward Bar */}
              <div className="pt-4 mt-4 border-t border-space-800/80 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-current text-amber-400" />
                  <span>+{badge.xpReward} XP</span>
                </div>

                {isUnlocked ? (
                  <span className="text-[11px] text-cyber-cyan font-bold flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>HONOR CONFIRMED</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-500 font-bold">
                    OBJECTIVE PENDING
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-16 rounded-3xl glass-panel border border-space-800 space-y-3 font-mono">
          <Trophy className="w-12 h-12 mx-auto text-slate-600" />
          <h3 className="text-base font-bold text-white uppercase">No Commendations Found</h3>
          <p className="text-xs text-slate-400">
            Adjust your filter criteria or search query to inspect other Starfleet medals.
          </p>
        </div>
      )}

      {/* Achievement Detail Inspection Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAchievement(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/85 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-3xl glass-panel border border-amber-500/40 p-6 sm:p-8 space-y-6 shadow-[0_0_60px_rgba(245,158,11,0.25)]"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${
                    selectedAchievement.unlocked
                      ? 'bg-gradient-to-br from-amber-500/25 to-cyber-cyan/20 border-amber-400 text-amber-300 shadow-glow-amber'
                      : 'bg-space-900 border-space-800 text-slate-600'
                  }`}
                >
                  {React.createElement(ICON_MAP[selectedAchievement.icon] || Award, {
                    className: 'w-8 h-8',
                  })}
                </div>
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold uppercase border border-amber-500/40">
                    <span>{selectedAchievement.code}</span>
                  </div>
                  <h3 className="text-xl font-black text-white font-mono uppercase mt-1">
                    {selectedAchievement.name}
                  </h3>
                </div>
              </div>

              <div className="space-y-2 p-4 rounded-2xl bg-space-900/80 border border-space-800 text-xs font-mono">
                <div className="text-slate-400 uppercase text-[10px]">DIRECTIVE DESCRIPTION</div>
                <p className="text-slate-200 leading-relaxed text-sm">
                  {selectedAchievement.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-space-900/60 border border-space-800 space-y-1">
                  <div className="text-slate-400 text-[10px]">XP VALUE</div>
                  <div className="text-base font-bold text-amber-400">
                    +{selectedAchievement.xpReward} XP
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-space-900/60 border border-space-800 space-y-1">
                  <div className="text-slate-400 text-[10px]">STATUS</div>
                  <div
                    className={`text-base font-bold ${
                      selectedAchievement.unlocked ? 'text-cyber-emerald' : 'text-slate-500'
                    }`}
                  >
                    {selectedAchievement.unlocked ? 'CLEARED' : 'LOCKED'}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <GlowButton
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => setSelectedAchievement(null)}
                >
                  CLOSE INSPECTOR
                </GlowButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Sparkles, Star, Award, Zap, CheckCircle2, Shield, ArrowUpCircle } from 'lucide-react';
import { GlowButton } from '../components/GlowButton';
import { soundManager } from '../services/soundService';

export interface GameCelebrationModalProps {
  isOpen: boolean;
  type: 'mission_completed' | 'world_completed' | 'level_up' | 'badge_unlocked';
  title: string;
  subtitle: string;
  missionNumber?: number;
  worldName?: string;
  xpGained?: number;
  starsGained?: number;
  newLevel?: number;
  badgeName?: string;
  badgeIcon?: string;
  nextMissionUnlocked?: number;
  shipSystemUnlocked?: string;
  onNextAction: () => void;
  onSecondaryAction?: () => void;
  nextButtonText?: string;
  secondaryButtonText?: string;
}

export const GameCelebrationModal: React.FC<GameCelebrationModalProps> = ({
  isOpen,
  type,
  title,
  subtitle,
  missionNumber,
  worldName = 'Ignis Station',
  xpGained = 100,
  starsGained = 3,
  newLevel,
  badgeName,
  nextMissionUnlocked,
  shipSystemUnlocked,
  onNextAction,
  onSecondaryAction,
  nextButtonText = 'CONTINUE ADVENTURE',
  secondaryButtonText = 'RETURN TO GALAXY MAP',
}) => {
  const [animatedXp, setAnimatedXp] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) {
      setAnimatedXp(0);
      return;
    }

    soundManager.emit('mission_success');

    // Sequenced star sound and XP counter roll
    const tStar = setTimeout(() => {
      soundManager.emit('star_award');
    }, 350);

    const tXp = setTimeout(() => {
      soundManager.emit('xp_gain');
      // Rapid numeric roll for tactile feel
      const duration = 500;
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(1, elapsed / duration);
        setAnimatedXp(Math.round(progress * xpGained));
        if (progress >= 1) clearInterval(interval);
      }, 20);
    }, 600);

    return () => {
      clearTimeout(tStar);
      clearTimeout(tXp);
    };
  }, [isOpen, xpGained]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/85 backdrop-blur-xl overflow-y-auto">
        {/* Particle / Celebration Backdrop */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Subtle animated light beams */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyber-cyan/15 via-cyber-emerald/20 to-cyber-purple/15 rounded-full blur-[100px] animate-pulse" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-space-950/95 border border-cyber-cyan/40 shadow-[0_0_60px_rgba(0,240,255,0.25)] space-y-6 text-center"
        >
          {/* Main Visual Animation Badge */}
          <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-cyber-cyan/30"
            />

            {/* Central Glow Orb */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0.8, 1.1, 1] }}
              transition={{ duration: 0.6, times: [0, 0.7, 1] }}
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center border-2 shadow-2xl ${
                type === 'world_completed'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.5)]'
                  : type === 'level_up'
                  ? 'bg-cyber-purple/20 border-cyber-purple text-cyber-purple shadow-[0_0_40px_rgba(139,92,246,0.5)]'
                  : 'bg-cyber-emerald/20 border-cyber-emerald text-cyber-emerald shadow-[0_0_40px_rgba(16,185,129,0.5)]'
              }`}
            >
              {type === 'world_completed' && <Award className="w-10 h-10 sm:w-12 sm:h-12" />}
              {type === 'level_up' && <ArrowUpCircle className="w-10 h-10 sm:w-12 sm:h-12" />}
              {type === 'badge_unlocked' && <Shield className="w-10 h-10 sm:w-12 sm:h-12" />}
              {type === 'mission_completed' && (
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                  {/* Expanding Hyperspace Shockwave Ring */}
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0.9 }}
                    animate={{ scale: [0.7, 1.8], opacity: [0.8, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-full border border-cyber-cyan shadow-[0_0_15px_#00f0ff]"
                  />

                  {/* Celebratory Rocket Vessel */}
                  <motion.div
                    animate={{
                      y: [-5, 5, -5],
                      rotate: [-4, 4, -4],
                    }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative z-10 flex flex-col items-center"
                  >
                    <svg
                      viewBox="0 0 44 28"
                      className="w-12 h-12 -rotate-45 drop-shadow-[0_0_15px_#00f0ff]"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M 40 14 L 10 3 L 14 11 L 4 11 L 2 13 L 2 15 L 4 17 L 14 17 L 10 25 Z"
                        fill="url(#celebHullGrad)"
                        stroke="#00F0FF"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M 24 14 L 16 12 L 20 14 L 16 16 Z"
                        fill="#38BDF8"
                        stroke="#FFFFFF"
                        strokeWidth="1"
                      />
                      <circle cx="10" cy="3" r="1.5" fill="#00F0FF" />
                      <circle cx="10" cy="25" r="1.5" fill="#10B981" />
                      <defs>
                        <linearGradient id="celebHullGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#0F172A" />
                          <stop offset="60%" stopColor="#1E293B" />
                          <stop offset="100%" stopColor="#00F0FF" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Dual Ion Thrusters */}
                    <motion.div
                      animate={{
                        height: [8, 18, 10],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{ duration: 0.2, repeat: Infinity }}
                      className="w-3 rounded-full bg-gradient-to-b from-white via-cyber-cyan to-transparent shadow-[0_0_15px_#00f0ff] -mt-1"
                    />
                  </motion.div>
                </div>
              )}
            </motion.div>

            {/* Sparkle micro-accents */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute -top-1 -right-1 text-amber-300"
            >
              <Sparkles className="w-6 h-6" />
            </motion.div>
          </div>

          {/* Heading and Narrative */}
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-space-900 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {type === 'world_completed'
                  ? 'WORLD DISCOVERY ACHIEVED'
                  : type === 'level_up'
                  ? 'CADET RANK PROMOTION'
                  : type === 'badge_unlocked'
                  ? 'STARFLEET COMMENDATION'
                  : `MISSION 0${missionNumber || 1} CLEARED`}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight uppercase">
              {title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 font-mono max-w-md mx-auto leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Gamification Rewards Panel: XP, Stars, Unlocks */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-space-900/90 border border-white/10">
            {/* Stars */}
            <div className={`p-3 rounded-xl bg-space-950/80 border border-space-800 space-y-1 ${type === 'world_completed' ? 'col-span-2 sm:col-span-3' : ''}`}>
              <span className="text-[10px] font-mono text-slate-400 uppercase">
                {type === 'world_completed' ? 'Ignis Station Stars Mastered' : 'Clearance Rating'}
              </span>
              <div className="flex items-center justify-center flex-wrap gap-1 text-amber-400 py-0.5">
                {type === 'world_completed' ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.15 + i * 0.08, type: 'spring', stiffness: 300 }}
                    >
                      <Star className="w-5 h-5 fill-current text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.9)]" />
                    </motion.div>
                  ))
                ) : (
                  Array.from({ length: 3 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.15 }}
                    >
                      <Star
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          i < starsGained ? 'fill-current text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'text-slate-600'
                        }`}
                      />
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* XP Gained */}
            <div className="p-3 rounded-xl bg-space-950/80 border border-space-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Cadet Experience</span>
              <div className="flex items-center justify-center space-x-1.5 text-cyber-cyan font-mono font-bold text-sm sm:text-base">
                <Zap className="w-4 h-4 fill-current text-amber-400" />
                <span>+{animatedXp} XP</span>
              </div>
            </div>

            {/* Mission Unlocked / Level Up / World Unlocked */}
            <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-space-950/80 border border-space-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Sector Status</span>
              <div className="flex items-center justify-center space-x-1.5 text-cyber-emerald font-mono font-bold text-xs sm:text-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {type === 'world_completed'
                    ? 'Kryon Belt Unlocked'
                    : nextMissionUnlocked
                    ? `Mission 0${nextMissionUnlocked} Unlocked`
                    : newLevel
                    ? `Level ${newLevel} Reached`
                    : 'System Online'}
                </span>
              </div>
            </div>
          </div>

          {/* Ship Subsystem Online Banner */}
          {shipSystemUnlocked && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-cyber-cyan/15 via-cyber-emerald/15 to-cyber-cyan/10 border border-cyber-cyan/40 space-y-1.5 shadow-glow-cyan/20"
            >
              <div className="flex items-center justify-center space-x-2 text-xs font-mono font-bold text-cyber-cyan">
                <Zap className="w-4 h-4 text-cyber-cyan fill-current" />
                <span>STARSHIP SYSTEM 100% ONLINE: {shipSystemUnlocked}</span>
              </div>
              <p className="text-[11px] font-mono text-slate-300">
                Lights engaged. Energy conduits surging at optimal telemetry. Subsystem fully restored!
              </p>
            </motion.div>
          )}

          {/* Badge Unlocked Highlight Showcase */}
          {(badgeName || type === 'world_completed') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-cyber-cyan/15 to-purple-500/10 border border-amber-500/40 space-y-2 shadow-glow-amber/20"
            >
              <div className="flex items-center justify-center space-x-2 text-xs font-mono font-bold text-amber-300">
                <Award className="w-4 h-4 text-amber-400" />
                <span>BADGE UNLOCKED: {badgeName || 'FIRST LAUNCH'}</span>
              </div>
              <p className="text-[11px] font-mono text-slate-300">
                All 5 Ignis Station operations cleared! You have been awarded the official Starfleet <span className="text-amber-400 font-bold">FIRST LAUNCH</span> badge.
              </p>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyber-cyan/20 border border-cyber-cyan/40 text-cyber-cyan text-xs font-mono font-bold">
                <Rocket className="w-3.5 h-3.5" />
                <span>HYPERLANE UNLOCKED: KRYON BELT [COMING SOON]</span>
              </div>
            </motion.div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {onSecondaryAction && (
              <GlowButton
                variant="secondary"
                size="md"
                onClick={onSecondaryAction}
                className="w-full sm:w-auto"
              >
                {secondaryButtonText}
              </GlowButton>
            )}

            <GlowButton
              variant="primary"
              size="lg"
              onClick={onNextAction}
              className="w-full sm:w-auto"
              icon={<Rocket className="w-4 h-4 text-space-950" />}
            >
              {nextButtonText}
            </GlowButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

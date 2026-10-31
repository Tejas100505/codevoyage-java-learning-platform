import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket,
  Sparkles,
  Star,
  Zap,
  CheckCircle2,
  ArrowRight,
  Shield,
  Award,
  Globe2,
  ChevronRight
} from 'lucide-react';
import { GlowButton } from '../components/GlowButton';
import { soundManager } from '../services/soundService';

import ignisImg from '../assets/images/ignis_station.jpg';
import kryonImg from '../assets/images/kryon_belt.jpg';
import novaImg from '../assets/images/nova_sector.jpg';
import nebulaImg from '../assets/images/function_nebula.jpg';

const PLANET_IMAGES: Record<number, string> = {
  1: ignisImg,
  2: kryonImg,
  3: novaImg,
  4: nebulaImg,
};

const PLANET_TAGLINES: Record<number, string> = {
  1: 'Volcanic Asteroid Mining Outpost',
  2: 'Glacial Sub-Zero Asteroid Barrier',
  3: 'Plasma Flare & Electromagnetic Core',
  4: 'Interstellar Quantum Sensor Mesh',
};

export interface PlanetTransitionCinematicProps {
  isOpen: boolean;
  completedWorldName: string;
  completedWorldOrder?: number;
  totalMissionsInWorld?: number;
  xpEarned?: number;
  starsEarned?: number;
  nextWorldName?: string;
  nextWorldOrder?: number;
  nextWorldTagline?: string;
  nextWorldUnlocked?: boolean;
  onBeginNextSector: () => void;
  onClose?: () => void;
}

export const PlanetTransitionCinematic: React.FC<PlanetTransitionCinematicProps> = ({
  isOpen,
  completedWorldName,
  completedWorldOrder = 1,
  totalMissionsInWorld = 5,
  xpEarned = 100,
  starsEarned = 3,
  nextWorldName = 'KRYON BELT',
  nextWorldOrder = 2,
  nextWorldTagline,
  nextWorldUnlocked = true,
  onBeginNextSector,
  onClose,
}) => {
  // Cinematic Phases:
  // 'cleared' (Phase A) -> 'ignition' (Phase B) -> 'hyperspace' (Phase C) -> 'arrival' (Phase D)
  const [phase, setPhase] = useState<'cleared' | 'ignition' | 'hyperspace' | 'arrival'>('cleared');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setPhase('cleared');
      return;
    }

    // If reduced motion is requested, jump immediately to final Arrival / Unlocked state
    if (prefersReducedMotion) {
      setPhase('arrival');
      return;
    }

    soundManager.emit('planet_unlock');

    // ESC key listener for instant skip to final state
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Phase Timeline (Total ~3.8 seconds):
    // 0ms - 900ms: Phase A (Planet cleared summary)
    // 900ms - 1700ms: Phase B (Engine ignition & departure)
    // 1700ms - 2700ms: Phase C (Hyperspace warp corridor)
    // 2700ms+: Phase D (Arrival & New Planet Unlocked)
    const tIgnition = setTimeout(() => {
      setPhase('ignition');
      soundManager.emit('compiler_start');
    }, 950);

    const tHyperspace = setTimeout(() => {
      setPhase('hyperspace');
    }, 1800);

    const tArrival = setTimeout(() => {
      setPhase('arrival');
      soundManager.emit('star_award');
    }, 2800);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(tIgnition);
      clearTimeout(tHyperspace);
      clearTimeout(tArrival);
    };
  }, [isOpen, prefersReducedMotion]);

  const handleSkip = () => {
    setPhase('arrival');
  };

  if (!isOpen) return null;

  const currentPlanetImg = PLANET_IMAGES[completedWorldOrder] || ignisImg;
  const destinationPlanetImg = PLANET_IMAGES[nextWorldOrder] || kryonImg;
  const destinationTagline = nextWorldTagline || PLANET_TAGLINES[nextWorldOrder] || 'Next Exploration Sector';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/95 backdrop-blur-2xl overflow-hidden font-mono select-none">
        {/* Background Atmosphere & Warp Streaks */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Subtle Deep Space Radial Mesh */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyber-cyan/15 via-blue-900/10 to-transparent rounded-full blur-[90px]" />

          {/* Phase C: Hyperspace Warp Lines */}
          {phase === 'hyperspace' && (
            <div className="absolute inset-0 flex items-center justify-center">
              {[...Array(28)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    scaleX: 0,
                    x: (Math.random() - 0.5) * 800,
                    y: (Math.random() - 0.5) * 600,
                    opacity: 0,
                  }}
                  animate={{
                    scaleX: [0, 8, 16],
                    opacity: [0, 0.9, 0],
                  }}
                  transition={{
                    duration: 0.45,
                    repeat: Infinity,
                    delay: (i * 0.02) % 0.35,
                    ease: 'easeIn',
                  }}
                  className="absolute h-0.5 w-20 bg-gradient-to-r from-transparent via-cyber-cyan to-white rounded-full shadow-[0_0_14px_#00f0ff]"
                  style={{
                    top: `${10 + (i * 3.2) % 80}%`,
                    left: `${5 + (i * 3.7) % 90}%`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Cinematic Stage Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative z-10 w-full max-w-2xl p-6 sm:p-8 rounded-3xl bg-space-950/95 border border-cyber-cyan/50 shadow-[0_0_80px_rgba(0,240,255,0.25)] space-y-6 text-center"
        >
          {/* Top Control Bar with Skip Button */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs">
            <div className="flex items-center space-x-2 text-cyber-cyan font-bold tracking-wider uppercase">
              <Globe2 className="w-4 h-4 text-cyber-cyan" />
              <span>PLANETARY EXPEDITION LOG // SECTOR ADVANCE</span>
            </div>

            {phase !== 'arrival' && (
              <button
                onClick={handleSkip}
                className="text-[11px] text-slate-400 hover:text-white transition-colors underline flex items-center space-x-1"
              >
                <span>Skip Animation [ESC]</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Central Cinematic Animation Stage */}
          <div className="relative mx-auto w-full h-52 sm:h-60 flex items-center justify-center overflow-hidden rounded-2xl bg-space-900/50 border border-white/5">
            {/* ============================================================= */}
            {/* PHASES A & B: PLANET CLEARED & DEPARTURE                      */}
            {/* ============================================================= */}
            {(phase === 'cleared' || phase === 'ignition') && (
              <div className="relative w-full h-full flex items-center justify-around px-8">
                {/* Completed Planet Disc */}
                <motion.div
                  animate={
                    phase === 'ignition'
                      ? { scale: [1, 0.95], opacity: [1, 0.8] }
                      : { scale: 1, opacity: 1 }
                  }
                  transition={{ duration: 0.8 }}
                  className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-cyber-cyan shadow-[0_0_25px_rgba(0,240,255,0.4)]"
                >
                  <img
                    src={currentPlanetImg}
                    alt={completedWorldName}
                    className="w-full h-full object-cover scale-105"
                  />
                  <div className="absolute inset-0 bg-cyber-emerald/10 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-cyber-emerald drop-shadow-md" />
                  </div>
                </motion.div>

                {/* Starship Departing */}
                <motion.div
                  initial={{ x: -20, y: 0 }}
                  animate={
                    phase === 'ignition'
                      ? { x: [0, 40, 180], y: [0, -10, -30], scale: [1, 1.05, 0.8] }
                      : { x: 0, y: [-3, 3, -3] }
                  }
                  transition={
                    phase === 'ignition'
                      ? { duration: 0.85, ease: 'easeIn' }
                      : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                  }
                  className="relative flex flex-col items-center"
                >
                  {/* Detailed Starship Silhouette */}
                  <div className="relative w-16 h-12 sm:w-20 sm:h-14 flex items-center justify-center">
                    <svg
                      viewBox="0 0 48 32"
                      className="w-full h-full drop-shadow-[0_0_18px_rgba(0,240,255,0.85)]"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M 44 16 L 24 6 L 10 10 L 4 13 L 2 15 L 2 17 L 4 19 L 10 22 L 24 26 Z"
                        fill="url(#transHullGrad)"
                        stroke="#00F0FF"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      <path d="M 26 6 L 16 2 L 14 10 Z" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
                      <path d="M 26 26 L 16 30 L 14 22 Z" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
                      <path d="M 38 16 L 28 13 L 24 16 L 28 19 Z" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1" />
                      <circle cx="20" cy="16" r="2" fill="#10B981" />
                      <defs>
                        <linearGradient id="transHullGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#0F172A" />
                          <stop offset="60%" stopColor="#1E293B" />
                          <stop offset="100%" stopColor="#00F0FF" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Dual Active Thruster Exhaust Flame */}
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 flex flex-col space-y-1">
                      <motion.div
                        animate={{
                          width: phase === 'ignition' ? [8, 22, 16] : [6, 11, 7],
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{ duration: 0.15, repeat: Infinity }}
                        className="h-1.5 rounded-full bg-gradient-to-l from-white via-cyber-cyan to-transparent shadow-[0_0_12px_#00f0ff]"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* ============================================================= */}
            {/* PHASE C: HYPERSPACE ACCELERATION                              */}
            {/* ============================================================= */}
            {phase === 'hyperspace' && (
              <div className="relative w-full h-full flex flex-col items-center justify-center space-y-3">
                <motion.div
                  animate={{ scale: [1, 1.15, 1], y: [-2, 2, -2] }}
                  transition={{ duration: 0.4, repeat: Infinity }}
                  className="relative z-10 w-24 h-16 flex items-center justify-center"
                >
                  <svg
                    viewBox="0 0 48 32"
                    className="w-full h-full drop-shadow-[0_0_24px_rgba(0,240,255,1)]"
                    fill="none"
                  >
                    <path
                      d="M 44 16 L 24 6 L 10 10 L 4 13 L 2 15 L 2 17 L 4 19 L 10 22 L 24 26 Z"
                      fill="#00F0FF"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                  </svg>
                  {/* Warp Tail Streak */}
                  <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-24 h-1 bg-gradient-to-l from-white via-cyber-cyan to-transparent rounded-full shadow-[0_0_20px_#00f0ff]" />
                </motion.div>

                <div className="text-xs font-bold text-cyber-cyan tracking-widest uppercase animate-pulse">
                  Traversing Hyperspace Corridor...
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* PHASE D: ARRIVAL AT DESTINATION PLANET                         */}
            {/* ============================================================= */}
            {phase === 'arrival' && (
              <div className="relative w-full h-full flex items-center justify-center space-x-6 px-6">
                {/* Destination Planet (Hero Focus) */}
                <motion.div
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 240 }}
                  className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-cyber-cyan shadow-[0_0_40px_rgba(0,240,255,0.6)]"
                >
                  <img
                    src={destinationPlanetImg}
                    alt={nextWorldName}
                    className="w-full h-full object-cover scale-105"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-cyber-emerald/90 text-space-950 font-bold text-[9px] shadow-sm">
                    NEW SECTOR
                  </div>
                </motion.div>

                {/* Spacecraft In Orbital Insertion */}
                <motion.div
                  initial={{ x: 60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring', damping: 22 }}
                  className="relative flex flex-col items-center"
                >
                  <div className="w-14 h-10 sm:w-16 sm:h-12 flex items-center justify-center">
                    <svg
                      viewBox="0 0 48 32"
                      className="w-full h-full drop-shadow-[0_0_12px_#00f0ff]"
                      fill="none"
                    >
                      <path
                        d="M 44 16 L 24 6 L 10 10 L 4 13 L 2 15 L 2 17 L 4 19 L 10 22 L 24 26 Z"
                        fill="#1E293B"
                        stroke="#00F0FF"
                        strokeWidth="1.4"
                      />
                      <circle cx="20" cy="16" r="1.5" fill="#10B981" />
                    </svg>
                  </div>
                  <span className="text-[9px] font-bold text-cyber-emerald mt-1">
                    ORBITAL INSERTION
                  </span>
                </motion.div>
              </div>
            )}
          </div>

          {/* Narrative & Milestone Text */}
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-space-900 border border-cyber-cyan/30 text-cyber-cyan text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {phase === 'arrival'
                  ? 'DESTINATION REACHED // NEW WORLD UNLOCKED'
                  : 'PLANET SECTOR MASTERED'}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              {phase === 'arrival' ? `Welcome to ${nextWorldName}` : `${completedWorldName} Cleared`}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              {phase === 'arrival'
                ? `Hyperspace vector resolved. ${destinationTagline}. Java 21 advanced curriculum directives unlocked.`
                : `All ${totalMissionsInWorld} mission directives successfully calibrated. Preparing starship for hyperspace jump.`}
            </p>
          </div>

          {/* Actual Rewards Summary Bar */}
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-space-900/80 border border-white/10 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 block uppercase">Missions Cleared</span>
              <span className="font-bold text-white text-sm">
                {totalMissionsInWorld} / {totalMissionsInWorld}
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 block uppercase">Experience</span>
              <span className="font-bold text-amber-400 text-sm flex items-center justify-center space-x-1">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>+{xpEarned} XP</span>
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 block uppercase">Sector Rating</span>
              <div className="flex items-center justify-center space-x-1 text-amber-400 py-0.5">
                {[...Array(3)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < starsEarned ? 'fill-current text-amber-400' : 'text-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex items-center justify-center">
            {phase === 'arrival' ? (
              <GlowButton
                variant="primary"
                size="lg"
                onClick={onBeginNextSector}
                icon={<ArrowRight className="w-4 h-4 text-space-950" />}
                className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold font-mono tracking-wider shadow-glow-cyan"
              >
                BEGIN NEXT SECTOR ({nextWorldName})
              </GlowButton>
            ) : (
              <button
                onClick={handleSkip}
                className="px-6 py-2 rounded-xl bg-space-850 hover:bg-space-800 border border-white/10 text-xs text-white font-bold transition-colors"
              >
                Skip Transition
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};


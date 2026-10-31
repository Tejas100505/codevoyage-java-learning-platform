import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket,
  Shield,
  Zap,
  Terminal,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Star,
  Award,
  Lock,
  Unlock,
  Radio,
  Cpu,
  Check
} from 'lucide-react';
import { GlowButton } from '../components/GlowButton';
import { soundManager } from '../services/soundService';

/* ==========================================================================
   1. MISSION INTRO // BRIEFING CINEMATIC OVERLAY
   ========================================================================== */
export interface MissionIntroProps {
  isOpen: boolean;
  missionNumber: number;
  missionTitle: string;
  worldName: string;
  locationName: string;
  objective: string;
  javaConcept: string;
  xpReward: number;
  starsReward?: number;
  locationImage?: string;
  isBossMission?: boolean;
  onStartMission: () => void;
  onSkip?: () => void;
}

export const MissionIntroCinematic: React.FC<MissionIntroProps> = ({
  isOpen,
  missionNumber,
  missionTitle,
  worldName,
  locationName,
  objective,
  javaConcept,
  xpReward,
  starsReward = 3,
  locationImage,
  isBossMission = false,
  onStartMission,
  onSkip,
}) => {
  const [hasVisitedBefore, setHasVisitedBefore] = useState<boolean>(false);

  useEffect(() => {
    try {
      const key = `seen_briefing_m${missionNumber}`;
      if (localStorage.getItem(key)) {
        setHasVisitedBefore(true);
      }
    } catch {
      // Non-blocking
    }
  }, [missionNumber]);

  const handleStart = () => {
    try {
      localStorage.setItem(`seen_briefing_m${missionNumber}`, 'true');
    } catch {
      // Non-blocking
    }
    onStartMission();
  };

  const handleSkip = () => {
    try {
      localStorage.setItem(`seen_briefing_m${missionNumber}`, 'true');
    } catch {
      // Non-blocking
    }
    if (onSkip) {
      onSkip();
    } else {
      onStartMission();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/90 backdrop-blur-2xl overflow-y-auto">
        {/* Hyperspace Grid & Particle Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-cyber-cyan/15 via-cyber-purple/20 to-amber-500/10 rounded-full blur-[120px] animate-pulse" />
          {/* Scanning radar grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f0ff08_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff08_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative z-10 w-full max-w-2xl rounded-3xl bg-space-950/95 border border-cyber-cyan/50 shadow-[0_0_80px_rgba(0,240,255,0.25)] p-6 sm:p-8 space-y-6 overflow-hidden"
        >
          {/* Location Scan Header with Camera Zoom Effect */}
          <div className="relative h-44 sm:h-52 rounded-2xl overflow-hidden border border-cyber-cyan/30">
            {locationImage ? (
              <motion.img
                src={locationImage}
                alt={locationName}
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                transition={{ duration: 4, ease: 'easeOut' }}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-space-900 to-space-950" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-space-950/60 to-transparent" />

            {/* Target Reticle Overlay */}
            <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-widest flex items-center space-x-1.5 ${
                  isBossMission
                    ? 'bg-rose-950/90 border border-rose-500/70 text-rose-300'
                    : 'bg-space-950/80 border border-cyber-cyan/40 text-cyber-cyan'
                }`}>
                  <span className={`w-2 h-2 rounded-full animate-ping ${isBossMission ? 'bg-rose-500' : 'bg-cyber-cyan'}`} />
                  <span>{isBossMission ? 'SECTOR BOSS THREAT' : 'TARGET LOCK'} // {locationName}</span>
                </span>
                <span className="text-[10px] font-mono text-amber-400 bg-space-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                  SECTOR: {worldName}
                </span>
              </div>

              {/* Title inside header banner */}
              <div className="space-y-1">
                <span className={`text-xs font-mono font-bold tracking-wider uppercase ${
                  isBossMission ? 'text-rose-400 animate-pulse' : 'text-cyber-cyan'
                }`}>
                  {isBossMission ? 'CRITICAL BOSS ENCOUNTER' : `MISSION 0${missionNumber} BRIEFING`}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight uppercase">
                  {missionTitle}
                </h2>
              </div>
            </div>
          </div>

          {/* Mission Telemetry: Objective, Concept, Reward */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Java Concept */}
            <div className="p-3.5 rounded-2xl bg-space-900/80 border border-cyber-cyan/30 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                JAVA CONCEPT
              </span>
              <div className="flex items-center space-x-1.5 text-cyber-cyan font-mono font-bold text-sm">
                <Cpu className="w-4 h-4 shrink-0 text-cyber-cyan" />
                <span className="truncate">{javaConcept}</span>
              </div>
            </div>

            {/* Objective */}
            <div className="p-3.5 rounded-2xl bg-space-900/80 border border-space-800 space-y-1 sm:col-span-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                PRIMARY DIRECTIVE
              </span>
              <p className="text-xs text-slate-200 font-mono line-clamp-2 leading-relaxed">
                {objective}
              </p>
            </div>

            {/* Reward */}
            <div className="p-3.5 rounded-2xl bg-space-900/80 border border-amber-500/30 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                MISSION REWARD
              </span>
              <div className="flex items-center space-x-2 text-amber-400 font-mono font-bold text-sm">
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4 fill-current" />
                  <span>+{xpReward} XP</span>
                </div>
                <div className="flex items-center text-amber-300 text-xs">
                  <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                  <span>x{starsReward}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs: Engage Mission or Quick Skip */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-space-800">
            {hasVisitedBefore ? (
              <button
                onClick={handleSkip}
                className="text-xs font-mono text-slate-400 hover:text-cyber-cyan transition-colors underline underline-offset-4"
              >
                SKIP BRIEFING (PREVIOUSLY REVIEWED)
              </button>
            ) : (
              <div className="text-[11px] font-mono text-slate-500">
                STARFLEET DIRECTIVE // ALL SYSTEMS ARMED
              </div>
            )}

            <div className="flex items-center space-x-3 ml-auto">
              <GlowButton
                variant="primary"
                size="md"
                onClick={handleStart}
                icon={<Rocket className="w-4 h-4 text-space-950" />}
              >
                ENGAGE MISSION
              </GlowButton>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};


/* ==========================================================================
   2. CODE RUNNING & TESTING CINEMATIC HUD
   ========================================================================== */
export interface CodeRunningCinematicProps {
  isExecuting: boolean;
  totalTests?: number;
  onFastForward?: () => void;
}

export const CodeRunningCinematic: React.FC<CodeRunningCinematicProps> = ({
  isExecuting,
  totalTests = 3,
  onFastForward,
}) => {
  const [stepIndex, setStepIndex] = useState<number>(0);
  // Step 0: CONNECTING TO SHIP COMPUTER...
  // Step 1: COMPILING JAVA 21...
  // Step 2: RUNNING TESTS...
  // Step 3: Test cases ticking

  useEffect(() => {
    if (!isExecuting) {
      setStepIndex(0);
      return;
    }

    soundManager.emit('compiler_start');

    const t1 = setTimeout(() => {
      setStepIndex(1);
    }, 280);

    const t2 = setTimeout(() => {
      setStepIndex(2);
      soundManager.emit('test_passed');
    }, 600);

    const t3 = setTimeout(() => {
      setStepIndex(3);
      soundManager.emit('test_passed');
    }, 900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isExecuting]);

  if (!isExecuting) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg p-6 rounded-3xl bg-space-950 border border-cyber-cyan/50 shadow-[0_0_50px_rgba(0,240,255,0.3)] space-y-5 font-mono"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-space-800 pb-3">
            <div className="flex items-center space-x-2 text-cyber-cyan text-xs font-bold tracking-wider uppercase">
              <Terminal className="w-4 h-4 animate-pulse" />
              <span>STARSHIP FLIGHT COMPILER // LIVE TELEMETRY</span>
            </div>
            {onFastForward && (
              <button
                onClick={onFastForward}
                className="text-[11px] text-slate-400 hover:text-white transition-colors"
              >
                FAST-FORWARD &rarr;
              </button>
            )}
          </div>

          {/* Stepped Sequence Console */}
          <div className="space-y-3 bg-space-900/90 rounded-2xl p-4 border border-space-800">
            {/* Step 1: Connecting */}
            <div className="flex items-center space-x-3 text-xs">
              {stepIndex >= 1 ? (
                <Check className="w-4 h-4 text-cyber-emerald shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-cyber-cyan border-t-transparent animate-spin shrink-0" />
              )}
              <span className={stepIndex >= 1 ? 'text-cyber-emerald font-bold' : 'text-cyber-cyan font-bold animate-pulse'}>
                CONNECTING TO SHIP COMPUTER...
              </span>
            </div>

            {/* Step 2: Compiling */}
            <div className="flex items-center space-x-3 text-xs">
              {stepIndex >= 2 ? (
                <Check className="w-4 h-4 text-cyber-emerald shrink-0" />
              ) : stepIndex === 1 ? (
                <div className="w-4 h-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
              )}
              <span
                className={
                  stepIndex >= 2
                    ? 'text-cyber-emerald font-bold'
                    : stepIndex === 1
                    ? 'text-amber-400 font-bold animate-pulse'
                    : 'text-slate-600'
                }
              >
                COMPILING JAVA 21 SOURCE...
              </span>
            </div>

            {/* Step 3: Running Tests */}
            <div className="flex items-center space-x-3 text-xs">
              {stepIndex >= 3 ? (
                <Check className="w-4 h-4 text-cyber-emerald shrink-0" />
              ) : stepIndex === 2 ? (
                <div className="w-4 h-4 rounded-full border-2 border-cyber-purple border-t-transparent animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
              )}
              <span
                className={
                  stepIndex >= 3
                    ? 'text-cyber-emerald font-bold'
                    : stepIndex === 2
                    ? 'text-cyber-purple font-bold animate-pulse'
                    : 'text-slate-600'
                }
              >
                RUNNING TESTS...
              </span>
            </div>

            {/* Sub-test tick animation */}
            {stepIndex >= 2 && (
              <div className="pt-2 pl-7 space-y-1.5 border-t border-space-800 text-[11px]">
                <div className="flex items-center space-x-2 text-cyber-emerald">
                  <span>✓</span>
                  <span>Test 1: Output Syntax & Structure</span>
                </div>
                <div className="flex items-center space-x-2 text-cyber-emerald">
                  <span>✓</span>
                  <span>Test 2: Standard Telemetry Parameter</span>
                </div>
                {totalTests >= 3 && (
                  <div className="flex items-center space-x-2 text-amber-400">
                    <span className="animate-spin inline-block">○</span>
                    <span>Test 3: Hidden Starfleet Validation Matrix...</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Micro animated progress bar */}
          <div className="w-full bg-space-900 rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-emerald"
              initial={{ width: '10%' }}
              animate={{ width: stepIndex === 0 ? '25%' : stepIndex === 1 ? '60%' : '95%' }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};


/* ==========================================================================
   3. PLANET UNLOCK & HYPERSPACE JUMP CINEMATIC
   ========================================================================== */
export interface PlanetUnlockCinematicProps {
  isOpen: boolean;
  unlockedWorldName: string;
  unlockedWorldNumber: number;
  unlockedWorldTagline?: string;
  onProceed: () => void;
  onSkip?: () => void;
}

export const PlanetUnlockCinematic: React.FC<PlanetUnlockCinematicProps> = ({
  isOpen,
  unlockedWorldName,
  unlockedWorldNumber,
  unlockedWorldTagline = 'Glacial Sub-Zero Asteroid Barrier',
  onProceed,
  onSkip,
}) => {
  const [phase, setPhase] = useState<'launch' | 'warp' | 'arrival' | 'unlocked'>('launch');

  useEffect(() => {
    if (!isOpen) {
      setPhase('launch');
      return;
    }

    soundManager.emit('planet_unlock');

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (onSkip) onSkip();
        else onProceed();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Fast-paced sequenced transitions (under 2.5s total or skippable instantly)
    const t1 = setTimeout(() => setPhase('warp'), 800);
    const t2 = setTimeout(() => setPhase('arrival'), 1600);
    const t3 = setTimeout(() => {
      setPhase('unlocked');
      soundManager.emit('star_award');
    }, 2400);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen, onProceed, onSkip]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/95 backdrop-blur-2xl">
        {/* Starfield warp speed lines during 'warp' phase */}
        {phase === 'warp' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyber-cyan/20 via-transparent to-space-950 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              {[...Array(24)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 bg-gradient-to-t from-transparent via-cyber-cyan to-white rounded-full opacity-80"
                  initial={{ height: 10, y: -20, rotate: i * 15 }}
                  animate={{ height: 400, y: 150, opacity: [0, 1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: (i % 6) * 0.1 }}
                />
              ))}
            </div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative z-10 w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-space-950/95 border border-cyber-cyan/50 shadow-[0_0_80px_rgba(0,240,255,0.3)] text-center space-y-6"
        >
          {/* Top Skip Button */}
          <div className="flex justify-end">
            <button
              onClick={onSkip || onProceed}
              className="text-xs font-mono text-slate-400 hover:text-cyber-cyan transition-colors"
            >
              SKIP TRANSITION [ESC]
            </button>
          </div>

          {/* Central Animated Hologram Container */}
          <div className="relative mx-auto w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center">
            {/* Ambient rotating rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border border-dashed border-cyber-cyan/40"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-3 rounded-full border border-dashed border-amber-400/30"
            />

            {/* Phase 1: Planetary Launch Sequence (Ship lifting off from planet) */}
            {phase === 'launch' && (
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Surface line */}
                <div className="absolute bottom-2 w-32 h-1 bg-amber-500/40 rounded-full" />
                <motion.div
                  initial={{ y: 25, scale: 0.85, opacity: 0 }}
                  animate={{ y: [-10, -45], scale: [0.9, 1.15], opacity: [0.8, 1] }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                  className="w-24 h-24 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.6)]"
                >
                  <Rocket className="w-12 h-12 -rotate-45" />
                </motion.div>
                {/* Engine exhaust particle sparks */}
                <motion.div
                  animate={{ opacity: [1, 0], scale: [0.6, 1.4], y: [10, 30] }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                  className="absolute bottom-6 w-3 h-3 bg-amber-400 rounded-full blur-xs"
                />
              </div>
            )}

            {/* Phase 2: Hyperspace Travel (Ship in deep space warp) */}
            {phase === 'warp' && (
              <div className="relative w-full h-full flex items-center justify-center">
                <motion.div
                  animate={{ scale: [0.95, 1.1, 0.95], rotate: [0, 4, -4, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="w-24 h-24 rounded-2xl bg-cyber-cyan/25 border-2 border-cyber-cyan flex items-center justify-center text-cyber-cyan shadow-[0_0_60px_rgba(0,240,255,0.7)]"
                >
                  <Sparkles className="w-12 h-12 animate-pulse" />
                </motion.div>
              </div>
            )}

            {/* Phase 3 & 4: Arrival & New World Orbital Insertion */}
            {(phase === 'arrival' || phase === 'unlocked') && (
              <div className="relative w-full h-full flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', damping: 18, stiffness: 260 }}
                  className={`w-24 h-24 rounded-2xl border-2 flex items-center justify-center shadow-2xl transition-all duration-700 ${
                    phase === 'unlocked'
                      ? 'bg-cyber-emerald/20 border-cyber-emerald text-cyber-emerald shadow-[0_0_50px_rgba(16,185,129,0.6)]'
                      : 'bg-space-900 border-cyber-cyan/50 text-cyber-cyan shadow-[0_0_30px_rgba(0,240,255,0.4)]'
                  }`}
                >
                  {phase === 'unlocked' ? (
                    <motion.div
                      initial={{ scale: 0.6, rotate: -15 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', damping: 14 }}
                    >
                      <Unlock className="w-12 h-12" />
                    </motion.div>
                  ) : (
                    <Rocket className="w-12 h-12 rotate-45 animate-pulse" />
                  )}
                </motion.div>
              </div>
            )}
          </div>

          {/* Dynamic Status Text based on Sequence */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-cyber-cyan uppercase tracking-widest block">
              {phase === 'launch' && 'STAGE 1: PLANETARY LAUNCH — IGNIS STATION DEPARTURE'}
              {phase === 'warp' && 'STAGE 2: TRAVEL STATE — HYPERSPACE CORRIDOR TRAVERSAL'}
              {phase === 'arrival' && `STAGE 3: ORBITAL ARRIVAL — ENTERING ${unlockedWorldName.toUpperCase()}...`}
              {phase === 'unlocked' && `STAGE 4: PLANET UNLOCKED — SECTOR 0${unlockedWorldNumber} ACCESSIBLE`}
            </span>

            <h3 className="text-3xl font-black text-white font-mono uppercase tracking-tight">
              {phase === 'unlocked' ? unlockedWorldName : 'EXPEDITION UNDERWAY'}
            </h3>

            <p className="text-sm font-mono text-slate-300 max-w-md mx-auto">
              {phase === 'unlocked'
                ? `Navigation coordinates resolved. ${unlockedWorldTagline}. All Java 21 telemetry channels open.`
                : 'Starship thrusters operating at maximum capacity. Real-time sub-space orbital insertion in progress.'}
            </p>
          </div>

          {/* Proceed Button */}
          <div className="pt-4 border-t border-space-800">
            <GlowButton
              variant="primary"
              size="lg"
              onClick={onProceed}
              icon={<ArrowRight className="w-4 h-4 text-space-950" />}
              className="w-full sm:w-auto"
            >
              EXPLORE {unlockedWorldName.toUpperCase()}
            </GlowButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

/* ==========================================================================
   4. BOSS VICTORY & REACTOR STABILIZATION CINEMATIC
   ========================================================================== */
export interface BossDefeatedCinematicProps {
  isOpen: boolean;
  bossTitle?: string;
  worldName?: string;
  xpAwarded?: number;
  starsEarned?: number;
  achievementTitle?: string;
  onProceed: () => void;
}

export const BossDefeatedCinematic: React.FC<BossDefeatedCinematicProps> = ({
  isOpen,
  bossTitle = 'THE REACTOR FAILURE',
  worldName = 'Ignis Station',
  xpAwarded = 300,
  starsEarned = 3,
  achievementTitle = 'WORLD CONQUEROR',
  onProceed,
}) => {
  const [powerLevel, setPowerLevel] = useState<number>(18);
  const [phase, setPhase] = useState<'stabilizing' | 'restored' | 'victory'>('stabilizing');

  useEffect(() => {
    if (!isOpen) {
      setPowerLevel(18);
      setPhase('stabilizing');
      return;
    }

    soundManager.emit('boss_breach');

    // Power surge animation: 18% -> 100%
    const interval = setInterval(() => {
      setPowerLevel((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setPhase('restored');
          soundManager.emit('boss_victory');
          setTimeout(() => {
            setPhase('victory');
            soundManager.emit('star_award');
          }, 800);
          return 100;
        }
        return Math.min(100, prev + 3);
      });
    }, 35);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/95 backdrop-blur-2xl">
        {/* Pulsing reactor aura */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: phase === 'restored' || phase === 'victory' ? [0.3, 0.7, 0.3] : [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className={`w-[600px] h-[600px] rounded-full blur-[140px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
              powerLevel >= 100
                ? 'bg-cyber-cyan/30'
                : 'bg-rose-500/30'
            }`}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative z-10 w-full max-w-xl p-8 rounded-3xl bg-space-950/95 border-2 border-cyber-cyan shadow-[0_0_90px_rgba(0,240,255,0.4)] text-center space-y-6"
        >
          {/* Top Status */}
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyber-cyan/20 border border-cyber-cyan/50 text-cyber-cyan text-xs font-mono font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BOSS OVERRIDDEN // REAL JAVA SYNTHESIS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-mono uppercase tracking-tight">
              {bossTitle} DEFEATED
            </h2>
            <p className="text-xs font-mono text-slate-400">
              {worldName.toUpperCase()} // SECTOR THREAT RESOLVED
            </p>
          </div>

          {/* Core Power Surge Meter: 18% -> 100% */}
          <div className="p-6 rounded-2xl bg-space-900/90 border border-space-800 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">IGNIS CORE POWER LEVEL</span>
              <span
                className={`font-black text-lg ${
                  powerLevel >= 100 ? 'text-cyber-cyan' : 'text-rose-400'
                }`}
              >
                {powerLevel}%
              </span>
            </div>

            <div className="h-5 w-full bg-space-950 rounded-full overflow-hidden p-1 border border-space-800">
              <motion.div
                className={`h-full rounded-full transition-all duration-75 ${
                  powerLevel >= 100
                    ? 'bg-gradient-to-r from-cyber-cyan via-blue-500 to-cyber-emerald shadow-[0_0_20px_rgba(0,240,255,0.8)]'
                    : 'bg-gradient-to-r from-rose-600 to-amber-500'
                }`}
                style={{ width: `${powerLevel}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-rose-400">FAILURE THRESHOLD: 18%</span>
              <span className="text-cyber-emerald font-bold">
                {powerLevel >= 100 ? 'REACTOR STABLE: 100%' : 'STABILIZING CONDUITS...'}
              </span>
            </div>
          </div>

          {/* Reward Fanfare (XP, Stars, Achievement) */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-space-900/80 border border-amber-500/40 text-center space-y-1">
              <div className="flex items-center justify-center text-amber-400">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div className="font-mono text-xs font-bold text-amber-300">+{xpAwarded} XP</div>
              <div className="text-[10px] font-mono text-slate-400">BOSS REWARD</div>
            </div>

            <div className="p-3 rounded-xl bg-space-900/80 border border-amber-400/40 text-center space-y-1">
              <div className="flex items-center justify-center space-x-0.5 text-amber-400">
                {[...Array(3)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < starsEarned ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                    }`}
                  />
                ))}
              </div>
              <div className="font-mono text-xs font-bold text-white">3-STAR</div>
              <div className="text-[10px] font-mono text-slate-400">EVALUATION</div>
            </div>

            <div className="p-3 rounded-xl bg-space-900/80 border border-cyber-purple/40 text-center space-y-1">
              <div className="flex items-center justify-center text-cyber-purple">
                <Award className="w-5 h-5" />
              </div>
              <div className="font-mono text-[11px] font-bold text-cyber-purple truncate">
                {achievementTitle}
              </div>
              <div className="text-[10px] font-mono text-slate-400">ACHIEVEMENT</div>
            </div>
          </div>

          {/* Quote */}
          <p className="text-xs font-mono text-slate-300 italic max-w-md mx-auto">
            "Every concept mastered—variables, input, operators, and conditions—synced perfectly. The core is saved."
          </p>

          {/* Next World Unlock Action */}
          <div className="pt-2 border-t border-space-800">
            <GlowButton
              variant="primary"
              size="lg"
              onClick={onProceed}
              icon={<Rocket className="w-4 h-4 text-space-950" />}
              className="w-full justify-center"
            >
              ENGAGE HYPERSPACE & UNLOCK NEXT WORLD
            </GlowButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};


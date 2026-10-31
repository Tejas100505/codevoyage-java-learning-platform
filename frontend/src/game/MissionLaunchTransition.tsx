import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Zap, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { soundManager } from '../services/soundService';

export interface MissionLaunchTransitionProps {
  isLaunching: boolean;
  missionOrder: number;
  missionTitle: string;
  worldName?: string;
  javaConcept?: string;
  onLaunchComplete: () => void;
  onCancel?: () => void;
}

export const MissionLaunchTransition: React.FC<MissionLaunchTransitionProps> = ({
  isLaunching,
  missionOrder,
  missionTitle,
  worldName = 'Ignis Station',
  javaConcept = 'Java Basics',
  onLaunchComplete,
  onCancel,
}) => {
  const [phase, setPhase] = useState<'ignite' | 'warp' | 'done'>('ignite');

  useEffect(() => {
    if (!isLaunching) {
      setPhase('ignite');
      return;
    }

    // Check reduced motion preference for instant transition
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      onLaunchComplete();
      return;
    }

    soundManager.emit('compiler_start');

    // Quick ESC listener for instant skip
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onLaunchComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Fast 850ms total sequence
    const tWarp = setTimeout(() => {
      setPhase('warp');
    }, 320);

    const tComplete = setTimeout(() => {
      setPhase('done');
      onLaunchComplete();
    }, 850);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(tWarp);
      clearTimeout(tComplete);
    };
  }, [isLaunching, onLaunchComplete]);

  if (!isLaunching) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/90 backdrop-blur-xl overflow-hidden font-mono select-none"
      >
        {/* Background Hyperspace Warp Lines */}
        <div className="absolute inset-0 pointer-events-none">
          {phase === 'warp' && (
            <>
              {[...Array(24)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    scaleX: 0,
                    x: (Math.random() - 0.5) * 800,
                    y: (Math.random() - 0.5) * 600,
                    opacity: 0,
                  }}
                  animate={{
                    scaleX: [0, 8, 14],
                    opacity: [0, 0.9, 0],
                  }}
                  transition={{
                    duration: 0.45,
                    repeat: Infinity,
                    delay: (i * 0.02) % 0.3,
                    ease: 'easeIn',
                  }}
                  className="absolute h-0.5 w-16 bg-gradient-to-r from-transparent via-cyber-cyan to-white rounded-full shadow-[0_0_12px_#00f0ff]"
                  style={{
                    top: `${15 + (i * 3.5) % 70}%`,
                    left: `${10 + (i * 4) % 80}%`,
                  }}
                />
              ))}
            </>
          )}

          {/* Radial Warp Tunnel Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyber-cyan/15 via-blue-900/10 to-transparent rounded-full blur-[80px]" />
        </div>

        {/* Central Launch Pod / Spaceship Animation */}
        <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-lg">
          {/* Animated Spaceship Rocket Model */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* Warp Energy Rings */}
            <motion.div
              animate={{
                scale: phase === 'warp' ? [1, 2.4] : [0.8, 1.2],
                opacity: phase === 'warp' ? [0.8, 0] : [0.5, 0.2],
              }}
              transition={{
                duration: phase === 'warp' ? 0.35 : 0.8,
                repeat: Infinity,
                ease: 'easeOut',
              }}
              className="absolute inset-0 rounded-full border-2 border-cyber-cyan shadow-[0_0_20px_#00f0ff]"
            />

            {/* Ship Departure Motion */}
            <motion.div
              animate={
                phase === 'warp'
                  ? { y: [0, -40, -180], scale: [1, 1.15, 0.2], opacity: [1, 1, 0] }
                  : { y: [0, -6, 0], scale: [1, 1.05, 1] }
              }
              transition={{
                duration: phase === 'warp' ? 0.5 : 1,
                ease: phase === 'warp' ? 'easeIn' : 'easeInOut',
              }}
              className="relative z-10"
            >
              {/* Starship Vector Artwork */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center -rotate-45">
                <svg
                  viewBox="0 0 44 28"
                  className="w-full h-full drop-shadow-[0_0_20px_rgba(0,240,255,0.9)]"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M 40 14 L 10 3 L 14 11 L 4 11 L 2 13 L 2 15 L 4 17 L 14 17 L 10 25 Z"
                    fill="url(#launchHullGrad)"
                    stroke="#00F0FF"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 24 14 L 16 12 L 20 14 L 16 16 Z"
                    fill="#FFFFFF"
                    stroke="#38BDF8"
                    strokeWidth="1"
                  />
                  <circle cx="10" cy="3" r="1.5" fill="#00F0FF" />
                  <circle cx="10" cy="25" r="1.5" fill="#F43F5E" />
                  <defs>
                    <linearGradient id="launchHullGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0B132B" />
                      <stop offset="60%" stopColor="#1C2541" />
                      <stop offset="100%" stopColor="#00F0FF" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Hyper Ion Thruster Jet Flame */}
                <motion.div
                  animate={{
                    height: phase === 'warp' ? [20, 48, 30] : [12, 22, 14],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{ duration: 0.15, repeat: Infinity }}
                  className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-3 rounded-full bg-gradient-to-b from-white via-cyber-cyan to-transparent shadow-[0_0_24px_#00f0ff]"
                />
              </div>
            </motion.div>
          </div>

          {/* Launch Status Readout */}
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-space-900 border border-cyber-cyan/30 text-cyber-cyan text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>
                {phase === 'warp' ? 'ENGAGING HYPERSPACE JUMP' : 'WARP CLEARANCE VERIFIED'}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
              Launching Mission 0{missionOrder}
            </h3>

            <p className="text-sm font-bold text-cyber-cyan">{missionTitle}</p>

            <p className="text-xs text-slate-400">
              {worldName} &bull; <span className="text-amber-400">{javaConcept}</span>
            </p>
          </div>

          {/* Instant Skip CTA */}
          <button
            onClick={onLaunchComplete}
            className="text-[11px] text-slate-500 hover:text-white transition-colors underline pt-2"
          >
            Skip Launch Sequence (ESC)
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};


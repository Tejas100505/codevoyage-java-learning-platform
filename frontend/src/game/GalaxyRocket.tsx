import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, Anchor } from 'lucide-react';

interface GalaxyRocketProps {
  currentSectorOrder?: number;
  activeWorldSlug?: string;
  onRocketClick?: () => void;
}

export const GalaxyRocket: React.FC<GalaxyRocketProps> = ({
  currentSectorOrder = 1,
  activeWorldSlug = 'ignis-station',
  onRocketClick,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Pre-calculated orbital docking coordinates near each sector planet
  // Kept subtly docked near the planet edge without obscuring planet discs or labels
  const sectorDockCoordinates: Record<
    number,
    { x: number; y: number; angle: number; sectorName: string }
  > = {
    1: { x: 26.5, y: 46.5, angle: 35, sectorName: 'IGNIS STATION' },
    2: { x: 50.5, y: 28.5, angle: 45, sectorName: 'KRYON BELT' },
    3: { x: 74.5, y: 38.5, angle: 30, sectorName: 'NOVA SECTOR' },
    4: { x: 92.0, y: 60.5, angle: 25, sectorName: 'FUNCTION NEBULA' },
  };

  const dock = sectorDockCoordinates[currentSectorOrder] || sectorDockCoordinates[1];

  return (
    <div
      style={{
        left: `${dock.x}%`,
        top: `${dock.y}%`,
        transform: `translate(-50%, -50%) rotate(${dock.angle}deg)`,
      }}
      onClick={onRocketClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="absolute z-20 cursor-pointer select-none group"
      title={`USS Vanguard // Java 21 Scout (Docked at ${dock.sectorName})`}
    >
      {/* Docked Starship Model (Stationary, Distinct Spacecraft Silhouette) */}
      <div className="relative w-8 h-7 sm:w-10 sm:h-8 flex items-center justify-center">
        {/* Subtle Docking Mooring Field (Soft cyan aura) */}
        <div className="absolute -inset-1.5 rounded-full bg-cyber-cyan/15 blur-sm pointer-events-none group-hover:bg-cyber-cyan/35 transition-colors" />

        {/* High-Tech Vector Spaceship (Side / Three-Quarter Hull) */}
        <svg
          viewBox="0 0 48 32"
          className="w-full h-full drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Fuselage Body */}
          <path
            d="M 44 16 L 24 6 L 10 10 L 4 13 L 2 15 L 2 17 L 4 19 L 10 22 L 24 26 Z"
            fill="url(#dockedHullGrad)"
            stroke="#00F0FF"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />

          {/* Swept Forward Wings / Solar Stabilizers */}
          <path
            d="M 26 6 L 16 2 L 14 10 Z"
            fill="#1E293B"
            stroke="#38BDF8"
            strokeWidth="1"
          />
          <path
            d="M 26 26 L 16 30 L 14 22 Z"
            fill="#1E293B"
            stroke="#38BDF8"
            strokeWidth="1"
          />

          {/* Forward Cockpit Canopy */}
          <path
            d="M 38 16 L 28 13 L 24 16 L 28 19 Z"
            fill="#38BDF8"
            stroke="#FFFFFF"
            strokeWidth="0.8"
          />

          {/* Docking Telemetry Beacon (Calm Emerald Pulse) */}
          <circle cx="20" cy="16" r="1.8" fill="#10B981" className="animate-pulse" />

          {/* Engine Exhaust Nozzles in Standby Mode */}
          <rect x="1" y="13" width="3" height="6" rx="1" fill="#334155" stroke="#00F0FF" strokeWidth="0.6" />

          <defs>
            <linearGradient id="dockedHullGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="60%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.85" />
            </linearGradient>
          </defs>
        </svg>

        {/* Small Standby Idle Thruster Glow */}
        <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyber-cyan/50 blur-[2px]" />
      </div>

      {/* Docked Tactical Status Badge on Hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.92 }}
            transition={{ duration: 0.15 }}
            style={{
              transform: `rotate(${-dock.angle}deg)`, // Counter-rotate so badge is upright
            }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-xl bg-space-950/95 border border-cyber-cyan/40 shadow-2xl text-[10px] font-mono pointer-events-none z-30"
          >
            <div className="flex items-center space-x-1.5 text-cyber-cyan font-bold">
              <Anchor className="w-3 h-3 text-cyber-emerald" />
              <span>USS VANGUARD</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-cyber-emerald/20 text-cyber-emerald font-bold">
                DOCKED
              </span>
            </div>
            <div className="text-[9px] text-slate-300">
              Stationed at {dock.sectorName}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

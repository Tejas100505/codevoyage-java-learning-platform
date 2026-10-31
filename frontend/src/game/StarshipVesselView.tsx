import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Activity,
  Radio,
  Flame,
  Compass,
  Repeat,
  Sparkles,
  Power,
  Shield,
  Rocket,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { ShipSystemStatus, GameState } from '../services/gameStateService';

export type ShipFlightState = 'idle' | 'powered' | 'launch' | 'travel';

interface StarshipVesselViewProps {
  gameState: GameState | null;
  selectedSystemKey?: string;
  onSelectSystem?: (systemKey: string) => void;
  flightStateOverride?: ShipFlightState;
  showControls?: boolean;
}

export const StarshipVesselView: React.FC<StarshipVesselViewProps> = ({
  gameState,
  selectedSystemKey,
  onSelectSystem,
  flightStateOverride,
  showControls = true,
}) => {
  const [internalFlightState, setInternalFlightState] = useState<ShipFlightState>('idle');
  const [radarAngle, setRadarAngle] = useState<number>(0);

  const systems = gameState?.systems || [];
  const overallIntegrity = gameState?.overallIntegrity ?? 40;

  // Active state is either externally overridden or user-selected via preview toggle
  const activeFlightState: ShipFlightState = flightStateOverride || internalFlightState;

  // Find individual subsystem states
  const getSys = (key: string): ShipSystemStatus | undefined => {
    return systems.find((s) => s.systemKey === key);
  };

  const powerCore = getSys('POWER_CORE');
  const comms = getSys('COMMUNICATION_ARRAY');
  const engine = getSys('ENGINE_SYSTEM');
  const nav = getSys('NAVIGATION_SYSTEM');
  const auto = getSys('AUTOMATION_SYSTEM');
  const ai = getSys('SHIP_AI');

  const isPowerOnline = (powerCore?.powerPercentage ?? 0) >= 60;
  const isCommsOnline = (comms?.powerPercentage ?? 0) >= 60;
  const isEngineOnline = (engine?.powerPercentage ?? 0) >= 60;
  const isNavOnline = (nav?.powerPercentage ?? 0) >= 60;
  const isAutoOnline = (auto?.powerPercentage ?? 0) >= 60;
  const isAiOnline = (ai?.powerPercentage ?? 0) >= 60;

  // Radar beam rotation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setRadarAngle((prev) => (prev + 4) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative rounded-3xl bg-space-950/90 border border-cyber-cyan/30 shadow-[0_0_50px_rgba(0,240,255,0.15)] overflow-hidden p-6 sm:p-8 backdrop-blur-xl">
      {/* Background Starfield and Flight State Warp Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f0ff05_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff05_1px,transparent_1px)] bg-[size:2.5rem_2.5rem]" />

        {/* Dynamic backdrop glow based on flight state */}
        {activeFlightState === 'travel' && (
          <div className="absolute inset-0">
            <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyber-cyan/20 via-blue-900/10 to-transparent animate-pulse" />
            {/* Hyperspace motion streaks */}
            {[...Array(16)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-0.5 bg-gradient-to-r from-transparent via-cyber-cyan to-white rounded-full opacity-70"
                style={{ top: `${(i * 6.5) % 100}%`, left: '10%' }}
                animate={{ width: [20, 260, 40], x: [-100, 600], opacity: [0, 0.9, 0] }}
                transition={{ duration: 0.8 + (i % 5) * 0.2, repeat: Infinity, ease: 'linear' }}
              />
            ))}
          </div>
        )}

        {activeFlightState === 'launch' && (
          <motion.div
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-t from-amber-500/20 via-transparent to-transparent"
          />
        )}
      </div>

      {/* Top Header & Flight State Controls */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-space-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono tracking-widest text-cyber-cyan uppercase font-bold">
            <Rocket className="w-3.5 h-3.5" />
            <span>STARFLEET VESSEL BLUEPRINT // REAL-TIME PROGRESSION</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white font-mono uppercase tracking-tight flex items-center space-x-3">
            <span>{gameState?.activeShipName || 'USS Vanguard (NCC-1701)'}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30">
              {overallIntegrity}% RESTORED
            </span>
          </h3>
        </div>

        {/* Flight State Selector (Idle, Powered, Launch, Travel) */}
        {showControls && (
          <div className="flex items-center bg-space-900/80 p-1 rounded-2xl border border-white/10 space-x-1 font-mono text-xs">
            {(['idle', 'powered', 'launch', 'travel'] as ShipFlightState[]).map((state) => {
              const active = activeFlightState === state;
              return (
                <button
                  key={state}
                  onClick={() => setInternalFlightState(state)}
                  className={`px-3 py-1.5 rounded-xl font-bold uppercase transition-all ${
                    active
                      ? state === 'travel'
                        ? 'bg-cyber-purple text-white shadow-glow-purple'
                        : state === 'launch'
                        ? 'bg-amber-500 text-space-950 font-black shadow-glow-amber'
                        : state === 'powered'
                        ? 'bg-cyber-cyan text-space-950 font-black shadow-glow-cyan'
                        : 'bg-space-800 text-white border border-white/20'
                      : 'text-slate-400 hover:text-white hover:bg-space-850'
                  }`}
                >
                  {state}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Vessel Visual Stage (Interactive Scalable Vector Ship) */}
      <div className="relative z-10 my-8 flex flex-col items-center justify-center min-h-[380px]">
        {/* Dynamic Flight Transform Wrapper */}
        <motion.div
          animate={
            activeFlightState === 'travel'
              ? { x: [0, 4, -4, 0], y: [0, -3, 3, 0], scale: [1, 1.02, 1] }
              : activeFlightState === 'launch'
              ? { y: [0, -16, -8], scale: 1.04 }
              : activeFlightState === 'powered'
              ? { y: [0, -3, 0] }
              : { y: 0 }
          }
          transition={{
            duration: activeFlightState === 'travel' ? 1.5 : 3.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative w-full max-w-2xl h-[340px] flex items-center justify-center"
        >
          {/* SVG Sci-Fi Starship Hull with dynamic system modules */}
          <svg
            viewBox="0 0 600 300"
            className="w-full h-full drop-shadow-[0_0_30px_rgba(0,240,255,0.2)]"
          >
            <defs>
              {/* Power Core Radial Glow */}
              <radialGradient id="reactorCoreGlow" cx="50%" cy="50%" r="50%">
                <stop
                  offset="0%"
                  stopColor={isPowerOnline ? '#00f0ff' : '#f43f5e'}
                  stopOpacity="0.9"
                />
                <stop
                  offset="100%"
                  stopColor={isPowerOnline ? '#00f0ff' : '#f43f5e'}
                  stopOpacity="0"
                />
              </radialGradient>

              {/* Engine Exhaust Jet Gradient */}
              <linearGradient id="engineExhaust" x1="100%" y1="50%" x2="0%" y2="50%">
                <stop
                  offset="0%"
                  stopColor={
                    activeFlightState === 'travel'
                      ? '#a855f7'
                      : activeFlightState === 'launch'
                      ? '#f59e0b'
                      : isEngineOnline
                      ? '#00f0ff'
                      : '#334155'
                  }
                  stopOpacity="0.9"
                />
                <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
              </linearGradient>

              {/* Shield Aura */}
              <linearGradient id="shieldAura" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Active Shield Barrier Bubble (Active when Power Core & Comms online) */}
            {isPowerOnline && (
              <motion.ellipse
                cx="320"
                cy="150"
                rx="250"
                ry="125"
                fill="url(#shieldAura)"
                stroke="#00f0ff"
                strokeWidth="1.5"
                strokeDasharray="6 6"
                animate={{ opacity: [0.3, 0.6, 0.3], strokeDashoffset: [0, 40] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />
            )}

            {/* ENGINE EXHAUST JETS (Left side) */}
            {(isEngineOnline || activeFlightState === 'launch' || activeFlightState === 'travel') && (
              <g id="engine-plumes">
                {/* Upper Jet */}
                <motion.polygon
                  points="140,118 40,110 30,126 140,128"
                  fill="url(#engineExhaust)"
                  animate={{
                    opacity: activeFlightState === 'travel' ? [0.8, 1, 0.8] : [0.6, 0.9, 0.6],
                    scaleX: activeFlightState === 'travel' ? [1.1, 1.4, 1.1] : [1, 1.15, 1],
                  }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                />
                {/* Lower Jet */}
                <motion.polygon
                  points="140,172 30,174 40,190 140,182"
                  fill="url(#engineExhaust)"
                  animate={{
                    opacity: activeFlightState === 'travel' ? [0.8, 1, 0.8] : [0.6, 0.9, 0.6],
                    scaleX: activeFlightState === 'travel' ? [1.1, 1.4, 1.1] : [1, 1.15, 1],
                  }}
                  transition={{ duration: 0.3, repeat: Infinity, delay: 0.1 }}
                />
              </g>
            )}

            {/* Starship Hull Armor Plates */}
            {/* Warp Nacelles (Upper and Lower) */}
            <rect
              x="130"
              y="96"
              width="150"
              height="20"
              rx="6"
              fill="#0f172a"
              stroke={isEngineOnline ? '#00f0ff' : '#334155'}
              strokeWidth="2"
            />
            <rect
              x="130"
              y="184"
              width="150"
              height="20"
              rx="6"
              fill="#0f172a"
              stroke={isEngineOnline ? '#00f0ff' : '#334155'}
              strokeWidth="2"
            />

            {/* Nacelle Pylon Struts */}
            <path d="M 220 116 L 250 135" stroke="#475569" strokeWidth="4" />
            <path d="M 220 184 L 250 165" stroke="#475569" strokeWidth="4" />

            {/* Main Primary Hull (Saucer / Command Section) */}
            <path
              d="M 260 150 Q 300 80, 460 115 Q 520 150, 460 185 Q 300 220, 260 150 Z"
              fill="#090d16"
              stroke={overallIntegrity >= 60 ? '#00f0ff' : '#64748b'}
              strokeWidth="2.5"
            />

            {/* Secondary Engineering Fuselage */}
            <polygon
              points="160,135 290,132 290,168 160,165"
              fill="#0b1220"
              stroke={isPowerOnline ? '#00f0ff' : '#475569'}
              strokeWidth="2"
            />

            {/* 1. POWER CORE // CENTER REACTOR (Variables) */}
            <g
              id="subsystem-power-core"
              className="cursor-pointer"
              onClick={() => onSelectSystem && onSelectSystem('POWER_CORE')}
            >
              <circle
                cx="240"
                cy="150"
                r="22"
                fill="url(#reactorCoreGlow)"
                className="animate-pulse"
              />
              <circle
                cx="240"
                cy="150"
                r="14"
                fill={isPowerOnline ? '#00f0ff' : '#f43f5e'}
                opacity={isPowerOnline ? 0.9 : 0.4}
              />
              <circle
                cx="240"
                cy="150"
                r="6"
                fill="#ffffff"
              />
            </g>

            {/* 2. ENERGY FLOW CONDUITS (Lines radiating from Power Core) */}
            {isPowerOnline && (
              <g id="conduits">
                {/* Conduit to Cockpit / Console */}
                <motion.path
                  d="M 255 150 L 380 150 L 440 145"
                  fill="none"
                  stroke="#00f0ff"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                  animate={{ strokeDashoffset: [-20, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                />
                {/* Conduit to Upper Nacelle */}
                <motion.path
                  d="M 235 135 L 200 116"
                  fill="none"
                  stroke={isEngineOnline ? '#00f0ff' : '#eab308'}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  animate={{ strokeDashoffset: [-16, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                />
                {/* Conduit to Lower Nacelle */}
                <motion.path
                  d="M 235 165 L 200 184"
                  fill="none"
                  stroke={isEngineOnline ? '#00f0ff' : '#eab308'}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  animate={{ strokeDashoffset: [-16, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                />
              </g>
            )}

            {/* 3. COCKPIT & BRIDGE DISPLAY SCREENS (Java Basics & Console) */}
            <g id="subsystem-cockpit">
              <ellipse
                cx="440"
                cy="145"
                rx="28"
                ry="14"
                fill={overallIntegrity >= 20 ? '#00f0ff' : '#1e293b'}
                opacity={overallIntegrity >= 20 ? 0.85 : 0.3}
                stroke="#ffffff"
                strokeWidth="1"
              />
              {/* Cabin interior lights */}
              {overallIntegrity >= 40 && (
                <circle cx="435" cy="143" r="2" fill="#ffffff" />
              )}
            </g>

            {/* 4. RADAR & COMMUNICATION DISH (Input / Scanner) */}
            <g
              id="subsystem-comms"
              className="cursor-pointer"
              onClick={() => onSelectSystem && onSelectSystem('COMMUNICATION_ARRAY')}
            >
              <ellipse
                cx="350"
                cy="118"
                rx="14"
                ry="7"
                fill="#1e293b"
                stroke={isCommsOnline ? '#00f0ff' : '#64748b'}
                strokeWidth="1.5"
              />
              <line
                x1="350"
                y1="118"
                x2="355"
                y2="104"
                stroke={isCommsOnline ? '#00f0ff' : '#64748b'}
                strokeWidth="2"
              />
              {/* Radar pulse ripples when online */}
              {isCommsOnline && (
                <motion.circle
                  cx="355"
                  cy="104"
                  r="6"
                  fill="none"
                  stroke="#00f0ff"
                  strokeWidth="1.5"
                  animate={{ r: [3, 16], opacity: [1, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
              )}
            </g>

            {/* 5. NAVIGATION SENSOR ARRAY (Conditions) */}
            <g
              id="subsystem-nav"
              className="cursor-pointer"
              onClick={() => onSelectSystem && onSelectSystem('NAVIGATION_SYSTEM')}
            >
              <polygon
                points="470,140 488,145 470,150"
                fill={isNavOnline ? '#10b981' : '#f43f5e'}
                opacity="0.9"
              />
              {isNavOnline && (
                <motion.line
                  x1="488"
                  y1="145"
                  x2="550"
                  y2="145"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
              )}
            </g>

            {/* 6. SHIP AI COMPANION CORE NODE (B.Y.T.E. / OOP) */}
            <g
              id="subsystem-ai"
              className="cursor-pointer"
              onClick={() => onSelectSystem && onSelectSystem('SHIP_AI')}
            >
              <circle
                cx="330"
                cy="165"
                r="7"
                fill={isAiOnline ? '#a855f7' : '#334155'}
                stroke="#c084fc"
                strokeWidth="1"
              />
              {isAiOnline && (
                <motion.circle
                  cx="330"
                  cy="165"
                  r="12"
                  fill="none"
                  stroke="#c084fc"
                  strokeWidth="1"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0.2, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </g>

            {/* 7. SHIP CABIN LIGHTS & RUNNING LEDS */}
            <g id="hull-leds">
              {[
                { x: 310, y: 135 },
                { x: 360, y: 138 },
                { x: 410, y: 140 },
                { x: 310, y: 165 },
                { x: 360, y: 162 },
                { x: 410, y: 160 },
              ].map((pos, idx) => (
                <circle
                  key={idx}
                  cx={pos.x}
                  cy={pos.y}
                  r="2"
                  fill={
                    overallIntegrity >= 60
                      ? '#00f0ff'
                      : overallIntegrity >= 30
                      ? '#f59e0b'
                      : '#ef4444'
                  }
                  className={overallIntegrity >= 30 ? 'animate-pulse' : ''}
                />
              ))}
            </g>
          </svg>
        </motion.div>
      </div>

      {/* Real-time Subsystem Status Cards (6 Main Systems Requested by User) */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. POWER CORE */}
        <div
          onClick={() => onSelectSystem && onSelectSystem('POWER_CORE')}
          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
            isPowerOnline
              ? 'bg-space-900/80 border-cyber-cyan/50 shadow-glow-cyan/20'
              : 'bg-space-950/60 border-rose-500/30'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="text-[10px] text-slate-400">CORE</span>
            <span
              className={`text-[10px] font-bold ${
                isPowerOnline ? 'text-cyber-cyan' : 'text-rose-400'
              }`}
            >
              {powerCore?.powerPercentage ?? 0}%
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap
              className={`w-4 h-4 ${
                isPowerOnline ? 'text-cyber-cyan fill-current' : 'text-rose-500'
              }`}
            />
            <span className="text-xs font-bold text-white font-mono truncate">
              Power Core
            </span>
          </div>
          <span className="text-[9px] font-mono text-slate-400 block mt-1">
            Java: Variables
          </span>
        </div>

        {/* 2. COMMUNICATION */}
        <div
          onClick={() => onSelectSystem && onSelectSystem('COMMUNICATION_ARRAY')}
          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
            isCommsOnline
              ? 'bg-space-900/80 border-cyber-cyan/50 shadow-glow-cyan/20'
              : 'bg-space-950/60 border-rose-500/30'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="text-[10px] text-slate-400">COMMS</span>
            <span
              className={`text-[10px] font-bold ${
                isCommsOnline ? 'text-cyber-cyan' : 'text-rose-400'
              }`}
            >
              {comms?.powerPercentage ?? 0}%
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Radio
              className={`w-4 h-4 ${
                isCommsOnline ? 'text-cyber-cyan' : 'text-rose-500'
              }`}
            />
            <span className="text-xs font-bold text-white font-mono truncate">
              Comms Array
            </span>
          </div>
          <span className="text-[9px] font-mono text-slate-400 block mt-1">
            Java: Input/Scanner
          </span>
        </div>

        {/* 3. ENGINE */}
        <div
          onClick={() => onSelectSystem && onSelectSystem('ENGINE_SYSTEM')}
          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
            isEngineOnline
              ? 'bg-space-900/80 border-amber-500/50 shadow-glow-amber/20'
              : 'bg-space-950/60 border-rose-500/30'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="text-[10px] text-slate-400">THRUST</span>
            <span
              className={`text-[10px] font-bold ${
                isEngineOnline ? 'text-amber-400' : 'text-rose-400'
              }`}
            >
              {engine?.powerPercentage ?? 0}%
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Flame
              className={`w-4 h-4 ${
                isEngineOnline ? 'text-amber-400 fill-current' : 'text-rose-500'
              }`}
            />
            <span className="text-xs font-bold text-white font-mono truncate">
              Engine System
            </span>
          </div>
          <span className="text-[9px] font-mono text-slate-400 block mt-1">
            Java: Operators
          </span>
        </div>

        {/* 4. NAVIGATION */}
        <div
          onClick={() => onSelectSystem && onSelectSystem('NAVIGATION_SYSTEM')}
          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
            isNavOnline
              ? 'bg-space-900/80 border-cyber-emerald/50 shadow-glow-emerald/20'
              : 'bg-space-950/60 border-rose-500/30'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="text-[10px] text-slate-400">NAV</span>
            <span
              className={`text-[10px] font-bold ${
                isNavOnline ? 'text-cyber-emerald' : 'text-rose-400'
              }`}
            >
              {nav?.powerPercentage ?? 0}%
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Compass
              className={`w-4 h-4 ${
                isNavOnline ? 'text-cyber-emerald' : 'text-rose-500'
              }`}
            />
            <span className="text-xs font-bold text-white font-mono truncate">
              Navigation
            </span>
          </div>
          <span className="text-[9px] font-mono text-slate-400 block mt-1">
            Java: Conditions
          </span>
        </div>

        {/* 5. AUTOMATION */}
        <div
          onClick={() => onSelectSystem && onSelectSystem('AUTOMATION_SYSTEM')}
          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
            isAutoOnline
              ? 'bg-space-900/80 border-cyber-purple/50 shadow-glow-purple/20'
              : 'bg-space-950/60 border-space-800'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="text-[10px] text-slate-400">LOOPS</span>
            <span
              className={`text-[10px] font-bold ${
                isAutoOnline ? 'text-cyber-purple' : 'text-slate-500'
              }`}
            >
              {auto?.powerPercentage ?? 0}%
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Repeat
              className={`w-4 h-4 ${
                isAutoOnline ? 'text-cyber-purple' : 'text-slate-600'
              }`}
            />
            <span className="text-xs font-bold text-white font-mono truncate">
              Automation
            </span>
          </div>
          <span className="text-[9px] font-mono text-slate-400 block mt-1">
            Java: Loops
          </span>
        </div>

        {/* 6. SHIP AI */}
        <div
          onClick={() => onSelectSystem && onSelectSystem('SHIP_AI')}
          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
            isAiOnline
              ? 'bg-space-900/80 border-cyber-cyan/50 shadow-glow-cyan/20'
              : 'bg-space-950/60 border-space-800'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="text-[10px] text-slate-400">NEURAL</span>
            <span
              className={`text-[10px] font-bold ${
                isAiOnline ? 'text-cyber-cyan' : 'text-slate-500'
              }`}
            >
              {ai?.powerPercentage ?? 0}%
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles
              className={`w-4 h-4 ${
                isAiOnline ? 'text-cyber-cyan' : 'text-slate-600'
              }`}
            />
            <span className="text-xs font-bold text-white font-mono truncate">
              Ship AI (Byte)
            </span>
          </div>
          <span className="text-[9px] font-mono text-slate-400 block mt-1">
            Java: OOP
          </span>
        </div>
      </div>
    </div>
  );
};

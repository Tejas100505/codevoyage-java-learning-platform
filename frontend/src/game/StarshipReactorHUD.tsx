import React from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Activity,
  Cpu,
  Radio,
  Compass,
  Repeat,
  Sliders,
  Layers,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Power,
  Flame,
} from 'lucide-react';
import { ShipSystemStatus } from '../services/gameStateService';

interface StarshipReactorHUDProps {
  systemKey?: string;
  systemStatus?: ShipSystemStatus | null;
  overallIntegrity?: number;
  shipName?: string;
  interactivePowerOverride?: number; // E.g. live state from lesson (25%), practice (60%), challenge (100%)
  showSubsystemsGrid?: boolean;
  onSystemClick?: (system: ShipSystemStatus) => void;
}

export const StarshipReactorHUD: React.FC<StarshipReactorHUDProps> = ({
  systemKey = 'POWER_CORE',
  systemStatus,
  overallIntegrity = 40,
  shipName = 'USS Vanguard (NCC-1701)',
  interactivePowerOverride,
  showSubsystemsGrid = false,
  onSystemClick,
}) => {
  // Determine effective power level
  const effectivePower = interactivePowerOverride !== undefined 
    ? interactivePowerOverride 
    : (systemStatus?.powerPercentage ?? 25);

  const isFullPower = effectivePower >= 100;
  const isPartial = effectivePower >= 60 && effectivePower < 100;
  const isDamaged = effectivePower > 0 && effectivePower < 60;
  const isOffline = effectivePower <= 0;

  // Visual themes based on state
  const statusTheme = isFullPower
    ? {
        border: 'border-cyber-cyan/50',
        glow: 'shadow-glow-cyan',
        text: 'text-cyber-cyan',
        bg: 'from-cyber-cyan/20 to-cyber-cyan/5',
        label: 'ONLINE // OPTIMAL',
        badge: 'bg-cyber-cyan/20 text-cyber-cyan border-cyber-cyan/40',
        pulseRate: 2,
      }
    : isPartial
    ? {
        border: 'border-amber-500/50',
        glow: 'shadow-glow-amber',
        text: 'text-amber-400',
        bg: 'from-amber-500/20 to-amber-500/5',
        label: 'PARTIALLY ACTIVE // CALIBRATING',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        pulseRate: 3.5,
      }
    : isDamaged
    ? {
        border: 'border-rose-500/50',
        glow: 'shadow-[0_0_20px_rgba(244,63,94,0.3)]',
        text: 'text-rose-400',
        bg: 'from-rose-500/20 to-rose-500/5',
        label: 'DAMAGED // SURGE ANOMALY',
        badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        pulseRate: 1,
      }
    : {
        border: 'border-space-800',
        glow: '',
        text: 'text-slate-500',
        bg: 'from-space-950 to-space-900',
        label: 'OFFLINE // NO POWER',
        badge: 'bg-space-900 text-slate-500 border-white/5',
        pulseRate: 0,
      };

  // Icon mapping
  const getSystemIcon = (key?: string) => {
    switch (key) {
      case 'SHIP_CONSOLE':
        return Activity;
      case 'POWER_CORE':
        return Zap;
      case 'SENSOR_SYSTEM':
        return Radio;
      case 'COMMUNICATION_ARRAY':
        return Radio;
      case 'ENGINE_SYSTEM':
        return Flame;
      case 'NAVIGATION_SYSTEM':
        return Compass;
      case 'AUTOMATION_SYSTEM':
        return Repeat;
      case 'SHIP_CONTROL_SYSTEM':
        return Sliders;
      case 'CARGO_DATA_SYSTEM':
        return Layers;
      case 'SHIP_AI':
        return Sparkles;
      default:
        return Cpu;
    }
  };

  const MainIcon = getSystemIcon(systemKey);

  // Compute 16-segment ASCII style visual gauge blocks
  const totalBlocks = 16;
  const activeBlocks = Math.round((effectivePower / 100) * totalBlocks);

  return (
    <div className={`p-5 rounded-2xl bg-space-950/90 border ${statusTheme.border} ${statusTheme.glow} transition-all duration-700 relative overflow-hidden backdrop-blur-md`}>
      {/* Background conduits animation when energy is flowing */}
      {(isFullPower || isPartial) && (
        <motion.div
          animate={{
            opacity: [0.1, 0.25, 0.1],
            scale: [1, 1.02, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: isFullPower ? 2.5 : 4,
            ease: 'easeInOut',
          }}
          className={`absolute inset-0 bg-radial-gradient ${statusTheme.bg} pointer-events-none`}
        />
      )}

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 relative z-10 border-b border-white/5 pb-3">
        <div className="flex items-center space-x-3">
          <div
            className={`w-9 h-9 rounded-xl border flex items-center justify-center ${statusTheme.badge}`}
          >
            <MainIcon className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase text-slate-400">
                {shipName}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              <span className="text-[10px] font-mono text-slate-400">
                Subsystem Registry
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-black font-mono tracking-tight text-white uppercase flex items-center space-x-2">
              <span>{systemStatus?.displayName || systemKey.replace(/_/g, ' ')}</span>
              {systemStatus?.javaConcept && (
                <span className="text-[11px] font-normal text-slate-400 lowercase">
                  ({systemStatus.javaConcept})
                </span>
              )}
            </h4>
          </div>
        </div>

        <div className="flex items-center space-x-2 font-mono">
          <span className={`text-[10px] px-2.5 py-1 rounded-full border font-bold uppercase tracking-wider ${statusTheme.badge}`}>
            {statusTheme.label}
          </span>
          <span className="text-xs font-bold text-white">
            {effectivePower}%
          </span>
        </div>
      </div>

      {/* Main Reactor Core Status Visualization */}
      <div className="mt-4 space-y-4 relative z-10">
        {/* Block Meter (as requested: POWER CORE ████████████████ 100%) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between font-mono text-xs text-slate-300">
            <span className="font-bold uppercase tracking-wider text-slate-400">
              {systemStatus?.displayName || systemKey.replace(/_/g, ' ')} OUTPUT
            </span>
            <span className={`font-black ${statusTheme.text}`}>{effectivePower}%</span>
          </div>

          <div className="grid grid-cols-16 gap-1 p-1 rounded-xl bg-space-900/90 border border-white/5">
            {Array.from({ length: totalBlocks }).map((_, bIdx) => {
              const isActive = bIdx < activeBlocks;
              return (
                <motion.div
                  key={bIdx}
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0.2,
                    scale: isActive ? [1, 1.05, 1] : 1,
                  }}
                  transition={{
                    duration: 1.5,
                    delay: bIdx * 0.04,
                    repeat: isActive && isFullPower ? Infinity : 0,
                    repeatDelay: 3,
                  }}
                  className={`h-4 sm:h-5 rounded-sm transition-all duration-300 ${
                    isActive
                      ? isFullPower
                        ? 'bg-cyber-cyan shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                        : isPartial
                        ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                        : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                      : 'bg-space-800'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Live Starship Diagnostic Status Badges */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          {/* Lights Status */}
          <div className="p-2.5 rounded-xl bg-space-900/60 border border-white/5 flex items-center space-x-2">
            <Power
              className={`w-3.5 h-3.5 ${
                effectivePower >= 60 ? 'text-cyber-cyan' : 'text-slate-600'
              }`}
            />
            <div className="text-[11px] font-mono leading-none">
              <span className="text-slate-500 block text-[9px] uppercase">Cabin Lighting</span>
              <span className={effectivePower >= 60 ? 'text-white font-bold' : 'text-slate-500'}>
                {effectivePower >= 60 ? 'ILLUMINATED' : 'EMERGENCY DARK'}
              </span>
            </div>
          </div>

          {/* Energy Flow */}
          <div className="p-2.5 rounded-xl bg-space-900/60 border border-white/5 flex items-center space-x-2">
            <Zap
              className={`w-3.5 h-3.5 ${
                effectivePower >= 60 ? 'text-amber-400 fill-current' : 'text-slate-600'
              }`}
            />
            <div className="text-[11px] font-mono leading-none">
              <span className="text-slate-500 block text-[9px] uppercase">Energy Conduits</span>
              <span className={effectivePower >= 60 ? 'text-white font-bold' : 'text-slate-500'}>
                {effectivePower >= 100 ? 'MAX FLOW' : effectivePower >= 60 ? 'PULSING' : 'DEPLETED'}
              </span>
            </div>
          </div>

          {/* Engine Active */}
          <div className="p-2.5 rounded-xl bg-space-900/60 border border-white/5 flex items-center space-x-2">
            <Flame
              className={`w-3.5 h-3.5 ${
                effectivePower >= 100 ? 'text-cyber-emerald fill-current' : 'text-slate-600'
              }`}
            />
            <div className="text-[11px] font-mono leading-none">
              <span className="text-slate-500 block text-[9px] uppercase">Thrusters</span>
              <span className={effectivePower >= 100 ? 'text-cyber-emerald font-bold' : 'text-slate-500'}>
                {effectivePower >= 100 ? 'ACTIVE (WARP READY)' : 'COLD / STANDBY'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

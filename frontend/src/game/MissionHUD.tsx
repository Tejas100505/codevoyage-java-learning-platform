import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Zap,
  Star,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Cpu,
  Target,
  Sparkles,
} from 'lucide-react';

export interface MissionHUDObjectiveItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface MissionHUDProps {
  worldName?: string;
  missionOrder: number;
  missionTitle: string;
  javaConcept: string;
  xpReward: number;
  starsReward?: number;
  starsEarned?: number;
  currentStage: number; // 1 to 7
  isPracticeComplete?: boolean;
  isCodePassed?: boolean;
  objectives?: MissionHUDObjectiveItem[];
  compactDefault?: boolean;
  onBackToMap?: () => void;
}

export const MissionHUD: React.FC<MissionHUDProps> = ({
  worldName = 'IGNIS STATION',
  missionOrder,
  missionTitle,
  javaConcept,
  xpReward,
  starsReward = 3,
  starsEarned = 0,
  currentStage,
  isPracticeComplete = false,
  isCodePassed = false,
  objectives,
  compactDefault = false,
  onBackToMap,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(!compactDefault);

  // Dynamic Objectives calculation if not explicitly provided
  const dynamicObjectives: MissionHUDObjectiveItem[] = objectives || [
    {
      id: 'learn',
      label: `Learn ${javaConcept}`,
      completed: currentStage >= 3,
    },
    {
      id: 'practice',
      label: 'Complete practice verification',
      completed: currentStage >= 4 || isPracticeComplete,
    },
    {
      id: 'challenge',
      label: 'Execute Java test suite',
      completed: isCodePassed || currentStage >= 7,
    },
    {
      id: 'clear',
      label: 'Stabilize subsystem telemetry',
      completed: isCodePassed || currentStage >= 7,
    },
  ];

  const totalObjectives = dynamicObjectives.length;
  const completedObjectives = dynamicObjectives.filter((o) => o.completed).length;
  const progressPercent = Math.round((completedObjectives / totalObjectives) * 100);

  // 14-block ASCII style visual gauge representation
  // E.g.: ████████████░░
  const totalBlocks = 14;
  const filledBlocks = Math.round((completedObjectives / totalObjectives) * totalBlocks);
  const asciiMeter = `${'█'.repeat(filledBlocks)}${'░'.repeat(totalBlocks - filledBlocks)}`;

  return (
    <div className="w-full rounded-2xl bg-space-950/90 border border-cyber-cyan/30 backdrop-blur-xl shadow-glow-cyan/15 relative overflow-hidden transition-all duration-300">
      {/* Subtle top ambient indicator */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 via-cyber-cyan to-cyber-emerald" />

      {/* Main Bar (Always Visible & Compact) */}
      <div className="p-3.5 sm:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left: World / Mission Header */}
        <div className="flex items-center space-x-3">
          {onBackToMap ? (
            <button
              onClick={onBackToMap}
              className="p-2 rounded-xl bg-space-900 border border-white/10 text-slate-400 hover:text-white hover:bg-space-850 transition-colors shrink-0"
              title="Return to Galaxy Map"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <Link
              to="/map"
              className="p-2 rounded-xl bg-space-900 border border-white/10 text-slate-400 hover:text-white hover:bg-space-850 transition-colors shrink-0"
              title="Return to Galaxy Map"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          )}

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-slate-400">
                {worldName}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                MISSION 0{missionOrder}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white font-mono tracking-tight uppercase line-clamp-1 mt-0.5">
              {missionTitle}
            </h2>
          </div>
        </div>

        {/* Right: Telemetry Badges (Concept, XP, Stars, Progress & Toggle) */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
          {/* Java Concept */}
          <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-space-900/80 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono font-bold">
            <Cpu className="w-3.5 h-3.5 text-cyber-cyan" />
            <span className="truncate max-w-[150px]">{javaConcept}</span>
          </div>

          {/* XP Reward */}
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-space-900/80 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>+{xpReward} XP</span>
          </div>

          {/* Stars */}
          <div className="flex items-center space-x-0.5 px-2.5 py-1 rounded-xl bg-space-900/80 border border-white/10 text-xs font-mono">
            {[1, 2, 3].map((starIdx) => (
              <Star
                key={starIdx}
                className={`w-3.5 h-3.5 ${
                  starIdx <= (starsEarned || (currentStage >= 7 ? 3 : 1))
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-600'
                }`}
              />
            ))}
          </div>

          {/* Expand / Collapse Toggle Button */}
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="p-1.5 rounded-xl bg-space-900 border border-white/10 text-slate-400 hover:text-white hover:bg-space-850 transition-colors flex items-center space-x-1 text-xs font-mono"
            title={isExpanded ? 'Collapse Objectives HUD' : 'Expand Objectives HUD'}
          >
            <span className="hidden lg:inline text-[11px] font-bold text-cyber-cyan uppercase">
              {isExpanded ? 'HIDE OBJECTIVES' : 'VIEW OBJECTIVES'}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-cyber-cyan" />
            ) : (
              <ChevronDown className="w-4 h-4 text-cyber-cyan" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Objectives & Progress Tray (Compact, Non-Intrusive) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="border-t border-space-800 bg-space-950/70 p-4 sm:px-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Left Side: Objective List Items */}
              <div className="md:col-span-8 space-y-2">
                <div className="flex items-center space-x-1.5 text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                  <Target className="w-3.5 h-3.5 text-cyber-cyan" />
                  <span>MISSION DIRECTIVES</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  {dynamicObjectives.map((obj) => (
                    <div
                      key={obj.id}
                      className={`flex items-center space-x-2 p-2 rounded-xl border transition-colors ${
                        obj.completed
                          ? 'bg-space-900/60 border-cyber-emerald/40 text-cyber-emerald'
                          : 'bg-space-950/40 border-space-800 text-slate-400'
                      }`}
                    >
                      {obj.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-cyber-emerald shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                      )}
                      <span className={`truncate ${obj.completed ? 'text-slate-200' : 'text-slate-400'}`}>
                        {obj.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side: Progress Meter & ASCII Gauge */}
              <div className="md:col-span-4 p-3.5 rounded-2xl bg-space-900/90 border border-cyber-cyan/30 space-y-2 font-mono">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 uppercase tracking-wider text-[10px]">
                    DIRECTIVE PROGRESS
                  </span>
                  <span className="font-bold text-cyber-cyan">
                    {progressPercent}%
                  </span>
                </div>

                {/* ASCII + Modern Visual Progress Bar */}
                <div className="space-y-1">
                  <div className="h-2 w-full bg-space-950 rounded-full overflow-hidden p-0.5 border border-space-800">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-emerald rounded-full"
                      style={{ width: `${progressPercent}%` }}
                      initial={false}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>

                  <div className="text-[11px] font-mono tracking-widest text-cyber-cyan/80 flex items-center justify-between">
                    <span>{asciiMeter}</span>
                    <span className="text-[10px] text-slate-400">
                      {completedObjectives}/{totalObjectives}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authService, DashboardSummary } from '../services/authService';
import { gameStateService, GameState } from '../services/gameStateService';
import { missionService, UserProgressItem, WorldData } from '../services/missionService';
import { useAuth } from '../context/AuthContext';
import { Starfield } from '../game/Starfield';
import { GlassCard } from '../components/GlassCard';
import { GlowButton } from '../components/GlowButton';
import { ProgressBar } from '../components/ProgressBar';
import { LoadingState } from '../components/LoadingState';
import { soundManager } from '../services/soundService';
import { JAVA_CODEX_DATA, CodexEntry } from '../data/javaCodexData';
import {
  Shield,
  Zap,
  Star,
  Rocket,
  CheckCircle2,
  Clock,
  Award,
  Globe,
  Flame,
  ChevronRight,
  Code2,
  BookOpen,
  Terminal,
  Activity,
  Layers,
  ArrowUpRight,
  Lock,
  Sparkles,
  RefreshCw,
  HelpCircle,
  GitFork,
  BrainCircuit,
  GraduationCap,
  Cpu,
  Radio,
  Compass,
  Repeat,
  Crosshair,
  Sliders,
  Check,
  Eye,
  AlertTriangle
} from 'lucide-react';
import ignisImg from '../assets/images/ignis_station.jpg';
import kryonImg from '../assets/images/kryon_belt.jpg';
import novaImg from '../assets/images/nova_sector.jpg';
import nebulaImg from '../assets/images/function_nebula.jpg';
import byteImg from '../assets/images/byte_guide.jpg';
import { StudentAnalyticsDashboard } from '../components/StudentAnalyticsDashboard';
import { AcademicEvaluationView } from '../components/AcademicEvaluationView';
import { StarshipReactorHUD } from '../game/StarshipReactorHUD';
import { StarshipVesselView } from '../game/StarshipVesselView';

// Available Cyber Avatars
const AVATAR_OPTIONS = [
  { id: 'byte_guide', name: 'Byte Co-Pilot', src: byteImg, role: 'Tactical AI Companion' },
  { id: 'ignis_miner', name: 'Ignis Commander', src: ignisImg, role: 'Heavy Mining Specialist' },
  { id: 'kryon_navigator', name: 'Kryon Belt Pilot', src: kryonImg, role: 'Cryo Recon Navigator' },
  { id: 'nova_engineer', name: 'Nova Core Specialist', src: novaImg, role: 'High-Energy Systems' },
];

export const Profile: React.FC = () => {
  const { user: authUser, isAuthenticated, refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgressItem[]>([]);
  const [worlds, setWorlds] = useState<WorldData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Selected avatar state (stored locally or in user profile)
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(() => {
    return localStorage.getItem('codevoyage_avatar_id') || 'byte_guide';
  });
  const [isChangingAvatar, setIsChangingAvatar] = useState<boolean>(false);

  // Active Profile View Tabs: 'cadet-dossier' | 'ship-hangar' | 'analytics' | 'evaluation'
  const [activeTab, setActiveTab] = useState<'cadet-dossier' | 'ship-hangar' | 'analytics' | 'evaluation'>(() => {
    if (location.pathname.includes('/evaluation')) return 'evaluation';
    if (location.pathname.includes('/analytics') || location.pathname.includes('/progress')) return 'analytics';
    return 'cadet-dossier';
  });

  useEffect(() => {
    if (location.pathname.includes('/evaluation')) {
      setActiveTab('evaluation');
    } else if (location.pathname.includes('/analytics') || location.pathname.includes('/progress')) {
      setActiveTab('analytics');
    } else if (location.pathname.includes('/profile')) {
      setActiveTab('cadet-dossier');
    }
  }, [location.pathname]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      if (isAuthenticated) {
        const [dashData, gsData, progData, worldList] = await Promise.all([
          authService.getDashboardSummary(),
          gameStateService.getGameState().catch(() => null),
          missionService.getUserProgress().catch(() => []),
          missionService.getWorlds().catch(() => []),
        ]);

        setSummary(dashData);
        if (gsData) setGameState(gsData);
        if (progData) setUserProgress(progData);
        if (worldList && worldList.length > 0) setWorlds(worldList);
      }
    } catch (err) {
      console.error('Failed to fetch profile summary', err);
      setError('Unable to link with Starfleet Personnel Database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [isAuthenticated]);

  const user = summary?.user || authUser;
  const currentLevel = user?.level || 1;
  const currentXp = summary?.currentXp ?? user?.xp ?? 0;
  const nextLevelXp = summary?.nextLevelXp ?? 500;
  const xpPercentage = summary?.xpPercentage ?? Math.min(100, Math.round((currentXp / nextLevelXp) * 100));
  const rankTitle = summary?.rankTitle || (currentLevel === 1 ? 'CODE PILOT' : `LEVEL ${currentLevel} PILOT`);

  // Active Avatar image
  const activeAvatar = useMemo(() => {
    const found = AVATAR_OPTIONS.find((a) => a.id === selectedAvatarId);
    return found || AVATAR_OPTIONS[0];
  }, [selectedAvatarId]);

  const handleSelectAvatar = (avatarId: string) => {
    setSelectedAvatarId(avatarId);
    localStorage.setItem('codevoyage_avatar_id', avatarId);
    setIsChangingAvatar(false);
    soundManager.emit('button_click');
  };

  // Planet Mapping & Sector Details
  const currentSector = user?.currentSector || 1;
  const currentPlanetName = useMemo(() => {
    if (currentSector === 1) return 'IGNIS STATION';
    if (currentSector === 2) return 'KRYON BELT';
    if (currentSector === 3) return 'NOVA SECTOR';
    if (currentSector === 4) return 'FUNCTION NEBULA';
    return 'IGNIS STATION';
  }, [currentSector]);

  // World Progression Calculations
  const worldProgressStats = useMemo(() => {
    // 5 missions per world in default curriculum
    const completedCount = summary?.completedMissionsCount || 0;
    
    // Ignis Station: World 1 (Missions 1 - 5)
    const ignisDone = Math.min(5, completedCount);
    const ignisPercent = Math.round((ignisDone / 5) * 100);

    // Kryon Belt: World 2 (Missions 6 - 10)
    const kryonDone = Math.max(0, Math.min(5, completedCount - 5));
    const kryonPercent = Math.round((kryonDone / 5) * 100);

    // Nova Sector: World 3 (Missions 11 - 15)
    const novaDone = Math.max(0, Math.min(5, completedCount - 10));
    const novaPercent = Math.round((novaDone / 5) * 100);

    // Function Nebula: World 4 (Missions 16 - 20)
    const nebulaDone = Math.max(0, Math.min(5, completedCount - 15));
    const nebulaPercent = Math.round((nebulaDone / 5) * 100);

    return {
      ignis: { name: 'IGNIS STATION', percent: ignisPercent, completed: ignisDone, total: 5, unlocked: true },
      kryon: { name: 'KRYON BELT', percent: kryonPercent, completed: kryonDone, total: 5, unlocked: currentSector >= 2 || ignisPercent >= 100 },
      nova: { name: 'NOVA SECTOR', percent: novaPercent, completed: novaDone, total: 5, unlocked: currentSector >= 3 },
      nebula: { name: 'FUNCTION NEBULA', percent: nebulaPercent, completed: nebulaDone, total: 5, unlocked: currentSector >= 4 },
    };
  }, [summary?.completedMissionsCount, currentSector]);

  // Java Mastery Calculations based on real verified concepts
  const conceptMasteryStats = useMemo(() => {
    const rawConcepts = summary?.conceptProgress && summary.conceptProgress.length > 0
      ? summary.conceptProgress
      : [
          { name: 'Java Basics', completed: (summary?.completedMissionsCount || 0) >= 1, percent: (summary?.completedMissionsCount || 0) >= 1 ? 100 : 0, tag: 'Syntax & Structure' },
          { name: 'Variables', completed: (summary?.completedMissionsCount || 0) >= 2, percent: (summary?.completedMissionsCount || 0) >= 2 ? 100 : 0, tag: 'Memory Allocation' },
          { name: 'Data Types', completed: (summary?.completedMissionsCount || 0) >= 2, percent: (summary?.completedMissionsCount || 0) >= 2 ? 100 : 0, tag: 'Primitive Types' },
          { name: 'Input / Output', completed: (summary?.completedMissionsCount || 0) >= 3, percent: (summary?.completedMissionsCount || 0) >= 3 ? 100 : 0, tag: 'Scanner & Telemetry' },
          { name: 'Operators', completed: (summary?.completedMissionsCount || 0) >= 4, percent: (summary?.completedMissionsCount || 0) >= 4 ? 100 : 0, tag: 'Arithmetic & Logic' },
          { name: 'Conditions', completed: (summary?.completedMissionsCount || 0) >= 5, percent: (summary?.completedMissionsCount || 0) >= 5 ? 100 : 0, tag: 'Branching & Control' },
          { name: 'Loops', completed: false, percent: 0, tag: 'Iterations (World 3)' },
          { name: 'Methods', completed: false, percent: 0, tag: 'Functions (World 4)' },
        ];

    const masteredCount = rawConcepts.filter((c) => c.completed).length;
    const avgPercent = Math.round(
      rawConcepts.reduce((acc, curr) => acc + (curr.percent || 0), 0) / (rawConcepts.length || 1)
    );

    return {
      list: rawConcepts,
      masteredCount,
      totalCount: rawConcepts.length,
      overallMasteryPercent: avgPercent,
    };
  }, [summary]);

  // Codex Completion Calculation
  const codexCompletionStats = useMemo(() => {
    const highestCleared = (summary?.completedMissionsCount || 0);
    const unlockedEntries = JAVA_CODEX_DATA.filter((e) => {
      if (e.missionRequirementOrder <= 1) return true;
      return highestCleared >= e.missionRequirementOrder;
    }).length;
    const totalEntries = JAVA_CODEX_DATA.length;
    const percent = Math.round((unlockedEntries / totalEntries) * 100);

    return {
      unlocked: unlockedEntries,
      total: totalEntries,
      percent,
    };
  }, [summary?.completedMissionsCount]);

  // Ship Overall Status Calculation
  const shipOverallStatus = useMemo(() => {
    if (gameState && gameState.overallIntegrity !== undefined) {
      return gameState.overallIntegrity;
    }
    // Fallback: derived from missions completed (20% per completed mission in world 1)
    const count = summary?.completedMissionsCount || 0;
    return Math.min(100, Math.max(18, count * 20));
  }, [gameState, summary?.completedMissionsCount]);

  // Flight Streak Days
  const flightStreak = user?.streak || 1;

  // Visual Ascii / Block Progress helper
  const renderAsciiBar = (percent: number, blocks = 14) => {
    const filled = Math.round((percent / 100) * blocks);
    const empty = Math.max(0, blocks - filled);
    return '█'.repeat(filled) + '░'.repeat(empty);
  };

  if (loading && !summary) {
    return (
      <div className="py-32">
        <LoadingState message="ACCESSING STARFLEET PILOT DOSSIER..." />
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-5rem)] space-y-8 pb-16 font-mono text-slate-200">
      <Starfield />

      {/* ========================================================================= */}
      {/* 1. TOP HEADER: CADET PROFILE GAME CARD                                     */}
      {/* ========================================================================= */}
      <div className="relative z-10 p-6 sm:p-8 rounded-3xl glass-panel border border-cyber-cyan/40 shadow-[0_0_50px_rgba(0,240,255,0.15)] overflow-hidden">
        {/* Ambient Corner Plasma Glows */}
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-cyber-cyan/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-72 h-72 rounded-full bg-cyber-purple/15 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Cadet Identity + Avatar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar Hologram Unit */}
            <div className="relative group">
              <div className="w-28 h-28 rounded-3xl overflow-hidden border-2 border-cyber-cyan p-1 bg-space-950 shadow-glow-cyan">
                <img
                  src={activeAvatar.src}
                  alt={activeAvatar.name}
                  className="w-full h-full object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Avatar Level Badge */}
              <div className="absolute -bottom-2 -right-2 px-3 py-0.5 rounded-full bg-space-950 border border-cyber-cyan text-cyber-cyan font-mono text-xs font-black shadow-lg">
                LVL {currentLevel}
              </div>

              {/* Switch Avatar Toggle Button */}
              <button
                onClick={() => {
                  soundManager.emit('button_click');
                  setIsChangingAvatar(!isChangingAvatar);
                }}
                className="mt-2 text-[10px] text-cyber-cyan hover:text-white flex items-center justify-center space-x-1 w-full bg-space-900/80 border border-cyber-cyan/30 rounded-lg py-1 transition-colors"
                title="Change Cadet Helmet / Hologram"
              >
                <RefreshCw className="w-3 h-3" />
                <span>CHANGE AVATAR</span>
              </button>
            </div>

            {/* Callsign & Rank Vitals */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black px-3 py-0.5 rounded-full bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/50 tracking-wider">
                  STARFLEET CADET PROFILE
                </span>
                <span className="text-xs text-slate-400">
                  CALLSIGN: <span className="text-white font-bold tracking-wide">{user?.username || 'Cadet'}</span>
                </span>
                <span className="text-xs text-cyber-emerald flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-cyber-emerald animate-ping" />
                  <span className="font-bold">TRANSPONDER ACTIVE</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
                {user?.username || 'Code Pilot'}
              </h1>

              <div className="flex items-center space-x-2 text-sm text-amber-400 font-bold tracking-wide">
                <Shield className="w-4 h-4 text-amber-400" />
                <span className="uppercase">{rankTitle}</span>
                <span className="text-slate-500 font-normal">|</span>
                <span className="text-xs text-slate-300">SECTOR 0{currentSector} VANGUARD</span>
              </div>

              <p className="text-xs text-slate-400 max-w-xl">
                Certified Java 21 telemetry pilot deployed to deep space outposts. Enlisted at Starfleet Academy for autonomous systems control.
              </p>
            </div>
          </div>

          {/* Quick HUD Metrics: Streak, Stars, Coins */}
          <div className="flex flex-wrap lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            {/* Flight Streak */}
            <div className="flex items-center justify-between space-x-4 px-4 py-2.5 rounded-2xl bg-space-900/80 border border-amber-500/30 min-w-[200px]">
              <div className="flex items-center space-x-2">
                <Flame className="w-5 h-5 text-amber-500 fill-current animate-bounce" />
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Flight Streak</div>
                  <div className="text-base font-black text-amber-400">{flightStreak} DAY{flightStreak === 1 ? '' : 'S'}</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
                ACTIVE
              </span>
            </div>

            {/* Total Stars */}
            <div className="flex items-center justify-between space-x-4 px-4 py-2.5 rounded-2xl bg-space-900/80 border border-yellow-500/30 min-w-[200px]">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Mission Stars</div>
                  <div className="text-base font-black text-white">
                    {summary?.totalStarsEarned ?? user?.stars ?? 0} <span className="text-xs text-slate-500">/ {summary?.maxAvailableStars ?? 15}</span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/30">
                GOLD
              </span>
            </div>
          </div>
        </div>

        {/* Avatar Picker Modal Dropdown (Collapsible) */}
        <AnimatePresence>
          {isChangingAvatar && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-space-800"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-cyber-cyan font-bold tracking-wider uppercase flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-cyber-cyan" />
                  <span>SELECT CADET HELMET & AVATAR</span>
                </span>
                <button
                  onClick={() => setIsChangingAvatar(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  CANCEL
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {AVATAR_OPTIONS.map((opt) => {
                  const isSelected = opt.id === selectedAvatarId;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectAvatar(opt.id)}
                      className={`p-3 rounded-2xl border text-left flex items-center space-x-3 transition-all ${
                        isSelected
                          ? 'bg-cyber-cyan/20 border-cyber-cyan shadow-glow-cyan'
                          : 'bg-space-900/60 border-space-800 hover:border-space-700'
                      }`}
                    >
                      <img
                        src={opt.src}
                        alt={opt.name}
                        className="w-12 h-12 rounded-xl object-cover border border-white/20"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate flex items-center space-x-1">
                          <span>{opt.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-cyber-cyan" />}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">{opt.role}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ========================================================================= */}
      {/* 2. NAVIGATION TABS: Dossier | Ship Hangar | Analytics | Academic Eval      */}
      {/* ========================================================================= */}
      <div className="relative z-10 flex items-center space-x-2 border-b border-space-800 pb-2 overflow-x-auto">
        <button
          onClick={() => {
            soundManager.emit('tab_switch');
            setActiveTab('cadet-dossier');
          }}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'cadet-dossier'
              ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/50 shadow-glow-cyan'
              : 'text-slate-400 hover:text-white hover:bg-space-900 border border-transparent'
          }`}
        >
          <Crosshair className="w-4 h-4 text-cyber-cyan" />
          <span>CADET PROFILE & VITALS</span>
        </button>

        <button
          onClick={() => {
            soundManager.emit('tab_switch');
            setActiveTab('ship-hangar');
          }}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'ship-hangar'
              ? 'bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/50 shadow-glow-purple'
              : 'text-slate-400 hover:text-white hover:bg-space-900 border border-transparent'
          }`}
        >
          <Rocket className="w-4 h-4 text-cyber-purple" />
          <span>VESSEL HANGAR (SHIP STATUS)</span>
        </button>

        <button
          onClick={() => {
            soundManager.emit('tab_switch');
            setActiveTab('analytics');
          }}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'analytics'
              ? 'bg-cyber-emerald/20 text-cyber-emerald border border-cyber-emerald/50 shadow-glow-emerald'
              : 'text-slate-400 hover:text-white hover:bg-space-900 border border-transparent'
          }`}
        >
          <BrainCircuit className="w-4 h-4 text-cyber-emerald" />
          <span>LEARNING ANALYTICS & EVIDENCE</span>
        </button>

        <button
          onClick={() => {
            soundManager.emit('tab_switch');
            setActiveTab('evaluation');
          }}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'evaluation'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-glow-amber'
              : 'text-slate-400 hover:text-white hover:bg-space-900 border border-transparent'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-amber-400" />
          <span>ACADEMIC EVALUATION (PRE / POST)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 3. TAB CONTENT: CADET DOSSIER (GAME PROFILE)                              */}
      {/* ========================================================================= */}
      {activeTab === 'cadet-dossier' && (
        <div className="space-y-8">
          {/* GAME STYLE VITALS BARS (Level, XP, World Progress, Ship, Java Mastery, Achievements) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Card: Core Telemetry & XP */}
            <div className="p-6 rounded-3xl glass-panel border border-white/10 bg-space-900/60 space-y-6">
              <div className="flex items-center justify-between border-b border-space-800 pb-3">
                <div className="flex items-center space-x-2 text-cyber-cyan text-xs font-bold uppercase">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>PILOT ADVANCEMENT MATRIX</span>
                </div>
                <span className="text-[10px] text-slate-400">LEVEL {currentLevel} // {rankTitle}</span>
              </div>

              {/* Experience Bar Visual */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-bold uppercase">Experience (XP)</span>
                  <span className="text-amber-400 font-bold">
                    {currentXp} <span className="text-slate-500 font-normal">/ {nextLevelXp} XP ({xpPercentage}%)</span>
                  </span>
                </div>
                <div className="text-[13px] font-mono text-amber-400 tracking-wider overflow-hidden">
                  {renderAsciiBar(xpPercentage, 22)}
                </div>
                <div className="w-full bg-space-950 rounded-full h-2 overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                    style={{ width: `${xpPercentage}%` }}
                  />
                </div>
              </div>

              {/* Ship Status Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-bold uppercase flex items-center space-x-1.5">
                    <Rocket className="w-3.5 h-3.5 text-cyber-cyan" />
                    <span>Ship Status (Hull & Subsystems)</span>
                  </span>
                  <span className="text-cyber-cyan font-bold">{shipOverallStatus}% INTEGRITY</span>
                </div>
                <div className="text-[13px] font-mono text-cyber-cyan tracking-wider overflow-hidden">
                  {renderAsciiBar(shipOverallStatus, 22)}
                </div>
                <div className="w-full bg-space-950 rounded-full h-2 overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-cyber-cyan shadow-glow-cyan transition-all duration-500"
                    style={{ width: `${shipOverallStatus}%` }}
                  />
                </div>
              </div>

              {/* Java Mastery Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-bold uppercase flex items-center space-x-1.5">
                    <Code2 className="w-3.5 h-3.5 text-cyber-emerald" />
                    <span>Java Mastery</span>
                  </span>
                  <span className="text-cyber-emerald font-bold">
                    {conceptMasteryStats.masteredCount} / {conceptMasteryStats.totalCount} Concepts ({conceptMasteryStats.overallMasteryPercent}%)
                  </span>
                </div>
                <div className="text-[13px] font-mono text-cyber-emerald tracking-wider overflow-hidden">
                  {renderAsciiBar(conceptMasteryStats.overallMasteryPercent, 22)}
                </div>
                <div className="w-full bg-space-950 rounded-full h-2 overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-cyber-emerald shadow-glow-emerald transition-all duration-500"
                    style={{ width: `${conceptMasteryStats.overallMasteryPercent}%` }}
                  />
                </div>
              </div>

              {/* Codex Completion Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-bold uppercase flex items-center space-x-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-cyber-purple" />
                    <span>Codex Completion</span>
                  </span>
                  <span className="text-cyber-purple font-bold">
                    {codexCompletionStats.unlocked} / {codexCompletionStats.total} Entries ({codexCompletionStats.percent}%)
                  </span>
                </div>
                <div className="text-[13px] font-mono text-cyber-purple tracking-wider overflow-hidden">
                  {renderAsciiBar(codexCompletionStats.percent, 22)}
                </div>
                <div className="w-full bg-space-950 rounded-full h-2 overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-cyber-purple shadow-glow-purple transition-all duration-500"
                    style={{ width: `${codexCompletionStats.percent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Right Card: World-by-World Exploration Tracker */}
            <div className="p-6 rounded-3xl glass-panel border border-white/10 bg-space-900/60 space-y-6">
              <div className="flex items-center justify-between border-b border-space-800 pb-3">
                <div className="flex items-center space-x-2 text-cyber-cyan text-xs font-bold uppercase">
                  <Globe className="w-4 h-4 text-cyber-cyan" />
                  <span>PLANETARY EXPLORATION SECTORS</span>
                </div>
                <Link
                  to="/map"
                  className="text-[11px] text-cyber-cyan font-bold hover:underline flex items-center space-x-1"
                >
                  <span>ORBITAL MAP</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Sector 1: Ignis Station */}
              <div className="space-y-2 p-3 rounded-2xl bg-space-950/60 border border-cyber-cyan/30">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="font-bold text-white">{worldProgressStats.ignis.name}</span>
                  </div>
                  <span className="font-bold text-amber-400">
                    {worldProgressStats.ignis.percent}% COMPLETE
                  </span>
                </div>
                <div className="text-[12px] font-mono text-amber-400 tracking-wider">
                  {renderAsciiBar(worldProgressStats.ignis.percent, 18)}
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Missions: {worldProgressStats.ignis.completed} / {worldProgressStats.ignis.total}</span>
                  <span>{worldProgressStats.ignis.percent === 100 ? 'OUTPOST SECURED' : 'TACTICAL REBOOT IN PROGRESS'}</span>
                </div>
              </div>

              {/* Sector 2: Kryon Belt */}
              <div className={`space-y-2 p-3 rounded-2xl border ${
                worldProgressStats.kryon.unlocked
                  ? 'bg-space-950/60 border-cyber-cyan/30'
                  : 'bg-space-950/30 border-space-800 opacity-60'
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${worldProgressStats.kryon.unlocked ? 'bg-cyan-400' : 'bg-slate-600'}`} />
                    <span className="font-bold text-white">{worldProgressStats.kryon.name}</span>
                  </div>
                  <span className="font-bold text-cyber-cyan">
                    {worldProgressStats.kryon.unlocked ? `${worldProgressStats.kryon.percent}% COMPLETE` : 'LOCKED'}
                  </span>
                </div>
                <div className="text-[12px] font-mono text-cyber-cyan tracking-wider">
                  {renderAsciiBar(worldProgressStats.kryon.percent, 18)}
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Missions: {worldProgressStats.kryon.completed} / {worldProgressStats.kryon.total}</span>
                  <span>{worldProgressStats.kryon.unlocked ? 'CRYO ANOMALY DETECTED' : 'REQUIRES IGNIS COMPLETION'}</span>
                </div>
              </div>

              {/* Sector 3: Nova Sector */}
              <div className="space-y-2 p-3 rounded-2xl bg-space-950/30 border border-space-800 opacity-60">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                    <span className="font-bold text-white">{worldProgressStats.nova.name}</span>
                  </div>
                  <span className="font-bold text-slate-500">LOCKED (SECTOR 03)</span>
                </div>
                <div className="text-[12px] font-mono text-slate-600 tracking-wider">
                  {renderAsciiBar(worldProgressStats.nova.percent, 18)}
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Topic: High-Frequency Loops</span>
                  <span>ORBITAL INSERTION PENDING</span>
                </div>
              </div>

              {/* Sector 4: Function Nebula */}
              <div className="space-y-2 p-3 rounded-2xl bg-space-950/30 border border-space-800 opacity-60">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                    <span className="font-bold text-white">{worldProgressStats.nebula.name}</span>
                  </div>
                  <span className="font-bold text-slate-500">LOCKED (SECTOR 04)</span>
                </div>
                <div className="text-[12px] font-mono text-slate-600 tracking-wider">
                  {renderAsciiBar(worldProgressStats.nebula.percent, 18)}
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Topic: Subroutines & Methods</span>
                  <span>QUANTUM SENSOR MESH</span>
                </div>
              </div>
            </div>
          </div>

          {/* QUICK ACTION TILES: Java Concepts & Achievements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Java Concepts Breakdown */}
            <div className="p-6 rounded-3xl glass-panel border border-white/10 bg-space-900/60 space-y-4">
              <div className="flex items-center justify-between border-b border-space-800 pb-3">
                <div className="flex items-center space-x-2 text-cyber-cyan text-xs font-bold uppercase">
                  <Code2 className="w-4 h-4 text-cyber-emerald" />
                  <span>VERIFIED JAVA CONCEPTS</span>
                </div>
                <Link
                  to="/skills"
                  className="text-[11px] text-cyber-purple font-bold hover:underline flex items-center space-x-1"
                >
                  <span>SKILL TREE &rarr;</span>
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {conceptMasteryStats.list.map((c) => {
                  const isDone = c.completed;
                  return (
                    <div
                      key={c.name}
                      className={`p-3 rounded-2xl border text-center flex flex-col justify-between ${
                        isDone
                          ? 'bg-space-950/80 border-cyber-emerald/40 text-cyber-emerald shadow-glow-emerald/10'
                          : 'bg-space-950/40 border-space-800 text-slate-500'
                      }`}
                    >
                      <div className="text-[10px] text-slate-400 truncate uppercase">{c.tag}</div>
                      <div className="text-xs font-black text-white py-1">{c.name}</div>
                      <div className="pt-1 border-t border-space-800/60">
                        {isDone ? (
                          <span className="text-[10px] font-bold text-cyber-emerald flex items-center justify-center space-x-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>100%</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-600 flex items-center justify-center space-x-1">
                            <Lock className="w-2.5 h-2.5" />
                            <span>0%</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Achievements Showcase (Real Badges) */}
            <div className="p-6 rounded-3xl glass-panel border border-white/10 bg-space-900/60 space-y-4">
              <div className="flex items-center justify-between border-b border-space-800 pb-3">
                <div className="flex items-center space-x-2 text-cyber-cyan text-xs font-bold uppercase">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>ACHIEVEMENTS ({summary?.unlockedAchievementsCount ?? 0} / {summary?.totalAchievementsCount ?? 12})</span>
                </div>
                <Link
                  to="/achievements"
                  className="text-[11px] text-cyber-cyan font-bold hover:underline flex items-center space-x-1"
                >
                  <span>VIEW ALL</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {summary?.recentAchievements && summary.recentAchievements.length > 0 ? (
                  summary.recentAchievements.slice(0, 4).map((ach) => (
                    <div
                      key={ach.id || ach.code}
                      className={`p-3 rounded-2xl border flex items-center space-x-3 transition-colors ${
                        ach.unlocked
                          ? 'bg-space-950/80 border-amber-500/30'
                          : 'bg-space-950/40 border-space-800 opacity-60'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${
                          ach.unlocked
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                            : 'bg-space-900 border-space-800 text-slate-600'
                        }`}
                      >
                        <Award className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">{ach.name}</div>
                        <div className="text-[10px] text-amber-400">+{ach.xpReward} XP</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-6 text-xs text-slate-500">
                    No achievements recorded yet. Launch missions to earn commendations!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB CONTENT: SHIP HANGAR (VISUAL VESSEL PROGESSION)                    */}
      {/* ========================================================================= */}
      {activeTab === 'ship-hangar' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl glass-panel border border-cyber-purple/30 bg-space-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-cyber-purple uppercase tracking-wider flex items-center space-x-2">
                <Rocket className="w-4 h-4 text-cyber-purple" />
                <span>ACTIVE STARFLEET VESSEL // USS VANGUARD</span>
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight mt-1">
                SPACESHIP REPAIR & SUBSYSTEM TELEMETRY
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Ship systems repair progressively as you compile authentic Java code.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase">Hull Integrity</div>
                <div className="text-xl font-black text-cyber-cyan">{shipOverallStatus}%</div>
              </div>
              <div className="w-24 bg-space-950 rounded-full h-2 overflow-hidden border border-white/10">
                <div
                  className="h-full bg-cyber-cyan shadow-glow-cyan"
                  style={{ width: `${shipOverallStatus}%` }}
                />
              </div>
            </div>
          </div>

          {/* Interactive Starship Vessel Visual View */}
          <StarshipVesselView gameState={gameState} showControls={true} />

          {/* Subsystems Reactor HUD */}
          <StarshipReactorHUD
            overallIntegrity={shipOverallStatus}
            showSubsystemsGrid={true}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB CONTENT: LEARNING ANALYTICS DASHBOARD                             */}
      {/* ========================================================================= */}
      {activeTab === 'analytics' && (
        <div className="relative z-10">
          <StudentAnalyticsDashboard />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB CONTENT: ACADEMIC EVALUATION (PRE / POST)                          */}
      {/* ========================================================================= */}
      {activeTab === 'evaluation' && (
        <div className="relative z-10">
          <AcademicEvaluationView />
        </div>
      )}
    </div>
  );
};

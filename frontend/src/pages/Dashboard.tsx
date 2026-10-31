import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService, DashboardSummary } from '../services/authService';
import { GlassCard } from '../components/GlassCard';
import { GlowButton } from '../components/GlowButton';
import { ProgressBar } from '../components/ProgressBar';
import { LoadingState } from '../components/LoadingState';
import {
  Rocket,
  Play,
  CheckCircle2,
  Lock,
  ChevronRight,
  BookOpen,
  Activity,
  Map,
  Shield,
  Zap,
  Flame,
  Award,
  ArrowRight,
  GitFork,
  Radio
} from 'lucide-react';
import { gameStateService, GameState } from '../services/gameStateService';
import byteImg from '../assets/images/byte_guide.jpg';
import { MissionLaunchTransition } from '../game/MissionLaunchTransition';

interface DashboardProps {
  health?: any;
  loadingHealth?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = () => {
  const { user: authUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLaunchingMission, setIsLaunchingMission] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        if (isAuthenticated) {
          const [data, gs] = await Promise.all([
            authService.getDashboardSummary(),
            gameStateService.getGameState().catch(() => null),
          ]);
          if (isMounted) {
            setSummary(data);
            if (gs) setGameState(gs);
          }
        }
      } catch (err: any) {
        console.error('Failed to load dashboard summary', err);
        if (isMounted) {
          setError('Unable to load dashboard summary telemetry.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardData();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const user = summary?.user || authUser;
  const currentLevel = user?.level || 1;
  const rankTitle = summary?.rankTitle || (currentLevel === 1 ? 'Code Apprentice' : 'Cadet Explorer');
  const currentXp = summary?.currentXp ?? user?.xp ?? 0;
  const nextLevelXp = summary?.nextLevelXp ?? 500;
  const xpPercentage = summary?.xpPercentage ?? Math.min(100, Math.round((currentXp / 500) * 100));

  const currentMissionId = summary?.currentMissionId || 1;
  const currentMissionTitle = summary?.currentMissionTitle || 'Powering the Console';
  const currentMissionWorld = summary?.currentMissionWorldName || 'Ignis Station';
  const currentMissionConcept = summary?.currentMissionConcept || 'Java Basics & Program Structure';
  const currentMissionObjective = summary?.currentMissionObjective || 'Construct a valid Java class named Solution and output diagnostic telemetry.';

  const completedCount = summary?.completedMissionsCount || 0;
  const totalMissions = summary?.totalJavaMissions || 5;

  if (loading && !summary) {
    return (
      <div className="py-24">
        <LoadingState message="ACCESSING STARFLEET COMMAND CENTER..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. WELCOME SECTION (Friendly, Concise, Calming) */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30">
              LEVEL {currentLevel} &bull; {rankTitle}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {currentXp} / {nextLevelXp} XP ({Math.round(xpPercentage)}%)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Welcome back, <span className="text-cyber-cyan">{user?.username || 'Cadet'}</span>
          </h1>
          <p className="text-sm text-slate-400">
            {completedCount === 0
              ? 'Begin your Java 21 journey with Mission 01 to unlock starship reactor systems.'
              : `You have mastered ${completedCount} of ${totalMissions} Java missions. Ready for the next directive?`}
          </p>
        </div>

        {/* Quick Robot Byte Status */}
        <div className="flex items-center space-x-3 px-3.5 py-2 rounded-xl bg-space-900/80 border border-white/10 text-xs font-mono text-slate-300 shrink-0">
          <img
            src={byteImg}
            alt="Byte Flight Guide"
            className="w-8 h-8 rounded-full object-cover border border-cyber-cyan/50"
          />
          <div>
            <div className="flex items-center space-x-1.5 font-bold text-white">
              <span>Unit B-Y-T-E</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-emerald animate-pulse" />
            </div>
            <span className="text-[11px] text-cyber-cyan">JDK 21 Runner Online</span>
          </div>
        </div>
      </section>

      {/* 2. CONTINUE LEARNING (Primary Call to Action Card) */}
      <section>
        <GlassCard
          glow="cyan"
          className="p-6 sm:p-8 border-cyber-cyan/40 bg-gradient-to-r from-space-900 via-space-900/90 to-space-950 relative overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {currentMissionWorld} &bull; Mission 0{currentMissionId}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-space-800 text-cyber-cyan border border-space-700">
                  {currentMissionConcept}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white font-mono">
                {currentMissionTitle}
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed font-mono bg-space-950/60 p-3.5 rounded-xl border border-white/5">
                {currentMissionObjective}
              </p>

              <div className="flex items-center space-x-4 text-xs font-mono text-slate-400">
                <span className="flex items-center space-x-1 text-amber-400">
                  <Zap className="w-3.5 h-3.5" />
                  <span>+100 XP</span>
                </span>
                <span className="flex items-center space-x-1 text-cyber-cyan">
                  <Award className="w-3.5 h-3.5" />
                  <span>3 Stars Available</span>
                </span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="shrink-0 flex flex-col items-start lg:items-end justify-center space-y-2">
              <GlowButton
                variant="primary"
                size="lg"
                onClick={() => setIsLaunchingMission(true)}
                icon={<Play className="w-4 h-4 fill-current" />}
                className="w-full sm:w-auto text-sm px-6 py-3.5 font-bold font-mono tracking-wider shadow-glow-cyan"
              >
                CONTINUE MISSION
              </GlowButton>
              <span className="text-[11px] font-mono text-slate-400">
                Direct entry to code editor
              </span>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* 3. LEARNING PROGRESS (Focused, Meaningful Metrics) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Missions Completed */}
        <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Missions Cleared</span>
            <CheckCircle2 className="w-4 h-4 text-cyber-emerald" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {completedCount} <span className="text-sm font-normal text-slate-500">/ {totalMissions}</span>
          </div>
          <ProgressBar
            value={summary?.javaProgressPercent || 0}
            max={100}
            color="emerald"
            size="sm"
          />
        </div>

        {/* Metric 2: Curriculum Mastery */}
        <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Java Mastery</span>
            <Activity className="w-4 h-4 text-cyber-cyan" />
          </div>
          <div className="text-2xl font-bold text-cyber-cyan font-mono">
            {Math.round(summary?.javaProgressPercent || 0)}%
          </div>
          <p className="text-[11px] font-mono text-slate-400">
            {summary?.unlockedAchievementsCount || 0} Badges Earned
          </p>
        </div>

        {/* Metric 3: Learning Streak */}
        <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Study Streak</span>
            <Flame className="w-4 h-4 text-amber-400 fill-current" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono">
            {user?.streak || 1} <span className="text-sm font-normal text-slate-500">Day{(user?.streak || 1) === 1 ? '' : 's'}</span>
          </div>
          <p className="text-[11px] font-mono text-slate-400">Consistent calibration</p>
        </div>

        {/* Metric 4: Starship Reactor Status */}
        <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Vessel Integrity</span>
            <Shield className="w-4 h-4 text-cyber-purple" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {gameState?.overallIntegrity ?? 40}%
          </div>
          <p className="text-[11px] font-mono text-slate-400 truncate">
            {gameState?.activeShipName || 'USS Vanguard'}
          </p>
        </div>
      </section>

      {/* 4. MISSION SEQUENCE (Clean, Readable Roadmap) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center space-x-2">
            <Radio className="w-4 h-4 text-cyber-cyan" />
            <span>Sector 01 Curriculum Pipeline</span>
          </h3>
          <Link
            to="/map"
            className="text-xs font-mono text-cyber-cyan hover:underline flex items-center space-x-1"
          >
            <span>Open Galaxy Map</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {(summary?.recentMissions || []).map((m) => {
            const isCompleted = m.completed;
            const isCurrent = m.id === currentMissionId;
            const isUnlocked = m.unlocked;

            return (
              <div
                key={m.id}
                onClick={() => isUnlocked && navigate(`/mission/${m.id}`)}
                className={`p-3.5 rounded-xl border transition-all text-xs font-mono flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-space-900 border-cyber-cyan/60 shadow-[0_0_15px_rgba(0,240,255,0.15)] cursor-pointer ring-1 ring-cyber-cyan/40'
                    : isCompleted
                    ? 'bg-space-900/60 border-cyber-emerald/30 hover:border-cyber-emerald/60 cursor-pointer'
                    : isUnlocked
                    ? 'bg-space-900/40 border-space-700 hover:border-cyber-cyan/40 cursor-pointer'
                    : 'bg-space-950/40 border-space-850 opacity-50 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                        isCurrent
                          ? 'bg-cyber-cyan/20 text-cyber-cyan'
                          : isCompleted
                          ? 'bg-cyber-emerald/20 text-cyber-emerald'
                          : 'bg-space-800 text-slate-400'
                      }`}
                    >
                      0{m.missionOrder}
                    </span>

                    {isCompleted && (
                      <span className="flex items-center space-x-0.5 text-cyber-emerald text-[10px]">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>DONE</span>
                      </span>
                    )}

                    {isCurrent && !isCompleted && (
                      <span className="text-cyber-cyan text-[10px] font-bold">NEXT</span>
                    )}

                    {!isUnlocked && (
                      <Lock className="w-3 h-3 text-slate-500" />
                    )}
                  </div>

                  <h4 className="font-bold text-white text-xs truncate mb-1">
                    {m.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    {m.concept}
                  </p>
                </div>

                <div className="pt-3 mt-2 border-t border-space-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-amber-400">+{m.xpReward || 100} XP</span>
                  {isUnlocked && (
                    <span className="text-cyber-cyan flex items-center">
                      <span>{isCompleted ? 'Review' : 'Start'}</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. QUICK ACCESS SHORTCUTS (Clear, High-Value Destinations) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        <Link
          to="/map"
          className="p-4 rounded-xl glass-panel border border-white/10 hover:border-cyber-cyan/40 transition-all flex items-start space-x-3 group"
        >
          <div className="p-2.5 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan group-hover:scale-105 transition-transform">
            <Map className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white group-hover:text-cyber-cyan transition-colors">Galaxy Map</h4>
            <p className="text-xs text-slate-400 mt-0.5">Explore planetary sectors and unlocks</p>
          </div>
        </Link>

        <Link
          to="/analytics"
          className="p-4 rounded-xl glass-panel border border-white/10 hover:border-cyber-purple/40 transition-all flex items-start space-x-3 group"
        >
          <div className="p-2.5 rounded-lg bg-cyber-purple/10 border border-cyber-purple/30 text-cyber-purple group-hover:scale-105 transition-transform">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white group-hover:text-cyber-purple transition-colors">Learning Analytics</h4>
            <p className="text-xs text-slate-400 mt-0.5">View compiler pass rates and mastery</p>
          </div>
        </Link>

        <Link
          to="/codex"
          className="p-4 rounded-xl glass-panel border border-white/10 hover:border-amber-400/40 transition-all flex items-start space-x-3 group"
        >
          <div className="p-2.5 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-400 group-hover:scale-105 transition-transform">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">Java Codex</h4>
            <p className="text-xs text-slate-400 mt-0.5">Syntax guides and common mistakes</p>
          </div>
        </Link>

        <Link
          to="/skills"
          className="p-4 rounded-xl glass-panel border border-white/10 hover:border-cyber-emerald/40 transition-all flex items-start space-x-3 group"
        >
          <div className="p-2.5 rounded-lg bg-cyber-emerald/10 border border-cyber-emerald/30 text-cyber-emerald group-hover:scale-105 transition-transform">
            <GitFork className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white group-hover:text-cyber-emerald transition-colors">Skill Tree</h4>
            <p className="text-xs text-slate-400 mt-0.5">Visual concept progression tree</p>
          </div>
        </Link>
      </section>

      {/* Meaningful Mission Launch Warp Transition */}
      <MissionLaunchTransition
        isLaunching={isLaunchingMission}
        missionOrder={currentMissionId}
        missionTitle={currentMissionTitle}
        worldName={currentMissionWorld}
        javaConcept={currentMissionConcept}
        onLaunchComplete={() => {
          navigate(`/mission/${currentMissionId}`);
          setIsLaunchingMission(false);
        }}
        onCancel={() => setIsLaunchingMission(false)}
      />
    </div>
  );
};

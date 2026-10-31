import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { missionService, WorldData, MissionSummary } from '../services/missionService';
import { useAuth } from '../context/AuthContext';
import { Starfield } from '../game/Starfield';
import { GlassCard } from '../components/GlassCard';
import { GlowButton } from '../components/GlowButton';
import { LoadingState } from '../components/LoadingState';
import {
  Rocket,
  Lock,
  CheckCircle2,
  Play,
  Award,
  ChevronRight,
  Shield,
  ArrowLeft,
  X,
  Compass,
  Radio,
  Sparkles,
  Info,
  RotateCcw
} from 'lucide-react';
import { RobotCompanion } from '../game/RobotCompanion';
import { GalaxyRocket } from '../game/GalaxyRocket';
import { MissionLaunchTransition } from '../game/MissionLaunchTransition';

import ignisImg from '../assets/images/ignis_station.jpg';
import kryonImg from '../assets/images/kryon_belt.jpg';
import novaImg from '../assets/images/nova_sector.jpg';
import nebulaImg from '../assets/images/function_nebula.jpg';

interface WorldVisualConfig {
  slug: string;
  code: string;
  name: string;
  tagline: string;
  image: string;
  coordinates: { x: number; y: number };
  color: string;
  glowColor: string;
}

const WORLD_CONFIGS: Record<number, WorldVisualConfig> = {
  1: {
    slug: 'ignis-station',
    code: 'WORLD 1',
    name: 'IGNIS STATION',
    tagline: 'Volcanic Asteroid Mining Outpost',
    image: ignisImg,
    coordinates: { x: 22, y: 52 },
    color: '#00F0FF',
    glowColor: 'rgba(0, 240, 255, 0.3)',
  },
  2: {
    slug: 'kryon-belt',
    code: 'WORLD 2',
    name: 'KRYON BELT',
    tagline: 'Glacial Sub-Zero Asteroid Barrier',
    image: kryonImg,
    coordinates: { x: 46, y: 34 },
    color: '#3B82F6',
    glowColor: 'rgba(59, 130, 246, 0.3)',
  },
  3: {
    slug: 'nova-sector',
    code: 'WORLD 3',
    name: 'NOVA SECTOR',
    tagline: 'Plasma Flare & Electromagnetic Core',
    image: novaImg,
    coordinates: { x: 70, y: 44 },
    color: '#8B5CF6',
    glowColor: 'rgba(139, 92, 246, 0.3)',
  },
  4: {
    slug: 'function-nebula',
    code: 'WORLD 4',
    name: 'FUNCTION NEBULA',
    tagline: 'Interstellar Quantum Sensor Mesh',
    image: nebulaImg,
    coordinates: { x: 88, y: 66 },
    color: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.3)',
  },
};

export const GalaxyMap: React.FC = () => {
  const navigate = useNavigate();

  const defaultWorlds: WorldData[] = useMemo(() => [
    {
      id: 1,
      worldOrder: 1,
      slug: 'ignis-station',
      name: 'IGNIS STATION',
      theme: 'Volcanic Asteroid Mining Outpost',
      lore: 'An industrial mining outpost orbiting a volcanic dwarf star. Cadets begin here to reboot dark starship terminals, calibrate life support, and establish communication through authentic Java 21 code.',
      unlockedByDefault: true,
      missions: [
        { id: 1, missionOrder: 1, title: 'Powering the Console', slug: 'powering-the-console', objective: 'Construct a valid Java class named Solution and output the exact diagnostic code: IGNIS STATION: ONLINE', javaConcept: 'Java Basics & Program Structure', xpReward: 100, starsReward: 3, difficulty: 'EASY', unlocked: true, completed: false, starsEarned: 0 },
        { id: 2, missionOrder: 2, title: 'Ship Systems', slug: 'ship-systems', objective: 'Declare and assign core diagnostic variables for reactor integrity', javaConcept: 'Variables & Memory Allocation', xpReward: 120, starsReward: 3, difficulty: 'EASY', unlocked: false, completed: false, starsEarned: 0 },
        { id: 3, missionOrder: 3, title: 'Receiving Transmissions', slug: 'receiving-transmissions', objective: 'Parse incoming subspace telemetry signals using primitive types and casting', javaConcept: 'Primitive Data Types & Type Casting', xpReward: 150, starsReward: 3, difficulty: 'MEDIUM', unlocked: false, completed: false, starsEarned: 0 },
        { id: 4, missionOrder: 4, title: 'Engine Control', slug: 'engine-control', objective: 'Read pilot command input and print formatted propulsion vectors', javaConcept: 'Input / Output & Formatted Printing', xpReward: 160, starsReward: 3, difficulty: 'MEDIUM', unlocked: false, completed: false, starsEarned: 0 },
        { id: 5, missionOrder: 5, title: 'Emergency Protocol', slug: 'emergency-protocol', objective: 'Calculate airlock delta and trigger critical alerts using arithmetic and logic', javaConcept: 'Operators & Relational Logic', xpReward: 180, starsReward: 3, difficulty: 'HARD', unlocked: false, completed: false, starsEarned: 0 }
      ]
    },
    {
      id: 2,
      worldOrder: 2,
      slug: 'kryon-belt',
      name: 'KRYON BELT',
      theme: 'Glacial Sub-Zero Asteroid Barrier',
      lore: 'A dense belt of frozen methane asteroids and sub-zero orbital stations. Learn conditional branching and decision logic to steer deflector arrays.',
      unlockedByDefault: false,
      missions: [
        { id: 6, missionOrder: 1, title: 'Thermal Deflector Switch', slug: 'thermal-deflector-switch', objective: 'Implement a switch statement to route shield power across frost storm frequencies', javaConcept: 'Conditional Branching & Switch Statements', xpReward: 140, starsReward: 3, difficulty: 'EASY', unlocked: false, completed: false, starsEarned: 0 },
        { id: 7, missionOrder: 2, title: 'Ice Shield Resonance', slug: 'ice-shield-resonance', objective: 'Apply compound boolean expressions (&&, ||) to protect ship hull from impacts', javaConcept: 'Compound Booleans & Nested Decisions', xpReward: 160, starsReward: 3, difficulty: 'MEDIUM', unlocked: false, completed: false, starsEarned: 0 },
        { id: 8, missionOrder: 3, title: 'Sub-Zero Thruster Gating', slug: 'sub-zero-thruster-gating', objective: 'Calculate propulsion output state using compact boolean ternary expressions', javaConcept: 'Ternary Operator & Inline Logic', xpReward: 170, starsReward: 3, difficulty: 'MEDIUM', unlocked: false, completed: false, starsEarned: 0 },
        { id: 9, missionOrder: 4, title: 'Subspace Beacon Parser', slug: 'subspace-beacon-parser', objective: 'Decode navigation orders using Java String equals() comparisons', javaConcept: 'String Equality & String Methods', xpReward: 180, starsReward: 3, difficulty: 'MEDIUM', unlocked: false, completed: false, starsEarned: 0 },
        { id: 10, missionOrder: 5, title: 'BOSS: Cryo-Grid Override', slug: 'cryo-grid-override', objective: 'Synthesize authorization codes, shield gates, and temperature safety systems', javaConcept: 'Comprehensive Decision System Synthesis', xpReward: 250, starsReward: 3, difficulty: 'HARD', unlocked: false, completed: false, starsEarned: 0 }
      ]
    },
    {
      id: 3,
      worldOrder: 3,
      slug: 'nova-sector',
      name: 'NOVA SECTOR',
      theme: 'Plasma Flare & Electromagnetic Core',
      lore: 'High-radiation orbital zone surrounding an unstable hyper-pulsar. Unlocks loops and iteration controls.',
      unlockedByDefault: false,
      missions: [
        { id: 11, missionOrder: 1, title: 'Plasma Coolant Circulation', slug: 'plasma-coolant-circulation', objective: 'Use a while loop to iteratively cool reactor core temperature by 15 units until safe (<= 50 C)', javaConcept: 'While Loops & Condition-Controlled Iteration', xpReward: 150, starsReward: 3, difficulty: 'EASY', unlocked: false, completed: false, starsEarned: 0 },
        { id: 12, missionOrder: 2, title: 'Orbital Beacon Frequency Sweep', slug: 'orbital-beacon-frequency-sweep', objective: 'Read the number of beacon channels n and use a for loop from 1 to n to sweep channels', javaConcept: 'For Loops & Definite Iteration', xpReward: 160, starsReward: 3, difficulty: 'EASY', unlocked: false, completed: false, starsEarned: 0 },
        { id: 13, missionOrder: 3, title: 'Electromagnetic Pulse Handshake', slug: 'electromagnetic-pulse-handshake', objective: 'Execute a do-while loop to transmit an initial pulse burst, doubling pulse strength while < 100', javaConcept: 'Do-While Loops & At-Least-Once Execution', xpReward: 170, starsReward: 3, difficulty: 'MEDIUM', unlocked: false, completed: false, starsEarned: 0 },
        { id: 14, missionOrder: 4, title: 'Flare Surge Energy Harvester', slug: 'flare-surge-energy-harvester', objective: 'Filter out negative noise with continue and abort overloads with break to harvest solar flare energy', javaConcept: 'Loop Control (break, continue) & Accumulators', xpReward: 180, starsReward: 3, difficulty: 'MEDIUM', unlocked: false, completed: false, starsEarned: 0 },
        { id: 15, missionOrder: 5, title: 'BOSS: Hyper-Pulsar Core Stabilization', slug: 'hyper-pulsar-core-stabilization', objective: 'Process sensor telemetry streams, calculate average flux, detect critical sensors, and restore equilibrium', javaConcept: 'Comprehensive Loop & Iteration Synthesis', xpReward: 300, starsReward: 3, difficulty: 'HARD', unlocked: false, completed: false, starsEarned: 0, isBossMission: true }
      ]
    },
    {
      id: 4,
      worldOrder: 4,
      slug: 'function-nebula',
      name: 'FUNCTION NEBULA',
      theme: 'Interstellar Quantum Sensor Mesh',
      lore: 'A swirling nebula of crystalline cosmic dust. Unlocks methods, parameters, and modular Java functions.',
      unlockedByDefault: false,
      missions: [
        { id: 16, missionOrder: 1, title: 'Quantum Ping Subroutine', slug: 'quantum-ping-subroutine', objective: 'Declare public static void sendPing(String nodeId, int latency) and call it from main', javaConcept: 'Static Methods & Parameters', xpReward: 160, starsReward: 3, difficulty: 'EASY', unlocked: false, completed: false, starsEarned: 0 },
        { id: 17, missionOrder: 2, title: 'Warp Vector Calculation Engine', slug: 'warp-vector-calculation-engine', objective: 'Implement public static double calculateVelocity(double thrust, double density) and print formatted result', javaConcept: 'Method Return Values & Type Contracts', xpReward: 170, starsReward: 3, difficulty: 'EASY', unlocked: false, completed: false, starsEarned: 0 },
        { id: 18, missionOrder: 3, title: 'Distributed Sensor Mesh Allocation', slug: 'distributed-sensor-mesh-allocation', objective: 'Allocate int[] array of given size, read readings, print array elements space-separated and count deployed probes', javaConcept: 'Array Declaration, Indexing & Length', xpReward: 180, starsReward: 3, difficulty: 'MEDIUM', unlocked: false, completed: false, starsEarned: 0 },
        { id: 19, missionOrder: 4, title: 'Cosmic Dust Peak Detector', slug: 'cosmic-dust-peak-detector', objective: 'Traverse an array to locate the maximum density value and its first occurrence probe index', javaConcept: 'Array Traversal, Search & Extrema', xpReward: 190, starsReward: 3, difficulty: 'MEDIUM', unlocked: false, completed: false, starsEarned: 0 },
        { id: 20, missionOrder: 5, title: 'BOSS: Quantum Nebula Mesh Synthesis', slug: 'quantum-nebula-mesh-synthesis', objective: 'Implement calculateChecksum(int[] arr) and printReversed(int[] arr) to decode telemetry stream and verify checksum', javaConcept: 'Comprehensive Modular & Array System Synthesis', xpReward: 350, starsReward: 3, difficulty: 'HARD', unlocked: false, completed: false, starsEarned: 0, isBossMission: true }
      ]
    }
  ], []);

  const { user, token, isLoading: authLoading } = useAuth();

  const [worlds, setWorlds] = useState<WorldData[]>(defaultWorlds);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedBackendData, setHasLoadedBackendData] = useState<boolean>(false);
  const [selectedWorld, setSelectedWorld] = useState<WorldData | null>(null);
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);
  const [launchingMission, setLaunchingMission] = useState<MissionSummary | null>(null);

  const fetchGalaxyData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await missionService.getWorlds();
      if (data && data.length > 0) {
        setWorlds(data);
        setHasLoadedBackendData(true);
      }
    } catch (err: any) {
      console.error('Failed to load galaxy worlds', err);
      setError('Unable to synchronize star chart telemetry from Starfleet Command.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchGalaxyData();
    }
  }, [token, authLoading]);

  const ignisWorld = useMemo(() => {
    return worlds.find((w) => w.worldOrder === 1) || defaultWorlds[0];
  }, [worlds, defaultWorlds]);

  const currentModalWorld = useMemo(() => {
    if (selectedWorld) {
      return worlds.find((w) => w.id === selectedWorld.id) || selectedWorld;
    }
    return ignisWorld;
  }, [selectedWorld, worlds, ignisWorld]);

  const isWorldCompleted = useMemo(() => {
    const targetWorld = currentModalWorld || ignisWorld;
    if (targetWorld.completed) return true;
    const rawMissions = targetWorld.missions || [];
    return rawMissions.length > 0 && rawMissions.every((m) => m.completed);
  }, [currentModalWorld, ignisWorld]);

  // Determine mission statuses: completed, current, available, locked
  const processedMissions = useMemo(() => {
    const targetWorld = currentModalWorld || ignisWorld;
    const rawMissions = targetWorld.missions || [];

    let currentFound = false;

    return rawMissions.map((m) => {
      let state: 'completed' | 'current' | 'available' | 'locked' = 'locked';

      if (m.completed) {
        state = 'completed';
      } else if (m.unlocked && !currentFound && !isWorldCompleted) {
        state = 'current';
        currentFound = true;
      } else if (m.unlocked || isWorldCompleted) {
        state = 'available';
      } else {
        state = 'locked';
      }

      return {
        ...m,
        state,
      };
    });
  }, [currentModalWorld, ignisWorld, isWorldCompleted]);

  const activeMission = useMemo(() => {
    if (isWorldCompleted) {
      return processedMissions[0];
    }
    return processedMissions.find((m) => m.state === 'current') || processedMissions[0];
  }, [processedMissions, isWorldCompleted]);

  const checkIsWorldUnlocked = (world: WorldData): boolean => {
    if (world.worldOrder === 1) return true;
    if (world.unlocked === true) return true;
    if (Boolean(world.unlockedByDefault)) return true;
    if (user?.currentSector != null && user.currentSector >= world.worldOrder) return true;

    // Evaluate preceding world completion
    const prevOrder = world.worldOrder - 1;
    const prevWorld = worlds.find((w) => w.worldOrder === prevOrder);
    if (prevWorld) {
      if (prevWorld.completed) return true;
      if (
        prevWorld.clearedMissionsCount != null &&
        prevWorld.totalMissionsCount != null &&
        prevWorld.totalMissionsCount > 0
      ) {
        return prevWorld.clearedMissionsCount >= prevWorld.totalMissionsCount;
      }
      const prevMissions = prevWorld.missions || [];
      if (prevMissions.length > 0 && prevMissions.every((m) => m.completed)) return true;
    }
    return false;
  };

  const handleWorldClick = (world: WorldData) => {
    const isUnlocked = checkIsWorldUnlocked(world);

    if (!isUnlocked) {
      if (world.unlockRequirementText) {
        setLockedNotice(world.unlockRequirementText);
      } else {
        const prevOrder = world.worldOrder - 1;
        const prevWorld = worlds.find((w) => w.worldOrder === prevOrder);
        const prevName = prevWorld ? prevWorld.name : `Sector 0${prevOrder}`;
        setLockedNotice(
          `Complete all required missions in ${prevName} to unlock ${world.name}.`
        );
      }
      return;
    }
    setLockedNotice(null);
    setSelectedWorld(world);
  };

  if (loading && !hasLoadedBackendData) {
    return (
      <div className="py-24">
        <LoadingState message="ACCESSING GALAXY STAR CHART TELEMETRY..." />
      </div>
    );
  }

  if (error && !hasLoadedBackendData) {
    return (
      <div className="py-24 max-w-lg mx-auto text-center space-y-4">
        <GlassCard className="p-8 border-rose-500/30 text-rose-300 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-base font-bold font-mono uppercase text-white">Subspace Telemetry Interrupted</h2>
          <p className="text-xs text-slate-300 font-mono leading-relaxed">{error}</p>
          <GlowButton variant="primary" size="md" onClick={() => fetchGalaxyData()}>
            RETRY CONNECTION
          </GlowButton>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Map HUD Bar (Clean, Purposeful) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-cyber-cyan/15 border border-cyber-cyan/40 flex items-center justify-center text-cyber-cyan">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-bold text-white font-mono uppercase tracking-wide">
                Galaxy Star Chart
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-emerald/20 text-cyber-emerald font-mono font-bold">
                SECTOR 01 ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Track: <span className="text-cyber-cyan">Java 21 Core</span> &bull; Current Outpost: <span className="text-amber-400">Ignis Station</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <GlowButton
            variant="secondary"
            size="sm"
            onClick={() => navigate('/dashboard')}
            icon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            Dashboard
          </GlowButton>
          <GlowButton
            variant="primary"
            size="sm"
            onClick={() => ignisWorld && handleWorldClick(ignisWorld)}
            icon={<Rocket className="w-3.5 h-3.5" />}
          >
            Open Ignis Directives
          </GlowButton>
        </div>
      </div>

      {/* Locked Sector Notice Banner if user clicks on a locked planet */}
      <AnimatePresence>
        {lockedNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-300 flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{lockedNotice}</span>
            </div>
            <button
              onClick={() => setLockedNotice(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Galaxy Viewport (Calm, Disciplined Star Chart) */}
      <div className="relative w-full min-h-[460px] sm:min-h-[520px] rounded-3xl border border-white/10 bg-space-950/70 backdrop-blur-md overflow-hidden flex items-center justify-center p-4">
        {/* Ambient Starfield */}
        <Starfield />

        {/* Clean Orbital Guides and Connection Route */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <linearGradient id="cleanRoute" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Simple Orbital Arcs */}
          <ellipse cx="50%" cy="50%" rx="42%" ry="32%" fill="none" stroke="rgba(255,255,255,0.06)" strokeDasharray="6 6" />

          {/* Connecting Hyperspace Route */}
          <path
            d="M 22% 52% Q 34% 40%, 46% 34% T 70% 44% T 88% 66%"
            fill="none"
            stroke="url(#cleanRoute)"
            strokeWidth="2.5"
            strokeDasharray="6 4"
            opacity="0.8"
          />
        </svg>

        {/* Dynamic Starship Recon Rocket patrolling hyperspace flight path */}
        <GalaxyRocket
          currentSectorOrder={user?.currentSector || 1}
          activeWorldSlug={selectedWorld?.slug || 'ignis-station'}
          onRocketClick={() => ignisWorld && handleWorldClick(ignisWorld)}
        />

        {/* Render 4 Worlds along the route */}
        <div className="relative z-10 w-full h-full min-h-[440px]">
          {worlds.map((world) => {
            const config = WORLD_CONFIGS[world.worldOrder] || WORLD_CONFIGS[1];
            const isIgnis = world.worldOrder === 1;
            const isUnlocked = checkIsWorldUnlocked(world);

            return (
              <div
                key={world.id}
                style={{
                  left: `${config.coordinates.x}%`,
                  top: `${config.coordinates.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute flex flex-col items-center group cursor-pointer select-none"
                onClick={() => handleWorldClick(world)}
              >
                {/* Planet Disc */}
                <div className="relative flex items-center justify-center">
                  {/* Subtle aura for active unlocked world */}
                  {isUnlocked && (
                    <div
                      className="absolute -inset-3 rounded-full blur-md opacity-30 group-hover:opacity-60 transition-opacity"
                      style={{ backgroundColor: config.glowColor }}
                    />
                  )}

                  <div
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 transition-transform duration-200 shadow-lg group-hover:scale-105 ${
                      isUnlocked
                        ? 'border-cyber-cyan shadow-[0_0_20px_rgba(0,240,255,0.25)]'
                        : 'border-slate-700/60 opacity-60 grayscale'
                    }`}
                  >
                    <img
                      src={config.image}
                      alt={world.name}
                      className="w-full h-full object-cover scale-105"
                    />

                    {/* Locked overlay */}
                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-space-950/70 flex flex-col items-center justify-center text-slate-400">
                        <Lock className="w-5 h-5 mb-0.5" />
                        <span className="text-[9px] font-mono tracking-widest font-bold">LOCKED</span>
                      </div>
                    )}

                    {/* Active Sector Indicator */}
                    {isUnlocked && (
                      <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-cyber-emerald border border-white" />
                    )}
                  </div>
                </div>

                {/* Planet Label */}
                <div className="mt-2.5 text-center space-y-0.5">
                  <div className="flex items-center justify-center space-x-1.5">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        isUnlocked
                          ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30'
                          : 'bg-space-900 text-slate-500 border border-space-800'
                      }`}
                    >
                      {config.code}
                    </span>
                    <span className="text-xs font-bold text-white font-mono group-hover:text-cyber-cyan transition-colors">
                      {world.name}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
                    {world.theme}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend in bottom left */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center space-x-4 px-3.5 py-1.5 rounded-xl bg-space-900/80 border border-white/10 text-[11px] font-mono text-slate-400">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-cyber-emerald" />
            <span>Active Sector</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            <span>Locked Sector</span>
          </div>
        </div>
      </div>

      {/* WORLD MODAL (FOCUSED MISSION SELECTION PANEL) */}
      <AnimatePresence>
        {selectedWorld && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/85 backdrop-blur-md"
            onClick={() => setSelectedWorld(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl rounded-2xl glass-panel border border-cyber-cyan/40 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedWorld(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-space-900 text-slate-400 hover:text-white border border-white/10 transition-colors"
                title="Close Mission Map"
                aria-label="Close Mission Map"
              >
                <X className="w-4 h-4" />
              </button>

              {/* World Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={WORLD_CONFIGS[currentModalWorld?.worldOrder || 1]?.image || ignisImg}
                    alt={currentModalWorld?.name || 'World'}
                    className="w-14 h-14 rounded-xl object-cover border border-cyber-cyan/40 shrink-0"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30">
                        {WORLD_CONFIGS[currentModalWorld?.worldOrder || 1]?.code || 'SECTOR 01'}
                      </span>
                      <span className="text-xs font-mono text-slate-300">
                        {currentModalWorld?.theme}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white font-mono mt-1">
                      {currentModalWorld?.name} Directives
                    </h2>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {isWorldCompleted && (
                    <span className="px-2.5 py-1 rounded-full bg-cyber-emerald/20 border border-cyber-emerald/50 text-cyber-emerald font-bold text-[10px] sm:text-xs tracking-wider flex items-center space-x-1.5 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>WORLD COMPLETED</span>
                    </span>
                  )}
                  <div className="text-xs font-mono text-slate-400 bg-space-900 px-3 py-1.5 rounded-lg border border-white/10">
                    Cleared: <span className="text-cyber-emerald font-bold">
                      {processedMissions.filter((m) => m.state === 'completed').length} / {processedMissions.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mission Progression Pipeline */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
                    {isWorldCompleted ? 'Mastered Directives (All Unlocked for Replay)' : 'Sequenced Missions'}
                  </h3>
                  {isWorldCompleted && (
                    <span className="text-[11px] text-cyber-emerald font-mono flex items-center space-x-1">
                      <RotateCcw className="w-3 h-3" />
                      <span>Free Replay & Practice Enabled</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {processedMissions.map((mission) => {
                    const isCompleted = mission.state === 'completed';
                    const isCurrent = mission.state === 'current';
                    const isAvailable = mission.state === 'available' || isWorldCompleted;
                    const isLocked = mission.state === 'locked' && !isWorldCompleted;

                    return (
                      <div
                        key={mission.id}
                        onClick={() => !isLocked && setLaunchingMission(mission)}
                        className={`rounded-xl p-3.5 border flex flex-col justify-between transition-all select-none text-xs font-mono ${
                          isCurrent
                            ? 'bg-space-900 border-cyber-cyan shadow-[0_0_15px_rgba(0,240,255,0.2)] cursor-pointer ring-1 ring-cyber-cyan'
                            : isCompleted
                            ? 'bg-space-900/60 border-cyber-emerald/40 hover:border-cyber-emerald cursor-pointer'
                            : isAvailable
                            ? 'bg-space-900/80 border-amber-400/50 hover:border-amber-400 cursor-pointer'
                            : 'bg-space-950/40 border-space-850 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                                isCurrent
                                  ? 'bg-cyber-cyan/25 text-cyber-cyan'
                                  : isCompleted
                                  ? 'bg-cyber-emerald/20 text-cyber-emerald'
                                  : isAvailable
                                  ? 'bg-amber-400/20 text-amber-300'
                                  : 'bg-space-800 text-slate-500'
                              }`}
                            >
                              0{mission.missionOrder}
                            </span>

                            {isCompleted && (
                              <span className="flex items-center space-x-1 text-[10px] text-cyber-emerald font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>CLEARED</span>
                              </span>
                            )}

                            {isCurrent && (
                              <span className="flex items-center space-x-1 text-[10px] text-cyber-cyan font-bold">
                                <Play className="w-3 h-3 fill-current" />
                                <span>CURRENT</span>
                              </span>
                            )}

                            {isLocked && (
                              <span className="flex items-center space-x-1 text-[10px] text-slate-500">
                                <Lock className="w-3 h-3" />
                                <span>LOCKED</span>
                              </span>
                            )}
                          </div>

                          <h4 className="font-bold text-white text-xs leading-tight mb-1">
                            {mission.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 line-clamp-2">
                            {mission.javaConcept}
                          </p>
                        </div>

                        <div className="pt-2 mt-2 border-t border-space-800 flex items-center justify-between text-[11px]">
                          <span className="text-amber-400">+{mission.xpReward} XP</span>
                          {!isLocked ? (
                            <span className="text-cyber-cyan flex items-center font-bold">
                              <span>{isCompleted ? 'Replay' : 'Launch'}</span>
                              <ChevronRight className="w-3 h-3" />
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500">Requires M0{Math.max(1, mission.missionOrder - 1)}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Active Mission Launch Bar / World Completed Bar */}
              {isWorldCompleted ? (
                <div className="p-4 rounded-xl bg-space-900 border border-cyber-emerald/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono text-cyber-emerald font-bold uppercase tracking-wider flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Sector Status: Mastered</span>
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyber-emerald/20 text-cyber-emerald font-mono font-bold">
                        5 / 5 CLEARED
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white font-mono">
                      All {currentModalWorld?.name} Directives Completed!
                    </h4>
                    <p className="text-xs text-slate-300 font-mono">
                      Select any mission above to replay for practice. Replays preserve your earned XP and stars.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <GlowButton
                      variant="primary"
                      size="md"
                      onClick={() => activeMission && setLaunchingMission(activeMission)}
                      icon={<RotateCcw className="w-4 h-4" />}
                    >
                      Replay Mission 0{activeMission?.missionOrder || 1}
                    </GlowButton>
                    {currentModalWorld?.worldOrder === 1 && (
                      <GlowButton
                        variant="secondary"
                        size="md"
                        onClick={() => {
                          const w2 = worlds.find((w) => w.worldOrder === 2);
                          if (w2) handleWorldClick(w2);
                        }}
                        icon={<ChevronRight className="w-4 h-4" />}
                      >
                        Sector 02: Kryon Belt
                      </GlowButton>
                    )}
                  </div>
                </div>
              ) : (
                activeMission && (
                  <div className="p-4 rounded-xl bg-space-900 border border-cyber-cyan/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono text-cyber-cyan font-bold uppercase tracking-wider">
                        Next Active Directive
                      </span>
                      <h4 className="text-sm font-bold text-white font-mono">
                        Mission 0{activeMission.missionOrder}: {activeMission.title}
                      </h4>
                      <p className="text-xs text-slate-300 font-mono line-clamp-1">
                        {activeMission.objective}
                      </p>
                    </div>

                    <GlowButton
                      variant="primary"
                      size="md"
                      onClick={() => setLaunchingMission(activeMission)}
                      icon={<Play className="w-4 h-4 fill-current" />}
                    >
                      Launch Mission
                    </GlowButton>
                  </div>
                )
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Meaningful Mission Launch Warp Transition */}
      <MissionLaunchTransition
        isLaunching={Boolean(launchingMission)}
        missionOrder={launchingMission?.missionOrder || 1}
        missionTitle={launchingMission?.title || ''}
        worldName={currentModalWorld?.name || 'IGNIS STATION'}
        javaConcept={launchingMission?.javaConcept || 'Java Basics'}
        onLaunchComplete={() => {
          if (launchingMission) {
            navigate(`/mission/${launchingMission.id}`);
          }
          setLaunchingMission(null);
        }}
        onCancel={() => setLaunchingMission(null)}
      />
    </div>
  );
};

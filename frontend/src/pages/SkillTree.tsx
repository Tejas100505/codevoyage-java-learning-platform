import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Starfield } from '../game/Starfield';
import { GlassCard } from '../components/GlassCard';
import { GlowButton } from '../components/GlowButton';
import { useAuth } from '../context/AuthContext';
import { missionService, SkillTreeNode } from '../services/missionService';
import {
  GitFork,
  CheckCircle2,
  Lock,
  Play,
  Terminal,
  BookOpen,
  Award,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Flame,
  Radio,
  Cpu,
  Layers,
  Activity,
  Code2,
  Compass,
  Zap,
  Info
} from 'lucide-react';

const FALLBACK_TREE: SkillTreeNode[] = [
  {
    id: 'foundation',
    name: 'Java Foundation',
    category: 'Core Architecture',
    state: 'MASTERED',
    masteryPercent: 100,
    description: 'Essential program structure, class declaration, and JVM main method.',
    whatWasLearned: 'Learned class blueprints, public static void main entrypoints, and standard syntax.',
    missionsCompleted: ['Mission 01: System Initialization'],
    codingChallenges: ["Flight Diagnostics Beacon: Transmit 'IGNIS STATION ONLINE'"],
    codexEntryId: 'java-basics',
    targetMissionId: 1,
    parentIds: []
  },
  {
    id: 'output',
    name: 'Console Output',
    category: 'Telemetry IO',
    state: 'MASTERED',
    masteryPercent: 100,
    description: 'Printing text streams via System.out.print() and System.out.println().',
    whatWasLearned: 'Learned difference between print (same line) and println (line carriage feed).',
    missionsCompleted: ['Mission 01: System Initialization'],
    codingChallenges: ['Transmit station online beacon with exact terminal formatting'],
    codexEntryId: 'java-basics',
    targetMissionId: 1,
    parentIds: ['foundation']
  },
  {
    id: 'variables',
    name: 'Variables & Memory',
    category: 'State Management',
    state: 'AVAILABLE',
    masteryPercent: 50,
    description: 'Declaring, allocating, and updating named memory locations.',
    whatWasLearned: 'Learned variable types, declaration syntax, lowerCamelCase naming, and value assignment.',
    missionsCompleted: [],
    codingChallenges: ['Stabilize reactor core by declaring and updating fuel telemetry'],
    codexEntryId: 'variables',
    targetMissionId: 2,
    parentIds: ['foundation']
  },
  {
    id: 'input',
    name: 'Scanner & Input',
    category: 'Telemetry IO',
    state: 'LOCKED',
    masteryPercent: 0,
    description: 'Parsing live input tokens and text streams via java.util.Scanner.',
    whatWasLearned: 'Learned Scanner instantiation, System.in binding, nextLine(), nextInt(), and stream closing.',
    missionsCompleted: [],
    codingChallenges: ['Listen to sub-space distress beacons and echo verified coordinates'],
    codexEntryId: 'input-scanner',
    targetMissionId: 3,
    parentIds: ['variables']
  },
  {
    id: 'operators',
    name: 'Operators & Math',
    category: 'Calculations',
    state: 'LOCKED',
    masteryPercent: 0,
    description: 'Arithmetic operations (+, -, *, /, %), precedence, and compound mutations.',
    whatWasLearned: 'Learned arithmetic calculations, modulus division, operator order of operations, and += shortcuts.',
    missionsCompleted: [],
    codingChallenges: ['Calculate precise thruster burn consumptions and remaining flight reserves'],
    codexEntryId: 'operators',
    targetMissionId: 4,
    parentIds: ['input']
  },
  {
    id: 'conditions',
    name: 'Conditions & Logic',
    category: 'Control Flow',
    state: 'LOCKED',
    masteryPercent: 0,
    description: 'Branching execution paths with if, else-if, else, and boolean logic (&&, ||, !).',
    whatWasLearned: 'Learned boolean comparisons, logical operators, short-circuit evaluation, and multi-tier hazard gating.',
    missionsCompleted: [],
    codingChallenges: ['Evaluate multiple station pressure and radiation readings to grant launch clearance'],
    codexEntryId: 'conditions',
    targetMissionId: 5,
    parentIds: ['operators']
  },
  {
    id: 'loops',
    name: 'Loops & Iterations',
    category: 'Control Flow',
    state: 'LOCKED',
    masteryPercent: 0,
    description: 'Repetitive automation with for, while, do-while, and loop control statements.',
    whatWasLearned: 'Loop bounds, iteration indices, loop termination checks, and cyclic telemetry pulses.',
    missionsCompleted: [],
    codingChallenges: ['Sector 03: Cyclic Pulse Automation'],
    codexEntryId: 'loops',
    targetMissionId: 6,
    parentIds: ['conditions']
  },
  {
    id: 'methods',
    name: 'Methods & Functions',
    category: 'Architecture',
    state: 'LOCKED',
    masteryPercent: 0,
    description: 'Modular subroutines, parameter passing, return types, and code reusability.',
    whatWasLearned: 'DRY architecture, method signatures, return values, and parameters.',
    missionsCompleted: [],
    codingChallenges: ['Sector 04: Quantum Sensor Mesh Subroutines'],
    codexEntryId: 'methods',
    targetMissionId: 7,
    parentIds: ['loops']
  },
  {
    id: 'arrays',
    name: 'Arrays & Collections',
    category: 'Data Structures',
    state: 'LOCKED',
    masteryPercent: 0,
    description: 'Fixed-size ordered indexable collections of data elements.',
    whatWasLearned: 'Array allocation, zero-based indexing, traversal with loops, and bounds checking.',
    missionsCompleted: [],
    codingChallenges: ['Deep Space Cargo Manifest Matrix'],
    codexEntryId: 'variables',
    targetMissionId: 8,
    parentIds: ['methods']
  },
  {
    id: 'oop',
    name: 'Object-Oriented Programming',
    category: 'Ship AI & Models',
    state: 'LOCKED',
    masteryPercent: 0,
    description: 'Classes, objects, encapsulation, constructors, and instance state.',
    whatWasLearned: 'Constructors, private fields, public accessors, and autonomous ship agents.',
    missionsCompleted: [],
    codingChallenges: ['Starship Autonomous Pilot AI Construction'],
    codexEntryId: 'java-basics',
    targetMissionId: 9,
    parentIds: ['arrays']
  }
];

export const SkillTree: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [nodes, setNodes] = useState<SkillTreeNode[]>(FALLBACK_TREE);
  const [selectedNode, setSelectedNode] = useState<SkillTreeNode>(FALLBACK_TREE[0]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchTree = async () => {
      try {
        setLoading(true);
        const data = await missionService.getSkillTree();
        if (isMounted && data && data.length > 0) {
          setNodes(data);
          setSelectedNode(data[0]);
        }
      } catch {
        // Fallback to FALLBACK_TREE
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTree();
    return () => {
      isMounted = false;
    };
  }, []);

  const masteredCount = useMemo(() => nodes.filter((n) => n.state === 'MASTERED').length, [nodes]);
  const overallMasteryPercent = useMemo(() => {
    if (nodes.length === 0) return 0;
    const total = nodes.reduce((sum, n) => sum + n.masteryPercent, 0);
    return Math.round(total / nodes.length);
  }, [nodes]);

  const getStateBadge = (state: SkillTreeNode['state']) => {
    switch (state) {
      case 'MASTERED':
        return (
          <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-cyber-emerald/15 text-cyber-emerald border border-cyber-emerald/40 text-[10px] font-bold">
            <CheckCircle2 className="w-3 h-3" />
            <span>MASTERED</span>
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/40 text-[10px] font-bold">
            <Activity className="w-3 h-3 animate-pulse" />
            <span>IN PROGRESS</span>
          </span>
        );
      case 'AVAILABLE':
        return (
          <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/40 text-[10px] font-bold">
            <Zap className="w-3 h-3" />
            <span>AVAILABLE</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-space-900 text-slate-500 border border-space-800 text-[10px] font-bold">
            <Lock className="w-3 h-3" />
            <span>LOCKED</span>
          </span>
        );
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6 space-y-6 overflow-hidden">
      <Starfield />

      {/* Header Banner */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-space-950/85 border border-cyber-cyan/30 backdrop-blur-xl shadow-glow-cyan/20 font-mono">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-cyber-purple/20 border border-cyber-purple/40 flex items-center justify-center text-cyber-purple shadow-[0_0_30px_rgba(139,92,246,0.3)]">
            <GitFork className="w-6 h-6 rotate-180" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
                JAVA SKILL TREE
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-purple/20 text-cyber-purple font-bold border border-cyber-purple/40">
                DIRECTIVE TELEMETRY
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live branching curriculum architecture. Each node reflects your authentic compiler mastery and opens detailed diagnostics.
            </p>
          </div>
        </div>

        {/* Global Progress Metrics */}
        <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
          <div className="p-2.5 px-4 rounded-2xl bg-space-900 border border-white/10 text-xs">
            <span className="text-slate-400 block text-[10px] uppercase">Mastery Index:</span>
            <span className="text-cyber-cyan font-bold">{overallMasteryPercent}%</span>
          </div>

          <div className="p-2.5 px-4 rounded-2xl bg-space-900 border border-white/10 text-xs">
            <span className="text-slate-400 block text-[10px] uppercase">Nodes Cleared:</span>
            <span className="text-cyber-emerald font-bold">
              {masteredCount} / {nodes.length}
            </span>
          </div>

          <GlowButton
            variant="secondary"
            size="sm"
            onClick={() => navigate('/codex')}
            icon={<BookOpen className="w-3.5 h-3.5 text-amber-400" />}
          >
            JAVA CODEX
          </GlowButton>
        </div>
      </div>

      {/* Main Grid: Interactive Visual Tree Layout on Left, Inspection Drawer on Right */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono">
        {/* Left Column: Branching Interactive Tree Visualizer */}
        <div className="lg:col-span-7 space-y-4">
          <GlassCard glow="cyan" className="p-6 sm:p-8 border-cyber-cyan/30 space-y-6">
            <div className="flex items-center justify-between border-b border-space-800 pb-3">
              <span className="text-xs font-bold text-cyber-cyan uppercase tracking-widest flex items-center space-x-1.5">
                <Layers className="w-4 h-4" />
                <span>CURRICULUM FLOW GRAPH</span>
              </span>
              <span className="text-[10px] text-slate-500">
                Click any node to inspect telemetry
              </span>
            </div>

            {/* Tree Nodes Flow Sequence */}
            <div className="relative space-y-8 py-2">
              {/* LEVEL 1: ROOT (JAVA FOUNDATION) */}
              <div className="flex justify-center">
                <SkillNodeButton
                  node={nodes.find((n) => n.id === 'foundation') || nodes[0]}
                  isSelected={selectedNode.id === 'foundation'}
                  onClick={() => setSelectedNode(nodes.find((n) => n.id === 'foundation') || nodes[0])}
                />
              </div>

              {/* Connecting Split Branch SVG */}
              <div className="flex justify-center -my-4">
                <svg width="340" height="40" className="overflow-visible pointer-events-none">
                  {/* Stem down from foundation */}
                  <line x1="170" y1="0" x2="170" y2="18" stroke="#00f0ff" strokeWidth="2" strokeDasharray="4 2" />
                  {/* Horizontal splitter */}
                  <line x1="85" y1="18" x2="255" y2="18" stroke="#00f0ff" strokeWidth="2" />
                  {/* Down to output */}
                  <line x1="85" y1="18" x2="85" y2="40" stroke="#00f0ff" strokeWidth="2" />
                  {/* Down to variables */}
                  <line x1="255" y1="18" x2="255" y2="40" stroke="#00f0ff" strokeWidth="2" />
                </svg>
              </div>

              {/* LEVEL 2: SPLIT BRANCH (OUTPUT & VARIABLES) */}
              <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                <SkillNodeButton
                  node={nodes.find((n) => n.id === 'output') || nodes[1]}
                  isSelected={selectedNode.id === 'output'}
                  onClick={() => setSelectedNode(nodes.find((n) => n.id === 'output') || nodes[1])}
                />
                <SkillNodeButton
                  node={nodes.find((n) => n.id === 'variables') || nodes[2]}
                  isSelected={selectedNode.id === 'variables'}
                  onClick={() => setSelectedNode(nodes.find((n) => n.id === 'variables') || nodes[2])}
                />
              </div>

              {/* Connecting Vertical Stem down from Variables */}
              <div className="flex justify-center -my-4">
                <svg width="100" height="32" className="overflow-visible pointer-events-none">
                  <line x1="50" y1="0" x2="50" y2="32" stroke="#00f0ff" strokeWidth="2" strokeDasharray="3 3" />
                </svg>
              </div>

              {/* LEVEL 3 to 9: LINEAR PROGRESSION PIPELINE */}
              {['input', 'operators', 'conditions', 'loops', 'methods', 'arrays', 'oop'].map((nodeId, idx, arr) => {
                const node = nodes.find((n) => n.id === nodeId);
                if (!node) return null;

                return (
                  <div key={nodeId} className="flex flex-col items-center">
                    <SkillNodeButton
                      node={node}
                      isSelected={selectedNode.id === node.id}
                      onClick={() => setSelectedNode(node)}
                    />

                    {idx < arr.length - 1 && (
                      <div className="py-2">
                        <div className="w-0.5 h-6 bg-gradient-to-b from-cyber-cyan/60 to-cyber-purple/40" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Node Details Inspector Drawer */}
        <div className="lg:col-span-5 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedNode.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <GlassCard glow="purple" className="p-6 sm:p-8 border-cyber-purple/40 space-y-6">
                {/* Node Top Header */}
                <div className="flex items-start justify-between gap-3 border-b border-space-800 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-cyber-purple uppercase tracking-widest font-bold">
                      NODE TELEMETRY // {selectedNode.category}
                    </span>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                      {selectedNode.name}
                    </h2>
                  </div>
                  {getStateBadge(selectedNode.state)}
                </div>

                {/* Mastery Progress Bar */}
                <div className="p-4 rounded-2xl bg-space-950 border border-space-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 uppercase">CONCEPT MASTERY</span>
                    <span
                      className={`font-bold ${
                        selectedNode.masteryPercent === 100 ? 'text-cyber-emerald' : 'text-cyber-cyan'
                      }`}
                    >
                      {selectedNode.masteryPercent}%
                    </span>
                  </div>
                  <div className="w-full bg-space-900 rounded-full h-2 overflow-hidden border border-white/5">
                    <div
                      className={`h-full transition-all duration-700 ${
                        selectedNode.masteryPercent === 100
                          ? 'bg-cyber-emerald shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                          : 'bg-gradient-to-r from-cyber-cyan to-cyber-purple'
                      }`}
                      style={{ width: `${selectedNode.masteryPercent}%` }}
                    />
                  </div>
                </div>

                {/* 1. What was learned */}
                <div className="space-y-2">
                  <span className="text-[11px] text-slate-400 uppercase tracking-widest font-bold block flex items-center space-x-1.5">
                    <Info className="w-3.5 h-3.5 text-cyber-cyan" />
                    <span>WHAT WAS LEARNED</span>
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed p-4 rounded-2xl bg-space-900/60 border border-space-800">
                    {selectedNode.whatWasLearned}
                  </p>
                </div>

                {/* 2. Missions Completed */}
                <div className="space-y-2">
                  <span className="text-[11px] text-slate-400 uppercase tracking-widest font-bold block flex items-center space-x-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>COMPLETED STARFLEET MISSIONS</span>
                  </span>
                  <div className="space-y-1.5">
                    {selectedNode.missionsCompleted && selectedNode.missionsCompleted.length > 0 ? (
                      selectedNode.missionsCompleted.map((m, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-space-900/80 border border-cyber-emerald/30 text-xs text-cyber-emerald flex items-center space-x-2"
                        >
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>{m}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 rounded-xl bg-space-950 border border-space-800 text-xs text-slate-500">
                        No missions completed for this skill branch yet.
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Coding Challenges */}
                <div className="space-y-2">
                  <span className="text-[11px] text-slate-400 uppercase tracking-widest font-bold block flex items-center space-x-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyber-cyan" />
                    <span>CODING CHALLENGES</span>
                  </span>
                  <div className="space-y-1.5">
                    {(selectedNode.codingChallenges || []).map((ch, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-space-950 border border-space-800 text-xs text-slate-300 flex items-start space-x-2"
                      >
                        <Code2 className="w-4 h-4 text-cyber-cyan shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{ch}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions: Open Codex Entry & Launch Challenge */}
                <div className="pt-4 border-t border-space-800 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <GlowButton
                      variant="secondary"
                      size="md"
                      onClick={() => navigate('/codex')}
                      icon={<BookOpen className="w-4 h-4 text-amber-400" />}
                    >
                      OPEN CODEX
                    </GlowButton>

                    <GlowButton
                      variant="primary"
                      size="md"
                      onClick={() => navigate(`/mission/${selectedNode.targetMissionId || 1}`)}
                      icon={<Play className="w-4 h-4 fill-current text-space-950" />}
                    >
                      {selectedNode.state === 'MASTERED' ? 'REVISIT MISSION' : 'LAUNCH MISSION'}
                    </GlowButton>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

/* Reusable Interactive Skill Tree Node Button */
interface SkillNodeButtonProps {
  node: SkillTreeNode;
  isSelected: boolean;
  onClick: () => void;
}

const SkillNodeButton: React.FC<SkillNodeButtonProps> = ({ node, isSelected, onClick }) => {
  const isMastered = node.state === 'MASTERED';
  const isAvailable = node.state === 'AVAILABLE';
  const isInProgress = node.state === 'IN_PROGRESS';
  const isLocked = node.state === 'LOCKED';

  return (
    <motion.button
      whileHover={{ scale: isLocked ? 1.01 : 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative w-full max-w-sm p-4 rounded-2xl text-left border transition-all duration-300 ${
        isSelected
          ? 'bg-cyber-cyan/20 border-cyber-cyan shadow-[0_0_30px_rgba(0,240,255,0.4)] text-white'
          : isMastered
          ? 'bg-space-900/90 border-cyber-emerald/50 hover:border-cyber-emerald text-slate-200'
          : isInProgress
          ? 'bg-space-900/90 border-amber-500/50 hover:border-amber-400 text-slate-200'
          : isAvailable
          ? 'bg-space-900/90 border-cyber-cyan/40 hover:border-cyber-cyan text-slate-200'
          : 'bg-space-950/70 border-space-800 text-slate-600 opacity-70'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${
              isMastered
                ? 'bg-cyber-emerald/20 border-cyber-emerald text-cyber-emerald'
                : isInProgress
                ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                : isAvailable
                ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan'
                : 'bg-space-950 border-space-800 text-slate-600'
            }`}
          >
            {isMastered ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : isLocked ? (
              <Lock className="w-4 h-4" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">
              {node.category}
            </span>
            <div className="text-sm font-bold text-white tracking-wide">{node.name}</div>
          </div>
        </div>

        <div className="text-right">
          <span
            className={`text-xs font-bold ${
              isMastered ? 'text-cyber-emerald' : isAvailable ? 'text-cyber-cyan' : 'text-slate-500'
            }`}
          >
            {node.masteryPercent}%
          </span>
        </div>
      </div>
    </motion.button>
  );
};

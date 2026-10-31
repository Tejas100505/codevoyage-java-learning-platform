import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/GlassCard';
import { GlowButton } from '../components/GlowButton';
import { 
  Rocket, Globe2, Terminal, Zap, Shield, ChevronRight, 
  Sparkles, CheckCircle2, Play, Code2, Award, Star, 
  Flame, Cpu, ArrowDown, BookOpen, Layers
} from 'lucide-react';
import ignisImg from '../assets/images/ignis_station.jpg';
import byteImg from '../assets/images/byte_guide.jpg';
import hangarImg from '../assets/images/fleet_hangar.jpg';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleStartAdventure = () => {
    if (isAuthenticated) {
      navigate('/sectors');
    } else {
      navigate('/register');
    }
  };

  const handleExploreWorlds = () => {
    navigate('/sectors');
  };

  const howItWorksSteps = [
    { title: 'MISSION', subtitle: 'Receive Starfleet Directive', icon: Rocket, color: 'text-cyber-cyan', border: 'border-cyber-cyan/40' },
    { title: 'LEARN', subtitle: 'Interactive Concept Briefing', icon: BookOpen, color: 'text-cyber-purple', border: 'border-cyber-purple/40' },
    { title: 'PRACTICE', subtitle: 'Quick Knowledge Check', icon: Layers, color: 'text-blue-400', border: 'border-blue-400/40' },
    { title: 'CODE', subtitle: 'Write Real Java 21', icon: Code2, color: 'text-amber-400', border: 'border-amber-400/40' },
    { title: 'RUN', subtitle: 'Isolated Sandbox Compilation', icon: Cpu, color: 'text-emerald-400', border: 'border-emerald-400/40' },
    { title: 'PASS', subtitle: 'Automated Test Verification', icon: CheckCircle2, color: 'text-teal-400', border: 'border-teal-400/40' },
    { title: 'LEVEL UP', subtitle: 'Earn XP, Stars & Sector Unlock', icon: Award, color: 'text-cyber-amber', border: 'border-cyber-amber/50' },
  ];

  const floatingSnippets = [
    `int warpFactor = 9;\nboolean shields = true;`,
    `System.out.println("WARP ENGAGED");`,
    `double delta = corePSI - 14.7;\nif (delta > 50) alert();`,
    `public class Starship {\n  void fireThrusters() { ... }\n}`
  ];

  return (
    <div className="space-y-24 pb-16 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[82vh] flex flex-col justify-center items-center text-center px-4 pt-4">
        {/* Floating Java code snippets in backdrop */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="hidden xl:block absolute left-4 top-12 p-3.5 rounded-xl bg-space-900/80 border border-cyber-cyan/30 text-left font-mono text-[11px] text-cyber-cyan backdrop-blur-md shadow-glow-cyan/20 pointer-events-none"
        >
          <div className="text-[9px] text-slate-500 mb-1">// Telemetry Core</div>
          <pre>{floatingSnippets[0]}</pre>
        </motion.div>

        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="hidden xl:block absolute right-6 top-16 p-3.5 rounded-xl bg-space-900/80 border border-cyber-purple/30 text-left font-mono text-[11px] text-purple-300 backdrop-blur-md shadow-glow-purple/20 pointer-events-none"
        >
          <div className="text-[9px] text-slate-500 mb-1">// Propulsion Diagnostics</div>
          <pre>{floatingSnippets[2]}</pre>
        </motion.div>

        {/* Hero Central Content */}
        <div className="max-w-4xl mx-auto space-y-6 z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono tracking-widest uppercase shadow-glow-cyan/20"
          >
            <Sparkles className="w-4 h-4 text-cyber-cyan animate-spin-slow" />
            <span>Code. Play. Level Up.</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-none uppercase font-mono"
          >
            LEARN JAVA. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-blue-400 to-cyber-purple">
              PLAY THE ADVENTURE.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-mono leading-relaxed"
          >
            Master Java by exploring worlds, completing missions, and solving real coding challenges.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap justify-center items-center gap-4 pt-4"
          >
            <GlowButton
              variant="primary"
              size="lg"
              onClick={handleStartAdventure}
              icon={<Rocket className="w-5 h-5 fill-current" />}
            >
              START YOUR ADVENTURE
            </GlowButton>

            <GlowButton
              variant="secondary"
              size="lg"
              onClick={handleExploreWorlds}
              icon={<Globe2 className="w-5 h-5 text-cyber-purple" />}
            >
              EXPLORE THE WORLD
            </GlowButton>
          </motion.div>
        </div>

        {/* Hero Interactive Game Showcase Stage */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-5xl mt-12 relative rounded-3xl overflow-hidden glass-panel border border-cyber-cyan/30 shadow-2xl group"
        >
          <img
            src={hangarImg}
            alt="Starship Carrier Deck"
            className="w-full h-64 sm:h-96 object-cover object-center group-hover:scale-102 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-space-950/40 to-transparent"></div>

          {/* Floating Robot Companion Pill */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-space-900/90 backdrop-blur-xl border border-white/10 shadow-glow-cyan/20">
            <div className="flex items-center space-x-3 text-left">
              <img
                src={byteImg}
                alt="Byte Companion"
                className="w-12 h-12 rounded-xl object-cover border border-cyber-cyan shadow-glow-cyan/50"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-white font-mono">Byte AI Guide</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyber-emerald/20 text-cyber-emerald font-mono">ACTIVE</span>
                </div>
                <p className="text-xs text-slate-300 font-mono">
                  "Cadet, ship systems on Ignis Station need real Java compilation to activate. Ready?"
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
              <div className="flex items-center space-x-1 text-cyber-amber">
                <Star className="w-4 h-4 fill-current" />
                <span>+100 XP Trial</span>
              </div>
              <span className="text-slate-600">|</span>
              <span className="text-cyber-cyan font-semibold">JDK 21 Sandbox</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. HOW IT WORKS: THE CORE GAME LOOP */}
      <section className="space-y-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyber-purple/10 border border-cyber-purple/30 text-cyber-purple text-xs font-mono">
            <Cpu className="w-3.5 h-3.5" />
            <span>EXECUTION CYCLE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
            HOW THE VOYAGE WORKS
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-mono max-w-xl mx-auto">
            From receiving a starship crisis to compiling code in microsecond execution sandboxes.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {howItWorksSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <GlassCard
                key={step.title}
                interactive
                className={`p-4 text-center border ${step.border} flex flex-col items-center justify-between min-h-[160px]`}
              >
                <div className="w-7 h-7 rounded-full bg-space-950 border border-white/10 text-[11px] font-mono font-bold flex items-center justify-center text-slate-400 mb-2">
                  0{idx + 1}
                </div>
                <div className={`p-3 rounded-xl bg-space-950/80 mb-2 ${step.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className={`text-xs font-bold font-mono tracking-wider ${step.color}`}>
                    {step.title}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono leading-tight">
                    {step.subtitle}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* 3. GAME-BASED LEARNING: REAL JAVA */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono">
            <Terminal className="w-3.5 h-3.5" />
            <span>REAL ARCHITECTURE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-mono leading-tight">
            NO TOY SCRIPTS.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-blue-500">
              REAL JAVA COMPILATION.
            </span>
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed font-mono">
            CodeVoyage is not a simplified block coder or a game with artificial commands like <code className="text-cyber-cyan">move()</code>. Every problem requires real Java syntax: classes, variables, loops, objects, arrays, and standard output.
          </p>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-start space-x-3 p-3 rounded-xl bg-space-900/80 border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-cyber-emerald shrink-0 mt-0.5" />
              <span className="text-slate-300">
                <strong>JDK 21 Isolated Microcontainers:</strong> Submissions compile in real JVM sandboxes with timeouts and memory ceilings.
              </span>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-xl bg-space-900/80 border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-cyber-emerald shrink-0 mt-0.5" />
              <span className="text-slate-300">
                <strong>Dual Test-Case Rigor:</strong> Solutions must pass visible diagnostic tests and rigorous hidden edge-case regression suites.
              </span>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-xl bg-space-900/80 border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-cyber-emerald shrink-0 mt-0.5" />
              <span className="text-slate-300">
                <strong>Zero Direct Host Execution:</strong> Spring Boot securely persists records and delegates to the isolated execution service.
              </span>
            </div>
          </div>
        </div>

        {/* Live Code Lab Preview Card */}
        <GlassCard glow="cyan" className="p-6 space-y-4 border-cyber-cyan/40">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs font-mono">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></div>
              <span className="text-slate-300 ml-2 font-bold">IgnisReactor.java</span>
            </div>
            <span className="text-cyber-cyan">JDK 21</span>
          </div>

          <pre className="p-4 rounded-xl bg-space-950 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed border border-white/5">
{`public class Solution {
    public static void main(String[] args) {
        int coreTemp = 350;
        int maxThreshold = 500;
        
        if (coreTemp < maxThreshold) {
            System.out.println("IGNIS STATION: ONLINE");
        }
    }
}`}
          </pre>

          <div className="p-3 rounded-xl bg-space-900 border border-cyber-emerald/30 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2 text-cyber-emerald">
              <CheckCircle2 className="w-4 h-4" />
              <span>Compilation Successful (820ms)</span>
            </div>
            <span className="text-cyber-amber font-bold">+100 XP EARNED</span>
          </div>
        </GlassCard>
      </section>

      {/* 4. EXPLORE WORLDS: IGNIS STATION SHOWCASE */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono mb-2">
              <Flame className="w-3.5 h-3.5" />
              <span>SECTOR STAR CHART</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
              EXPLORE PLANETARY WORLDS
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
              Begin in the volcanic mining orbit of Ignis Station and navigate across 5 galactic sectors.
            </p>
          </div>

          <GlowButton variant="secondary" size="md" onClick={handleExploreWorlds}>
            View All Sectors
          </GlowButton>
        </div>

        {/* Featured World Card */}
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-amber-500/40 shadow-glow-amber/20 grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 h-64 sm:h-96 relative overflow-hidden">
            <img
              src={ignisImg}
              alt="World 1: Ignis Station"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-space-900 hidden lg:block"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-space-900 via-transparent to-transparent lg:hidden"></div>
          </div>

          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 font-semibold">
                <Flame className="w-4 h-4" />
                <span>WORLD 1 &bull; MINING OUTPOST</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-mono">IGNIS STATION</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-mono">
                An industrial mining base orbiting a volatile gas dwarf star. Cold fusion reactors must be reignited by writing Java console handshakes, declaring system memory, and resolving critical pressure deltas.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-space-950 border border-white/5">
                  <span className="text-slate-500 block text-[10px]">MISSIONS</span>
                  <span className="text-white font-bold text-base">5 Missions</span>
                </div>
                <div className="p-3 rounded-xl bg-space-950 border border-white/5">
                  <span className="text-slate-500 block text-[10px]">TARGET CONCEPTS</span>
                  <span className="text-cyber-cyan font-bold text-base">Basics to Logic</span>
                </div>
              </div>

              <GlowButton
                variant="primary"
                size="md"
                className="w-full"
                onClick={handleStartAdventure}
                icon={<ChevronRight className="w-4 h-4" />}
              >
                Enter Ignis Station
              </GlowButton>
            </div>
          </div>
        </div>
      </section>

      {/* 5. JAVA LEARNING JOURNEY */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono">
            <BookOpen className="w-3.5 h-3.5" />
            <span>SYLLABUS MAP</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
            THE JAVA LEARNING JOURNEY
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-mono max-w-xl mx-auto">
            Structured step-by-step from zero knowledge to complete object-oriented mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard glow="cyan" className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan font-mono font-bold">
              01
            </div>
            <h3 className="text-lg font-bold text-white font-mono">Phase 1: Reactor Ignition</h3>
            <p className="text-xs text-slate-400 font-mono leading-relaxed">
              Variables, primitive data types, explicit type casting, arithmetic operators, and console I/O formatting.
            </p>
          </GlassCard>

          <GlassCard glow="purple" className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyber-purple/10 border border-cyber-purple/30 flex items-center justify-center text-cyber-purple font-mono font-bold">
              02
            </div>
            <h3 className="text-lg font-bold text-white font-mono">Phase 2: Orbital Trajectories</h3>
            <p className="text-xs text-slate-400 font-mono leading-relaxed">
              Branching conditionals, switch expressions, while/for loops, and cyclical telemetry algorithms.
            </p>
          </GlassCard>

          <GlassCard glow="amber" className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyber-amber/10 border border-cyber-amber/30 flex items-center justify-center text-cyber-amber font-mono font-bold">
              03
            </div>
            <h3 className="text-lg font-bold text-white font-mono">Phase 3: Fleet Commander</h3>
            <p className="text-xs text-slate-400 font-mono leading-relaxed">
              Object-Oriented Programming, classes, encapsulation, modular inheritance, and fleet memory arrays.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* 6. GAMIFICATION: REWARDS & RANKS */}
      <section className="p-8 sm:p-12 rounded-3xl glass-panel border border-white/10 relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan mx-auto">
              <Zap className="w-6 h-6" />
            </div>
            <div className="text-2xl font-black text-white font-mono">Pilot XP</div>
            <p className="text-xs text-slate-400 font-mono">Earn experience with every passed test case.</p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-cyber-amber/10 border border-cyber-amber/30 flex items-center justify-center text-cyber-amber mx-auto">
              <Star className="w-6 h-6 fill-current" />
            </div>
            <div className="text-2xl font-black text-white font-mono">Flight Stars</div>
            <p className="text-xs text-slate-400 font-mono">Achieve 3-star ratings on clean code solutions.</p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
              <Flame className="w-6 h-6 fill-current" />
            </div>
            <div className="text-2xl font-black text-white font-mono">Daily Streaks</div>
            <p className="text-xs text-slate-400 font-mono">Daily consistency multiplies your energy coins.</p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-cyber-purple/10 border border-cyber-purple/30 flex items-center justify-center text-cyber-purple mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <div className="text-2xl font-black text-white font-mono">Commendations</div>
            <p className="text-xs text-slate-400 font-mono">Unlock system badges as your mastery grows.</p>
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA: LAUNCH ADVENTURE */}
      <section className="text-center p-12 sm:p-16 rounded-3xl glass-panel border border-cyber-cyan/40 shadow-glow-cyan/20 space-y-6 relative overflow-hidden">
        <div className="space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-black text-white font-mono tracking-tight leading-tight">
            YOUR STARSHIP AWAITS COMMAND.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed">
            Ignis Station is waiting for code calibration. Join hundreds of cadet explorers mastering Java through space missions today.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <GlowButton
            variant="primary"
            size="lg"
            onClick={handleStartAdventure}
            icon={<Rocket className="w-5 h-5 fill-current" />}
          >
            START YOUR ADVENTURE
          </GlowButton>

          <GlowButton
            variant="secondary"
            size="lg"
            onClick={handleExploreWorlds}
            icon={<Globe2 className="w-5 h-5 text-cyber-purple" />}
          >
            EXPLORE THE WORLD
          </GlowButton>
        </div>
      </section>
    </div>
  );
};

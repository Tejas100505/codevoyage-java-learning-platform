import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Starfield } from '../game/Starfield';
import { GlassCard } from '../components/GlassCard';
import { GlowButton } from '../components/GlowButton';
import { useAuth } from '../context/AuthContext';
import { missionService, UserProgressItem } from '../services/missionService';
import { JAVA_CODEX_DATA, CodexEntry } from '../data/javaCodexData';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  Unlock,
  Terminal,
  Code2,
  AlertTriangle,
  Lightbulb,
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Bookmark,
  Layers,
  Copy,
  Check
} from 'lucide-react';

export const JavaCodex: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [userProgress, setUserProgress] = useState<UserProgressItem[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<CodexEntry>(JAVA_CODEX_DATA[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SYNTAX' | 'MISTAKES' | 'CHALLENGE'>('OVERVIEW');

  useEffect(() => {
    let isMounted = true;
    const loadProgress = async () => {
      try {
        const prog = await missionService.getUserProgress();
        if (isMounted) {
          setUserProgress(prog);
        }
      } catch {
        // Non-blocking fallback
      }
    };
    loadProgress();
    return () => {
      isMounted = false;
    };
  }, []);

  // Determine if a mission order is completed or unlocked by user
  const highestClearedMission = useMemo(() => {
    if (!userProgress || userProgress.length === 0) {
      // Default: If user is at mission 1, they have unlocked Java Basics
      return 1;
    }
    const completedOrders = userProgress
      .filter((p) => p.completed)
      .map((p) => {
        // Find mission order from ID
        return p.missionId;
      });

    return completedOrders.length > 0 ? Math.max(...completedOrders) : 1;
  }, [userProgress]);

  // Check if an entry is unlocked
  const isUnlocked = (entry: CodexEntry): boolean => {
    // Java Basics is unlocked for everyone from start
    if (entry.missionRequirementOrder <= 1) return true;

    // Check if the required mission was completed or unlocked
    const progressItem = userProgress.find((p) => p.missionId === entry.missionRequirementOrder);
    if (progressItem && (progressItem.completed || progressItem.unlocked)) {
      return true;
    }

    // Alternatively check by highest cleared mission
    return highestClearedMission >= entry.missionRequirementOrder;
  };

  const unlockedCount = useMemo(() => {
    return JAVA_CODEX_DATA.filter((e) => isUnlocked(e)).length;
  }, [userProgress, highestClearedMission]);

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return JAVA_CODEX_DATA;
    const q = searchQuery.toLowerCase();
    return JAVA_CODEX_DATA.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.definition.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6 space-y-6 overflow-hidden">
      <Starfield />

      {/* Top Header Banner */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-space-950/85 border border-cyber-cyan/30 backdrop-blur-xl shadow-glow-cyan/20 font-mono">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-cyber-cyan/15 border border-cyber-cyan/40 flex items-center justify-center text-cyber-cyan shadow-glow-cyan/30">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
                STARFLEET JAVA CODEX
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-emerald/20 text-cyber-emerald font-bold border border-cyber-emerald/40">
                ACTIVE REVISION REPOSITORY
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Personal in-game Java engineering encyclopedia. Each concept activates upon field mastery and remains permanently accessible.
            </p>
          </div>
        </div>

        {/* Collectible Telemetry Badge */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
          <div className="px-4 py-2 rounded-2xl bg-space-900/90 border border-white/10 text-xs flex items-center space-x-2">
            <Bookmark className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300">Concepts Unlocked:</span>
            <span className="text-cyber-cyan font-bold">
              {unlockedCount} / {JAVA_CODEX_DATA.length}
            </span>
          </div>

          <GlowButton
            variant="secondary"
            size="sm"
            onClick={() => navigate('/codelab')}
            icon={<Terminal className="w-3.5 h-3.5" />}
          >
            OPEN CODELAB
          </GlowButton>
        </div>
      </div>

      {/* Search & Main Layout Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono">
        {/* Left Column: Index Menu of Concepts */}
        <div className="lg:col-span-4 space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search concepts, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-space-950/80 border border-white/10 focus:border-cyber-cyan/50 text-xs text-white placeholder-slate-500 outline-none backdrop-blur-xl transition-colors"
            />
          </div>

          {/* List of Concepts (Structure requested: Java Basics ✓, Variables ✓, Data Types ✓, Input 🔒, etc.) */}
          <div className="p-3 rounded-3xl glass-panel border border-white/10 space-y-1.5 max-h-[calc(100vh-17rem)] overflow-y-auto">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 py-1.5 block">
              CODEX MANIFEST // CHAPTER 01
            </span>

            {filteredEntries.map((entry) => {
              const unlocked = isUnlocked(entry);
              const isSelected = selectedEntry.id === entry.id;

              return (
                <button
                  key={entry.id}
                  onClick={() => setSelectedEntry(entry)}
                  className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-cyber-cyan/20 border border-cyber-cyan text-white shadow-glow-cyan/20'
                      : unlocked
                      ? 'bg-space-900/60 hover:bg-space-850/80 border border-transparent text-slate-300'
                      : 'bg-space-950/40 border border-transparent text-slate-500 hover:text-slate-400'
                  }`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'bg-cyber-cyan text-space-950 border-cyber-cyan'
                          : unlocked
                          ? 'bg-cyber-emerald/15 border-cyber-emerald/40 text-cyber-emerald'
                          : 'bg-space-900 border-space-800 text-slate-600'
                      }`}
                    >
                      {unlocked ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <Lock className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold truncate flex items-center space-x-1.5">
                        <span>{entry.title}</span>
                        {unlocked && (
                          <span className="text-cyber-emerald text-[11px] font-bold">✓</span>
                        )}
                        {!unlocked && (
                          <span className="text-slate-500 text-[10px]">🔒</span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 block truncate">
                        {entry.category}
                      </span>
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isSelected ? 'text-cyber-cyan translate-x-0.5' : 'text-slate-600'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Codex Entry Reader Window */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedEntry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {isUnlocked(selectedEntry) ? (
                /* UNLOCKED CODEX ENTRY VIEW */
                <GlassCard glow="cyan" className="p-6 sm:p-8 border-cyber-cyan/40 space-y-6">
                  {/* Entry Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-space-800 pb-5">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-cyber-cyan uppercase tracking-wider">
                          CONCEPT 0{selectedEntry.conceptOrder} // {selectedEntry.category}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyber-emerald/15 text-cyber-emerald border border-cyber-emerald/30 font-bold">
                          ACQUIRED ✓
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                        {selectedEntry.title}
                      </h2>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex items-center space-x-1 p-1 rounded-xl bg-space-900 border border-space-800 text-[11px]">
                      {(['OVERVIEW', 'SYNTAX', 'MISTAKES', 'CHALLENGE'] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`px-3 py-1.5 rounded-lg transition-all ${
                            activeTab === tab
                              ? 'bg-cyber-cyan text-space-950 font-bold shadow-glow-cyan/30'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* TAB 1: OVERVIEW */}
                  {activeTab === 'OVERVIEW' && (
                    <div className="space-y-6">
                      {/* Concept Definition */}
                      <div className="space-y-2">
                        <span className="text-[11px] text-slate-400 uppercase tracking-widest block font-bold">
                          DEFINITION & PURPOSE
                        </span>
                        <p className="text-sm text-slate-200 leading-relaxed p-4 rounded-2xl bg-space-900/60 border border-space-800">
                          {selectedEntry.definition}
                        </p>
                      </div>

                      {/* Small Quick-Reference Example */}
                      <div className="space-y-2">
                        <span className="text-[11px] text-slate-400 uppercase tracking-widest block font-bold">
                          MINIMAL CODE PATTERN
                        </span>
                        <div className="p-3.5 rounded-2xl bg-space-950 border border-cyber-cyan/30 font-mono text-sm text-cyber-cyan flex items-center justify-between">
                          <code>{selectedEntry.smallExample}</code>
                          <button
                            onClick={() => handleCopyCode(selectedEntry.smallExample)}
                            className="text-slate-400 hover:text-white transition-colors"
                          >
                            {copiedCode ? <Check className="w-4 h-4 text-cyber-emerald" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Key Takeaways */}
                      <div className="space-y-2">
                        <span className="text-[11px] text-slate-400 uppercase tracking-widest block font-bold">
                          KEY PROTOCOLS
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {selectedEntry.keyTakeaways.map((k, idx) => (
                            <div
                              key={idx}
                              className="p-3.5 rounded-2xl bg-space-900/40 border border-space-800 text-xs text-slate-300 space-y-1"
                            >
                              <div className="text-amber-400 font-bold text-[10px]">RULE 0{idx + 1}</div>
                              <p className="leading-relaxed">{k}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: SYNTAX & ANATOMY */}
                  {activeTab === 'SYNTAX' && (
                    <div className="space-y-6">
                      {/* Syntax Block with Copy button */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">
                            JAVA 21 CANONICAL SYNTAX
                          </span>
                          <button
                            onClick={() => handleCopyCode(selectedEntry.syntax)}
                            className="text-[11px] text-cyber-cyan hover:underline flex items-center space-x-1"
                          >
                            {copiedCode ? <Check className="w-3.5 h-3.5 text-cyber-emerald" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedCode ? 'COPIED TO CLIPBOARD' : 'COPY CODE'}</span>
                          </button>
                        </div>

                        <pre className="p-4 rounded-2xl bg-space-950 border border-cyber-cyan/40 text-xs text-cyber-cyan overflow-x-auto leading-relaxed">
                          {selectedEntry.syntax}
                        </pre>
                      </div>

                      {/* Token-by-Token Syntax Breakdown (Variables Example: int -> stores whole numbers, fuel -> name, 100 -> value) */}
                      {selectedEntry.syntaxBreakdown && selectedEntry.syntaxBreakdown.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">
                            ANATOMY BREAKDOWN
                          </span>
                          <div className="space-y-2">
                            {selectedEntry.syntaxBreakdown.map((item, idx) => (
                              <div
                                key={idx}
                                className="p-3 rounded-2xl bg-space-900/80 border border-space-800 flex items-center space-x-4 text-xs"
                              >
                                <code className="px-2.5 py-1 rounded-lg bg-space-950 text-amber-400 font-bold border border-amber-500/30 shrink-0">
                                  {item.token}
                                </code>
                                <span className="text-slate-400">&rarr;</span>
                                <span className="text-slate-200">{item.description}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Full Working Example */}
                      <div className="space-y-2">
                        <span className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">
                          EXECUTABLE EXAMPLE
                        </span>
                        <pre className="p-4 rounded-2xl bg-space-950 border border-space-800 text-xs text-slate-200 overflow-x-auto leading-relaxed">
                          {selectedEntry.example}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: COMMON MISTAKES & COMPILER ANOMALIES */}
                  {activeTab === 'MISTAKES' && (
                    <div className="space-y-4">
                      <span className="text-[11px] text-slate-400 uppercase tracking-widest font-bold block">
                        BEGINNER HAZARDS & DIAGNOSTIC FIXES
                      </span>

                      <div className="space-y-3">
                        {selectedEntry.commonMistakes.map((m, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2 text-xs"
                          >
                            <div className="flex items-center space-x-2 text-rose-400 font-bold">
                              <AlertTriangle className="w-4 h-4 shrink-0" />
                              <span>Hazard: {m.mistake}</span>
                            </div>
                            <div className="text-[11px] text-rose-200/80 pl-6">
                              <span className="text-slate-400">Compiler Symptom:</span> {m.consequence}
                            </div>
                            <div className="text-[11px] text-cyber-emerald pl-6 flex items-start space-x-1.5 pt-1">
                              <span className="font-bold">Remedy:</span>
                              <span>{m.fix}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: RELATED MISSIONS */}
                  {activeTab === 'CHALLENGE' && (
                    <div className="space-y-4">
                      <span className="text-[11px] text-slate-400 uppercase tracking-widest font-bold block">
                        LINKED STARFLEET DIRECTIVES
                      </span>

                      <div className="p-5 rounded-3xl bg-space-900/80 border border-cyber-cyan/30 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-cyber-cyan">
                            {selectedEntry.relatedChallenge.title}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-space-800 text-slate-300">
                            PRACTICE DIRECTIVE
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {selectedEntry.relatedChallenge.objective}
                        </p>

                        <div className="pt-2">
                          <GlowButton
                            variant="primary"
                            size="md"
                            onClick={() => navigate(`/mission/${selectedEntry.relatedChallenge.missionId}`)}
                            icon={<ArrowRight className="w-4 h-4 text-space-950" />}
                          >
                            REVISIT CODING MISSION
                          </GlowButton>
                        </div>
                      </div>
                    </div>
                  )}
                </GlassCard>
              ) : (
                /* LOCKED CODEX ENTRY VIEW */
                <GlassCard glow="none" className="p-8 sm:p-12 border-space-800 text-center space-y-5">
                  <div className="w-20 h-20 rounded-3xl bg-space-900/90 border border-slate-700 mx-auto flex items-center justify-center text-slate-500 shadow-xl">
                    <Lock className="w-10 h-10" />
                  </div>

                  <div className="space-y-2 max-w-md mx-auto">
                    <span className="text-xs text-amber-500 font-bold uppercase tracking-widest">
                      CLASSIFIED TELEMETRY // ENCRYPTED
                    </span>
                    <h3 className="text-2xl font-black text-white uppercase">
                      {selectedEntry.title} (LOCKED)
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      This Java knowledge module requires completion of Starfleet directive:{' '}
                      <span className="text-cyber-cyan font-bold">
                        Mission 0{selectedEntry.missionRequirementOrder}
                      </span>
                      . Complete the earlier orbital missions to unlock this Codex entry permanently.
                    </p>
                  </div>

                  <div className="pt-4">
                    <GlowButton
                      variant="primary"
                      size="md"
                      onClick={() => navigate(`/mission/${selectedEntry.missionRequirementOrder}`)}
                      icon={<ArrowRight className="w-4 h-4 text-space-950" />}
                    >
                      LAUNCH MISSION 0{selectedEntry.missionRequirementOrder}
                    </GlowButton>
                  </div>
                </GlassCard>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lesson } from '../services/missionService';
import { GlassCard } from './GlassCard';
import { GlowButton } from './GlowButton';
import {
  HelpCircle,
  Lightbulb,
  Terminal,
  Code2,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Layers,
  Play,
  RotateCcw,
  Zap,
  Info
} from 'lucide-react';

interface ConceptEngineProps {
  lesson: Lesson;
  conceptTitle: string;
  worldName?: string;
  onProceedToPractice: () => void;
  onBackToStory: () => void;
}

type ConceptTab = 'WHY' | 'CONCEPT' | 'VISUAL' | 'SYNTAX' | 'INTERACTIVE' | 'MISTAKES' | 'SUMMARY';

interface TabItem {
  id: ConceptTab;
  label: string;
  icon: React.ElementType;
}

const TABS: TabItem[] = [
  { id: 'WHY', label: '1. Why Needed', icon: HelpCircle },
  { id: 'CONCEPT', label: '2. Concept', icon: BookOpen },
  { id: 'VISUAL', label: '3. Visual Model', icon: Layers },
  { id: 'SYNTAX', label: '4. Java Syntax', icon: Code2 },
  { id: 'INTERACTIVE', label: '5. Try It Live', icon: Play },
  { id: 'MISTAKES', label: '6. Gotchas & Pitfalls', icon: AlertTriangle },
  { id: 'SUMMARY', label: '7. Key Directive', icon: Lightbulb },
];

export const ConceptEngine: React.FC<ConceptEngineProps> = ({
  lesson,
  conceptTitle,
  worldName = 'Ignis Station',
  onProceedToPractice,
  onBackToStory,
}) => {
  const [activeTab, setActiveTab] = useState<ConceptTab>('WHY');

  // Parse structured data safely with fallbacks
  const visualData = useMemo(() => {
    if (!lesson.visualRepJson) return null;
    try {
      return JSON.parse(lesson.visualRepJson);
    } catch {
      return null;
    }
  }, [lesson.visualRepJson]);

  const syntaxList = useMemo(() => {
    if (!lesson.syntaxBreakdownJson) return [];
    try {
      return JSON.parse(lesson.syntaxBreakdownJson);
    } catch {
      return [];
    }
  }, [lesson.syntaxBreakdownJson]);

  const mistakesList = useMemo(() => {
    if (!lesson.commonMistakesJson) return [];
    try {
      return JSON.parse(lesson.commonMistakesJson);
    } catch {
      return [];
    }
  }, [lesson.commonMistakesJson]);

  const interactiveOptions = useMemo(() => {
    if (!lesson.interactiveOptionsJson) return [];
    try {
      return JSON.parse(lesson.interactiveOptionsJson);
    } catch {
      return [];
    }
  }, [lesson.interactiveOptionsJson]);

  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number>(0);

  const currentOption = interactiveOptions[selectedOptionIdx] || null;

  return (
    <div className="space-y-6">
      {/* Concept Header HUD */}
      <GlassCard glow="cyan" className="p-6 border-cyber-cyan/40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-space-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40 uppercase">
                JAVA 21 LEARNING ENGINE
              </span>
              <span className="text-xs font-mono text-slate-400 uppercase">
                {worldName}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight uppercase">
              {lesson.title || conceptTitle}
            </h2>
          </div>

          <span className="px-3 py-1 rounded-full bg-cyber-purple/20 border border-cyber-purple/40 text-cyber-purple text-xs font-mono font-bold">
            {conceptTitle}
          </span>
        </div>

        {/* Small Interactive Step Navigator Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 pt-4">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-2.5 rounded-xl font-mono text-xs transition-all flex flex-col items-center justify-center space-y-1 border ${
                  isActive
                    ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan shadow-glow-cyan/20 font-bold'
                    : 'bg-space-950/60 border-space-800 text-slate-400 hover:text-slate-200 hover:bg-space-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyber-cyan' : 'text-slate-500'}`} />
                <span className="text-[11px] truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Dynamic Interactive Concept View Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* 1. WHY NEEDED */}
          {activeTab === 'WHY' && (
            <GlassCard glow="amber" className="p-6 sm:p-8 border-amber-500/30 space-y-6">
              <div className="flex items-center space-x-3 text-amber-400 font-mono">
                <HelpCircle className="w-5 h-5 shrink-0" />
                <h3 className="text-lg font-bold uppercase tracking-wider text-white">
                  Why Does A Starship Need This Java Concept?
                </h3>
              </div>

              <div className="p-5 rounded-2xl bg-space-950/80 border border-amber-500/20 text-slate-200 font-mono text-sm leading-relaxed space-y-3">
                <p>
                  {lesson.whyNeeded ||
                    lesson.conceptSummary ||
                    'Without this fundamental Java structure, the ship mainframe cannot orient itself, store critical status values, or process telemetry instructions.'}
                </p>
                <div className="p-3 rounded-xl bg-space-900 border border-white/5 text-xs text-amber-300/90 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>
                    Core Principle: We never write arbitrary commands. Every line of Java fulfills a genuine technical purpose in software engineering.
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <GlowButton
                  variant="primary"
                  size="md"
                  onClick={() => setActiveTab('CONCEPT')}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  NEXT: UNDERSTAND CONCEPT
                </GlowButton>
              </div>
            </GlassCard>
          )}

          {/* 2. CONCEPT EXPLANATION */}
          {activeTab === 'CONCEPT' && (
            <GlassCard glow="cyan" className="p-6 sm:p-8 border-cyber-cyan/30 space-y-6">
              <div className="flex items-center space-x-3 text-cyber-cyan font-mono">
                <BookOpen className="w-5 h-5 shrink-0" />
                <h3 className="text-lg font-bold uppercase tracking-wider text-white">
                  Foundational Concept Blueprint
                </h3>
              </div>

              <div className="prose prose-invert max-w-none text-slate-300 font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-line p-5 rounded-2xl bg-space-950/70 border border-space-800">
                {lesson.detailedExplanation}
              </div>

              <div className="flex justify-between items-center pt-2">
                <GlowButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveTab('WHY')}
                  icon={<ArrowLeft className="w-3.5 h-3.5" />}
                >
                  PREVIOUS
                </GlowButton>
                <GlowButton
                  variant="primary"
                  size="md"
                  onClick={() => setActiveTab('VISUAL')}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  NEXT: VISUAL MODEL
                </GlowButton>
              </div>
            </GlassCard>
          )}

          {/* 3. VISUAL REPRESENTATION */}
          {activeTab === 'VISUAL' && (
            <GlassCard glow="purple" className="p-6 sm:p-8 border-cyber-purple/40 space-y-6">
              <div className="flex items-center space-x-3 text-cyber-purple font-mono">
                <Layers className="w-5 h-5 shrink-0" />
                <h3 className="text-lg font-bold uppercase tracking-wider text-white">
                  {visualData?.title || 'Visual System Architecture'}
                </h3>
              </div>

              {visualData && visualData.nodes && visualData.nodes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {visualData.nodes.map((node: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-space-950 border border-space-700/80 shadow-inner space-y-2.5 relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/40 font-bold uppercase">
                          {node.role}
                        </span>
                        <span className="text-xs font-mono text-slate-500">0{idx + 1}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white font-mono text-cyber-cyan truncate">
                        {node.label}
                      </h4>
                      <p className="text-xs text-slate-300 font-mono leading-relaxed">
                        {node.desc}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-space-950 text-slate-400 font-mono text-xs text-center">
                  Visual blueprint synchronized with starship telemetry.
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <GlowButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveTab('CONCEPT')}
                  icon={<ArrowLeft className="w-3.5 h-3.5" />}
                >
                  PREVIOUS
                </GlowButton>
                <GlowButton
                  variant="primary"
                  size="md"
                  onClick={() => setActiveTab('SYNTAX')}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  NEXT: JAVA SYNTAX
                </GlowButton>
              </div>
            </GlassCard>
          )}

          {/* 4. JAVA SYNTAX */}
          {activeTab === 'SYNTAX' && (
            <GlassCard glow="cyan" className="p-6 sm:p-8 border-cyber-cyan/40 space-y-6">
              <div className="flex items-center space-x-3 text-cyber-cyan font-mono">
                <Code2 className="w-5 h-5 shrink-0" />
                <h3 className="text-lg font-bold uppercase tracking-wider text-white">
                  Real Java Syntax Breakdown
                </h3>
              </div>

              {/* Verified Sample Code */}
              <div className="space-y-2 font-mono">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">
                  VERIFIED JAVA 21 SYNTAX SAMPLE:
                </span>
                <pre className="p-4 rounded-2xl bg-space-950 border border-space-800 text-xs text-cyber-cyan overflow-x-auto leading-relaxed shadow-inner">
                  {lesson.sampleJavaCode}
                </pre>
              </div>

              {/* Syntax Dissection Table */}
              {syntaxList.length > 0 && (
                <div className="space-y-3 pt-2">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    TOKEN BY TOKEN SPECIFICATION:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {syntaxList.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-space-900 border border-space-800 font-mono text-xs space-y-1"
                      >
                        <span className="font-bold text-amber-300">{item.keyword}</span>
                        <p className="text-slate-300 text-[11px] leading-relaxed">{item.meaning}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <GlowButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveTab('VISUAL')}
                  icon={<ArrowLeft className="w-3.5 h-3.5" />}
                >
                  PREVIOUS
                </GlowButton>
                <GlowButton
                  variant="primary"
                  size="md"
                  onClick={() => setActiveTab('INTERACTIVE')}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  NEXT: INTERACTIVE DEMO
                </GlowButton>
              </div>
            </GlassCard>
          )}

          {/* 5. INTERACTIVE DEMO */}
          {activeTab === 'INTERACTIVE' && (
            <GlassCard glow="emerald" className="p-6 sm:p-8 border-cyber-emerald/40 space-y-6">
              <div className="flex items-center space-x-3 text-cyber-emerald font-mono">
                <Play className="w-5 h-5 shrink-0" />
                <h3 className="text-lg font-bold uppercase tracking-wider text-white">
                  Interactive Simulator — Experiment Before Coding
                </h3>
              </div>

              <p className="text-xs font-mono text-slate-300">
                Select a telemetry configuration below to observe how the Java Virtual Machine interprets your variables and output streams:
              </p>

              {/* Options Selector */}
              {interactiveOptions.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {interactiveOptions.map((opt: any, idx: number) => {
                    const isSelected = selectedOptionIdx === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedOptionIdx(idx)}
                        className={`p-3.5 rounded-xl text-left font-mono text-xs transition-all border ${
                          isSelected
                            ? 'bg-cyber-emerald/20 border-cyber-emerald text-white shadow-glow-emerald'
                            : 'bg-space-950/60 border-space-800 text-slate-400 hover:text-slate-200 hover:bg-space-900'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="w-5 h-5 rounded-full bg-space-800 flex items-center justify-center text-[10px] font-bold text-cyber-emerald shrink-0">
                            0{idx + 1}
                          </span>
                          <span className="font-bold">{opt.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Active Simulation Preview Box */}
              {currentOption && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <Code2 className="w-3.5 h-3.5 text-cyber-cyan" />
                      <span>JAVA CODE APPLIED:</span>
                    </span>
                    <pre className="p-4 rounded-xl bg-space-950 border border-space-800 text-xs font-mono text-cyber-cyan whitespace-pre-wrap leading-relaxed shadow-inner">
                      {currentOption.code}
                    </pre>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <Terminal className="w-3.5 h-3.5 text-cyber-emerald" />
                      <span>EVALUATED CONSOLE OUTPUT:</span>
                    </span>
                    <div className="p-4 rounded-xl bg-space-950 border border-cyber-emerald/30 font-mono text-xs text-cyber-emerald whitespace-pre-wrap leading-relaxed shadow-inner">
                      {currentOption.preview}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <GlowButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveTab('SYNTAX')}
                  icon={<ArrowLeft className="w-3.5 h-3.5" />}
                >
                  PREVIOUS
                </GlowButton>
                <GlowButton
                  variant="primary"
                  size="md"
                  onClick={() => setActiveTab('MISTAKES')}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  NEXT: COMMON MISTAKES
                </GlowButton>
              </div>
            </GlassCard>
          )}

          {/* 6. COMMON BEGINNER MISTAKES */}
          {activeTab === 'MISTAKES' && (
            <GlassCard glow="cyan" className="p-6 sm:p-8 border-rose-500/40 space-y-6">
              <div className="flex items-center space-x-3 text-rose-400 font-mono">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <h3 className="text-lg font-bold uppercase tracking-wider text-white">
                  Common Beginner Pitfalls & Compiler Gotchas
                </h3>
              </div>

              <div className="space-y-4">
                {mistakesList.length > 0 ? (
                  mistakesList.map((m: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-space-950 border border-rose-500/30 font-mono text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between text-rose-300 font-bold">
                        <span className="flex items-center space-x-2">
                          <span className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-[10px]">
                            ✗
                          </span>
                          <span>Mistake: {m.mistake}</span>
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          {m.consequence}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-space-900 border border-space-800 text-cyber-emerald flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-cyber-emerald" />
                        <span>Cadet Fix: {m.fix}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-5 rounded-xl bg-space-950 text-slate-400 font-mono text-xs">
                    Watch out for semicolons, proper case sensitivity, and type compatibility!
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-2">
                <GlowButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveTab('INTERACTIVE')}
                  icon={<ArrowLeft className="w-3.5 h-3.5" />}
                >
                  PREVIOUS
                </GlowButton>
                <GlowButton
                  variant="primary"
                  size="md"
                  onClick={() => setActiveTab('SUMMARY')}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  NEXT: SUMMARY DIRECTIVE
                </GlowButton>
              </div>
            </GlassCard>
          )}

          {/* 7. SUMMARY & PROCEED */}
          {activeTab === 'SUMMARY' && (
            <GlassCard glow="cyan" className="p-6 sm:p-8 border-cyber-cyan/50 space-y-6">
              <div className="flex items-center space-x-3 text-amber-400 font-mono">
                <Lightbulb className="w-5 h-5 shrink-0" />
                <h3 className="text-lg font-bold uppercase tracking-wider text-white">
                  Mission Protocol Summary
                </h3>
              </div>

              <div className="p-5 rounded-2xl bg-space-950 border border-cyber-cyan/30 space-y-3 font-mono text-xs sm:text-sm text-slate-200">
                <span className="text-xs font-bold text-cyber-cyan uppercase tracking-wider">
                  STARFLEET DIRECTIVE TAKEAWAY:
                </span>
                <p className="leading-relaxed whitespace-pre-line">
                  {lesson.keyTakeaways}
                </p>
              </div>

              {/* Final Proceed Action */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-space-800">
                <GlowButton
                  variant="secondary"
                  size="md"
                  onClick={() => onBackToStory()}
                  icon={<ArrowLeft className="w-4 h-4" />}
                >
                  BACK TO STORY
                </GlowButton>

                <GlowButton
                  variant="primary"
                  size="lg"
                  onClick={() => onProceedToPractice()}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  PROCEED TO PRACTICE EXERCISES →
                </GlowButton>
              </div>
            </GlassCard>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

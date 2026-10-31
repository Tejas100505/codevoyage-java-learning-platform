import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  missionService,
  MissionDetail,
  SubmissionResult,
  TestExecutionResult
} from '../services/missionService';
import { useAuth } from '../context/AuthContext';
import { JavaCodeEditor } from '../editor/JavaCodeEditor';
import { GlassCard } from '../components/GlassCard';
import { GlowButton } from '../components/GlowButton';
import { LoadingState } from '../components/LoadingState';
import {
  Rocket,
  Shield,
  Zap,
  Terminal,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  BookOpen,
  Award,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Clock,
  Check,
  Star,
  Copy,
  Layers,
  HelpCircle,
  Target,
  Radio
} from 'lucide-react';
import { soundManager } from '../services/soundService';
import { GameCelebrationModal } from '../game/GameCelebrationModal';
import { BossDefeatedCinematic } from '../game/CinematicTransitions';
import { PlanetTransitionCinematic } from '../game/PlanetTransitionCinematic';
import { InteractiveActivityCard } from '../components/InteractiveActivityEngine';
import { gameStateService, GameState } from '../services/gameStateService';

export const MissionExperience: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const missionId = parseInt(id || '1', 10);
  const navigate = useNavigate();
  const { user, refreshUser, isAuthenticated } = useAuth();

  const [mission, setMission] = useState<MissionDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Left column active tab: 'DIRECTIVES' | 'LESSON' | 'PRACTICE'
  const [activeTab, setActiveTab] = useState<'DIRECTIVES' | 'LESSON' | 'PRACTICE'>('DIRECTIVES');

  // Code editor & execution states
  const [code, setCode] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [hintsUnlocked, setHintsUnlocked] = useState<number[]>([]);
  const [expandedHints, setExpandedHints] = useState<{ [id: number]: boolean }>({});

  // Bottom console active tab: 'TERMINAL' | 'TESTS' | 'DIAGNOSTICS'
  const [consoleTab, setConsoleTab] = useState<'TERMINAL' | 'TESTS' | 'DIAGNOSTICS'>('TERMINAL');

  // Practice activity state
  const [practiceAnswers, setPracticeAnswers] = useState<{ [key: number]: number }>({});
  const [practiceFeedback, setPracticeFeedback] = useState<{ [key: number]: boolean }>({});
  const [practiceCompleted, setPracticeCompleted] = useState<boolean>(false);

  // Game reward modals
  const [showCelebrationModal, setShowCelebrationModal] = useState<boolean>(false);
  const [showBossVictory, setShowBossVictory] = useState<boolean>(false);
  const [showPlanetTransition, setShowPlanetTransition] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const fetchMissionData = async () => {
      try {
        setLoading(true);
        const data = await missionService.getMissionById(missionId);
        if (isMounted && data) {
          setMission(data);
          setCode(data.codingChallenge?.starterCode || `public class Solution {\n    public static void main(String[] args) {\n        // Your Java 21 Code here\n    }\n}`);
          if (data.hintsUsed && data.codingChallenge?.hints) {
            setHintsUnlocked(data.codingChallenge.hints.slice(0, data.hintsUsed).map((h) => h.id));
          }
        }
      } catch (err) {
        console.error('Failed to load mission data', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMissionData();
    return () => {
      isMounted = false;
    };
  }, [missionId]);

  // Run Code (Trial sandbox compilation & execution)
  const handleRunCode = async () => {
    if (!mission) return;
    setIsExecuting(true);
    soundManager.emit('button_click');

    try {
      const res = await missionService.runCode(mission.id, code);
      setSubmissionResult(res);

      if (res.status === 'COMPILE_ERROR') {
        setConsoleTab('DIAGNOSTICS');
        soundManager.emit('test_failed');
      } else {
        setConsoleTab('TERMINAL');
        if (res.success) {
          soundManager.emit('test_passed');
        }
      }
    } catch (err: any) {
      setSubmissionResult({
        status: 'RUNTIME_ERROR',
        success: false,
        completed: false,
        stdout: '',
        stderr: err?.message || 'Execution service communication fault.',
        executionTimeMs: 0,
        diagnosticHint: 'Network connection or backend communication fault.',
        totalTests: 0,
        passedTests: 0,
        starsEarned: 0,
        xpEarned: 0,
        testCases: [],
      });
      setConsoleTab('DIAGNOSTICS');
      soundManager.emit('test_failed');
    } finally {
      setIsExecuting(false);
    }
  };

  // Submit Mission (Full flight evaluation against test suite)
  const handleSubmitCode = async () => {
    if (!mission) return;
    setIsExecuting(true);
    soundManager.emit('button_click');

    try {
      const res = await missionService.submitCode(mission.id, code);
      setSubmissionResult(res);

      if (res.status === 'COMPILE_ERROR') {
        setConsoleTab('DIAGNOSTICS');
        soundManager.emit('test_failed');
      } else {
        setConsoleTab('TESTS');
      }

      if (res.completed) {
        soundManager.emit('test_passed');
        if (mission.shipSystem) {
          try {
            await gameStateService.updateSystemPower(mission.shipSystem, 100);
          } catch {
            // Non-blocking
          }
        }
        await refreshUser();

        setTimeout(() => {
          if (res.worldCompleted || mission.isBossMission || mission.missionOrder === 5) {
            if (mission.isBossMission) {
              setShowBossVictory(true);
            } else {
              setShowPlanetTransition(true);
            }
          } else {
            setShowCelebrationModal(true);
          }
        }, 600);
      } else if (res.status !== 'COMPILE_ERROR') {
        soundManager.emit('test_failed');
      }
    } catch (err: any) {
      setSubmissionResult({
        status: 'RUNTIME_ERROR',
        success: false,
        completed: false,
        stdout: '',
        stderr: err?.message || 'Submission verification failed.',
        executionTimeMs: 0,
        diagnosticHint: 'Transmission fault during mission submission.',
        totalTests: 0,
        passedTests: 0,
        starsEarned: 0,
        xpEarned: 0,
        testCases: [],
      });
      setConsoleTab('DIAGNOSTICS');
      soundManager.emit('test_failed');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleUnlockHint = async (hintId: number) => {
    if (!hintsUnlocked.includes(hintId)) {
      setHintsUnlocked((prev) => [...prev, hintId]);
      setExpandedHints((prev) => ({ ...prev, [hintId]: true }));
      if (mission) {
        try {
          await missionService.unlockHint(mission.id, hintId);
        } catch (err) {
          console.error('Failed to register hint usage', err);
        }
      }
    } else {
      setExpandedHints((prev) => ({ ...prev, [hintId]: !prev[hintId] }));
    }
  };

  const handleCopyCodeSnippet = (snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const isPracticeAllAnswered = useMemo(() => {
    if (!mission?.practiceQuestions || mission.practiceQuestions.length === 0) return true;
    return mission.practiceQuestions.every((q) => practiceAnswers[q.id] !== undefined);
  }, [mission, practiceAnswers]);

  if (loading && !mission) {
    return (
      <div className="py-24">
        <LoadingState message="INITIALIZING JAVA COCKPIT WORKSPACE..." />
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="text-center py-24 space-y-4 font-mono">
        <div className="text-rose-400 text-sm">MISSION DATA UNAVAILABLE</div>
        <p className="text-xs text-slate-400">Unable to retrieve parameters for Mission {missionId}.</p>
        <GlowButton variant="secondary" size="sm" onClick={() => navigate('/map')}>
          Return to Galaxy Map
        </GlowButton>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 1. TOP COCKPIT NAVIGATION & HUD BAR */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl glass-panel border border-white/10">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/map')}
            className="p-2 rounded-xl bg-space-900 hover:bg-space-800 border border-white/10 text-slate-400 hover:text-white transition-colors flex items-center space-x-1.5 text-xs font-mono"
            title="Return to Galaxy Map"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Galaxy Map</span>
          </button>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30">
                MISSION 0{mission.missionOrder}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {mission.worldName}
              </span>
              {mission.completed && (
                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-cyber-emerald/20 text-cyber-emerald flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>CLEARED</span>
                </span>
              )}
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white font-mono mt-0.5">
              {mission.title}
            </h1>
          </div>
        </div>

        {/* Status Indicators & Rewards */}
        <div className="flex items-center space-x-3 text-xs font-mono text-slate-300">
          <span className="px-2.5 py-1 rounded-lg bg-space-900 border border-white/10 text-cyber-cyan">
            {mission.javaConcept}
          </span>
          <span className="flex items-center space-x-1 text-amber-400">
            <Zap className="w-3.5 h-3.5" />
            <span>+{mission.xpReward} XP</span>
          </span>
        </div>
      </header>

      {/* Unauthenticated Session Warning Banner */}
      {!isAuthenticated && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs font-mono text-amber-300">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
            <span>Unauthenticated Cadet Session: Telemetry will not be saved permanently without an account.</span>
          </div>
          <button
            onClick={() => navigate('/login', { state: { from: location } })}
            className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold border border-amber-500/40 text-[11px] shrink-0 ml-2"
          >
            Log In to Save
          </button>
        </div>
      )}

      {/* 2. MAIN TWO-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: Mission Instructions, Concept, Practice (5 cols desktop) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Section Switcher Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-space-900 border border-white/10 text-xs font-mono">
            <button
              onClick={() => setActiveTab('DIRECTIVES')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all flex items-center justify-center space-x-1.5 ${
                activeTab === 'DIRECTIVES'
                  ? 'bg-cyber-cyan/20 text-cyber-cyan font-bold border border-cyber-cyan/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Directives</span>
            </button>

            <button
              onClick={() => setActiveTab('LESSON')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all flex items-center justify-center space-x-1.5 ${
                activeTab === 'LESSON'
                  ? 'bg-cyber-purple/20 text-cyber-purple font-bold border border-cyber-purple/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Concept</span>
            </button>

            <button
              onClick={() => setActiveTab('PRACTICE')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all flex items-center justify-center space-x-1.5 ${
                activeTab === 'PRACTICE'
                  ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Practice ({mission.practiceQuestions?.length || 0})</span>
            </button>
          </div>

          {/* TAB 1: DIRECTIVES (Instructions, Target Output, Collapsible Hints) */}
          {activeTab === 'DIRECTIVES' && (
            <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-4 font-mono text-xs">
              {/* Mission Objective */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-cyber-cyan font-bold uppercase tracking-wider block">
                  Objective
                </span>
                <p className="text-slate-200 leading-relaxed bg-space-950/60 p-3 rounded-xl border border-white/5">
                  {mission.codingChallenge?.instructions || mission.objective}
                </p>
              </div>

              {/* Target Terminal Output */}
              {mission.codingChallenge?.visibleTestCases?.[0] && (
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Expected Terminal Output
                  </span>
                  <div className="p-3 rounded-xl bg-space-950 border border-cyber-cyan/30 text-cyber-cyan font-mono whitespace-pre-wrap select-all">
                    {mission.codingChallenge.visibleTestCases[0].expectedOutput}
                  </div>
                </div>
              )}

              {/* Collapsible Hints System */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span className="flex items-center space-x-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sub-Space Hints ({mission.codingChallenge?.hints?.length || 0})</span>
                  </span>
                  <span className="text-[10px] text-slate-500">Zero penalty on progression</span>
                </div>

                <div className="space-y-2">
                  {(mission.codingChallenge?.hints || []).map((h) => {
                    const isUnlocked = hintsUnlocked.includes(h.id);
                    const isExpanded = expandedHints[h.id];

                    return (
                      <div
                        key={h.id}
                        className="rounded-xl border border-space-800 bg-space-950/70 overflow-hidden"
                      >
                        <button
                          onClick={() => handleUnlockHint(h.id)}
                          className="w-full px-3.5 py-2.5 text-left flex items-center justify-between text-xs hover:bg-space-900 transition-colors"
                        >
                          <span className="font-semibold text-amber-400 flex items-center space-x-1.5">
                            <Lightbulb className="w-3 h-3" />
                            <span>Hint #{h.hintOrder}</span>
                            {!isUnlocked && (
                              <span className="text-[10px] font-normal text-slate-500">(Click to reveal)</span>
                            )}
                          </span>
                          {isUnlocked ? (
                            isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                              REVEAL
                            </span>
                          )}
                        </button>

                        {isUnlocked && isExpanded && (
                          <div className="px-3.5 py-2.5 bg-space-900/60 border-t border-space-800 text-slate-300 text-xs leading-relaxed">
                            {h.content}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LESSON (Concept Theory & Sample Java Code) */}
          {activeTab === 'LESSON' && (
            <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-cyber-purple font-bold uppercase tracking-wider block">
                  Concept Telemetry
                </span>
                <h3 className="text-sm font-bold text-white">
                  {mission.lesson?.title || mission.javaConcept}
                </h3>
                <p className="text-slate-300 leading-relaxed text-xs">
                  {mission.lesson?.conceptSummary}
                </p>
              </div>

              {/* Sample Code Block with Copy Action */}
              {mission.lesson?.sampleJavaCode && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Sample Syntax Pattern</span>
                    <button
                      onClick={() => handleCopyCodeSnippet(mission.lesson.sampleJavaCode)}
                      className="flex items-center space-x-1 text-cyber-cyan hover:underline text-[10px]"
                    >
                      {copiedSnippet ? <Check className="w-3 h-3 text-cyber-emerald" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSnippet ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-space-950 border border-space-800 text-slate-200 overflow-x-auto text-[11px] leading-relaxed">
                    {mission.lesson.sampleJavaCode}
                  </pre>
                </div>
              )}

              {/* Key Takeaways */}
              {mission.lesson?.keyTakeaways && (
                <div className="p-3 rounded-xl bg-space-950/60 border border-white/5 space-y-1">
                  <span className="text-[10px] text-cyber-emerald font-bold uppercase block">
                    Key Takeaways:
                  </span>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {mission.lesson.keyTakeaways}
                  </p>
                </div>
              )}

              <Link
                to="/codex"
                target="_blank"
                className="block text-center py-2 rounded-xl bg-space-900 hover:bg-space-850 border border-white/10 text-cyber-cyan text-xs transition-colors"
              >
                Open Full Java Codex Manual &rarr;
              </Link>
            </div>
          )}

          {/* TAB 3: PRACTICE DRILLS */}
          {activeTab === 'PRACTICE' && (
            <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  Interactive Verification
                </span>
                <span className="text-[10px] text-slate-400">
                  {Object.keys(practiceAnswers).length} / {mission.practiceQuestions?.length || 0} Answered
                </span>
              </div>

              <div className="space-y-4">
                {(mission.practiceQuestions || []).map((q, idx) => (
                  <InteractiveActivityCard
                    key={q.id}
                    question={q}
                    index={idx}
                    totalQuestions={mission.practiceQuestions?.length || 0}
                    isResolved={practiceAnswers[q.id] !== undefined}
                    wasCorrect={practiceFeedback[q.id] === true}
                    onAnswerResolved={(questionId, isCorrect) => {
                      if (isCorrect) {
                        soundManager.emit('correct_answer');
                      } else {
                        soundManager.emit('incorrect_answer');
                      }
                      setPracticeAnswers((prev) => ({ ...prev, [questionId]: isCorrect ? 1 : 0 }));
                      setPracticeFeedback((prev) => ({ ...prev, [questionId]: isCorrect }));
                    }}
                  />
                ))}
              </div>

              {isPracticeAllAnswered && !practiceCompleted && (
                <div className="pt-2 border-t border-white/10">
                  <button
                    onClick={async () => {
                      try {
                        await missionService.completePractice(mission.id);
                        await refreshUser();
                        setPracticeCompleted(true);
                      } catch {
                        // Non-blocking
                      }
                    }}
                    className="w-full py-2 rounded-xl bg-cyber-emerald/20 hover:bg-cyber-emerald/30 border border-cyber-emerald/40 text-cyber-emerald font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Claim Practice XP & Unlock Full Clearance</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Code Editor + Tabbed Terminal Output (7 cols desktop) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Java Code Editor */}
          <div className="h-[460px] rounded-2xl overflow-hidden border border-cyber-cyan/30 bg-space-950 shadow-md">
            <JavaCodeEditor
              value={code}
              onChange={setCode}
              starterCode={mission.codingChallenge?.starterCode}
              onRun={handleRunCode}
              onSubmit={handleSubmitCode}
              isExecuting={isExecuting}
              errorLine={submissionResult?.errorLine || null}
              errorMessage={submissionResult?.diagnosticHint || null}
            />
          </div>

          {/* INTEGRATED TABBED TERMINAL & TEST RESULTS PANEL */}
          <div className="rounded-2xl glass-panel border border-white/10 overflow-hidden font-mono text-xs">
            {/* Console Tabs */}
            <div className="flex items-center justify-between px-3 py-2 bg-space-900 border-b border-white/10">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setConsoleTab('TERMINAL')}
                  className={`px-3 py-1 rounded-lg text-xs transition-colors flex items-center space-x-1.5 ${
                    consoleTab === 'TERMINAL'
                      ? 'bg-space-800 text-white font-bold border border-white/10'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5 text-cyber-cyan" />
                  <span>Terminal Output</span>
                </button>

                <button
                  onClick={() => setConsoleTab('TESTS')}
                  className={`px-3 py-1 rounded-lg text-xs transition-colors flex items-center space-x-1.5 ${
                    consoleTab === 'TESTS'
                      ? 'bg-space-800 text-white font-bold border border-white/10'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyber-emerald" />
                  <span>Test Results</span>
                  {submissionResult && submissionResult.totalTests > 0 && (
                    <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded bg-space-950 text-cyber-cyan">
                      {submissionResult.passedTests}/{submissionResult.totalTests}
                    </span>
                  )}
                </button>

                {submissionResult?.diagnosticHint && (
                  <button
                    onClick={() => setConsoleTab('DIAGNOSTICS')}
                    className={`px-3 py-1 rounded-lg text-xs transition-colors flex items-center space-x-1.5 ${
                      consoleTab === 'DIAGNOSTICS'
                        ? 'bg-space-800 text-amber-300 font-bold border border-amber-400/30'
                        : 'text-amber-400 hover:text-amber-300'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Compiler Diagnostics</span>
                  </button>
                )}
              </div>

              {/* Execution Status Badge */}
              {submissionResult && (
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      submissionResult.completed || submissionResult.status === 'SUCCESS'
                        ? 'bg-cyber-emerald/20 text-cyber-emerald'
                        : submissionResult.status === 'COMPILE_ERROR'
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {submissionResult.status}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {submissionResult.executionTimeMs}ms
                  </span>
                </div>
              )}
            </div>

            {/* TAB CONTENT */}
            <div className="p-4 bg-space-950 min-h-[140px] max-h-[220px] overflow-y-auto">
              {/* TAB 1: TERMINAL OUTPUT */}
              {consoleTab === 'TERMINAL' && (
                <div>
                  {isExecuting ? (
                    <div className="flex items-center space-x-2 text-slate-400 py-3">
                      <div className="w-3.5 h-3.5 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
                      <span>Compiling and executing JDK 21 sandbox runner...</span>
                    </div>
                  ) : submissionResult ? (
                    <div className="space-y-2">
                      {submissionResult.stdout ? (
                        <pre className="text-cyber-cyan leading-relaxed whitespace-pre-wrap">
                          {submissionResult.stdout}
                        </pre>
                      ) : (
                        <div className="text-slate-500 italic">No standard output produced.</div>
                      )}

                      {submissionResult.stderr && (
                        <pre className="text-rose-400 text-xs border-t border-space-800 pt-2 whitespace-pre-wrap">
                          {submissionResult.stderr}
                        </pre>
                      )}
                    </div>
                  ) : (
                    <div className="text-slate-500 italic py-2">
                      Press <kbd className="px-1.5 py-0.5 rounded bg-space-900 border border-space-800 text-slate-400 text-[10px]">Ctrl + Enter</kbd> to run your code or click "Run Code".
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: TEST RESULTS */}
              {consoleTab === 'TESTS' && (
                <div className="space-y-3">
                  {!submissionResult?.testCases || submissionResult.testCases.length === 0 ? (
                    <div className="text-slate-500 italic py-2">
                      Submit your mission to execute official test suite evaluation.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {submissionResult.testCases.map((tc: TestExecutionResult, idx: number) => (
                        <div
                          key={tc.testId || idx}
                          className={`p-3 rounded-xl border text-xs ${
                            tc.passed
                              ? 'bg-cyber-emerald/10 border-cyber-emerald/30 text-cyber-emerald'
                              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold mb-1">
                            <span className="flex items-center space-x-1.5">
                              {tc.passed ? <Check className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                              <span>
                                Test 0{idx + 1}: {tc.description}
                                {tc.hidden && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-space-900 text-slate-400 ml-1.5 border border-space-800">
                                    HIDDEN TEST
                                  </span>
                                )}
                              </span>
                            </span>
                            <span>{tc.passed ? 'PASSED ✓' : 'FAILED ✗'}</span>
                          </div>

                          {!tc.passed && !tc.hidden && (
                            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-rose-500/20 text-[11px]">
                              <div>
                                <span className="text-slate-400 block mb-0.5">Expected:</span>
                                <pre className="p-1.5 rounded bg-space-950 text-slate-200 overflow-x-auto whitespace-pre-wrap">
                                  {tc.expectedOutput || '(empty)'}
                                </pre>
                              </div>
                              <div>
                                <span className="text-slate-400 block mb-0.5">Program Output:</span>
                                <pre className="p-1.5 rounded bg-space-950 text-rose-300 overflow-x-auto whitespace-pre-wrap">
                                  {tc.actualOutput || '(empty / error)'}
                                </pre>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: DIAGNOSTICS */}
              {consoleTab === 'DIAGNOSTICS' && (
                <div className="space-y-2">
                  {submissionResult?.diagnosticHint ? (
                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-1">
                      <div className="flex items-center space-x-2 font-bold text-amber-400">
                        <AlertTriangle className="w-4 h-4" />
                        <span>
                          Diagnostic Notice {submissionResult.errorLine ? `[Line ${submissionResult.errorLine}]` : ''}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-300 pl-6">
                        {submissionResult.diagnosticHint}
                      </p>
                    </div>
                  ) : (
                    <div className="text-slate-500 italic py-2">No compiler diagnostics reported.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* GAME CELEBRATION MODAL (Reward Sequence on Successful Submit) */}
      <GameCelebrationModal
        isOpen={showCelebrationModal}
        type="mission_completed"
        title="DIRECTIVE CLEARED"
        subtitle={`Outstanding calibration, Cadet ${user?.username || ''}! Ignis Station core systems updated.`}
        missionNumber={mission.missionOrder}
        worldName={mission.worldName}
        xpGained={submissionResult?.xpEarned || mission.xpReward || 100}
        starsGained={submissionResult?.starsEarned || 3}
        nextMissionUnlocked={mission.missionOrder < 5 ? mission.missionOrder + 1 : undefined}
        shipSystemUnlocked={mission.shipSystem ? mission.shipSystem.replace(/_/g, ' ') : undefined}
        onNextAction={() => {
          setShowCelebrationModal(false);
          const nextId = mission.missionOrder < 5 ? mission.id + 1 : 1;
          navigate(`/mission/${nextId}`);
        }}
        onSecondaryAction={() => {
          setShowCelebrationModal(false);
          navigate('/map');
        }}
        nextButtonText="NEXT MISSION"
        secondaryButtonText="RETURN TO GALAXY MAP"
      />

      {/* BOSS DEFEATED CINEMATIC FOR MISSION 5 */}
      <BossDefeatedCinematic
        isOpen={showBossVictory}
        bossTitle="IGNIS THERMAL OVERLOAD"
        worldName={mission.worldName || 'IGNIS STATION'}
        xpAwarded={submissionResult?.xpEarned || 250}
        onProceed={() => {
          setShowBossVictory(false);
          if (submissionResult?.worldCompleted || mission.missionOrder === 5) {
            setShowPlanetTransition(true);
          } else {
            setShowCelebrationModal(true);
          }
        }}
      />

      {/* PLANET-TO-PLANET CINEMATIC TRANSITION (Triggered ONLY on sector completion) */}
      <PlanetTransitionCinematic
        isOpen={showPlanetTransition}
        completedWorldName={submissionResult?.completedWorldName || mission.worldName || 'IGNIS STATION'}
        completedWorldOrder={submissionResult?.completedWorldOrder || 1}
        totalMissionsInWorld={submissionResult?.totalMissionsInWorld || 5}
        xpEarned={submissionResult?.xpEarned || mission.xpReward || 250}
        starsEarned={submissionResult?.starsEarned || 3}
        nextWorldName={submissionResult?.nextWorldName || 'KRYON BELT'}
        nextWorldOrder={submissionResult?.nextWorldOrder || 2}
        nextWorldUnlocked={submissionResult?.nextWorldUnlocked ?? true}
        onBeginNextSector={() => {
          setShowPlanetTransition(false);
          const completedOrder = submissionResult?.completedWorldOrder || 1;
          try {
            localStorage.setItem(`seen_planet_transition_${completedOrder}`, 'true');
          } catch {
            // Non-blocking
          }
          navigate('/map');
        }}
        onClose={() => {
          setShowPlanetTransition(false);
          const completedOrder = submissionResult?.completedWorldOrder || 1;
          try {
            localStorage.setItem(`seen_planet_transition_${completedOrder}`, 'true');
          } catch {
            // Non-blocking
          }
          navigate('/map');
        }}
      />
    </div>
  );
};

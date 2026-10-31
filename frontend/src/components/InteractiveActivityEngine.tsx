import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Gauge,
  Sliders,
  Code2,
  Bug,
  MoveVertical,
  Check,
  Zap,
} from 'lucide-react';
import { PracticeQuestion } from '../services/missionService';
import { GlowButton } from './GlowButton';

interface InteractiveActivityProps {
  question: PracticeQuestion;
  index: number;
  totalQuestions: number;
  onAnswerResolved: (questionId: number, isCorrect: boolean) => void;
  isResolved?: boolean;
  wasCorrect?: boolean;
}

export const InteractiveActivityCard: React.FC<InteractiveActivityProps> = ({
  question,
  index,
  totalQuestions,
  onAnswerResolved,
  isResolved = false,
  wasCorrect = false,
}) => {
  const [showHint, setShowHint] = useState(false);
  const [userState, setUserState] = useState<any>(null);
  const [feedback, setFeedback] = useState<{
    submitted: boolean;
    isCorrect: boolean;
    message: string;
  } | null>(null);

  // Parse options or activityDataJson
  const activityType = (question.activityType || 'MULTIPLE_CHOICE').toUpperCase();

  let activityConfig: any = {};
  try {
    if (question.activityDataJson) {
      activityConfig = JSON.parse(question.activityDataJson);
    }
  } catch {
    activityConfig = {};
  }

  let rawOptions: string[] = [];
  try {
    rawOptions = JSON.parse(question.optionsJson || '[]');
  } catch {
    rawOptions = [];
  }

  // Initialize per-activity state when question changes
  useEffect(() => {
    setShowHint(false);
    setFeedback(
      isResolved
        ? {
            submitted: true,
            isCorrect: wasCorrect,
            message: wasCorrect ? 'System nominal! Verification complete.' : 'Calculation mismatch detected.',
          }
        : null
    );

    if (activityType === 'MATCH_CONCEPT' && activityConfig.pairs) {
      const normalizedPairs = activityConfig.pairs.map((p: any) => ({
        left: p.left || p.item || '',
        right: p.right || p.match || '',
      }));
      const leftItems = normalizedPairs.map((p: any) => p.left);
      const rightItems = [...normalizedPairs.map((p: any) => p.right)].sort(() => Math.random() - 0.5);
      setUserState({
        selectedLeft: null,
        matches: {} as Record<string, string>,
        leftItems,
        rightItems,
        normalizedPairs,
      });
    } else if (activityType === 'REORDER_CODE' && activityConfig.tokens) {
      const initialTokens = [...activityConfig.tokens].sort(() => Math.random() - 0.5);
      setUserState({ currentOrder: initialTokens });
    } else if (activityType === 'CHANGE_VALUE') {
      setUserState({
        currentValue: activityConfig.initialValue ?? 100,
      });
    } else if (activityType === 'FILL_CODE') {
      setUserState({ selectedOption: null, textInput: '' });
    } else if (activityType === 'SHORT_TASK') {
      setUserState({ inputCode: '' });
    } else {
      setUserState({ selectedIndex: null });
    }
  }, [question.id, activityType, isResolved, wasCorrect]);

  // Submission handler with instant non-punishing feedback
  const handleCheckAnswer = (overrideCorrect?: boolean, customMsg?: string) => {
    let correct = false;

    if (typeof overrideCorrect === 'boolean') {
      correct = overrideCorrect;
    } else if (activityType === 'MULTIPLE_CHOICE' || activityType === 'PREDICT_OUTPUT' || activityType === 'DEBUG_CODE') {
      correct = userState?.selectedIndex === question.correctAnswerIndex;
    } else if (activityType === 'FILL_CODE') {
      if (activityConfig.correctToken) {
        correct =
          (userState?.selectedOption || userState?.textInput || '').trim() ===
          activityConfig.correctToken.trim();
      } else {
        correct = userState?.selectedIndex === question.correctAnswerIndex;
      }
    } else if (activityType === 'MATCH_CONCEPT') {
      const matches = userState?.matches || {};
      const pairs: Array<{ left: string; right: string }> =
        userState?.normalizedPairs ||
        (activityConfig.pairs || []).map((p: any) => ({
          left: p.left || p.item || '',
          right: p.right || p.match || '',
        }));
      const allMatched = pairs.every((p) => matches[p.left] === p.right);
      correct = allMatched && Object.keys(matches).length === pairs.length;
    } else if (activityType === 'REORDER_CODE') {
      const targetSeq = activityConfig.targetSequence || activityConfig.tokens || [];
      const current = userState?.currentOrder || [];
      correct = JSON.stringify(targetSeq) === JSON.stringify(current);
    } else if (activityType === 'CHANGE_VALUE') {
      correct = userState?.currentValue === activityConfig.targetValue;
    } else if (activityType === 'SHORT_TASK') {
      const cleanInput = (userState?.inputCode || '').replace(/\s+/g, ' ').trim();
      const expected = (activityConfig.expectedStatement || activityConfig.correctToken || '').replace(/\s+/g, ' ').trim();
      correct = cleanInput === expected;
    }

    setFeedback({
      submitted: true,
      isCorrect: correct,
      message:
        customMsg ||
        (correct
          ? 'Diagnostics passed! System verified.'
          : 'Telemetry variance detected. Review the explanation, check the hint, or retry!'),
    });

    onAnswerResolved(question.id, correct);
  };

  const handleRetry = () => {
    setFeedback(null);
    setShowHint(false);
    if (activityType === 'MATCH_CONCEPT' && activityConfig.pairs) {
      setUserState((prev: any) => ({
        ...prev,
        selectedLeft: null,
        matches: {},
      }));
    } else if (activityType === 'CHANGE_VALUE') {
      setUserState({ currentValue: activityConfig.initialValue ?? 100 });
    } else if (activityType === 'SHORT_TASK') {
      setUserState({ inputCode: '' });
    } else {
      setUserState({ selectedIndex: null });
    }
  };

  // Helper badge for Activity Type
  const getActivityBadge = () => {
    switch (activityType) {
      case 'CHANGE_VALUE':
        return { label: 'INTERACTIVE GAUGE // CHANGE VALUE', color: 'border-amber-500/40 text-amber-400 bg-amber-500/10', icon: Sliders };
      case 'MATCH_CONCEPT':
        return { label: 'CONCEPT SYNTHESIS // MATCH DATA', color: 'border-purple-500/40 text-purple-400 bg-purple-500/10', icon: Sparkles };
      case 'REORDER_CODE':
        return { label: 'SYNTAX SEQUENCE // REORDER BLOCKS', color: 'border-blue-500/40 text-blue-400 bg-blue-500/10', icon: MoveVertical };
      case 'DEBUG_CODE':
        return { label: 'SECURITY SCAN // DEBUG THE CODE', color: 'border-rose-500/40 text-rose-400 bg-rose-500/10', icon: Bug };
      case 'FILL_CODE':
        return { label: 'SYNTAX RESTORATION // FILL THE CODE', color: 'border-cyber-cyan/40 text-cyber-cyan bg-cyber-cyan/10', icon: Code2 };
      case 'PREDICT_OUTPUT':
        return { label: 'VIRTUAL EXECUTION // PREDICT OUTPUT', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10', icon: CheckCircle2 };
      case 'SHORT_TASK':
        return { label: 'TERMINAL COMMAND // SHORT CODE TASK', color: 'border-pink-500/40 text-pink-400 bg-pink-500/10', icon: Code2 };
      default:
        return { label: 'TELEMETRY DRILL // MULTIPLE CHOICE', color: 'border-slate-500/40 text-slate-300 bg-space-850', icon: HelpCircle };
    }
  };

  const badge = getActivityBadge();
  const BadgeIcon = badge.icon;

  return (
    <div className="p-6 rounded-2xl bg-space-900/90 border border-space-700/80 shadow-xl space-y-6 transition-all hover:border-space-600">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-space-800 pb-4">
        <div className="flex items-center space-x-2.5">
          <span className="w-7 h-7 rounded-lg bg-cyber-purple/20 border border-cyber-purple/40 text-cyber-purple font-mono font-bold text-xs flex items-center justify-center">
            {index + 1}
          </span>
          <div className="flex items-center space-x-2">
            <span
              className={`text-[10px] font-mono font-semibold px-2.5 py-1 rounded-md border flex items-center space-x-1.5 ${badge.color}`}
            >
              <BadgeIcon className="w-3 h-3" />
              <span>{badge.label}</span>
            </span>
            <span className="text-xs font-mono text-slate-500">
              drill {index + 1} of {totalQuestions}
            </span>
          </div>
        </div>

        {feedback?.submitted && (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-xs font-mono font-bold px-3 py-1 rounded-full flex items-center space-x-1.5 border ${
              feedback.isCorrect
                ? 'bg-cyber-emerald/20 text-cyber-emerald border-cyber-emerald/40 shadow-glow-emerald/30'
                : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
            }`}
          >
            {feedback.isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
            <span>{feedback.isCorrect ? 'STATION REACTION: NOMINAL' : 'CALCULATION ERROR'}</span>
          </motion.span>
        )}
      </div>

      {/* Main Question Prompt */}
      <div className="space-y-2">
        <h3 className="text-base sm:text-lg font-bold text-white font-mono leading-relaxed">
          {question.prompt}
        </h3>
      </div>

      {/* Code Snippet Box (if provided) */}
      {question.codeSnippet && activityType !== 'FILL_CODE' && (
        <div className="relative group">
          <div className="absolute top-2 right-2 text-[10px] font-mono text-slate-500 uppercase tracking-wider bg-space-900/80 px-2 py-0.5 rounded border border-white/5">
            Java 21 Telemetry
          </div>
          <pre className="p-4 rounded-xl bg-space-950/90 border border-space-800 text-xs sm:text-sm font-mono text-cyber-cyan overflow-x-auto leading-relaxed shadow-inner">
            <code>{question.codeSnippet}</code>
          </pre>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* RENDER SPECIFIC ACTIVITY WORKFLOW */}
      {/* ------------------------------------------------------------- */}

      {/* 1 & 2 & 4: MULTIPLE CHOICE, PREDICT OUTPUT, DEBUG CODE */}
      {(activityType === 'MULTIPLE_CHOICE' ||
        activityType === 'PREDICT_OUTPUT' ||
        activityType === 'DEBUG_CODE') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {rawOptions.map((opt, optIdx) => {
            const isSelected = userState?.selectedIndex === optIdx;
            const isCorrectAnswer = optIdx === question.correctAnswerIndex;
            const showOutcome = feedback?.submitted;

            let btnStyle = 'bg-space-950/70 border-space-800 text-slate-300 hover:border-cyber-cyan/50 hover:bg-space-850';
            if (showOutcome) {
              if (isSelected && isCorrectAnswer) {
                btnStyle = 'bg-cyber-emerald/20 border-cyber-emerald text-white shadow-glow-emerald';
              } else if (isSelected && !isCorrectAnswer) {
                btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-200';
              } else if (isCorrectAnswer) {
                btnStyle = 'bg-cyber-emerald/10 border-cyber-emerald/50 text-cyber-emerald';
              } else {
                btnStyle = 'bg-space-950/40 border-space-850 text-slate-600 opacity-60';
              }
            } else if (isSelected) {
              btnStyle = 'bg-cyber-purple/20 border-cyber-purple text-white shadow-glow-purple/40';
            }

            return (
              <button
                key={optIdx}
                disabled={feedback?.submitted && feedback.isCorrect}
                onClick={() => {
                  setUserState({ selectedIndex: optIdx });
                  if (!feedback?.submitted) {
                    const isRight = optIdx === question.correctAnswerIndex;
                    setFeedback({
                      submitted: true,
                      isCorrect: isRight,
                      message: isRight
                        ? 'Diagnostics verified! Exact match found.'
                        : 'Variance detected. Analyze the code syntax and try again.',
                    });
                    onAnswerResolved(question.id, isRight);
                  }
                }}
                className={`p-4 rounded-xl text-left font-mono text-xs sm:text-sm transition-all border flex items-center space-x-3 ${btnStyle}`}
              >
                <span className="w-6 h-6 rounded-lg bg-space-800 border border-white/5 flex items-center justify-center text-xs font-bold text-slate-400 shrink-0">
                  {String.fromCharCode(65 + optIdx)}
                </span>
                <span className="flex-1">{opt}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* 3: FILL THE CODE */}
      {activityType === 'FILL_CODE' && (
        <div className="space-y-4 pt-2">
          {question.codeSnippet && (
            <div className="p-4 rounded-xl bg-space-950 border border-space-800 text-sm font-mono text-slate-200 leading-relaxed overflow-x-auto">
              {question.codeSnippet.split('___').map((part, pIdx, arr) => (
                <React.Fragment key={pIdx}>
                  <span>{part}</span>
                  {pIdx < arr.length - 1 && (
                    <span
                      className={`inline-block px-3 py-1 mx-1.5 rounded-lg border font-bold text-center min-w-[70px] ${
                        userState?.selectedOption
                          ? feedback?.submitted
                            ? feedback.isCorrect
                              ? 'bg-cyber-emerald/20 border-cyber-emerald text-cyber-emerald'
                              : 'bg-rose-500/20 border-rose-500 text-rose-300'
                            : 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan'
                          : 'bg-space-900 border-dashed border-cyber-cyan/60 text-cyber-cyan/60 animate-pulse'
                      }`}
                    >
                      {userState?.selectedOption || '[ ? ]'}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Select Token to Insert:
            </span>
            <div className="flex flex-wrap gap-2.5">
              {(activityConfig.options || rawOptions).map((token: string, tIdx: number) => {
                const isSelected = userState?.selectedOption === token;
                return (
                  <button
                    key={tIdx}
                    onClick={() => {
                      setUserState({ selectedOption: token });
                      if (!feedback?.submitted) {
                        const correctToken = activityConfig.correctToken || rawOptions[question.correctAnswerIndex];
                        const isRight = token === correctToken;
                        setFeedback({
                          submitted: true,
                          isCorrect: isRight,
                          message: isRight
                            ? `Token '${token}' compiled successfully into the instruction.`
                            : `Token '${token}' causes a compile error. Try an alternative.`,
                        });
                        onAnswerResolved(question.id, isRight);
                      }
                    }}
                    className={`px-4 py-2.5 rounded-xl font-mono text-xs border transition-all ${
                      isSelected
                        ? 'bg-cyber-cyan/20 border-cyber-cyan text-white shadow-glow-cyan'
                        : 'bg-space-950/70 border-space-850 text-slate-300 hover:border-cyber-cyan/40 hover:bg-space-900'
                    }`}
                  >
                    <code>{token}</code>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5: MATCH CONCEPT */}
      {activityType === 'MATCH_CONCEPT' && (
        <div className="space-y-4 pt-2">
          <p className="text-xs font-mono text-slate-400">
            Click an item on the left, then click its corresponding type/concept on the right:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Items */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyber-cyan font-bold">
                Telemetry Values (Left)
              </span>
              {(userState?.leftItems || (activityConfig.pairs || []).map((p: any) => p.left || p.item || '')).map((left: string, lIdx: number) => {
                const isMatched = !!userState?.matches?.[left];
                const isSelected = userState?.selectedLeft === left;

                return (
                  <button
                    key={lIdx}
                    onClick={() => setUserState((prev: any) => ({ ...prev, selectedLeft: left }))}
                    className={`w-full p-3 rounded-xl font-mono text-xs text-left border flex items-center justify-between transition-all ${
                      isMatched
                        ? 'bg-cyber-emerald/10 border-cyber-emerald/40 text-cyber-emerald'
                        : isSelected
                        ? 'bg-cyber-purple/20 border-cyber-purple text-white shadow-glow-purple/40 ring-1 ring-cyber-purple'
                        : 'bg-space-950/70 border-space-800 text-slate-200 hover:border-cyber-cyan/40 hover:bg-space-900'
                    }`}
                  >
                    <span className="font-bold">{left}</span>
                    {isMatched ? (
                      <span className="text-[10px] text-cyber-emerald flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>&rarr; {userState?.matches?.[left]}</span>
                      </span>
                    ) : isSelected ? (
                      <span className="text-[10px] text-cyber-purple animate-pulse">Select target...</span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            {/* Right Items */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyber-purple font-bold">
                Java Types / Concepts (Right)
              </span>
              {(userState?.rightItems || (activityConfig.pairs || []).map((p: any) => p.right || p.match || '')).map((right: string, rIdx: number) => {
                const isClaimedBy = Object.entries(userState?.matches || {}).find(
                  ([, v]) => v === right
                )?.[0];

                return (
                  <button
                    key={rIdx}
                    onClick={() => {
                      if (!userState?.selectedLeft) return;
                      const currentLeft = userState.selectedLeft;
                      const nextMatches = { ...userState.matches, [currentLeft]: right };
                      setUserState((prev: any) => ({
                        ...prev,
                        matches: nextMatches,
                        selectedLeft: null,
                      }));

                      const pairs: Array<{ left: string; right: string }> =
                        userState?.normalizedPairs ||
                        (activityConfig.pairs || []).map((p: any) => ({
                          left: p.left || p.item || '',
                          right: p.right || p.match || '',
                        }));
                      if (Object.keys(nextMatches).length === pairs.length) {
                        const allCorrect = pairs.every((p) => nextMatches[p.left] === p.right);
                        setFeedback({
                          submitted: true,
                          isCorrect: allCorrect,
                          message: allCorrect
                            ? 'All concept data type pairs verified correctly!'
                            : 'Mismatched data types detected. Review primitive definitions and retry.',
                        });
                        onAnswerResolved(question.id, allCorrect);
                      }
                    }}
                    className={`w-full p-3 rounded-xl font-mono text-xs text-left border flex items-center justify-between transition-all ${
                      isClaimedBy
                        ? 'bg-cyber-emerald/10 border-cyber-emerald/40 text-cyber-emerald'
                        : userState?.selectedLeft
                        ? 'bg-space-950 border-cyber-cyan/40 text-slate-200 hover:bg-space-850 hover:border-cyber-cyan'
                        : 'bg-space-950/70 border-space-800 text-slate-400 opacity-80'
                    }`}
                  >
                    <span>{right}</span>
                    {isClaimedBy && (
                      <span className="text-[10px] text-cyber-emerald font-bold">
                        &larr; {isClaimedBy}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 6: REORDER CODE */}
      {activityType === 'REORDER_CODE' && (
        <div className="space-y-4 pt-2">
          <p className="text-xs font-mono text-slate-400">
            Arrange code fragments in valid Java execution order:
          </p>

          <div className="space-y-2">
            {(userState?.currentOrder || []).map((token: string, tIdx: number) => (
              <div
                key={tIdx}
                className="p-3.5 rounded-xl bg-space-950 border border-space-800 text-xs font-mono text-slate-200 flex items-center justify-between group hover:border-space-700"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-5 h-5 rounded-md bg-space-900 border border-white/5 text-[10px] font-bold text-slate-500 flex items-center justify-center">
                    {tIdx + 1}
                  </span>
                  <span className="text-cyber-cyan">{token}</span>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    disabled={tIdx === 0}
                    onClick={() => {
                      const next = [...userState.currentOrder];
                      const temp = next[tIdx - 1];
                      next[tIdx - 1] = next[tIdx];
                      next[tIdx] = temp;
                      setUserState({ currentOrder: next });
                    }}
                    className="px-2 py-1 rounded bg-space-900 border border-space-750 text-slate-400 hover:text-white disabled:opacity-30 text-[10px]"
                  >
                    &uarr; Up
                  </button>
                  <button
                    disabled={tIdx === (userState.currentOrder?.length || 0) - 1}
                    onClick={() => {
                      const next = [...userState.currentOrder];
                      const temp = next[tIdx + 1];
                      next[tIdx + 1] = next[tIdx];
                      next[tIdx] = temp;
                      setUserState({ currentOrder: next });
                    }}
                    className="px-2 py-1 rounded bg-space-900 border border-space-750 text-slate-400 hover:text-white disabled:opacity-30 text-[10px]"
                  >
                    &darr; Down
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!feedback?.isCorrect && (
            <GlowButton
              variant="primary"
              size="sm"
              onClick={() => handleCheckAnswer()}
              className="mt-2"
            >
              Verify Code Sequence
            </GlowButton>
          )}
        </div>
      )}

      {/* 7: CHANGE VALUE & REACTIVE GAUGE */}
      {activityType === 'CHANGE_VALUE' && (
        <div className="space-y-6 pt-2">
          {/* Reactive HUD Meter / Gauge */}
          <div className="p-5 rounded-2xl bg-space-950 border border-space-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Gauge className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                  {activityConfig.gaugeLabel || 'Live Thruster Tank Telemetry'}
                </span>
              </div>
              <span className="text-sm font-mono font-bold text-amber-400">
                {activityConfig.multiplier
                  ? (userState?.currentValue ?? 0) * activityConfig.multiplier
                  : userState?.currentValue ?? 0}{' '}
                {activityConfig.unit || 'L'}
              </span>
            </div>

            {/* Animated Gauge Bar */}
            <div className="w-full bg-space-900 h-4 rounded-full overflow-hidden p-0.5 border border-white/5 relative">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                animate={{
                  width: `${Math.min(
                    100,
                    Math.max(
                      5,
                      (((activityConfig.multiplier
                        ? (userState?.currentValue ?? 0) * activityConfig.multiplier
                        : userState?.currentValue ?? 0) /
                        (activityConfig.gaugeMax || 300)) *
                        100)
                    )
                  )}%`,
                }}
                transition={{ type: 'spring', damping: 15 }}
              />
            </div>

            {/* Live Java Code Simulation Box */}
            <div className="p-3 rounded-xl bg-space-900 border border-space-800 font-mono text-xs text-slate-300">
              <span className="text-slate-500">// Real-time Memory State</span>
              <p className="text-cyber-cyan font-bold">
                int {activityConfig.variable || 'fuel'} ={' '}
                <span className="text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                  {userState?.currentValue ?? activityConfig.initialValue ?? 100}
                </span>
                ;
              </p>
            </div>
          </div>

          {/* Value Slider Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">
                Adjust {activityConfig.variable || 'fuel'} slider:
              </span>
              <span className="font-bold text-white">
                Target: {activityConfig.targetValue} {activityConfig.unit || ''}
              </span>
            </div>

            <input
              type="range"
              min={activityConfig.initialValue ?? 0}
              max={(activityConfig.targetValue ?? 250) * 1.5}
              value={userState?.currentValue ?? activityConfig.initialValue ?? 100}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setUserState({ currentValue: val });
                if (val === activityConfig.targetValue) {
                  handleCheckAnswer(true, `Target reached: ${activityConfig.variable || 'fuel'} set to ${val}!`);
                }
              }}
              className="w-full h-2 bg-space-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>
        </div>
      )}

      {/* 8: SHORT CODE TASK */}
      {activityType === 'SHORT_TASK' && (
        <div className="space-y-3 pt-2">
          <p className="text-xs font-mono text-slate-400">
            Enter the exact Java statement below:
          </p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={userState?.inputCode || ''}
              onChange={(e) => setUserState({ inputCode: e.target.value })}
              placeholder={activityConfig.placeholder || 'e.g. import java.util.Scanner;'}
              className="flex-1 px-4 py-3 rounded-xl bg-space-950 border border-space-800 font-mono text-xs text-cyber-cyan focus:outline-none focus:border-cyber-cyan transition-colors"
            />
            <GlowButton
              variant="primary"
              size="sm"
              onClick={() => handleCheckAnswer()}
            >
              Execute
            </GlowButton>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* FEEDBACK BANNER & EXPLANATION (NON-PUNISHING) */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {feedback?.submitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-xl border text-xs font-mono space-y-2 ${
              feedback.isCorrect
                ? 'bg-cyber-emerald/10 border-cyber-emerald/40 text-cyber-emerald'
                : 'bg-rose-500/10 border-rose-500/40 text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center space-x-1.5 uppercase tracking-wide">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Byte's Diagnostic Feed</span>
              </span>
              {!feedback.isCorrect && (
                <button
                  onClick={handleRetry}
                  className="px-2.5 py-1 rounded bg-space-900 border border-space-700 text-cyber-cyan hover:bg-space-850 flex items-center space-x-1 text-[11px]"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Retry Simulation</span>
                </button>
              )}
            </div>

            <p className="leading-relaxed">{feedback.message}</p>

            <div className="pt-2 border-t border-white/5 space-y-1">
              <span className="text-cyber-cyan font-bold uppercase text-[10px]">
                Concept Debrief:
              </span>
              <p className="text-slate-300">{question.explanation}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------- */}
      {/* HINT BUTTON & REVEAL (Safe & Educational) */}
      {/* ------------------------------------------------------------- */}
      {question.hint && (
        <div className="pt-2 flex flex-col items-start gap-2 border-t border-space-800/80">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-xs font-mono text-slate-400 hover:text-amber-400 transition-colors flex items-center space-x-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>{showHint ? 'Hide Cadet Hint' : 'Request Contextual Hint'}</span>
          </button>

          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 font-mono text-xs w-full"
            >
              <span className="font-bold block mb-1">BYTE TACTICAL HINT:</span>
              <p>{question.hint}</p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

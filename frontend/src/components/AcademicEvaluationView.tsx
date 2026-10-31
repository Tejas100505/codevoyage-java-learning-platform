import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  TrendingUp,
  FileSpreadsheet,
  Download,
  Lock,
  Play,
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  Sparkles,
  BarChart,
  RefreshCw,
  Code2
} from 'lucide-react';
import {
  evaluationService,
  EvaluationComparison,
  EvaluationQuestion,
  EvaluationDatasetRecord
} from '../services/evaluationService';
import { GlassCard } from '../components/GlassCard';
import { GlowButton } from '../components/GlowButton';
import { ProgressBar } from '../components/ProgressBar';

export const AcademicEvaluationView: React.FC = () => {
  const [comparison, setComparison] = useState<EvaluationComparison | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Active Test Modal State
  const [activeModalType, setActiveModalType] = useState<'PRE_TEST' | 'POST_TEST' | null>(null);
  const [questions, setQuestions] = useState<EvaluationQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Dataset modal preview
  const [showDatasetModal, setShowDatasetModal] = useState<boolean>(false);
  const [dataset, setDataset] = useState<EvaluationDatasetRecord[]>([]);
  const [loadingDataset, setLoadingDataset] = useState<boolean>(false);

  const fetchComparison = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await evaluationService.getComparison();
      setComparison(data);
    } catch (err) {
      console.error('Failed to load academic evaluation comparison', err);
      setError('Evaluation server unreachable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison();
  }, []);

  const startTest = async (type: 'PRE_TEST' | 'POST_TEST') => {
    try {
      setActiveModalType(type);
      setLoadingQuestions(true);
      setUserAnswers({});
      setCurrentQuestionIndex(0);
      setStartTime(Date.now());
      const data = await evaluationService.getQuestions(type);
      setQuestions(data);
    } catch (err) {
      console.error('Failed to fetch test questions', err);
      setActiveModalType(null);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmitTest = async () => {
    if (!activeModalType) return;
    try {
      setSubmitting(true);
      const timeSpentSeconds = Math.round((Date.now() - startTime) / 1000);
      const updatedComparison = await evaluationService.submitEvaluation(
        activeModalType,
        userAnswers,
        timeSpentSeconds
      );
      setComparison(updatedComparison);
      setActiveModalType(null);
    } catch (err) {
      console.error('Failed to submit evaluation', err);
      alert('Could not record evaluation attempt. Please retry.');
    } finally {
      setSubmitting(false);
    }
  };

  const loadDatasetPreview = async () => {
    try {
      setShowDatasetModal(true);
      setLoadingDataset(true);
      const data = await evaluationService.getDatasetJson();
      setDataset(data);
    } catch (err) {
      console.error('Failed to load dataset', err);
    } finally {
      setLoadingDataset(false);
    }
  };

  if (loading && !comparison) {
    return (
      <div className="p-8 rounded-3xl glass-panel border border-cyber-cyan/30 text-center space-y-3 font-mono">
        <div className="w-8 h-8 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-cyber-cyan">RETRIEVING ACADEMIC EVALUATION DOSSIER...</p>
      </div>
    );
  }

  const pre = comparison?.preTest;
  const post = comparison?.postTest;
  const hasBoth = Boolean(pre && post);

  return (
    <div className="space-y-6 font-mono">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl glass-panel border border-amber-500/30 bg-gradient-to-r from-space-950 via-space-900 to-space-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>EMPIRICAL LEARNING EVALUATION PROTOCOL</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
            JAVA ACADEMIC PRE-TEST & POST-TEST
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Objective, evidence-based methodology to evaluate whether CodeVoyage genuinely teaches Java fundamentals. Answers are strictly hidden until evaluation completion.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <GlowButton
            variant="secondary"
            size="sm"
            onClick={loadDatasetPreview}
            icon={<FileSpreadsheet className="w-4 h-4 text-cyber-cyan" />}
          >
            DATASET EXPORT
          </GlowButton>
          <button
            onClick={fetchComparison}
            className="p-2 rounded-xl bg-space-900 hover:bg-space-800 border border-white/10 text-slate-300 hover:text-white"
            title="Refresh Evaluation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Comparison Grid: Pre-Test vs Post-Test Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pre-Test Card */}
        <div className="p-6 rounded-3xl glass-panel border border-white/10 bg-space-900/60 space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Baseline Diagnostic
              </span>
              {comparison?.preTestCompleted ? (
                <span className="px-2.5 py-0.5 rounded-full bg-cyber-emerald/15 border border-cyber-emerald/30 text-cyber-emerald text-[10px] font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>RECORDED</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                  PENDING BASELINE
                </span>
              )}
            </div>

            <h3 className="text-lg font-black text-white uppercase">PRE-TEST EVALUATION</h3>
            <p className="text-xs text-slate-400">
              Evaluates incoming Java competency across basic syntax, variables, data types, input, operators, and conditions before beginning missions.
            </p>

            {pre ? (
              <div className="p-4 rounded-2xl bg-space-950/80 border border-space-800 space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-400">Baseline Score:</span>
                  <span className="text-2xl font-black text-white">
                    {pre.score} <span className="text-xs text-slate-500 font-normal">/ {pre.totalQuestions} ({pre.scorePercentage}%)</span>
                  </span>
                </div>
                <ProgressBar value={pre.scorePercentage} max={100} color="amber" size="sm" />
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-1">
                  <div>Time Spent: <span className="text-white font-bold">{pre.timeSpentSeconds}s</span></div>
                  <div>Status: <span className="text-cyber-emerald font-bold">Evaluation Locked</span></div>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-space-950/40 border border-dashed border-space-800 text-center space-y-2">
                <BrainCircuit className="w-6 h-6 text-slate-500 mx-auto" />
                <p className="text-xs text-slate-400">
                  Ready to gauge your starting Java knowledge?
                </p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-space-800">
            {comparison?.preTestCompleted ? (
              <div className="text-[11px] text-slate-400 text-center italic">
                Original baseline evaluation preserved to maintain academic integrity.
              </div>
            ) : (
              <GlowButton
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => startTest('PRE_TEST')}
                icon={<Play className="w-4 h-4" />}
              >
                BEGIN PRE-TEST ASSESSMENT
              </GlowButton>
            )}
          </div>
        </div>

        {/* Post-Test Card */}
        <div className="p-6 rounded-3xl glass-panel border border-white/10 bg-space-900/60 space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Post-Curriculum Mastery
              </span>
              {comparison?.postTestCompleted ? (
                <span className="px-2.5 py-0.5 rounded-full bg-cyber-emerald/15 border border-cyber-emerald/30 text-cyber-emerald text-[10px] font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>RECORDED</span>
                </span>
              ) : comparison?.canTakePostTest ? (
                <span className="px-2.5 py-0.5 rounded-full bg-cyber-cyan/15 border border-cyber-cyan/30 text-cyber-cyan text-[10px] font-bold animate-pulse">
                  READY TO EVALUATE
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-space-900 border border-space-800 text-slate-500 text-[10px] font-bold flex items-center space-x-1">
                  <Lock className="w-2.5 h-2.5" />
                  <span>LOCKED</span>
                </span>
              )}
            </div>

            <h3 className="text-lg font-black text-white uppercase">POST-TEST EVALUATION</h3>
            <p className="text-xs text-slate-400">
              Equivalent assessment measuring the exact same 6 Java competencies with distinct, newly phrased challenge scenarios.
            </p>

            {post ? (
              <div className="p-4 rounded-2xl bg-space-950/80 border border-space-800 space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-400">Graduation Score:</span>
                  <span className="text-2xl font-black text-cyber-cyan">
                    {post.score} <span className="text-xs text-slate-500 font-normal">/ {post.totalQuestions} ({post.scorePercentage}%)</span>
                  </span>
                </div>
                <ProgressBar value={post.scorePercentage} max={100} color="cyan" size="sm" />
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-1">
                  <div>Time Spent: <span className="text-white font-bold">{post.timeSpentSeconds}s</span></div>
                  <div>Status: <span className="text-cyber-emerald font-bold">Graduation Locked</span></div>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-space-950/40 border border-dashed border-space-800 text-center space-y-2">
                <Lock className="w-6 h-6 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">
                  {comparison?.postTestLockedReason || 'Complete mission curriculum to unlock.'}
                </p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-space-800">
            {comparison?.postTestCompleted ? (
              <div className="text-[11px] text-slate-400 text-center italic">
                Post-test evaluation completed and locked.
              </div>
            ) : comparison?.canTakePostTest ? (
              <GlowButton
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => startTest('POST_TEST')}
                icon={<Play className="w-4 h-4" />}
              >
                BEGIN POST-TEST ASSESSMENT
              </GlowButton>
            ) : (
              <GlowButton variant="secondary" size="md" className="w-full" disabled>
                LOCKED (PROGRESSION REQUIRED)
              </GlowButton>
            )}
          </div>
        </div>
      </div>

      {/* Comparative Learning Gain Verdict Card */}
      {hasBoth && pre && post && (
        <div className="p-6 rounded-3xl glass-panel border border-cyber-cyan/40 bg-space-900/80 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-space-800 pb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-cyber-emerald" />
              <h3 className="text-base font-black text-white uppercase tracking-wider">
                LEARNING IMPROVEMENT & IMPACT REPORT
              </h3>
            </div>
            <span className="text-xs font-bold text-cyber-emerald bg-cyber-emerald/10 border border-cyber-emerald/30 px-3 py-1 rounded-xl">
              {comparison.learningOutcomeSummary || 'Evaluation Complete'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-space-950/80 border border-space-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Baseline Pre-Test</span>
              <div className="text-2xl font-black text-amber-400">{pre.scorePercentage}%</div>
              <p className="text-[10px] text-slate-500">{pre.score} of 6 questions</p>
            </div>

            <div className="p-4 rounded-2xl bg-space-950/80 border border-space-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Graduation Post-Test</span>
              <div className="text-2xl font-black text-cyber-cyan">{post.scorePercentage}%</div>
              <p className="text-[10px] text-slate-500">{post.score} of 6 questions</p>
            </div>

            <div className="p-4 rounded-2xl bg-space-950/80 border border-cyber-emerald/40 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Calculated Improvement</span>
              <div className="text-2xl font-black text-cyber-emerald">
                {comparison.scoreImprovementPercentage >= 0 ? `+${comparison.scoreImprovementPercentage}%` : `${comparison.scoreImprovementPercentage}%`}
              </div>
              <p className="text-[10px] text-slate-400 font-bold">
                {comparison.absoluteScoreGain >= 0 ? `+${comparison.absoluteScoreGain}` : comparison.absoluteScoreGain} Raw Points Gained
              </p>
            </div>
          </div>

          {/* Granular Concept Differential */}
          {comparison.conceptGains && (
            <div className="pt-2 border-t border-space-800 space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Concept-Level Score Progression:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
                {Object.entries(comparison.conceptGains).map(([key, gain]) => {
                  const label = key.replace(/([A-Z])/g, ' $1').trim();
                  return (
                    <div key={key} className="p-2.5 rounded-xl bg-space-950 border border-space-800">
                      <div className="text-[10px] text-slate-400 uppercase truncate">{label}</div>
                      <div className={`text-sm font-bold ${gain > 0 ? 'text-cyber-emerald' : gain === 0 ? 'text-slate-300' : 'text-red-400'}`}>
                        {gain > 0 ? `+${gain}` : gain}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Test Execution Modal (Pre or Post) */}
      <AnimatePresence>
        {activeModalType && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-space-950 border border-cyber-cyan/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_0_50px_rgba(0,240,255,0.2)] max-h-[90vh] overflow-y-auto font-mono"
            >
              <div className="flex items-center justify-between border-b border-space-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-cyber-cyan uppercase tracking-wider">
                    {activeModalType === 'PRE_TEST' ? 'BASELINE EVALUATION' : 'POST-CURRICULUM EVALUATION'}
                  </span>
                  <h3 className="text-lg font-black text-white uppercase">
                    QUESTION {currentQuestionIndex + 1} OF {questions.length}
                  </h3>
                </div>

                <button
                  onClick={() => setActiveModalType(null)}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg border border-space-800"
                >
                  ABORT
                </button>
              </div>

              {loadingQuestions ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-8 h-8 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-cyber-cyan">GENERATING BALANCED EVALUATION POOL...</p>
                </div>
              ) : questions.length > 0 ? (
                <div className="space-y-6">
                  {/* Current Question */}
                  {(() => {
                    const q = questions[currentQuestionIndex];
                    if (!q) return null;
                    const selected = userAnswers[q.id];

                    return (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-[11px] text-amber-400 font-bold uppercase">
                          <Code2 className="w-4 h-4" />
                          <span>TARGET CONCEPT: {q.conceptLabel}</span>
                        </div>

                        <p className="text-sm text-white font-medium">{q.prompt}</p>

                        {q.codeSnippet && (
                          <div className="p-3.5 rounded-xl bg-space-900 border border-space-800 font-mono text-xs text-cyber-cyan whitespace-pre-wrap">
                            {q.codeSnippet}
                          </div>
                        )}

                        {/* Options */}
                        <div className="space-y-2 pt-2">
                          {q.options.map((opt, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSelectOption(q.id, idx)}
                              className={`w-full text-left p-3.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                                selected === idx
                                  ? 'border-cyber-cyan bg-cyber-cyan/15 text-white shadow-glow-cyan'
                                  : 'border-space-800 bg-space-900/50 text-slate-300 hover:border-space-700 hover:bg-space-900'
                              }`}
                            >
                              <span>{opt}</span>
                              <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
                                selected === idx ? 'border-cyber-cyan bg-cyber-cyan text-space-950 font-black' : 'border-space-700'
                              }`}>
                                {String.fromCharCode(65 + idx)}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Navigation controls */}
                  <div className="flex items-center justify-between pt-4 border-t border-space-800">
                    <button
                      onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                      disabled={currentQuestionIndex === 0}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      PREVIOUS
                    </button>

                    {currentQuestionIndex < questions.length - 1 ? (
                      <GlowButton
                        variant="secondary"
                        size="sm"
                        onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                        icon={<ArrowRight className="w-4 h-4" />}
                      >
                        NEXT
                      </GlowButton>
                    ) : (
                      <GlowButton
                        variant="primary"
                        size="md"
                        disabled={Object.keys(userAnswers).length < questions.length || submitting}
                        onClick={handleSubmitTest}
                      >
                        {submitting ? 'COMPUTING VERIFICATION...' : 'SUBMIT EVALUATION'}
                      </GlowButton>
                    )}
                  </div>
                </div>
              ) : null}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dataset Modal for Research / Project Evaluation */}
      <AnimatePresence>
        {showDatasetModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-4xl bg-space-950 border border-cyber-cyan/40 rounded-3xl p-6 sm:p-8 space-y-5 shadow-[0_0_50px_rgba(0,240,255,0.2)] max-h-[85vh] overflow-y-auto font-mono"
            >
              <div className="flex items-center justify-between border-b border-space-800 pb-3">
                <div className="flex items-center space-x-2">
                  <FileSpreadsheet className="w-5 h-5 text-cyber-cyan" />
                  <h3 className="text-base font-black text-white uppercase tracking-wider">
                    ACADEMIC EVALUATION DATASET
                  </h3>
                </div>

                <div className="flex items-center space-x-2">
                  <a
                    href={evaluationService.getCsvDownloadUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyber-emerald/20 border border-cyber-emerald/40 text-xs font-bold text-cyber-emerald hover:bg-cyber-emerald/30"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>EXPORT CSV</span>
                  </a>
                  <button
                    onClick={() => setShowDatasetModal(false)}
                    className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg border border-space-800"
                  >
                    CLOSE
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-400">
                Exportable empirical dataset tracking student Pre-test, Post-test, and normalized learning gains across 6 Java fundamentals for formal project verification and analysis.
              </p>

              {loadingDataset ? (
                <div className="py-8 text-center text-xs text-cyber-cyan animate-pulse">
                  Aggregating cohort evaluation records...
                </div>
              ) : (
                <div className="overflow-x-auto border border-space-800 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-space-900 border-b border-space-800 text-[10px] text-slate-400 uppercase">
                      <tr>
                        <th className="p-3">Cadet</th>
                        <th className="p-3">Level</th>
                        <th className="p-3">Missions</th>
                        <th className="p-3">Pre-Test</th>
                        <th className="p-3">Post-Test</th>
                        <th className="p-3">Score Gain</th>
                        <th className="p-3">Learning Impact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-space-800">
                      {dataset.map((row) => (
                        <tr key={row.userId} className="hover:bg-space-900/40">
                          <td className="p-3 font-bold text-white">{row.username}</td>
                          <td className="p-3 text-slate-300">Lvl {row.userLevel}</td>
                          <td className="p-3 text-slate-300">{row.missionsCompleted}</td>
                          <td className="p-3 text-amber-400 font-bold">
                            {row.preTestCompleted ? `${row.preTestPercentage}%` : '—'}
                          </td>
                          <td className="p-3 text-cyber-cyan font-bold">
                            {row.postTestCompleted ? `${row.postTestPercentage}%` : '—'}
                          </td>
                          <td className="p-3 font-bold text-cyber-emerald">
                            {row.percentageGain !== undefined ? (row.percentageGain >= 0 ? `+${row.percentageGain}%` : `${row.percentageGain}%`) : '—'}
                          </td>
                          <td className="p-3 text-[11px] text-slate-300">
                            {row.normalizedLearningGain || 'In Progress'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

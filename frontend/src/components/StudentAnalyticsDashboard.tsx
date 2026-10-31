import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Target,
  BarChart3,
  Layers,
  Sparkles,
  RefreshCw,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Terminal,
  ShieldCheck,
  Info,
  HelpCircle,
  X,
  ChevronRight,
  Users,
  Lock
} from 'lucide-react';
import {
  analyticsService,
  UserAnalytics,
  ConceptMastery,
  PerformanceTrendsResponse,
  CodingErrorAnalytics,
  LearningRecommendation,
  FacultyAnalytics
} from '../services/analyticsService';
import { ProgressBar } from './ProgressBar';
import { useAuth } from '../context/AuthContext';

export const StudentAnalyticsDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  // Top Tabs: 'overview' | 'trends' | 'errors' | 'recommendations' | 'faculty'
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'errors' | 'recommendations' | 'faculty'>('overview');

  // Overview Data
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [selectedConcept, setSelectedConcept] = useState<ConceptMastery | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);

  // Trends Data
  const [trendRange, setTrendRange] = useState<'7d' | '30d' | 'all'>('7d');
  const [trends, setTrends] = useState<PerformanceTrendsResponse | null>(null);
  const [trendsLoading, setTrendsLoading] = useState<boolean>(false);

  // Error Analysis Data
  const [errorAnalytics, setErrorAnalytics] = useState<CodingErrorAnalytics | null>(null);
  const [errorsLoading, setErrorsLoading] = useState<boolean>(false);

  // Recommendations Data
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([]);
  const [recsLoading, setRecsLoading] = useState<boolean>(false);

  // Faculty Data
  const [facultyData, setFacultyData] = useState<FacultyAnalytics | null>(null);
  const [facultyLoading, setFacultyLoading] = useState<boolean>(false);

  // General Loading & Error
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isFaculty = user?.role === 'COMMANDER' || user?.role === 'ADMIN';

  // 1. Fetch Overview Analytics
  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsService.getMyAnalytics();
      setAnalytics(data);
      if (data.conceptMasteries && data.conceptMasteries.length > 0 && !selectedConcept) {
        setSelectedConcept(data.conceptMasteries[0]);
      }
    } catch (err) {
      console.error('Failed to load learning analytics', err);
      setError('Unable to load verified learning evidence.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch Trends
  const fetchTrends = async (range: '7d' | '30d' | 'all') => {
    try {
      setTrendsLoading(true);
      const data = await analyticsService.getPerformanceTrends(range);
      setTrends(data);
    } catch (err) {
      console.error('Failed to fetch performance trends', err);
    } finally {
      setTrendsLoading(false);
    }
  };

  // 3. Fetch Error Diagnostics
  const fetchErrorAnalytics = async () => {
    try {
      setErrorsLoading(true);
      const data = await analyticsService.getCodingErrorAnalytics();
      setErrorAnalytics(data);
    } catch (err) {
      console.error('Failed to fetch error analytics', err);
    } finally {
      setErrorsLoading(false);
    }
  };

  // 4. Fetch Recommendations
  const fetchRecommendations = async () => {
    try {
      setRecsLoading(true);
      const data = await analyticsService.getPersonalizedRecommendations();
      setRecommendations(data);
    } catch (err) {
      console.error('Failed to fetch recommendations', err);
    } finally {
      setRecsLoading(false);
    }
  };

  // 5. Fetch Faculty Analytics
  const fetchFacultyData = async () => {
    if (!isFaculty) return;
    try {
      setFacultyLoading(true);
      const data = await analyticsService.getFacultyAnalytics();
      setFacultyData(data);
    } catch (err) {
      console.error('Failed to fetch faculty analytics', err);
    } finally {
      setFacultyLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOverview();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (activeTab === 'trends' && !trends) {
      fetchTrends(trendRange);
    } else if (activeTab === 'errors' && !errorAnalytics) {
      fetchErrorAnalytics();
    } else if (activeTab === 'recommendations' && recommendations.length === 0) {
      fetchRecommendations();
    } else if (activeTab === 'faculty' && isFaculty && !facultyData) {
      fetchFacultyData();
    }
  }, [activeTab, isAuthenticated]);

  const handleRangeChange = (newRange: '7d' | '30d' | 'all') => {
    setTrendRange(newRange);
    fetchTrends(newRange);
  };

  const handleOpenConcept = (concept: ConceptMastery) => {
    setSelectedConcept(concept);
    setIsInspectorOpen(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="p-8 rounded-2xl glass-panel border border-white/10 text-center space-y-4 font-mono max-w-md mx-auto my-8">
        <Lock className="w-8 h-8 text-cyber-cyan mx-auto" />
        <h3 className="text-base font-bold text-white uppercase tracking-wider">
          Cadet Clearance Required
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Log in with your Starfleet cadet credentials to view verified Java learning telemetry, compiler performance trends, and concept evidence.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-cyber-cyan text-space-950 font-bold hover:bg-cyan-300 transition-colors text-xs"
        >
          <span>Proceed to Cadet Login</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  if (loading && !analytics) {
    return (
      <div className="p-12 rounded-2xl glass-panel border border-white/10 flex flex-col items-center justify-center space-y-3 min-h-[350px]">
        <div className="w-8 h-8 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
          Compiling verified Java telemetry & audit logs...
        </span>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="p-8 rounded-2xl glass-panel border border-rose-500/30 text-center space-y-4 font-mono">
        <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
        <p className="text-xs text-rose-300">{error || 'No learning evidence discovered.'}</p>
        <button
          onClick={fetchOverview}
          className="px-4 py-1.5 rounded-lg bg-space-850 hover:bg-space-800 border border-white/10 text-xs text-white"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // Calculate overall concept mastery average
  const totalConcepts = analytics.conceptMasteries?.length || 1;
  const overallMastery = Math.round(
    (analytics.conceptMasteries || []).reduce((acc, c) => acc + (c.masteryPercentage || 0), 0) / totalConcepts
  );

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* ========================================================================= */}
      {/* 1. HEADER & SUB-NAVIGATION TABS                                           */}
      {/* ========================================================================= */}
      <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-cyber-cyan font-bold uppercase tracking-wide">
              <BrainCircuit className="w-4 h-4 text-cyber-cyan" />
              <span>Learning Analytics & Intelligence System</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Demonstrated Competency Telemetry
            </h2>
            <p className="text-xs text-slate-400">
              Measures genuine Java proficiency through compiler test runs, practice accuracy, and challenge clears—never inferred from XP alone.
            </p>
          </div>

          <button
            onClick={() => {
              fetchOverview();
              if (activeTab === 'trends') fetchTrends(trendRange);
              if (activeTab === 'errors') fetchErrorAnalytics();
              if (activeTab === 'recommendations') fetchRecommendations();
              if (activeTab === 'faculty') fetchFacultyData();
            }}
            className="p-2.5 rounded-xl bg-space-900 hover:bg-space-850 border border-white/10 text-slate-400 hover:text-white transition-colors self-start sm:self-auto flex items-center space-x-1.5"
            title="Refresh All Analytics Telemetry"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="text-[11px]">Sync Telemetry</span>
          </button>
        </div>

        {/* Analytics Section Sub-Tabs */}
        <div className="flex items-center space-x-2 border-t border-white/10 pt-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'overview'
                ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/50 shadow-glow-cyan'
                : 'text-slate-400 hover:text-white hover:bg-space-900 border border-transparent'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>OVERVIEW & VITALS</span>
          </button>

          <button
            onClick={() => setActiveTab('trends')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'trends'
                ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/50 shadow-glow-cyan'
                : 'text-slate-400 hover:text-white hover:bg-space-900 border border-transparent'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>PERFORMANCE TRENDS</span>
          </button>

          <button
            onClick={() => setActiveTab('errors')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'errors'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-glow-rose'
                : 'text-slate-400 hover:text-white hover:bg-space-900 border border-transparent'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>CODING ANALYSIS</span>
          </button>

          <button
            onClick={() => setActiveTab('recommendations')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'recommendations'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-glow-amber'
                : 'text-slate-400 hover:text-white hover:bg-space-900 border border-transparent'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>RECOMMENDATIONS</span>
          </button>

          {isFaculty && (
            <button
              onClick={() => setActiveTab('faculty')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'faculty'
                  ? 'bg-cyber-emerald/20 text-cyber-emerald border border-cyber-emerald/50 shadow-glow-emerald'
                  : 'text-slate-400 hover:text-white hover:bg-space-900 border border-transparent'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>FACULTY ROSTER</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TAB CONTENT: OVERVIEW                                                  */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Informative Empty State for brand new cadets with 0 activity */}
          {!analytics.hasSufficientData && (
            <div className="p-6 rounded-2xl glass-panel border border-cyber-cyan/30 bg-cyber-cyan/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-start space-x-3">
                <Info className="w-6 h-6 text-cyber-cyan shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm">Initial Telemetry Clearance Required</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Welcome, Cadet. Analytics are computed strictly from verified Java compiler executions, unit test results, and interactive drills. No submissions have been recorded yet. Launch Mission 01 to generate your first live competency audit.
                  </p>
                </div>
              </div>
              <Link
                to="/mission/1"
                className="px-4 py-2 rounded-xl bg-cyber-cyan text-space-950 font-bold hover:bg-cyan-300 transition-colors shrink-0 flex items-center space-x-1.5"
              >
                <span>Launch Mission 01</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* 4 Primary Vitals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1: Overall Concept Mastery */}
            <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-2 relative group">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-semibold">Curriculum Mastery</span>
                <Activity className="w-4 h-4 text-cyber-cyan" />
              </div>
              <div className="text-3xl font-bold text-cyber-cyan">
                {analytics.hasSufficientData ? `${overallMastery}%` : 'N/A'}
              </div>
              <ProgressBar value={overallMastery} max={100} color="cyan" size="sm" />
              <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500">
                <span>Active Concepts: {analytics.activeConceptMasteryPercentage}%</span>
                <span title="Calculated from verified test passes, practice scores, and hint penalties across 10 Java concepts.">
                  <HelpCircle className="w-3 h-3 text-slate-400 cursor-pointer" />
                </span>
              </div>
            </div>

            {/* Metric 2: Compiler Test Pass Rate */}
            <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-2 relative group">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-semibold">Test Pass Rate</span>
                <CheckCircle2 className="w-4 h-4 text-cyber-emerald" />
              </div>
              <div className="text-3xl font-bold text-cyber-emerald">
                {analytics.hasSufficientData ? `${analytics.testSuccessRate}%` : 'N/A'}
              </div>
              <ProgressBar value={analytics.testSuccessRate} max={100} color="emerald" size="sm" />
              <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500">
                <span>Total Runs: {analytics.codingAttempts}</span>
                <span title="Ratio of coding challenge submissions where all unit test cases passed.">
                  <HelpCircle className="w-3 h-3 text-slate-400 cursor-pointer" />
                </span>
              </div>
            </div>

            {/* Metric 3: Clean Compilation Rate */}
            <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-2 relative group">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-semibold">Clean Compilation</span>
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-3xl font-bold text-cyan-400">
                {analytics.hasSufficientData ? `${analytics.compilationSuccessRate}%` : 'N/A'}
              </div>
              <ProgressBar value={analytics.compilationSuccessRate} max={100} color="cyan" size="sm" />
              <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500">
                <span>Syntax Faults: {analytics.syntaxErrorsEncountered}</span>
                <span title="Measures how often submitted Java source code compiles with zero syntax errors under javac.">
                  <HelpCircle className="w-3 h-3 text-slate-400 cursor-pointer" />
                </span>
              </div>
            </div>

            {/* Metric 4: Missions Cleared */}
            <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-2 relative group">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-semibold">Missions Cleared</span>
                <Target className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-bold text-white">
                {analytics.completedMissionsCount}{' '}
                <span className="text-sm font-normal text-slate-500">/ {analytics.totalMissionsCount}</span>
              </div>
              <ProgressBar
                value={(analytics.completedMissionsCount / (analytics.totalMissionsCount || 1)) * 100}
                max={100}
                color="amber"
                size="sm"
              />
              <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500">
                <span>Theory Checkpoints: {analytics.lessonsCompleted}</span>
                <span title="Number of coding challenges cleared with verified test execution.">
                  <HelpCircle className="w-3 h-3 text-slate-400 cursor-pointer" />
                </span>
              </div>
            </div>
          </div>

          {/* Practice Performance & Mastery Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Practice vs Coding Breakdown */}
            <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <BarChart3 className="w-4 h-4 text-cyber-cyan" />
                  <span>Practice & Coding Breakdown</span>
                </span>
                <span className="text-[10px] text-slate-500">Real Persisted Activity</span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Practice Question Accuracy:</span>
                  <span className="font-bold text-cyber-emerald">
                    {analytics.hasSufficientData ? `${analytics.practiceAccuracyPercentage}%` : 'Pending'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">First-Attempt Clears:</span>
                  <span className="font-bold text-cyber-cyan">
                    {analytics.firstAttemptPasses} challenges
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Average Attempts / Challenge:</span>
                  <span className="font-bold text-white">
                    {analytics.hasSufficientData ? analytics.averageAttemptsPerChallenge : '—'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Sub-Space Hints Used:</span>
                  <span className="font-bold text-amber-400">{analytics.hintsUsed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Active Study Time:</span>
                  <span className="font-bold text-white">{analytics.formattedTimeSpent}</span>
                </div>
              </div>
            </div>

            {/* Strong Concepts vs Areas Needing Practice */}
            <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyber-emerald" />
                  <span>Mastery Distribution</span>
                </span>
                <span className="text-[10px] text-slate-500">Threshold: 75%</span>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-[11px] text-cyber-emerald font-bold block mb-1.5">
                    STRONG CONCEPTS (≥75% Verified Evidence)
                  </span>
                  {analytics.strongConcepts.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {analytics.strongConcepts.map((sc, i) => (
                        <span
                          key={`sc-${sc}-${i}`}
                          className="px-2.5 py-1 rounded-lg bg-cyber-emerald/15 border border-cyber-emerald/30 text-cyber-emerald font-semibold text-[11px]"
                        >
                          ✓ {sc}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic text-[11px]">
                      Complete coding missions with high pass rates to validate mastery.
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-white/5">
                  <span className="text-[11px] text-amber-400 font-bold block mb-1.5">
                    CONCEPTS NEEDING DRILLS (&lt;75% Evidence)
                  </span>
                  {analytics.conceptsNeedingPractice.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {analytics.conceptsNeedingPractice.map((cn, i) => (
                        <span
                          key={`cn-${cn}-${i}`}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold text-[11px]"
                        >
                          ! {cn}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-cyber-emerald italic text-[11px]">
                      All attempted concepts currently demonstrate proficient performance.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Java Curriculum Concepts Matrix */}
          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-cyber-cyan" />
                  <span>Java Curriculum Concepts Matrix</span>
                </h3>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Click any concept card to launch the Concept Inspector with audit trail & evidence breakdown.
                </p>
              </div>

              <Link
                to="/codex"
                className="text-cyber-cyan hover:underline text-xs flex items-center space-x-1"
              >
                <span>Open Java Codex</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Concepts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {analytics.conceptMasteries.map((concept) => {
                const isSelected = selectedConcept?.conceptKey === concept.conceptKey;
                const isMastered = concept.status === 'MASTERED';
                const isProficient = concept.status === 'PROFICIENT';
                const needsPractice = concept.status === 'NEEDS_PRACTICE';
                const isLocked = concept.status === 'LOCKED';

                return (
                  <div
                    key={concept.conceptKey}
                    onClick={() => handleOpenConcept(concept)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                      isSelected
                        ? 'border-cyber-cyan bg-space-850 ring-1 ring-cyber-cyan/50 shadow-glow-cyan'
                        : isMastered
                        ? 'border-cyber-emerald/40 bg-space-900/60 hover:border-cyber-emerald/70'
                        : isProficient
                        ? 'border-cyan-500/40 bg-space-900/60 hover:border-cyan-400/70'
                        : needsPractice
                        ? 'border-amber-500/40 bg-space-900/60 hover:border-amber-400/70'
                        : 'border-space-800 bg-space-950/40 opacity-60 hover:opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold truncate text-xs">{concept.conceptName}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                          isMastered
                            ? 'bg-cyber-emerald/20 text-cyber-emerald'
                            : isProficient
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : needsPractice
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-space-800 text-slate-500'
                        }`}
                      >
                        {concept.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-400">Mastery Score</span>
                        <span className="font-bold text-white">{concept.masteryPercentage}%</span>
                      </div>
                      <ProgressBar
                        value={concept.masteryPercentage}
                        max={100}
                        color={isMastered ? 'emerald' : needsPractice ? 'amber' : 'cyan'}
                        size="sm"
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/5">
                      <span className="text-cyber-cyan capitalize">
                        {concept.evidenceStatus?.replace('_', ' ').toLowerCase() || 'not attempted'}
                      </span>
                      <span className="text-[10px] text-slate-500 hover:text-white flex items-center space-x-0.5">
                        <span>Inspect</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TAB CONTENT: PERFORMANCE TRENDS                                        */}
      {/* ========================================================================= */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-cyber-cyan" />
                  <span>Historical Performance Trends</span>
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Aggregated from genuine persisted code submissions and compiler outputs over time.
                </p>
              </div>

              {/* Date Filters: 7d, 30d, all */}
              <div className="flex items-center space-x-1 bg-space-950 p-1 rounded-xl border border-white/10">
                {(['7d', '30d', 'all'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRangeChange(r)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      trendRange === r
                        ? 'bg-cyber-cyan text-space-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {r === '7d' ? 'Last 7 Days' : r === '30d' ? 'Last 30 Days' : 'All History'}
                  </button>
                ))}
              </div>
            </div>

            {trendsLoading ? (
              <div className="p-12 text-center text-slate-400">Loading historical trend points...</div>
            ) : trends ? (
              <div className="space-y-6">
                {/* Window Vitals */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-space-900/60 border border-white/10">
                    <span className="text-slate-400 text-[11px] block">Submissions In Period</span>
                    <span className="text-2xl font-bold text-white mt-1 block">
                      {trends.totalSubmissionsInPeriod}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-space-900/60 border border-white/10">
                    <span className="text-slate-400 text-[11px] block">Test Pass Rate In Period</span>
                    <span className="text-2xl font-bold text-cyber-emerald mt-1 block">
                      {trends.hasActivity ? `${trends.successRateInPeriod}%` : 'No Activity'}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-space-900/60 border border-white/10">
                    <span className="text-slate-400 text-[11px] block">Clean Compilation In Period</span>
                    <span className="text-2xl font-bold text-cyber-cyan mt-1 block">
                      {trends.hasActivity ? `${trends.compilationRateInPeriod}%` : 'No Activity'}
                    </span>
                  </div>
                </div>

                {/* SVG Trend Line / Bar Chart */}
                <div className="p-5 rounded-xl bg-space-950 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-space-800 pb-2">
                    <span className="font-semibold text-white">Daily Pass Rate & Clean Compilation Telemetry</span>
                    <div className="flex items-center space-x-3 text-[10px]">
                      <span className="flex items-center space-x-1 text-cyber-emerald">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyber-emerald inline-block" />
                        <span>Pass Rate</span>
                      </span>
                      <span className="flex items-center space-x-1 text-cyber-cyan">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyber-cyan inline-block" />
                        <span>Compilation Rate</span>
                      </span>
                    </div>
                  </div>

                  {trends.trendPoints.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 italic">No timeline data available.</div>
                  ) : (
                    <div className="space-y-2">
                      <div className="grid grid-cols-7 gap-2">
                        {trends.trendPoints.map((pt) => {
                          const hasRuns = pt.activeDay && pt.submissionsCount > 0;
                          return (
                            <div
                              key={pt.date}
                              className={`p-2.5 rounded-xl border text-center space-y-1.5 transition-all ${
                                hasRuns
                                  ? 'bg-space-900 border-cyber-cyan/40 shadow-sm'
                                  : 'bg-space-950/40 border-space-800/60 opacity-60'
                              }`}
                            >
                              <div className="text-[10px] text-slate-400 font-bold">{pt.displayDate}</div>
                              {hasRuns ? (
                                <>
                                  <div className="text-xs font-bold text-cyber-emerald">
                                    {pt.successRate !== null ? `${pt.successRate}%` : '0%'}
                                  </div>
                                  <div className="text-[10px] text-cyber-cyan">
                                    {pt.compilationRate !== null ? `${pt.compilationRate}% C` : '0% C'}
                                  </div>
                                  <div className="text-[9px] text-slate-400">
                                    {pt.submissionsCount} {pt.submissionsCount === 1 ? 'run' : 'runs'}
                                  </div>
                                </>
                              ) : (
                                <div className="text-[10px] text-slate-600 italic py-2">Rest</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-[10px] text-slate-500 text-right">
                        * Inactive days denote no flight activity and are distinct from 0% accuracy.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB CONTENT: CODING ERROR ANALYSIS                                     */}
      {/* ========================================================================= */}
      {activeTab === 'errors' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-5">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-rose-400" />
                <span>Coding Error Diagnostics & Breakdown</span>
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">
                Detailed audit of compilation errors (javac), logic discrepancies, and runtime failures.
              </p>
            </div>

            {errorsLoading ? (
              <div className="p-12 text-center text-slate-400">Analyzing compiler telemetry...</div>
            ) : errorAnalytics ? (
              <div className="space-y-6">
                {/* 3 Error Buckets */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-space-900/60 border border-rose-500/30 space-y-1">
                    <span className="text-slate-400 text-[11px] block">Syntax & Compilation (javac)</span>
                    <span className="text-2xl font-bold text-rose-400">{errorAnalytics.compilationFailures}</span>
                    <span className="text-[10px] text-slate-500 block">Missing semicolons, typos, class syntax</span>
                  </div>

                  <div className="p-4 rounded-xl bg-space-900/60 border border-amber-500/30 space-y-1">
                    <span className="text-slate-400 text-[11px] block">Logic & Output Discrepancies</span>
                    <span className="text-2xl font-bold text-amber-400">{errorAnalytics.incorrectOutputs}</span>
                    <span className="text-[10px] text-slate-500 block">Compiled cleanly but failed test assert</span>
                  </div>

                  <div className="p-4 rounded-xl bg-space-900/60 border border-cyber-purple/30 space-y-1">
                    <span className="text-slate-400 text-[11px] block">Runtime Faults & Timeouts</span>
                    <span className="text-2xl font-bold text-cyber-purple">{errorAnalytics.runtimeErrors}</span>
                    <span className="text-[10px] text-slate-500 block">Exceptions, null pointers, infinite loops</span>
                  </div>
                </div>

                {/* Error Categories Bar Breakdown */}
                {errorAnalytics.errorCategories.length > 0 && (
                  <div className="p-4 rounded-xl bg-space-950 border border-white/10 space-y-3">
                    <span className="text-xs font-bold text-white block">Error Classification Distribution</span>
                    <div className="space-y-2">
                      {errorAnalytics.errorCategories.map((cat) => (
                        <div key={cat.category} className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-300">{cat.category}</span>
                            <span className="font-bold text-white">
                              {cat.count} ({cat.percentage}%)
                            </span>
                          </div>
                          <ProgressBar value={cat.percentage} max={100} color="amber" size="sm" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Challenge Failure Rates */}
                {errorAnalytics.challengeFailureRates.length > 0 && (
                  <div className="p-4 rounded-xl bg-space-950 border border-white/10 space-y-3">
                    <span className="text-xs font-bold text-white block">Mission Challenge Failure Rates</span>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-space-800 text-slate-400">
                            <th className="py-2">Mission Title</th>
                            <th className="py-2">Concept</th>
                            <th className="py-2 text-center">Attempts</th>
                            <th className="py-2 text-center">Failures</th>
                            <th className="py-2 text-right">Success Rate</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-space-800/40">
                          {errorAnalytics.challengeFailureRates.map((c) => (
                            <tr key={c.challengeId} className="hover:bg-space-900/40">
                              <td className="py-2 font-bold text-white">{c.missionTitle}</td>
                              <td className="py-2 text-cyber-cyan">{c.javaConcept}</td>
                              <td className="py-2 text-center text-slate-300">{c.attempts}</td>
                              <td className="py-2 text-center text-rose-400">{c.failures}</td>
                              <td className="py-2 text-right font-bold text-cyber-emerald">
                                {c.successRate}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Diagnostic Advice */}
                {errorAnalytics.diagnosticAdvice.length > 0 && (
                  <div className="p-4 rounded-xl bg-cyber-cyan/5 border border-cyber-cyan/20 space-y-2">
                    <span className="text-xs font-bold text-cyber-cyan flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Diagnostic Advice from Compiler Logs</span>
                    </span>
                    <ul className="space-y-1 text-slate-300 text-xs">
                      {errorAnalytics.diagnosticAdvice.map((advice, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-cyber-cyan">•</span>
                          <span>{advice}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB CONTENT: RECOMMENDATIONS                                           */}
      {/* ========================================================================= */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Deterministic Learning Recommendations</span>
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">
                Rule-based guidance derived directly from your compiler telemetry, hint dependency, and concept performance.
              </p>
            </div>

            {recsLoading ? (
              <div className="p-12 text-center text-slate-400">Evaluating learning recommendations...</div>
            ) : recommendations.length === 0 ? (
              <div className="p-8 text-center text-cyber-emerald">
                All curriculum directives satisfied! Excellent flight clearance.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((rec) => {
                  const isHigh = rec.priority === 'HIGH';
                  const isMed = rec.priority === 'MEDIUM';

                  return (
                    <div
                      key={rec.id}
                      className={`p-4 rounded-2xl border space-y-3 transition-all ${
                        isHigh
                          ? 'bg-rose-500/10 border-rose-500/40'
                          : isMed
                          ? 'bg-amber-500/10 border-amber-500/40'
                          : 'bg-space-900/60 border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            isHigh
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : isMed
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40'
                          }`}
                        >
                          {rec.priority} Priority
                        </span>
                        <span className="text-[10px] text-slate-400">{rec.category}</span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white">{rec.recommendedResource}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{rec.reason}</p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-space-950/70 border border-white/5 space-y-1 text-[11px]">
                        <span className="text-slate-400">Supporting Evidence:</span>
                        <div className="text-cyber-cyan font-semibold">{rec.supportingMetric}</div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-500">{rec.subsequentImprovement}</span>
                        <Link
                          to={rec.actionUrl}
                          className="px-3 py-1.5 rounded-xl bg-cyber-cyan text-space-950 font-bold hover:bg-cyan-300 transition-colors flex items-center space-x-1"
                        >
                          <span>{rec.actionText}</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB CONTENT: FACULTY ROSTER (COMMANDER / ADMIN ONLY)                   */}
      {/* ========================================================================= */}
      {activeTab === 'faculty' && isFaculty && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl glass-panel border border-cyber-emerald/30 space-y-5">
            <div>
              <div className="text-[10px] font-bold text-cyber-emerald uppercase tracking-wider flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>COMMAND CLEARANCE ACTIVE // FACULTY INTELLIGENCE</span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
                Academy Cohort Progress & Bottleneck Analytics
              </h3>
              <p className="text-slate-400 text-xs">
                Comprehensive class-wide metrics, difficult curriculum concepts, and individual cadet telemetry.
              </p>
            </div>

            {facultyLoading ? (
              <div className="p-12 text-center text-slate-400">Compiling class-wide telemetry...</div>
            ) : facultyData ? (
              <div className="space-y-6">
                {/* Class Vitals */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-4 rounded-xl bg-space-900/60 border border-white/10">
                    <span className="text-slate-400 text-[11px] block">Enrolled Cadets</span>
                    <span className="text-2xl font-bold text-white mt-1 block">
                      {facultyData.totalEnrolledCadets}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-space-900/60 border border-white/10">
                    <span className="text-slate-400 text-[11px] block">Active Past 7 Days</span>
                    <span className="text-2xl font-bold text-cyber-cyan mt-1 block">
                      {facultyData.activeLearnersCount}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-space-900/60 border border-white/10">
                    <span className="text-slate-400 text-[11px] block">Class Test Pass Rate</span>
                    <span className="text-2xl font-bold text-cyber-emerald mt-1 block">
                      {facultyData.classAverageTestSuccessRate}%
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-space-900/60 border border-white/10">
                    <span className="text-slate-400 text-[11px] block">Total Missions Cleared</span>
                    <span className="text-2xl font-bold text-amber-400 mt-1 block">
                      {facultyData.totalMissionsClearedClasswide}
                    </span>
                  </div>
                </div>

                {/* Challenging Missions / Bottlenecks */}
                {facultyData.challengingMissions.length > 0 && (
                  <div className="p-4 rounded-xl bg-space-950 border border-white/10 space-y-3">
                    <span className="text-xs font-bold text-white block">Curriculum Bottleneck Challenges</span>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-space-800 text-slate-400">
                            <th className="py-2">Mission</th>
                            <th className="py-2">Concept</th>
                            <th className="py-2 text-center">Avg Attempts</th>
                            <th className="py-2 text-right">Completion Rate</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-space-800/40">
                          {facultyData.challengingMissions.map((m) => (
                            <tr key={m.missionId} className="hover:bg-space-900/40">
                              <td className="py-2 font-bold text-white">{m.missionTitle}</td>
                              <td className="py-2 text-cyber-cyan">{m.javaConcept}</td>
                              <td className="py-2 text-center text-amber-400">{m.averageAttempts}</td>
                              <td className="py-2 text-right font-bold text-cyber-emerald">
                                {m.completionRate}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Cadet Roster Table */}
                <div className="p-4 rounded-xl bg-space-950 border border-white/10 space-y-3">
                  <span className="text-xs font-bold text-white block">Cadet Roster</span>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-space-800 text-slate-400">
                          <th className="py-2">Cadet</th>
                          <th className="py-2">Rank Title</th>
                          <th className="py-2 text-center">Level</th>
                          <th className="py-2 text-center">XP</th>
                          <th className="py-2 text-center">Missions Cleared</th>
                          <th className="py-2 text-right">Pass Rate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-space-800/40">
                        {facultyData.cadetRoster.map((cadet) => (
                          <tr key={cadet.cadetId} className="hover:bg-space-900/40">
                            <td className="py-2 font-bold text-white">{cadet.username}</td>
                            <td className="py-2 text-cyber-cyan">{cadet.rankTitle}</td>
                            <td className="py-2 text-center text-slate-300">{cadet.level}</td>
                            <td className="py-2 text-center text-amber-300">{cadet.xp}</td>
                            <td className="py-2 text-center text-slate-300">{cadet.missionsCompleted}</td>
                            <td className="py-2 text-right font-bold text-cyber-emerald">
                              {cadet.testSuccessRate}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. CONCEPT INSPECTOR MODAL / DEEP-DIVE AUDIT                              */}
      {/* ========================================================================= */}
      {isInspectorOpen && selectedConcept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/80 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-2xl glass-panel border border-cyber-cyan/50 p-6 space-y-5 bg-space-900 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] text-cyber-cyan font-bold uppercase tracking-wider">
                  Concept Inspector // {selectedConcept.category}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">{selectedConcept.conceptName}</h3>
              </div>
              <button
                onClick={() => setIsInspectorOpen(false)}
                className="p-1.5 rounded-lg bg-space-800 hover:bg-space-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Score & Evidence Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-space-950 border border-white/10 space-y-1">
                <span className="text-slate-400 text-[10px] block">Demonstrated Mastery</span>
                <div className="text-2xl font-bold text-cyber-cyan">{selectedConcept.masteryPercentage}%</div>
                <ProgressBar
                  value={selectedConcept.masteryPercentage}
                  max={100}
                  color={selectedConcept.masteryPercentage >= 75 ? 'emerald' : 'cyan'}
                  size="sm"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-space-950 border border-white/10 space-y-1">
                <span className="text-slate-400 text-[10px] block">Evidence Status</span>
                <div className="text-sm font-bold text-white capitalize mt-1">
                  {selectedConcept.evidenceStatus?.replace('_', ' ').toLowerCase() || 'Not Attempted'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {selectedConcept.challengeCompleted ? 'Challenge Cleared' : 'Challenge Pending'}
                </div>
              </div>
            </div>

            {/* Transparent Rule-Based Formula Breakdown */}
            <div className="p-3.5 rounded-xl bg-space-950/70 border border-white/5 space-y-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                How This Score Is Calculated:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                {selectedConcept.formulaBreakdown ||
                  '30% Theory Checkpoint + 30% Practice Drills + 40% Compiler Code Execution (adjusted for attempts & hints).'}
              </p>
            </div>

            {/* Demonstrated Competencies & Common Pitfalls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-[11px] text-cyber-emerald font-bold uppercase block">
                  Demonstrated Competencies:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedConcept.evidencePoints.map((pt, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyber-emerald shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] text-amber-400 font-bold uppercase block">
                  Common Compiler & Logic Pitfalls:
                </span>
                {selectedConcept.commonErrors.length > 0 ? (
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {selectedConcept.commonErrors.map((err, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{err}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 italic text-xs">No recurring errors logged for this concept.</p>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-white/10">
              <Link
                to="/codex"
                onClick={() => setIsInspectorOpen(false)}
                className="px-4 py-2 rounded-xl bg-space-850 hover:bg-space-800 border border-white/10 text-white font-semibold text-xs"
              >
                Open Codex Reference
              </Link>
              <button
                onClick={() => setIsInspectorOpen(false)}
                className="px-4 py-2 rounded-xl bg-cyber-cyan text-space-950 font-bold hover:bg-cyan-300 text-xs"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import { apiClient } from './apiClient';

export interface ConceptMastery {
  conceptKey: string;
  conceptName: string;
  category: string;
  masteryPercentage: number;
  status: 'MASTERED' | 'PROFICIENT' | 'NEEDS_PRACTICE' | 'AVAILABLE' | 'LOCKED';
  evidenceStatus: 'NOT_ATTEMPTED' | 'INSUFFICIENT_EVIDENCE' | 'DEVELOPING' | 'DEMONSTRATED_PROFICIENCY';
  formulaBreakdown?: string;
  firstAttemptSuccess?: boolean;
  lessonCompleted: boolean;
  practiceCompleted: boolean;
  challengeCompleted: boolean;
  practiceAccuracy: number;
  codingAttempts: number;
  testsPassed: number;
  totalTests: number;
  hintsUsed: number;
  evidencePoints: string[];
  commonErrors: string[];
}

export interface UserAnalytics {
  userId: number;
  username: string;
  rankTitle: string;
  currentXp: number;
  lessonsCompleted: number;
  practiceQuestionsAttempted: number;
  practiceAccuracyPercentage: number;
  codingChallengesCompleted: number;
  codingAttempts: number;
  testSuccessRate: number;
  compilationSuccessRate: number;
  hintsUsed: number;
  totalTimeSpentSeconds: number;
  formattedTimeSpent: string;
  worldProgressPercentage: number;
  completedMissionsCount: number;
  totalMissionsCount: number;
  activeConceptMasteryPercentage: number;
  hasSufficientData: boolean;
  conceptMasteries: ConceptMastery[];
  strongConcepts: string[];
  conceptsNeedingPractice: string[];
  commonErrors: string[];
  firstAttemptPasses: number;
  syntaxErrorsEncountered: number;
  runtimeErrorsEncountered: number;
  logicFailuresEncountered: number;
  averageAttemptsPerChallenge: number;
}

export interface PerformanceTrendPoint {
  date: string; // "YYYY-MM-DD"
  displayDate: string; // "MMM dd"
  submissionsCount: number;
  successfulSubmissions: number;
  compilationFailures: number;
  runtimeOrLogicFailures: number;
  successRate: number | null;
  compilationRate: number | null;
  cumulativeMissionsCompleted: number;
  activeDay: boolean;
}

export interface PerformanceTrendsResponse {
  range: '7d' | '30d' | 'all';
  trendPoints: PerformanceTrendPoint[];
  totalSubmissionsInPeriod: number;
  successRateInPeriod: number;
  compilationRateInPeriod: number;
  hasActivity: boolean;
}

export interface ErrorCategoryItem {
  category: string;
  count: number;
  percentage: number;
}

export interface ConceptFailureRateItem {
  conceptKey: string;
  conceptName: string;
  attempts: number;
  failures: number;
  failureRate: number;
  dominantFailureType: string;
}

export interface ChallengeFailureRateItem {
  challengeId: number;
  missionTitle: string;
  javaConcept: string;
  attempts: number;
  failures: number;
  successRate: number;
}

export interface CodingErrorAnalytics {
  totalSubmissions: number;
  compilationFailures: number;
  runtimeErrors: number;
  incorrectOutputs: number;
  successfulSubmissions: number;
  compilationSuccessRate: number;
  testPassRate: number;
  firstAttemptSuccessCount: number;
  firstAttemptSuccessRate: number;
  errorCategories: ErrorCategoryItem[];
  conceptFailureRates: ConceptFailureRateItem[];
  challengeFailureRates: ChallengeFailureRateItem[];
  diagnosticAdvice: string[];
}

export interface LearningRecommendation {
  id: string;
  conceptKey: string;
  conceptName: string;
  category: string;
  type: 'SYNTAX_DRILL' | 'LOGIC_REVIEW' | 'CHALLENGE_ADVANCE' | 'HINT_REDUCTION' | 'PRACTICE_DRILL';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
  supportingMetric: string;
  targetMissionId: number | null;
  targetMissionTitle: string | null;
  recommendedResource: string;
  actionUrl: string;
  actionText: string;
  completed: boolean;
  subsequentImprovement: string;
}

export interface FacultyAnalytics {
  totalEnrolledCadets: number;
  activeLearnersCount: number;
  totalMissionsClearedClasswide: number;
  classAverageTestSuccessRate: number;
  classAverageMastery: number;
  conceptDifficultyDistributions: {
    conceptKey: string;
    conceptName: string;
    averageAttempts: number;
    passRate: number;
    statusFlag: string;
  }[];
  challengingMissions: {
    missionId: number;
    missionTitle: string;
    javaConcept: string;
    averageAttempts: number;
    completionRate: number;
  }[];
  cadetRoster: {
    cadetId: number;
    username: string;
    level: number;
    xp: number;
    missionsCompleted: number;
    testSuccessRate: number;
    rankTitle: string;
  }[];
}

export const analyticsService = {
  getMyAnalytics: async (): Promise<UserAnalytics> => {
    const res = await apiClient.get<UserAnalytics>('/analytics/me');
    return res.data;
  },

  getPerformanceTrends: async (range: '7d' | '30d' | 'all' = '7d'): Promise<PerformanceTrendsResponse> => {
    const res = await apiClient.get<PerformanceTrendsResponse>(`/analytics/trends?range=${range}`);
    return res.data;
  },

  getCodingErrorAnalytics: async (): Promise<CodingErrorAnalytics> => {
    const res = await apiClient.get<CodingErrorAnalytics>('/analytics/errors');
    return res.data;
  },

  getPersonalizedRecommendations: async (): Promise<LearningRecommendation[]> => {
    const res = await apiClient.get<LearningRecommendation[]>('/analytics/recommendations');
    return res.data;
  },

  getFacultyAnalytics: async (): Promise<FacultyAnalytics> => {
    const res = await apiClient.get<FacultyAnalytics>('/analytics/faculty');
    return res.data;
  },
};

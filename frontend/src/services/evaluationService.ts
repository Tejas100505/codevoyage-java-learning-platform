import { apiClient } from './apiClient';

export interface EvaluationQuestion {
  id: string;
  concept: string;
  conceptLabel: string;
  prompt: string;
  codeSnippet?: string;
  options: string[];
}

export interface EvaluationAttemptSummary {
  testType: 'PRE_TEST' | 'POST_TEST';
  score: number;
  totalQuestions: number;
  scorePercentage: number;
  timeSpentSeconds: number;
  submittedAt: string;
  conceptScores: Record<string, number>;
}

export interface EvaluationComparison {
  preTestCompleted: boolean;
  postTestCompleted: boolean;
  canTakePostTest: boolean;
  postTestLockedReason?: string;
  preTest?: EvaluationAttemptSummary;
  postTest?: EvaluationAttemptSummary;
  scoreImprovementPercentage: number;
  absoluteScoreGain: number;
  conceptGains?: Record<string, number>;
  learningOutcomeSummary?: string;
}

export interface EvaluationDatasetRecord {
  userId: number;
  username: string;
  userLevel: number;
  totalXp: number;
  missionsCompleted: number;
  preTestCompleted: boolean;
  preTestScore?: number;
  preTestPercentage?: number;
  preTestTimeSeconds?: number;
  preTestDate?: string;
  postTestCompleted: boolean;
  postTestScore?: number;
  postTestPercentage?: number;
  postTestTimeSeconds?: number;
  postTestDate?: string;
  percentageGain?: number;
  rawScoreGain?: number;
  normalizedLearningGain?: string;
  syntaxGain?: string;
  variablesGain?: string;
  dataTypesGain?: string;
  inputGain?: string;
  operatorsGain?: string;
  conditionsGain?: string;
}

export const evaluationService = {
  getQuestions: async (type: 'PRE_TEST' | 'POST_TEST'): Promise<EvaluationQuestion[]> => {
    const res = await apiClient.get<EvaluationQuestion[]>(`/evaluation/questions?type=${type}`);
    return res.data;
  },

  submitEvaluation: async (
    testType: 'PRE_TEST' | 'POST_TEST',
    answers: Record<string, number>,
    timeSpentSeconds: number
  ): Promise<EvaluationComparison> => {
    const res = await apiClient.post<EvaluationComparison>('/evaluation/submit', {
      testType,
      answers,
      timeSpentSeconds,
    });
    return res.data;
  },

  getComparison: async (): Promise<EvaluationComparison> => {
    const res = await apiClient.get<EvaluationComparison>('/evaluation/comparison');
    return res.data;
  },

  getDatasetJson: async (): Promise<EvaluationDatasetRecord[]> => {
    const res = await apiClient.get<EvaluationDatasetRecord[]>('/evaluation/dataset');
    return res.data;
  },

  getCsvDownloadUrl: (): string => {
    const baseUrl = apiClient.defaults.baseURL || 'http://localhost:8080/api/v1';
    return `${baseUrl}/evaluation/dataset/csv`;
  },
};

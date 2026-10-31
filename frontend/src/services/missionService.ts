import { apiClient } from './apiClient';

export interface HealthStatus {
  app: string;
  status: string;
  missionControl: string;
  timestamp: string;
  version: string;
}

export interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
  description: string;
}

export interface Hint {
  id: number;
  hintOrder: number;
  content: string;
  xpPenalty: number;
}

export interface CodingChallenge {
  id: number;
  title: string;
  instructions: string;
  starterCode: string;
  methodSignature: string;
  visibleTestCases: TestCase[];
  hints: Hint[];
}

export interface Lesson {
  id: number;
  title: string;
  conceptSummary: string;
  detailedExplanation: string;
  sampleJavaCode: string;
  keyTakeaways: string;
  whyNeeded?: string;
  visualRepJson?: string;
  syntaxBreakdownJson?: string;
  commonMistakesJson?: string;
  interactiveSnippet?: string;
  interactiveOptionsJson?: string;
}

export interface PracticeQuestion {
  id: number;
  questionNumber: number;
  prompt: string;
  codeSnippet: string | null;
  optionsJson: string;
  correctAnswerIndex: number;
  explanation: string;
  activityType?: string;
  activityDataJson?: string;
  hint?: string;
}

export interface MissionSummary {
  id: number;
  missionOrder: number;
  title: string;
  slug: string;
  objective: string;
  javaConcept: string;
  xpReward: number;
  starsReward: number;
  difficulty: string;
  unlocked: boolean;
  completed: boolean;
  starsEarned: number;
  isBossMission?: boolean;
}

export interface MissionDetail extends MissionSummary {
  worldId: number;
  worldName: string;
  story: string;
  unlockRequirementMissionId: number | null;
  attempts: number;
  hintsUsed: number;
  lesson: Lesson;
  practiceQuestions: PracticeQuestion[];
  codingChallenge: CodingChallenge;
  shipSystem?: string;
  isBossMission?: boolean;
}

export interface WorldData {
  id: number;
  worldOrder: number;
  slug: string;
  name: string;
  theme: string;
  lore: string;
  unlockedByDefault: boolean;
  unlocked?: boolean;
  completed?: boolean;
  clearedMissionsCount?: number;
  totalMissionsCount?: number;
  requiredWorldName?: string;
  requiredWorldOrder?: number;
  unlockRequirementText?: string;
  missions: MissionSummary[];
}

export interface ExecutionSandboxResponse {
  success: boolean;
  status: 'SUCCESS' | 'COMPILE_ERROR' | 'RUNTIME_ERROR' | 'TIMEOUT';
  stdout: string;
  stderr: string;
  executionTimeMs: number;
}

export interface TestExecutionResult {
  testId: number;
  description: string;
  input: string | null;
  expectedOutput: string | null;
  actualOutput: string | null;
  passed: boolean;
  hidden: boolean;
}

export interface SubmissionResult {
  status: 'SUCCESS' | 'COMPILE_ERROR' | 'RUNTIME_ERROR' | 'TIMEOUT' | 'WRONG_ANSWER';
  success: boolean;
  completed: boolean;
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  errorLine?: number;
  diagnosticHint?: string;
  totalTests: number;
  passedTests: number;
  starsEarned: number;
  xpEarned: number;
  testCases: TestExecutionResult[];

  // Authoritative planet / sector completion telemetry
  worldCompleted?: boolean;
  completedWorldName?: string;
  completedWorldOrder?: number;
  totalMissionsInWorld?: number;
  completedMissionsInWorld?: number;
  nextWorldUnlocked?: boolean;
  nextWorldId?: number;
  nextWorldName?: string;
  nextWorldOrder?: number;
}

export interface UserProgressItem {
  missionId: number;
  missionTitle: string;
  unlocked: boolean;
  completed: boolean;
  attempts: number;
  stars: number;
  xpEarned: number;
  hintsUsed: number;
  completionTimeSeconds?: number;
  completedAt?: string;
}

export interface SkillTreeNode {
  id: string;
  name: string;
  category: string;
  state: 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'MASTERED';
  masteryPercent: number;
  description: string;
  whatWasLearned: string;
  missionsCompleted: string[];
  codingChallenges: string[];
  codexEntryId: string;
  targetMissionId: number;
  parentIds: string[];
}

export const missionService = {
  getUserProgress: async (): Promise<UserProgressItem[]> => {
    const res = await apiClient.get<UserProgressItem[]>('/progress');
    return res.data;
  },

  getSkillTree: async (): Promise<SkillTreeNode[]> => {
    const res = await apiClient.get<SkillTreeNode[]>('/progress/skill-tree');
    return res.data;
  },

  getWorlds: async (): Promise<WorldData[]> => {
    const res = await apiClient.get<WorldData[]>('/missions/worlds');
    return res.data;
  },

  getMissionById: async (id: number): Promise<MissionDetail> => {
    const res = await apiClient.get<MissionDetail>(`/missions/${id}`);
    return res.data;
  },

  runCode: async (missionId: number, sourceCode: string): Promise<SubmissionResult> => {
    const res = await apiClient.post<SubmissionResult>(`/missions/${missionId}/run`, {
      sourceCode,
    });
    return res.data;
  },

  submitCode: async (missionId: number, sourceCode: string): Promise<SubmissionResult> => {
    const res = await apiClient.post<SubmissionResult>(`/missions/${missionId}/submit`, {
      sourceCode,
    });
    return res.data;
  },

  completeLesson: async (missionId: number): Promise<{ success: boolean; xpEarned: number; alreadyCompleted: boolean; message: string }> => {
    const res = await apiClient.post(`/progress/missions/${missionId}/complete-lesson`);
    return res.data;
  },

  completePractice: async (missionId: number): Promise<{ success: boolean; xpEarned: number; alreadyCompleted: boolean; message: string }> => {
    const res = await apiClient.post(`/progress/missions/${missionId}/complete-practice`);
    return res.data;
  },

  completeMission: async (
    missionId: number,
    stars: number,
    xpEarned: number,
    durationSeconds: number
  ): Promise<any> => {
    const res = await apiClient.post(`/progress/missions/${missionId}/complete`, {
      stars,
      xpEarned,
      durationSeconds,
    });
    return res.data;
  },

  unlockHint: async (missionId: number, hintId: number): Promise<void> => {
    await apiClient.post(`/missions/${missionId}/hints/${hintId}`);
  },

  executeSandbox: async (
    code: string,
    stdin: string = '',
    timeoutMs: number = 5000
  ): Promise<ExecutionSandboxResponse> => {
    // Port 5050 execution-service fallback
    const response = await fetch('http://localhost:5050/api/v1/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, className: 'Solution', stdin, timeoutMs }),
    });
    return await response.json();
  },
};



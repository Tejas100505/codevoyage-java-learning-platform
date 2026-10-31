import { apiClient } from './apiClient';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  avatar: string;
  role: string;
  xp: number;
  level: number;
  coins: number;
  streak: number;
  selectedLanguage: string;
  stars: number;
  currentSector: number;
  rankTitle?: string;
  createdAt: string;
}

export interface AuthResponse extends UserProfile {
  token: string;
  type: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface DashboardSummary {
  user: UserProfile;
  rankTitle: string;
  currentXp: number;
  nextLevelXp: number;
  xpPercentage: number;
  currentMissionId?: number;
  currentMissionTitle?: string;
  currentMissionWorldName?: string;
  currentMissionObjective?: string;
  currentMissionConcept?: string;
  currentMissionDifficulty?: string;
  totalJavaMissions: number;
  completedMissionsCount: number;
  javaProgressPercent: number;
  totalWorlds: number;
  unlockedWorldsCount: number;
  worldProgressPercent: number;
  totalStarsEarned: number;
  maxAvailableStars: number;
  unlockedAchievementsCount: number;
  totalAchievementsCount: number;
  recentAchievements: Array<{
    id: number;
    code: string;
    name: string;
    description: string;
    xpReward: number;
    icon: string;
    unlocked: boolean;
  }>;
  recentMissions: Array<{
    id: number;
    missionOrder: number;
    title: string;
    concept: string;
    unlocked: boolean;
    completed: boolean;
    stars: number;
    xpReward: number;
    difficulty: string;
  }>;
  conceptProgress?: Array<{
    name: string;
    completed: boolean;
    percent: number;
    tag: string;
  }>;
}

export interface AchievementItem {
  id: number;
  code: string;
  name: string;
  description: string;
  xpReward: number;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string | null;
}

export const authService = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/register', payload);
    return res.data;
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/login', payload);
    return res.data;
  },

  getCurrentUser: async (): Promise<UserProfile> => {
    const res = await apiClient.get<UserProfile>('/users/me');
    return res.data;
  },

  getDashboardSummary: async (): Promise<DashboardSummary> => {
    const res = await apiClient.get<DashboardSummary>('/users/dashboard');
    return res.data;
  },

  getAchievements: async (): Promise<AchievementItem[]> => {
    const res = await apiClient.get<AchievementItem[]>('/achievements');
    return res.data;
  },

  updateSelectedLanguage: async (language: string): Promise<UserProfile> => {
    const res = await apiClient.put<UserProfile>('/users/language', { language });
    return res.data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Best-effort logout notification
    } finally {
      localStorage.removeItem('codevoyage_jwt');
      localStorage.removeItem('codevoyage_user');
    }
  },
};


import { apiClient } from './apiClient';

export interface HealthStatus {
  app: string;
  status: string;
  missionControl: string;
  timestamp: string;
  version: string;
}

export interface Sector {
  id: number;
  name: string;
  lore: string;
  topic: string;
  unlocked: boolean;
  totalLevels: number;
}

export const systemService = {
  checkHealth: async (): Promise<HealthStatus> => {
    const res = await apiClient.get<HealthStatus>('/health');
    return res.data;
  },

  getSectors: async (): Promise<Sector[]> => {
    const res = await apiClient.get<Sector[]>('/game/sectors');
    return res.data;
  },
};

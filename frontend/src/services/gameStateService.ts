import { apiClient } from './apiClient';

export interface ShipSystemStatus {
  systemKey: string;
  displayName: string;
  javaConcept: string;
  powerPercentage: number; // 0 - 100%
  status: 'OFFLINE' | 'DAMAGED' | 'PARTIALLY_ACTIVE' | 'ONLINE' | 'OVERCHARGED';
  description: string;
  visualEffect: string;
  lightsOn: boolean;
  energyFlowing: boolean;
  engineActive: boolean;
}

export interface GameState {
  username: string;
  currentSector: number;
  overallIntegrity: number;
  activeShipName: string;
  systems: ShipSystemStatus[];
  environmentVisuals: {
    ambientLighting?: string;
    hullStatus?: string;
    reactorHumVolume?: number;
    emergencySirens?: boolean;
    [key: string]: any;
  };
}

export const gameStateService = {
  getGameState: async (): Promise<GameState> => {
    const res = await apiClient.get<GameState>('/game/state');
    return res.data;
  },

  updateSystemPower: async (systemKey: string, powerPercentage: number): Promise<GameState> => {
    const res = await apiClient.post<GameState>(`/game/state/systems/${systemKey}`, {
      powerPercentage,
    });
    return res.data;
  },
};

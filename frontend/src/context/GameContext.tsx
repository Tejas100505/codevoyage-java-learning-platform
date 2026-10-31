import React, { createContext, useContext, useState } from 'react';

interface GameContextType {
  activeSector: number;
  activeLevel: number;
  setActiveSector: (sector: number) => void;
  setActiveLevel: (level: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSector, setActiveSector] = useState<number>(1);
  const [activeLevel, setActiveLevel] = useState<number>(1);

  return (
    <GameContext.Provider value={{ activeSector, activeLevel, setActiveSector, setActiveLevel }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

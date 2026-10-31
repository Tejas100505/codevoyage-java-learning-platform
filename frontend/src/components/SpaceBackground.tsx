import React from 'react';
import { Starfield } from '../game/Starfield';
import { GlowEffects } from './GlowEffects';

interface SpaceBackgroundProps {
  children?: React.ReactNode;
}

export const SpaceBackground: React.FC<SpaceBackgroundProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-space-950 text-slate-100 relative selection:bg-cyber-cyan/30">
      <Starfield />
      <GlowEffects intensity="subtle" />
      {children}
    </div>
  );
};

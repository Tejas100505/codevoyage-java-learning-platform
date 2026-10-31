import React from 'react';

interface GlowEffectsProps {
  intensity?: 'subtle' | 'vibrant';
}

export const GlowEffects: React.FC<GlowEffectsProps> = ({ intensity = 'subtle' }) => {
  const opacity = intensity === 'subtle' ? 'opacity-25' : 'opacity-40';

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Top cyan nebula orb */}
      <div
        className={`absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-600/20 blur-[130px] ${opacity}`}
      />
      {/* Middle right cosmic purple nebula */}
      <div
        className={`absolute top-1/3 -right-40 w-[550px] h-[550px] rounded-full bg-purple-700/20 blur-[140px] ${opacity}`}
      />
      {/* Bottom indigo ambient light */}
      <div
        className={`absolute -bottom-40 left-1/3 w-[700px] h-[500px] rounded-full bg-blue-900/15 blur-[150px] ${opacity}`}
      />
    </div>
  );
};

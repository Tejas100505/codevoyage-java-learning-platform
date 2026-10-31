import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  glow?: 'cyan' | 'purple' | 'amber' | 'emerald' | 'none';
  interactive?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glow = 'none',
  interactive = false,
  ...props
}) => {
  const glowStyles = {
    none: 'border-white/10',
    cyan: 'border-cyber-cyan/30 hover:border-cyber-cyan/50 shadow-[0_4px_20px_rgba(0,240,255,0.08)]',
    purple: 'border-cyber-purple/30 hover:border-cyber-purple/50 shadow-[0_4px_20px_rgba(139,92,246,0.08)]',
    amber: 'border-cyber-amber/30 hover:border-cyber-amber/50 shadow-[0_4px_20px_rgba(245,158,11,0.08)]',
    emerald: 'border-cyber-emerald/30 hover:border-cyber-emerald/50 shadow-[0_4px_20px_rgba(16,185,129,0.08)]',
  }[glow];

  return (
    <motion.div
      whileHover={interactive ? { y: -2, transition: { duration: 0.15 } } : undefined}
      whileTap={interactive ? { scale: 0.99 } : undefined}
      className={`relative rounded-2xl bg-space-900/80 backdrop-blur-md border ${glowStyles} ${
        interactive ? 'cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

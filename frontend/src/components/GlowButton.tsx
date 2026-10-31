import React, { useState } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { soundManager } from '../services/soundService';

interface GlowButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'purple' | 'danger' | 'ghost' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
  soundEffect?: boolean;
}

export const GlowButton: React.FC<GlowButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  className = '',
  disabled,
  soundEffect = true,
  onClick,
  ...props
}) => {
  const [clickRipple, setClickRipple] = useState<{ x: number; y: number } | null>(null);

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-xs font-semibold',
    lg: 'px-6 py-3 text-sm font-bold',
  }[size];

  const variantStyles = {
    primary:
      'bg-cyber-cyan text-space-950 hover:bg-cyan-300 shadow-glow-cyan border border-cyber-cyan/50 hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] active:brightness-110',
    secondary:
      'bg-space-800 text-white hover:bg-space-700 border border-white/10 hover:border-cyber-cyan/40 hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] active:bg-space-750',
    purple:
      'bg-gradient-to-r from-cyber-purple to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 shadow-glow-purple border border-cyber-purple/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] active:brightness-110',
    amber:
      'bg-amber-500 text-space-950 hover:bg-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)] border border-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.6)]',
    danger:
      'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 hover:border-rose-400 hover:shadow-[0_0_20px_rgba(244,63,94,0.3)]',
    ghost:
      'bg-transparent text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10',
  }[variant];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    if (soundEffect) {
      soundManager.emit('button_click');
    }

    const rect = e.currentTarget.getBoundingClientRect();
    setClickRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setTimeout(() => setClickRipple(null), 400);

    if (onClick) {
      onClick(e);
    }
  };

  const handleMouseEnter = () => {
    if (!disabled && !loading && soundEffect) {
      soundManager.emit('button_hover');
    }
  };

  return (
    <motion.button
      whileHover={disabled || loading ? undefined : { scale: 1.025, y: -1 }}
      whileTap={disabled || loading ? undefined : { scale: 0.975, y: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      disabled={disabled || loading}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className={`relative inline-flex items-center justify-center space-x-2 rounded-xl font-mono overflow-hidden transition-all duration-150 outline-none select-none disabled:opacity-50 disabled:cursor-not-allowed ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {/* Click ripple particle micro-feedback */}
      {clickRipple && (
        <span
          className="absolute rounded-full bg-white/30 pointer-events-none animate-ping"
          style={{
            left: clickRipple.x - 15,
            top: clickRipple.y - 15,
            width: 30,
            height: 30,
          }}
        />
      )}

      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
      ) : (
        icon && <span className="shrink-0 transition-transform duration-200 group-hover:scale-110">{icon}</span>
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

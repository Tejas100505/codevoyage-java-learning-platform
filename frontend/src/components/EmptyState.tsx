import React from 'react';
import { LucideIcon, Compass } from 'lucide-react';
import { GlowButton } from './GlowButton';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = Compass,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-space-850/50 border border-white/5 space-y-4 max-w-lg mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-space-900 border border-white/10 flex items-center justify-center text-slate-500">
        <Icon className="w-7 h-7" />
      </div>
      <div className="space-y-1">
        <h4 className="text-base font-bold text-white font-mono">{title}</h4>
        <p className="text-xs text-slate-400 font-mono leading-relaxed">{description}</p>
      </div>
      {actionText && onAction && (
        <GlowButton variant="secondary" size="sm" onClick={onAction}>
          {actionText}
        </GlowButton>
      )}
    </div>
  );
};

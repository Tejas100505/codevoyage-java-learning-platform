import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className={`pointer-events-auto flex items-start space-x-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl min-w-[280px] max-w-sm ${
              toast.type === 'success'
                ? 'bg-space-900/90 border-cyber-emerald/40 text-cyber-emerald'
                : toast.type === 'error'
                ? 'bg-space-900/90 border-cyber-crimson/40 text-cyber-crimson'
                : 'bg-space-900/90 border-cyber-cyan/40 text-cyber-cyan'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-5 h-5 shrink-0 mt-0.5" />}

            <div className="flex-1 space-y-0.5">
              <h5 className="text-xs font-bold text-white font-mono">{toast.title}</h5>
              {toast.description && (
                <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
                  {toast.description}
                </p>
              )}
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

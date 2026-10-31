export const TOKENS = {
  colors: {
    space: {
      950: '#030712', // Deep cosmic void
      900: '#070C1B', // Dark navy background
      850: '#0C1427', // Deep blue panel
      800: '#111C38', // Elevated card surface
      750: '#172449', // Hover state
      700: '#1F305E', // Borders
      600: '#2E4482', // Subtle lines
    },
    neon: {
      cyan: '#00F0FF',     // Primary telemetry & action
      cyanGlow: 'rgba(0, 240, 255, 0.4)',
      blue: '#2563EB',     // Sub-action
      purple: '#8B5CF6',   // Mystery / rank / cosmic
      purpleGlow: 'rgba(139, 92, 246, 0.35)',
      amber: '#F59E0B',    // XP / Stars / Fuel
      amberGlow: 'rgba(245, 158, 11, 0.35)',
      emerald: '#10B981',  // Success / Online
      emeraldGlow: 'rgba(16, 185, 129, 0.35)',
      crimson: '#EF4444',  // Danger / Alert
      teal: '#14B8A6',     // Auxiliary sensors
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
      muted: '#64748B',
      accent: '#00F0FF',
    },
  },
  typography: {
    fontMono: "'Fira Code', Consolas, Monaco, monospace",
    fontSans: "'Inter', system-ui, -apple-system, sans-serif",
  },
  glass: {
    panel: 'bg-space-900/80 backdrop-blur-md border border-white/10 shadow-2xl',
    card: 'bg-space-850/70 backdrop-blur-sm border border-white/5 hover:border-cyber-cyan/40 transition-all duration-300',
    modal: 'bg-space-950/90 backdrop-blur-xl border border-cyber-cyan/30 shadow-glow-cyan',
  },
  animation: {
    spring: { type: 'spring', stiffness: 400, damping: 30 },
    gentle: { duration: 0.25, ease: 'easeOut' },
  }
};

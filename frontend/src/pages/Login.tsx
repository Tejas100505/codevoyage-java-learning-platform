import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { Rocket, Lock, User, AlertCircle, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError('Please enter both your cadet callsign and security key.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.login({
        username: username.trim(),
        password,
      });

      login(res.token, res);
      navigate(from, { replace: true });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Authentication failed. Please verify your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono">
          <Rocket className="w-3.5 h-3.5" />
          <span>PILOT AUTHENTICATION TERMINAL</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Access Mission Control</h1>
        <p className="text-xs sm:text-sm text-slate-400 font-mono">
          Enter your Starfleet credentials to sync telemetry and flight records.
        </p>
      </div>

      <div className="p-8 rounded-2xl glass-panel border border-cyber-cyan/30 shadow-glow-cyan/20 space-y-6">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start space-x-3 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-slate-300 font-semibold">
              Cadet Callsign / Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. cadet_nova"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-space-950/80 border border-white/10 focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan text-xs font-mono text-white placeholder-slate-500 transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-slate-300 font-semibold">
              Security Key / Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-space-950/80 border border-white/10 focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan text-xs font-mono text-white placeholder-slate-500 transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-space-950 bg-cyber-cyan hover:bg-cyan-300 shadow-glow-cyan flex items-center justify-center space-x-2 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-mono mt-2"
          >
            {loading ? (
              <span>Authenticating with Core...</span>
            ) : (
              <>
                <span>Engage Flight Session</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">New recruit?</span>
          <Link to="/register" className="text-cyber-cyan hover:underline font-semibold">
            Enlist Cadet Profile &rarr;
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-2 text-xs font-mono text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5 text-cyber-emerald" />
        <span>End-to-End BCrypt & SHA-256 JWT Protection</span>
      </div>
    </div>
  );
};

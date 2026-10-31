import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { Rocket, Lock, User, Mail, AlertCircle, ArrowRight, ShieldCheck, Check, Eye, EyeOff } from 'lucide-react';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPasswordValid = password.length >= 8;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError('Cadet callsign is required.');
      return;
    }
    if (!isEmailValid) {
      setError('Please provide a valid sub-space communication email address.');
      return;
    }
    if (!isPasswordValid) {
      setError('Security key must be at least 8 characters in length.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.register({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      login(res.token, res);
      navigate('/', { replace: true });
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.details?.password || 'Enlistment rejected. Please check your data.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyber-purple/10 border border-cyber-purple/30 text-cyber-purple text-xs font-mono">
          <Rocket className="w-3.5 h-3.5" />
          <span>STARFLEET ACADEMY ENLISTMENT</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Create Cadet Profile</h1>
        <p className="text-xs sm:text-sm text-slate-400 font-mono">
          Register your pilot identifier and prepare for World 1: Ignis Station.
        </p>
      </div>

      <div className="p-8 rounded-2xl glass-panel border border-cyber-purple/30 shadow-glow-purple/20 space-y-6">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start space-x-3 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-slate-300 font-semibold">
              Cadet Callsign (Username)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. cadet_orion"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-space-950/80 border border-white/10 focus:border-cyber-purple focus:ring-1 focus:ring-cyber-purple text-xs font-mono text-white placeholder-slate-500 transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-slate-300 font-semibold">
              Sub-space Comm Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="orion@starfleet.io"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-space-950/80 border border-white/10 focus:border-cyber-purple focus:ring-1 focus:ring-cyber-purple text-xs font-mono text-white placeholder-slate-500 transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-slate-300 font-semibold">
              Security Clearance Key (Password)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-space-950/80 border border-white/10 focus:border-cyber-purple focus:ring-1 focus:ring-cyber-purple text-xs font-mono text-white placeholder-slate-500 transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center space-x-1.5 text-[11px] font-mono pt-1 text-slate-400">
              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${isPasswordValid ? 'bg-cyber-emerald/20 text-cyber-emerald' : 'bg-space-800 text-slate-500'}`}>
                <Check className="w-2.5 h-2.5" />
              </div>
              <span>At least 8 characters</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-cyber-purple to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-glow-purple flex items-center justify-center space-x-2 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-mono mt-2"
          >
            {loading ? (
              <span>Provisioning Cadet Account...</span>
            ) : (
              <>
                <span>Complete Enlistment</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">Already enlisted?</span>
          <Link to="/login" className="text-cyber-purple hover:underline font-semibold">
            Access Flight Terminal &rarr;
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-2 text-xs font-mono text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5 text-cyber-emerald" />
        <span>Secure Password Hashing & Strict Non-Plaintext Storage</span>
      </div>
    </div>
  );
};

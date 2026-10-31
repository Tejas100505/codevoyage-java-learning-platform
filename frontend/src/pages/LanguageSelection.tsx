import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { GlassCard } from '../components/GlassCard';
import { GlowButton } from '../components/GlowButton';
import {
  Code2,
  Lock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Compass,
  Cpu,
  Layers,
  Terminal
} from 'lucide-react';
import ignisImg from '../assets/images/ignis_station.jpg';

export const LanguageSelection: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [selectedTrack, setSelectedTrack] = useState<string>('JAVA');
  const [updating, setUpdating] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSelectLanguage = async (track: string) => {
    if (track !== 'JAVA') return; // Python is coming soon

    try {
      setUpdating(true);
      setSelectedTrack('JAVA');
      if (user) {
        await authService.updateSelectedLanguage('JAVA');
        await refreshUser();
      }
      setFeedback('Track confirmed: Java Galaxy Odyssey. Engaging Warp to Galaxy Map...');
      setTimeout(() => {
        navigate('/sectors');
      }, 700);
    } catch (err) {
      console.error('Failed to update language', err);
      // Fallback navigate anyway
      navigate('/sectors');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-12 space-y-10">
      {/* Title Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono">
          <Terminal className="w-3.5 h-3.5" />
          <span>STARFLEET ACADEMY CURRICULUM DISPATCH</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white font-mono tracking-tight uppercase">
          WHAT DO YOU WANT TO LEARN?
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-mono leading-relaxed">
          Select your primary programming discipline to calibrate your flight computer and unlock corresponding celestial sectors.
        </p>
      </div>

      {feedback && (
        <div className="max-w-xl mx-auto p-4 rounded-2xl bg-cyber-emerald/10 border border-cyber-emerald/40 text-cyber-emerald text-center font-mono text-sm flex items-center justify-center space-x-2 animate-pulse">
          <Sparkles className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Language Tracks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch pt-4">
        {/* Track 1: Java (ACTIVE) */}
        <div
          onClick={() => !updating && handleSelectLanguage('JAVA')}
          className={`relative group cursor-pointer rounded-3xl p-1 transition-all duration-300 ${
            selectedTrack === 'JAVA'
              ? 'bg-gradient-to-b from-cyber-cyan via-blue-600 to-cyber-purple shadow-glow-cyan/40 scale-[1.02]'
              : 'bg-space-800 hover:bg-space-700'
          }`}
        >
          <div className="h-full rounded-[22px] bg-space-950/90 p-8 flex flex-col justify-between space-y-6 backdrop-blur-xl">
            <div className="space-y-4">
              {/* Badge & Icon */}
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-cyber-cyan/15 border border-cyber-cyan/40 flex items-center justify-center text-cyber-cyan group-hover:scale-110 transition-transform">
                  <Code2 className="w-8 h-8" />
                </div>
                <span className="px-3 py-1 rounded-full bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan text-xs font-mono font-bold tracking-wider flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>ACTIVE TRACK</span>
                </span>
              </div>

              {/* Title & Tagline */}
              <div>
                <h2 className="text-3xl font-black text-white font-mono tracking-tight">
                  Java
                </h2>
                <p className="text-base font-semibold text-cyber-cyan font-mono mt-1">
                  "Build Strong Foundations"
                </p>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed">
                Master authentic Java 21 from object foundations to high-throughput concurrency. Power industrial starships, reactor telemetry, and galactic navigation matrices with standard JDK compilers.
              </p>

              {/* Syllabus Highlights */}
              <div className="space-y-2 pt-2 border-t border-space-800">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  MISSION HIGHLIGHTS:
                </div>
                <ul className="text-xs font-mono text-slate-300 space-y-1.5">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyber-cyan" />
                    <span>Ignis Station: Variables, Types & Math</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyber-cyan" />
                    <span>Airlock Control: Branching & Conditionals</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyber-cyan" />
                    <span>Fleet Architecture: OOP Classes & Encapsulation</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Launch Action */}
            <div className="pt-4 border-t border-space-800">
              <GlowButton
                variant="primary"
                size="lg"
                className="w-full justify-center"
                disabled={updating}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectLanguage('JAVA');
                }}
                icon={<Compass className="w-4 h-4" />}
              >
                {updating ? 'ENGAGING STARFLEET CORE...' : 'ENTER GALAXY MAP (JAVA)'}
              </GlowButton>
            </div>
          </div>
        </div>

        {/* Track 2: Python (COMING SOON) */}
        <div className="relative rounded-3xl p-1 bg-space-800/60 opacity-70 cursor-not-allowed">
          <div className="h-full rounded-[22px] bg-space-950/80 p-8 flex flex-col justify-between space-y-6 border border-space-800">
            <div className="space-y-4">
              {/* Badge & Icon */}
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-space-900 border border-space-800 flex items-center justify-center text-slate-500">
                  <Cpu className="w-8 h-8" />
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold tracking-wider flex items-center space-x-1">
                  <Lock className="w-3 h-3" />
                  <span>COMING SOON</span>
                </span>
              </div>

              {/* Title & Tagline */}
              <div>
                <h2 className="text-3xl font-black text-slate-300 font-mono tracking-tight">
                  Python
                </h2>
                <p className="text-base font-semibold text-slate-500 font-mono mt-1">
                  "Data Scripts & Autonomous Probes"
                </p>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-400 font-mono leading-relaxed">
                Autonomous drone navigation and deep-space telemetry analytics using Python syntax. Currently undergoing safety clearance at Starfleet High Command.
              </p>

              {/* Syllabus Highlights */}
              <div className="space-y-2 pt-2 border-t border-space-800">
                <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                  STATUS REPORT:
                </div>
                <p className="text-xs font-mono text-slate-500 leading-relaxed">
                  Engineering teams are constructing the isolated Python runtime containers. Java remains the active mandatory certification track for all Cadets.
                </p>
              </div>
            </div>

            {/* Inactive CTA */}
            <div className="pt-4 border-t border-space-800">
              <button
                disabled
                className="w-full py-3 rounded-xl bg-space-900 border border-space-800 text-xs font-mono text-slate-500 uppercase tracking-wider cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>SECTOR LOCKED // COMING SOON</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Auxiliary Information */}
      <div className="p-6 rounded-2xl bg-space-900/60 border border-space-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 text-xs font-mono text-slate-300">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
          <span>
            Selecting a track updates your starship flight telemetry. You can switch or review tracks anytime from your Command Dashboard.
          </span>
        </div>
        <GlowButton
          variant="secondary"
          size="sm"
          onClick={() => navigate('/dashboard')}
        >
          RETURN TO DASHBOARD
        </GlowButton>
      </div>
    </div>
  );
};

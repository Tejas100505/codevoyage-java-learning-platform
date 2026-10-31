import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Rocket,
  Map,
  Activity,
  BookOpen,
  User,
  Volume2,
  VolumeX,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  ChevronRight,
  Shield,
  HelpCircle,
  Award,
  GitFork
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { soundManager } from '../services/soundService';
import { AudioSettingsModal } from './AudioSettingsModal';
import { Modal } from './Modal';
import byteImg from '../assets/images/byte_guide.jpg';

interface NavbarProps {
  backendOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ backendOnline }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [muted, setMuted] = useState<boolean>(soundManager.isMuted());
  const [showAudioModal, setShowAudioModal] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [byteGuideOpen, setByteGuideOpen] = useState<boolean>(false);

  const handleToggleSound = () => {
    const isNowEnabled = soundManager.toggleMute();
    setMuted(!isNowEnabled);
  };

  // Primary navigation destinations (focused, high-value)
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Rocket },
    { name: 'Galaxy Map', path: '/map', icon: Map },
    { name: 'Analytics', path: '/analytics', icon: Activity },
    { name: 'Java Codex', path: '/codex', icon: BookOpen },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const isCurrentPath = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    if (path === '/map') {
      return location.pathname === '/map' || location.pathname === '/sectors';
    }
    if (path === '/analytics') {
      return location.pathname.startsWith('/analytics') || location.pathname.startsWith('/evaluation');
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-space-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-8 h-8 rounded-lg bg-cyber-cyan/15 border border-cyber-cyan/40 flex items-center justify-center text-cyber-cyan transition-transform group-hover:scale-105">
            <Rocket className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
          </div>
          <div>
            <span className="text-base font-bold tracking-wider text-white">
              CODE<span className="text-cyber-cyan">VOYAGE</span>
            </span>
            <span className="hidden sm:block text-[10px] tracking-widest text-slate-400 font-mono -mt-1 uppercase">
              Java Learning Platform
            </span>
          </div>
        </Link>

        {/* Primary Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isCurrentPath(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
                  active
                    ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-space-850/80 border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Quick Mission Pill + Sound + User HUD */}
        <div className="flex items-center space-x-2.5">
          {/* Quick Continue Mission Pill if user is authenticated */}
          {isAuthenticated && (
            <button
              onClick={() => navigate('/mission/1')}
              className="hidden lg:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyber-cyan/10 hover:bg-cyber-cyan/20 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono transition-colors"
              title="Jump directly to active Java mission"
            >
              <span>Continue Mission</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}

          {/* Byte AI Companion Help Button */}
          <button
            onClick={() => setByteGuideOpen(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyber-cyan hover:bg-space-850 border border-transparent hover:border-cyber-cyan/30 transition-all text-xs"
            title="Ask Byte (AI Assistant)"
            aria-label="Ask Byte (AI Assistant)"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Sound Controls */}
          <button
            onClick={handleToggleSound}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-space-850 transition-all text-xs"
            title={!muted ? 'Game Audio On (Click to Mute)' : 'Game Audio Muted (Click to Unmute)'}
            aria-label={!muted ? 'Mute sound' : 'Unmute sound'}
          >
            {!muted ? <Volume2 className="w-4 h-4 text-cyber-cyan" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Auth State */}
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-2 pl-1 border-l border-white/10">
              <Link
                to="/profile"
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-space-850 hover:bg-space-800 border border-white/10 hover:border-cyber-cyan/30 transition-colors text-xs font-mono"
                title="Cadet Profile"
              >
                <Shield className="w-3.5 h-3.5 text-cyber-cyan" />
                <span className="font-semibold text-slate-200">{user.username}</span>
                <span className="text-[10px] text-slate-400">LVL {user.level || 1}</span>
              </Link>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-space-850 transition-colors"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 pl-1 border-l border-white/10">
              <Link
                to="/login"
                className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-space-850 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 rounded-lg text-xs font-semibold text-space-950 bg-cyber-cyan hover:bg-cyan-300 transition-colors shadow-sm"
              >
                Start Learning
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-space-850"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-space-950/95 px-4 pt-3 pb-5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isCurrentPath(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-sm ${
                  active
                    ? 'bg-cyber-cyan/15 text-cyber-cyan font-semibold border border-cyber-cyan/30'
                    : 'text-slate-300 hover:bg-space-850 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400 px-3">
            <Link
              to="/skills"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-1 hover:text-cyber-cyan py-1"
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>Skill Tree</span>
            </Link>
            <Link
              to="/achievements"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-1 hover:text-cyber-cyan py-1"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Achievements</span>
            </Link>
          </div>
        </div>
      )}

      {/* Friendly Robot Guide Modal (Byte) */}
      <Modal
        isOpen={byteGuideOpen}
        onClose={() => setByteGuideOpen(false)}
        title="Byte // Flight Companion AI"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 rounded-xl bg-space-900 border border-cyber-cyan/30">
            <img
              src={byteImg}
              alt="Byte Guide"
              className="w-14 h-14 rounded-full object-cover border-2 border-cyber-cyan"
            />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white font-mono flex items-center space-x-2">
                <span>Unit B-Y-T-E</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyber-emerald/20 text-cyber-emerald">ACTIVE</span>
              </h4>
              <p className="text-xs text-slate-300 font-mono">
                "Cadet, need flight assistance? Complete missions in sequence to learn Java 21 step by step."
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs font-mono text-slate-300 bg-space-900/60 p-3.5 rounded-xl border border-white/5">
            <span className="text-cyber-cyan font-bold">CORE NAVIGATION TIPS:</span>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400">
              <li>Use the <strong className="text-white">Dashboard</strong> to resume your next available Java mission.</li>
              <li>Check the <strong className="text-white">Galaxy Map</strong> to review completed and upcoming sectors.</li>
              <li>Inspect your <strong className="text-white">Analytics</strong> for verified concept mastery and drill recommendations.</li>
              <li>Refer to the <strong className="text-white">Java Codex</strong> anytime for syntax cheatsheets and common mistakes.</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* Audio Mixer Modal */}
      <AudioSettingsModal
        isOpen={showAudioModal}
        onClose={() => setShowAudioModal(false)}
      />
    </header>
  );
};

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  VolumeX,
  Sliders,
  Music,
  Zap,
  RotateCcw,
  X,
  Headphones,
  Check
} from 'lucide-react';
import { soundManager, AudioSettings } from '../services/soundService';
import { GlowButton } from './GlowButton';

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [settings, setSettings] = useState<AudioSettings>(soundManager.getSettings());
  const [musicActive, setMusicActive] = useState<boolean>(soundManager.isAmbientMusicPlaying());

  useEffect(() => {
    const unsubscribe = soundManager.onSettingsChange((updated) => {
      setSettings(updated);
    });
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  const handleToggleMute = () => {
    soundManager.toggleMute();
    soundManager.emit('button_click');
  };

  const handleMasterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    soundManager.setMasterVolume(val);
  };

  const handleEffectsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    soundManager.setEffectsVolume(val);
  };

  const handleMusicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    soundManager.setMusicVolume(val);
  };

  const handleToggleAmbientMusic = () => {
    const active = soundManager.toggleAmbientMusic();
    setMusicActive(active);
    soundManager.emit('button_click');
  };

  const testSampleSound = (category: string) => {
    switch (category) {
      case 'correct':
        soundManager.emit('correct_answer');
        break;
      case 'incorrect':
        soundManager.emit('incorrect_answer');
        break;
      case 'xp':
        soundManager.emit('xp_gain');
        break;
      case 'achievement':
        soundManager.emit('achievement_unlocked');
        break;
      case 'planet':
        soundManager.emit('planet_unlock');
        break;
      case 'boss':
        soundManager.emit('boss_victory');
        break;
      default:
        soundManager.emit('button_click');
        break;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/80 backdrop-blur-md font-mono">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-lg rounded-3xl bg-space-950 border border-cyber-cyan/40 p-6 sm:p-7 space-y-6 shadow-[0_0_50px_rgba(0,240,255,0.25)] text-left"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-space-800 pb-3">
            <div className="flex items-center space-x-2 text-cyber-cyan">
              <Headphones className="w-5 h-5" />
              <h3 className="text-base font-black text-white uppercase tracking-wider">
                AUDIO & SYNTHESIZER TELEMETRY
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-space-900 border border-transparent hover:border-space-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-400">
            Configure procedural synthesizer acoustics and volume mixing. Settings persist across cadet sessions.
          </p>

          {/* Master Mute Quick Button */}
          <div className="p-4 rounded-2xl bg-space-900/80 border border-space-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                  !settings.muted
                    ? 'bg-cyber-cyan/20 border-cyber-cyan/40 text-cyber-cyan'
                    : 'bg-space-950 border-space-800 text-slate-600'
                }`}
              >
                {!settings.muted ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-xs font-bold text-white uppercase">
                  MASTER AUDIO STATE: {!settings.muted ? 'ACTIVE' : 'MUTED'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {!settings.muted ? 'Synthesizer generating feedback' : 'All audio emissions silenced'}
                </div>
              </div>
            </div>

            <GlowButton
              variant={!settings.muted ? 'secondary' : 'primary'}
              size="sm"
              onClick={handleToggleMute}
            >
              {!settings.muted ? 'MUTE ALL' : 'UNMUTE'}
            </GlowButton>
          </div>

          {/* Volume Sliders Grid */}
          <div className="space-y-4">
            {/* 1. Master Volume */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-bold uppercase flex items-center space-x-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyber-cyan" />
                  <span>Master Volume</span>
                </span>
                <span className="text-cyber-cyan font-bold">
                  {Math.round(settings.masterVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.masterVolume}
                onChange={handleMasterChange}
                disabled={settings.muted}
                className="w-full accent-cyan-400 bg-space-900 h-2 rounded-lg cursor-pointer disabled:opacity-40"
              />
            </div>

            {/* 2. Sound Effects Volume */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-bold uppercase flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Effects & Interaction Volume</span>
                </span>
                <span className="text-amber-400 font-bold">
                  {Math.round(settings.effectsVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.effectsVolume}
                onChange={handleEffectsChange}
                disabled={settings.muted}
                className="w-full accent-amber-400 bg-space-900 h-2 rounded-lg cursor-pointer disabled:opacity-40"
              />
            </div>

            {/* 3. Music Volume & Sub-Space Drone Toggle */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-bold uppercase flex items-center space-x-1.5">
                  <Music className="w-3.5 h-3.5 text-cyber-purple" />
                  <span>Sub-Space Ambient Music Volume</span>
                </span>
                <span className="text-cyber-purple font-bold">
                  {Math.round(settings.musicVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.musicVolume}
                onChange={handleMusicChange}
                disabled={settings.muted}
                className="w-full accent-purple-400 bg-space-900 h-2 rounded-lg cursor-pointer disabled:opacity-40"
              />
              <div className="flex justify-end pt-1">
                <button
                  onClick={handleToggleAmbientMusic}
                  disabled={settings.muted}
                  className="text-[10px] text-cyber-purple hover:underline flex items-center space-x-1 disabled:opacity-40"
                >
                  <span>{musicActive ? 'STOP AMBIENT DRONE' : 'PLAY AMBIENT SUB-SPACE DRONE'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sound Categories Test Bench */}
          <div className="space-y-2 pt-2 border-t border-space-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              10-CATEGORY SYNTHESIZER TEST BENCH:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                onClick={() => testSampleSound('ui')}
                className="p-2 rounded-xl bg-space-900/90 border border-space-800 hover:border-cyber-cyan/40 text-[11px] text-slate-300 hover:text-white transition-colors"
              >
                UI Click
              </button>
              <button
                onClick={() => testSampleSound('correct')}
                className="p-2 rounded-xl bg-space-900/90 border border-space-800 hover:border-cyber-emerald/40 text-[11px] text-cyber-emerald transition-colors"
              >
                Correct Answer
              </button>
              <button
                onClick={() => testSampleSound('incorrect')}
                className="p-2 rounded-xl bg-space-900/90 border border-space-800 hover:border-rose-400/40 text-[11px] text-rose-300 transition-colors"
              >
                Incorrect Answer
              </button>
              <button
                onClick={() => testSampleSound('xp')}
                className="p-2 rounded-xl bg-space-900/90 border border-space-800 hover:border-amber-400/40 text-[11px] text-amber-300 transition-colors"
              >
                XP Reward
              </button>
              <button
                onClick={() => testSampleSound('achievement')}
                className="p-2 rounded-xl bg-space-900/90 border border-space-800 hover:border-purple-400/40 text-[11px] text-purple-300 transition-colors"
              >
                Achievement
              </button>
              <button
                onClick={() => testSampleSound('boss')}
                className="p-2 rounded-xl bg-space-900/90 border border-space-800 hover:border-amber-400/40 text-[11px] text-amber-400 transition-colors"
              >
                Boss Victory
              </button>
            </div>
          </div>

          {/* Action */}
          <div className="pt-2 border-t border-space-800 flex justify-end">
            <GlowButton variant="primary" size="md" onClick={onClose}>
              CONFIRM SETTINGS
            </GlowButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

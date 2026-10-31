/**
 * CodeVoyage Modular Audio System
 * 
 * Sound Categories:
 * - UI (button clicks, hovers, tab switches, modal opens/closes)
 * - Correct answer (practice drills, mini-games, single checks)
 * - Incorrect answer (syntax mistakes, wrong practice answer)
 * - Code execution (sandbox execution, compiler spooling)
 * - Test success (individual test cases passing)
 * - Mission completion (standard mission cleared)
 * - XP reward (experience points counter and leveling)
 * - Achievement (commendation unlocked fanfare)
 * - Planet unlock (orbital insertion, hyperspace jump)
 * - Boss victory (reactor core stabilized, boss defeat fanfare)
 * 
 * Features:
 * - Master volume (0.0 to 1.0)
 * - Music volume (0.0 to 1.0)
 * - Effects volume (0.0 to 1.0)
 * - Master mute toggle
 * - Safe initial defaults (never autoplays loudly; default master: 0.35, effects: 0.5, music: 0.3)
 * - Persisted settings in localStorage
 * - Decoupled asset loader: easily replaces procedural synth sounds with real audio files (.mp3, .ogg)
 *   without breaking anything if files are not present.
 */

export type SoundCategory =
  | 'ui'
  | 'correct_answer'
  | 'incorrect_answer'
  | 'code_execution'
  | 'test_success'
  | 'mission_completion'
  | 'xp_reward'
  | 'achievement'
  | 'planet_unlock'
  | 'boss_victory'
  | 'music';

export type GameSoundEvent =
  // UI
  | 'button_click'
  | 'button_hover'
  | 'tab_switch'
  | 'modal_open'
  | 'modal_close'
  // Correct / Incorrect
  | 'correct_answer'
  | 'incorrect_answer'
  // Code execution & Tests
  | 'compiler_start'
  | 'test_passed'
  | 'test_failed'
  // Rewards & Progression
  | 'xp_gain'
  | 'star_award'
  | 'mission_success'
  | 'mission_failure'
  | 'achievement_unlocked'
  | 'planet_unlock'
  | 'boss_victory'
  | 'boss_breach'
  | 'byte_chirp';

export interface AudioSettings {
  muted: boolean;
  masterVolume: number; // 0.0 - 1.0
  effectsVolume: number; // 0.0 - 1.0
  musicVolume: number; // 0.0 - 1.0
}

type SoundEventHandler = (event: GameSoundEvent, meta?: Record<string, any>) => void;
type SettingsChangeHandler = (settings: AudioSettings) => void;

class ModularAudioSystem {
  private settings: AudioSettings = {
    muted: false,
    masterVolume: 0.35, // Safe non-blasting default
    effectsVolume: 0.5,
    musicVolume: 0.3,
  };

  private listeners: Set<SoundEventHandler> = new Set();
  private settingsListeners: Set<SettingsChangeHandler> = new Set();
  private audioCtx: AudioContext | null = null;
  private assetMap: Partial<Record<GameSoundEvent, string>> = {};
  private audioCache: Map<string, HTMLAudioElement> = new Map();

  // Background ambient music generator / player state
  private ambientOscillator: OscillatorNode | null = null;
  private ambientGainNode: GainNode | null = null;
  private isMusicPlaying: boolean = false;

  constructor() {
    this.loadSettings();
  }

  private loadSettings(): void {
    try {
      const saved = localStorage.getItem('codevoyage_audio_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.settings = {
          muted: typeof parsed.muted === 'boolean' ? parsed.muted : false,
          masterVolume: typeof parsed.masterVolume === 'number' ? Math.max(0, Math.min(1, parsed.masterVolume)) : 0.35,
          effectsVolume: typeof parsed.effectsVolume === 'number' ? Math.max(0, Math.min(1, parsed.effectsVolume)) : 0.5,
          musicVolume: typeof parsed.musicVolume === 'number' ? Math.max(0, Math.min(1, parsed.musicVolume)) : 0.3,
        };
      }
    } catch {
      // Safe fallback to defaults
    }
  }

  private saveSettings(): void {
    try {
      localStorage.setItem('codevoyage_audio_settings', JSON.stringify(this.settings));
      this.settingsListeners.forEach((fn) => fn({ ...this.settings }));
    } catch {
      // Non-blocking
    }
  }

  public getSettings(): AudioSettings {
    return { ...this.settings };
  }

  public isMuted(): boolean {
    return this.settings.muted;
  }

  public setMuted(muted: boolean): void {
    this.settings.muted = muted;
    this.saveSettings();
    if (muted && this.ambientGainNode && this.audioCtx) {
      this.ambientGainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
    } else if (!muted && this.isMusicPlaying) {
      this.updateAmbientMusicVolume();
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.settings.muted);
    return !this.settings.muted;
  }

  public setMasterVolume(vol: number): void {
    this.settings.masterVolume = Math.max(0, Math.min(1, vol));
    this.saveSettings();
    this.updateAmbientMusicVolume();
  }

  public setEffectsVolume(vol: number): void {
    this.settings.effectsVolume = Math.max(0, Math.min(1, vol));
    this.saveSettings();
  }

  public setMusicVolume(vol: number): void {
    this.settings.musicVolume = Math.max(0, Math.min(1, vol));
    this.saveSettings();
    this.updateAmbientMusicVolume();
  }

  public onSettingsChange(handler: SettingsChangeHandler): () => void {
    this.settingsListeners.add(handler);
    return () => this.settingsListeners.delete(handler);
  }

  public subscribe(handler: SoundEventHandler): () => void {
    this.listeners.add(handler);
    return () => this.listeners.delete(handler);
  }

  /**
   * Register file paths for events when high-fidelity audio assets become available.
   * If a registered file fails to load or does not exist, the system safely falls back
   * to procedural synthesis without error.
   */
  public registerAsset(event: GameSoundEvent, assetUrl: string): void {
    this.assetMap[event] = assetUrl;
  }

  /**
   * Event dispatcher categorized across the 10 game sound types.
   */
  public emit(event: GameSoundEvent, meta?: Record<string, any>): void {
    // Notify external game event listeners
    this.listeners.forEach((listener) => {
      try {
        listener(event, meta);
      } catch (err) {
        console.warn('Listener error in sound event:', err);
      }
    });

    if (this.settings.muted) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const effectiveEffectsVol = this.settings.masterVolume * this.settings.effectsVolume;
    if (effectiveEffectsVol <= 0.001) return;

    // Check if an external asset is registered and playable
    const assetPath = this.assetMap[event];
    if (assetPath) {
      this.playAsset(assetPath, effectiveEffectsVol, () => {
        // Fallback to procedural synth if file playback fails
        this.playSynthesizedEvent(event, effectiveEffectsVol);
      });
      return;
    }

    // Play modular procedural synthesis
    this.playSynthesizedEvent(event, effectiveEffectsVol);
  }

  private playAsset(url: string, volume: number, onErrorFallback: () => void): void {
    try {
      let audio = this.audioCache.get(url);
      if (!audio) {
        audio = new Audio(url);
        this.audioCache.set(url, audio);
      }
      audio.volume = Math.max(0, Math.min(1, volume));
      audio.currentTime = 0;
      audio.play().catch(() => {
        onErrorFallback();
      });
    } catch {
      onErrorFallback();
    }
  }

  /**
   * Procedural synthesizer covering all 10 sound categories:
   * 1. UI
   * 2. Correct Answer
   * 3. Incorrect Answer
   * 4. Code Execution
   * 5. Test Success
   * 6. Mission Completion
   * 7. XP Reward
   * 8. Achievement
   * 9. Planet Unlock
   * 10. Boss Victory
   */
  private playSynthesizedEvent(event: GameSoundEvent, volume: number): void {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioCtxClass();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      switch (event) {
        // 1. UI: Button click, hover, tabs, modals
        case 'button_click':
        case 'tab_switch':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(620, now);
          osc.frequency.exponentialRampToValueAtTime(840, now + 0.05);
          gain.gain.setValueAtTime(volume * 0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
          osc.start(now);
          osc.stop(now + 0.06);
          break;

        case 'button_hover':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(460, now);
          gain.gain.setValueAtTime(volume * 0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
          osc.start(now);
          osc.stop(now + 0.035);
          break;

        case 'modal_open':
        case 'modal_close':
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.exponentialRampToValueAtTime(540, now + 0.09);
          gain.gain.setValueAtTime(volume * 0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          osc.start(now);
          osc.stop(now + 0.1);
          break;

        // 2. Correct answer
        case 'correct_answer':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, now); // D5
          osc.frequency.setValueAtTime(880.0, now + 0.08); // A5
          gain.gain.setValueAtTime(volume * 0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          osc.start(now);
          osc.stop(now + 0.2);
          break;

        // 3. Incorrect answer
        case 'incorrect_answer':
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(240, now);
          osc.frequency.exponentialRampToValueAtTime(140, now + 0.16);
          gain.gain.setValueAtTime(volume * 0.35, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
          osc.start(now);
          osc.stop(now + 0.18);
          break;

        // 4. Code execution
        case 'compiler_start':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(280, now);
          osc.frequency.exponentialRampToValueAtTime(560, now + 0.15);
          gain.gain.setValueAtTime(volume * 0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
          osc.start(now);
          osc.stop(now + 0.18);
          break;

        // 5. Test success
        case 'test_passed':
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(659.25, now); // E5
          osc.frequency.setValueAtTime(987.77, now + 0.07); // B5
          gain.gain.setValueAtTime(volume * 0.35, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
          osc.start(now);
          osc.stop(now + 0.16);
          break;

        case 'test_failed':
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.exponentialRampToValueAtTime(110, now + 0.2);
          gain.gain.setValueAtTime(volume * 0.35, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
          osc.start(now);
          osc.stop(now + 0.22);
          break;

        // 6. Mission completion
        case 'mission_success':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523.25, now); // C5
          osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
          osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
          osc.frequency.setValueAtTime(1046.5, now + 0.24); // C6
          gain.gain.setValueAtTime(volume * 0.45, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
          osc.start(now);
          osc.stop(now + 0.45);
          break;

        // 7. XP reward & Stars
        case 'xp_gain':
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
          gain.gain.setValueAtTime(volume * 0.35, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
          osc.start(now);
          osc.stop(now + 0.18);
          break;

        case 'star_award':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, now); // A5
          osc.frequency.exponentialRampToValueAtTime(1318.5, now + 0.14); // E6
          gain.gain.setValueAtTime(volume * 0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
          osc.start(now);
          osc.stop(now + 0.28);
          break;

        // 8. Achievement
        case 'achievement_unlocked':
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(440, now); // A4
          osc.frequency.setValueAtTime(554.37, now + 0.09); // C#5
          osc.frequency.setValueAtTime(659.25, now + 0.18); // E5
          osc.frequency.setValueAtTime(880.0, now + 0.27); // A5
          gain.gain.setValueAtTime(volume * 0.5, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
          osc.start(now);
          osc.stop(now + 0.55);
          break;

        // 9. Planet unlock
        case 'planet_unlock':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(392.0, now); // G4
          osc.frequency.setValueAtTime(523.25, now + 0.12); // C5
          osc.frequency.setValueAtTime(783.99, now + 0.24); // G5
          gain.gain.setValueAtTime(volume * 0.5, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
          osc.start(now);
          osc.stop(now + 0.6);
          break;

        // 10. Boss victory
        case 'boss_victory':
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(349.23, now); // F4
          osc.frequency.setValueAtTime(440.0, now + 0.1); // A4
          osc.frequency.setValueAtTime(523.25, now + 0.2); // C5
          osc.frequency.setValueAtTime(698.46, now + 0.32); // F5
          gain.gain.setValueAtTime(volume * 0.55, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
          osc.start(now);
          osc.stop(now + 0.7);
          break;

        case 'boss_breach':
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(180, now);
          osc.frequency.exponentialRampToValueAtTime(90, now + 0.3);
          gain.gain.setValueAtTime(volume * 0.45, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.start(now);
          osc.stop(now + 0.35);
          break;

        case 'byte_chirp':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(780, now);
          osc.frequency.linearRampToValueAtTime(1150, now + 0.08);
          gain.gain.setValueAtTime(volume * 0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.start(now);
          osc.stop(now + 0.12);
          break;

        default:
          break;
      }
    } catch {
      // Safe fallback
    }
  }

  /**
   * Ambient Sub-Space Background Drone (Optional Music Track)
   */
  public toggleAmbientMusic(start?: boolean): boolean {
    const shouldStart = start !== undefined ? start : !this.isMusicPlaying;
    if (shouldStart) {
      this.startAmbientDrone();
    } else {
      this.stopAmbientDrone();
    }
    return this.isMusicPlaying;
  }

  public isAmbientMusicPlaying(): boolean {
    return this.isMusicPlaying;
  }

  private startAmbientDrone(): void {
    try {
      if (this.isMusicPlaying) return;
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioCtxClass();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(55.0, this.audioCtx.currentTime); // Deep A1 cosmic hum

      const effectiveMusicVol = this.settings.muted ? 0 : this.settings.masterVolume * this.settings.musicVolume * 0.18;
      gain.gain.setValueAtTime(effectiveMusicVol, this.audioCtx.currentTime);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();

      this.ambientOscillator = osc;
      this.ambientGainNode = gain;
      this.isMusicPlaying = true;
    } catch {
      this.isMusicPlaying = false;
    }
  }

  private stopAmbientDrone(): void {
    try {
      if (this.ambientOscillator) {
        this.ambientOscillator.stop();
        this.ambientOscillator.disconnect();
        this.ambientOscillator = null;
      }
      if (this.ambientGainNode) {
        this.ambientGainNode.disconnect();
        this.ambientGainNode = null;
      }
    } catch {
      // Safe cleanup
    } finally {
      this.isMusicPlaying = false;
    }
  }

  private updateAmbientMusicVolume(): void {
    if (!this.ambientGainNode || !this.audioCtx) return;
    const targetVol = this.settings.muted
      ? 0
      : this.settings.masterVolume * this.settings.musicVolume * 0.18;
    this.ambientGainNode.gain.setValueAtTime(targetVol, this.audioCtx.currentTime);
  }
}

export const soundManager = new ModularAudioSystem();

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Flame,
  Radio,
  Compass,
  Check,
  Award,
} from 'lucide-react';
import { GlowButton } from '../components/GlowButton';

export interface MiniGameProps {
  onComplete: () => void;
  onClose?: () => void;
}

// =========================================================================
// MINI-GAME 1: POWER CORE REPAIR (Variables)
// Concept: Variables (declaration, assignment, correct types)
// =========================================================================
export const PowerCoreRepairGame: React.FC<MiniGameProps> = ({ onComplete }) => {
  const [selectedTokens, setSelectedTokens] = useState<{ [section: number]: string }>({});
  const [solvedSections, setSolvedSections] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const sections = [
    {
      id: 1,
      name: 'Fuel Reservoir Conduits',
      targetType: 'int',
      desc: 'Stores whole numeric liters of fuel',
      correctDeclaration: 'int fuel = 100;',
      options: ['int fuel = 100;', 'fuel = "100";', 'int 100 = fuel;', 'string fuel = 100;'],
      correctIdx: 0,
    },
    {
      id: 2,
      name: 'Core Thermal Sensor',
      targetType: 'double',
      desc: 'Stores floating-point temperature with precision',
      correctDeclaration: 'double coreTemp = 365.45;',
      options: ['int coreTemp = 365.45;', 'double coreTemp = 365.45;', 'double coreTemp = "HOT";', 'boolean coreTemp = 365.45;'],
      correctIdx: 1,
    },
    {
      id: 3,
      name: 'Auxiliary Shield Grid',
      targetType: 'boolean',
      desc: 'Stores binary active/inactive flag',
      correctDeclaration: 'boolean shieldsActive = true;',
      options: ['boolean shieldsActive = "true";', 'bool shieldsActive = 1;', 'boolean shieldsActive = true;', 'String shieldsActive = true;'],
      correctIdx: 2,
    },
  ];

  const handleSelectOption = (sectionId: number, option: string, isCorrect: boolean) => {
    setSelectedTokens((prev) => ({ ...prev, [sectionId]: option }));
    if (isCorrect) {
      if (!solvedSections.includes(sectionId)) {
        const nextSolved = [...solvedSections, sectionId];
        setSolvedSections(nextSolved);
        setFeedback(`Section ${sectionId} repaired! Conduits humming at nominal frequency.`);
        if (nextSolved.length === sections.length) {
          setTimeout(onComplete, 1200);
        }
      }
    } else {
      setFeedback('Syntax / type mismatch detected. In Java, variable types must match the assigned value.');
    }
  };

  const isAllComplete = solvedSections.length === sections.length;

  return (
    <div className="p-6 rounded-2xl bg-space-950/95 border border-amber-500/40 shadow-glow-amber/20 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-space-800 pb-4">
        <div>
          <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center space-x-1.5">
            <Zap className="w-4 h-4 fill-current" />
            <span>MINI-GAME // POWER CORE REPAIR</span>
          </span>
          <h3 className="text-xl font-black text-white font-mono uppercase mt-0.5">
            Java Variable Calibration
          </h3>
        </div>
        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="text-slate-400">Core Integrity:</span>
          <span className="font-bold text-amber-400">
            {Math.round((solvedSections.length / sections.length) * 100)}%
          </span>
        </div>
      </div>

      {/* Instructions */}
      <p className="text-xs font-mono text-slate-300 leading-relaxed bg-space-900/60 p-3 rounded-xl border border-white/5">
        <strong className="text-amber-300">Objective:</strong> Starship power conduits require properly typed Java variable declarations. Select the valid Java statement for each reactor chamber to route energy.
      </p>

      {/* 3-Chamber Interactive Visual Core */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {sections.map((sec) => {
          const isSolved = solvedSections.includes(sec.id);
          return (
            <div
              key={sec.id}
              className={`p-4 rounded-xl border transition-all text-center space-y-2 relative overflow-hidden ${
                isSolved
                  ? 'bg-cyber-cyan/15 border-cyber-cyan shadow-glow-cyan/20'
                  : 'bg-space-900/60 border-space-800'
              }`}
            >
              {isSolved && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-cyber-cyan/10 pointer-events-none"
                />
              )}
              <div className="text-[10px] font-mono text-slate-400 uppercase">{sec.name}</div>
              <div className="text-xs font-bold font-mono text-white">
                {isSolved ? (
                  <span className="text-cyber-cyan flex items-center justify-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ENERGIZED</span>
                  </span>
                ) : (
                  <span className="text-rose-400">DAMAGED</span>
                )}
              </div>
              <div className="text-[11px] font-mono text-slate-400">{sec.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Interactive Selection Tasks */}
      <div className="space-y-4">
        {sections.map((sec) => {
          const isSolved = solvedSections.includes(sec.id);
          return (
            <div key={sec.id} className="p-4 rounded-xl bg-space-900/80 border border-space-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white font-bold">Chamber 0{sec.id}: {sec.name}</span>
                <span className="text-slate-400">Expected Type: <code className="text-cyber-cyan font-bold">{sec.targetType}</code></span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sec.options.map((opt, oIdx) => {
                  const isCorrect = oIdx === sec.correctIdx;
                  const isSelected = selectedTokens[sec.id] === opt;
                  return (
                    <button
                      key={oIdx}
                      disabled={isSolved}
                      onClick={() => handleSelectOption(sec.id, opt, isCorrect)}
                      className={`p-2.5 rounded-lg text-left font-mono text-xs border transition-all ${
                        isSolved && isCorrect
                          ? 'bg-cyber-emerald/20 border-cyber-emerald text-cyber-emerald font-bold'
                          : isSelected && !isCorrect
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                          : 'bg-space-950/70 border-space-800 text-slate-300 hover:border-cyber-cyan/50 hover:bg-space-850'
                      }`}
                    >
                      <code>{opt}</code>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Feedback */}
      {feedback && (
        <div className={`p-3 rounded-xl border text-xs font-mono ${isAllComplete ? 'bg-cyber-emerald/15 border-cyber-emerald/40 text-cyber-emerald' : 'bg-space-900 border-space-700 text-slate-300'}`}>
          {feedback}
        </div>
      )}
    </div>
  );
};

// =========================================================================
// MINI-GAME 2: COMMUNICATION REPAIR (Scanner / Input Matching)
// Concept: Matching dynamic input streams with typed Scanner harvesting methods
// =========================================================================
export const CommunicationRepairGame: React.FC<MiniGameProps> = ({ onComplete }) => {
  const [matchedPairs, setMatchedPairs] = useState<{ [packet: string]: string }>({});
  const [selectedPacket, setSelectedPacket] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const packets = [
    { value: '"PHOENIX"', type: 'scanner.next()', label: 'Callsign String Token' },
    { value: '42', type: 'scanner.nextInt()', label: 'Cargo Pods (Integer)' },
    { value: '108.75', type: 'scanner.nextDouble()', label: 'Frequency (Double)' },
    { value: '"DOCKING PERMIT GRANTED"', type: 'scanner.nextLine()', label: 'Full Line (Sentence)' },
  ];

  const harvestMethods = ['scanner.next()', 'scanner.nextInt()', 'scanner.nextDouble()', 'scanner.nextLine()'];

  const handlePair = (method: string) => {
    if (!selectedPacket) return;
    const target = packets.find((p) => p.value === selectedPacket);
    if (target && target.type === method) {
      const next = { ...matchedPairs, [selectedPacket]: method };
      setMatchedPairs(next);
      setSelectedPacket(null);
      setFeedback(`Packet ${selectedPacket} harvested cleanly with ${method}!`);
      if (Object.keys(next).length === packets.length) {
        setTimeout(onComplete, 1200);
      }
    } else {
      setFeedback(`InputMismatchException: ${selectedPacket} cannot be parsed by ${method}. Verify the data type!`);
    }
  };

  const isAllComplete = Object.keys(matchedPairs).length === packets.length;

  return (
    <div className="p-6 rounded-2xl bg-space-950/95 border border-cyber-cyan/40 shadow-glow-cyan/20 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-space-800 pb-4">
        <div>
          <span className="text-[11px] font-mono text-cyber-cyan font-bold uppercase tracking-wider flex items-center space-x-1.5">
            <Radio className="w-4 h-4" />
            <span>MINI-GAME // SUBSPACE COMMS REPAIR</span>
          </span>
          <h3 className="text-xl font-black text-white font-mono uppercase mt-0.5">
            Scanner Token Harvesting
          </h3>
        </div>
        <span className="text-xs font-mono text-cyber-cyan font-bold">
          {Object.keys(matchedPairs).length} / {packets.length} Packets Routed
        </span>
      </div>

      <p className="text-xs font-mono text-slate-300 leading-relaxed bg-space-900/60 p-3 rounded-xl border border-white/5">
        <strong className="text-cyber-cyan">Objective:</strong> An incoming deep-space transmission stream is arriving. Click an incoming packet token, then route it into the exact Java `Scanner` method capable of harvesting it.
      </p>

      {/* Two Column Routing Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Packets */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Incoming Stdin Stream (System.in)
          </span>
          {packets.map((p, idx) => {
            const isMatched = !!matchedPairs[p.value];
            const isSelected = selectedPacket === p.value;
            return (
              <button
                key={idx}
                disabled={isMatched}
                onClick={() => setSelectedPacket(p.value)}
                className={`w-full p-3 rounded-xl font-mono text-xs text-left border flex items-center justify-between transition-all ${
                  isMatched
                    ? 'bg-cyber-emerald/10 border-cyber-emerald/40 text-cyber-emerald'
                    : isSelected
                    ? 'bg-cyber-cyan/20 border-cyber-cyan text-white shadow-glow-cyan/30'
                    : 'bg-space-900/80 border-space-800 text-slate-200 hover:border-cyber-cyan/40'
                }`}
              >
                <div>
                  <span className="font-bold text-white block">{p.value}</span>
                  <span className="text-[10px] text-slate-400">{p.label}</span>
                </div>
                {isMatched ? (
                  <Check className="w-4 h-4 text-cyber-emerald" />
                ) : isSelected ? (
                  <span className="text-[10px] text-cyber-cyan animate-pulse">Select Scanner method &rarr;</span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Harvest Methods */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Java Scanner Harvesters
          </span>
          {harvestMethods.map((m, idx) => (
            <button
              key={idx}
              onClick={() => handlePair(m)}
              className={`w-full p-3.5 rounded-xl font-mono text-xs text-left border transition-all ${
                selectedPacket
                  ? 'bg-space-900 border-cyber-cyan/40 text-slate-200 hover:bg-space-850 hover:border-cyber-cyan cursor-pointer'
                  : 'bg-space-950/60 border-space-800 text-slate-400 opacity-70'
              }`}
            >
              <code>{m}</code>
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div className={`p-3 rounded-xl border text-xs font-mono ${isAllComplete ? 'bg-cyber-emerald/15 border-cyber-emerald/40 text-cyber-emerald' : 'bg-space-900 border-space-700 text-slate-300'}`}>
          {feedback}
        </div>
      )}
    </div>
  );
};

// =========================================================================
// MINI-GAME 3: ENGINE CALIBRATION (Arithmetic & Modulus)
// Concept: Integer arithmetic, precedence, modulus
// =========================================================================
export const EngineCalibrationGame: React.FC<MiniGameProps> = ({ onComplete }) => {
  const [userInputs, setUserInputs] = useState<{ [key: string]: string }>({});
  const [solved, setSolved] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const formulas = [
    {
      id: 'f1',
      title: 'Fuel Burn Rate',
      code: 'int burned = 15 * 4;',
      expected: '60',
      hint: 'Multiplication: 15 kg/s for 4 seconds',
    },
    {
      id: 'f2',
      title: 'Orbital Cycles (Integer Division)',
      code: 'int cycles = 14 / 4;',
      expected: '3',
      hint: 'In Java, 14 / 4 truncates decimals: 3',
    },
    {
      id: 'f3',
      title: 'Cycle Remainder (Modulus %)',
      code: 'int leftoverSec = 14 % 4;',
      expected: '2',
      hint: 'Modulus returns the remainder of 14 / 4: 2',
    },
  ];

  const handleVerify = (id: string, expected: string) => {
    const val = (userInputs[id] || '').trim();
    if (val === expected) {
      if (!solved.includes(id)) {
        const next = [...solved, id];
        setSolved(next);
        setFeedback(`Formula ${id} calibrated! Thruster pulse synced.`);
        if (next.length === formulas.length) {
          setTimeout(onComplete, 1200);
        }
      }
    } else {
      setFeedback('Calculated velocity delta incorrect. Remember integer division truncates fractions!');
    }
  };

  const isAllComplete = solved.length === formulas.length;

  return (
    <div className="p-6 rounded-2xl bg-space-950/95 border border-cyber-emerald/40 shadow-glow-emerald/20 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-space-800 pb-4">
        <div>
          <span className="text-[11px] font-mono text-cyber-emerald font-bold uppercase tracking-wider flex items-center space-x-1.5">
            <Flame className="w-4 h-4 fill-current" />
            <span>MINI-GAME // ENGINE CALIBRATION</span>
          </span>
          <h3 className="text-xl font-black text-white font-mono uppercase mt-0.5">
            Arithmetic & Modulus Thruster Sync
          </h3>
        </div>
        <span className="text-xs font-mono text-cyber-emerald font-bold">
          {solved.length} / {formulas.length} Formulas Synced
        </span>
      </div>

      <p className="text-xs font-mono text-slate-300 leading-relaxed bg-space-900/60 p-3 rounded-xl border border-white/5">
        <strong className="text-cyber-emerald">Objective:</strong> Compute the exact output of Java arithmetic expressions to sync the orbital thrusters. Enter your answers to calibrate propellant burn cycles.
      </p>

      <div className="space-y-4">
        {formulas.map((f) => {
          const isDone = solved.includes(f.id);
          return (
            <div key={f.id} className="p-4 rounded-xl bg-space-900/80 border border-space-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white font-bold">{f.title}</span>
                <span className="text-slate-400">{f.hint}</span>
              </div>

              <div className="p-3 rounded-lg bg-space-950 font-mono text-xs text-cyber-cyan">
                <code>{f.code}</code>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  disabled={isDone}
                  value={userInputs[f.id] || ''}
                  onChange={(e) => setUserInputs((prev) => ({ ...prev, [f.id]: e.target.value }))}
                  placeholder="Enter evaluated value..."
                  className="px-3.5 py-2 rounded-lg bg-space-950 border border-space-800 font-mono text-xs text-white focus:outline-none focus:border-cyber-emerald transition-colors w-48"
                />
                <GlowButton
                  variant="primary"
                  size="sm"
                  disabled={isDone}
                  onClick={() => handleVerify(f.id, f.expected)}
                >
                  {isDone ? 'CALIBRATED' : 'SYNC VALUE'}
                </GlowButton>
              </div>
            </div>
          );
        })}
      </div>

      {feedback && (
        <div className={`p-3 rounded-xl border text-xs font-mono ${isAllComplete ? 'bg-cyber-emerald/15 border-cyber-emerald/40 text-cyber-emerald' : 'bg-space-900 border-space-700 text-slate-300'}`}>
          {feedback}
        </div>
      )}
    </div>
  );
};

// =========================================================================
// MINI-GAME 4: NAVIGATION INTERLOCK (if/else & Logic)
// Concept: Relational & logical operators (&&, ||, <, >)
// =========================================================================
export const NavigationInterlockGame: React.FC<MiniGameProps> = ({ onComplete }) => {
  const [selectedCondition, setSelectedCondition] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Scenario: Radiation > 100 OR pressure < 50 triggers emergency seal
  const sensorState = { pressure: 45, radiation: 120 };

  const conditions = [
    {
      code: 'if (pressure > 50 && radiation < 100)',
      explanation: 'Evaluates false: 45 > 50 is false. Would fail to trigger seal during critical emergency!',
      correct: false,
    },
    {
      code: 'if (pressure < 50 || radiation > 100)',
      explanation: 'Evaluates true: Radiation is 120 and pressure is 45. Emergency bulkhead sealed safely!',
      correct: true,
    },
    {
      code: 'if (pressure == 50 && radiation == 100)',
      explanation: 'Evaluates false: Values do not equal 50 or 100 exactly.',
      correct: false,
    },
    {
      code: 'if (pressure = 50)',
      explanation: 'Compilation error! Single = is assignment, not equality comparison.',
      correct: false,
    },
  ];

  const handleSelect = (idx: number) => {
    setSelectedCondition(idx);
    const cond = conditions[idx];
    if (cond.correct) {
      setIsSuccess(true);
      setFeedback('Bulkhead safety protocol activated! All airlock doors sealed against atmospheric vent.');
      setTimeout(onComplete, 1200);
    } else {
      setIsSuccess(false);
      setFeedback(cond.explanation);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-space-950/95 border border-cyber-purple/40 shadow-glow-purple/20 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-space-800 pb-4">
        <div>
          <span className="text-[11px] font-mono text-cyber-purple font-bold uppercase tracking-wider flex items-center space-x-1.5">
            <Compass className="w-4 h-4" />
            <span>MINI-GAME // NAVIGATION EMERGENCY INTERLOCK</span>
          </span>
          <h3 className="text-xl font-black text-white font-mono uppercase mt-0.5">
            Conditional Branch Evaluation
          </h3>
        </div>
        <span className="text-xs font-mono text-rose-400 font-bold animate-pulse">
          HAZARD ALERT: AIRLOCK C BREACH
        </span>
      </div>

      {/* Sensor Dashboard */}
      <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-space-900 border border-space-800">
        <div>
          <span className="text-[10px] font-mono text-slate-400 block uppercase">Chamber Pressure</span>
          <span className="text-base font-black font-mono text-rose-400">{sensorState.pressure} kPa (CRITICAL LOW)</span>
        </div>
        <div>
          <span className="text-[10px] font-mono text-slate-400 block uppercase">Radiation Level</span>
          <span className="text-base font-black font-mono text-rose-400">{sensorState.radiation} rad/h (HAZARD HIGH)</span>
        </div>
      </div>

      <p className="text-xs font-mono text-slate-300 leading-relaxed bg-space-900/60 p-3 rounded-xl border border-white/5">
        <strong className="text-cyber-purple">Objective:</strong> Select the Java `if` condition that correctly evaluates the sensor readings to trigger the emergency seal when pressure is below 50 kPa OR radiation is above 100 rad/h.
      </p>

      <div className="space-y-2.5">
        {conditions.map((cond, idx) => {
          const isSelected = selectedCondition === idx;
          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`w-full p-3.5 rounded-xl font-mono text-xs text-left border transition-all ${
                isSelected
                  ? isSuccess
                    ? 'bg-cyber-emerald/20 border-cyber-emerald text-white'
                    : 'bg-rose-500/20 border-rose-500 text-rose-300'
                  : 'bg-space-900/80 border-space-800 text-slate-200 hover:border-cyber-purple/50'
              }`}
            >
              <code>{cond.code}</code>
            </button>
          );
        })}
      </div>

      {feedback && (
        <div className={`p-3 rounded-xl border text-xs font-mono ${isSuccess ? 'bg-cyber-emerald/15 border-cyber-emerald/40 text-cyber-emerald' : 'bg-rose-500/15 border-rose-500/40 text-slate-200'}`}>
          {feedback}
        </div>
      )}
    </div>
  );
};

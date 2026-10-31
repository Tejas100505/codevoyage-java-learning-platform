import { CompanionMood } from './RobotCompanion';

export type DialogueType =
  | 'MISSION_START'
  | 'CONCEPT_EXPLANATION'
  | 'PRACTICE_CORRECT'
  | 'PRACTICE_WRONG'
  | 'COMPILER_ERROR'
  | 'TEST_FAILURE'
  | 'CHALLENGE_SUCCESS'
  | 'BOSS_INTRO'
  | 'IDLE_HINT';

export interface DialogueEntry {
  id: string;
  speaker: 'B.Y.T.E.' | 'STARFLEET_COMMAND' | 'SYSTEM';
  message: string;
  subtext?: string;
  emotion: CompanionMood;
  type: DialogueType;
  trigger: string; // e.g. "mission-1-start", "compiler-missing-semicolon", "test-failed-mismatch"
  codeHint?: string;
  conceptTag?: string;
}

export const BYTE_DIALOGUE_REGISTRY: DialogueEntry[] = [
  // =========================================================================
  // MISSION 1: Powering the Console (Java Basics)
  // =========================================================================
  {
    id: 'm1-start',
    speaker: 'B.Y.T.E.',
    message: "Cadet, the ship's mainframe has powered down after an EMP surge.",
    subtext: "Let's learn how Java structures programs so the computer knows where execution begins.",
    emotion: 'explaining',
    type: 'MISSION_START',
    trigger: 'mission-1-stage-1',
    conceptTag: 'Java Basics',
  },
  {
    id: 'm1-practice-wrong-semicolon',
    speaker: 'B.Y.T.E.',
    message: "Not quite. Look at the end of the line. Does the statement terminate properly?",
    subtext: "In Java, semicolons are like periods in English sentences. Every statement requires one.",
    emotion: 'warning',
    type: 'PRACTICE_WRONG',
    trigger: 'm1-wrong-semicolon',
    codeHint: 'System.out.println("MESSAGE");',
  },
  {
    id: 'm1-success',
    speaker: 'B.Y.T.E.',
    message: "Excellent! The ship console is online! Telemetry logs accepted by Starfleet.",
    subtext: "You constructed a valid Java class and main entrypoint. The station computer is listening.",
    emotion: 'celebrating',
    type: 'CHALLENGE_SUCCESS',
    trigger: 'mission-1-cleared',
  },

  // =========================================================================
  // MISSION 2: Ship Systems (Variables & Types)
  // =========================================================================
  {
    id: 'm2-start',
    speaker: 'B.Y.T.E.',
    message: "Cadet, the ship's power system cannot remember its fuel level.",
    subtext: "Let's learn how Java stores information in typed memory slots.",
    emotion: 'explaining',
    type: 'MISSION_START',
    trigger: 'mission-2-stage-1',
    conceptTag: 'Variables',
  },
  {
    id: 'm2-practice-wrong-decimal',
    speaker: 'B.Y.T.E.',
    message: "Not quite. Look at the value. Does it contain a decimal point?",
    subtext: "Whole numbers use 'int' (e.g. 100), while numbers with fractional decimals use 'double' (e.g. 100.5).",
    emotion: 'encouraging',
    type: 'PRACTICE_WRONG',
    trigger: 'm2-wrong-type',
    codeHint: 'int fuel = 100; double temp = 365.45;',
  },
  {
    id: 'm2-practice-wrong-quotes',
    speaker: 'B.Y.T.E.',
    message: "Careful with double quotes! \"100\" in quotes is a String (text), not an int.",
    subtext: "Java is strongly typed. You cannot assign a text String into an integer variable.",
    emotion: 'warning',
    type: 'PRACTICE_WRONG',
    trigger: 'm2-wrong-string-int',
    codeHint: 'int fuel = 100; // no quotes for numbers!',
  },
  {
    id: 'm2-success',
    speaker: 'B.Y.T.E.',
    message: "Outstanding! The fusion power core is fully energized!",
    subtext: "Energy conduits are humming at 100% capacity. Sensor readings are locked in memory.",
    emotion: 'celebrating',
    type: 'CHALLENGE_SUCCESS',
    trigger: 'mission-2-cleared',
  },

  // =========================================================================
  // MISSION 3: Receiving Transmissions (Scanner & Input)
  // =========================================================================
  {
    id: 'm3-start',
    speaker: 'B.Y.T.E.',
    message: "Cadet, an incoming shuttle transmission stream is arriving from deep space.",
    subtext: "A starship cannot rely on hardcoded numbers alone. Let's learn how Java reads dynamic input with Scanner.",
    emotion: 'explaining',
    type: 'MISSION_START',
    trigger: 'mission-3-stage-1',
    conceptTag: 'Input / Scanner',
  },
  {
    id: 'm3-wrong-order',
    speaker: 'B.Y.T.E.',
    message: "Check the packet arrival sequence! Are you reading the String before the numbers?",
    subtext: "Scanner harvests tokens chronologically. If you call nextInt() when a word arrives, Java crashes with InputMismatchException.",
    emotion: 'analyzing',
    type: 'PRACTICE_WRONG',
    trigger: 'm3-wrong-order',
    codeHint: 'String name = scanner.next(); int pods = scanner.nextInt();',
  },
  {
    id: 'm3-success',
    speaker: 'B.Y.T.E.',
    message: "Subspace communication array locked! All packets routed to flight deck.",
    subtext: "Dynamic inputs harvested cleanly from System.in without a single dropped packet.",
    emotion: 'celebrating',
    type: 'CHALLENGE_SUCCESS',
    trigger: 'mission-3-cleared',
  },

  // =========================================================================
  // MISSION 4: Engine Control (Operators & Modulus)
  // =========================================================================
  {
    id: 'm4-start',
    speaker: 'B.Y.T.E.',
    message: "Orbital decay alert! Station thrusters must pulse in exact 4-second cycles.",
    subtext: "Let's learn how Java arithmetic operators (+, -, *, /, %) perform orbital maneuvers.",
    emotion: 'analyzing',
    type: 'MISSION_START',
    trigger: 'mission-4-stage-1',
    conceptTag: 'Operators',
  },
  {
    id: 'm4-wrong-division',
    speaker: 'B.Y.T.E.',
    message: "Watch out for integer division! In Java, 14 / 4 drops the decimal completely.",
    subtext: "14 / 4 evaluates to 3. If you want the remaining seconds, use the modulus operator '%': 14 % 4 = 2.",
    emotion: 'encouraging',
    type: 'PRACTICE_WRONG',
    trigger: 'm4-wrong-div',
    codeHint: 'int cycles = burn / 4; int remainder = burn % 4;',
  },
  {
    id: 'm4-success',
    speaker: 'B.Y.T.E.',
    message: "Orbital thrusters synchronized! The station orbit has stabilized.",
    subtext: "Precise integer division and modulus calculations saved us from the volcanic dwarf star.",
    emotion: 'celebrating',
    type: 'CHALLENGE_SUCCESS',
    trigger: 'mission-4-cleared',
  },

  // =========================================================================
  // MISSION 5: BOSS MISSION — THE REACTOR FAILURE
  // =========================================================================
  {
    id: 'm5-start',
    speaker: 'B.Y.T.E.',
    message: "REACTOR FAILURE DETECTED! CORE POWER CRITICAL AT 18%!",
    subtext: "Cadet, everything you've learned so far is required. Java basics, variables, input, operators, and conditions!",
    emotion: 'warning',
    type: 'BOSS_INTRO',
    trigger: 'mission-5-stage-1',
    conceptTag: 'Boss Mission: Synthesis',
  },
  {
    id: 'm5-wrong-single-equals',
    speaker: 'B.Y.T.E.',
    message: "Careful cadet! You used single '=' inside an if condition.",
    subtext: "In Java, '=' assigns a value. To check for equality or relational thresholds, use '==', '<', '>', or compound logic '&&' and '||'.",
    emotion: 'warning',
    type: 'PRACTICE_WRONG',
    trigger: 'm5-wrong-equals',
    codeHint: 'if (deficit > 50) { ... } else if (deficit > 0) { ... }',
  },
  {
    id: 'm5-success',
    speaker: 'B.Y.T.E.',
    message: "REACTOR STABLE! CORE POWER RESTORED: 18% → 100%! BOSS DEFEATED!",
    subtext: "Ignis Station saved through real Java code! 300 XP awarded. Hyperspace coordinates to Kryon Belt unlocked!",
    emotion: 'celebrating',
    type: 'CHALLENGE_SUCCESS',
    trigger: 'mission-5-cleared',
  },

  // =========================================================================
  // COMMON COMPILER & RUNTIME ERROR TRANSLATIONS
  // =========================================================================
  {
    id: 'err-missing-semicolon',
    speaker: 'B.Y.T.E.',
    message: "The Java compiler spotted a missing semicolon (';') on line {line}.",
    subtext: "Check the statement just above or on that line and append a semicolon.",
    emotion: 'warning',
    type: 'COMPILER_ERROR',
    trigger: 'error-semicolon',
  },
  {
    id: 'err-cannot-find-symbol',
    speaker: 'B.Y.T.E.',
    message: "The compiler says 'cannot find symbol'. It doesn't recognize a variable or class name.",
    subtext: "Check spelling and capitalization. In Java, 'System' is capitalized, while 'main' and 'int' are lowercase.",
    emotion: 'warning',
    type: 'COMPILER_ERROR',
    trigger: 'error-cannot-find-symbol',
  },
  {
    id: 'err-incompatible-types',
    speaker: 'B.Y.T.E.',
    message: "Type mismatch error! You are attempting to assign an incompatible data type.",
    subtext: "Verify that numeric variables hold numbers and text is enclosed in double quotes.",
    emotion: 'warning',
    type: 'COMPILER_ERROR',
    trigger: 'error-incompatible-types',
  },
  {
    id: 'err-test-failure',
    speaker: 'B.Y.T.E.',
    message: "Your program compiled, but one test failed. Check how you're handling the input.",
    subtext: "Compare your terminal output against the target format. Ensure spaces and capitalization match exactly.",
    emotion: 'analyzing',
    type: 'TEST_FAILURE',
    trigger: 'test-case-mismatch',
  },
];

/**
 * Intelligent helper to resolve the exact authored dialogue for Byte
 * given mission context, current stage, errors, and outcomes.
 */
export function getByteDialogue(options: {
  missionOrder?: number;
  stage?: number;
  compilerError?: string;
  testPassed?: boolean;
  practiceAnswerCorrect?: boolean;
  customTrigger?: string;
}): { message: string; subtext?: string; mood: CompanionMood; codeHint?: string } {
  const { missionOrder = 1, stage = 1, compilerError, testPassed, customTrigger } = options;

  // 1. Check custom trigger match first
  if (customTrigger) {
    const match = BYTE_DIALOGUE_REGISTRY.find((d) => d.trigger === customTrigger);
    if (match) {
      return {
        message: match.message,
        subtext: match.subtext,
        mood: match.emotion,
        codeHint: match.codeHint,
      };
    }
  }

  // 2. Compiler Error Translation
  if (compilerError) {
    const lower = compilerError.toLowerCase();
    if (lower.includes("';' expected") || lower.includes("missing semicolon")) {
      const entry = BYTE_DIALOGUE_REGISTRY.find((d) => d.id === 'err-missing-semicolon')!;
      return {
        message: entry.message.replace('{line}', 'indicated in red'),
        subtext: entry.subtext,
        mood: entry.emotion,
      };
    }
    if (lower.includes('cannot find symbol') || lower.includes('not found')) {
      const entry = BYTE_DIALOGUE_REGISTRY.find((d) => d.id === 'err-cannot-find-symbol')!;
      return { message: entry.message, subtext: entry.subtext, mood: entry.emotion };
    }
    if (lower.includes('incompatible types') || lower.includes('cannot be converted')) {
      const entry = BYTE_DIALOGUE_REGISTRY.find((d) => d.id === 'err-incompatible-types')!;
      return { message: entry.message, subtext: entry.subtext, mood: entry.emotion };
    }
    return {
      message: "The compiler detected syntax anomalies in your code.",
      subtext: "Review the red diagnostic highlights below the code editor.",
      mood: 'warning',
    };
  }

  // 3. Test Failure
  if (testPassed === false) {
    const entry = BYTE_DIALOGUE_REGISTRY.find((d) => d.id === 'err-test-failure')!;
    return {
      message: entry.message,
      subtext: entry.subtext,
      mood: entry.emotion,
    };
  }

  // 4. Mission Success (Stage 7)
  if (stage === 7) {
    const successEntry = BYTE_DIALOGUE_REGISTRY.find(
      (d) => d.type === 'CHALLENGE_SUCCESS' && d.trigger === `mission-${missionOrder}-cleared`
    );
    if (successEntry) {
      return {
        message: successEntry.message,
        subtext: successEntry.subtext,
        mood: successEntry.emotion,
      };
    }
  }

  // 5. Stage 1 Mission Intro / Boss Intro
  if (stage === 1) {
    const introEntry = BYTE_DIALOGUE_REGISTRY.find(
      (d) => (d.type === 'MISSION_START' || d.type === 'BOSS_INTRO') && d.trigger === `mission-${missionOrder}-stage-1`
    );
    if (introEntry) {
      return {
        message: introEntry.message,
        subtext: introEntry.subtext,
        mood: introEntry.emotion,
      };
    }
  }

  // 6. Stage 2 Learn Phase
  if (stage === 2) {
    if (missionOrder === 1) {
      return {
        message: "Notice how Java starts execution strictly at public static void main.",
        subtext: "Every Java instruction must reside inside an enclosing class block { }.",
        mood: 'explaining',
      };
    }
    if (missionOrder === 2) {
      return {
        message: "Variables: Name, Type, Value. Think of them as labeled storage lockers in the ship's hold.",
        subtext: "Declare the type first, name it meaningfully, and assign with '='.",
        mood: 'explaining',
      };
    }
    if (missionOrder === 3) {
      return {
        message: "Scanner sc = new Scanner(System.in) acts like an antenna tuning in to incoming signals.",
        subtext: "Each next(), nextInt(), and nextDouble() takes a bite out of the arriving stream.",
        mood: 'explaining',
      };
    }
    if (missionOrder === 4) {
      return {
        message: "Operators compute formulas. Watch integer division: 5 / 2 is 2, while 5 % 2 is 1.",
        subtext: "The modulus operator '%' computes the remainder left behind.",
        mood: 'explaining',
      };
    }
    return {
      message: "If/Else branches allow the ship computer to make autonomous safety decisions.",
      subtext: "Conditions must evaluate to a boolean (true or false).",
      mood: 'explaining',
    };
  }

  // 7. Stage 4 Coding Challenge Start
  if (stage === 4) {
    if (missionOrder === 1) {
      return {
        message: "Cadet, construct the Solution class and print the two-line boot sequence.",
        subtext: "Remember: System.out.print keeps the cursor on the same line; println starts a new line.",
        mood: 'encouraging',
        codeHint: 'System.out.println("IGNIS STATION ONLINE");',
      };
    }
    if (missionOrder === 2) {
      return {
        message: "Declare sector (String), oxygenLevel (int), coreTemp (double), and shieldsActive (boolean).",
        subtext: "Assign the required values and print the formatted telemetry readout.",
        mood: 'encouraging',
        codeHint: 'int oxygenLevel = 94;',
      };
    }
    if (missionOrder === 3) {
      return {
        message: "Construct the Scanner connected to System.in and parse the incoming tokens in order.",
        subtext: "Read shuttle callsign (String), cargo count (int), and warp frequency (double).",
        mood: 'encouraging',
        codeHint: 'Scanner scanner = new Scanner(System.in);',
      };
    }
    if (missionOrder === 4) {
      return {
        message: "Calculate fuel consumed, fuel remaining, full cycles, and remainder seconds.",
        subtext: "Use burnSeconds * 25, totalFuel - burned, burnSeconds / 4, and burnSeconds % 4.",
        mood: 'encouraging',
        codeHint: 'int remainder = burnSeconds % 4;',
      };
    }
    return {
      message: "Evaluate hazard thresholds: pressure < 50 || radiation > 100 triggers emergency bulkhead seal.",
      subtext: "Use else if for the quarantine condition, and else for nominal clearance.",
      mood: 'warning',
      codeHint: 'if (pressure < 50 || radiation > 100)',
    };
  }

  // Default fallback
  return {
    message: "Awaiting your tactical input, Cadet. Starfleet mainframe is ready.",
    mood: 'idle',
  };
}

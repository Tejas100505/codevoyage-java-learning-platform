export interface CodexEntry {
  id: string;
  title: string;
  category: string;
  conceptOrder: number;
  missionRequirementOrder: number; // Mission order required to unlock (1-5 in World 1, 6+ for future worlds)
  definition: string;
  syntax: string;
  syntaxBreakdown?: Array<{
    token: string;
    description: string;
  }>;
  example: string;
  smallExample: string;
  commonMistakes: Array<{
    mistake: string;
    consequence: string;
    fix: string;
  }>;
  relatedChallenge: {
    missionId: number;
    title: string;
    objective: string;
  };
  keyTakeaways: string[];
}

export const JAVA_CODEX_DATA: CodexEntry[] = [
  {
    id: 'java-basics',
    title: 'Java Basics',
    category: 'Foundations',
    conceptOrder: 1,
    missionRequirementOrder: 1,
    definition:
      'Java is an object-oriented, strictly-typed programming language. Every standalone Java application requires an outer class wrapper and a standardized main method that acts as the entrypoint for the Java Virtual Machine (JVM).',
    syntax: `public class Solution {
    public static void main(String[] args) {
        System.out.println("Telemetric Beacon Transmitted");
    }
}`,
    syntaxBreakdown: [
      { token: 'public class Solution', description: 'The blueprint container enclosing the program component' },
      { token: 'public static void main', description: 'The JVM entrypoint door. Static = no object needed; void = no return value' },
      { token: 'String[] args', description: 'Command-line parameters passed when launching the starship application' },
      { token: 'System.out.println(...)', description: 'Prints telemetry output to the console and starts a new line' },
      { token: ';', description: 'Required terminator for every Java expression statement' }
    ],
    example: `public class Solution {
    public static void main(String[] args) {
        System.out.print("STATION: ");
        System.out.println("IGNIS ONLINE");
    }
}`,
    smallExample: `System.out.println("IGNIS STATION ONLINE");`,
    commonMistakes: [
      {
        mistake: 'Missing semicolon (;)',
        consequence: "Compilation error: ';' expected",
        fix: 'Every executable Java statement must conclude with a semicolon.'
      },
      {
        mistake: 'Capitalization errors like system.out.println or Main',
        consequence: "Cannot find symbol / Main method not found in class",
        fix: "Java is strictly case-sensitive. 'System' must be uppercase, 'main' must be lowercase."
      },
      {
        mistake: 'Unbalanced curly braces { }',
        consequence: 'Reached end of file while parsing',
        fix: 'Every opening brace { must be cleanly closed with a matching }.'
      }
    ],
    relatedChallenge: {
      missionId: 1,
      title: 'Mission 01: System Initialization',
      objective: 'Transmit "IGNIS STATION ONLINE" to re-establish primary station communication.'
    },
    keyTakeaways: [
      'Java is case-sensitive and enforces strict class-method hierarchy.',
      'System.out.print() prints on the active line; System.out.println() inserts a newline.',
      'The JVM always looks for `public static void main(String[] args)` to begin execution.'
    ]
  },
  {
    id: 'variables',
    title: 'Variables',
    category: 'Memory & State',
    conceptOrder: 2,
    missionRequirementOrder: 2,
    definition:
      'A variable is a named storage location in starship memory dedicated to holding data that can be inspected, updated, and used throughout the lifecycle of a program.',
    syntax: `int fuel = 100;`,
    syntaxBreakdown: [
      { token: 'int', description: 'Data type declaration specifying whole numbers in memory' },
      { token: 'fuel', description: 'Identifier / variable name used to reference this memory location' },
      { token: '=', description: 'Assignment operator storing the value on the right into the variable on the left' },
      { token: '100', description: 'Literal integer value assigned to the variable' },
      { token: ';', description: 'Terminates the variable declaration and assignment statement' }
    ],
    example: `public class Solution {
    public static void main(String[] args) {
        int fuel = 100;
        int consumption = 25;
        int remaining = fuel - consumption;
        System.out.println("Remaining Fuel: " + remaining);
    }
}`,
    smallExample: `int corePower = 85;`,
    commonMistakes: [
      {
        mistake: 'Using an uninitialized variable',
        consequence: 'Variable might not have been initialized',
        fix: 'Always assign an initial value before attempting to read or print it.'
      },
      {
        mistake: 'Re-declaring the same variable name with its type again',
        consequence: 'Variable already defined in method main',
        fix: 'Declare the type only once (int fuel = 100;). For updates, write fuel = 200;.'
      },
      {
        mistake: 'Assigning a decimal value to an int',
        consequence: 'Incompatible types: possible lossy conversion from double to int',
        fix: 'Use double for decimal numbers, or cast explicitly if truncation is intentional.'
      }
    ],
    relatedChallenge: {
      missionId: 2,
      title: 'Mission 02: Power Core Stabilization',
      objective: 'Declare and calibrate reactor variables to restore auxiliary station power.'
    },
    keyTakeaways: [
      'Variables require a declared type, an identifier name, and a value.',
      'Memory slots can be updated at runtime without re-specifying the data type.',
      'Variable names follow lowerCamelCase convention (e.g. shipSpeed, reactorCore).'
    ]
  },
  {
    id: 'data-types',
    title: 'Data Types',
    category: 'Memory & State',
    conceptOrder: 3,
    missionRequirementOrder: 2,
    definition:
      'Java is a strongly typed language. Every variable has a specific data type that determines how much memory it occupies, what operations are permitted, and what range of values it can store.',
    syntax: `int energy = 100;
double hullIntegrity = 98.6;
boolean shieldsUp = true;
String sectorName = "Ignis Asteroid";`,
    syntaxBreakdown: [
      { token: 'int', description: '32-bit signed integer storing whole numbers (-2^31 to 2^31 - 1)' },
      { token: 'double', description: '64-bit IEEE 754 floating point storing high-precision decimal numbers' },
      { token: 'boolean', description: '1-bit truth value holding strictly true or false' },
      { token: 'String', description: 'Reference class object holding a sequence of Unicode text characters' }
    ],
    example: `public class Solution {
    public static void main(String[] args) {
        String designation = "USS Vanguard";
        int crewCount = 12;
        double shieldFrequency = 450.75;
        boolean warpDriveReady = true;

        System.out.println(designation + " | Shields: " + shieldFrequency + "MHz");
    }
}`,
    smallExample: `double thermalLevel = 350.25;`,
    commonMistakes: [
      {
        mistake: 'Using single quotes for Strings (\'Ignis\')',
        consequence: 'Unclosed character literal',
        fix: 'Single quotes are strictly for single char primitives. Double quotes ("...") are required for String.'
      },
      {
        mistake: 'Assigning numbers or text to a boolean (boolean active = 1;)',
        consequence: 'Incompatible types: int cannot be converted to boolean',
        fix: 'In Java, boolean only accepts true or false.'
      },
      {
        mistake: 'Integer division truncation (int result = 5 / 2; // yields 2)',
        consequence: 'Loss of fractional precision',
        fix: 'Ensure at least one operand is a double (5.0 / 2 yields 2.5).'
      }
    ],
    relatedChallenge: {
      missionId: 2,
      title: 'Mission 02: Power Core Stabilization',
      objective: 'Allocate matching primitive types for core temperature, energy, and reactor status.'
    },
    keyTakeaways: [
      'Primitive types include int, double, boolean, char, long, float, short, and byte.',
      'String is an immutable reference type, not a primitive.',
      'Java prevents implicit narrowing conversions that could result in data loss.'
    ]
  },
  {
    id: 'input-scanner',
    title: 'Input / Scanner',
    category: 'Sub-space IO',
    conceptOrder: 4,
    missionRequirementOrder: 3,
    definition:
      'Java Scanner is a utility class in the java.util package used to read and parse formatted tokens from standard input (System.in), sub-space telemetry feeds, or data streams.',
    syntax: `import java.util.Scanner;

Scanner scanner = new Scanner(System.in);
String command = scanner.nextLine();
int sectorCode = scanner.nextInt();`,
    syntaxBreakdown: [
      { token: 'import java.util.Scanner', description: 'Brings the Scanner utility into scope from Java standard library' },
      { token: 'new Scanner(System.in)', description: 'Instantiates a scanner linked to the standard terminal input stream' },
      { token: 'scanner.nextLine()', description: 'Reads the entire line of text until the user presses Enter' },
      { token: 'scanner.nextInt()', description: 'Parses the next token as a 32-bit signed integer' }
    ],
    example: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String pilot = scanner.nextLine();
        int clearanceLevel = scanner.nextInt();

        System.out.println("PILOT IDENTIFIED: " + pilot);
        System.out.println("CLEARANCE: LEVEL " + clearanceLevel);
        scanner.close();
    }
}`,
    smallExample: `Scanner sc = new Scanner(System.in); int x = sc.nextInt();`,
    commonMistakes: [
      {
        mistake: 'Forgetting import java.util.Scanner;',
        consequence: 'Cannot find symbol class Scanner',
        fix: 'Add `import java.util.Scanner;` at the very top of your source file.'
      },
      {
        mistake: 'Leaving leftover newline after scanner.nextInt() before calling scanner.nextLine()',
        consequence: 'nextLine() immediately reads an empty string from the trailing Enter key',
        fix: 'Add a sacrificial `scanner.nextLine();` to consume the trailing carriage return.'
      },
      {
        mistake: 'Passing non-numeric text into nextInt()',
        consequence: 'InputMismatchException at runtime',
        fix: 'Verify input format or check `scanner.hasNextInt()` before reading.'
      }
    ],
    relatedChallenge: {
      missionId: 3,
      title: 'Mission 03: Communication Array Realignment',
      objective: 'Listen to sub-space telemetry and echo decoded distress coordinates.'
    },
    keyTakeaways: [
      'Always import java.util.Scanner before declaring Scanner variables.',
      'Use next() for single words, nextLine() for full text phrases, and nextInt()/nextDouble() for numbers.',
      'Remember to close scanner resources when stream parsing concludes.'
    ]
  },
  {
    id: 'operators',
    title: 'Operators',
    category: 'Arithmetic & Calculations',
    conceptOrder: 5,
    missionRequirementOrder: 4,
    definition:
      'Operators are special symbols that perform mathematical calculations, comparisons, and logical evaluations on operands to determine state changes and drive game logic.',
    syntax: `// Arithmetic: +, -, *, /, %
int totalBurn = baseThrust + boosterThrust;
int remainder = fuel % 4;

// Compound: +=, -=, *=, /=
fuel -= consumptionRate;`,
    syntaxBreakdown: [
      { token: '+, -, *, /', description: 'Standard arithmetic addition, subtraction, multiplication, and division' },
      { token: '%', description: 'Modulus operator returning the integer remainder after division' },
      { token: '+=, -=', description: 'Compound assignment operators modifying and saving in one step' },
      { token: '++, --', description: 'Increment / decrement operators adjusting value by exactly 1' }
    ],
    example: `public class Solution {
    public static void main(String[] args) {
        int initialFuel = 1000;
        int burnRate = 120;
        int seconds = 5;

        int consumed = burnRate * seconds;
        int remaining = initialFuel - consumed;

        System.out.println("CONSUMED: " + consumed);
        System.out.println("REMAINING: " + remaining);
    }
}`,
    smallExample: `int fuelRemaining = initialFuel - (burnRate * time);`,
    commonMistakes: [
      {
        mistake: 'Confusing assignment (=) with equality comparison (==)',
        consequence: 'Syntax error or accidental reassignment in conditions',
        fix: 'Use = to assign a value; use == to compare two values.'
      },
      {
        mistake: 'Division by zero (int fail = 100 / 0;)',
        consequence: 'ArithmeticException: / by zero at runtime',
        fix: 'Always validate divisors are non-zero before executing division or modulus.'
      },
      {
        mistake: 'Neglecting operator precedence (PEMDAS)',
        consequence: 'Calculation results in an unexpected value',
        fix: 'Use parentheses (a + b) * c to explicitly declare intended calculation order.'
      }
    ],
    relatedChallenge: {
      missionId: 4,
      title: 'Mission 04: Thruster Calibration',
      objective: 'Calculate fuel burn consumption vectors to synchronize station thruster pulses.'
    },
    keyTakeaways: [
      'Multiplication (*) and division (/) execute before addition (+) and subtraction (-).',
      'Modulus (%) is indispensable for cycling arrays, timers, and round-robin scheduling.',
      'Compound operators like `power += 10;` offer cleaner code and prevent repetition.'
    ]
  },
  {
    id: 'conditions',
    title: 'Conditions & Logic',
    category: 'Branching & Control',
    conceptOrder: 6,
    missionRequirementOrder: 5,
    definition:
      'Conditional branching allows Java programs to make decisions and execute different blocks of code depending on whether specified boolean expressions evaluate to true or false.',
    syntax: `if (radiationLevel > 100 || pressure < 50) {
    System.out.println("PROTOCOL: EMERGENCY DUMP");
} else if (radiationLevel > 50 || pressure < 80) {
    System.out.println("PROTOCOL: CAUTION - AUXILIARY SHIELDS");
} else {
    System.out.println("PROTOCOL: NOMINAL - CLEARANCE GRANTED");
}`,
    syntaxBreakdown: [
      { token: 'if (...)', description: 'Evaluates boolean test; executes following block if true' },
      { token: 'else if (...)', description: 'Secondary test evaluated only if preceding tests evaluated to false' },
      { token: 'else', description: 'Catch-all fallback block executed when all prior conditions fail' },
      { token: '&&', description: 'Logical AND: returns true only if BOTH operands are true' },
      { token: '||', description: 'Logical OR: returns true if AT LEAST ONE operand is true' },
      { token: '!', description: 'Logical NOT: inverts the boolean value (!true becomes false)' }
    ],
    example: `public class Solution {
    public static void main(String[] args) {
        int pressure = 45;
        int radiation = 30;

        if (pressure < 50 || radiation > 100) {
            System.out.println("EMERGENCY OVERRIDE ENGAGED");
        } else {
            System.out.println("SYSTEMS STABLE");
        }
    }
}`,
    smallExample: `if (shields < 20) { triggerAlarm(); }`,
    commonMistakes: [
      {
        mistake: 'Accidental semicolon after if statement: if (x > 10); { ... }',
        consequence: 'The if statement terminates immediately, and the block always executes unconditionally',
        fix: 'Never place a semicolon directly after the condition parentheses.'
      },
      {
        mistake: 'Using & or | instead of short-circuit && or ||',
        consequence: 'Evaluates right operand unnecessarily, risking NullPointerExceptions',
        fix: 'Use short-circuit && and || for logical evaluations.'
      },
      {
        mistake: 'Comparing Strings with == instead of .equals()',
        consequence: 'Evaluates reference memory address instead of text content, producing false negatives',
        fix: 'Always use command.equals("LAUNCH") rather than command == "LAUNCH".'
      }
    ],
    relatedChallenge: {
      missionId: 5,
      title: 'Mission 05: Emergency Interlock Protocol',
      objective: 'Evaluate multiple sensor hazard readings using logical branching to grant launch clearance.'
    },
    keyTakeaways: [
      'Conditions must evaluate to a strict boolean (true or false).',
      'Short-circuit logic prevents evaluation of subsequent terms once the outcome is decided.',
      'Always use .equals() when evaluating Java String text equality.'
    ]
  },
  {
    id: 'loops',
    title: 'Loops & Iterations',
    category: 'Automation & Cycles',
    conceptOrder: 7,
    missionRequirementOrder: 6, // World 3 concept
    definition:
      'Loops automate repetitive operations. A while loop repeatedly executes code as long as a condition holds true, while a for loop provides structured counter initialization, condition testing, and step increments.',
    syntax: `// Standard For Loop:
for (int i = 0; i < 5; i++) {
    System.out.println("Orbital Cycle: " + i);
}

// While Loop:
while (energyLevels < 100) {
    energyLevels += 10;
}`,
    syntaxBreakdown: [
      { token: 'for (init; cond; step)', description: 'Three-part control loop for bounded repetitions' },
      { token: 'while (cond)', description: 'Continues execution indefinite times while boolean test remains true' },
      { token: 'break', description: 'Immediately exits the enclosing loop structure' },
      { token: 'continue', description: 'Skips the remainder of current iteration and proceeds to next step' }
    ],
    example: `public class Solution {
    public static void main(String[] args) {
        int heat = 80;
        int seconds = 0;
        while (heat > 0) {
            heat -= 20;
            seconds++;
        }
        System.out.println("COOLDOWN COMPLETE IN " + seconds + " SECONDS");
    }
}`,
    smallExample: `for (int i = 1; i <= 3; i++) { emitPulse(); }`,
    commonMistakes: [
      {
        mistake: 'Infinite loops caused by never modifying the termination condition variable',
        consequence: 'CPU spikes, memory locks up, and flight computer timeouts occur',
        fix: 'Ensure loop body modifies the variable evaluated in the condition.'
      },
      {
        mistake: 'Off-by-one errors (using < vs <=)',
        consequence: 'Loop runs one time too few or one time too many',
        fix: 'Double check whether the boundary value should be inclusive or exclusive.'
      }
    ],
    relatedChallenge: {
      missionId: 6,
      title: 'World 3: Cyclic Pulse Automation',
      objective: 'Iterate through high-frequency plasma bursts to stabilize hyper-pulsar shield arrays.'
    },
    keyTakeaways: [
      'Use for loops when the number of iterations is known ahead of time.',
      'Use while loops when repeating until an external state changes.',
      'Always ensure an exit path exists to prevent infinite execution loops.'
    ]
  },
  {
    id: 'methods',
    title: 'Methods & Subroutines',
    category: 'Modularity & Architecture',
    conceptOrder: 8,
    missionRequirementOrder: 7, // World 4 concept
    definition:
      'A method is a reusable block of code designed to perform a specific operation, optionally taking input arguments (parameters) and returning a computed result value to the caller.',
    syntax: `public static int calculateShields(int basePower, double multiplier) {
    return (int) (basePower * multiplier);
}`,
    syntaxBreakdown: [
      { token: 'public static', description: 'Accessible modifier and static scope declaration' },
      { token: 'int', description: 'Return type specifying the data type returned by the subroutine' },
      { token: 'calculateShields', description: 'Descriptive method identifier used to invoke the function' },
      { token: '(int basePower, double multiplier)', description: 'Parameter list accepted by the method' },
      { token: 'return ...;', description: 'Terminates method execution and transmits the value back to caller' }
    ],
    example: `public class Solution {
    public static int computeDefense(int power, int armor) {
        return (power * 2) + armor;
    }

    public static void main(String[] args) {
        int totalDefense = computeDefense(50, 20);
        System.out.println("TOTAL DEFENSE RATING: " + totalDefense);
    }
}`,
    smallExample: `public static double getSpeed(double d, double t) { return d / t; }`,
    commonMistakes: [
      {
        mistake: 'Missing return statement in a non-void method',
        consequence: 'Compilation error: missing return statement',
        fix: 'Every code path in a method with a return type must execute a return statement.'
      },
      {
        mistake: 'Attempting to return a value from a void method',
        consequence: 'Cannot return a value from a method with void result type',
        fix: 'Remove returned value or change method return type to match.'
      }
    ],
    relatedChallenge: {
      missionId: 7,
      title: 'World 4: Distributed Quantum Sensors',
      objective: 'Refactor complex monolithic telemetry parsing into clean, reusable Java subroutines.'
    },
    keyTakeaways: [
      'Methods promote DRY (Don’t Repeat Yourself) modular architecture.',
      'Methods can take zero or multiple parameters, but can return at most one value.',
      'A void return type means the method performs side effects without transmitting data back.'
    ]
  }
];

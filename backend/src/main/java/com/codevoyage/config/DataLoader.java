package com.codevoyage.config;

import com.codevoyage.achievement.Achievement;
import com.codevoyage.achievement.AchievementRepository;
import com.codevoyage.challenge.CodingChallenge;
import com.codevoyage.challenge.CodingChallengeRepository;
import com.codevoyage.challenge.Hint;
import com.codevoyage.challenge.TestCase;
import com.codevoyage.course.Course;
import com.codevoyage.course.CourseRepository;
import com.codevoyage.lesson.Lesson;
import com.codevoyage.mission.Mission;
import com.codevoyage.mission.MissionRepository;
import com.codevoyage.practice.PracticeQuestion;
import com.codevoyage.world.World;
import com.codevoyage.world.WorldRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private final CourseRepository courseRepository;
    private final WorldRepository worldRepository;
    private final MissionRepository missionRepository;
    private final CodingChallengeRepository codingChallengeRepository;
    private final AchievementRepository achievementRepository;

    public DataLoader(
            CourseRepository courseRepository,
            WorldRepository worldRepository,
            MissionRepository missionRepository,
            CodingChallengeRepository codingChallengeRepository,
            AchievementRepository achievementRepository
    ) {
        this.courseRepository = courseRepository;
        this.worldRepository = worldRepository;
        this.missionRepository = missionRepository;
        this.codingChallengeRepository = codingChallengeRepository;
        this.achievementRepository = achievementRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        seedAchievements();

        // Enforce world unlock constraints: Only World 1 is unlocked by default; Worlds 2+ require progression
        worldRepository.findAll().forEach(w -> {
            if (w.getWorldOrder() == 1) {
                if (!Boolean.TRUE.equals(w.getUnlockedByDefault())) {
                    w.setUnlockedByDefault(true);
                    worldRepository.save(w);
                }
            } else {
                if (Boolean.TRUE.equals(w.getUnlockedByDefault())) {
                    w.setUnlockedByDefault(false);
                    worldRepository.save(w);
                }
            }
        });

        // Ensure Worlds 3 and 4 have their complete missions seeded (self-healing for existing databases)
        seedWorlds3And4IfMissing();

        if (courseRepository.count() > 0) {
            return; // Data already seeded
        }

        // 1. Create Main Course
        Course course = new Course(
                "java-galaxy-odyssey",
                "Java Galaxy Odyssey",
                "Embark on an epic space adventure where starship life support, telemetry decoders, and reactor safeguards are engineered with real Java 21.",
                "BEGINNER"
        );
        course = courseRepository.save(course);

        // 2. Create World 1: IGNIS STATION
        World world1 = new World(
                course,
                1,
                "ignis-station",
                "WORLD 1 — IGNIS STATION",
                "Volcanic Asteroid Mining & Subspace Relay Outpost",
                "An industrial outpost orbiting a turbulent volcanic dwarf star. Cadets reboot starship operating systems, calibrate life-support memory, decode incoming subspace packets, fine-tune thrusters, and seal airlocks through authentic Java code.",
                true
        );
        world1 = worldRepository.save(world1);

        // Seed Global Achievements
        seedAchievements();

        // =========================================================================
        // MISSION 1: Powering the Console
        // Narrative: The fusion auxiliary matrix has suffered an electromagnetic pulse.
        // Concept: Java program structure, class, main method, System.out.print vs println
        // =========================================================================
        Mission m1 = new Mission(
                world1,
                1,
                "Powering the Console",
                "powering-the-console",
                "Cadet, the station's auxiliary power core has suffered an electromagnetic pulse and shut down. Before any orbital propulsion or life-support telemetry can be initiated, you must send an authenticated boot beacon to the station mainframe. In Java, every executable instruction begins at a strictly defined entry point. Without a valid class structure and main method, the ship's computer cannot locate where to start execution.",
                "Construct a valid Java class named 'Solution' with the standard main method, and use both System.out.print and System.out.println to output the exact two-line boot sequence required by the station terminal.",
                "Java Program Structure & Console Output",
                100,
                3,
                "EASY",
                null
        );
        m1.setShipSystem("SHIP_CONSOLE");

        Lesson l1 = new Lesson(
                m1,
                "The Anatomy of a Java Program",
                "Every Java program requires a containing class and a designated main entry point where execution begins.",
                "### Why Java Requires Structure\n" +
                "Unlike loose script files, Java programs are organized into **classes**. A class acts as a blueprint for code. When the Java Virtual Machine (JVM) loads your program, it searches specifically for an entry point method named `main`.\n\n" +
                "```java\n" +
                "public class Solution {\n" +
                "    public static void main(String[] args) {\n" +
                "        // Code executed line by line here\n" +
                "    }\n" +
                "}\n" +
                "```\n\n" +
                "### Dissecting the Signature\n" +
                "- `public`: Access modifier allowing the JVM to invoke this method from anywhere.\n" +
                "- `static`: Enables the JVM to call the method without creating an instance of the class in memory.\n" +
                "- `void`: Specifies that the entrypoint method does not return a value upon completion.\n" +
                "- `String[] args`: An array parameter accepting command-line launch arguments.\n\n" +
                "### Printing to the Terminal: `print` vs `println`\n" +
                "- `System.out.print(...)`: Prints text to the terminal and leaves the cursor on the **same line**.\n" +
                "- `System.out.println(...)`: Prints text and immediately moves the cursor to the **next line**.",
                "public class Solution {\n" +
                "    public static void main(String[] args) {\n" +
                "        System.out.print(\"SYSTEM: \");\n" +
                "        System.out.println(\"IGNIS STATION ONLINE\");\n" +
                "    }\n" +
                "}",
                "1. Java is strictly case-sensitive: `System` must be capitalized, while `main` and `void` are lowercase.\n" +
                "2. Every statement MUST end with a semicolon (`;`).\n" +
                "3. Use `System.out.print` when chaining text on the same line, and `System.out.println` to start a new line."
        );
        l1.setWhyNeeded("The station mainframe has powered down after an EMP surge. In Java, code cannot just float around loosely like a text note—the computer needs to know where the starship program starts and where its boundaries are.");
        l1.setVisualRepJson("{\"type\":\"hierarchy\",\"title\":\"Java Starship Architecture\",\"nodes\":[{\"label\":\"public class Solution\",\"role\":\"The Hull / Blueprint\",\"desc\":\"Contains all systems and logic for this ship component.\"},{\"label\":\"public static void main(String[] args)\",\"role\":\"The Engine Ignition Key\",\"desc\":\"The JVM always looks for this exact doorway to start running.\"},{\"label\":\"System.out.println(...);\",\"role\":\"Cockpit Radio Transmitter\",\"desc\":\"Emits telemetry text to the station console screen.\"}]}");
        l1.setSyntaxBreakdownJson("[{\"keyword\":\"public class Solution\",\"meaning\":\"Defines a container named Solution accessible across starfleet systems.\"},{\"keyword\":\"public static void main\",\"meaning\":\"The entrypoint function. static means JVM calls it without prior instantiation; void means it returns no value.\"},{\"keyword\":\"String[] args\",\"meaning\":\"Array of text parameters passed when launching the starship program.\"},{\"keyword\":\"System.out.println()\",\"meaning\":\"Prints the enclosed text and inserts a newline carriage return.\"}]");
        l1.setCommonMistakesJson("[{\"mistake\":\"Missing semicolon (;)\",\"consequence\":\"Compilation error: ';' expected\",\"fix\":\"Every Java statement must conclude with a semicolon (;).\"},{\"mistake\":\"Capitalization error: system.out.println or Main\",\"consequence\":\"Cannot find symbol / Main method not found\",\"fix\":\"Java is strictly case-sensitive. Use 'System' with capital S, and 'main' in lowercase.\"},{\"mistake\":\"Mismatched curly braces { }\",\"consequence\":\"Reached end of file while parsing\",\"fix\":\"Every opening brace { must have a corresponding closing brace }.\"}]");
        l1.setInteractiveSnippet("System.out.println(\"__MESSAGE__\");");
        l1.setInteractiveOptionsJson("[{\"label\":\"Transmit Boot Beacon\",\"code\":\"System.out.println(\\\"BOOT SEQUENCE: INITIATED\\\");\",\"preview\":\"BOOT SEQUENCE: INITIATED\"},{\"label\":\"Print Diagnostic Alert\",\"code\":\"System.out.println(\\\"WARNING: CORE RUNNING ON AUXILIARY\\\");\",\"preview\":\"WARNING: CORE RUNNING ON AUXILIARY\"},{\"label\":\"Same-Line Chaining with print()\",\"code\":\"System.out.print(\\\"CORE: \\\"); System.out.println(\\\"READY\\\");\",\"preview\":\"CORE: READY\"}]");
        m1.setLesson(l1);

        PracticeQuestion pq1_1 = new PracticeQuestion(
                m1,
                1,
                "What is the exact method signature the Java Virtual Machine searches for when executing an application?",
                null,
                "[\"public void main(String[] args)\", \"public static void main(String[] args)\", \"public static int main()\", \"private void start(String[] args)\"]",
                1,
                "The JVM strictly looks for `public static void main(String[] args)` to launch standalone applications."
        );
        pq1_1.setActivityType("MULTIPLE_CHOICE");
        pq1_1.setHint("Look for the signature containing both 'static' (no object required) and 'void' (returns nothing).");

        PracticeQuestion pq1_2 = new PracticeQuestion(
                m1,
                2,
                "Predict the console output of this sequenced transmission:",
                "System.out.print(\"CORE\");\nSystem.out.println(\"-ALPHA\");\nSystem.out.print(\"READY\");",
                "[\"CORE\\n-ALPHA\\nREADY\", \"CORE-ALPHA\\nREADY\", \"CORE-ALPHA READY\", \"CORE\\n-ALPHA READY\"]",
                1,
                "System.out.print(\"CORE\") keeps the cursor on the same line; System.out.println(\"-ALPHA\") prints to that line then feeds a newline; \"READY\" prints on line 2."
        );
        pq1_2.setActivityType("PREDICT_OUTPUT");
        pq1_2.setHint("Notice the first statement is print() (no newline), followed by println() (inserts newline after).");

        PracticeQuestion pq1_3 = new PracticeQuestion(
                m1,
                3,
                "Identify the syntax defect in this terminal output statement:",
                "System.out.println(\"IGNIS STATION ONLINE\")",
                "[\"Missing closing semicolon ';'\", \"Double quotes are illegal in Java\", \"System must be lowercase\", \"println requires two arguments\"]",
                0,
                "In Java, every expression statement must end with a semicolon. Missing one causes a compile-time syntax error."
        );
        pq1_3.setActivityType("DEBUG_CODE");
        pq1_3.setHint("Examine the end of the line. What character is required to terminate every Java instruction?");

        PracticeQuestion pq1_4 = new PracticeQuestion(
                m1,
                4,
                "Reorder the tokens into a valid Java executable file structure:",
                null,
                "[\"public class Solution {\", \"public static void main(String[] args) {\", \"System.out.println(\\\"BOOT\\\");\", \"}\", \"}\"]",
                0,
                "A Java program is organized inside-out: class blueprint outer container, main method ignition key, statements inside main, followed by closing braces."
        );
        pq1_4.setActivityType("REORDER_CODE");
        pq1_4.setActivityDataJson("{\"correctOrder\":[\"public class Solution {\",\"public static void main(String[] args) {\",\"System.out.println(\\\"BOOT\\\");\",\"}\",\"}\"]}");
        pq1_4.setHint("Class declaration comes first, enclosing the main method, which in turn encloses the print statement.");

        m1.getPracticeQuestions().addAll(List.of(pq1_1, pq1_2, pq1_3, pq1_4));

        CodingChallenge cc1 = new CodingChallenge(
                m1,
                "Console Activation Sequence",
                "Write a complete Java program in class `Solution` that prints the required two-line boot sequence:\n\nLine 1: `IGNIS STATION: ONLINE`\nLine 2: `ALL SYSTEMS NOMINAL`\n\nEnsure exact capitalization, spacing, and punctuation.",
                "public class Solution {\n" +
                "    public static void main(String[] args) {\n" +
                "        // Cadet: Initiate the console handshake here\n" +
                "        \n" +
                "    }\n" +
                "}",
                "public static void main(String[] args)"
        );

        TestCase tc1_1 = new TestCase(cc1, "", "IGNIS STATION: ONLINE\nALL SYSTEMS NOMINAL\n", "Verify 2-line console activation output", false);
        TestCase tc1_2 = new TestCase(cc1, "", "IGNIS STATION: ONLINE\nALL SYSTEMS NOMINAL\n", "Whitespace and case-sensitivity validation", false);
        TestCase tc1_h1 = new TestCase(cc1, "", "IGNIS STATION: ONLINE\nALL SYSTEMS NOMINAL\n", "Hidden test: Verification of newline carriage return", true);
        TestCase tc1_h2 = new TestCase(cc1, "", "IGNIS STATION: ONLINE\nALL SYSTEMS NOMINAL\n", "Hidden test: Boundary check on trailing character precision", true);
        cc1.getTestCases().addAll(List.of(tc1_1, tc1_2, tc1_h1, tc1_h2));

        Hint h1_1 = new Hint(cc1, 1, "Use two `System.out.println(...)` statements or concatenate with a newline.", 10);
        Hint h1_2 = new Hint(cc1, 2, "Check spelling carefully: `IGNIS STATION: ONLINE` on line 1, `ALL SYSTEMS NOMINAL` on line 2.", 20);
        cc1.getHints().addAll(List.of(h1_1, h1_2));

        m1.setCodingChallenge(cc1);
        m1 = missionRepository.save(m1);

        // =========================================================================
        // MISSION 2: Ship Systems
        // Narrative: Life support, shield integrity, and sector codes must be stored in memory.
        // Concept: Variables, int, double, String, boolean, declaration, initialization
        // =========================================================================
        Mission m2 = new Mission(
                world1,
                2,
                "Ship Systems",
                "ship-systems",
                "With the primary terminal active, Ignis Station life-support and navigational defense computers need calibration. The computer cannot monitor life support if values vanish the moment they are calculated. In Java, variables are named memory slots where the computer securely holds numbers, text, and operational flags throughout your mission.",
                "Declare and initialize typed variables for sector callsign (String), oxygen level (int), reactor core temperature (double), and shield integrity status (boolean). Print the formatted diagnostic telemetry report.",
                "Variables, Primitive Types & Memory Allocation",
                120,
                3,
                "EASY",
                m1.getId()
        );
        m2.setShipSystem("POWER_CORE");

        Lesson l2 = new Lesson(
                m2,
                "Storing Starship Data in Typed Variables",
                "Variables allocate labeled memory storage for values of a specific data type.",
                "### Why Variables Are Essential\n" +
                "Starships process millions of sensor readings every second. A computer needs a way to store, update, and read these measurements. In Java, every piece of data must have a declared type before you can store it.\n\n" +
                "### Core Primitive & Reference Types\n" +
                "- `int`: Whole numbers without decimals (e.g. `oxygenLevel = 94;`)\n" +
                "- `double`: Floating-point numbers with decimal precision (e.g. `coreTemp = 365.45;`)\n" +
                "- `boolean`: Binary flag containing either `true` or `false` (e.g. `shieldsActive = true;`)\n" +
                "- `String`: An ordered sequence of characters enclosed in double quotes (e.g. `sector = \"SECTOR-7G\";`)\n\n" +
                "### Declaration & Initialization\n" +
                "To create a variable, specify the **type**, the **identifier name**, and an optional initial **value**:\n" +
                "```java\n" +
                "int crewCount = 12;            // Declared and initialized\n" +
                "double warpFactor = 4.5;\n" +
                "boolean airlockLocked = true;\n" +
                "String shipName = \"Vanguard\";\n" +
                "```\n\n" +
                "### String Concatenation\n" +
                "You can join strings and variables together using the `+` operator:\n" +
                "```java\n" +
                "System.out.println(shipName + \" Crew: \" + crewCount);\n" +
                "```",
                "public class Solution {\n" +
                "    public static void main(String[] args) {\n" +
                "        String sector = \"ALPHA\";\n" +
                "        int oxygen = 98;\n" +
                "        double temp = 36.6;\n" +
                "        boolean shields = true;\n" +
                "        \n" +
                "        System.out.println(\"[" + "SECTOR \" + sector + \"] O2: \" + oxygen + \"% TEMP: \" + temp + \"C SHIELDS: \" + shields);\n" +
                "    }\n" +
                "}",
                "1. Java is strongly typed: an `int` variable cannot directly hold a decimal or a String.\n" +
                "2. Variable names in Java follow lowerCamelCase (e.g., `oxygenLevel`, `shieldsActive`).\n" +
                "3. Variables must be initialized before their value can be printed or used in calculations."
        );
        l2.setWhyNeeded("Starships process critical sensor readings: oxygen levels, shield integrity, reactor temperature, and sector callsigns. If a program doesn't save these in labeled memory storage, values vanish into vacuum the instant they are measured!");
        l2.setVisualRepJson("{\"type\":\"boxes\",\"title\":\"Starship Memory Containers\",\"nodes\":[{\"label\":\"String sector\",\"role\":\"Text Slot\",\"desc\":\"Stores character sequences in quotes: \\\"IGNIS-ALPHA\\\"\"},{\"label\":\"int oxygenLevel\",\"role\":\"Whole Number Slot\",\"desc\":\"Stores integers without fractions: 95\"},{\"label\":\"double coreTemperature\",\"role\":\"Decimal Slot\",\"desc\":\"Stores precise floating-point decimals: 350.5\"},{\"label\":\"boolean shieldsActive\",\"role\":\"Binary Flag\",\"desc\":\"Stores true or false status: true\"}]}");
        l2.setSyntaxBreakdownJson("[{\"keyword\":\"dataType identifier = value;\",\"meaning\":\"The 3-part blueprint of variable declaration & initialization.\"},{\"keyword\":\"int\",\"meaning\":\"Primitive type for whole integers (e.g. 100, -5, 0).\"},{\"keyword\":\"double\",\"meaning\":\"Primitive type for floating-point decimals (e.g. 98.6, 3.1415).\"},{\"keyword\":\"boolean\",\"meaning\":\"Primitive binary flag: literal true or false.\"},{\"keyword\":\"String\",\"meaning\":\"Reference type for text sequences enclosed in double quotation marks.\"}]");
        l2.setCommonMistakesJson("[{\"mistake\":\"Putting quotes around boolean or numbers: boolean shield = \\\"true\\\";\",\"consequence\":\"Incompatible types: String cannot be converted to boolean\",\"fix\":\"Only Strings use double quotes. Primitive numbers (95) and booleans (true) do NOT use quotes.\"},{\"mistake\":\"Storing decimals inside an int: int fuel = 99.5;\",\"consequence\":\"Incompatible types: possible lossy conversion from double to int\",\"fix\":\"Use 'double' when decimal fractions are needed.\"},{\"mistake\":\"Using a variable before assigning a value: int speed; System.out.println(speed);\",\"consequence\":\"Variable speed might not have been initialized\",\"fix\":\"Always assign an initial value before reading a local variable.\"}]");
        l2.setInteractiveSnippet("int fuel = __VALUE__;\nSystem.out.println(\"FUEL: \" + fuel + \"%\");");
        l2.setInteractiveOptionsJson("[{\"label\":\"Nominal Fuel (100%)\",\"code\":\"int fuel = 100; System.out.println(\\\"FUEL: \\\" + fuel + \\\"%\\\");\",\"preview\":\"FUEL: 100%\"},{\"label\":\"Reserve Warning (35%)\",\"code\":\"int fuel = 35; System.out.println(\\\"FUEL: \\\" + fuel + \\\"% [RESERVE]\\\");\",\"preview\":\"FUEL: 35% [RESERVE]\"},{\"label\":\"Critical Oxygen (double)\",\"code\":\"double o2 = 94.85; System.out.println(\\\"O2 PURITY: \\\" + o2 + \\\"%\\\");\",\"preview\":\"O2 PURITY: 94.85%\"}]");
        m2.setLesson(l2);

        PracticeQuestion pq2_1 = new PracticeQuestion(
                m2,
                1,
                "Match the telemetry sensor readings to their appropriate Java data types:",
                "25\n25.5\n\"Alex\"\ntrue",
                "[\"int\", \"double\", \"String\", \"boolean\"]",
                0,
                "In Java: 25 is an int (whole integer), 25.5 is a double (decimal precision), \"Alex\" is a String (text in quotes), and true is a boolean (binary flag)."
        );
        pq2_1.setActivityType("MATCH_CONCEPT");
        pq2_1.setActivityDataJson("{\"pairs\":[{\"item\":\"25\",\"match\":\"int\"},{\"item\":\"25.5\",\"match\":\"double\"},{\"item\":\"\\\"Alex\\\"\",\"match\":\"String\"},{\"item\":\"true\",\"match\":\"boolean\"}]}");
        pq2_1.setHint("Whole numbers use int; decimals use double; quoted words use String; true/false use boolean.");

        PracticeQuestion pq2_2 = new PracticeQuestion(
                m2,
                2,
                "Ship System Diagnostic: Adjust the fuel allocation to reach at least 250 units to charge the warp core:",
                "int fuel = 100;",
                "[\"Set fuel = 250\", \"Set fuel = 50\", \"Set fuel = 0\", \"Set fuel = 100\"]",
                0,
                "Modifying the integer literal changes the stored value held in the variable container in memory."
        );
        pq2_2.setActivityType("CHANGE_VALUE");
        pq2_2.setActivityDataJson("{\"variableName\":\"fuel\",\"initialValue\":100,\"targetValue\":250,\"unit\":\"KG\",\"min\":50,\"max\":500,\"step\":25}");
        pq2_2.setHint("Move the slider or enter 250 to satisfy the warp reactor charge threshold.");

        PracticeQuestion pq2_3 = new PracticeQuestion(
                m2,
                3,
                "Identify the type mismatch bug in this variable initialization:",
                "int fuelReserve = \"100\";",
                "[\"String literal in double quotes cannot be assigned to int\", \"Variable name fuelReserve is invalid\", \"Missing semicolon\", \"int cannot be initialized\"]",
                0,
                "\"100\" enclosed in double quotes is a String object, which cannot be stored directly into a typed integer (int) memory slot without parsing."
        );
        pq2_3.setActivityType("DEBUG_CODE");
        pq2_3.setHint("Check the right hand side: are there double quotes around the number?");

        PracticeQuestion pq2_4 = new PracticeQuestion(
                m2,
                4,
                "Fill in the missing data type to record reactor core temperature with decimal accuracy:",
                "_______ coreTemp = 365.45;",
                "[\"double\", \"int\", \"boolean\", \"String\"]",
                0,
                "`double` is the standard Java primitive type for 64-bit floating-point decimal measurements."
        );
        pq2_4.setActivityType("FILL_CODE");
        pq2_4.setActivityDataJson("{\"blank\":\"_______\",\"correct\":\"double\"}");
        pq2_4.setHint("Which primitive type stores fractional decimal points?");

        m2.getPracticeQuestions().addAll(List.of(pq2_1, pq2_2, pq2_3, pq2_4));

        CodingChallenge cc2 = new CodingChallenge(
                m2,
                "Ship Telemetry Calibration",
                "Declare and initialize the following 4 variables in `Solution.java`:\n" +
                "- `String sector` with value `\"IGNIS-ALPHA\"`\n" +
                "- `int oxygenLevel` with value `95`\n" +
                "- `double coreTemperature` with value `350.5`\n" +
                "- `boolean shieldsActive` with value `true`\n\n" +
                "Then print the exact single-line telemetry report:\n" +
                "`[IGNIS-ALPHA] OXYGEN: 95% | CORE: 350.5C | SHIELDS: true`",
                "public class Solution {\n" +
                "    public static void main(String[] args) {\n" +
                "        // 1. Declare and initialize the 4 telemetry variables\n" +
                "        \n" +
                "        // 2. Print the formatted telemetry report\n" +
                "        \n" +
                "    }\n" +
                "}",
                "public static void main(String[] args)"
        );

        TestCase tc2_1 = new TestCase(cc2, "", "[IGNIS-ALPHA] OXYGEN: 95% | CORE: 350.5C | SHIELDS: true\n", "Verify telemetry report formatting", false);
        TestCase tc2_2 = new TestCase(cc2, "", "[IGNIS-ALPHA] OXYGEN: 95% | CORE: 350.5C | SHIELDS: true\n", "Verify exact variable values and separators", false);
        TestCase tc2_h1 = new TestCase(cc2, "", "[IGNIS-ALPHA] OXYGEN: 95% | CORE: 350.5C | SHIELDS: true\n", "Hidden test: Telemetry string token layout", true);
        TestCase tc2_h2 = new TestCase(cc2, "", "[IGNIS-ALPHA] OXYGEN: 95% | CORE: 350.5C | SHIELDS: true\n", "Hidden test: Verification of boolean and double literal representation", true);
        cc2.getTestCases().addAll(List.of(tc2_1, tc2_2, tc2_h1, tc2_h2));

        Hint h2_1 = new Hint(cc2, 1, "Declare variables as: String sector = \"IGNIS-ALPHA\"; int oxygenLevel = 95; double coreTemperature = 350.5; boolean shieldsActive = true;", 10);
        Hint h2_2 = new Hint(cc2, 2, "Concatenate: System.out.println(\"[\" + sector + \"] OXYGEN: \" + oxygenLevel + \"% | CORE: \" + coreTemperature + \"C | SHIELDS: \" + shieldsActive);", 15);
        cc2.getHints().addAll(List.of(h2_1, h2_2));

        m2.setCodingChallenge(cc2);
        m2 = missionRepository.save(m2);

        // =========================================================================
        // MISSION 3: Receiving Transmissions
        // Narrative: Subspace comms array is intercepting incoming transmission streams from shuttle.
        // Concept: Scanner, reading String, int, double, System.in stdin stream
        // =========================================================================
        Mission m3 = new Mission(
                world1,
                3,
                "Receiving Transmissions",
                "receiving-transmissions",
                "Cadet, the long-range subspace sensor array is intercepting incoming telemetry streams from an approaching reconnaissance shuttle. A starship cannot function on hardcoded numbers alone—it must read dynamic inputs from the universe! In Java, the `Scanner` class bridges the outside world to your program by parsing text and numeric tokens from `System.in`.",
                "Import `java.util.Scanner`, construct a scanner connected to standard input (`System.in`), read the shuttle callsign (String), cargo count (int), and warp beacon frequency (double), and output the formatted docking confirmation.",
                "Scanner & Standard Input Processing (stdin)",
                150,
                3,
                "MEDIUM",
                m2.getId()
        );
        m3.setShipSystem("COMMUNICATION_ARRAY");

        Lesson l3 = new Lesson(
                m3,
                "Capturing Live Data with Scanner",
                "The Scanner class parses primitive types and strings from standard input streams (System.in).",
                "### Why Programs Need Input\n" +
                "Real software is interactive. A starship flight computer receives continuous live sensor data and pilot commands. To process incoming data from the keyboard or an incoming transmission stream, Java uses `java.util.Scanner`.\n\n" +
                "### Setting Up Scanner\n" +
                "To use `Scanner`, you must import it at the top of your file and initialize it with `System.in`:\n" +
                "```java\n" +
                "import java.util.Scanner;\n\n" +
                "public class Solution {\n" +
                "    public static void main(String[] args) {\n" +
                "        Scanner scanner = new Scanner(System.in);\n" +
                "    }\n" +
                "}\n" +
                "```\n\n" +
                "### Reading Tokens by Type\n" +
                "- `scanner.next()`: Reads the next word or token up to whitespace.\n" +
                "- `scanner.nextLine()`: Reads the entire remaining line as a String.\n" +
                "- `scanner.nextInt()`: Parses the next token as an `int`.\n" +
                "- `scanner.nextDouble()`: Parses the next token as a `double`.\n\n" +
                "### Example Transmission Reading\n" +
                "If standard input provides:\n" +
                "`PHOENIX-9 42 108.75`\n" +
                "The tokens can be extracted sequentially in order.",
                "import java.util.Scanner;\n\n" +
                "public class Solution {\n" +
                "    public static void main(String[] args) {\n" +
                "        Scanner scanner = new Scanner(System.in);\n" +
                "        String callsign = scanner.next();\n" +
                "        int pods = scanner.nextInt();\n" +
                "        double freq = scanner.nextDouble();\n" +
                "        \n" +
                "        System.out.println(\"TRANSMISSION LOCKED: \" + callsign);\n" +
                "        System.out.println(\"CARGO: \" + pods + \" | FREQ: \" + freq + \" MHz\");\n" +
                "    }\n" +
                "}",
                "1. Always include `import java.util.Scanner;` before the class declaration.\n" +
                "2. Tokens must be read in the exact order they arrive in the input stream.\n" +
                "3. `scanner.nextInt()` reads only the numeric digits; whitespace and newlines separate tokens."
        );
        l3.setWhyNeeded("A starship cannot survive on hardcoded numbers alone! Flight navigation computers must read live sensor packets, pilot commands, and external beacons streaming in from deep space via standard input (System.in).");
        l3.setVisualRepJson("{\"type\":\"pipeline\",\"title\":\"Subspace Scanner Input Pipeline\",\"nodes\":[{\"label\":\"System.in\",\"role\":\"Raw Data Stream\",\"desc\":\"Incoming bytes from the subspace receiver stream: \\\"TITAN-1 4 1420.5\\\"\"},{\"label\":\"new Scanner(System.in)\",\"role\":\"Stream Tokenizer\",\"desc\":\"Splits input stream on spaces and newlines into readable chunks.\"},{\"label\":\"scanner.next() / nextInt()\",\"role\":\"Typed Harvester\",\"desc\":\"Converts chunks directly into String, int, and double variables.\"}]}");
        l3.setSyntaxBreakdownJson("[{\"keyword\":\"import java.util.Scanner;\",\"meaning\":\"Imports the Scanner utility class from Java's standard library package.\"},{\"keyword\":\"Scanner scanner = new Scanner(System.in);\",\"meaning\":\"Constructs an active listener parsing incoming telemetry from the terminal/keyboard stream.\"},{\"keyword\":\"scanner.next()\",\"meaning\":\"Reads the next word/token as a String up to whitespace.\"},{\"keyword\":\"scanner.nextInt()\",\"meaning\":\"Reads and parses the next token as an integer.\"},{\"keyword\":\"scanner.nextDouble()\",\"meaning\":\"Reads and parses the next token as a 64-bit floating-point decimal.\"}]");
        l3.setCommonMistakesJson("[{\"mistake\":\"Forgetting to import Scanner: Scanner scanner = ...;\",\"consequence\":\"Cannot find symbol: class Scanner\",\"fix\":\"Always add 'import java.util.Scanner;' at the very top of the Java source file.\"},{\"mistake\":\"Reading tokens out of chronological order\",\"consequence\":\"InputMismatchException at runtime\",\"fix\":\"If input arrives as 'CALLSIGN 45', reading nextInt() first will crash because 'CALLSIGN' is not an integer. Read in the exact arriving order.\"},{\"mistake\":\"Forgetting System.in argument: new Scanner()\",\"consequence\":\"No suitable constructor found\",\"fix\":\"Specify the source stream: 'new Scanner(System.in)'.\"}]");
        l3.setInteractiveSnippet("Scanner sc = new Scanner(\"__STREAM__\");\nString beacon = sc.next();\nint crew = sc.nextInt();");
        l3.setInteractiveOptionsJson("[{\"label\":\"Intercept Scout Shuttle\",\"code\":\"Scanner sc = new Scanner(\\\"SCOUT-7 2 840.5\\\"); String beacon = sc.next(); int crew = sc.nextInt(); double freq = sc.nextDouble(); System.out.println(beacon + \\\" | CREW: \\\" + crew + \\\" | \\\" + freq + \\\" GHz\\\");\",\"preview\":\"SCOUT-7 | CREW: 2 | 840.5 GHz\"},{\"label\":\"Intercept Heavy Cargo Carrier\",\"code\":\"Scanner sc = new Scanner(\\\"CARGO-99 18 108.2\\\"); String beacon = sc.next(); int crew = sc.nextInt(); System.out.println(\\\"DOCKING: \\\" + beacon + \\\" (\\\" + crew + \\\" SOULS)\\\");\",\"preview\":\"DOCKING: CARGO-99 (18 SOULS)\"}]");
        m3.setLesson(l3);

        PracticeQuestion pq3_1 = new PracticeQuestion(
                m3,
                1,
                "Fill in the missing method to extract the next integer token from the standard input scanner stream:",
                "int crewCount = scanner._______();",
                "[\"nextInt\", \"readInt\", \"parseInteger\", \"getInt\"]",
                0,
                "`scanner.nextInt()` parses the next whitespace-delimited token from the input stream as an integer."
        );
        pq3_1.setActivityType("FILL_CODE");
        pq3_1.setActivityDataJson("{\"blank\":\"_______\",\"correct\":\"nextInt\"}");
        pq3_1.setHint("Scanner method names start with 'next' followed by the capitalized primitive type.");

        PracticeQuestion pq3_2 = new PracticeQuestion(
                m3,
                2,
                "Predict the console output when input stream contains \"VOYAGER 4 10.5\":",
                "String name = sc.next();\nint count = sc.nextInt();\nSystem.out.println(name + \"-\" + (count * 2));",
                "[\"VOYAGER-8\", \"VOYAGER-4\", \"VOYAGER 8\", \"VOYAGER-42\"]",
                0,
                "name captures \"VOYAGER\", count captures 4. (count * 2) evaluates to 8. The concatenated result is \"VOYAGER-8\"."
        );
        pq3_2.setActivityType("PREDICT_OUTPUT");
        pq3_2.setHint("Check the arithmetic operation inside the parentheses: count * 2 where count is 4.");

        PracticeQuestion pq3_3 = new PracticeQuestion(
                m3,
                3,
                "Identify the critical bug when reading standard input with Scanner:",
                "Scanner sc = new Scanner();\nString callsign = sc.next();",
                "[\"new Scanner() missing System.in parameter\", \"sc.next() is deprecated\", \"callsign cannot be String\", \"Scanner cannot read text\"]",
                0,
                "Scanner must be given the input stream source to read from, such as `new Scanner(System.in)`."
        );
        pq3_3.setActivityType("DEBUG_CODE");
        pq3_3.setHint("What stream connects your Java program to the outside keyboard/terminal?");

        PracticeQuestion pq3_4 = new PracticeQuestion(
                m3,
                4,
                "Short Code Task: Complete the single statement to import Scanner from the java.util library:",
                "_______ java.util.Scanner;",
                "[\"import\", \"include\", \"using\", \"require\"]",
                0,
                "`import java.util.Scanner;` informs the compiler to include the Scanner utility class."
        );
        pq3_4.setActivityType("SHORT_TASK");
        pq3_4.setActivityDataJson("{\"starter\":\"import \",\"expectedKeyword\":\"import\"}");
        pq3_4.setHint("Which Java keyword brings external standard library classes into scope?");

        m3.getPracticeQuestions().addAll(List.of(pq3_1, pq3_2, pq3_3, pq3_4));

        CodingChallenge cc3 = new CodingChallenge(
                m3,
                "Subspace Transmission Decoder",
                "Write a complete Java program that reads 3 tokens from standard input (`System.in`):\n\n" +
                "1. Shuttle Callsign (String)\n" +
                "2. Crew Count (int)\n" +
                "3. Beacon Frequency (double)\n\n" +
                "Print the following two-line docking transmission report:\n" +
                "Line 1: `INCOMING CRAFT: <Callsign>`\n" +
                "Line 2: `CREW: <Crew Count> | BEACON: <Beacon Frequency> GHZ`",
                "import java.util.Scanner;\n\n" +
                "public class Solution {\n" +
                "    public static void main(String[] args) {\n" +
                "        Scanner scanner = new Scanner(System.in);\n" +
                "        // Cadet: Read callsign, crewCount, and frequency from scanner\n" +
                "        \n" +
                "        // Output the two-line docking transmission report\n" +
                "        \n" +
                "    }\n" +
                "}",
                "public static void main(String[] args)"
        );

        // Visible test cases
        TestCase tc3_1 = new TestCase(
                cc3,
                "VALKYRIE-1 6 1420.50\n",
                "INCOMING CRAFT: VALKYRIE-1\nCREW: 6 | BEACON: 1420.5 GHZ\n",
                "Standard scout shuttle telemetry",
                false
        );
        TestCase tc3_2 = new TestCase(
                cc3,
                "TITAN-CORE 120 845.25\n",
                "INCOMING CRAFT: TITAN-CORE\nCREW: 120 | BEACON: 845.25 GHZ\n",
                "Heavy transport shuttle telemetry",
                false
        );

        // Hidden test cases (different callsigns and frequency values to ensure genuine scanner reading)
        TestCase tc3_h1 = new TestCase(
                cc3,
                "GHOST-X 1 99.9\n",
                "INCOMING CRAFT: GHOST-X\nCREW: 1 | BEACON: 99.9 GHZ\n",
                "Hidden single-pilot stealth craft telemetry",
                true
        );
        TestCase tc3_h2 = new TestCase(
                cc3,
                "SOLARIS-PROBE 0 5410.125\n",
                "INCOMING CRAFT: SOLARIS-PROBE\nCREW: 0 | BEACON: 5410.125 GHZ\n",
                "Hidden automated unmanned probe telemetry",
                true
        );
        cc3.getTestCases().addAll(List.of(tc3_1, tc3_2, tc3_h1, tc3_h2));

        Hint h3_1 = new Hint(cc3, 1, "Remember to read in order: String callsign = scanner.next(); int crew = scanner.nextInt(); double freq = scanner.nextDouble();", 10);
        Hint h3_2 = new Hint(cc3, 2, "Print: System.out.println(\"INCOMING CRAFT: \" + callsign); System.out.println(\"CREW: \" + crew + \" | BEACON: \" + freq + \" GHZ\");", 15);
        cc3.getHints().addAll(List.of(h3_1, h3_2));

        m3.setCodingChallenge(cc3);
        m3 = missionRepository.save(m3);

        // =========================================================================
        // MISSION 4: Engine Control
        // Narrative: Orbital maneuvering thrusters require precise mathematical calculations.
        // Concept: Arithmetic operators (+, -, *, /, %), integer division, modulus for cyclical cycles
        // =========================================================================
        Mission m4 = new Mission(
                world1,
                4,
                "Engine Control",
                "engine-control",
                "Ignis Station's orbital station-keeping thrusters need to execute burn calculations before the station's orbit decays into the volcanic dwarf star. Mathematical computations power rocket navigation: velocity deltas, fuel consumption rates, and cyclical engine cooling phases. In Java, arithmetic operators allow the computer to calculate these physics formulas instantaneously.",
                "Use Java arithmetic operators (`+`, `-`, `*`, `/`, `%`) to compute fuel consumed, remaining fuel reserve, full orbital cycles completed, and remainder burn seconds from input telemetry.",
                "Arithmetic Operators & Computational Logic",
                160,
                3,
                "MEDIUM",
                m3.getId()
        );
        m4.setShipSystem("ENGINE_SYSTEM");

        Lesson l4 = new Lesson(
                m4,
                "Arithmetic Calculations & Thruster Dynamics",
                "Java provides five fundamental arithmetic operators: addition, subtraction, multiplication, division, and modulus.",
                "### The Five Basic Operators\n" +
                "1. `+` (Addition): Calculates sums (e.g. `totalFuel = primaryFuel + auxiliaryFuel;`)\n" +
                "2. `-` (Subtraction): Calculates deltas (e.g. `remaining = initial - burned;`)\n" +
                "3. `*` (Multiplication): Scales values (e.g. `thrust = burnRate * burnTime;`)\n" +
                "4. `/` (Division): Divides quantities.\n" +
                "5. `%` (Modulus): Returns the **remainder** after integer division.\n\n" +
                "### The Integer Division Gotcha\n" +
                "In Java, dividing two integers produces an integer result and **truncates** any decimal remainder:\n" +
                "```java\n" +
                "int cycles = 14 / 4;   // Evaluates to 3 (not 3.5!)\n" +
                "```\n" +
                "If you need decimal precision, ensure at least one operand is a `double`:\n" +
                "```java\n" +
                "double burnSec = 14.0 / 4;  // Evaluates to 3.5\n" +
                "```\n\n" +
                "### The Modulus Operator `%`\n" +
                "The modulus operator returns the remainder. This is critical for cyclic thruster pulses and time remainder math:\n" +
                "```java\n" +
                "int remainderSeconds = 14 % 4; // 14 / 4 is 3 with remainder 2\n" +
                "```",
                "public class Solution {\n" +
                "    public static void main(String[] args) {\n" +
                "        int totalFuel = 500;\n" +
                "        int burnRate = 45; // kg per second\n" +
                "        int burnTime = 8;  // seconds\n" +
                "        \n" +
                "        int fuelUsed = burnRate * burnTime;\n" +
                "        int fuelLeft = totalFuel - fuelUsed;\n" +
                "        int cycles = burnTime / 3;\n" +
                "        int remainder = burnTime % 3;\n" +
                "        \n" +
                "        System.out.println(\"FUEL REMAINING: \" + fuelLeft + \" KG\");\n" +
                "        System.out.println(\"CYCLES: \" + cycles + \" | REMAINDER: \" + remainder + \"S\");\n" +
                "    }\n" +
                "}",
                "1. Watch out for integer division: `5 / 2` is `2`, whereas `5.0 / 2` is `2.5`.\n" +
                "2. `%` computes the remainder: `17 % 5` is `2` because `5 * 3 = 15`, leaving `2`.\n" +
                "3. Operator precedence follows standard math: `*`, `/`, and `%` execute before `+` and `-`."
        );
        l4.setWhyNeeded("Station-keeping thrusters must pulse in exact 4-second cycles to prevent orbital decay into the volcanic star. Arithmetic calculations determine how much fuel burns, how many full cycles can run, and the exact leftover remainder seconds.");
        l4.setVisualRepJson("{\"type\":\"math\",\"title\":\"Propulsion Arithmetic & Modulus Calculator\",\"nodes\":[{\"label\":\"burnSeconds * 25\",\"role\":\"Multiplication (*)\",\"desc\":\"Calculates total fuel burned: 14s * 25 kg/s = 350 kg\"},{\"label\":\"initialFuel - fuelUsed\",\"role\":\"Subtraction (-)\",\"desc\":\"Calculates tank reserves remaining: 1000 - 350 = 650 kg\"},{\"label\":\"burnSeconds / 4\",\"role\":\"Integer Division (/)\",\"desc\":\"Calculates full 4s thruster cycles: 14 / 4 = 3 cycles (decimal truncated!)\"},{\"label\":\"burnSeconds % 4\",\"role\":\"Modulus Remainder (%)\",\"desc\":\"Calculates remaining pulse time: 14 % 4 = 2 seconds left over\"}]}");
        l4.setSyntaxBreakdownJson("[{\"keyword\":\"+\",\"meaning\":\"Addition: combines quantities.\"},{\"keyword\":\"-\",\"meaning\":\"Subtraction: finds deltas and remaining resources.\"},{\"keyword\":\"*\",\"meaning\":\"Multiplication: scales burn rates across duration.\"},{\"keyword\":\"/ (Integer Division)\",\"meaning\":\"When both operands are integers, divides and discards fractional parts.\"},{\"keyword\":\"% (Modulus)\",\"meaning\":\"Returns the integer remainder of division (e.g. 14 % 4 = 2).\"}]");
        l4.setCommonMistakesJson("[{\"mistake\":\"Assuming 5 / 2 produces 2.5: int result = 5 / 2;\",\"consequence\":\"Result is 2 (truncated)\",\"fix\":\"In Java, dividing two integers always yields an integer. To get decimals, at least one number must be a double: 5.0 / 2.\"},{\"mistake\":\"Confusing / and %\",\"consequence\":\"Computing quotients instead of remainders\",\"fix\":\"'/' computes how many whole times the divisor fits; '%' computes the remainder left behind.\"},{\"mistake\":\"Division by zero: int x = fuel / 0;\",\"consequence\":\"ArithmeticException: / by zero at runtime\",\"fix\":\"Always ensure divisors are strictly non-zero.\"}]");
        l4.setInteractiveSnippet("int totalSeconds = __SECONDS__;\nint fullCycles = totalSeconds / 4;\nint remainder = totalSeconds % 4;");
        l4.setInteractiveOptionsJson("[{\"label\":\"14-Second Burn\",\"code\":\"int total = 14; int cycles = total / 4; int rem = total % 4; System.out.println(\\\"CYCLES: \\\" + cycles + \\\" | REMAINDER: \\\" + rem + \\\"S\\\");\",\"preview\":\"CYCLES: 3 | REMAINDER: 2S\"},{\"label\":\"20-Second Burn (Clean Divisible)\",\"code\":\"int total = 20; int cycles = total / 4; int rem = total % 4; System.out.println(\\\"CYCLES: \\\" + cycles + \\\" | REMAINDER: \\\" + rem + \\\"S\\\");\",\"preview\":\"CYCLES: 5 | REMAINDER: 0S\"},{\"label\":\"3-Second Burn (Sub-cycle)\",\"code\":\"int total = 3; int cycles = total / 4; int rem = total % 4; System.out.println(\\\"CYCLES: \\\" + cycles + \\\" | REMAINDER: \\\" + rem + \\\"S\\\");\",\"preview\":\"CYCLES: 0 | REMAINDER: 3S\"}]");
        m4.setLesson(l4);

        PracticeQuestion pq4_1 = new PracticeQuestion(
                m4,
                1,
                "Predict the output of the orbital thruster cycle calculation:",
                "int totalSeconds = 14;\nint cycles = totalSeconds / 4;\nint remainder = totalSeconds % 4;\nSystem.out.println(cycles + \" cycles, \" + remainder + \"s rem\");",
                "[\"3 cycles, 2s rem\", \"3.5 cycles, 0s rem\", \"4 cycles, 2s rem\", \"3 cycles, 0s rem\"]",
                0,
                "In integer division, 14 / 4 truncates the decimal and evaluates to 3. Modulus 14 % 4 yields the remainder 2.",
                "PREDICT_OUTPUT",
                "{\"language\":\"java\",\"expectedType\":\"string\"}",
                "Remember: Integer division drops any fraction (.5 is discarded). Modulus gives what is left over."
        );

        PracticeQuestion pq4_2 = new PracticeQuestion(
                m4,
                2,
                "Thruster Calibration: Adjust the burn duration from 10 to 18 seconds and observe the fuel consumption:",
                "int burnSeconds = 10;\nint fuelBurned = burnSeconds * 25;\nSystem.out.println(\"Burned: \" + fuelBurned + \" kg\");",
                "[\"450 kg\", \"250 kg\", \"180 kg\", \"350 kg\"]",
                0,
                "At 18 seconds, 18 * 25 kg/s burns 450 kg of thruster propellant.",
                "CHANGE_VALUE",
                "{\"variable\":\"burnSeconds\",\"initialValue\":10,\"targetValue\":18,\"unit\":\"seconds\",\"gaugeLabel\":\"Thruster Fuel Consumed\",\"multiplier\":25,\"gaugeMax\":600,\"targetOutput\":\"Burned: 450 kg\"}",
                "Drag the thruster duration slider to 18 seconds and observe the propellant burn meter."
        );

        PracticeQuestion pq4_3 = new PracticeQuestion(
                m4,
                3,
                "Identify and debug the arithmetic bug in this fuel velocity calculation:",
                "int totalFuel = 500;\nint burnRate = 0; // sensor uncalibrated\nint duration = totalFuel / burnRate;",
                "[\"ArithmeticException: / by zero at runtime\", \"Syntax error: cannot divide integers\", \"duration will be null\", \"burnRate cannot be 0 in Java\"]",
                0,
                "In Java, dividing an integer by zero throws a runtime ArithmeticException (/ by zero). Divisors must always be non-zero.",
                "DEBUG_CODE",
                "{\"buggyLine\":3,\"errorType\":\"Runtime ArithmeticException\",\"fix\":\"Ensure burnRate is calibrated (> 0) before dividing.\"}",
                "Look closely at the divisor `burnRate` on line 3. What mathematical operation is illegal in integer arithmetic?"
        );

        PracticeQuestion pq4_4 = new PracticeQuestion(
                m4,
                4,
                "Complete the code to calculate the remaining seconds using the modulus operator:",
                "int burnDuration = 22;\nint leftoverSeconds = burnDuration ___ 5;",
                "[\"%\", \"/\", \"//\", \"mod\"]",
                0,
                "The `%` operator computes the remainder of integer division in Java (22 % 5 = 2).",
                "FILL_CODE",
                "{\"blankLabel\":\"leftoverSeconds = burnDuration [?] 5\",\"correctToken\":\"%\",\"options\":[\"%\",\"/\",\"//\",\"mod\"]}",
                "Recall the symbol Java uses for remainder division."
        );
        m4.getPracticeQuestions().addAll(List.of(pq4_1, pq4_2, pq4_3, pq4_4));

        CodingChallenge cc4 = new CodingChallenge(
                m4,
                "Thruster Burn & Cycle Calculator",
                "Write a complete Java program in `Solution.java` that reads two integers from standard input (`System.in`):\n" +
                "1. `initialFuel` (total fuel available in kg)\n" +
                "2. `burnSeconds` (total burn duration in seconds)\n\n" +
                "Given that the engine consumes **25 kg** of fuel per second, and each full thruster cycle lasts **4 seconds**:\n" +
                "- Calculate `fuelUsed = burnSeconds * 25`\n" +
                "- Calculate `remainingFuel = initialFuel - fuelUsed`\n" +
                "- Calculate `fullCycles = burnSeconds / 4`\n" +
                "- Calculate `remainderSeconds = burnSeconds % 4`\n\n" +
                "Print the diagnostic report in this exact two-line format:\n" +
                "Line 1: `FUEL CONSUMED: <fuelUsed> KG | REMAINING: <remainingFuel> KG`\n" +
                "Line 2: `FULL CYCLES: <fullCycles> | PHASE REMAINDER: <remainderSeconds>S`",
                "import java.util.Scanner;\n\n" +
                "public class Solution {\n" +
                "    public static void main(String[] args) {\n" +
                "        Scanner scanner = new Scanner(System.in);\n" +
                "        int initialFuel = scanner.nextInt();\n" +
                "        int burnSeconds = scanner.nextInt();\n" +
                "        \n" +
                "        // Cadet: Calculate fuel and thruster cycle telemetry\n" +
                "        \n" +
                "        // Print the two-line propulsion report\n" +
                "        \n" +
                "    }\n" +
                "}",
                "public static void main(String[] args)"
        );

        // Visible test cases
        TestCase tc4_1 = new TestCase(
                cc4,
                "1000 14\n",
                "FUEL CONSUMED: 350 KG | REMAINING: 650 KG\nFULL CYCLES: 3 | PHASE REMAINDER: 2S\n",
                "Standard 14-second burn calculation",
                false
        );
        TestCase tc4_2 = new TestCase(
                cc4,
                "500 20\n",
                "FUEL CONSUMED: 500 KG | REMAINING: 0 KG\nFULL CYCLES: 5 | PHASE REMAINDER: 0S\n",
                "Exact depletion with 0 remainder cycle",
                false
        );

        // Hidden test cases
        TestCase tc4_h1 = new TestCase(
                cc4,
                "2500 35\n",
                "FUEL CONSUMED: 875 KG | REMAINING: 1625 KG\nFULL CYCLES: 8 | PHASE REMAINDER: 3S\n",
                "Hidden large tank thruster maneuver",
                true
        );
        TestCase tc4_h2 = new TestCase(
                cc4,
                "800 3\n",
                "FUEL CONSUMED: 75 KG | REMAINING: 725 KG\nFULL CYCLES: 0 | PHASE REMAINDER: 3S\n",
                "Hidden sub-cycle burn check",
                true
        );
        cc4.getTestCases().addAll(List.of(tc4_1, tc4_2, tc4_h1, tc4_h2));

        Hint h4_1 = new Hint(cc4, 1, "int fuelUsed = burnSeconds * 25; int remainingFuel = initialFuel - fuelUsed;", 10);
        Hint h4_2 = new Hint(cc4, 2, "int fullCycles = burnSeconds / 4; int remainderSeconds = burnSeconds % 4;", 15);
        cc4.getHints().addAll(List.of(h4_1, h4_2));

        m4.setCodingChallenge(cc4);
        m4 = missionRepository.save(m4);

        // =========================================================================
        // MISSION 5: BOSS MISSION — THE REACTOR FAILURE
        // Narrative: Complete containment breach! Ignis Station reactor core is cascading at 18% power.
        // Concept: Grand Capstone synthesis: Java basics, variables, input, operators, conditions
        // =========================================================================
        Mission m5 = new Mission(
                world1,
                5,
                "BOSS: The Reactor Failure",
                "the-reactor-failure",
                "RED ALERT! The primary fusion containment field has collapsed! Core power is cascading down to 18%. Cadet, everything you've learned so far is required: basic class structure, variable declaration, scanner telemetry input, arithmetic operator calculations, and conditional logic gates. You must write the Reactor Containment Program to avert a total station meltdown!",
                "Combine Java basics, variables, Scanner input, arithmetic calculations, and conditional branching to stabilize the core and restore power from 18% to 100%.",
                "Comprehensive Java Synthesis (Basics + Variables + Input + Operators + Conditions)",
                300,
                3,
                "BOSS",
                m4.getId()
        );
        m5.setShipSystem("POWER_CORE");
        m5.setIsBossMission(true);

        Lesson l5 = new Lesson(
                m5,
                "Boss Protocol: Reactor Containment Architecture",
                "Comprehensive synthesis combining all 5 foundational Java constructs into an autonomous system controller.",
                "### The Reactor Meltdown Crisis\n" +
                "The core reactor is fluctuating uncontrollably. To prevent catastrophic failure, your program must orchestrate all 5 Java competencies:\n\n" +
                "1. **Java Basics**: A valid class and `public static void main(String[] args)` executable entrance.\n" +
                "2. **Scanner Input**: Reading real-time telemetry parameters: `corePower` (int), `coolantReserve` (int), and `thermalTemp` (double).\n" +
                "3. **Variables**: Storing and managing reactor state in memory.\n" +
                "4. **Operators**: Calculating burn formulas, power adjustments, and coolant ratios: `int powerDeficit = 100 - corePower;`\n" +
                "5. **Conditions**: Evaluating stability thresholds using `if`, `else if`, `else` with logical (`&&`, `||`) operators.",
                "import java.util.Scanner;\n\n" +
                "public class Solution {\n" +
                "    public static void main(String[] args) {\n" +
                "        Scanner scanner = new Scanner(System.in);\n" +
                "        int corePower = scanner.nextInt();\n" +
                "        int coolant = scanner.nextInt();\n" +
                "        \n" +
                "        int deficit = 100 - corePower;\n" +
                "        if (corePower < 50 || coolant < 20) {\n" +
                "            System.out.println(\"CONTAINMENT: EMERGENCY FLOOD - DEFICIT \" + deficit);\n" +
                "        } else if (coolant < 50) {\n" +
                "            System.out.println(\"CONTAINMENT: AUXILIARY PUMP - DEFICIT \" + deficit);\n" +
                "        } else {\n" +
                "            System.out.println(\"CONTAINMENT: NOMINAL RESTORATION - DEFICIT \" + deficit);\n" +
                "        }\n" +
                "        scanner.close();\n" +
                "    }\n" +
                "}",
                "1. Syntax Check: Verify that Scanner is imported, semicolons terminate each statement, and braces match.\n" +
                "2. Operator Check: Verify that deficit formulas and condition checks use proper arithmetic and logical operators.\n" +
                "3. Logic Check: Test emergency edge cases first, followed by intermediate warnings, ending with nominal stabilization."
        );
        l5.setWhyNeeded("In a real starship crisis, isolated single-variable problems do not exist. Engineering systems require simultaneous input reading, mathematical balance calculations, and multi-tier logical gating.");
        l5.setVisualRepJson("{\"type\":\"boss_synthesis\",\"title\":\"Reactor Core Containment Synthesis\",\"components\":[{\"step\":\"1. JVM Entry\",\"desc\":\"public static void main entrypoint\"},{\"step\":\"2. Telemetry Scanner\",\"desc\":\"Scanner(System.in) reading corePower & coolant\"},{\"step\":\"3. State Variables\",\"desc\":\"int deficit = 100 - corePower\"},{\"step\":\"4. Hazard Conditions\",\"desc\":\"if (corePower < 50 || coolant < 20)\"}]}");
        l5.setSyntaxBreakdownJson("[{\"keyword\":\"import java.util.Scanner\",\"meaning\":\"Imports standard input telemetry utility.\"},{\"keyword\":\"int deficit = 100 - corePower\",\"meaning\":\"Calculates power required to achieve 100% full reactor stabilization.\"},{\"keyword\":\"corePower < 50 || coolant < 20\",\"meaning\":\"Emergency check: triggers when either power is critically low or coolant is depleted.\"},{\"keyword\":\"else if (coolant < 50)\",\"meaning\":\"Secondary caution check when power is acceptable but coolant is limited.\"},{\"keyword\":\"else\",\"meaning\":\"Stabilization clearance: full containment restored.\"}]");
        l5.setCommonMistakesJson("[{\"mistake\":\"Forgetting to import Scanner\",\"consequence\":\"Cannot find symbol: class Scanner\",\"fix\":\"Include 'import java.util.Scanner;' at the very top of Solution.java.\"},{\"mistake\":\"Using single = instead of == or missing parenthesis\",\"consequence\":\"Syntax and compilation errors\",\"fix\":\"Ensure condition syntax is enclosed in ( ) and comparison uses relational operators.\"},{\"mistake\":\"Failing to include the deficit in the exact required output string\",\"consequence\":\"Wrong output comparison test failure\",\"fix\":\"Check output format carefully: match spaces, uppercase letters, and variable concatenation.\"}]");
        l5.setInteractiveSnippet("int corePower = 18;\nint coolant = 60;\nint deficit = 100 - corePower;\nSystem.out.println(\"DEFICIT: \" + deficit);");
        l5.setInteractiveOptionsJson("[{\"label\":\"Simulate Critical Meltdown (18% Power, 15 Coolant)\",\"code\":\"int p = 18; int c = 15; int def = 100 - p; if (p < 50 || c < 20) { System.out.println(\\\"REACTOR: EMERGENCY FLOOD - DEFICIT \\\" + def); }\",\"preview\":\"REACTOR: EMERGENCY FLOOD - DEFICIT 82\"},{\"label\":\"Simulate Low Coolant Warning (60% Power, 35 Coolant)\",\"code\":\"int p = 60; int c = 35; int def = 100 - p; if (p < 50 || c < 20) { System.out.println(\\\"EMERGENCY\\\"); } else if (c < 50) { System.out.println(\\\"REACTOR: AUXILIARY PUMP - DEFICIT \\\" + def); }\",\"preview\":\"REACTOR: AUXILIARY PUMP - DEFICIT 40\"},{\"label\":\"Simulate Full Stabilization (85% Power, 90 Coolant)\",\"code\":\"int p = 85; int c = 90; int def = 100 - p; System.out.println(\\\"REACTOR: NOMINAL STABILIZATION - DEFICIT \\\" + def);\",\"preview\":\"REACTOR: NOMINAL STABILIZATION - DEFICIT 15\"}]");
        m5.setLesson(l5);

        PracticeQuestion pq5_1 = new PracticeQuestion(
                m5,
                1,
                "Predict the output of the reactor deficit formula when core power is at 18%:",
                "int corePower = 18;\nint deficit = 100 - corePower;\nSystem.out.println(\"DEFICIT: \" + deficit);",
                "[\"DEFICIT: 82\", \"DEFICIT: 18\", \"DEFICIT: 100\", \"DEFICIT: 72\"]",
                0,
                "100 - 18 = 82. The console prints 'DEFICIT: 82'.",
                "PREDICT_OUTPUT",
                "{\"language\":\"java\",\"expectedType\":\"string\"}",
                "Subtract the current power level from the 100% target."
        );

        PracticeQuestion pq5_2 = new PracticeQuestion(
                m5,
                2,
                "Locate the bug in this multi-condition emergency reactor gate:",
                "int corePower = 18;\nint coolant = 10;\nif corePower < 50 || coolant < 20 {\n    System.out.println(\"MELTDOWN IMMINENT\");\n}",
                "[\"Missing parentheses around the if condition: if (corePower < 50 || coolant < 20)\", \"Cannot use || in Java\", \"corePower must be a double\", \"Variables cannot be evaluated together\"]",
                0,
                "In Java, every if statement condition must be enclosed in parentheses `( )`.",
                "DEBUG_CODE",
                "{\"buggyLine\":3,\"fix\":\"Add parentheses: if (corePower < 50 || coolant < 20)\"}",
                "Check the syntax immediately following the `if` keyword."
        );

        PracticeQuestion pq5_3 = new PracticeQuestion(
                m5,
                3,
                "Match each foundational Java component to its tactical role in the Reactor Controller:",
                null,
                "[]",
                0,
                "Class blueprint wraps components; Scanner reads sensors; int stores values; if/else gates decisions.",
                "MATCH_CONCEPT",
                "{\"pairs\":[{\"left\":\"public class Solution\",\"right\":\"Ship Hull Blueprint\"},{\"left\":\"Scanner(System.in)\",\"right\":\"Sensor Telemetry Feed\"},{\"left\":\"int corePower = 18;\",\"right\":\"Reactor Memory State\"},{\"left\":\"if / else if / else\",\"right\":\"Emergency Decision Gates\"}]}",
                "Connect the Java language feature to its starship system role."
        );

        PracticeQuestion pq5_4 = new PracticeQuestion(
                m5,
                4,
                "Fill in the missing logical operator so emergency flood triggers if power is under 50 OR coolant is under 20:",
                "if (corePower < 50 __ coolant < 20) {\n    System.out.println(\"EMERGENCY FLOOD\");\n}",
                "[\"||\", \"&&\", \"!=\", \"==\"]",
                0,
                "The logical OR operator `||` evaluates to true if either condition is true.",
                "FILL_CODE",
                "{\"blankLabel\":\"if (corePower < 50 [?] coolant < 20)\",\"correctToken\":\"||\",\"options\":[\"||\",\"&&\",\"!=\",\"==\"]}",
                "Use the double pipe symbol (`||`) for logical OR."
        );
        m5.getPracticeQuestions().addAll(List.of(pq5_1, pq5_2, pq5_3, pq5_4));

        CodingChallenge cc5 = new CodingChallenge(
                m5,
                "Boss Challenge: The Reactor Failure",
                "Write a complete Java program in `Solution.java` that reads two integers from standard input (`System.in`):\n" +
                "1. `corePower` (current reactor core power percentage, e.g. 18)\n" +
                "2. `coolantReserve` (coolant reservoir percentage, e.g. 15)\n\n" +
                "Calculate `int deficit = 100 - corePower;` and evaluate reactor stability:\n" +
                "- If `corePower < 50` **OR** `coolantReserve < 20`, print:\n  `REACTOR: EMERGENCY FLOOD - DEFICIT [deficit]`\n" +
                "- Otherwise, if `coolantReserve < 50`, print:\n  `REACTOR: AUXILIARY PUMP - DEFICIT [deficit]`\n" +
                "- Otherwise (corePower >= 50 and coolantReserve >= 50), print:\n  `REACTOR: NOMINAL STABILIZATION - DEFICIT [deficit]`\n\n" +
                "Example: For `18 15`, output: `REACTOR: EMERGENCY FLOOD - DEFICIT 82`",
                "import java.util.Scanner;\n\n" +
                "public class Solution {\n" +
                "    public static void main(String[] args) {\n" +
                "        Scanner scanner = new Scanner(System.in);\n" +
                "        int corePower = scanner.nextInt();\n" +
                "        int coolantReserve = scanner.nextInt();\n" +
                "        \n" +
                "        // Cadet: Calculate deficit (100 - corePower) and stabilize the reactor!\n" +
                "        \n" +
                "    }\n" +
                "}",
                "public static void main(String[] args)"
        );

        // Visible test cases
        TestCase tc5_1 = new TestCase(
                cc5,
                "18 15\n",
                "REACTOR: EMERGENCY FLOOD - DEFICIT 82\n",
                "Visible Test 1: Reactor Failure Cascade (18% power breach)",
                false
        );
        TestCase tc5_2 = new TestCase(
                cc5,
                "85 90\n",
                "REACTOR: NOMINAL STABILIZATION - DEFICIT 15\n",
                "Visible Test 2: Full core stabilization with ample coolant",
                false
        );

        // Multiple Hidden test cases
        TestCase tc5_h1 = new TestCase(
                cc5,
                "60 35\n",
                "REACTOR: AUXILIARY PUMP - DEFICIT 40\n",
                "Hidden Test 1: Adequate power but low coolant reserve",
                true
        );
        TestCase tc5_h2 = new TestCase(
                cc5,
                "45 80\n",
                "REACTOR: EMERGENCY FLOOD - DEFICIT 55\n",
                "Hidden Test 2: High coolant but critical sub-50% power breach",
                true
        );
        TestCase tc5_h3 = new TestCase(
                cc5,
                "50 50\n",
                "REACTOR: NOMINAL STABILIZATION - DEFICIT 50\n",
                "Hidden Test 3: Exact nominal threshold boundary (50% power & 50% coolant)",
                true
        );
        TestCase tc5_h4 = new TestCase(
                cc5,
                "10 5\n",
                "REACTOR: EMERGENCY FLOOD - DEFICIT 90\n",
                "Hidden Test 4: Extreme dual-meltdown conditions",
                true
        );
        cc5.getTestCases().addAll(List.of(tc5_1, tc5_2, tc5_h1, tc5_h2, tc5_h3, tc5_h4));

        Hint h5_1 = new Hint(cc5, 1, "Calculate deficit first: int deficit = 100 - corePower;", 10);
        Hint h5_2 = new Hint(cc5, 2, "Check emergency triggers using ||: if (corePower < 50 || coolantReserve < 20)", 15);
        Hint h5_3 = new Hint(cc5, 3, "Follow with else if (coolantReserve < 50), and conclude with else for nominal stabilization.", 20);
        cc5.getHints().addAll(List.of(h5_1, h5_2, h5_3));

        m5.setCodingChallenge(cc5);
        m5 = missionRepository.save(m5);

        // 3. Create World 2: KRYON BELT (Locked by default, unlocked upon World 1 completion)
        World world2 = new World(
                course,
                2,
                "kryon-belt",
                "WORLD 2 — KRYON BELT",
                "Glacial Sub-Zero Asteroid Barrier",
                "A dense belt of frozen methane asteroids and sub-zero orbital stations. Cadets learn conditional branching, switch controls, and nested logic to steer shield deflector arrays through navigational hazard fields.",
                false
        );
        world2 = worldRepository.save(world2);

        // =========================================================================
        // WORLD 2 - MISSION 1: Thermal Deflector Switch
        // Topic: switch statement / branching on integer/string mode
        // =========================================================================
        Mission w2m1 = new Mission(
                world2,
                1,
                "Thermal Deflector Switch",
                "thermal-deflector-switch",
                "Voyager-1 has cleared Ignis Station and crossed into the sub-zero permafrost of the Kryon Asteroid Belt. Drifting cryogenic frost storms threaten to freeze exterior sensors unless shield deflectors switch rapidly between specialized thermal modes. Cadets must implement Java switch statements to route defensive power based on mode identifiers.",
                "Read an integer defense code (1, 2, 3) from standard input and use a switch statement to output the corresponding shield configuration.",
                "Conditional Branching & Switch Statements",
                140,
                3,
                "EASY",
                m5.getId()
        );
        w2m1.setShipSystem("SHIELD_SYSTEM");

        Lesson w2l1 = new Lesson(
                w2m1,
                "Multi-Branch Control with Switch Statements",
                "The switch statement routes program execution to one of multiple code paths based on the evaluated expression.",
                "### Why Switch Statements?\n" +
                "When your ship system needs to choose between multiple distinct modes, writing repetitive `if-else` chains becomes cluttered. A `switch` block compares a variable against candidate `case` values cleanly.\n\n" +
                "### Basic Switch Syntax\n" +
                "```java\n" +
                "switch (code) {\n" +
                "    case 1:\n" +
                "        System.out.println(\"MODE ALPHA\");\n" +
                "        break;\n" +
                "    case 2:\n" +
                "        System.out.println(\"MODE BETA\");\n" +
                "        break;\n" +
                "    default:\n" +
                "        System.out.println(\"UNKNOWN MODE\");\n" +
                "        break;\n" +
                "}\n" +
                "```\n" +
                "Remember the `break` statement prevents fall-through to subsequent cases!",
                "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int mode = scanner.nextInt();\n        switch (mode) {\n            case 1 -> System.out.println(\"DEFLECTOR: THERMAL FLARE\");\n            case 2 -> System.out.println(\"DEFLECTOR: CRYO BARRIER\");\n            case 3 -> System.out.println(\"DEFLECTOR: KINETIC PULSE\");\n            default -> System.out.println(\"DEFLECTOR: OFFLINE\");\n        }\n    }\n}",
                "[\"A switch matches a single selector expression against multiple case labels.\", \"The default clause executes if no matching case is found.\", \"Always handle unexpected inputs safely.\"]"
        );
        w2l1.setWhyNeeded("Automates rapid starship defensive reconfiguration without cumbersome nested branches.");
        w2m1.setLesson(w2l1);

        PracticeQuestion w2pq1_1 = new PracticeQuestion(
                w2m1,
                1,
                "Which statement is used inside a switch case block to prevent falling through to the next case in traditional Java syntax?",
                "[\"exit;\", \"break;\", \"stop;\", \"return 0;\"]",
                "[\"exit;\", \"break;\", \"stop;\", \"return 0;\"]",
                1,
                "The break statement exits the switch construct immediately."
        );
        w2pq1_1.setActivityType("MULTIPLE_CHOICE");
        w2m1.getPracticeQuestions().add(w2pq1_1);

        CodingChallenge w2cc1 = new CodingChallenge(
                w2m1,
                "Deflector Matrix Mode Selector",
                "Write a complete Java program in class `Solution` that reads an integer `mode` from standard input (1, 2, or 3) and outputs the defensive status:\n\n- If `1`: print `SHIELD MODE: THERMAL FLARE`\n- If `2`: print `SHIELD MODE: CRYO DISSIPATOR`\n- If `3`: print `SHIELD MODE: KINETIC ABSORBER`\n- For any other input: print `SHIELD MODE: CALIBRATION FAULT`\n\nEnsure exact capitalization and formatting.",
                "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Cadet: Read mode and implement the switch block\n        \n    }\n}",
                "public static void main(String[] args)"
        );

        TestCase w2tc1_1 = new TestCase(w2cc1, "1\n", "SHIELD MODE: THERMAL FLARE\n", "Mode 1: Thermal Flare", false);
        TestCase w2tc1_2 = new TestCase(w2cc1, "2\n", "SHIELD MODE: CRYO DISSIPATOR\n", "Mode 2: Cryo Dissipator", false);
        TestCase w2tc1_h1 = new TestCase(w2cc1, "3\n", "SHIELD MODE: KINETIC ABSORBER\n", "Mode 3: Kinetic Absorber", true);
        TestCase w2tc1_h2 = new TestCase(w2cc1, "9\n", "SHIELD MODE: CALIBRATION FAULT\n", "Default fallback for unknown code", true);
        w2cc1.getTestCases().addAll(List.of(w2tc1_1, w2tc1_2, w2tc1_h1, w2tc1_h2));

        Hint w2h1_1 = new Hint(w2cc1, 1, "Use `int mode = scanner.nextInt();` to read the integer from input.", 10);
        Hint w2h1_2 = new Hint(w2cc1, 2, "Use `switch (mode) { case 1: ... break; case 2: ... break; case 3: ... break; default: ... break; }`.", 15);
        w2cc1.getHints().addAll(List.of(w2h1_1, w2h1_2));

        w2m1.setCodingChallenge(w2cc1);
        w2m1 = missionRepository.save(w2m1);

        // =========================================================================
        // WORLD 2 - MISSION 2: Ice Shield Resonance
        // Topic: Nested if/else and compound boolean logic (&&, ||, !)
        // =========================================================================
        Mission w2m2 = new Mission(
                world2,
                2,
                "Ice Shield Resonance",
                "ice-shield-resonance",
                "Frozen methane shards impact the outer hull at hyperspeeds. The deflection matrix requires monitoring two telemetry signals simultaneously: shield resonance frequency (Hz) and hull stress percentage. Both values must stay within critical ranges to avoid hull fractures.",
                "Read frequency (int) and hull stress (int). Apply compound conditions to determine safe navigation status.",
                "Compound Booleans & Nested Decisions",
                160,
                3,
                "MEDIUM",
                w2m1.getId()
        );
        w2m2.setShipSystem("HULL_INTEGRITY");

        Lesson w2l2 = new Lesson(
                w2m2,
                "Compound Boolean Evaluation & Guard Clauses",
                "Combine conditions using logical AND (&&) and logical OR (||) to assess complex starship statuses.",
                "### Compound Operators\n" +
                "- `&&` (Logical AND): true only when both operands evaluate to true.\n" +
                "- `||` (Logical OR): true when at least one operand evaluates to true.\n" +
                "- `!` (Logical NOT): inverts the boolean truth value.\n\n" +
                "### Guarding Against Critical Hull Breach\n" +
                "```java\n" +
                "if (frequency >= 400 && frequency <= 600) {\n" +
                "    if (stress < 75) {\n" +
                "        System.out.println(\"STATUS: RESONANCE STABLE\");\n" +
                "    }\n" +
                "}\n" +
                "```",
                "public class Solution {\n    public static void main(String[] args) {\n        int freq = 500;\n        int stress = 45;\n        if (freq >= 400 && freq <= 600 && stress < 70) {\n            System.out.println(\"STATUS: RESONANCE NOMINAL\");\n        }\n    }\n}",
                "[\"&& requires all sub-conditions to be true.\", \"|| requires only one sub-condition to be true.\", \"Use parentheses to make evaluation order unambiguous.\"]"
        );
        w2l2.setWhyNeeded("Prevents false-alarm shield overloads and ensures starship survival in dense debris.");
        w2m2.setLesson(w2l2);

        CodingChallenge w2cc2 = new CodingChallenge(
                w2m2,
                "Resonance Threshold Guardian",
                "Write a complete Java program in class `Solution` that reads two integers from standard input: `frequency` and `stress`.\n\n- If `frequency >= 400 && frequency <= 600` AND `stress <= 70`: print `HULL: RESONANCE NOMINAL`\n- If `stress > 70`: print `HULL: CRITICAL OVERSTRESS`\n- Otherwise: print `HULL: FREQUENCY DRIFT`\n\nEnsure exact capitalization and spacing.",
                "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int frequency = scanner.nextInt();\n        int stress = scanner.nextInt();\n        \n        // Cadet: Implement resonance gating\n    }\n}",
                "public static void main(String[] args)"
        );

        TestCase w2tc2_1 = new TestCase(w2cc2, "500 50\n", "HULL: RESONANCE NOMINAL\n", "Nominal conditions within frequency band and safe stress", false);
        TestCase w2tc2_2 = new TestCase(w2cc2, "550 85\n", "HULL: CRITICAL OVERSTRESS\n", "Critical overstress condition (> 70)", false);
        TestCase w2tc2_h1 = new TestCase(w2cc2, "200 40\n", "HULL: FREQUENCY DRIFT\n", "Frequency drift outside [400, 600]", true);
        TestCase w2tc2_h2 = new TestCase(w2cc2, "600 70\n", "HULL: RESONANCE NOMINAL\n", "Exact boundary test (freq=600, stress=70)", true);
        w2cc2.getTestCases().addAll(List.of(w2tc2_1, w2tc2_2, w2tc2_h1, w2tc2_h2));

        Hint w2h2_1 = new Hint(w2cc2, 1, "Check `stress > 70` either first or in an `else if` branch carefully.", 10);
        Hint w2h2_2 = new Hint(w2cc2, 2, "If `stress <= 70`, check if `frequency >= 400 && frequency <= 600`.", 15);
        w2cc2.getHints().addAll(List.of(w2h2_1, w2h2_2));

        w2m2.setCodingChallenge(w2cc2);
        w2m2 = missionRepository.save(w2m2);

        // =========================================================================
        // WORLD 2 - MISSION 3: Sub-Zero Thruster Gating
        // Topic: Ternary operator & boolean expressions
        // =========================================================================
        Mission w2m3 = new Mission(
                world2,
                3,
                "Sub-Zero Thruster Gating",
                "sub-zero-thruster-gating",
                "Navigating through dense asteroid lanes requires instant thruster impulse firing. Calculating thruster impulse vectors using compact inline logic minimizes decision latency in the starship computer.",
                "Read engine temperature (int) and calculate the propulsion output state using compact boolean conditional expressions.",
                "Ternary Operator & Inline Logic",
                170,
                3,
                "MEDIUM",
                w2m2.getId()
        );
        w2m3.setShipSystem("PROPULSION_CORE");

        Lesson w2l3 = new Lesson(
                w2m3,
                "Compact Logic with the Ternary Operator",
                "The conditional ternary operator (`condition ? valueIfTrue : valueIfFalse`) produces concise inline assignment expressions.",
                "### Ternary Operator Syntax\n" +
                "Instead of 4 lines of `if/else`:\n" +
                "```java\n" +
                "String status;\n" +
                "if (temp >= 100) {\n" +
                "    status = \"HOT\";\n" +
                "} else {\n" +
                "    status = \"COLD\";\n" +
                "}\n" +
                "```\n" +
                "Write it in a single line:\n" +
                "```java\n" +
                "String status = (temp >= 100) ? \"HOT\" : \"COLD\";\n" +
                "```",
                "public class Solution {\n    public static void main(String[] args) {\n        int temp = 85;\n        String impulse = (temp >= 80) ? \"BURST\" : \"IDLE\";\n        System.out.println(impulse);\n    }\n}",
                "[\"The ternary operator is an expression that yields a value.\", \"Syntax: (condition) ? trueValue : falseValue.\", \"Keep ternaries simple for maximum code clarity.\"]"
        );
        w2l3.setWhyNeeded("Enables real-time impulse throttling without multi-line branching overhead.");
        w2m3.setLesson(w2l3);

        CodingChallenge w2cc3 = new CodingChallenge(
                w2m3,
                "Impulse Vector Calculator",
                "Write a complete Java program in class `Solution` that reads an integer `temp` and an integer `targetThrust`.\n\nCalculate the output vector:\n- If `temp >= 50`: the output is `targetThrust` multiplied by `2`\n- If `temp < 50`: the output is `targetThrust` divided by `2` (integer division)\n\nPrint the output in format:\n`THRUST VECTOR: <calculatedValue> N`",
                "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int temp = scanner.nextInt();\n        int targetThrust = scanner.nextInt();\n        \n        // Cadet: Calculate output thrust using conditional logic\n    }\n}",
                "public static void main(String[] args)"
        );

        TestCase w2tc3_1 = new TestCase(w2cc3, "60 100\n", "THRUST VECTOR: 200 N\n", "Temp >= 50: Double thrust", false);
        TestCase w2tc3_2 = new TestCase(w2cc3, "30 100\n", "THRUST VECTOR: 50 N\n", "Temp < 50: Half thrust", false);
        TestCase w2tc3_h1 = new TestCase(w2cc3, "50 80\n", "THRUST VECTOR: 160 N\n", "Boundary temp=50: Double thrust", true);
        TestCase w2tc3_h2 = new TestCase(w2cc3, "10 25\n", "THRUST VECTOR: 12 N\n", "Integer division truncation check", true);
        w2cc3.getTestCases().addAll(List.of(w2tc3_1, w2tc3_2, w2tc3_h1, w2tc3_h2));

        Hint w2h3_1 = new Hint(w2cc3, 1, "Use `int actualThrust = (temp >= 50) ? (targetThrust * 2) : (targetThrust / 2);`.", 10);
        Hint w2h3_2 = new Hint(w2cc3, 2, "Print with `System.out.println(\"THRUST VECTOR: \" + actualThrust + \" N\");`.", 15);
        w2cc3.getHints().addAll(List.of(w2h3_1, w2h3_2));

        w2m3.setCodingChallenge(w2cc3);
        w2m3 = missionRepository.save(w2m3);

        // =========================================================================
        // WORLD 2 - MISSION 4: Subspace Beacon Parser
        // Topic: String comparison & char evaluation (.equals() vs ==)
        // =========================================================================
        Mission w2m4 = new Mission(
                world2,
                4,
                "Subspace Beacon Parser",
                "subspace-beacon-parser",
                "Interstellar beacon relays scattered throughout Kryon Belt transmit navigation instructions. Cadets must safely parse and validate beacon string commands using Java's `.equals()` and `.equalsIgnoreCase()` methods rather than primitive equality.",
                "Read an incoming relay callsign and directive string. Route instructions to the appropriate ship station.",
                "String Equality & String Methods",
                180,
                3,
                "MEDIUM",
                w2m3.getId()
        );
        w2m4.setShipSystem("COMMUNICATION_ARRAY");

        Lesson w2l4 = new Lesson(
                w2m4,
                "Comparing Object References vs String Content",
                "In Java, Strings are reference objects. Use `.equals()` to check character equality, never `==`.",
                "### The `==` Pitfall vs `.equals()`\n" +
                "In Java:\n" +
                "- `==` checks whether two variables point to the **exact same memory address**.\n" +
                "- `.equals()` compares the **actual text characters** inside the String objects.\n\n" +
                "```java\n" +
                "String cmd = scanner.next();\n" +
                "if (cmd.equals(\"NAVIGATE\")) { // Correct!\n" +
                "    System.out.println(\"CALIBRATING COURSE\");\n" +
                "}\n" +
                "```",
                "public class Solution {\n    public static void main(String[] args) {\n        String a = new String(\"PULSE\");\n        String b = \"PULSE\";\n        System.out.println(a == b);      // prints false\n        System.out.println(a.equals(b)); // prints true\n    }\n}",
                "[\"Always use .equals() or .equalsIgnoreCase() to compare Strings in Java.\", \"Using == on strings tests memory addresses, causing subtle logic bugs.\"]"
        );
        w2l4.setWhyNeeded("Prevents catastrophic routing errors when decoding vital transmission payloads.");
        w2m4.setLesson(w2l4);

        CodingChallenge w2cc4 = new CodingChallenge(
                w2m4,
                "Subspace Command Decoder",
                "Write a complete Java program in class `Solution` that reads a string command from standard input (single word):\n\n- If command is `DOCK`: print `DISPATCH: DOCKING CLAMPS ENGAGED`\n- If command is `EVADE`: print `DISPATCH: EVASIVE THRUST ACTIVE`\n- If command is `SCAN`: print `DISPATCH: LONG-RANGE SENSORS SWEEP`\n- For any other command: print `DISPATCH: UNRECOGNIZED SIGNAL`\n\nEnsure case-sensitive exact matching with `.equals()`.",
                "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        String command = scanner.next();\n        \n        // Cadet: Compare command safely with .equals()\n    }\n}",
                "public static void main(String[] args)"
        );

        TestCase w2tc4_1 = new TestCase(w2cc4, "DOCK\n", "DISPATCH: DOCKING CLAMPS ENGAGED\n", "Command DOCK", false);
        TestCase w2tc4_2 = new TestCase(w2cc4, "EVADE\n", "DISPATCH: EVASIVE THRUST ACTIVE\n", "Command EVADE", false);
        TestCase w2tc4_h1 = new TestCase(w2cc4, "SCAN\n", "DISPATCH: LONG-RANGE SENSORS SWEEP\n", "Command SCAN", true);
        TestCase w2tc4_h2 = new TestCase(w2cc4, "HOLD\n", "DISPATCH: UNRECOGNIZED SIGNAL\n", "Unknown signal fallback", true);
        w2cc4.getTestCases().addAll(List.of(w2tc4_1, w2tc4_2, w2tc4_h1, w2tc4_h2));

        Hint w2h4_1 = new Hint(w2cc4, 1, "Use `command.equals(\"DOCK\")` instead of `command == \"DOCK\"`.", 10);
        Hint w2h4_2 = new Hint(w2cc4, 2, "Structure an `if - else if - else` cascade matching each instruction.", 15);
        w2cc4.getHints().addAll(List.of(w2h4_1, w2h4_2));

        w2m4.setCodingChallenge(w2cc4);
        w2m4 = missionRepository.save(w2m4);

        // =========================================================================
        // WORLD 2 - MISSION 5 (BOSS): Cryo-Grid Override
        // Topic: Synthesis - Comprehensive Conditional Architecture
        // =========================================================================
        Mission w2m5 = new Mission(
                world2,
                5,
                "BOSS: Cryo-Grid Override",
                "cryo-grid-override",
                "A cryogenic magnetic storm has trapped Voyager-1 deep within the Kryon Belt rift! The primary navigation core has locked up. To initiate the hyperdrive jump sequence to Nova Sector, cadets must synthesize all conditional logic: evaluate multiple sensor inputs, verify beacon authorization codes, and calculate shield re-entry trajectories.",
                "Read sector authorization code (String), shield capacity (int), and temperature (int). Execute the multi-tiered decision matrix to unlock the Kryon Belt stargate.",
                "Comprehensive Decision System Synthesis",
                250,
                3,
                "HARD",
                w2m4.getId()
        );
        w2m5.setIsBossMission(true);
        w2m5.setShipSystem("HYPERDRIVE_GATE");

        Lesson w2l5 = new Lesson(
                w2m5,
                "Synthesizing Complex Starship Decision Trees",
                "Combine switches, compound booleans, and string validations into robust enterprise-grade decision systems.",
                "### Boss Mission Challenge\n" +
                "Real starship systems do not evaluate logic in isolation. A single malfunction protocol tests:\n" +
                "1. Protocol code authorization via String verification.\n" +
                "2. Numeric tolerances via compound relational operators (`&&`, `||`).\n" +
                "3. Dynamic fallback states using comprehensive branch handling.\n\n" +
                "Ensure every branch is guarded and all edge cases are addressed.",
                "public class Solution {\n    public static void main(String[] args) {\n        // Synthesize authorization, tolerances, and state reports\n    }\n}",
                "[\"Structure decision trees logically from highest priority to fallback.\", \"Test edge boundary values thoroughly.\", \"Boss missions test multi-concept fluency.\"]"
        );
        w2l5.setWhyNeeded("The definitive gatekeeping test before jumping to high-radiation stellar sectors.");
        w2m5.setLesson(w2l5);

        CodingChallenge w2cc5 = new CodingChallenge(
                w2m5,
                "Cryo-Grid Stargate Override",
                "Write a complete Java program in class `Solution` that reads three inputs from standard input:\n1. `authCode` (String): e.g. `OMEGA`\n2. `shield` (int): shield level (0 to 100)\n3. `temp` (int): core temperature in Celsius\n\nEvaluate conditions:\n- If `!authCode.equals(\"OMEGA\")`: print `GATE: ACCESS DENIED`\n- Else if `shield < 50 || temp > 120`: print `GATE: OVERLOAD HAZARD - ABORT JUMP`\n- Else if `shield >= 80 && temp <= 80`: print `GATE: OPTIMAL CONVERGENCE - HYPERDRIVE ENGAGED`\n- Else: print `GATE: SUB-OPTIMAL TRANSIT - PROCEED WITH CAUTION`\n\nEnsure exact capitalization and output formatting.",
                "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        String authCode = scanner.next();\n        int shield = scanner.nextInt();\n        int temp = scanner.nextInt();\n        \n        // Cadet: Implement Boss Gatekeeper Decision Tree\n    }\n}",
                "public static void main(String[] args)"
        );

        TestCase w2tc5_1 = new TestCase(w2cc5, "OMEGA 90 70\n", "GATE: OPTIMAL CONVERGENCE - HYPERDRIVE ENGAGED\n", "Optimal hyperdrive jump conditions", false);
        TestCase w2tc5_2 = new TestCase(w2cc5, "ALPHA 90 70\n", "GATE: ACCESS DENIED\n", "Invalid auth code", false);
        TestCase w2tc5_h1 = new TestCase(w2cc5, "OMEGA 40 60\n", "GATE: OVERLOAD HAZARD - ABORT JUMP\n", "Shield too low (< 50)", true);
        TestCase w2tc5_h2 = new TestCase(w2cc5, "OMEGA 85 130\n", "GATE: OVERLOAD HAZARD - ABORT JUMP\n", "Temperature too high (> 120)", true);
        TestCase w2tc5_h3 = new TestCase(w2cc5, "OMEGA 60 90\n", "GATE: SUB-OPTIMAL TRANSIT - PROCEED WITH CAUTION\n", "Acceptable but sub-optimal jump", true);
        TestCase w2tc5_h4 = new TestCase(w2cc5, "OMEGA 80 80\n", "GATE: OPTIMAL CONVERGENCE - HYPERDRIVE ENGAGED\n", "Exact boundary check (shield=80, temp=80)", true);
        w2cc5.getTestCases().addAll(List.of(w2tc5_1, w2tc5_2, w2tc5_h1, w2tc5_h2, w2tc5_h3, w2tc5_h4));

        Hint w2h5_1 = new Hint(w2cc5, 1, "Check `if (!authCode.equals(\"OMEGA\"))` first before checking numeric ranges.", 10);
        Hint w2h5_2 = new Hint(w2cc5, 2, "Next check `else if (shield < 50 || temp > 120)` to catch abort hazards.", 15);
        Hint w2h5_3 = new Hint(w2cc5, 3, "Next check `else if (shield >= 80 && temp <= 80)` for optimal jump, else sub-optimal transit.", 20);
        w2cc5.getHints().addAll(List.of(w2h5_1, w2h5_2, w2h5_3));

        w2m5.setCodingChallenge(w2cc5);
        w2m5 = missionRepository.save(w2m5);

        // 4. Create World 3: NOVA SECTOR (Locked)
        World world3 = new World(
                course,
                3,
                "nova-sector",
                "WORLD 3 — NOVA SECTOR",
                "Plasma Flare & Electromagnetic Core",
                "High-radiation orbital zone surrounding an unstable hyper-pulsar. Master loop constructs (while, for, do-while) to continually dissipate cyclic thermal surges.",
                false
        );
        world3 = worldRepository.save(world3);
        Mission w3m5 = seedWorld3Missions(world3, w2m5.getId());

        // 5. Create World 4: FUNCTION NEBULA (Locked)
        World world4 = new World(
                course,
                4,
                "function-nebula",
                "WORLD 4 — FUNCTION NEBULA",
                "Interstellar Quantum Sensor Mesh",
                "A swirling nebula of crystalline cosmic dust and distributed sensor arrays. Cadets architect modular methods, return values, parameters, and clean encapsulated subroutines.",
                false
        );
        world4 = worldRepository.save(world4);
        seedWorld4Missions(world4, w3m5 != null ? w3m5.getId() : null);

        System.out.println("[DataLoader] Successfully seeded Java Galaxy Odyssey - All 4 Worlds and 20 Missions.");
    }

    private void seedWorlds3And4IfMissing() {
        World world2 = worldRepository.findAll().stream()
                .filter(w -> w.getWorldOrder() == 2)
                .findFirst()
                .orElse(null);

        Long w2m5Id = null;
        if (world2 != null) {
            w2m5Id = missionRepository.findByWorldIdOrderByMissionOrderAsc(world2.getId()).stream()
                    .filter(m -> m.getMissionOrder() == 5)
                    .map(Mission::getId)
                    .findFirst()
                    .orElse(null);
        }

        World world3 = worldRepository.findAll().stream()
                .filter(w -> w.getWorldOrder() == 3)
                .findFirst()
                .orElse(null);

        Mission w3m5 = null;
        if (world3 != null) {
            List<Mission> w3Missions = missionRepository.findByWorldIdOrderByMissionOrderAsc(world3.getId());
            if (w3Missions.isEmpty()) {
                w3m5 = seedWorld3Missions(world3, w2m5Id);
            } else {
                w3m5 = w3Missions.stream().filter(m -> m.getMissionOrder() == 5).findFirst().orElse(null);
            }
        }

        World world4 = worldRepository.findAll().stream()
                .filter(w -> w.getWorldOrder() == 4)
                .findFirst()
                .orElse(null);

        if (world4 != null) {
            List<Mission> w4Missions = missionRepository.findByWorldIdOrderByMissionOrderAsc(world4.getId());
            if (w4Missions.isEmpty()) {
                seedWorld4Missions(world4, w3m5 != null ? w3m5.getId() : null);
            }
        }
    }

    private Mission seedWorld3Missions(World world3, Long prevMissionId) {
        System.out.println("[DataLoader] Seeding canonical missions for World 3: Nova Sector...");

        // World 3 - Mission 1: Plasma Coolant Circulation (while loops)
        Mission w3m1 = new Mission(
                world3,
                1,
                "Plasma Coolant Circulation",
                "plasma-coolant-circulation",
                "Voyager-1 enters the outer plasma belt of the Nova Sector. The main fusion conduit is overheating at dangerous temperatures. Cadets must construct a while loop that reduces core temperature by 15 units per cycle until it drops to or below safe operating threshold (50 C), printing each dissipation cycle.",
                "Use a while loop to iteratively cool reactor core temperature by 15 units until it reaches safe threshold (<= 50 C).",
                "While Loops & Condition-Controlled Iteration",
                150,
                3,
                "EASY",
                prevMissionId
        );
        w3m1.setShipSystem("COOLANT_CONDUIT");

        Lesson w3l1 = new Lesson(
                w3m1,
                "Condition-Controlled Loops with While",
                "A while loop repeatedly executes a block of statements as long as its boolean condition remains true.",
                "### Understanding While Loops\n" +
                "When a task must repeat an unknown number of times until a target state is reached, Java provides the `while` loop.\n\n" +
                "```java\n" +
                "while (condition) {\n" +
                "    // execute code\n" +
                "    // update loop control variable\n" +
                "}\n" +
                "```\n" +
                "Make sure the condition eventually becomes false to prevent infinite loops!",
                "public class Solution {\n    public static void main(String[] args) {\n        int temp = 80;\n        while (temp > 50) {\n            temp -= 15;\n            System.out.println(\"TEMP: \" + temp + \" C\");\n        }\n    }\n}",
                "[\"A while loop evaluates its boolean test before every iteration.\", \"If the initial condition is false, the loop body never executes.\", \"Ensure state variables update inside the loop to avoid infinite loops.\"]"
        );
        w3l1.setWhyNeeded("Essential for continuous starship monitoring, telemetry polling, and thermal regulation.");
        w3m1.setLesson(w3l1);

        PracticeQuestion w3pq1 = new PracticeQuestion(
                w3m1,
                1,
                "What happens if a while loop condition is false on the very first evaluation?",
                "[\"It executes once\", \"The loop body is skipped entirely\", \"It throws a CompilationError\", \"It loops indefinitely\"]",
                "[\"It executes once\", \"The loop body is skipped entirely\", \"It throws a CompilationError\", \"It loops indefinitely\"]",
                1,
                "Because while loops check the condition before entry, a false condition skips the body completely."
        );
        w3pq1.setActivityType("MULTIPLE_CHOICE");
        w3m1.getPracticeQuestions().add(w3pq1);

        CodingChallenge w3cc1 = new CodingChallenge(
                w3m1,
                "Reactor Core Coolant Cycle",
                "Write a complete Java program in class `Solution` that reads initial core temperature (int) from standard input.\n\nWhile temperature is strictly greater than 50 (`temp > 50`):\n- Subtract 15 from temperature\n- Output `TEMP: <temp> C`\n\nWhen the loop finishes (temperature <= 50), output `COOLANT STABILIZED AT: <temp> C`.",
                "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int temp = scanner.nextInt();\n        \n        // Cadet: Implement while loop cooling\n    }\n}",
                "public static void main(String[] args)"
        );

        TestCase w3tc1_1 = new TestCase(w3cc1, "100\n", "TEMP: 85 C\nTEMP: 70 C\nTEMP: 55 C\nTEMP: 40 C\nCOOLANT STABILIZED AT: 40 C\n", "Initial temp 100", false);
        TestCase w3tc1_2 = new TestCase(w3cc1, "50\n", "COOLANT STABILIZED AT: 50 C\n", "Initial temp already safe (50)", false);
        TestCase w3tc1_h1 = new TestCase(w3cc1, "125\n", "TEMP: 110 C\nTEMP: 95 C\nTEMP: 80 C\nTEMP: 65 C\nTEMP: 50 C\nCOOLANT STABILIZED AT: 50 C\n", "Initial temp 125 exact boundary", true);
        TestCase w3tc1_h2 = new TestCase(w3cc1, "40\n", "COOLANT STABILIZED AT: 40 C\n", "Initial temp below threshold", true);
        w3cc1.getTestCases().addAll(List.of(w3tc1_1, w3tc1_2, w3tc1_h1, w3tc1_h2));

        Hint w3h1_1 = new Hint(w3cc1, 1, "Initialize your loop with: `while (temp > 50)`.", 10);
        Hint w3h1_2 = new Hint(w3cc1, 2, "Inside the loop: `temp -= 15; System.out.println(\"TEMP: \" + temp + \" C\");`", 15);
        w3cc1.getHints().addAll(List.of(w3h1_1, w3h1_2));

        w3m1.setCodingChallenge(w3cc1);
        w3m1 = missionRepository.save(w3m1);

        // World 3 - Mission 2: Orbital Beacon Frequency Sweep (for loops)
        Mission w3m2 = new Mission(
                world3,
                2,
                "Orbital Beacon Frequency Sweep",
                "orbital-beacon-frequency-sweep",
                "Subspace communication arrays must sweep across radio frequency channels to locate navigation beacons trapped in plasma noise. Cadets must use a standard for loop with an accumulator or counter to emit ping signals across a specified frequency range.",
                "Read the number of beacon channels n and use a for loop from 1 to n to sweep and acquire each channel.",
                "For Loops & Definite Iteration",
                160,
                3,
                "EASY",
                w3m1.getId()
        );
        w3m2.setShipSystem("LONG_RANGE_ARRAY");

        Lesson w3l2 = new Lesson(
                w3m2,
                "Definite Iteration with For Loops",
                "The for loop combines initialization, condition checking, and step updates in a single line.",
                "### Anatomy of a For Loop\n" +
                "```java\n" +
                "for (int i = 1; i <= n; i++) {\n" +
                "    System.out.println(\"INDEX: \" + i);\n" +
                "}\n" +
                "```\n" +
                "1. **Initialization**: `int i = 1` sets the loop counter.\n" +
                "2. **Condition**: `i <= n` tested before each cycle.\n" +
                "3. **Update**: `i++` increments counter after body finishes.",
                "public class Solution {\n    public static void main(String[] args) {\n        for (int ch = 1; ch <= 3; ch++) {\n            System.out.println(\"CHANNEL: \" + ch);\n        }\n    }\n}",
                "[\"Use for loops when the number of iterations is known in advance.\", \"The counter variable is scoped to the loop block.\", \"Ensure the step update moves toward terminating condition.\"]"
        );
        w3l2.setWhyNeeded("Sweeps frequencies, scans coordinates, and iterates across indexed starship data arrays.");
        w3m2.setLesson(w3l2);

        CodingChallenge w3cc2 = new CodingChallenge(
                w3m2,
                "Beacon Frequency Sweep",
                "Write a complete Java program in class `Solution` that reads integer `n` (channel count) from standard input.\n\nUsing a `for` loop starting at 1 through `n` (inclusive), print:\n`SWEEP CHANNEL <i>: ACQUIRED`\n\nAfter completing the loop, print:\n`SWEEP COMPLETE: <n> CHANNELS LOCKED`",
                "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int n = scanner.nextInt();\n        \n        // Cadet: Implement for loop sweep\n    }\n}",
                "public static void main(String[] args)"
        );

        TestCase w3tc2_1 = new TestCase(w3cc2, "3\n", "SWEEP CHANNEL 1: ACQUIRED\nSWEEP CHANNEL 2: ACQUIRED\nSWEEP CHANNEL 3: ACQUIRED\nSWEEP COMPLETE: 3 CHANNELS LOCKED\n", "Sweep 3 channels", false);
        TestCase w3tc2_2 = new TestCase(w3cc2, "1\n", "SWEEP CHANNEL 1: ACQUIRED\nSWEEP COMPLETE: 1 CHANNELS LOCKED\n", "Sweep single channel", false);
        TestCase w3tc2_h1 = new TestCase(w3cc2, "5\n", "SWEEP CHANNEL 1: ACQUIRED\nSWEEP CHANNEL 2: ACQUIRED\nSWEEP CHANNEL 3: ACQUIRED\nSWEEP CHANNEL 4: ACQUIRED\nSWEEP CHANNEL 5: ACQUIRED\nSWEEP COMPLETE: 5 CHANNELS LOCKED\n", "Sweep 5 channels", true);
        TestCase w3tc2_h2 = new TestCase(w3cc2, "2\n", "SWEEP CHANNEL 1: ACQUIRED\nSWEEP CHANNEL 2: ACQUIRED\nSWEEP COMPLETE: 2 CHANNELS LOCKED\n", "Sweep 2 channels", true);
        w3cc2.getTestCases().addAll(List.of(w3tc2_1, w3tc2_2, w3tc2_h1, w3tc2_h2));

        Hint w3h2_1 = new Hint(w3cc2, 1, "Write loop as: `for (int i = 1; i <= n; i++)`.", 10);
        Hint w3h2_2 = new Hint(w3cc2, 2, "Inside loop: `System.out.println(\"SWEEP CHANNEL \" + i + \": ACQUIRED\");`", 15);
        w3cc2.getHints().addAll(List.of(w3h2_1, w3h2_2));

        w3m2.setCodingChallenge(w3cc2);
        w3m2 = missionRepository.save(w3m2);

        // World 3 - Mission 3: Electromagnetic Pulse Handshake (do-while loops)
        Mission w3m3 = new Mission(
                world3,
                3,
                "Electromagnetic Pulse Handshake",
                "electromagnetic-pulse-handshake",
                "The pulsar's electromagnetic discharge requires at least one synchronization pulse before testing signal stability. The do-while loop guarantees the block runs at least once before checking the termination condition.",
                "Execute a do-while loop to transmit an initial pulse burst, doubling pulse strength each cycle while pulse < 100.",
                "Do-While Loops & At-Least-Once Execution",
                170,
                3,
                "MEDIUM",
                w3m2.getId()
        );
        w3m3.setShipSystem("EM_PULSE_GENERATOR");

        Lesson w3l3 = new Lesson(
                w3m3,
                "At-Least-Once Execution with Do-While",
                "A do-while loop executes its block first, and then evaluates the condition at the bottom.",
                "### Do-While Loop Syntax\n" +
                "```java\n" +
                "do {\n" +
                "    // runs at least once!\n" +
                "} while (condition);\n" +
                "```\n" +
                "Notice the semicolon `;` after the while condition at the end.",
                "public class Solution {\n    public static void main(String[] args) {\n        int p = 50;\n        do {\n            System.out.println(\"PULSE: \" + p);\n            p *= 2;\n        } while (p < 100);\n    }\n}",
                "[\"Do-while loops always run their body at least once.\", \"The condition is evaluated at the end of each iteration.\", \"Always end a do-while construct with a semicolon.\"]"
        );
        w3l3.setWhyNeeded("Guarantees initial hardware handshakes, input prompts, and safety checks run at least once.");
        w3m3.setLesson(w3l3);

        CodingChallenge w3cc3 = new CodingChallenge(
                w3m3,
                "Pulsar Signal Handshake",
                "Write a complete Java program in class `Solution` that reads initial pulse strength `pulse` (int) from standard input.\n\nUsing a `do-while` loop:\n1. Output `PULSE BURST: <pulse> MW`\n2. Double the pulse value (`pulse *= 2`)\n3. Continue while `pulse < 100`\n\nAfter the loop finishes, output:\n`PULSE RESONANCE REACHED: <pulse> MW`",
                "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int pulse = scanner.nextInt();\n        \n        // Cadet: Implement do-while pulse escalation\n    }\n}",
                "public static void main(String[] args)"
        );

        TestCase w3tc3_1 = new TestCase(w3cc3, "20\n", "PULSE BURST: 20 MW\nPULSE BURST: 40 MW\nPULSE BURST: 80 MW\nPULSE RESONANCE REACHED: 160 MW\n", "Initial pulse 20", false);
        TestCase w3tc3_2 = new TestCase(w3cc3, "150\n", "PULSE BURST: 150 MW\nPULSE RESONANCE REACHED: 300 MW\n", "Initial pulse 150 (runs once)", false);
        TestCase w3tc3_h1 = new TestCase(w3cc3, "50\n", "PULSE BURST: 50 MW\nPULSE RESONANCE REACHED: 100 MW\n", "Initial pulse 50", true);
        TestCase w3tc3_h2 = new TestCase(w3cc3, "12\n", "PULSE BURST: 12 MW\nPULSE BURST: 24 MW\nPULSE BURST: 48 MW\nPULSE BURST: 96 MW\nPULSE RESONANCE REACHED: 192 MW\n", "Initial pulse 12", true);
        w3cc3.getTestCases().addAll(List.of(w3tc3_1, w3tc3_2, w3tc3_h1, w3tc3_h2));

        Hint w3h3_1 = new Hint(w3cc3, 1, "Format the loop as: `do { ... } while (pulse < 100);`", 10);
        Hint w3h3_2 = new Hint(w3cc3, 2, "Print `PULSE BURST: ` before doubling the value inside the body.", 15);
        w3cc3.getHints().addAll(List.of(w3h3_1, w3h3_2));

        w3m3.setCodingChallenge(w3cc3);
        w3m3 = missionRepository.save(w3m3);

        // World 3 - Mission 4: Flare Surge Energy Harvester (break & continue)
        Mission w3m4 = new Mission(
                world3,
                4,
                "Flare Surge Energy Harvester",
                "flare-surge-energy-harvester",
                "Harvesting solar flares requires filtering out corrupted radiation bursts while accumulating valid energy megawatt packets into the capacitor.",
                "Read count packets: skip negative values with continue, abort on values > 1000 with break, and sum valid energy packets.",
                "Loop Control (break, continue) & Accumulators",
                180,
                3,
                "MEDIUM",
                w3m3.getId()
        );
        w3m4.setShipSystem("SOLAR_HARVESTER");

        Lesson w3l4 = new Lesson(
                w3m4,
                "Loop Control with Break and Continue",
                "The continue statement skips to the next loop iteration, while break terminates the loop immediately.",
                "### Control Flow in Loops\n" +
                "- `continue`: skips remainder of current iteration and proceeds to next check.\n" +
                "- `break`: breaks completely out of the loop construct.",
                "public class Solution {\n    public static void main(String[] args) {\n        for (int i = 0; i < 5; i++) {\n            if (i == 2) continue;\n            if (i == 4) break;\n            System.out.println(i);\n        }\n    }\n}",
                "[\"continue skips remaining statements in current cycle.\", \"break exits the enclosing loop entirely.\", \"Use break for emergency abort conditions and search termination.\"]"
        );
        w3l4.setWhyNeeded("Prevents capacitor overload and filters spurious space sensor anomalies.");
        w3m4.setLesson(w3l4);

        CodingChallenge w3cc4 = new CodingChallenge(
                w3m4,
                "Solar Flare Energy Harvester",
                "Write a complete Java program in class `Solution` that reads integer `count`, then reads `count` integers representing flare packets:\n\n- If packet is negative (`< 0`): skip it using `continue` (radiation noise)\n- If packet is strictly greater than 1000 (`> 1000`): abort harvesting immediately using `break` (capacitor overload)\n- Otherwise: add packet to `totalEnergy`\n\nFinally output:\n`TOTAL ENERGY HARVESTED: <totalEnergy> MW`",
                "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int count = scanner.nextInt();\n        int totalEnergy = 0;\n        \n        // Cadet: Implement packet loop with break and continue\n    }\n}",
                "public static void main(String[] args)"
        );

        TestCase w3tc4_1 = new TestCase(w3cc4, "4\n100\n-50\n200\n300\n", "TOTAL ENERGY HARVESTED: 600 MW\n", "Standard packets with negative skipped", false);
        TestCase w3tc4_2 = new TestCase(w3cc4, "4\n50\n1200\n300\n100\n", "TOTAL ENERGY HARVESTED: 50 MW\n", "Overload packet 1200 triggers break", false);
        TestCase w3tc4_h1 = new TestCase(w3cc4, "3\n-10\n-20\n-30\n", "TOTAL ENERGY HARVESTED: 0 MW\n", "All negative packets skipped", true);
        TestCase w3tc4_h2 = new TestCase(w3cc4, "5\n200\n300\n-100\n400\n1500\n", "TOTAL ENERGY HARVESTED: 900 MW\n", "Break after accumulating 900", true);
        w3cc4.getTestCases().addAll(List.of(w3tc4_1, w3tc4_2, w3tc4_h1, w3tc4_h2));

        Hint w3h4_1 = new Hint(w3cc4, 1, "Check `if (val < 0) continue;` before checking `if (val > 1000) break;`.", 10);
        Hint w3h4_2 = new Hint(w3cc4, 2, "After the loop, print `TOTAL ENERGY HARVESTED: \" + totalEnergy + \" MW`.", 15);
        w3cc4.getHints().addAll(List.of(w3h4_1, w3h4_2));

        w3m4.setCodingChallenge(w3cc4);
        w3m4 = missionRepository.save(w3m4);

        // World 3 - Mission 5 (BOSS): Hyper-Pulsar Core Stabilization (comprehensive loops)
        Mission w3m5 = new Mission(
                world3,
                5,
                "BOSS: Hyper-Pulsar Core Stabilization",
                "hyper-pulsar-core-stabilization",
                "The Nova Sector hyper-pulsar has entered critical resonance. Cadets must process a stream of sensor telemetry packets across cycles, calculate cumulative energy dampening, detect threshold breaches, and restore electromagnetic equilibrium.",
                "Process numSensors sensor values, calculate integer average and count critical sensors (> 75), and output pulsar status.",
                "Comprehensive Loop & Iteration Synthesis",
                300,
                3,
                "BOSS",
                w3m4.getId()
        );
        w3m5.setIsBossMission(true);
        w3m5.setShipSystem("HYPER_PULSAR_SHIELD");

        Lesson w3l5 = new Lesson(
                w3m5,
                "Mastering Iterative Control Systems",
                "Synthesize loop types, accumulators, and thresholds to control complex asynchronous telemetry flows.",
                "### Boss Challenge Architecture\n" +
                "Industrial Java systems constantly consume streams of telemetry. In this challenge:\n" +
                "1. Loop across dynamic streams.\n" +
                "2. Maintain running sums and statistical counts.\n" +
                "3. Apply multi-branch thresholds based on aggregated metrics.",
                "public class Solution {\n    public static void main(String[] args) {\n        // Synthesize loop iteration and threshold classification\n    }\n}",
                "[\"Accumulators aggregate state across iterations.\", \"Always test boundary values.\", \"Defeat the boss mission to establish warp transit to World 4.\"]"
        );
        w3l5.setWhyNeeded("The definitive clearance required to enter the Function Nebula.");
        w3m5.setLesson(w3l5);

        CodingChallenge w3cc5 = new CodingChallenge(
                w3m5,
                "Hyper-Pulsar Resonance Balancer",
                "Write a complete Java program in class `Solution` that reads integer `numSensors`, followed by `numSensors` integers representing sensor flux levels.\n\n1. Count how many sensor values are strictly greater than 75 (`val > 75`)\n2. Compute the average flux using integer division: `sum / numSensors`\n3. Output status based on critical count:\n   - If critical count is 0: print\n     `PULSAR STATUS: STABLE`\n     `AVERAGE FLUX: <avg>`\n   - If critical count is 1 or 2: print\n     `PULSAR STATUS: ELEVATED`\n     `CRITICAL SENSORS: <count>`\n     `AVERAGE FLUX: <avg>`\n   - If critical count is 3 or more: print\n     `PULSAR STATUS: OVERLOAD IMMINENT`\n     `CRITICAL SENSORS: <count>`\n     `AVERAGE FLUX: <avg>`",
                "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int numSensors = scanner.nextInt();\n        \n        // Cadet: Implement Boss Loop Telemetry Synthesis\n    }\n}",
                "public static void main(String[] args)"
        );

        TestCase w3tc5_1 = new TestCase(w3cc5, "4\n40 50 60 70\n", "PULSAR STATUS: STABLE\nAVERAGE FLUX: 55\n", "0 critical sensors", false);
        TestCase w3tc5_2 = new TestCase(w3cc5, "4\n40 80 90 60\n", "PULSAR STATUS: ELEVATED\nCRITICAL SENSORS: 2\nAVERAGE FLUX: 67\n", "2 critical sensors", false);
        TestCase w3tc5_h1 = new TestCase(w3cc5, "5\n90 85 95 80 70\n", "PULSAR STATUS: OVERLOAD IMMINENT\nCRITICAL SENSORS: 4\nAVERAGE FLUX: 84\n", "4 critical sensors", true);
        TestCase w3tc5_h2 = new TestCase(w3cc5, "3\n75 75 75\n", "PULSAR STATUS: STABLE\nAVERAGE FLUX: 75\n", "Boundary test: 75 is not > 75", true);
        w3cc5.getTestCases().addAll(List.of(w3tc5_1, w3tc5_2, w3tc5_h1, w3tc5_h2));

        Hint w3h5_1 = new Hint(w3cc5, 1, "Maintain `int sum = 0;` and `int critical = 0;` inside the loop.", 10);
        Hint w3h5_2 = new Hint(w3cc5, 2, "Use integer division `int avg = sum / numSensors;` as specified.", 15);
        Hint w3h5_3 = new Hint(w3cc5, 3, "Branch with `if (critical == 0)`, `else if (critical <= 2)`, `else`.", 20);
        w3cc5.getHints().addAll(List.of(w3h5_1, w3h5_2, w3h5_3));

        w3m5.setCodingChallenge(w3cc5);
        w3m5 = missionRepository.save(w3m5);

        System.out.println("[DataLoader] World 3 (Nova Sector) 5 missions seeded successfully.");
        return w3m5;
    }

    private void seedWorld4Missions(World world4, Long prevMissionId) {
        System.out.println("[DataLoader] Seeding canonical missions for World 4: Function Nebula...");

        // World 4 - Mission 1: Quantum Ping Subroutine (Methods & parameters)
        Mission w4m1 = new Mission(
                world4,
                1,
                "Quantum Ping Subroutine",
                "quantum-ping-subroutine",
                "The quantum mesh nodes require standardized ping transmissions. Cadets must declare and invoke a custom static method sendPing(String nodeId, int latency) that outputs formatted signal confirmations.",
                "Declare public static void sendPing(String nodeId, int latency) and call it from main.",
                "Static Methods & Parameters",
                160,
                3,
                "EASY",
                prevMissionId
        );
        w4m1.setShipSystem("QUANTUM_TRANSMITTER");

        Lesson w4l1 = new Lesson(
                w4m1,
                "Modular Code with Java Methods",
                "Methods encapsulate reusable blocks of code, accepting parameters and organizing execution cleanly.",
                "### Declaring Static Methods\n" +
                "```java\n" +
                "public static void greetCadet(String name) {\n" +
                "    System.out.println(\"HELLO, CADET \" + name);\n" +
                "}\n" +
                "```\n" +
                "In `main`, invoke it with `greetCadet(\"ORION\");`.",
                "public class Solution {\n    public static void sendPing(String id, int ms) {\n        System.out.println(\"PING [\" + id + \"]: \" + ms + \"ms\");\n    }\n    public static void main(String[] args) {\n        sendPing(\"NODE-1\", 25);\n    }\n}",
                "[\"Methods eliminate code duplication.\", \"Parameters pass dynamic data into the method body.\", \"static methods can be called directly without object instantiation.\"]"
        );
        w4l1.setWhyNeeded("Encapsulates sub-space transmission logic into clean, reusable modules.");
        w4m1.setLesson(w4l1);

        PracticeQuestion w4pq1 = new PracticeQuestion(
                w4m1,
                1,
                "What keyword indicates that a Java method does not return any value?",
                "[\"null\", \"empty\", \"void\", \"static\"]",
                "[\"null\", \"empty\", \"void\", \"static\"]",
                2,
                "The void keyword specifies that a method does not return a value."
        );
        w4pq1.setActivityType("MULTIPLE_CHOICE");
        w4m1.getPracticeQuestions().add(w4pq1);

        CodingChallenge w4cc1 = new CodingChallenge(
                w4m1,
                "Quantum Node Ping Method",
                "Write a complete Java program in class `Solution` that defines a static method:\n`public static void sendPing(String nodeId, int latency)`\n\nInside `sendPing`, print:\n`[NODE <nodeId>] PING: <latency>ms - CONFIRMED`\n\nIn `main`, read a String `nodeId` and an int `latency` from standard input and invoke `sendPing(nodeId, latency)`.",
                "import java.util.Scanner;\n\npublic class Solution {\n    // Cadet: Declare public static void sendPing(String nodeId, int latency)\n    \n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        String nodeId = scanner.next();\n        int latency = scanner.nextInt();\n        \n        // Invoke sendPing here\n    }\n}",
                "public static void main(String[] args)"
        );

        TestCase w4tc1_1 = new TestCase(w4cc1, "ALPHA-7 12\n", "[NODE ALPHA-7] PING: 12ms - CONFIRMED\n", "Node ALPHA-7 latency 12", false);
        TestCase w4tc1_2 = new TestCase(w4cc1, "OMEGA-9 45\n", "[NODE OMEGA-9] PING: 45ms - CONFIRMED\n", "Node OMEGA-9 latency 45", false);
        TestCase w4tc1_h1 = new TestCase(w4cc1, "SOLARIS 5\n", "[NODE SOLARIS] PING: 5ms - CONFIRMED\n", "Node SOLARIS latency 5", true);
        TestCase w4tc1_h2 = new TestCase(w4cc1, "NEXUS-X 0\n", "[NODE NEXUS-X] PING: 0ms - CONFIRMED\n", "Node NEXUS-X latency 0", true);
        w4cc1.getTestCases().addAll(List.of(w4tc1_1, w4tc1_2, w4tc1_h1, w4tc1_h2));

        Hint w4h1_1 = new Hint(w4cc1, 1, "Declare `public static void sendPing(String nodeId, int latency)` outside `main`.", 10);
        Hint w4h1_2 = new Hint(w4cc1, 2, "Inside `sendPing`, use `System.out.println(\"[NODE \" + nodeId + \"] PING: \" + latency + \"ms - CONFIRMED\");`.", 15);
        w4cc1.getHints().addAll(List.of(w4h1_1, w4h1_2));

        w4m1.setCodingChallenge(w4cc1);
        w4m1 = missionRepository.save(w4m1);

        // World 4 - Mission 2: Warp Vector Calculation Engine (Return values)
        Mission w4m2 = new Mission(
                world4,
                2,
                "Warp Vector Calculation Engine",
                "warp-vector-calculation-engine",
                "Navigating crystalline nebula dust clouds requires calculating warp velocity multipliers. Cadets write a method with a typed return value (double) that computes warp velocity from thrust power and nebula density.",
                "Implement public static double calculateVelocity(double thrust, double density) and print formatted result.",
                "Method Return Values & Type Contracts",
                170,
                3,
                "EASY",
                w4m1.getId()
        );
        w4m2.setShipSystem("WARP_COMPUTATION_CORE");

        Lesson w4l2 = new Lesson(
                w4m2,
                "Method Return Values",
                "Methods with return types compute and pass values back to caller using the return keyword.",
                "### Returning Data from Methods\n" +
                "```java\n" +
                "public static double square(double x) {\n" +
                "    return x * x;\n" +
                "}\n" +
                "```\n" +
                "Capture the output in a variable: `double res = square(5.0);`.",
                "public class Solution {\n    public static double multiply(double a, double b) {\n        return a * b;\n    }\n    public static void main(String[] args) {\n        double v = multiply(10.5, 2.0);\n        System.out.println(\"RESULT: \" + v);\n    }\n}",
                "[\"The return statement terminates the method and provides the result value.\", \"Return type must match declared method signature.\", \"Methods can return primitives, objects, or arrays.\"]"
        );
        w4l2.setWhyNeeded("Calculates trajectory equations, sensor triangulation, and hyper-space coordinates.");
        w4m2.setLesson(w4l2);

        CodingChallenge w4cc2 = new CodingChallenge(
                w4m2,
                "Warp Velocity Method",
                "Write a complete Java program in class `Solution` that defines a static method:\n`public static double calculateVelocity(double thrust, double density)`\n\nIt computes and returns:\n`(thrust * 1.5) / density`\n\nIn `main`, read `thrust` (double) and `density` (double) from standard input, call `calculateVelocity`, and output:\n`WARP VELOCITY: <velocity formatted to 2 decimals> KM/S`\n(Use `System.out.printf(\"WARP VELOCITY: %.2f KM/S%n\", velocity);`)",
                "import java.util.Scanner;\n\npublic class Solution {\n    // Cadet: Implement public static double calculateVelocity(double thrust, double density)\n    \n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        double thrust = scanner.nextDouble();\n        double density = scanner.nextDouble();\n        \n        // Call method and format output\n    }\n}",
                "public static void main(String[] args)"
        );

        TestCase w4tc2_1 = new TestCase(w4cc2, "100.0 2.0\n", "WARP VELOCITY: 75.00 KM/S\n", "Thrust 100, density 2", false);
        TestCase w4tc2_2 = new TestCase(w4cc2, "50.0 5.0\n", "WARP VELOCITY: 15.00 KM/S\n", "Thrust 50, density 5", false);
        TestCase w4tc2_h1 = new TestCase(w4cc2, "80.0 1.25\n", "WARP VELOCITY: 96.00 KM/S\n", "Thrust 80, density 1.25", true);
        TestCase w4tc2_h2 = new TestCase(w4cc2, "200.0 4.0\n", "WARP VELOCITY: 75.00 KM/S\n", "Thrust 200, density 4", true);
        w4cc2.getTestCases().addAll(List.of(w4tc2_1, w4tc2_2, w4tc2_h1, w4tc2_h2));

        Hint w4h2_1 = new Hint(w4cc2, 1, "Declare `public static double calculateVelocity(double thrust, double density)`.", 10);
        Hint w4h2_2 = new Hint(w4cc2, 2, "Print using `System.out.printf(\"WARP VELOCITY: %.2f KM/S%n\", velocity);`.", 15);
        w4cc2.getHints().addAll(List.of(w4h2_1, w4h2_2));

        w4m2.setCodingChallenge(w4cc2);
        w4m2 = missionRepository.save(w4m2);

        // World 4 - Mission 3: Distributed Sensor Mesh Allocation (Arrays basics)
        Mission w4m3 = new Mission(
                world4,
                3,
                "Distributed Sensor Mesh Allocation",
                "distributed-sensor-mesh-allocation",
                "The sensor mesh collects distributed telemetry across an array of quantum probes. Cadets allocate a Java array int[], populate it from standard input, and display elements using array indexing and .length.",
                "Allocate int[] array of given size, read readings, print array elements space-separated and count deployed probes.",
                "Array Declaration, Indexing & Length",
                180,
                3,
                "MEDIUM",
                w4m2.getId()
        );
        w4m3.setShipSystem("QUANTUM_MESH_CONTROLLER");

        Lesson w4l3 = new Lesson(
                w4m3,
                "Introduction to Java Arrays",
                "An array is a fixed-size container that stores elements of the same type in contiguous memory.",
                "### Allocating and Using Arrays\n" +
                "```java\n" +
                "int[] readings = new int[size];\n" +
                "readings[0] = 42; // 0-based indexing\n" +
                "int count = readings.length;\n" +
                "```",
                "public class Solution {\n    public static void main(String[] args) {\n        int[] arr = new int[]{10, 20, 30};\n        for (int i = 0; i < arr.length; i++) {\n            System.out.print(arr[i] + \" \");\n        }\n        System.out.println();\n    }\n}",
                "[\"Arrays are 0-indexed: first element is arr[0], last is arr[arr.length - 1].\", \"arr.length gives total capacity.\", \"Array size is fixed once allocated.\"]"
        );
        w4l3.setWhyNeeded("Stores batches of orbital readings, deflector frequencies, and sensor matrices.");
        w4m3.setLesson(w4l3);

        CodingChallenge w4cc3 = new CodingChallenge(
                w4m3,
                "Sensor Mesh Array Allocation",
                "Write a complete Java program in class `Solution` that reads integer `size` from standard input.\n\n1. Allocate an array `int[] probes = new int[size];`\n2. Read `size` integers into the array\n3. Print the array values on one line separated by spaces starting with `SENSOR MESH: ` (e.g. `SENSOR MESH: 10 20 30`)\n4. On the next line, print: `PROBES DEPLOYED: <size>`",
                "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int size = scanner.nextInt();\n        \n        // Cadet: Allocate array and read readings\n    }\n}",
                "public static void main(String[] args)"
        );

        TestCase w4tc3_1 = new TestCase(w4cc3, "3\n10 20 30\n", "SENSOR MESH: 10 20 30\nPROBES DEPLOYED: 3\n", "Size 3 array", false);
        TestCase w4tc3_2 = new TestCase(w4cc3, "1\n99\n", "SENSOR MESH: 99\nPROBES DEPLOYED: 1\n", "Size 1 array", false);
        TestCase w4tc3_h1 = new TestCase(w4cc3, "4\n5 15 25 35\n", "SENSOR MESH: 5 15 25 35\nPROBES DEPLOYED: 4\n", "Size 4 array", true);
        TestCase w4tc3_h2 = new TestCase(w4cc3, "5\n1 2 3 4 5\n", "SENSOR MESH: 1 2 3 4 5\nPROBES DEPLOYED: 5\n", "Size 5 array", true);
        w4cc3.getTestCases().addAll(List.of(w4tc3_1, w4tc3_2, w4tc3_h1, w4tc3_h2));

        Hint w4h3_1 = new Hint(w4cc3, 1, "Allocate array: `int[] probes = new int[size];`", 10);
        Hint w4h3_2 = new Hint(w4cc3, 2, "Print `System.out.print(\"SENSOR MESH:\");` then loop appending `\" \" + probes[i]`.", 15);
        w4cc3.getHints().addAll(List.of(w4h3_1, w4h3_2));

        w4m3.setCodingChallenge(w4cc3);
        w4m3 = missionRepository.save(w4m3);

        // World 4 - Mission 4: Cosmic Dust Peak Detector (Array traversal & extrema)
        Mission w4m4 = new Mission(
                world4,
                4,
                "Cosmic Dust Peak Detector",
                "cosmic-dust-peak-detector",
                "To navigate the nebula safely, ship shields must calibrate to the highest particle density recorded across the probe array. Cadets implement an array traversal algorithm to find the maximum density and its probe index.",
                "Traverse an array to locate the maximum density value and its first occurrence probe index.",
                "Array Traversal, Search & Extrema",
                190,
                3,
                "MEDIUM",
                w4m3.getId()
        );
        w4m4.setShipSystem("DUST_PARTICLE_DETECTOR");

        Lesson w4l4 = new Lesson(
                w4m4,
                "Array Traversal and Peak Detection",
                "Linear scan algorithms iterate over every element in an array to compute aggregates or identify extrema.",
                "### Finding the Maximum\n" +
                "```java\n" +
                "int max = arr[0];\n" +
                "int maxIdx = 0;\n" +
                "for (int i = 1; i < arr.length; i++) {\n" +
                "    if (arr[i] > max) {\n" +
                "        max = arr[i];\n" +
                "        maxIdx = i;\n" +
                "    }\n" +
                "}\n" +
                "```",
                "public class Solution {\n    public static void main(String[] args) {\n        int[] vals = {5, 20, 15};\n        int m = vals[0];\n        for (int v : vals) if (v > m) m = v;\n        System.out.println(\"PEAK: \" + m);\n    }\n}",
                "[\"Initialize maximum candidate with first element arr[0].\", \"Use loop to compare each subsequent candidate.\", \"Record index whenever a strictly greater element is encountered.\"]"
        );
        w4l4.setWhyNeeded("Finds hottest reactor hotspots, highest threat targets, and optimum hyperspace channels.");
        w4m4.setLesson(w4l4);

        CodingChallenge w4cc4 = new CodingChallenge(
                w4m4,
                "Peak Particle Density Finder",
                "Write a complete Java program in class `Solution` that reads `n` (array length), followed by `n` integers representing probe density readings.\n\nTraverse the array to find the maximum density value and its first occurrence 0-based index.\n\nPrint:\n`MAX DENSITY: <max> AT PROBE: <index>`",
                "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int n = scanner.nextInt();\n        int[] readings = new int[n];\n        for (int i = 0; i < n; i++) {\n            readings[i] = scanner.nextInt();\n        }\n        \n        // Cadet: Find max and probe index\n    }\n}",
                "public static void main(String[] args)"
        );

        TestCase w4tc4_1 = new TestCase(w4cc4, "4\n12 85 43 67\n", "MAX DENSITY: 85 AT PROBE: 1\n", "Max at index 1", false);
        TestCase w4tc4_2 = new TestCase(w4cc4, "3\n100 50 25\n", "MAX DENSITY: 100 AT PROBE: 0\n", "Max at index 0", false);
        TestCase w4tc4_h1 = new TestCase(w4cc4, "5\n10 20 90 90 40\n", "MAX DENSITY: 90 AT PROBE: 2\n", "Duplicate max picks first index (2)", true);
        TestCase w4tc4_h2 = new TestCase(w4cc4, "4\n5 15 25 70\n", "MAX DENSITY: 70 AT PROBE: 3\n", "Max at last index (3)", true);
        w4cc4.getTestCases().addAll(List.of(w4tc4_1, w4tc4_2, w4tc4_h1, w4tc4_h2));

        Hint w4h4_1 = new Hint(w4cc4, 1, "Initialize: `int max = readings[0]; int maxIdx = 0;`.", 10);
        Hint w4h4_2 = new Hint(w4cc4, 2, "Use strict greater-than `if (readings[i] > max)` to keep the first occurrence index.", 15);
        w4cc4.getHints().addAll(List.of(w4h4_1, w4h4_2));

        w4m4.setCodingChallenge(w4cc4);
        w4m4 = missionRepository.save(w4m4);

        // World 4 - Mission 5 (BOSS): Quantum Nebula Mesh Synthesis
        Mission w4m5 = new Mission(
                world4,
                5,
                "BOSS: Quantum Nebula Mesh Synthesis",
                "quantum-nebula-mesh-synthesis",
                "Final certification for Starfleet Navigator. Cadets synthesize modular methods and array processing to decode a full quantum transmission grid, reverse corrupt sub-frames, and verify checksum integrity.",
                "Implement calculateChecksum(int[] arr) and printReversed(int[] arr) methods to decode telemetry stream and verify checksum.",
                "Comprehensive Modular & Array System Synthesis",
                350,
                3,
                "BOSS",
                w4m4.getId()
        );
        w4m5.setIsBossMission(true);
        w4m5.setShipSystem("QUANTUM_NAVIGATOR_CORE");

        Lesson w4l5 = new Lesson(
                w4m5,
                "Synthesizing Modular Array Architecture",
                "Pass arrays to and from custom methods to structure enterprise-grade Java pipelines.",
                "### Methods Accepting Arrays\n" +
                "```java\n" +
                "public static int sum(int[] arr) {\n" +
                "    int s = 0;\n" +
                "    for (int v : arr) s += v;\n" +
                "    return s;\n" +
                "}\n" +
                "```",
                "public class Solution {\n    public static void display(int[] a) {\n        for (int v : a) System.out.print(v + \" \");\n        System.out.println();\n    }\n    public static void main(String[] args) {\n        display(new int[]{1, 2, 3});\n    }\n}",
                "[\"Arrays are passed by reference to methods.\", \"Modular methods can process and return array computations cleanly.\", \"Master all 4 sectors to achieve Starfleet Java Navigator ranking.\"]"
        );
        w4l5.setWhyNeeded("The capstone synthesis of the CodeVoyage core Java curriculum.");
        w4m5.setLesson(w4l5);

        CodingChallenge w4cc5 = new CodingChallenge(
                w4m5,
                "Quantum Mesh Telemetry Decoder",
                "Write a complete Java program in class `Solution` that reads integer `size`, followed by `size` integers into an array.\n\nDefine two static methods:\n1. `public static int calculateChecksum(int[] arr)`: returns the sum of all elements in the array.\n2. `public static void printReversed(int[] arr)`: prints array elements from last to first on one line, separated by spaces.\n\nIn `main`, read inputs, call both methods, and output:\n`REVERSED TELEMETRY: <reversed elements separated by space>`\n`CHECKSUM: <checksum>`\n`STATUS: QUANTUM MESH SYNCHRONIZED`",
                "import java.util.Scanner;\n\npublic class Solution {\n    // Cadet: Implement calculateChecksum(int[] arr)\n    \n    // Cadet: Implement printReversed(int[] arr)\n    \n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int size = scanner.nextInt();\n        int[] arr = new int[size];\n        for (int i = 0; i < size; i++) {\n            arr[i] = scanner.nextInt();\n        }\n        \n        // Call methods and print outputs\n    }\n}",
                "public static void main(String[] args)"
        );

        TestCase w4tc5_1 = new TestCase(w4cc5, "4\n10 20 30 40\n", "REVERSED TELEMETRY: 40 30 20 10\nCHECKSUM: 100\nSTATUS: QUANTUM MESH SYNCHRONIZED\n", "4 elements reversed & sum", false);
        TestCase w4tc5_2 = new TestCase(w4cc5, "2\n5 15\n", "REVERSED TELEMETRY: 15 5\nCHECKSUM: 20\nSTATUS: QUANTUM MESH SYNCHRONIZED\n", "2 elements reversed & sum", false);
        TestCase w4tc5_h1 = new TestCase(w4cc5, "5\n1 2 3 4 5\n", "REVERSED TELEMETRY: 5 4 3 2 1\nCHECKSUM: 15\nSTATUS: QUANTUM MESH SYNCHRONIZED\n", "5 elements reversed & sum", true);
        TestCase w4tc5_h2 = new TestCase(w4cc5, "3\n100 200 50\n", "REVERSED TELEMETRY: 50 200 100\nCHECKSUM: 350\nSTATUS: QUANTUM MESH SYNCHRONIZED\n", "3 elements reversed & sum", true);
        w4cc5.getTestCases().addAll(List.of(w4tc5_1, w4tc5_2, w4tc5_h1, w4tc5_h2));

        Hint w4h5_1 = new Hint(w4cc5, 1, "In `printReversed`, loop from `i = arr.length - 1` down to `0` with `i--`.", 10);
        Hint w4h5_2 = new Hint(w4cc5, 2, "In `calculateChecksum`, sum all elements and return the total integer.", 15);
        Hint w4h5_3 = new Hint(w4cc5, 3, "Output `STATUS: QUANTUM MESH SYNCHRONIZED` on the final line.", 20);
        w4cc5.getHints().addAll(List.of(w4h5_1, w4h5_2, w4h5_3));

        w4m5.setCodingChallenge(w4cc5);
        w4m5 = missionRepository.save(w4m5);

        System.out.println("[DataLoader] World 4 (Function Nebula) 5 missions seeded successfully.");
    }

    private void seedAchievements() {
        List<Achievement> standardAchievements = List.of(
                // Learning-focused achievements requested:
                new Achievement("FIRST_LAUNCH", "First Launch", "Complete all foundational directives and initiate your ship launch.", 200, "Rocket"),
                new Achievement("VARIABLE_MASTER", "Variable Master", "Master Java variables, primitive types, and state preservation.", 150, "Cpu"),
                new Achievement("INPUT_SPECIALIST", "Input Specialist", "Harness Java Scanner and parse telemetry inputs from sub-space arrays.", 150, "Radio"),
                new Achievement("LOGIC_PILOT", "Logic Pilot", "Navigate branching conditional systems with boolean decision logic.", 150, "Compass"),
                new Achievement("BUG_HUNTER", "Bug Hunter", "Identify syntax anomalies and resolve compiler errors cleanly.", 100, "Shield"),
                new Achievement("LOOP_EXPLORER", "Loop Explorer", "Automate orbital burns and cyclic instructions with loops.", 200, "Sparkles"),
                new Achievement("CODE_CADET", "Code Cadet", "Complete your first live Java compilation in the starship terminal.", 100, "Terminal"),
                new Achievement("WORLD_CONQUEROR", "World Conqueror", "Clear all sector directives and fully conquer a celestial world.", 300, "Award"),

                // Complementary achievements
                new Achievement("FIRST_STEPS", "First Steps", "Complete your very first starship mission.", 50, "Rocket"),
                new Achievement("FIRST_IGNITION", "First Ignition", "Execute your very first compiled Java program.", 50, "Zap"),
                new Achievement("CONSOLE_HERO", "Console Hero", "Complete Java basics and console output directives.", 100, "Terminal"),
                new Achievement("NO_HINTS", "No Hints", "Complete 5 coding challenges without using any hints.", 200, "Award"),
                new Achievement("IGNIS_STATION_HERO", "Ignis Station Hero", "Complete all 5 foundational missions on Ignis Station.", 300, "Award")
        );

        for (Achievement ach : standardAchievements) {
            if (achievementRepository.findByCode(ach.getCode()).isEmpty()) {
                achievementRepository.save(ach);
            }
        }
    }
}

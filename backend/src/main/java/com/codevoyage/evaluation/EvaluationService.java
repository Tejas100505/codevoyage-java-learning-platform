package com.codevoyage.evaluation;

import com.codevoyage.evaluation.dto.*;
import com.codevoyage.exception.ResourceNotFoundException;
import com.codevoyage.mission.MissionRepository;
import com.codevoyage.progress.UserProgressRepository;
import com.codevoyage.user.User;
import com.codevoyage.user.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EvaluationService {

    private final EvaluationAttemptRepository evaluationAttemptRepository;
    private final UserRepository userRepository;
    private final UserProgressRepository userProgressRepository;
    private final MissionRepository missionRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public EvaluationService(
            EvaluationAttemptRepository evaluationAttemptRepository,
            UserRepository userRepository,
            UserProgressRepository userProgressRepository,
            MissionRepository missionRepository
    ) {
        this.evaluationAttemptRepository = evaluationAttemptRepository;
        this.userRepository = userRepository;
        this.userProgressRepository = userProgressRepository;
        this.missionRepository = missionRepository;
    }

    /**
     * Retrieve question set for PRE_TEST or POST_TEST without exposing correct answer indices.
     */
    public List<EvaluationQuestionDTO> getQuestions(String testType) {
        String normalizedType = "POST_TEST".equalsIgnoreCase(testType) ? "POST_TEST" : "PRE_TEST";
        List<InternalQuestion> pool = "POST_TEST".equals(normalizedType) ? getPostTestQuestions() : getPreTestQuestions();

        return pool.stream()
                .map(q -> new EvaluationQuestionDTO(
                        q.id,
                        q.concept,
                        q.conceptLabel,
                        q.prompt,
                        q.codeSnippet,
                        q.options
                ))
                .collect(Collectors.toList());
    }

    /**
     * Grade submitted answers server-side.
     * Prevents repeated attempts from overwriting original evaluation records unless explicitly configured.
     */
    @Transactional
    public EvaluationComparisonDTO submitEvaluation(String username, EvaluationSubmissionRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Cadet not found: " + username));

        String testType = "POST_TEST".equalsIgnoreCase(request.getTestType()) ? "POST_TEST" : "PRE_TEST";

        // Check if original evaluation exists for this test type to prevent overwrite
        Optional<EvaluationAttempt> existing = evaluationAttemptRepository
                .findFirstByUserIdAndTestTypeOrderBySubmittedAtAsc(user.getId(), testType);

        if (existing.isPresent()) {
            // Already submitted: Do not overwrite original evaluation record! Return comparison.
            return getComparison(username);
        }

        // Grade submission
        List<InternalQuestion> pool = "POST_TEST".equals(testType) ? getPostTestQuestions() : getPreTestQuestions();
        Map<String, Integer> answers = request.getAnswers() != null ? request.getAnswers() : Collections.emptyMap();

        int totalScore = 0;
        int syntaxScore = 0;
        int varScore = 0;
        int dtScore = 0;
        int inputScore = 0;
        int opScore = 0;
        int condScore = 0;

        for (InternalQuestion q : pool) {
            Integer selectedIdx = answers.get(q.id);
            boolean isCorrect = selectedIdx != null && selectedIdx.equals(q.correctAnswerIndex);
            if (isCorrect) {
                totalScore++;
                switch (q.concept) {
                    case "BASIC_SYNTAX" -> syntaxScore++;
                    case "VARIABLES" -> varScore++;
                    case "DATA_TYPES" -> dtScore++;
                    case "INPUT" -> inputScore++;
                    case "OPERATORS" -> opScore++;
                    case "CONDITIONS" -> condScore++;
                }
            }
        }

        double scorePercentage = Math.round((totalScore * 100.0 / pool.size()) * 10.0) / 10.0;

        EvaluationAttempt attempt = new EvaluationAttempt(
                user,
                testType,
                pool.size(),
                totalScore,
                scorePercentage
        );
        attempt.setSyntaxScore(syntaxScore);
        attempt.setVariablesScore(varScore);
        attempt.setDataTypesScore(dtScore);
        attempt.setInputScore(inputScore);
        attempt.setOperatorsScore(opScore);
        attempt.setConditionsScore(condScore);
        attempt.setTimeSpentSeconds(request.getTimeSpentSeconds() != null ? request.getTimeSpentSeconds() : 0L);

        try {
            attempt.setAnswersJson(objectMapper.writeValueAsString(answers));
        } catch (Exception e) {
            attempt.setAnswersJson("{}");
        }

        evaluationAttemptRepository.save(attempt);

        return getComparison(username);
    }

    /**
     * Compute comparative learning evaluation (Pre-test vs Post-test vs Improvement).
     */
    @Transactional(readOnly = true)
    public EvaluationComparisonDTO getComparison(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Cadet not found: " + username));

        List<EvaluationAttempt> attempts = evaluationAttemptRepository.findByUserIdOrderBySubmittedAtAsc(user.getId());
        EvaluationAttempt preAttempt = attempts.stream()
                .filter(a -> "PRE_TEST".equalsIgnoreCase(a.getTestType()))
                .findFirst()
                .orElse(null);

        EvaluationAttempt postAttempt = attempts.stream()
                .filter(a -> "POST_TEST".equalsIgnoreCase(a.getTestType()))
                .findFirst()
                .orElse(null);

        // Check if student has completed relevant World 1 learning journey (5 missions)
        long completedMissions = userProgressRepository.findByUserIdAndCompletedTrue(user.getId()).size();
        boolean canTakePost = preAttempt != null && (completedMissions >= 3 || postAttempt != null);
        String lockReason = null;
        if (preAttempt == null) {
            lockReason = "Pre-Test baseline evaluation must be completed first.";
        } else if (completedMissions < 3 && postAttempt == null) {
            lockReason = String.format("Complete at least 3 Java missions (Current: %d/5) to unlock the Post-Test evaluation.", completedMissions);
        }

        EvaluationComparisonDTO comparison = new EvaluationComparisonDTO();
        comparison.setPreTestCompleted(preAttempt != null);
        comparison.setPostTestCompleted(postAttempt != null);
        comparison.setCanTakePostTest(canTakePost);
        comparison.setPostTestLockedReason(lockReason);

        if (preAttempt != null) {
            comparison.setPreTest(new EvaluationAttemptSummaryDTO(
                    "PRE_TEST",
                    preAttempt.getScore(),
                    preAttempt.getTotalQuestions(),
                    preAttempt.getScorePercentage(),
                    preAttempt.getTimeSpentSeconds(),
                    preAttempt.getSubmittedAt(),
                    Map.of(
                            "basicSyntax", preAttempt.getSyntaxScore(),
                            "variables", preAttempt.getVariablesScore(),
                            "dataTypes", preAttempt.getDataTypesScore(),
                            "input", preAttempt.getInputScore(),
                            "operators", preAttempt.getOperatorsScore(),
                            "conditions", preAttempt.getConditionsScore()
                    )
            ));
        }

        if (postAttempt != null) {
            comparison.setPostTest(new EvaluationAttemptSummaryDTO(
                    "POST_TEST",
                    postAttempt.getScore(),
                    postAttempt.getTotalQuestions(),
                    postAttempt.getScorePercentage(),
                    postAttempt.getTimeSpentSeconds(),
                    postAttempt.getSubmittedAt(),
                    Map.of(
                            "basicSyntax", postAttempt.getSyntaxScore(),
                            "variables", postAttempt.getVariablesScore(),
                            "dataTypes", postAttempt.getDataTypesScore(),
                            "input", postAttempt.getInputScore(),
                            "operators", postAttempt.getOperatorsScore(),
                            "conditions", postAttempt.getConditionsScore()
                    )
            ));
        }

        if (preAttempt != null && postAttempt != null) {
            double prePct = preAttempt.getScorePercentage();
            double postPct = postAttempt.getScorePercentage();
            double gainPct = Math.round((postPct - prePct) * 10.0) / 10.0;
            int rawGain = postAttempt.getScore() - preAttempt.getScore();

            comparison.setScoreImprovementPercentage(gainPct);
            comparison.setAbsoluteScoreGain(rawGain);

            Map<String, Integer> gains = new LinkedHashMap<>();
            gains.put("basicSyntax", postAttempt.getSyntaxScore() - preAttempt.getSyntaxScore());
            gains.put("variables", postAttempt.getVariablesScore() - preAttempt.getVariablesScore());
            gains.put("dataTypes", postAttempt.getDataTypesScore() - preAttempt.getDataTypesScore());
            gains.put("input", postAttempt.getInputScore() - preAttempt.getInputScore());
            gains.put("operators", postAttempt.getOperatorsScore() - preAttempt.getOperatorsScore());
            gains.put("conditions", postAttempt.getConditionsScore() - preAttempt.getConditionsScore());
            comparison.setConceptGains(gains);

            if (gainPct >= 40.0) {
                comparison.setLearningOutcomeSummary("High Learning Gain: Significant conceptual transformation across Java fundamentals.");
            } else if (gainPct > 0) {
                comparison.setLearningOutcomeSummary("Positive Learning Gain: Verifiable advancement in core programming competencies.");
            } else if (gainPct == 0 && postPct >= 80.0) {
                comparison.setLearningOutcomeSummary("Consistently High Mastery: Solid baseline retained through advanced challenges.");
            } else {
                comparison.setLearningOutcomeSummary("Reinforcement Needed: Recommended practice on conditional logic and input handling.");
            }
        }

        return comparison;
    }

    /**
     * Build exportable CSV and JSON learning evaluation dataset for empirical project analysis.
     */
    @Transactional(readOnly = true)
    public List<EvaluationDatasetRecordDTO> getExportableDataset() {
        List<User> users = userRepository.findAll();
        List<EvaluationDatasetRecordDTO> records = new ArrayList<>();

        for (User u : users) {
            List<EvaluationAttempt> userAttempts = evaluationAttemptRepository.findByUserIdOrderBySubmittedAtAsc(u.getId());
            EvaluationAttempt pre = userAttempts.stream().filter(a -> "PRE_TEST".equalsIgnoreCase(a.getTestType())).findFirst().orElse(null);
            EvaluationAttempt post = userAttempts.stream().filter(a -> "POST_TEST".equalsIgnoreCase(a.getTestType())).findFirst().orElse(null);

            if (pre == null && post == null) {
                continue; // Skip accounts without evaluation telemetry
            }

            int completedMissions = userProgressRepository.findByUserIdAndCompletedTrue(u.getId()).size();

            EvaluationDatasetRecordDTO rec = new EvaluationDatasetRecordDTO();
            rec.setUserId(u.getId());
            rec.setUsername(u.getUsername());
            rec.setUserLevel(u.getLevel());
            rec.setTotalXp(u.getXp() != null ? u.getXp() : 0);
            rec.setMissionsCompleted(completedMissions);

            if (pre != null) {
                rec.setPreTestCompleted(true);
                rec.setPreTestScore(pre.getScore());
                rec.setPreTestPercentage(pre.getScorePercentage());
                rec.setPreTestTimeSeconds(pre.getTimeSpentSeconds());
                rec.setPreTestDate(pre.getSubmittedAt());
            } else {
                rec.setPreTestCompleted(false);
            }

            if (post != null) {
                rec.setPostTestCompleted(true);
                rec.setPostTestScore(post.getScore());
                rec.setPostTestPercentage(post.getScorePercentage());
                rec.setPostTestTimeSeconds(post.getTimeSpentSeconds());
                rec.setPostTestDate(post.getSubmittedAt());
            } else {
                rec.setPostTestCompleted(false);
            }

            if (pre != null && post != null) {
                double gain = Math.round((post.getScorePercentage() - pre.getScorePercentage()) * 10.0) / 10.0;
                int rawGain = post.getScore() - pre.getScore();
                rec.setPercentageGain(gain);
                rec.setRawScoreGain(rawGain);

                // Normalized gain formula: (post - pre) / (total - pre) if pre < total
                if (pre.getScore() < pre.getTotalQuestions()) {
                    double normGain = (double) (post.getScore() - pre.getScore()) / (pre.getTotalQuestions() - pre.getScore());
                    if (normGain >= 0.7) rec.setNormalizedLearningGain("HIGH_GAIN (g >= 0.7)");
                    else if (normGain >= 0.3) rec.setNormalizedLearningGain("MEDIUM_GAIN (0.3 <= g < 0.7)");
                    else rec.setNormalizedLearningGain("LOW_GAIN (g < 0.3)");
                } else {
                    rec.setNormalizedLearningGain("MASTERY_CEILING (Pre = 100%)");
                }

                rec.setSyntaxGain(formatGain(pre.getSyntaxScore(), post.getSyntaxScore()));
                rec.setVariablesGain(formatGain(pre.getVariablesScore(), post.getVariablesScore()));
                rec.setDataTypesGain(formatGain(pre.getDataTypesScore(), post.getDataTypesScore()));
                rec.setInputGain(formatGain(pre.getInputScore(), post.getInputScore()));
                rec.setOperatorsGain(formatGain(pre.getOperatorsScore(), post.getOperatorsScore()));
                rec.setConditionsGain(formatGain(pre.getConditionsScore(), post.getConditionsScore()));
            }

            records.add(rec);
        }

        return records;
    }

    private String formatGain(int pre, int post) {
        int diff = post - pre;
        return (diff >= 0 ? "+" : "") + diff;
    }

    // =========================================================================
    // EQUIVALENT BUT DIFFERENT ASSESSMENT POOLS: PRE-TEST & POST-TEST
    // Concepts: Basic Syntax, Variables, Data Types, Input, Operators, Conditions
    // =========================================================================

    private record InternalQuestion(
            String id,
            String concept,
            String conceptLabel,
            String prompt,
            String codeSnippet,
            List<String> options,
            int correctAnswerIndex
    ) {}

    private List<InternalQuestion> getPreTestQuestions() {
        return List.of(
                // 1. Basic Syntax
                new InternalQuestion(
                        "pre-q1",
                        "BASIC_SYNTAX",
                        "Basic Syntax",
                        "Which is the valid declaration for the standard Java application entry point method?",
                        "// Choose standard entrypoint\n___ {\n    System.out.println(\"Boot\");\n}",
                        List.of(
                                "public void main(String[] args)",
                                "public static void main(String[] args)",
                                "static void launch(String args[])",
                                "public static run(String[] args)"
                        ),
                        1 // public static void main(String[] args)
                ),
                // 2. Variables
                new InternalQuestion(
                        "pre-q2",
                        "VARIABLES",
                        "Variables",
                        "What is the output of the following Java variable reassignment code?",
                        "int fuel = 100;\nfuel = fuel - 25;\nfuel = 50;\nSystem.out.println(fuel);",
                        List.of("75", "100", "50", "25"),
                        2 // 50
                ),
                // 3. Data Types
                new InternalQuestion(
                        "pre-q3",
                        "DATA_TYPES",
                        "Data Types",
                        "Which Java data type should be selected to store an exact laser temperature of 384.75?",
                        "// Sensor reading: 384.75\n___ temperature = 384.75;",
                        List.of("int", "boolean", "double", "char"),
                        2 // double
                ),
                // 4. Input
                new InternalQuestion(
                        "pre-q4",
                        "INPUT",
                        "Input",
                        "Which Scanner method reads an entire line of text including whitespace from standard input?",
                        "Scanner scanner = new Scanner(System.in);\nString command = scanner.___;",
                        List.of("scanner.nextInt()", "scanner.nextLine()", "scanner.readString()", "scanner.nextChar()"),
                        1 // scanner.nextLine()
                ),
                // 5. Operators
                new InternalQuestion(
                        "pre-q5",
                        "OPERATORS",
                        "Operators",
                        "In Java integer arithmetic, what is the evaluated result of 17 / 4?",
                        "int ratio = 17 / 4;\nSystem.out.println(ratio);",
                        List.of("4.25", "4", "5", "1"),
                        1 // 4
                ),
                // 6. Conditions
                new InternalQuestion(
                        "pre-q6",
                        "CONDITIONS",
                        "Conditions",
                        "What will be printed when pressure is 85 and radiationLevel is 12?",
                        "int pressure = 85;\nint radiation = 12;\nif (pressure > 90 || radiation < 15) {\n    System.out.println(\"SAFE\");\n} else {\n    System.out.println(\"BREACH\");\n}",
                        List.of("BREACH", "SAFE", "SAFE BREACH", "Compilation Error"),
                        1 // SAFE (because 12 < 15 is true in OR expression)
                )
        );
    }

    private List<InternalQuestion> getPostTestQuestions() {
        return List.of(
                // 1. Basic Syntax (Equivalent test of Java class & statement syntax)
                new InternalQuestion(
                        "post-q1",
                        "BASIC_SYNTAX",
                        "Basic Syntax",
                        "In standard Java, which character is required by the compiler to conclude every executable statement?",
                        "int thrustVector = 450__\nSystem.out.println(thrustVector)__",
                        List.of("Colon (:)", "Period (.)", "Semicolon (;)", "Closing brace (})"),
                        2 // Semicolon (;)
                ),
                // 2. Variables (Equivalent test of memory declaration and modification)
                new InternalQuestion(
                        "post-q2",
                        "VARIABLES",
                        "Variables",
                        "What will the console display after this Java memory update sequence executes?",
                        "int shieldIntegrity = 40;\nint shieldBooster = 30;\nshieldIntegrity += shieldBooster;\nshieldBooster = 10;\nSystem.out.println(shieldIntegrity);",
                        List.of("50", "40", "70", "80"),
                        2 // 70
                ),
                // 3. Data Types (Equivalent test of primitive types and boolean logic)
                new InternalQuestion(
                        "post-q3",
                        "DATA_TYPES",
                        "Data Types",
                        "Which Java data type stores a binary logical state of true or false without quotes?",
                        "// Airlock lock status\n___ isAirlockSealed = true;",
                        List.of("String", "boolean", "byte", "BooleanString"),
                        1 // boolean
                ),
                // 4. Input (Equivalent test of Scanner token stream parsing)
                new InternalQuestion(
                        "post-q4",
                        "INPUT",
                        "Input",
                        "Which method from java.util.Scanner specifically parses the next integer token from terminal input?",
                        "Scanner console = new Scanner(System.in);\nint cadence = console.___;",
                        List.of("console.readInt()", "console.nextInt()", "console.parseNumber()", "console.nextInteger()"),
                        1 // console.nextInt()
                ),
                // 5. Operators (Equivalent test of arithmetic modulo and division)
                new InternalQuestion(
                        "post-q5",
                        "OPERATORS",
                        "Operators",
                        "What is the output of the Java remainder (modulo) operator expression 19 % 5?",
                        "int remainder = 19 % 5;\nSystem.out.println(remainder);",
                        List.of("3", "4", "3.8", "0"),
                        1 // 4
                ),
                // 6. Conditions (Equivalent test of boolean AND logic and conditional branching)
                new InternalQuestion(
                        "post-q6",
                        "CONDITIONS",
                        "Conditions",
                        "What will be printed when powerCore is 75 and oxygenReserve is 95?",
                        "int powerCore = 75;\nint oxygen = 95;\nif (powerCore >= 80 && oxygen >= 90) {\n    System.out.println(\"OPTIMAL\");\n} else if (powerCore >= 60 && oxygen >= 80) {\n    System.out.println(\"OPERATIONAL\");\n} else {\n    System.out.println(\"CRITICAL\");\n}",
                        List.of("OPTIMAL", "OPERATIONAL", "CRITICAL", "None"),
                        1 // OPERATIONAL
                )
        );
    }
}

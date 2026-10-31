package com.codevoyage.execution;

import org.springframework.stereotype.Component;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class DiagnosticParser {

    private static final Pattern LINE_NUMBER_PATTERN = Pattern.compile("(?i)Solution\\.java:(\\d+):");
    private static final Pattern GENERIC_PATH_PATTERN = Pattern.compile("([A-Za-z]:)?([\\\\/][\\w.\\-]+)+[\\\\/]Solution\\.java:?");

    public record DiagnosticInfo(Integer lineNumber, String sanitizedError, String beginnerExplanation) {}

    public DiagnosticInfo parse(String status, String rawStderr) {
        if (rawStderr == null) rawStderr = "";

        // Strip internal OS file paths
        String sanitized = rawStderr.replaceAll("([A-Za-z]:)?[\\\\/][^\\s:]+[\\\\/]Solution\\.java:(\\d+):", "Line $2:")
                .replaceAll("([A-Za-z]:)?[\\\\/][^\\s:]+[\\\\/]Solution\\.java", "Solution.java")
                .trim();

        Integer errorLine = extractLineNumber(rawStderr);
        String explanation = generateBeginnerExplanation(status, rawStderr);

        return new DiagnosticInfo(errorLine, sanitized, explanation);
    }

    private Integer extractLineNumber(String text) {
        if (text == null) return null;
        Matcher matcher = LINE_NUMBER_PATTERN.matcher(text);
        if (matcher.find()) {
            try {
                return Integer.parseInt(matcher.group(1));
            } catch (NumberFormatException ignored) {}
        }
        return null;
    }

    private String generateBeginnerExplanation(String status, String stderr) {
        if ("TIMEOUT".equalsIgnoreCase(status)) {
            return "Your program took too long to finish. Check for infinite loops (like while(true) without a break) or blocking operations.";
        }

        if (stderr == null || stderr.isBlank()) {
            return "Execution halted unexpectedly. Check terminal output for details.";
        }

        String lower = stderr.toLowerCase();

        // 1. Common compiler syntax errors
        if (lower.contains("';' expected")) {
            return "Cadet, you forgot a semicolon ';' at the end of a command statement.";
        }
        if (lower.contains("unclosed string literal")) {
            return "A text string was opened with double quotes '\"' but was never properly closed.";
        }
        if (lower.contains("cannot find symbol")) {
            return "Java does not recognize this variable, method, or symbol name. Verify spelling, capitalization, and ensure it has been declared.";
        }
        if (lower.contains("class, interface, enum, or record expected") || lower.contains("reached end of file while parsing")) {
            return "Mismatched curly braces '{ }'. Ensure every opening brace has a corresponding closing brace.";
        }
        if (lower.contains("incompatible types")) {
            return "Type mismatch: you are attempting to assign a value of one data type to a variable of a different, incompatible type.";
        }
        if (lower.contains("missing return statement")) {
            return "The method signature promises a return value, but code paths exit without returning one.";
        }
        if (lower.contains("variable") && lower.contains("might not have been initialized")) {
            return "You are trying to read a variable before assigning it an initial value.";
        }
        if (lower.contains("not a statement")) {
            return "This line contains invalid Java syntax that the compiler cannot interpret as an executable instruction.";
        }

        // 2. Common runtime errors
        if (lower.contains("arithmeticexception") && lower.contains("/ by zero")) {
            return "Starship math fault: Division by zero detected in calculations.";
        }
        if (lower.contains("nullpointerexception")) {
            return "Null pointer accessed: Attempted to call a method or read data from an unassigned (null) reference.";
        }
        if (lower.contains("arrayindexoutofboundsexception")) {
            return "Array memory fault: Attempted to access an index beyond the bounds of the array.";
        }
        if (lower.contains("numberformatexception")) {
            return "Conversion error: Tried to parse a non-numeric string into a number.";
        }
        if (lower.contains("nosuchelementexception")) {
            return "Scanner reading fault: The input scanner ran out of data while reading tokens.";
        }
        if (lower.contains("stackoverflowerror")) {
            return "Infinite recursion detected: A method is calling itself repeatedly without a terminating base case.";
        }
        if (lower.contains("outofmemoryerror")) {
            return "Memory limit exceeded: The program exceeded sandbox heap allocation.";
        }

        if ("COMPILE_ERROR".equalsIgnoreCase(status)) {
            return "The Java compiler found syntax discrepancies. Inspect the indicated line number.";
        }

        return "Runtime exception encountered during Starfleet simulation.";
    }
}

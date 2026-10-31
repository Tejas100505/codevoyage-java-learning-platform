package com.codevoyage.execution;

import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.stream.Collectors;

@Component
public class OutputNormalizer {

    /**
     * Normalizes output by:
     * - Standardizing line endings to \n (Windows \r\n -> \n, old Mac \r -> \n)
     * - Stripping trailing whitespace from each line
     * - Stripping leading/trailing newlines and overall trailing spaces
     *
     * Crucially: Comparison remains CASE-SENSITIVE.
     */
    public String normalize(String output) {
        if (output == null) {
            return "";
        }

        // Standardize line endings
        String standard = output.replace("\r\n", "\n").replace("\r", "\n");

        // Trim trailing whitespace from each line
        String cleanedLines = Arrays.stream(standard.split("\n", -1))
                .map(this::stripTrailingWhitespace)
                .collect(Collectors.joining("\n"));

        // Strip overall leading and trailing whitespace/newlines
        return cleanedLines.trim();
    }

    /**
     * Exact case-sensitive comparison after normalizing line endings and trailing whitespace.
     */
    public boolean matches(String expected, String actual) {
        String normExpected = normalize(expected);
        String normActual = normalize(actual);
        return normExpected.equals(normActual);
    }

    private String stripTrailingWhitespace(String s) {
        if (s == null || s.isEmpty()) return "";
        int len = s.length();
        while (len > 0 && Character.isWhitespace(s.charAt(len - 1))) {
            len--;
        }
        return s.substring(0, len);
    }
}

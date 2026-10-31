package com.codevoyage.execution;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class DiagnosticParserTest {

    private DiagnosticParser parser;

    @BeforeEach
    void setUp() {
        parser = new DiagnosticParser();
    }

    @Test
    @DisplayName("Should extract compiler error line number and strip internal paths")
    void testParseCompileError() {
        String rawStderr = "C:\\Users\\Vipul\\AppData\\Local\\Temp\\codevoyage_sandbox\\run_123\\Solution.java:5: error: ';' expected\n" +
                "        System.out.println(\"TEST\")\n" +
                "                                  ^\n" +
                "1 error";

        DiagnosticParser.DiagnosticInfo info = parser.parse("COMPILE_ERROR", rawStderr);

        assertEquals(5, info.lineNumber());
        assertFalse(info.sanitizedError().contains("AppData"), "Internal OS temp paths must be sanitized");
        assertTrue(info.sanitizedError().startsWith("Line 5:"));
        assertTrue(info.beginnerExplanation().contains("semicolon"), "Explanation should mention missing semicolon");
    }

    @Test
    @DisplayName("Should parse timeout status with friendly explanation")
    void testParseTimeout() {
        DiagnosticParser.DiagnosticInfo info = parser.parse("TIMEOUT", "Execution timed out after 5000ms");

        assertNull(info.lineNumber());
        assertTrue(info.beginnerExplanation().contains("took too long to finish"));
    }

    @Test
    @DisplayName("Should parse arithmetic division by zero runtime error")
    void testParseArithmeticException() {
        String stderr = "Exception in thread \"main\" java.lang.ArithmeticException: / by zero\n\tat Solution.main(Solution.java:6)";

        DiagnosticParser.DiagnosticInfo info = parser.parse("RUNTIME_ERROR", stderr);

        assertTrue(info.beginnerExplanation().contains("Division by zero"));
    }
}

package com.codevoyage.execution;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class OutputNormalizerTest {

    private OutputNormalizer normalizer;

    @BeforeEach
    void setUp() {
        normalizer = new OutputNormalizer();
    }

    @Test
    @DisplayName("Should normalize Windows CRLF and Mac CR to standard newlines")
    void testNormalizeLineEndings() {
        String inputWindows = "LINE 1\r\nLINE 2\r\nLINE 3\r\n";
        String expected = "LINE 1\nLINE 2\nLINE 3";

        assertEquals(expected, normalizer.normalize(inputWindows));
    }

    @Test
    @DisplayName("Should strip trailing spaces from lines but preserve essential structure")
    void testStripTrailingWhitespace() {
        String input = "IGNIS STATION: ONLINE   \nWARP SPEED: 3 \t\n";
        String expected = "IGNIS STATION: ONLINE\nWARP SPEED: 3";

        assertEquals(expected, normalizer.normalize(input));
    }

    @Test
    @DisplayName("Comparison must remain strictly CASE-SENSITIVE")
    void testCaseSensitivityPreserved() {
        String expected = "IGNIS STATION: ONLINE";
        String actualUpper = "IGNIS STATION: ONLINE  \r\n";
        String actualLower = "ignis station: online\r\n";

        assertTrue(normalizer.matches(expected, actualUpper), "Matching with different whitespace should pass");
        assertFalse(normalizer.matches(expected, actualLower), "Different casing MUST FAIL - comparison is case-sensitive");
    }

    @Test
    @DisplayName("Should handle null and empty outputs gracefully")
    void testNullAndEmptyHandling() {
        assertEquals("", normalizer.normalize(null));
        assertEquals("", normalizer.normalize("   \r\n   \t  "));
        assertTrue(normalizer.matches(null, ""));
    }
}

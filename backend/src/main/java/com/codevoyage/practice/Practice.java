package com.codevoyage.practice;

import jakarta.persistence.*;

@Entity
@Table(name = "practices")
public class Practice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String prompt;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String starterCode;

    @Column(columnDefinition = "TEXT")
    private String expectedOutput;

    public Practice() {}

    public Practice(String prompt, String starterCode, String expectedOutput) {
        this.prompt = prompt;
        this.starterCode = starterCode;
        this.expectedOutput = expectedOutput;
    }

    public Long getId() { return id; }
    public String getPrompt() { return prompt; }
    public String getStarterCode() { return starterCode; }
    public String getExpectedOutput() { return expectedOutput; }
}

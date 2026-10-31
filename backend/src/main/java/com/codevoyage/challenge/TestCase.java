package com.codevoyage.challenge;

import jakarta.persistence.*;

@Entity
@Table(name = "test_cases")
public class TestCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "challenge_id", nullable = false)
    private CodingChallenge challenge;

    @Column(columnDefinition = "TEXT")
    private String input;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String expectedOutput;

    @Column(length = 255)
    private String description;

    @Column(nullable = false)
    private Boolean hidden = false;

    public TestCase() {}

    public TestCase(CodingChallenge challenge, String input, String expectedOutput, String description, Boolean hidden) {
        this.challenge = challenge;
        this.input = input;
        this.expectedOutput = expectedOutput;
        this.description = description;
        this.hidden = hidden != null ? hidden : false;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public CodingChallenge getChallenge() { return challenge; }
    public void setChallenge(CodingChallenge challenge) { this.challenge = challenge; }

    public String getInput() { return input; }
    public void setInput(String input) { this.input = input; }

    public String getExpectedOutput() { return expectedOutput; }
    public void setExpectedOutput(String expectedOutput) { this.expectedOutput = expectedOutput; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Boolean getHidden() { return hidden; }
    public void setHidden(Boolean hidden) { this.hidden = hidden; }
}

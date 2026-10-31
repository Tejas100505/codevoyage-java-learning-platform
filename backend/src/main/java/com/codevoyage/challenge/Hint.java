package com.codevoyage.challenge;

import jakarta.persistence.*;

@Entity
@Table(name = "hints")
public class Hint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "challenge_id", nullable = false)
    private CodingChallenge challenge;

    @Column(nullable = false)
    private Integer hintOrder;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(nullable = false)
    private Integer xpPenalty = 10;

    public Hint() {}

    public Hint(CodingChallenge challenge, Integer hintOrder, String content, Integer xpPenalty) {
        this.challenge = challenge;
        this.hintOrder = hintOrder;
        this.content = content;
        this.xpPenalty = xpPenalty != null ? xpPenalty : 10;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public CodingChallenge getChallenge() { return challenge; }
    public void setChallenge(CodingChallenge challenge) { this.challenge = challenge; }

    public Integer getHintOrder() { return hintOrder; }
    public void setHintOrder(Integer hintOrder) { this.hintOrder = hintOrder; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Integer getXpPenalty() { return xpPenalty; }
    public void setXpPenalty(Integer xpPenalty) { this.xpPenalty = xpPenalty; }
}

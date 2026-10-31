package com.codevoyage.level;

import jakarta.persistence.*;

@Entity
@Table(name = "levels")
public class Level {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer levelNumber;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String javaTopic; // e.g. "Variables and Types", "Conditionals", "OOP Classes"

    @Column(nullable = false)
    private Integer xpReward = 100;

    @Column(nullable = false)
    private Integer starsReward = 3;

    public Level() {}

    public Level(Integer levelNumber, String title, String javaTopic, Integer xpReward, Integer starsReward) {
        this.levelNumber = levelNumber;
        this.title = title;
        this.javaTopic = javaTopic;
        this.xpReward = xpReward;
        this.starsReward = starsReward;
    }

    public Long getId() { return id; }
    public Integer getLevelNumber() { return levelNumber; }
    public String getTitle() { return title; }
    public String getJavaTopic() { return javaTopic; }
    public Integer getXpReward() { return xpReward; }
    public Integer getStarsReward() { return starsReward; }
}

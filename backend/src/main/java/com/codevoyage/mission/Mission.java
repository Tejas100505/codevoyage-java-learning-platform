package com.codevoyage.mission;

import com.codevoyage.challenge.CodingChallenge;
import com.codevoyage.lesson.Lesson;
import com.codevoyage.practice.PracticeQuestion;
import com.codevoyage.world.World;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "missions")
public class Mission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "world_id", nullable = false)
    private World world;

    @Column(nullable = false)
    private Integer missionOrder;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, unique = true, length = 100)
    private String slug;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String story;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String objective;

    @Column(nullable = false, length = 100)
    private String javaConcept;

    @Column(length = 60)
    private String shipSystem; // POWER_CORE, SENSOR_SYSTEM, COMMUNICATION_ARRAY, ENGINE_SYSTEM, NAVIGATION_SYSTEM, etc.

    @Column(nullable = false)
    private Integer xpReward = 100;

    @Column(nullable = false)
    private Integer starsReward = 3;

    @Column(nullable = false, length = 30)
    private String difficulty = "EASY";

    @Column(name = "is_boss_mission", nullable = false)
    private Boolean isBossMission = false;

    @Column(name = "unlock_requirement_mission_id")
    private Long unlockRequirementMissionId;

    @OneToOne(mappedBy = "mission", cascade = CascadeType.ALL, orphanRemoval = true)
    private Lesson lesson;

    @OneToMany(mappedBy = "mission", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("questionNumber ASC")
    private List<PracticeQuestion> practiceQuestions = new ArrayList<>();

    @OneToOne(mappedBy = "mission", cascade = CascadeType.ALL, orphanRemoval = true)
    private CodingChallenge codingChallenge;

    public Mission() {}

    public Mission(World world, Integer missionOrder, String title, String slug, String story, String objective, String javaConcept, Integer xpReward, Integer starsReward, String difficulty, Long unlockRequirementMissionId) {
        this.world = world;
        this.missionOrder = missionOrder;
        this.title = title;
        this.slug = slug;
        this.story = story;
        this.objective = objective;
        this.javaConcept = javaConcept;
        this.xpReward = xpReward != null ? xpReward : 100;
        this.starsReward = starsReward != null ? starsReward : 3;
        this.difficulty = difficulty != null ? difficulty : "EASY";
        this.unlockRequirementMissionId = unlockRequirementMissionId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public World getWorld() { return world; }
    public void setWorld(World world) { this.world = world; }

    public Integer getMissionOrder() { return missionOrder; }
    public void setMissionOrder(Integer missionOrder) { this.missionOrder = missionOrder; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getStory() { return story; }
    public void setStory(String story) { this.story = story; }

    public String getObjective() { return objective; }
    public void setObjective(String objective) { this.objective = objective; }

    public String getJavaConcept() { return javaConcept; }
    public void setJavaConcept(String javaConcept) { this.javaConcept = javaConcept; }

    public String getShipSystem() { return shipSystem; }
    public void setShipSystem(String shipSystem) { this.shipSystem = shipSystem; }

    public Integer getXpReward() { return xpReward; }
    public void setXpReward(Integer xpReward) { this.xpReward = xpReward; }

    public Integer getStarsReward() { return starsReward; }
    public void setStarsReward(Integer starsReward) { this.starsReward = starsReward; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public Boolean getIsBossMission() { return isBossMission; }
    public void setIsBossMission(Boolean isBossMission) { this.isBossMission = isBossMission; }

    public Long getUnlockRequirementMissionId() { return unlockRequirementMissionId; }
    public void setUnlockRequirementMissionId(Long unlockRequirementMissionId) { this.unlockRequirementMissionId = unlockRequirementMissionId; }

    public Lesson getLesson() { return lesson; }
    public void setLesson(Lesson lesson) { this.lesson = lesson; }

    public List<PracticeQuestion> getPracticeQuestions() { return practiceQuestions; }
    public void setPracticeQuestions(List<PracticeQuestion> practiceQuestions) { this.practiceQuestions = practiceQuestions; }

    public CodingChallenge getCodingChallenge() { return codingChallenge; }
    public void setCodingChallenge(CodingChallenge codingChallenge) { this.codingChallenge = codingChallenge; }
}

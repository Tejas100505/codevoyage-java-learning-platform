package com.codevoyage.world;

import com.codevoyage.course.Course;
import com.codevoyage.mission.Mission;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "worlds")
public class World {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false)
    private Integer worldOrder = 1;

    @Column(nullable = false, unique = true, length = 100)
    private String slug;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 100)
    private String theme;

    @Column(columnDefinition = "TEXT")
    private String lore;

    @Column(nullable = false)
    private Boolean unlockedByDefault = false;

    @OneToMany(mappedBy = "world", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("missionOrder ASC")
    private List<Mission> missions = new ArrayList<>();

    public World() {}

    public World(Course course, Integer worldOrder, String slug, String name, String theme, String lore, Boolean unlockedByDefault) {
        this.course = course;
        this.worldOrder = worldOrder;
        this.slug = slug;
        this.name = name;
        this.theme = theme;
        this.lore = lore;
        this.unlockedByDefault = unlockedByDefault != null ? unlockedByDefault : false;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }

    public Integer getWorldOrder() { return worldOrder; }
    public void setWorldOrder(Integer worldOrder) { this.worldOrder = worldOrder; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }

    public String getLore() { return lore; }
    public void setLore(String lore) { this.lore = lore; }

    public Boolean getUnlockedByDefault() { return unlockedByDefault; }
    public void setUnlockedByDefault(Boolean unlockedByDefault) { this.unlockedByDefault = unlockedByDefault; }

    public List<Mission> getMissions() { return missions; }
    public void setMissions(List<Mission> missions) { this.missions = missions; }
}

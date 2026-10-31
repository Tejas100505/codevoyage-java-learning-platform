package com.codevoyage.user;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String password;

    @Column(length = 255)
    private String avatar = "cadet-helm-1";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role = Role.EXPLORER;

    @Column(nullable = false)
    private Integer xp = 0;

    @Column(name = "user_level", nullable = false)
    private Integer level = 1;

    @Column(nullable = false)
    private Integer coins = 50;

    @Column(nullable = false)
    private Integer streak = 0;

    @Column(name = "selected_language", nullable = false, length = 30)
    private String selectedLanguage = "JAVA";

    @Column(nullable = false)
    private Integer stars = 0;

    @Column(nullable = false)
    private Integer currentSector = 1;

    @Column(columnDefinition = "TEXT")
    private String shipSystemsStateJson;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public User() {}

    public User(String username, String email, String password, Role role) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role != null ? role : Role.EXPLORER;
        this.avatar = "cadet-helm-1";
        this.xp = 0;
        this.level = 1;
        this.coins = 50;
        this.streak = 1;
        this.selectedLanguage = "JAVA";
        this.stars = 0;
        this.currentSector = 1;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Integer getXp() { return xp; }
    public void setXp(Integer xp) { this.xp = xp; }

    public Integer getLevel() { return level; }
    public void setLevel(Integer level) { this.level = level; }

    public Integer getCoins() { return coins; }
    public void setCoins(Integer coins) { this.coins = coins; }

    public Integer getStreak() { return streak; }
    public void setStreak(Integer streak) { this.streak = streak; }

    public String getSelectedLanguage() { return selectedLanguage; }
    public void setSelectedLanguage(String selectedLanguage) { this.selectedLanguage = selectedLanguage; }

    public Integer getStars() { return stars; }
    public void setStars(Integer stars) { this.stars = stars; }

    public Integer getCurrentSector() { return currentSector; }
    public void setCurrentSector(Integer currentSector) { this.currentSector = currentSector; }

    public String getShipSystemsStateJson() { return shipSystemsStateJson; }
    public void setShipSystemsStateJson(String shipSystemsStateJson) { this.shipSystemsStateJson = shipSystemsStateJson; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

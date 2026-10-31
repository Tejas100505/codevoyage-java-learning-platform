package com.codevoyage.user.dto;

import com.codevoyage.user.Role;
import java.time.LocalDateTime;

public class UserProfileDTO {
    private Long id;
    private String username;
    private String email;
    private String avatar;
    private Role role;
    private Integer xp;
    private Integer level;
    private Integer coins;
    private Integer streak;
    private String selectedLanguage;
    private Integer stars;
    private Integer currentSector;
    private String rankTitle;
    private LocalDateTime createdAt;

    public UserProfileDTO() {}

    public UserProfileDTO(Long id, String username, String email, String avatar, Role role, Integer xp, Integer level, Integer coins, Integer streak, String selectedLanguage, Integer stars, Integer currentSector, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.avatar = avatar;
        this.role = role;
        this.xp = xp;
        this.level = level;
        this.coins = coins;
        this.streak = streak;
        this.selectedLanguage = selectedLanguage;
        this.stars = stars;
        this.currentSector = currentSector;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

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

    public String getRankTitle() { return rankTitle; }
    public void setRankTitle(String rankTitle) { this.rankTitle = rankTitle; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

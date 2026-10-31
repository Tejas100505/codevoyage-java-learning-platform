package com.codevoyage.user;

public final class UserLevelSystem {

    private UserLevelSystem() {}

    /**
     * Determine user level based on total actual XP:
     * Level 1: 0 - 149 XP     -> Rookie Cadet
     * Level 2: 150 - 349 XP   -> Code Explorer
     * Level 3: 350 - 599 XP   -> Space Navigator
     * Level 4: 600 - 899 XP   -> Code Pilot
     * Level 5: 900 - 1299 XP  -> Galaxy Engineer
     * Level 6+: 1300+ XP      -> Java Commander
     */
    public static int calculateLevel(int xp) {
        if (xp >= 1300) return 6;
        if (xp >= 900) return 5;
        if (xp >= 600) return 4;
        if (xp >= 350) return 3;
        if (xp >= 150) return 2;
        return 1;
    }

    /**
     * Human-readable rank title corresponding to the user's level
     */
    public static String getRankTitle(int level) {
        return switch (level) {
            case 1 -> "Rookie Cadet";
            case 2 -> "Code Explorer";
            case 3 -> "Space Navigator";
            case 4 -> "Code Pilot";
            case 5 -> "Galaxy Engineer";
            case 6 -> "Java Commander";
            default -> "Java Commander";
        };
    }

    /**
     * Threshold required to unlock the next level
     */
    public static int getNextLevelXpThreshold(int level) {
        return switch (level) {
            case 1 -> 150;
            case 2 -> 350;
            case 3 -> 600;
            case 4 -> 900;
            case 5 -> 1300;
            default -> 1300 + (level - 6) * 400;
        };
    }

    /**
     * Floor threshold of the current level
     */
    public static int getCurrentLevelBaseXp(int level) {
        return switch (level) {
            case 1 -> 0;
            case 2 -> 150;
            case 3 -> 350;
            case 4 -> 600;
            case 5 -> 900;
            case 6 -> 1300;
            default -> 1300 + (level - 6) * 400;
        };
    }
}

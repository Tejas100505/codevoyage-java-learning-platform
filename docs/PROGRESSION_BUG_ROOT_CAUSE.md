# CodeVoyage: Progression, Persistence & World Unlocking Root Cause Audit

## 1. Executive Summary

This document details the complete end-to-end audit, architectural analysis, root cause findings, and permanent remediation of the mission progression and world unlocking issues in CodeVoyage.

### Reported Issues
1. **World 1 reset to 0/5 Cleared**: Completing all 5 missions in World 1 (Ignis Station) appeared reset to `Cleared: 0/5`, with missions 2–5 appearing locked upon reopening the world.
2. **Persistence inconsistency across refreshes & restarts**: Completed missions did not reliably remain visibly marked as completed after navigating away, refreshing, or reopening the browser.
3. **World 2 (Kryon Belt) remained locked**: World 2 remained locked even after all 5 World 1 missions had been completed.
4. **World 3 (Nova Sector) displayed `Cleared: 0 / 0`**: World 3 had 0 missions in the database and frontend.
5. **World 4 (Function Nebula) had 0 missions**: World 4 was present on the Galaxy Map but contained no missions.
6. **Hardcoded World 1 unlock notice**: Every locked world displayed a message requiring World 1 Ignis Station instead of its own preceding world prerequisite.

---

## 2. End-to-End Progression Flow Trace

```
+-------------------------------------------------------------+
| 1. Student Java Submission (Monaco Code Editor)             |
+-------------------------------------------------------------+
                             |
                             v
+-------------------------------------------------------------+
| 2. Execution Service (Node.js / Isolated Java 21 Sandbox)   |
|    - Compiles source code with javac                        |
|    - Executes against visible and hidden Test Cases         |
+-------------------------------------------------------------+
                             |
                             v
+-------------------------------------------------------------+
| 3. SubmissionService (Spring Boot Backend)                  |
|    - Validates test case results against canonical outputs  |
|    - Identifies authenticated user via SecurityContext      |
|    - Checks if mission was already completed (prevents      |
|      duplicate XP on replay)                                |
+-------------------------------------------------------------+
                             |
                             v
+-------------------------------------------------------------+
| 4. Database Persistence Layer (PostgreSQL / H2)             |
|    - Table `user_progress`: records completed=true, stars,  |
|      attempts, hints_used, completed_at                     |
|    - Table `submissions`: immutable audit log of executions |
|    - Table `users`: authoritative current_sector, xp, level |
+-------------------------------------------------------------+
                             |
                             v
+-------------------------------------------------------------+
| 5. authoritative Progression Services                      |
|    - `ProgressService.completeMission`: marks mission clear |
|      and unlocks the sequential next mission                |
|    - Automatically evaluates world completion (5/5)         |
|    - Authoritatively unlocks World 2 & updates currentSector|
+-------------------------------------------------------------+
                             |
                             v
+-------------------------------------------------------------+
| 6. REST API Endpoints                                       |
|    - `GET /api/v1/missions/worlds`: returns WorldDTO with   |
|      `unlocked`, `completed`, `clearedMissionsCount`        |
|    - `GET /api/v1/missions/{id}`: returns MissionDetailDTO  |
+-------------------------------------------------------------+
                             |
                             v
+-------------------------------------------------------------+
| 7. Frontend State Hydration (React / Vite)                  |
|    - `GalaxyMap.tsx`: consumes `world.unlocked` and         |
|      `world.completed` directly from backend API            |
|    - Grants permanent replay access for all cleared missions|
+-------------------------------------------------------------+
```

---

## 3. Verified Root Causes

### Root Cause 1: World 2 Unlock Logic Failed to Derive from Persisted Completions
- **Location**: `MissionService.java: mapWorldToDTO`
- **Issue**: World unlocking was evaluated strictly as:
  ```java
  boolean isWorldUnlocked = Boolean.TRUE.equals(world.getUnlockedByDefault())
          || (user != null && user.getCurrentSector() != null && user.getCurrentSector() >= world.getWorldOrder());
  ```
- **Consequence**: The service relied entirely on a snapshot integer `user.currentSector >= worldOrder` and **never verified whether the prerequisite previous world was actually completed**. If `user.getCurrentSector()` was 1, World 2 was locked in the DTO, even though all 5 missions of World 1 were persisted with `completed: true`.

### Root Cause 2: Missing `unlocked` Field on `WorldDTO` and `WorldData`
- **Location**: `WorldDTO.java` and `frontend/src/services/missionService.ts`
- **Issue**: `WorldDTO` only contained `unlockedByDefault`. When serialized to JSON, it never sent a dynamic `unlocked: true/false` field to the frontend.
- **Consequence**: The frontend (`GalaxyMap.tsx`) was forced to guess whether World 2 was unlocked using a local fallback:
  ```typescript
  const isUnlocked = world.worldOrder === 1 || Boolean(world.unlockedByDefault) || (user?.currentSector != null && user.currentSector >= world.worldOrder);
  ```
  Since `world.unlockedByDefault` was `false` for World 2, World 2 remained visually locked on the Galaxy Map.

### Root Cause 3: World Completion and Sector Advancement Blocked on Replay
- **Location**: `ProgressService.java: completeMission`
- **Issue**: The sector unlock check was wrapped inside `if (!wasAlreadyCompleted) { ... }`.
- **Consequence**: If a user replayed Mission 5, or if a user completed Mission 5 when a prior mission had not yet completed and then later cleared the remaining mission, `wasAlreadyCompleted` was `true`. The world completion and sector advancement block was completely skipped, leaving `user.currentSector` stuck at 1.

### Root Cause 4: Transient Session Eviction on Page Refresh
- **Location**: `frontend/src/context/AuthContext.tsx`
- **Issue**: `refreshUser()` contained an unconditional catch block that called `logout()` on *any* network error or startup delay:
  ```typescript
  } catch {
      logout(); // Erased codevoyage_jwt from localStorage
  }
  ```
- **Consequence**: A single delayed server response on page refresh wiped the JWT token from `localStorage`. The page then sent requests anonymously. `/api/v1/missions/worlds` returned the anonymous baseline (`completed = false`, `clearedMissionsCount = 0`, Missions 2–5 locked).

### Root Cause 5: Silent Unauthenticated Submissions
- **Location**: `SubmissionService.java`
- **Issue**: If an unauthenticated cadet submitted code, the sandbox executed it and returned `completed: true` in the HTTP response, but skipped saving because `user` was `null`.
- **Consequence**: The frontend celebrated completion, but nothing was saved in the database. Returning to the Galaxy Map resulted in `0/5 Cleared`.

### Root Cause 6: Missing Missions for World 3 and World 4 in Database Seed
- **Location**: `DataLoader.java: seedWorlds3And4IfMissing`
- **Issue**: `DataLoader` had an early exit `if (courseRepository.count() > 0) return;`. The original seed created `worlds` records for World 3 (Nova Sector) and World 4 (Function Nebula), but never inserted any `missions` for them.
- **Consequence**: World 3 displayed `Cleared: 0 / 0` with an empty mission list, and World 4 had no playable content. Furthermore, an empty world could erroneously be evaluated as completed (`completedCount == totalMissionsCount` when both were 0) if a guard was not strictly checking `totalMissionsCount > 0`.

### Root Cause 7: Hardcoded World 1 Unlock Notice on Galaxy Map
- **Location**: `GalaxyMap.tsx`
- **Issue**: The locked sector click handler was hardcoded to display:
  `Sector Locked: Complete all 5 missions in ${ignisWorld.name} to unlock this sector.`
- **Consequence**: When clicking World 3 or World 4, the UI told the student to complete World 1 Ignis Station, even if World 1 was already completed and the actual prerequisite was World 2 Kryon Belt or World 3 Nova Sector.

---

## 4. Remediation Implemented

1. **Explicit `unlocked` & Prerequisite Attributes in `WorldDTO`**:
   - Added `unlocked`, `requiredWorldName`, `requiredWorldOrder`, and `unlockRequirementText` to `WorldDTO` and frontend `WorldData`.
   - Dynamic per-user unlock status and exact unlock requirements are computed on the backend and transmitted directly to the frontend.

2. **Sequential Prerequisite-Based World Progression**:
   - `MissionService.getAllWorldsWithProgress` computes progression sequentially:
     - World 1 is always unlocked.
     - World $N$ is unlocked if:
       - `unlockedByDefault == true`, OR
       - `user.currentSector >= world.worldOrder`, OR
       - **The preceding world ($N - 1$) is completed for this cadet**.
     - Strict completion rule: `isWorldCompleted = totalMissionsCount > 0 && completedCount >= totalMissionsCount`. Empty worlds never count as completed.
     - If the preceding world is completed, `user.currentSector` is self-healed and persisted to the database.

3. **Replay-Safe, Idempotent Sector Advancement in `ProgressService`**:
   - Moved next-mission unlock and world completion logic outside `if (!wasAlreadyCompleted)`.
   - Replaying a mission never revokes completion, never locks subsequent missions, and never awards duplicate completion XP.

4. **10 Complete Canonical Missions Created for World 3 and World 4**:
   - Implemented `seedWorlds3And4IfMissing()` in `DataLoader.java` running on startup:
     - **World 3 (Nova Sector)**: Missions 11–15 covering While Loops, For Loops, Do-While Loops, Loop Control (break/continue), and the Boss Hyper-Pulsar Stabilization.
     - **World 4 (Function Nebula)**: Missions 16–20 covering Static Methods, Return Values, Array Allocation & Indexing, Array Traversal & Peak Finding, and the Boss Quantum Nebula Synthesis.
   - Each mission includes comprehensive lesson markdown, starter code, solution code, test cases (visible and hidden), hints, and concept tags.

5. **Frontend State Hydration & Dynamic Unlock Notices**:
   - `frontend/src/pages/GalaxyMap.tsx` and `Sectors.tsx` consume `world.unlocked` and `world.unlockRequirementText` dynamically.
   - Clicking any locked world shows its exact contextual prerequisite (e.g. World 3 indicates World 2 Kryon Belt is required).
   - Completed missions display bright green `CLEARED` status and enabled `Replay` buttons.
   - Locked missions show informative prerequisite tags (e.g. `Requires M0X`).

6. **Cadet Session Protection**:
   - `AuthContext.tsx` only removes credentials on HTTP `401 Unauthorized`.
   - `MissionExperience.tsx` warns unauthenticated users with a banner to log in to persist flight telemetry.
   - `SubmissionService.java` provides clear diagnostic feedback on unauthenticated submissions.

---

## 5. Verification & Test Suite

### Automated Backend Tests
All 30 integration test cases passed (`mvnw test`):
- `testCompletingMission1UnlocksMission2` (PASS)
- `testMission1RemainsCompletedAcrossRefreshes` (PASS)
- `testCompletingAll5MissionsProducesCleared5Of5` (PASS)
- `testAllMissionsRemainUnlockedAfterWorldCompletion` (PASS)
- `testFailedReplayDoesNotEraseCompletion` (PASS)
- `testSuccessfulReplayDoesNotAwardDuplicateXP` (PASS)
- `testDifferentUsersHaveIndependentProgress` (PASS)
- `testWorldCompletionCalculatedFromPersistedRecords` (PASS)
- `testWorld2UnlocksWhenAll5World1MissionsCompleted` (PASS)
- `testReplayDoesNotRevokeWorld2Unlock` (PASS)
- `testLockedMissionsRemainLockedWhenPrerequisitesUnmet` (PASS)
- `testWorld3RequiresWorld2Completion` (PASS)
- `testWorld3UnlocksWhenWorld2Completed` (PASS)
- `testWorld4RequiresWorld3Completion` (PASS)
- `testWorld4UnlocksWhenWorld3Completed` (PASS)
- `testEmptyWorldNeverCountsAsCompleted` (PASS)
- Plus 14 user/auth/submission service unit & integration tests.

### Frontend Typecheck
- `npx tsc --noEmit`: 0 errors.

### Live API Verification
- `GET /api/v1/missions/worlds` returns all 4 worlds with 5 missions each (20 missions total).
- Contextual unlock texts correctly chain:
  - World 1: `Initial Sector: Available by default.`
  - World 2: `Complete all required missions in WORLD 1 — IGNIS STATION to unlock WORLD 2 — KRYON BELT.`
  - World 3: `Complete all required missions in WORLD 2 — KRYON BELT to unlock WORLD 3 — NOVA SECTOR.`
  - World 4: `Complete all required missions in WORLD 3 — NOVA SECTOR to unlock WORLD 4 — FUNCTION NEBULA.`


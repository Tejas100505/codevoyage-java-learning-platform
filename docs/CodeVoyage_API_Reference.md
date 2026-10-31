# CodeVoyage: REST API Specification & Endpoint Catalogue

**API Version:** `v1`  
**Base URL:** `http://localhost:8080/api/v1` (with backward-compatible `/api` aliases)  
**Security Scheme:** HTTP Bearer Authentication (`Authorization: Bearer <jwt_token>`)  
**Data Format:** JSON (`application/json`)  

---

## 1. Authentication Endpoints (`AuthController`)

### 1.1 Cadet Registration
- **Route:** `POST /api/v1/auth/register` (or `/api/auth/register`)
- **Authentication:** Public (None)
- **Request Body:**
  ```json
  {
    "username": "cadet_alex",
    "email": "alex@starfleet.academy",
    "password": "SecurePassword123!"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "type": "Bearer",
    "id": 2,
    "username": "cadet_alex",
    "email": "alex@starfleet.academy",
    "role": "EXPLORER"
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: Username or email already registered, or validation constraint failed.

### 1.2 Cadet Login
- **Route:** `POST /api/v1/auth/login` (or `/api/auth/login`)
- **Authentication:** Public (None)
- **Request Body:**
  ```json
  {
    "username": "cadet_alex",
    "password": "SecurePassword123!"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "type": "Bearer",
    "id": 2,
    "username": "cadet_alex",
    "email": "alex@starfleet.academy",
    "role": "EXPLORER"
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: Bad credentials or user not found.

### 1.3 Cadet Logout
- **Route:** `POST /api/v1/auth/logout` (or `/api/auth/logout`)
- **Authentication:** Optional
- **Success Response (200 OK):**
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

---

## 2. Mission & World Endpoints (`MissionController`)

### 2.1 Get All Worlds with Progress
- **Route:** `GET /api/v1/missions/worlds`
- **Authentication:** Optional (authenticated cadets receive populated progress and unlock states; unauthenticated cadets receive baseline defaults).
- **Success Response (200 OK):**
  ```json
  [
    {
      "id": 1,
      "worldOrder": 1,
      "slug": "ignis-station",
      "name": "WORLD 1 — IGNIS STATION",
      "theme": "orbital_platform",
      "lore": "A heavily fortified orbital platform in low solar orbit...",
      "unlockedByDefault": true,
      "unlocked": true,
      "requiredWorldName": null,
      "requiredWorldOrder": null,
      "unlockRequirementText": "Initial Sector: Available by default.",
      "completed": false,
      "clearedMissionsCount": 0,
      "missionsCount": 5,
      "missions": [
        {
          "id": 1,
          "missionOrder": 1,
          "title": "Powering the Console",
          "slug": "powering-the-console",
          "story": "Cadet, our primary telemetry relay is offline...",
          "objective": "Print the operational greeting to initialize the terminal.",
          "javaConcept": "Program Structure & Console Output",
          "shipSystem": "Main Console",
          "unlocked": true,
          "completed": false,
          "attempts": 0,
          "stars": 0,
          "xpEarned": 0,
          "unlockRequirementMissionId": null
        }
      ]
    }
  ]
  ```

### 2.2 Get Mission Details
- **Route:** `GET /api/v1/missions/{missionId}`
- **Authentication:** Optional (identifies authenticated cadet for attempt history).
- **Success Response (200 OK):**
  ```json
  {
    "id": 1,
    "missionOrder": 1,
    "title": "Powering the Console",
    "slug": "powering-the-console",
    "story": "Cadet, our primary telemetry relay is offline...",
    "objective": "Print the operational greeting to initialize the terminal.",
    "javaConcept": "Program Structure & Console Output",
    "shipSystem": "Main Console",
    "unlocked": true,
    "completed": false,
    "lesson": {
      "id": 1,
      "title": "Java Program Structure & Output",
      "conceptSummary": "Every Java program begins with a class and a main method.",
      "detailedExplanation": "Java is an object-oriented language where code lives inside classes...",
      "sampleJavaCode": "public class Solution {\n    public static void main(String[] args) {\n        System.out.println(\"System Online\");\n    }\n}",
      "keyTakeaways": "1. Class names must match filenames. 2. Statements end with semicolons.",
      "whyNeeded": "Outputs allow starship systems to relay diagnostics.",
      "visualRepJson": "{}",
      "syntaxBreakdownJson": "{}",
      "commonMistakesJson": "{}",
      "interactiveSnippet": "System.out.print(\"Ignis \"); System.out.println(\"Station\");",
      "interactiveOptionsJson": "[]"
    },
    "codingChallenge": {
      "id": 1,
      "title": "Ignis Telemetry Initialization",
      "instructions": "Write a Java program that outputs 'Ignis Station Online' to standard output.",
      "starterCode": "public class Solution {\n    public static void main(String[] args) {\n        // Enter code here\n    }\n}",
      "methodSignature": "public static void main(String[] args)",
      "visibleTestCases": [
        {
          "id": 1,
          "input": "",
          "expectedOutput": "Ignis Station Online",
          "description": "Default System Boot"
        }
      ],
      "hints": [
        { "id": 1, "hintOrder": 1, "content": "Use System.out.println(...) to print text with a trailing newline." }
      ]
    },
    "practiceQuestions": [
      {
        "id": 1,
        "questionNumber": 1,
        "prompt": "Which method serves as the entry point of every Java program?",
        "codeSnippet": null,
        "optionsJson": "[\"start()\", \"main()\", \"run()\", \"execute()\"]",
        "correctAnswerIndex": 1,
        "explanation": "Java Virtual Machine invokes public static void main(String[] args) upon launch."
      }
    ]
  }
  ```

---

## 3. Code Submission & Execution (`SubmissionController`)

### 3.1 Run Code (Sandbox Test)
- **Route:** `POST /api/v1/missions/{id}/run`
- **Authentication:** Optional
- **Request Body:**
  ```json
  {
    "sourceCode": "public class Solution {\n    public static void main(String[] args) {\n        System.out.println(\"Ignis Station Online\");\n    }\n}"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "status": "PASSED",
    "passed": true,
    "completed": false,
    "totalTestCases": 1,
    "passedTestCases": 1,
    "stars": 0,
    "xpEarned": 0,
    "executionTimeMs": 142,
    "output": "Ignis Station Online",
    "stderr": "",
    "diagnosticHint": "Test case passed.",
    "testResults": [
      {
        "testCaseId": 1,
        "input": "",
        "expectedOutput": "Ignis Station Online",
        "actualOutput": "Ignis Station Online",
        "passed": true,
        "description": "Default System Boot",
        "hidden": false
      }
    ]
  }
  ```

### 3.2 Submit Code (Official Assessment)
- **Route:** `POST /api/v1/missions/{id}/submit`
- **Authentication:** Required (User details persisted to `user_progress` and `submissions`).
- **Request Body:** Same as `/run`.
- **Success Response (200 OK):**
  ```json
  {
    "status": "PASSED",
    "passed": true,
    "completed": true,
    "totalTestCases": 2,
    "passedTestCases": 2,
    "stars": 3,
    "xpEarned": 100,
    "executionTimeMs": 284,
    "output": "Ignis Station Online",
    "stderr": "",
    "diagnosticHint": "Mission Cleared! Telemetry verified.",
    "testResults": [
      {
        "testCaseId": 1,
        "input": "",
        "expectedOutput": "Ignis Station Online",
        "actualOutput": "Ignis Station Online",
        "passed": true,
        "description": "Default System Boot",
        "hidden": false
      },
      {
        "testCaseId": 2,
        "input": "",
        "expectedOutput": "Ignis Station Online",
        "actualOutput": "Ignis Station Online",
        "passed": true,
        "description": "Hidden Verification Test",
        "hidden": true
      }
    ]
  }
  ```

---

## 4. Progress & Gamification Endpoints (`ProgressController`)

### 4.1 Complete Lesson Step
- **Route:** `POST /api/v1/progress/missions/{missionId}/complete-lesson`
- **Authentication:** Required
- **Success Response (200 OK):**
  ```json
  {
    "message": "Lesson completed successfully",
    "missionId": 1,
    "lessonCompleted": true
  }
  ```

### 4.2 Complete Practice Step
- **Route:** `POST /api/v1/progress/missions/{missionId}/complete-practice`
- **Authentication:** Required
- **Success Response (200 OK):**
  ```json
  {
    "message": "Practice completed successfully",
    "missionId": 1,
    "practiceCompleted": true
  }
  ```

### 4.3 Get Skill Tree Hierarchy
- **Route:** `GET /api/v1/progress/skill-tree`
- **Authentication:** Optional
- **Success Response (200 OK):** Array of `SkillTreeNodeDTO` mapping Java concepts and unlock states.

---

## 5. Learning Analytics Endpoints (`AnalyticsController`)

### 5.1 Cadet Personal Analytics Overview
- **Route:** `GET /api/v1/analytics/me`
- **Authentication:** Required
- **Success Response (200 OK):**
  ```json
  {
    "userId": 1,
    "username": "Tejas",
    "currentXp": 1930,
    "rankTitle": "Java Commander",
    "overallConceptMastery": 88,
    "compilerTestPassRate": 92,
    "codingChallengesCompleted": 10,
    "practiceAccuracyPercentage": 94,
    "firstAttemptClearRate": 80,
    "averageAttemptsPerChallenge": 1.4,
    "hintsUsedCount": 1,
    "activeStudyTimeMinutes": 185,
    "curriculumConcepts": [
      {
        "conceptKey": "VARIABLES",
        "conceptName": "Variables & Primitives",
        "masteryScore": 95,
        "missionsAssociated": 3,
        "status": "MASTERED"
      }
    ]
  }
  ```

### 5.2 Performance Trends Timeline
- **Route:** `GET /api/v1/analytics/trends?range=30d`
- **Authentication:** Required
- **Success Response (200 OK):** Time-series history of daily submissions, pass rates, and study duration.

### 5.3 Diagnostic Error Breakdown
- **Route:** `GET /api/v1/analytics/errors`
- **Authentication:** Required
- **Success Response (200 OK):** Counts of compilation errors, runtime exceptions, infinite loop timeouts, and top syntax mistakes.

### 5.4 Personalized Learning Recommendations
- **Route:** `GET /api/v1/analytics/recommendations`
- **Authentication:** Required
- **Success Response (200 OK):** Tailored drills targeting weakest concept scores or high attempt rates.

---

## 6. Academic Pre/Post Test Evaluation Endpoints (`EvaluationController`)

### 6.1 Get Assessment Questions
- **Route:** `GET /api/v1/evaluation/questions?type=PRE_TEST` (or `POST_TEST`)
- **Authentication:** Public
- **Success Response (200 OK):** Array of assessment questions without leaking answers.

### 6.2 Submit Evaluation Attempt
- **Route:** `POST /api/v1/evaluation/submit`
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "testType": "PRE_TEST",
    "answers": { "1": 2, "2": 0, "3": 3 },
    "timeSpentSeconds": 240
  }
  ```
- **Success Response (200 OK):** `EvaluationComparisonDTO` showing score, percentage, and normalized gain if post-test.

### 6.3 Export Academic Dataset (CSV)
- **Route:** `GET /api/v1/evaluation/dataset/csv`
- **Authentication:** Public / Research
- **Content-Type:** `text/csv`
- **Headers:** `Content-Disposition: attachment; filename="codevoyage_learning_evaluation_dataset.csv"`

---

## 7. User Profile & Dashboard Endpoints (`UserController`)

### 7.1 Cadet Profile Dossier
- **Route:** `GET /api/v1/users/me`
- **Authentication:** Required
- **Success Response (200 OK):** Detailed cadet record including XP, level, rank title, current sector, and achievements list.

### 7.2 Dashboard Summary
- **Route:** `GET /api/v1/users/dashboard`
- **Authentication:** Required
- **Success Response (200 OK):** Fast aggregation of recent missions, active sector, stars, streak, and level progress bar percentages.


package com.codevoyage.evaluation.dto;

import java.time.LocalDateTime;

public class EvaluationDatasetRecordDTO {
    private Long userId;
    private String username;
    private Integer userLevel;
    private Integer totalXp;
    private Integer missionsCompleted;
    private Boolean preTestCompleted;
    private Integer preTestScore;
    private Double preTestPercentage;
    private Long preTestTimeSeconds;
    private LocalDateTime preTestDate;
    private Boolean postTestCompleted;
    private Integer postTestScore;
    private Double postTestPercentage;
    private Long postTestTimeSeconds;
    private LocalDateTime postTestDate;
    private Double percentageGain;
    private Integer rawScoreGain;
    private String normalizedLearningGain; // High Gain, Moderate Gain, or Baseline
    private String syntaxGain;
    private String variablesGain;
    private String dataTypesGain;
    private String inputGain;
    private String operatorsGain;
    private String conditionsGain;

    public EvaluationDatasetRecordDTO() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public Integer getUserLevel() { return userLevel; }
    public void setUserLevel(Integer userLevel) { this.userLevel = userLevel; }

    public Integer getTotalXp() { return totalXp; }
    public void setTotalXp(Integer totalXp) { this.totalXp = totalXp; }

    public Integer getMissionsCompleted() { return missionsCompleted; }
    public void setMissionsCompleted(Integer missionsCompleted) { this.missionsCompleted = missionsCompleted; }

    public Boolean getPreTestCompleted() { return preTestCompleted; }
    public void setPreTestCompleted(Boolean preTestCompleted) { this.preTestCompleted = preTestCompleted; }

    public Integer getPreTestScore() { return preTestScore; }
    public void setPreTestScore(Integer preTestScore) { this.preTestScore = preTestScore; }

    public Double getPreTestPercentage() { return preTestPercentage; }
    public void setPreTestPercentage(Double preTestPercentage) { this.preTestPercentage = preTestPercentage; }

    public Long getPreTestTimeSeconds() { return preTestTimeSeconds; }
    public void setPreTestTimeSeconds(Long preTestTimeSeconds) { this.preTestTimeSeconds = preTestTimeSeconds; }

    public LocalDateTime getPreTestDate() { return preTestDate; }
    public void setPreTestDate(LocalDateTime preTestDate) { this.preTestDate = preTestDate; }

    public Boolean getPostTestCompleted() { return postTestCompleted; }
    public void setPostTestCompleted(Boolean postTestCompleted) { this.postTestCompleted = postTestCompleted; }

    public Integer getPostTestScore() { return postTestScore; }
    public void setPostTestScore(Integer postTestScore) { this.postTestScore = postTestScore; }

    public Double getPostTestPercentage() { return postTestPercentage; }
    public void setPostTestPercentage(Double postTestPercentage) { this.postTestPercentage = postTestPercentage; }

    public Long getPostTestTimeSeconds() { return postTestTimeSeconds; }
    public void setPostTestTimeSeconds(Long postTestTimeSeconds) { this.postTestTimeSeconds = postTestTimeSeconds; }

    public LocalDateTime getPostTestDate() { return postTestDate; }
    public void setPostTestDate(LocalDateTime postTestDate) { this.postTestDate = postTestDate; }

    public Double getPercentageGain() { return percentageGain; }
    public void setPercentageGain(Double percentageGain) { this.percentageGain = percentageGain; }

    public Integer getRawScoreGain() { return rawScoreGain; }
    public void setRawScoreGain(Integer rawScoreGain) { this.rawScoreGain = rawScoreGain; }

    public String getNormalizedLearningGain() { return normalizedLearningGain; }
    public void setNormalizedLearningGain(String normalizedLearningGain) { this.normalizedLearningGain = normalizedLearningGain; }

    public String getSyntaxGain() { return syntaxGain; }
    public void setSyntaxGain(String syntaxGain) { this.syntaxGain = syntaxGain; }

    public String getVariablesGain() { return variablesGain; }
    public void setVariablesGain(String variablesGain) { this.variablesGain = variablesGain; }

    public String getDataTypesGain() { return dataTypesGain; }
    public void setDataTypesGain(String dataTypesGain) { this.dataTypesGain = dataTypesGain; }

    public String getInputGain() { return inputGain; }
    public void setInputGain(String inputGain) { this.inputGain = inputGain; }

    public String getOperatorsGain() { return operatorsGain; }
    public void setOperatorsGain(String operatorsGain) { this.operatorsGain = operatorsGain; }

    public String getConditionsGain() { return conditionsGain; }
    public void setConditionsGain(String conditionsGain) { this.conditionsGain = conditionsGain; }
}

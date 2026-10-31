package com.codevoyage.challenge.dto;

public class HintDTO {
    private Long id;
    private Integer hintOrder;
    private String content;
    private Integer xpPenalty;

    public HintDTO() {}

    public HintDTO(Long id, Integer hintOrder, String content, Integer xpPenalty) {
        this.id = id;
        this.hintOrder = hintOrder;
        this.content = content;
        this.xpPenalty = xpPenalty;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getHintOrder() { return hintOrder; }
    public void setHintOrder(Integer hintOrder) { this.hintOrder = hintOrder; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Integer getXpPenalty() { return xpPenalty; }
    public void setXpPenalty(Integer xpPenalty) { this.xpPenalty = xpPenalty; }
}

package com.codevoyage.user.dto;

public class LanguageUpdateRequest {
    private String language;

    public LanguageUpdateRequest() {}

    public LanguageUpdateRequest(String language) {
        this.language = language;
    }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
}

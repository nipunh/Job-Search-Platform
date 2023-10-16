package com.soen6011.careerservicebackend.common;

import lombok.Getter;

@Getter
public enum ApplicationStatus {
    NULL("NULL"),
    APPLIED("APPLIED"),
    INTERVIEW("INTERVIEW"),
    REJECTED("REJECTED"),
    OFFER("OFFER");

    private final String value;

    ApplicationStatus(String value) {
        this.value = value;
    }

}
package com.soen6011.careerservicebackend.response;

import com.soen6011.careerservicebackend.common.ApplicationStatus;
import com.soen6011.careerservicebackend.model.Candidate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CandidateApplicationStatus {
    private Candidate candidate;
    private ApplicationStatus applicationStatus;

    public CandidateApplicationStatus(Candidate candidate, ApplicationStatus applicationStatus) {
        this.candidate = candidate;
        this.applicationStatus = applicationStatus;
    }
}

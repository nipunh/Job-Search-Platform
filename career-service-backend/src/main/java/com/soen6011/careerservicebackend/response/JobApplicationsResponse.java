package com.soen6011.careerservicebackend.response;

import com.soen6011.careerservicebackend.model.Candidate;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class JobApplicationsResponse {
    private String jobId;
    private List<CandidateApplicationStatus> candidates;
}
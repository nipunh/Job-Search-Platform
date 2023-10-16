package com.soen6011.careerservicebackend.response;

import com.soen6011.careerservicebackend.common.ApplicationStatus;
import com.soen6011.careerservicebackend.model.Candidate;
import com.soen6011.careerservicebackend.model.Employer;
import com.soen6011.careerservicebackend.model.Job;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApplicationResponse {

    private String id;
    private Job job;
    private Employer employer;
    private Candidate candidate;
    private ApplicationStatus status;
}

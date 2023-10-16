package com.soen6011.careerservicebackend.service;

import com.soen6011.careerservicebackend.exception.ResourceNotFoundException;
import com.soen6011.careerservicebackend.model.Application;
import com.soen6011.careerservicebackend.model.Candidate;
import com.soen6011.careerservicebackend.model.Employer;
import com.soen6011.careerservicebackend.model.Job;
import com.soen6011.careerservicebackend.repository.ApplicationRepository;
import com.soen6011.careerservicebackend.response.ApplicationResponse;
import com.soen6011.careerservicebackend.response.CandidateApplicationStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    private final CandidateService candidateService;

    private final EmployerService employerService;

    private final JobService jobService;

    @Autowired
    public ApplicationService(ApplicationRepository applicationRepository,
                              CandidateService candidateService,
                              EmployerService employerService,
                              JobService jobService) {
        this.applicationRepository = applicationRepository;
        this.candidateService = candidateService;
        this.employerService = employerService;
        this.jobService = jobService;
    }

    public List<CandidateApplicationStatus> getCandidateApplications(String employerId, String jobId, Pageable pageable) {

        Page<Application> applications = applicationRepository.findByEmployerIdAndJobId(employerId, jobId, pageable);

        List<CandidateApplicationStatus> candidates = applications.stream()
                .map(app -> {
                    Candidate candidate = candidateService.getCandidateById(app.getCandidateId());
                    return new CandidateApplicationStatus(candidate, app.getStatus());
                })
                .collect(Collectors.toList());
        return candidates;
    }

    public ApplicationResponse getApplication(String applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElse(null);

        Candidate candidate = candidateService.getCandidate(application.getCandidateId());

        Employer employer = employerService.getEmployer(application.getEmployerId());

        Job job = jobService.getJob(application.getJobId());

        ApplicationResponse applicationResponse = new ApplicationResponse();
        applicationResponse.setId(applicationId);
        applicationResponse.setCandidate(candidate);
        applicationResponse.setJob(job);
        applicationResponse.setEmployer(employer);
        applicationResponse.setStatus(application.getStatus());
        return applicationResponse;

    }
}

package com.soen6011.careerservicebackend.service;

import com.soen6011.careerservicebackend.common.ApplicationStatus;
import com.soen6011.careerservicebackend.exception.ResourceNotFoundException;
import com.soen6011.careerservicebackend.mapper.CandidateMapper;
import com.soen6011.careerservicebackend.model.Application;
import com.soen6011.careerservicebackend.model.Candidate;
import com.soen6011.careerservicebackend.model.Job;
import com.soen6011.careerservicebackend.repository.ApplicationRepository;
import com.soen6011.careerservicebackend.repository.CandidateRepository;
import com.soen6011.careerservicebackend.repository.JobRepository;
import com.soen6011.careerservicebackend.request.CandidateUpdateRequest;
import com.soen6011.careerservicebackend.response.CandidateProfileResponse;
import com.soen6011.careerservicebackend.response.LoadFile;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class CandidateService {

    private final CandidateRepository candidateRepository;

    private final JobRepository jobRepository;

    private final ApplicationRepository applicationRepository;

    private final FileService fileService;

    private final CandidateMapper candidateMapper;

    public CandidateService(CandidateRepository candidateRepository, JobRepository jobRepository, ApplicationRepository applicationRepository, FileService fileService, CandidateMapper candidateMapper) {
        this.candidateRepository = candidateRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.fileService = fileService;
        this.candidateMapper = candidateMapper;
    }

    public List<Candidate> getCandidatesByIds(List<String> candidateIds) {
        return (List<Candidate>) candidateRepository.findAllById(candidateIds);
    }

    public Candidate getCandidateById(String candidateId) {
        return candidateRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));
    }

    public boolean applyForJob(String candidateId, String jobId) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (applicationRepository.existsByJobIdAndCandidateId(jobId, candidateId)) {
            return false;
        }

        Application application = new Application();
        application.setJobId(jobId);
        application.setEmployerId(job.getEmployerId());
        application.setCandidateId(candidateId);
        application.setStatus(ApplicationStatus.APPLIED);

        applicationRepository.save(application);

        return true;
    }

    public List<Application> getCandidateApplications(String candidateId) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));

        return applicationRepository.findByCandidateId(candidateId);
    }

    public boolean checkResumeExistence(String candidateId) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));
        return candidate.getResumeId() != null;
    }
    
    public LoadFile downloadCandidateResume(String candidateId) throws IOException {

        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));

        String resumeId = candidate.getResumeId();

        LoadFile loadFile = fileService.downloadFile(resumeId);

        return loadFile;
    }

    public void uploadCandidateResume(String candidateId, MultipartFile file) throws IOException {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));

        try {
            String resumeId = fileService.addFile(file);

            candidate.setResumeId(resumeId);
            candidateRepository.save(candidate);
        } catch (IOException e) {
            throw new IOException("Failed to upload candidate's resume");
        }
    }

    public Application getCandidateApplication(String candidateId, String applicationId) {

        Optional<Application> application = applicationRepository.findById(applicationId);

        if (application.isPresent() && application.get().getCandidateId().equals(candidateId)) {
            return application.get();
        } else {
            return null;
        }
    }

    public Candidate getCandidate(String candidateId) {
        return candidateRepository.findById(candidateId)
                .orElse(null);
    }

    public CandidateProfileResponse getProfileCard(String candidateId) {

        Candidate candidate = candidateRepository.findById(candidateId).orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));

        return candidateMapper.toCandidateProfileResponse(candidate);

    }

    public CandidateProfileResponse updateProfile(String candidateId, CandidateUpdateRequest candidateUpdateRequest) {

        Candidate candidate = candidateRepository.findById(candidateId).orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));

        Candidate updatedCandidate = candidateMapper.fromCandidateUpdateRequest(candidate,candidateUpdateRequest);

        candidateRepository.save(updatedCandidate);

        return candidateMapper.toCandidateProfileResponse(updatedCandidate);

    }

    public void updateApplicationStatus(String candidateId, String jobId, ApplicationStatus status) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));

        Application application = applicationRepository.findByCandidateIdAndJobId(candidateId,jobId).orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        application.setStatus(status);
        applicationRepository.save(application);
    }


    public Page<Candidate> getAllCandidates(Pageable pageable) {
    	return  candidateRepository.findAll(pageable);
    }
    
    public void deleteCandidate(String candidateId) throws Exception {

        try {
        	Candidate candidate = candidateRepository.findById(candidateId)
                    .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));
        	applicationRepository.deleteByCandidateId(candidateId);
            candidateRepository.deleteById(candidateId);
        } catch (Exception e) {
            throw new Exception("Failed to delete candidate");
        }
    }
}

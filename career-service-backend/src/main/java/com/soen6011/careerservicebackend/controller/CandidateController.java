package com.soen6011.careerservicebackend.controller;

import com.soen6011.careerservicebackend.common.ApplicationStatus;
import com.soen6011.careerservicebackend.common.Authority;
import com.soen6011.careerservicebackend.exception.ResourceNotFoundException;
import com.soen6011.careerservicebackend.generate.UserPDFExporter;
import com.soen6011.careerservicebackend.model.Application;
import com.soen6011.careerservicebackend.model.Candidate;
import com.soen6011.careerservicebackend.model.Job;
import com.soen6011.careerservicebackend.request.CandidateUpdateRequest;
import com.soen6011.careerservicebackend.request.LoginRequest;
import com.soen6011.careerservicebackend.request.UpdateStatusRequest;
import com.soen6011.careerservicebackend.response.ApplicationResponse;
import com.soen6011.careerservicebackend.response.CandidateProfileResponse;
import com.soen6011.careerservicebackend.response.LoadFile;
import com.soen6011.careerservicebackend.response.LoginResponse;
import com.soen6011.careerservicebackend.service.ApplicationService;
import com.soen6011.careerservicebackend.service.BaseService;
import com.soen6011.careerservicebackend.service.CandidateService;
import com.soen6011.careerservicebackend.service.JobService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/candidate")
@CrossOrigin("http://localhost:4200")
public class CandidateController {

    private final CandidateService candidateService;

    private final BaseService baseService;

    private final JobService jobService;

    private final ApplicationService applicationService;

    public CandidateController(CandidateService candidateService, BaseService baseService, JobService jobService, ApplicationService applicationService) {
        this.candidateService = candidateService;
        this.baseService = baseService;
        this.jobService = jobService;
        this.applicationService = applicationService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = baseService.login(request, Authority.ROLE_CANDIDATE);

        if (response.getErrorMessage()!=null) {
            return ResponseEntity.badRequest().body(response);
        } else {
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<LoginResponse> signUp(@Valid @RequestBody Candidate candidateToSignUp) {
        LoginResponse response = baseService.signUp(candidateToSignUp, Authority.ROLE_CANDIDATE);

        if (response.getErrorMessage()!=null) {
            return ResponseEntity.badRequest().body(response);
        } else {
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("/{candidateId}/jobs/{jobId}/apply")
    public ResponseEntity<String> applyForJob(@PathVariable String candidateId, @PathVariable String jobId) {
        boolean isApplied = candidateService.applyForJob(candidateId, jobId);
        if (isApplied) {
            return new ResponseEntity<>("Job application submitted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Failed to submit job application", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{candidateId}/applications")
    public ResponseEntity<List<Application>> getCandidateApplications(@PathVariable String candidateId) {
        List<Application> applications = candidateService.getCandidateApplications(candidateId);
        return new ResponseEntity<>(applications, HttpStatus.OK);
    }

    @GetMapping("/{candidateId}/resume/exists")
    public ResponseEntity<Boolean> doesResumeExist(@PathVariable String candidateId) {
        boolean resumeExists = candidateService.checkResumeExistence(candidateId);
        return new ResponseEntity<>(resumeExists, HttpStatus.OK);
    }

    @GetMapping("/{candidateId}/applications/{applicationId}")
    public ResponseEntity<Application> getCandidateApplication(@PathVariable String candidateId,
                                                               @PathVariable String applicationId) {
        Application application = candidateService.getCandidateApplication(candidateId, applicationId);
        if (application != null) {
            return new ResponseEntity<>(application, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{candidateId}")
    public ResponseEntity<Candidate> getCandidate(@PathVariable String candidateId) {
        Candidate candidate = candidateService.getCandidate(candidateId);
        if (candidate != null) {
            return new ResponseEntity<>(candidate, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<ApplicationResponse> getApplication(@PathVariable String applicationId) {
        ApplicationResponse application = applicationService.getApplication(applicationId);
        if (application != null) {
            return new ResponseEntity<>(application, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{candidateId}/applications/{jobId}/status")
    public ResponseEntity<String> updateApplicationStatus(@PathVariable String candidateId,
                                                          @PathVariable String jobId,
                                                          @RequestBody UpdateStatusRequest request) {
        try {
            candidateService.updateApplicationStatus(candidateId, jobId, request.getStatus());
            return new ResponseEntity<>("Application status updated successfully", HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>("Candidate or application not found", HttpStatus.NOT_FOUND);
        }
    }


    @GetMapping("/alljobs")
    public ResponseEntity<Page<Job>> getAllJobs(@RequestParam(defaultValue = "0") Integer page, @RequestParam(defaultValue = "10") Integer size) {
    	Pageable pageable = PageRequest.of(page, size);
        Page<Job> jobs = jobService.getAllJobs(pageable);
        return new ResponseEntity<>(jobs, HttpStatus.OK);
    }

    @GetMapping("/{candidateId}/resume/download")
    public ResponseEntity<ByteArrayResource> download(@PathVariable String candidateId) throws IOException {
        LoadFile loadFile = candidateService.downloadCandidateResume(candidateId);


        ResponseEntity<ByteArrayResource> body = ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(loadFile.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + loadFile.getFilename() + "\"")
                .body(new ByteArrayResource(loadFile.getFile()));

        System.out.println("Returned for "+candidateId);

        return body;
    }

    @GetMapping("/{candidateId}/resume/generate")
    public void generate(@PathVariable String candidateId, HttpServletResponse response) throws IOException {
        Candidate user = candidateService.getCandidateById(candidateId);

        response.setContentType("application/pdf");

        String headerKey = "Content-Disposition";
        String fileName = user.getFirstName() + "_" + user.getLastName()  + "_Resume.pdf";
        String headerValue = "attachment; filename=" + fileName;
        response.setHeader(headerKey, headerValue);

        UserPDFExporter exporter = new UserPDFExporter(user);
        exporter.export(response);
    }

    @PostMapping("/{candidateId}/resume/upload")
    public ResponseEntity<String> uploadResume(@PathVariable String candidateId,
                                               @RequestParam("file") MultipartFile file) {
        try {
            candidateService.uploadCandidateResume(candidateId, file);
            return new ResponseEntity<>("Resume uploaded successfully", HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>("Candidate not found", HttpStatus.NOT_FOUND);
        } catch (IOException e) {
            return new ResponseEntity<>("Failed to upload candidate's resume", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{candidateId}/profile")
    public CandidateProfileResponse getProfileCard(@PathVariable String candidateId) {
        return candidateService.getProfileCard(candidateId);
    }

    @PatchMapping(value = "/{candidateId}/profile")
    public CandidateProfileResponse updateProfile(@PathVariable String candidateId, @RequestBody CandidateUpdateRequest candidateUpdateRequest) {
        return candidateService.updateProfile(candidateId, candidateUpdateRequest);
    }
    
    @GetMapping("/allCandidates")
    public ResponseEntity<Page<Candidate>> getAllCandidates(@RequestParam(defaultValue = "0") Integer page, @RequestParam(defaultValue = "10") Integer size) {
    	Pageable pageable = PageRequest.of(page, size);
        Page<Candidate> candidates = candidateService.getAllCandidates(pageable);
        return new ResponseEntity<>(candidates, HttpStatus.OK);
    }
    
    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteCandidate(@PathVariable String userId) {
        try {
            candidateService.deleteCandidate(userId);
            return new ResponseEntity<>("Candidate deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to delete candidate", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}

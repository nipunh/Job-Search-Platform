package com.soen6011.careerservicebackend.controller;

import com.soen6011.careerservicebackend.common.Authority;
import com.soen6011.careerservicebackend.error.ErrorMessage;
import com.soen6011.careerservicebackend.exception.ResourceNotFoundException;
import com.soen6011.careerservicebackend.model.Candidate;
import com.soen6011.careerservicebackend.model.Employer;
import com.soen6011.careerservicebackend.model.Job;
import com.soen6011.careerservicebackend.request.EmployerUpdateRequest;
import com.soen6011.careerservicebackend.request.LoginRequest;
import com.soen6011.careerservicebackend.response.CandidateApplicationStatus;
import com.soen6011.careerservicebackend.response.EmployerProfileResponse;
import com.soen6011.careerservicebackend.response.JobApplicationsResponse;
import com.soen6011.careerservicebackend.response.LoginResponse;
import com.soen6011.careerservicebackend.service.ApplicationService;
import com.soen6011.careerservicebackend.service.BaseService;
import com.soen6011.careerservicebackend.service.EmployerService;
import com.soen6011.careerservicebackend.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/employer")
@CrossOrigin("http://localhost:4200")
public class EmployerController {

    //TODO: For CICD test - will be deleted
    public static Boolean getEmployers() {
        return Boolean.TRUE;
    }

    private final JobService jobService;

    private final ApplicationService applicationService;

    private final BaseService baseService;

    private final EmployerService employerService;

    @Autowired
    public EmployerController(JobService jobService, ApplicationService applicationService, BaseService baseService, EmployerService employerService) {
        this.jobService = jobService;
        this.applicationService = applicationService;
        this.baseService = baseService;
        this.employerService = employerService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = baseService.login(request, Authority.ROLE_EMPLOYER);

        if (response.getErrorMessage()!=null) {
            return ResponseEntity.badRequest().body(response);
        } else {
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<LoginResponse> signUp(@Valid @RequestBody Employer employerToSignUp) {
        LoginResponse response = baseService.signUp(employerToSignUp, Authority.ROLE_EMPLOYER);

        if (response.getErrorMessage()!=null) {
            return ResponseEntity.badRequest().body(response);
        } else {
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("/jobs")
    public ResponseEntity<String> addJob(@Valid @RequestBody Job job) {
        try {
            jobService.addJob(job);
            return new ResponseEntity<>("Job added successfully", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to add job", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/jobs/{jobId}")
    public ResponseEntity<String> deleteJob(@PathVariable String jobId) {
        try {
            jobService.deleteJob(jobId);
            return new ResponseEntity<>("Job deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to delete job", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/jobs/{jobId}")
    public ResponseEntity<String> updateJob(@PathVariable String jobId, @RequestBody Job updatedJob) {
        try {
            jobService.updateJob(jobId, updatedJob);
            return new ResponseEntity<>("Job updated successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to delete job", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{employerId}/jobs")
    public ResponseEntity<Page<Job>> getJobsByEmployer(@PathVariable String employerId,
                                                       @RequestParam(defaultValue = "0") Integer page,
                                                       @RequestParam(defaultValue = "10") Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Job> jobs = jobService.getJobsByEmployer(employerId, pageable);
        return new ResponseEntity<>(jobs, HttpStatus.OK);
    }

    @GetMapping("/{employerId}/{jobId}/applications")
    public ResponseEntity<JobApplicationsResponse> getApplicationsForJob(@PathVariable String employerId,
                                                                         @PathVariable String jobId,
                                                                         @RequestParam(defaultValue = "0") Integer page,
                                                                         @RequestParam(defaultValue = "10") Integer size) {
        Pageable pageable = PageRequest.of(page, size);

        List<CandidateApplicationStatus> candidateApplications = applicationService.getCandidateApplications(employerId, jobId, pageable);

        JobApplicationsResponse response = new JobApplicationsResponse();
        response.setJobId(jobId);
        response.setCandidates(candidateApplications);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping(value = "/{employerId}/profile")
    public EmployerProfileResponse getProfileCard(@PathVariable String employerId) {
        return employerService.getProfileCard(employerId);
    }

    @GetMapping
    public ResponseEntity<List<EmployerProfileResponse>> getAllEmployers() {
       return ResponseEntity.ok(employerService.getAllEmployers());
    }

    @DeleteMapping(value ="/{employerId}")
    public ResponseEntity<ErrorMessage> deleteEmployer(@PathVariable String employerId) {
        try {
            employerService.deleteEmployer(employerId);
            return ResponseEntity.ok(new ErrorMessage("Employer deleted successfully"));
        }
        catch(ResourceNotFoundException e){
            return new ResponseEntity<>(new ErrorMessage(e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        catch (Exception e) {
            return new ResponseEntity<>(new ErrorMessage("Failed to delete Employer"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping(value = "/{employerId}/profile")
    public EmployerProfileResponse updateProfile(@PathVariable String employerId, @RequestBody EmployerUpdateRequest userUpdateRequest) {
        return employerService.updateProfile(employerId, userUpdateRequest);
    }

    @GetMapping("/{employerId}")
    public ResponseEntity<Employer> getEmployer(@PathVariable String employerId) {
        Employer employer = employerService.getEmployer(employerId);
        if (employer != null) {
            return new ResponseEntity<>(employer, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}

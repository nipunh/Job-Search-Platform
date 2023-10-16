package com.soen6011.careerservicebackend.service;

import com.soen6011.careerservicebackend.exception.ResourceNotFoundException;
import com.soen6011.careerservicebackend.model.Job;
import com.soen6011.careerservicebackend.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class JobService {

    private final JobRepository jobRepository;

    @Autowired
    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public void addJob(Job job) throws Exception {
        try {
            jobRepository.save(job);
        } catch (Exception e) {
            throw new Exception("Failed to add job");
        }
    }

    public Page<Job> getJobsByEmployer(String employerId, Pageable pageable) {
        return jobRepository.findByEmployerId(employerId, pageable);
    }

    public void deleteJob(String jobId) throws Exception {

        try {
            jobRepository.deleteById(jobId);
        } catch (Exception e) {
            throw new Exception("Failed to delete job");
        }
    }

    public void updateJob(String jobId, Job updatedJob) throws Exception {

        Job existingJob = jobRepository.findById(jobId).orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        existingJob.setPosition(updatedJob.getPosition());
        existingJob.setDescription(updatedJob.getDescription());
        existingJob.setLocation(updatedJob.getLocation());
        existingJob.setRequirements(updatedJob.getRequirements());

        try {
            jobRepository.save(existingJob);
        } catch (Exception e) {
            throw new Exception("Failed to update job");
        }
    }
    
    public Page<Job> getAllJobs(Pageable pageable) {
    	return  jobRepository.findAll(pageable);
    }

    public Job getJob(String jobId) {
        return jobRepository.findById(jobId)
                .orElse(null);
    }
}

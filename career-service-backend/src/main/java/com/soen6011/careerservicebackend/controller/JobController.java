package com.soen6011.careerservicebackend.controller;

import com.soen6011.careerservicebackend.model.Job;
import com.soen6011.careerservicebackend.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/jobs")
@CrossOrigin("http://localhost:4200")
public class JobController {

    @Autowired
    private JobService jobService;

    @GetMapping("/{jobId}")
    public ResponseEntity<Job> getJob(@PathVariable String jobId) {
        Job job = jobService.getJob(jobId);
        if (job != null) {
            return new ResponseEntity<>(job, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}

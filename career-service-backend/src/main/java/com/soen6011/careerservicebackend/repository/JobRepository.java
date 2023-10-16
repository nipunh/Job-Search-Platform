package com.soen6011.careerservicebackend.repository;

import com.soen6011.careerservicebackend.model.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobRepository extends MongoRepository<Job, String> {
    Page<Job> findByEmployerId(String employerId, Pageable pageable);

    void deleteByEmployerId(String employerId);
}
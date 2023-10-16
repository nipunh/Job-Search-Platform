package com.soen6011.careerservicebackend.repository;

import com.soen6011.careerservicebackend.model.Candidate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidateRepository extends MongoRepository<Candidate, String> {

    Candidate findByEmailId(String emailId);

    boolean existsByEmailId(String email);

}
package com.soen6011.careerservicebackend.repository;

import com.soen6011.careerservicebackend.common.Authority;
import com.soen6011.careerservicebackend.model.Candidate;
import com.soen6011.careerservicebackend.model.Employer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployerRepository extends MongoRepository<Employer, String> {

    Employer findByEmailId(String emailId);

    boolean existsByEmailId(String email);

    List<Employer> findAllByAuthorityNot(Authority authority);

}
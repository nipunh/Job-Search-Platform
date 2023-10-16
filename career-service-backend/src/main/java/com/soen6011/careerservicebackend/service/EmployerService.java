package com.soen6011.careerservicebackend.service;

import com.soen6011.careerservicebackend.common.Authority;
import com.soen6011.careerservicebackend.exception.ResourceNotFoundException;
import com.soen6011.careerservicebackend.mapper.EmployerMapper;
import com.soen6011.careerservicebackend.model.Employer;
import com.soen6011.careerservicebackend.repository.ApplicationRepository;
import com.soen6011.careerservicebackend.repository.EmployerRepository;
import com.soen6011.careerservicebackend.repository.JobRepository;
import com.soen6011.careerservicebackend.request.EmployerUpdateRequest;
import com.soen6011.careerservicebackend.response.EmployerProfileResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class EmployerService {

    @Autowired
    EmployerMapper employerMapper;


    @Autowired
    EmployerRepository employerRepository;
    @Autowired
    JobRepository jobRepository;
    @Autowired
    ApplicationRepository applicationRepository;

    public EmployerProfileResponse getProfileCard(String employerId) {

        Employer employer = employerRepository.findById(employerId).orElseThrow(() -> new ResourceNotFoundException("Employer not found"));

        return employerMapper.toEmployerProfileResponse(employer);
    }

    public List<EmployerProfileResponse> getAllEmployers() {
        List<Employer> employers = employerRepository.findAllByAuthorityNot(Authority.ROLE_ADMIN);
        if(employers == null || employers.size() == 0){
           return Arrays.asList();
        }
        return employerMapper.toEmployerProfileResponses(employers);
    }

    public void deleteEmployer(String employerId) throws Exception {
        Optional<Employer> employee =  employerRepository.findById(employerId);
        if(!employee.isPresent()) {
            throw new ResourceNotFoundException("Employee Not Found");
        }
            try {
                applicationRepository.deleteByEmployerId(employerId);
                jobRepository.deleteByEmployerId(employerId);
                employerRepository.deleteById(employerId);
            } catch (Exception e) {
                throw new Exception("Failed to delete Employer");
            }
        }

    public EmployerProfileResponse updateProfile(String employerId, EmployerUpdateRequest userUpdateRequest) {

        Employer employer = employerRepository.findById(employerId).orElseThrow(() -> new ResourceNotFoundException("Employer not found"));

        Employer updatedEmployer = employerMapper.fromEmployerUpdateRequest(employer,userUpdateRequest);

        employerRepository.save(updatedEmployer);

        return employerMapper.toEmployerProfileResponse(updatedEmployer);

    }

    public Employer getEmployer(String employerId) {
        return employerRepository.findById(employerId)
                .orElse(null);
    }
}

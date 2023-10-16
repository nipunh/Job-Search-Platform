package com.soen6011.careerservicebackend.mapper;

import com.soen6011.careerservicebackend.model.Employer;
import com.soen6011.careerservicebackend.model.User;
import com.soen6011.careerservicebackend.request.EmployerUpdateRequest;
import com.soen6011.careerservicebackend.response.EmployerProfileResponse;
import com.soen6011.careerservicebackend.response.LoginResponse;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class EmployerMapper implements UserMapper {
    @Override
    public LoginResponse mapUserToLoginResponse(User user) {
        Employer employer = (Employer) user;

        LoginResponse response = new LoginResponse();
        response.setUser(employer);

        return response;
    }

    public EmployerProfileResponse toEmployerProfileResponse(Employer employer) {

        EmployerProfileResponse employerProfileResponse = new EmployerProfileResponse();
        employerProfileResponse.setWebsite(employer.getWebsite());
        employerProfileResponse.setCompanyName(employer.getCompanyName());
        return employerProfileResponse;
    }

    public EmployerProfileResponse toEmployerProfileResponseExceptPassword(Employer employer) {

        EmployerProfileResponse employerProfileResponse = new EmployerProfileResponse();
        employerProfileResponse.setWebsite(employer.getWebsite());
        employerProfileResponse.setCompanyName(employer.getCompanyName());
        employerProfileResponse.setEmailId(employer.getEmailId());
        employerProfileResponse.setEmployerId(employer.getUserId());
        return employerProfileResponse;
    }

    public List<EmployerProfileResponse> toEmployerProfileResponses(List<Employer> employers) {
       return employers.stream().map(employer -> toEmployerProfileResponseExceptPassword(employer)).collect(Collectors.toList());
    }

    public Employer fromEmployerUpdateRequest(Employer employer, EmployerUpdateRequest employerUpdateRequest) {

        employer.setCompanyName(employerUpdateRequest.getCompanyName());
        employer.setWebsite(employerUpdateRequest.getWebsite());
        return employer;
    }
}
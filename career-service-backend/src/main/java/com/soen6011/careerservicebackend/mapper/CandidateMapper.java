package com.soen6011.careerservicebackend.mapper;

import com.soen6011.careerservicebackend.model.Candidate;
import com.soen6011.careerservicebackend.model.Employer;
import com.soen6011.careerservicebackend.model.User;
import com.soen6011.careerservicebackend.request.CandidateUpdateRequest;
import com.soen6011.careerservicebackend.response.CandidateProfileResponse;
import com.soen6011.careerservicebackend.response.LoginResponse;
import org.springframework.stereotype.Component;

@Component
public class CandidateMapper implements UserMapper {
    @Override
    public LoginResponse mapUserToLoginResponse(User user) {
        Candidate candidate = (Candidate) user;

        LoginResponse response = new LoginResponse();
        response.setUser(candidate);

        return response;
    }

    public CandidateProfileResponse toCandidateProfileResponse(Candidate candidate) {

        CandidateProfileResponse candidateProfileResponse = new CandidateProfileResponse();
        candidateProfileResponse.setEducation(candidate.getEducation());
        candidateProfileResponse.setFirstName(candidate.getFirstName());
        candidateProfileResponse.setLastName(candidate.getLastName());
        candidateProfileResponse.setExperience(candidate.getExperience());
        return candidateProfileResponse;

    }

    public Candidate fromCandidateUpdateRequest(Candidate candidate, CandidateUpdateRequest candidateUpdateRequest) {

        candidate.setFirstName(candidateUpdateRequest.getFirstName());
        candidate.setLastName(candidateUpdateRequest.getLastName());
        candidate.setEducation(candidateUpdateRequest.getEducation());
        candidate.setExperience(candidateUpdateRequest.getExperience());

        return candidate;
    }
}

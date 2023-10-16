package com.soen6011.careerservicebackend.service;

import com.soen6011.careerservicebackend.common.Authority;
import com.soen6011.careerservicebackend.exception.AlreadyExistsException;
import com.soen6011.careerservicebackend.mapper.UserMapper;
import com.soen6011.careerservicebackend.model.Candidate;
import com.soen6011.careerservicebackend.model.Employer;
import com.soen6011.careerservicebackend.model.User;
import com.soen6011.careerservicebackend.repository.CandidateRepository;
import com.soen6011.careerservicebackend.repository.EmployerRepository;
import com.soen6011.careerservicebackend.request.LoginRequest;
import com.soen6011.careerservicebackend.response.LoginResponse;
import org.springframework.stereotype.Service;

import java.util.Locale;

import static com.soen6011.careerservicebackend.mapper.UserMapperFactory.getUserMapper;

@Service
public class BaseService {

    private final CandidateRepository candidateRepository;
    private final EmployerRepository employerRepository;

    public BaseService(CandidateRepository candidateRepository, EmployerRepository employerRepository) {
        this.candidateRepository = candidateRepository;
        this.employerRepository = employerRepository;
    }

    public LoginResponse login(LoginRequest request, Authority authorityName) {
        if (request == null) {
            return createErrorLoginResponse("Invalid username or password! Please try again.");
        }

        User savedUser;

        if (authorityName == Authority.ROLE_CANDIDATE) {
            savedUser = candidateRepository.findByEmailId(request.getEmailId().toLowerCase(Locale.ROOT));
        } else if (authorityName == Authority.ROLE_EMPLOYER) {
            savedUser = employerRepository.findByEmailId(request.getEmailId().toLowerCase(Locale.ROOT));
        }
        else if (authorityName == Authority.ROLE_ADMIN) {
            savedUser = employerRepository.findByEmailId(request.getEmailId().toLowerCase(Locale.ROOT));
        }
        else {
            return createErrorLoginResponse("Invalid authority! Please try again.");
        }

        if (savedUser != null && savedUser.getAuthority().equals(authorityName)) {
            if (this.checkValidLogin(savedUser, request.getPassword())) {
                return this.createSuccessLoginResponse(savedUser);
            } else {
                return this.createErrorLoginResponse("Invalid username or password! Please try again.");
            }
        } else {
            return createErrorLoginResponse("User does not exist. Please sign up.");
        }
    }

    private boolean checkValidLogin(User user, String password) {
        String userPassword = user.getPassword();
        //TODO: need to add encryption
        return userPassword != null && userPassword.equals(password);
    }

    public LoginResponse createErrorLoginResponse(String errorMessage) {
        LoginResponse response = new LoginResponse();
        response.setLoginSuccess(false);
        response.setErrorMessage(errorMessage);
        return response;
    }
    public LoginResponse createSuccessLoginResponse(User savedUser) {

        UserMapper userMapper = getUserMapper(savedUser.getAuthority());
        LoginResponse response = userMapper.mapUserToLoginResponse(savedUser);
        response.setLoginSuccess(true);
        //Todo : Add this when authentication is done
//        UserJWT userDetails = (UserJWT) userDetailsService.loadUserByUsername(savedUser.getEmailAddress());
//        response.setAccessToken(jwtService.generateToken(userDetails));
        return response;
    }

    public LoginResponse signUp(User userRequest, Authority authorityName) {

        try {
            this.checkIfEmailIsTakenWithException(userRequest.getEmailId(), authorityName);
        } catch (AlreadyExistsException e) {
            return this.createErrorLoginResponse(e.getMessage());
        }

        User savedUser = null;

        if (authorityName.equals(Authority.ROLE_CANDIDATE)) {

            Candidate candidate = new Candidate();

            candidate.setEmailId(userRequest.getEmailId());
            candidate.setPassword(userRequest.getPassword());
            candidate.setAuthority(userRequest.getAuthority());

            Candidate candidateRequest = (Candidate) userRequest;
            candidate.setFirstName(candidateRequest.getFirstName());
            candidate.setLastName(candidateRequest.getLastName());
            candidate.setEducation(candidateRequest.getEducation());
            candidate.setExperience(candidateRequest.getExperience());

            savedUser = candidateRepository.save(candidate);

        } else if (authorityName.equals(Authority.ROLE_EMPLOYER)) {
            Employer employer = new Employer();

            employer.setEmailId(userRequest.getEmailId());
            employer.setPassword(userRequest.getPassword());
            employer.setAuthority(userRequest.getAuthority());

            Employer employerRequest = (Employer) userRequest;
            employer.setCompanyName(employerRequest.getCompanyName());
            employer.setWebsite(employerRequest.getWebsite());

            savedUser = employerRepository.save(employer);
        } else {
            return this.createErrorLoginResponse("Invalid authority! Please try again.");
        }

        return this.createSuccessLoginResponse(savedUser);
    }

    public void checkIfEmailIsTakenWithException(String email, Authority authorityName) {
        if (this.checkIfEmailIsTaken(email, authorityName)) {
            throw new AlreadyExistsException("User already exists");
        }
    }

    private boolean checkIfEmailIsTaken(String email, Authority authorityName) {

        if(authorityName.equals(Authority.ROLE_CANDIDATE))
            return candidateRepository.existsByEmailId(email);
        else
            return employerRepository.existsByEmailId(email);
    }

}

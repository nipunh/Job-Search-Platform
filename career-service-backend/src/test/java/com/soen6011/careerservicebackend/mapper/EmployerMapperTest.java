package com.soen6011.careerservicebackend.mapper;

import com.soen6011.careerservicebackend.model.Employer;
import com.soen6011.careerservicebackend.request.EmployerUpdateRequest;
import com.soen6011.careerservicebackend.response.EmployerProfileResponse;
import com.soen6011.careerservicebackend.response.LoginResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;

public class EmployerMapperTest {

    private EmployerMapper employerMapper;

    @BeforeEach
    public void setUp() {
        employerMapper = new EmployerMapper();
    }

    @Test
    public void testMapUserToLoginResponse() {
        // Create a mock Employer object
        Employer employer = mock(Employer.class);
        // Set any necessary properties for the mock Employer
        // For example: when(employer.getId()).thenReturn(1L);

        // Call the method to be tested
        LoginResponse loginResponse = employerMapper.mapUserToLoginResponse(employer);

        // Assert the result
        assertEquals(employer, loginResponse.getUser());
    }

    @Test
    public void testToEmployerProfileResponse() {
        // Create a mock Employer object
        Employer employer = mock(Employer.class);
        // Set any necessary properties for the mock Employer
        // For example: when(employer.getWebsite()).thenReturn("www.example.com");
        //                 when(employer.getCompanyName()).thenReturn("Example Company");

        // Call the method to be tested
        EmployerProfileResponse profileResponse = employerMapper.toEmployerProfileResponse(employer);

        // Assert the result
        assertEquals(employer.getWebsite(), profileResponse.getWebsite());
        assertEquals(employer.getCompanyName(), profileResponse.getCompanyName());
    }

    @Test
    public void testToEmployerProfileResponses() {
        // Create a list of mock Employer objects
        List<Employer> employers = new ArrayList<>();
        // Add mock employers to the list
        // For example:
         Employer employer1 = mock(Employer.class);
         Employer employer2 = mock(Employer.class);
         employers.add(employer1);
         employers.add(employer2);

        // Call the method to be tested
        List<EmployerProfileResponse> profileResponses = employerMapper.toEmployerProfileResponses(employers);

        // Assert the result (check the size of the response list and any other necessary checks)
        assertEquals(employers.size(), profileResponses.size());
        // Add additional assertions if needed
    }

    @Test
    public void testFromEmployerUpdateRequest() {
        // Create a mock Employer object
        Employer employer = mock(Employer.class);
        // Create a mock EmployerUpdateRequest object
        EmployerUpdateRequest updateRequest = mock(EmployerUpdateRequest.class);
        // Set any necessary properties for the mock EmployerUpdateRequest
        // For example: when(updateRequest.getCompanyName()).thenReturn("New Company");

        // Call the method to be tested
        Employer updatedEmployer = employerMapper.fromEmployerUpdateRequest(employer, updateRequest);

        // Assert the result
        assertEquals(updateRequest.getCompanyName(), updatedEmployer.getCompanyName());
        // Add additional assertions if needed
    }
}


package com.soen6011.careerservicebackend.service;

import com.soen6011.careerservicebackend.common.Authority;
import com.soen6011.careerservicebackend.exception.ResourceNotFoundException;
import com.soen6011.careerservicebackend.mapper.EmployerMapper;
import com.soen6011.careerservicebackend.model.Employer;
import com.soen6011.careerservicebackend.repository.EmployerRepository;
import com.soen6011.careerservicebackend.request.EmployerUpdateRequest;
import com.soen6011.careerservicebackend.response.EmployerProfileResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

public class EmployerServiceTest {

    @Mock
    private EmployerRepository employerRepository;

    @Mock
    private EmployerMapper employerMapper;

    @InjectMocks
    private EmployerService employerService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetProfileCard_ExistingEmployer_ReturnsProfileResponse() {
        String employerId = "1";
        Employer employer = new Employer();
        // Set up any necessary properties for the mock Employer object
        // For example: employer.setId(1L);

        when(employerRepository.findById(employerId)).thenReturn(Optional.of(employer));

        EmployerProfileResponse expectedResponse = new EmployerProfileResponse();
        // Set up any necessary properties for the expected EmployerProfileResponse
        // For example: expectedResponse.setCompanyName("Example Company");
        //                expectedResponse.setWebsite("www.example.com");

        when(employerMapper.toEmployerProfileResponse(employer)).thenReturn(expectedResponse);

        EmployerProfileResponse actualResponse = employerService.getProfileCard(employerId);

        assertEquals(expectedResponse, actualResponse);
    }

    @Test
    public void testGetProfileCard_NonExistingEmployer_ThrowsResourceNotFoundException() {
        String employerId = "1";
        when(employerRepository.findById(employerId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> employerService.getProfileCard(employerId));
    }

    @Test
    public void testGetAllEmployers_NoEmployers_ReturnsEmptyList() {
        when(employerRepository.findAll()).thenReturn(new ArrayList<>());

        List<EmployerProfileResponse> actualResponses = employerService.getAllEmployers();

        assertEquals(0, actualResponses.size());
    }

    @Test
    public void testGetAllEmployers_ExistingEmployers_ReturnsProfileResponses() {
        List<Employer> employers = new ArrayList<>();
        // Add mock employers to the list
        employers.add(new Employer());

        when(employerRepository.findAll()).thenReturn(employers);

        EmployerProfileResponse expectedResponse = new EmployerProfileResponse();
        // Set up any necessary properties for the expected EmployerProfileResponse
        // For example: expectedResponse.setCompanyName("Example Company");
        //                expectedResponse.setWebsite("www.example.com");

        when(employerRepository.findAllByAuthorityNot(Authority.ROLE_ADMIN)).thenReturn(employers);
        when(employerMapper.toEmployerProfileResponses(employers)).thenReturn(Arrays.asList(expectedResponse));

        List<EmployerProfileResponse> actualResponses = employerService.getAllEmployers();

        assertEquals(1, actualResponses.size());
        assertEquals(expectedResponse, actualResponses.get(0));
    }

    @Test
    public void testUpdateProfile_ExistingEmployer_ReturnsUpdatedProfileResponse() {
        String employerId = "1";
        Employer employer = new Employer();
        // Set up any necessary properties for the mock Employer object
        // For example: employer.setId(1L);

        EmployerUpdateRequest updateRequest = new EmployerUpdateRequest();
        // Set up any necessary properties for the mock EmployerUpdateRequest object
        // For example: updateRequest.setCompanyName("New Company");
        //                updateRequest.setWebsite("www.newcompany.com");

        when(employerRepository.findById(employerId)).thenReturn(Optional.of(employer));

        Employer updatedEmployer = new Employer();
        // Set up any necessary properties for the mock updated Employer object
        // For example: updatedEmployer.setId(1L);
        //                updatedEmployer.setCompanyName("New Company");
        //                updatedEmployer.setWebsite("www.newcompany.com");

        when(employerMapper.fromEmployerUpdateRequest(employer, updateRequest)).thenReturn(updatedEmployer);
        when(employerRepository.save(updatedEmployer)).thenReturn(updatedEmployer);

        EmployerProfileResponse expectedResponse = new EmployerProfileResponse();
        // Set up any necessary properties for the expected EmployerProfileResponse
        // For example: expectedResponse.setCompanyName("New Company");
        //                expectedResponse.setWebsite("www.newcompany.com");

        when(employerMapper.toEmployerProfileResponse(updatedEmployer)).thenReturn(expectedResponse);

        EmployerProfileResponse actualResponse = employerService.updateProfile(employerId, updateRequest);

        assertEquals(expectedResponse, actualResponse);
    }

    @Test
    public void testUpdateProfile_NonExistingEmployer_ThrowsResourceNotFoundException() {
        String employerId = "1";
        EmployerUpdateRequest updateRequest = new EmployerUpdateRequest();

        when(employerRepository.findById(employerId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> employerService.updateProfile(employerId, updateRequest));
    }

    @Test
    public void testGetEmployer_ExistingEmployer_ReturnsEmployer() {
        String employerId = "1";
        Employer expectedEmployer = new Employer();
        // Set up any necessary properties for the expected Employer object
        // For example: expectedEmployer.setId(1L);

        when(employerRepository.findById(employerId)).thenReturn(Optional.of(expectedEmployer));

        Employer actualEmployer = employerService.getEmployer(employerId);

        assertEquals(expectedEmployer, actualEmployer);
    }

    @Test
    public void testGetEmployer_NonExistingEmployer_ReturnsNull() {
        String employerId = "1";
        when(employerRepository.findById(employerId)).thenReturn(Optional.empty());

        Employer actualEmployer = employerService.getEmployer(employerId);

        assertEquals(null, actualEmployer);
    }
}

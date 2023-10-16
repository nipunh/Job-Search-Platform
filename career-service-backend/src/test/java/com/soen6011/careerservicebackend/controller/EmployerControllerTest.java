package com.soen6011.careerservicebackend.controller;

import com.soen6011.careerservicebackend.common.Authority;
import com.soen6011.careerservicebackend.model.Employer;
import com.soen6011.careerservicebackend.model.Job;
import com.soen6011.careerservicebackend.request.EmployerUpdateRequest;
import com.soen6011.careerservicebackend.response.CandidateApplicationStatus;
import com.soen6011.careerservicebackend.response.EmployerProfileResponse;
import com.soen6011.careerservicebackend.response.LoginResponse;
import com.soen6011.careerservicebackend.service.ApplicationService;
import com.soen6011.careerservicebackend.service.BaseService;
import com.soen6011.careerservicebackend.service.EmployerService;
import com.soen6011.careerservicebackend.service.JobService;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.util.Assert;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@RunWith(SpringRunner.class)
@WebMvcTest(EmployerController.class)
class EmployerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JobService jobService;

    @MockBean
    private ApplicationService applicationService;

    @MockBean
    private BaseService baseService;

    @MockBean
    private EmployerService employerService;

    @Test
    public void testGetEmployers() {
        Boolean bool = EmployerController.getEmployers();
        Assert.isTrue(bool.booleanValue());
    }

    @Test
    public void testLogin() throws Exception {
        // Mock the login response
        LoginResponse loginResponse = new LoginResponse();
        when(baseService.login(any(), eq(Authority.ROLE_EMPLOYER))).thenReturn(loginResponse);

        // Perform POST request to /employer/login
        mockMvc.perform(post("/employer/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\": \"testuser\", \"password\": \"testpass\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.errorMessage").doesNotExist());

        // Verify that the login method was called
        verify(baseService, times(1)).login(any(), eq(Authority.ROLE_EMPLOYER));
    }

    @Test
    public void testAddJob() throws Exception {
        mockMvc.perform(post("/employer/jobs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\": \"Software Engineer\", \"description\": \"Job description\"}"))
                .andExpect(status().isCreated())
                .andExpect(content().string("Job added successfully"));

        verify(jobService, times(1)).addJob(any(Job.class));
    }


    @Test
    public void testDeleteJob() throws Exception {
        mockMvc.perform(delete("/employer/jobs/{jobId}", "123"))
                .andExpect(status().isOk())
                .andExpect(content().string("Job deleted successfully"));

        verify(jobService, times(1)).deleteJob("123");
    }


    @Test
    public void testGetProfileCard() throws Exception {
        // Mock the response for getProfileCard
        EmployerProfileResponse profileResponse = new EmployerProfileResponse();
        profileResponse.setCompanyName("company");
        when(employerService.getProfileCard("emp123")).thenReturn(profileResponse);

        mockMvc.perform(get("/employer/{employerId}/profile", "emp123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.companyName").value(profileResponse.getCompanyName())); // Example field to validate

        verify(employerService, times(1)).getProfileCard("emp123");
    }

    @Test
    public void testGetAllEmployers() throws Exception {
        List<EmployerProfileResponse> employerProfiles = new ArrayList<>();
        when(employerService.getAllEmployers()).thenReturn(employerProfiles);

        mockMvc.perform(get("/employer"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(employerProfiles.size())));

        verify(employerService, times(1)).getAllEmployers();
    }

    @Test
    public void testUpdateProfile() throws Exception {
        EmployerProfileResponse updatedProfile = new EmployerProfileResponse();
        updatedProfile.setCompanyName("new Company Name");
        when(employerService.updateProfile(eq("emp123"), any(EmployerUpdateRequest.class))).thenReturn(updatedProfile);

        mockMvc.perform(patch("/employer/{employerId}/profile", "emp123")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"companyName\": \"new Company\"}"))
                .andExpect(status().isOk());

        verify(employerService, times(1)).updateProfile(eq("emp123"), any(EmployerUpdateRequest.class));
    }


    @Test
    public void testGetApplicationsForJob() throws Exception {
        // Mock the response for getApplicationsForJob
        List<CandidateApplicationStatus> applicationStatusList = new ArrayList<>();
        when(applicationService.getCandidateApplications("emp123", "job456", PageRequest.of(0, 10))).thenReturn(applicationStatusList);

        // Perform GET request to /employer/{employerId}/{jobId}/applications
        mockMvc.perform(get("/employer/{employerId}/{jobId}/applications", "emp123", "job456"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.candidates").isArray())
                .andExpect(jsonPath("$.candidates", hasSize(applicationStatusList.size())));

        // Verify that the getCandidateApplications method was called
        verify(applicationService, times(1)).getCandidateApplications("emp123", "job456", PageRequest.of(0, 10));
    }

    @Test
    public void testUpdateJob() throws Exception {
        // Perform PUT request to /employer/jobs/{jobId}
        mockMvc.perform(put("/employer/jobs/{jobId}", "job123")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\": \"Updated Job\", \"description\": \"Updated description\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string("Job updated successfully"));

//        // Verify that the updateJob method was called
//        verify(jobService, times(1)).updateJob("job123", new Job());
    }

    @Test
    public void testGetJobsByEmployer() throws Exception {
        // Mock the response for getJobsByEmployer
        Page<Job> jobPage = new PageImpl<>(Collections.singletonList(new Job()));
        when(jobService.getJobsByEmployer("emp123", PageRequest.of(0, 10))).thenReturn(jobPage);

        // Perform GET request to /employer/{employerId}/jobs
        mockMvc.perform(get("/employer/{employerId}/jobs", "emp123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content", hasSize(jobPage.getContent().size())));

        // Verify that the getJobsByEmployer method was called
        verify(jobService, times(1)).getJobsByEmployer("emp123", PageRequest.of(0, 10));
    }

    @Test
    public void testGetEmployer() throws Exception {
        // Mock the response for getEmployer
        Employer employer = new Employer();
        when(employerService.getEmployer("emp123")).thenReturn(employer);

        // Perform GET request to /employer/{employerId}
        mockMvc.perform(get("/employer/{employerId}", "emp123"))
                .andExpect(status().isOk());

        // Verify that the getEmployer method was called
        verify(employerService, times(1)).getEmployer("emp123");
    }

}
package com.soen6011.careerservicebackend.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmployerUpdateRequest {
    private String companyName;
    private String website;
}
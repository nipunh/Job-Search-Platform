package com.soen6011.careerservicebackend.request;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class CandidateUpdateRequest {

    private String firstName;
    private String lastName;
    private String education;
    private Integer experience;

}

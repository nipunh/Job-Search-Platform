package com.soen6011.careerservicebackend.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CandidateProfileResponse {

    private String firstName;
    private String lastName;
    private String education;
    private Integer experience;

}

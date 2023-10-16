package com.soen6011.careerservicebackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Document(collection = "candidates")
@Getter
@Setter
@Data
public class Candidate extends User {
    private String firstName;
    private String lastName;
    private String education;
    private Integer experience;
    private String resumeId;

    public Candidate(){

    }
    public Candidate(String firstName, String lastName, String education, Integer experience, String resumeId){
        this.firstName = firstName;
        this.lastName = lastName;
        this.education = education;
        this.experience = experience;
        this.resumeId = resumeId;
    }
}
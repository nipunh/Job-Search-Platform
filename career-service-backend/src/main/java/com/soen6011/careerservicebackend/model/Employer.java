package com.soen6011.careerservicebackend.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "employers")
@Getter
@Setter
public class Employer extends User {
    private String companyName;
    private String website;

}
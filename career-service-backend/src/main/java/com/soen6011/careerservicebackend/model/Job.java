package com.soen6011.careerservicebackend.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "jobs")
@Getter
@Setter
public class Job {
    @Id
    private String id;
    private String employerId;
    private String position;
    private String description;
    private String location;
    private String requirements;
}
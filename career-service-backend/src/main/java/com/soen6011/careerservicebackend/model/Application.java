package com.soen6011.careerservicebackend.model;

import com.soen6011.careerservicebackend.common.ApplicationStatus;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "applications")
public class Application {
    @Id
    private String id;
    private String jobId;
    private String employerId;
    private String candidateId;
    private ApplicationStatus status = ApplicationStatus.NULL;

}
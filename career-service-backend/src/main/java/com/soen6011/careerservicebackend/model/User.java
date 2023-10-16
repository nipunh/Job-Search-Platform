package com.soen6011.careerservicebackend.model;

import com.soen6011.careerservicebackend.common.Authority;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;

@Getter
@Setter
public class User {
    @Id
    private String userId;
    @Indexed(unique = true)
    private String emailId;
    private String password;
    private Authority authority;

}
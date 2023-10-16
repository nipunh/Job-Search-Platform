package com.soen6011.careerservicebackend.response;

import com.soen6011.careerservicebackend.model.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {
    boolean loginSuccess;
    String errorMessage;
    String accessToken;
    User user;
}

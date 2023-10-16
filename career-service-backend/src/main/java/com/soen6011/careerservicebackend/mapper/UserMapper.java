package com.soen6011.careerservicebackend.mapper;

import com.soen6011.careerservicebackend.model.User;
import com.soen6011.careerservicebackend.response.LoginResponse;

public interface UserMapper {
    LoginResponse mapUserToLoginResponse(User user);
}
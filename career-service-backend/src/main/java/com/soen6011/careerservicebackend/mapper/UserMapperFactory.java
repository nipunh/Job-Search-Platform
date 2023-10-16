package com.soen6011.careerservicebackend.mapper;

import com.soen6011.careerservicebackend.common.Authority;

public class UserMapperFactory {

    public static UserMapper getUserMapper(Authority authorityName) {
        if (authorityName == Authority.ROLE_CANDIDATE) {
            return new CandidateMapper();
        } else if (authorityName == Authority.ROLE_EMPLOYER || authorityName == Authority.ROLE_ADMIN) {
            return new EmployerMapper();
        }
        else {
            throw new IllegalArgumentException("Invalid authority!");
        }
    }

}

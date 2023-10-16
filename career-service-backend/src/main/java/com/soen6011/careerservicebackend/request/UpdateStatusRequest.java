package com.soen6011.careerservicebackend.request;

import com.soen6011.careerservicebackend.common.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStatusRequest {

    private ApplicationStatus status;
}

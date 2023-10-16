package com.soen6011.careerservicebackend.controller;

import com.soen6011.careerservicebackend.common.Authority;
import com.soen6011.careerservicebackend.request.LoginRequest;
import com.soen6011.careerservicebackend.response.LoginResponse;
import com.soen6011.careerservicebackend.service.BaseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/admin")
@CrossOrigin("http://localhost:4200")
public class AdminController {

    private final BaseService baseService;

    public AdminController(BaseService baseService) {
        this.baseService = baseService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = baseService.login(request, Authority.ROLE_ADMIN);

        if (response.getErrorMessage()!=null) {
            return ResponseEntity.badRequest().body(response);
        } else {
            return ResponseEntity.ok(response);
        }
    }
}

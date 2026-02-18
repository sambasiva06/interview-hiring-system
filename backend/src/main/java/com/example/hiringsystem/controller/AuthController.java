package com.example.hiringsystem.controller;

import com.example.hiringsystem.dto.LoginRequest;
import com.example.hiringsystem.dto.LoginResponse;
import com.example.hiringsystem.dto.RegisterRequest;
import com.example.hiringsystem.dto.UserResponse;
import com.example.hiringsystem.model.User;
import com.example.hiringsystem.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

        private final UserService userService;

        @PostMapping("/register")
        public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
                User user = userService.registerUser(
                                request.getName(),
                                request.getEmail(),
                                request.getPassword(),
                                request.getRole());

                UserResponse response = UserResponse.builder()
                                .userId(user.getId())
                                .name(user.getUsername())
                                .email(user.getEmail())
                                .role(user.getRole())
                                .build();

                return new ResponseEntity<>(response, HttpStatus.CREATED);
        }

        @PostMapping("/login")
        public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
                User user = userService.loginUser(request.getEmail(), request.getPassword());

                LoginResponse response = LoginResponse.builder()
                                .userId(user.getId())
                                .name(user.getUsername())
                                .email(user.getEmail())
                                .role(user.getRole())
                                .build();

                return ResponseEntity.ok(response);
        }
}

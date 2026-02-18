package com.example.hiringsystem.controller;

import com.example.hiringsystem.dto.UserResponse;
import com.example.hiringsystem.model.Role;
import com.example.hiringsystem.model.User;
import com.example.hiringsystem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/interviewers")
    public ResponseEntity<List<UserResponse>> getInterviewers() {
        List<User> interviewers = userService.getUsersByRole(Role.INTERVIEWER);
        List<UserResponse> response = interviewers.stream()
                .map(user -> UserResponse.builder()
                        .userId(user.getId())
                        .name(user.getUsername())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
}

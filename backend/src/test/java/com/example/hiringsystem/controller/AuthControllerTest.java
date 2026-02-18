package com.example.hiringsystem.controller;

import com.example.hiringsystem.dto.LoginRequest;
import com.example.hiringsystem.dto.LoginResponse;
import com.example.hiringsystem.dto.RegisterRequest;
import com.example.hiringsystem.model.Role;
import com.example.hiringsystem.model.User;
import com.example.hiringsystem.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @MockitoBean
        private UserService userService;

        @Autowired
        private ObjectMapper objectMapper;

        @Test
        void shouldRegisterUser() throws Exception {
                RegisterRequest request = RegisterRequest.builder()
                                .name("testuser")
                                .email("test@example.com")
                                .password("password")
                                .role(Role.CANDIDATE)
                                .build();

                User user = User.builder()
                                .id(1L)
                                .username("testuser")
                                .email("test@example.com")
                                .role(Role.CANDIDATE)
                                .build();

                when(userService.registerUser(anyString(), anyString(), anyString(), eq(Role.CANDIDATE)))
                                .thenReturn(user);

                mockMvc.perform(post("/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isCreated())
                                .andExpect(jsonPath("$.name").value("testuser"))
                                .andExpect(jsonPath("$.email").value("test@example.com"));
        }

        @Test
        void shouldLoginUser() throws Exception {
                LoginRequest request = LoginRequest.builder()
                                .email("test@example.com")
                                .password("password")
                                .build();

                User user = User.builder()
                                .id(1L)
                                .username("testuser")
                                .email("test@example.com")
                                .role(Role.CANDIDATE)
                                .build();

                when(userService.loginUser("test@example.com", "password")).thenReturn(user);

                mockMvc.perform(post("/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.userId").value(1))
                                .andExpect(jsonPath("$.name").value("testuser"))
                                .andExpect(jsonPath("$.email").value("test@example.com"));
        }

        @Test
        void shouldReturnUnauthorizedOnLoginFailure() throws Exception {
                LoginRequest request = LoginRequest.builder()
                                .email("wrong@example.com")
                                .password("password")
                                .build();

                when(userService.loginUser(anyString(), anyString()))
                                .thenThrow(new com.example.hiringsystem.exception.InvalidCredentialsException(
                                                "Invalid email or password"));

                mockMvc.perform(post("/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isUnauthorized());
        }

        @Test
        void shouldReturnBadRequestWhenInputInvalid() throws Exception {
                RegisterRequest request = RegisterRequest.builder()
                                .name("")
                                .email("invalid-email")
                                .password("password")
                                .role(null)
                                .build();

                mockMvc.perform(post("/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("Validation failed")));
        }
}

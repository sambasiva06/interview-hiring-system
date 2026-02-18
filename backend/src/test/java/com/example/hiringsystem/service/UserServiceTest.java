package com.example.hiringsystem.service;

import com.example.hiringsystem.exception.EmailAlreadyExistsException;
import com.example.hiringsystem.exception.InvalidCredentialsException;
import com.example.hiringsystem.model.Role;
import com.example.hiringsystem.model.User;
import com.example.hiringsystem.repository.UserRepository;
import com.example.hiringsystem.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    private User user;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .password("encodedPassword")
                .role(Role.CANDIDATE)
                .build();
    }

    @Test
    void shouldRegisterUserSuccessfully() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);

        User registeredUser = userService.registerUser("testuser", "test@example.com", "password", Role.CANDIDATE);

        assertThat(registeredUser).isNotNull();
        assertThat(registeredUser.getEmail()).isEqualTo("test@example.com");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void shouldLoginSuccessfully() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password", "encodedPassword")).thenReturn(true);

        User loggedInUser = userService.loginUser("test@example.com", "password");

        assertThat(loggedInUser).isNotNull();
        assertThat(loggedInUser.getEmail()).isEqualTo("test@example.com");
    }

    @Test
    void shouldThrowExceptionWhenLoginEmailNotFound() {
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.loginUser("nonexistent@example.com", "password"))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessageContaining("Invalid email or password");
    }

    @Test
    void shouldThrowExceptionWhenLoginPasswordMismatches() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongPassword", "encodedPassword")).thenReturn(false);

        assertThatThrownBy(() -> userService.loginUser("test@example.com", "wrongPassword"))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessageContaining("Invalid email or password");
    }

    @Test
    void shouldThrowExceptionWhenEmailExists() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> userService.registerUser("testuser", "test@example.com", "password", Role.CANDIDATE))
                .isInstanceOf(EmailAlreadyExistsException.class)
                .hasMessageContaining("Email already exists");

        verify(userRepository, never()).save(any(User.class));
    }
}

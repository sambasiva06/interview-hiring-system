package com.example.hiringsystem.service.impl;

import com.example.hiringsystem.exception.EmailAlreadyExistsException;
import com.example.hiringsystem.exception.InvalidCredentialsException;
import com.example.hiringsystem.model.Role;
import com.example.hiringsystem.model.User;
import com.example.hiringsystem.repository.UserRepository;
import com.example.hiringsystem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User registerUser(String name, String email, String password, Role role) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new EmailAlreadyExistsException("Email already exists: " + email);
        }
        if (userRepository.findByUsername(name).isPresent()) {
            throw new EmailAlreadyExistsException("Username already exists: " + name);
        }

        String encodedPassword = passwordEncoder.encode(password);
        User user = User.builder()
                .username(name)
                .email(email)
                .password(encodedPassword != null ? encodedPassword : password) // Should never be null but satisfies
                                                                                // lint
                .role(role)
                .build();

        return userRepository.save(user);
    }

    @Override
    public User loginUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        return user;
    }

    @Override
    public java.util.List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }
}

package com.example.hiringsystem.repository;

import com.example.hiringsystem.model.Role;
import com.example.hiringsystem.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldSaveUserWithRole() {
        User user = User.builder()
                .username("testadmin")
                .email("admin@example.com")
                .password("password")
                .role(Role.ADMIN)
                .build();

        User savedUser = userRepository.save(user);

        assertThat(savedUser.getId()).isNotNull();
        assertThat(savedUser.getRole()).isEqualTo(Role.ADMIN);
    }

    @Test
    void shouldFindByUsername() {
        User user = User.builder()
                .username("recruiter1")
                .email("recruiter@example.com")
                .password("password")
                .role(Role.RECRUITER)
                .build();
        userRepository.save(user);

        Optional<User> found = userRepository.findByUsername("recruiter1");

        assertThat(found).isPresent();
        assertThat(found.get().getRole()).isEqualTo(Role.RECRUITER);
    }
}

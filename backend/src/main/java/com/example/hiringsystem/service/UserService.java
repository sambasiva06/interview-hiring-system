package com.example.hiringsystem.service;

import com.example.hiringsystem.model.Role;
import com.example.hiringsystem.model.User;

public interface UserService {
    User registerUser(String name, String email, String password, Role role);

    User loginUser(String email, String password);

    java.util.List<User> getUsersByRole(Role role);
}

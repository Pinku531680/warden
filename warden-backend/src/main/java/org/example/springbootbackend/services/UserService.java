package org.example.springbootbackend.services;

import org.example.springbootbackend.model.User;

import java.util.List;

public interface UserService {

    User addUser(User user);

    List<User> getUsers();

    void addUsers(List<User> users);
}

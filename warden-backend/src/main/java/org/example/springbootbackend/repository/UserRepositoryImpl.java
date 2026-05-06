package org.example.springbootbackend.repository;

import org.example.springbootbackend.model.User;

import java.util.List;

public class UserRepositoryImpl implements UserRepositoryCustom {

    @Override
    public void bulkInsertUsers(List<User> users) {

        System.out.printf("Processed %d users\n", users.size());

        System.out.println("-".repeat(30));
    }
}

package org.example.springbootbackend.services;
import org.example.springbootbackend.model.User;
import org.example.springbootbackend.entity.UserEntity;
import org.example.springbootbackend.model.User;
import org.example.springbootbackend.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.beans.Beans;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class UserServiceImpl implements UserService {

    final
    UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    @Override
    public User addUser(User user) {
        UserEntity userEntity = new UserEntity();

        BeanUtils.copyProperties(user, userEntity);

        userRepository.save(userEntity);

        return user;
    }

    @Override
    public List<User> getUsers() {

        List<UserEntity> userEntities = userRepository.findAll();

        List<User> users = userEntities.stream().map(User::new).toList();

        return users;
    }

    @Override
    public void addUsers(List<User> users) {

        System.out.println("Adding Users...");

        userRepository.bulkInsertUsers(users);
    }
}

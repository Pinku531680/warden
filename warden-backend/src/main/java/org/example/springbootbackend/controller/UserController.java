package org.example.springbootbackend.controller;
import org.example.springbootbackend.model.User;
import org.example.springbootbackend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/add-user")
    public User addUser(@RequestBody User user) {
        return userService.addUser(user);
    }

    @PostMapping("/add-users")
    public ResponseEntity<?> addUsers(@RequestBody List<User> users) {

        userService.addUsers(users);

        Map<String, String> response = new HashMap<>();
        response.put("statusCode", "200");
        response.put("status", "success");
        response.put("message", "Batch of " + users.size() + " added in DB");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/users")
    public List<User> getUsers() {
        return userService.getUsers();
    }
}

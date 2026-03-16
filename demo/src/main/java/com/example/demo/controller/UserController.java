package com.example.demo.controller;

import com.example.demo.repository.model.UserEntity;
import com.example.demo.repository.model.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserInfo>> getUsers() {
        List<UserEntity> users = userRepository.findAll();
        List<UserInfo> resultUsers = new ArrayList<>();
        for (UserEntity user : users) {
            resultUsers.add(new UserInfo(user.getId(), user.getFirstName(), user.getLastName()));
        }
        return ResponseEntity.ok(resultUsers);
    }

    @PostMapping("/users")
    public ResponseEntity<UserInfo> createUser(@RequestBody UserInfo userInfo) {
        UserEntity entity = new UserEntity(userInfo.getFirstName(), userInfo.getLastName());
        UserEntity saved = userRepository.save(entity);
        return ResponseEntity.ok(new UserInfo(saved.getId(), saved.getFirstName(), saved.getLastName()));
    }


    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<UserInfo> updateUser(@PathVariable Long id, @RequestBody UserInfo userInfo) {
        UserEntity user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setFirstName(userInfo.getFirstName());
        user.setLastName(userInfo.getLastName());
        userRepository.save(user);
        return ResponseEntity.ok(new UserInfo(user.getId(), user.getFirstName(), user.getLastName()));
    }

    @PutMapping("/users/rename-all-to-efimov")
    public ResponseEntity<Void> renameAllToEfimov() {
        List<UserEntity> users = userRepository.findAll();
        for (UserEntity user : users) {
            user.setLastName("Ефимов");
            userRepository.save(user);
        }
        return ResponseEntity.ok().build();
    }
}

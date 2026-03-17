package com.example.demo.controller;

import com.example.demo.repository.model.UserEntity;
import com.example.demo.repository.model.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

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
        List<UserInfo> result = users.stream().map(u -> new UserInfo(u.getId(), u.getFirstName(), u.getLastName(), u.getAge()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody UserInfo userInfo) {
        if ((userInfo.getAge() == 0) || (userInfo.getAge() < 0) || (userInfo.getAge() > 100)) {
            return ResponseEntity.badRequest().body("Wrong age");
        }

        UserEntity saved = userRepository.save(
                new UserEntity(userInfo.getFirstName(), userInfo.getLastName(), userInfo.getAge())
        );
        return ResponseEntity.ok(new UserInfo(saved.getId(), saved.getFirstName(), saved.getLastName(), saved.getAge()));
    }

    @DeleteMapping("/users")
    public ResponseEntity<Void> deleteAllUsers() {
        userRepository.deleteAll();
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserInfo userInfo) {
        if ((userInfo.getAge() == 0) || (userInfo.getAge() < 0) || (userInfo.getAge() > 100)) {
            return ResponseEntity.badRequest().body("Wrong age");
        }

        UserEntity user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setFirstName(userInfo.getFirstName());
        user.setLastName(userInfo.getLastName());
        user.setAge(userInfo.getAge());
        userRepository.save(user);
        return ResponseEntity.ok(new UserInfo(user.getId(), user.getFirstName(), user.getLastName(), user.getAge()));
    }

    @PutMapping("/users/age/set-to-100")
    public ResponseEntity<Void> setAllAgesTo100() {
        List<UserEntity> users = userRepository.findAll();
        for (UserEntity user : users) {
            user.setAge(100);
            userRepository.save(user);
        }
        return ResponseEntity.ok().build();
    }
}